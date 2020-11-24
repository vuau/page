import { getData, domainMap } from '../src/stores.js'
import serialize from 'serialize-javascript'

const fs = require('fs')
const path = require('path')
const rawdata = fs.readFileSync(
  path.resolve(__dirname, '../dist/parcel-manifest.json')
)
const manifest = JSON.parse(rawdata)

module.exports = async (req, res) => {
  const Gun = require('@gooddollar/gun/gun')
  require('@gooddollar/gun/sea')
  require('@gooddollar/gun/lib/then')
  require('@gooddollar/gun/lib/promise')
  const gun = Gun({
    localStorage: false,
    peers: ['https://pensync.glitch.me/gun', 'https://pvaklb.ddns.net/gun']
  })

  let slug1
  let slug2
  let pub
  let blog
  let pages
  let page
  let isUseDomain = false
  const parts = req.url.split('/').filter(Boolean)
  console.log('parts', parts)
  if (!parts.length || parts.length === 1) {
    const domain = req.headers['x-forwarded-host'].split(':')[0]
    console.log('domain', domain)
    const domainInfo = domainMap[domain]
    console.log('domainInfo', domainInfo)
    pub = domainInfo.pub
    slug1 = domainInfo.slug
    slug2 = parts[0]
    isUseDomain = true
  }

  if (parts.length === 2) {
    slug1 = parts[0]
    pub = parts[1]
  }

  if (parts.length === 3) {
    slug1 = parts[0]
    slug2 = parts[1]
    pub = parts[2]
  }

  if (slug1) {
    ;({ blog, pages } = await getData({ slug: slug1, pub }, gun))
    console.log('blog', blog)
    console.log('pages', pages)
  }
  if (slug2) {
    page = await getData({ slug: slug2, pub }, gun)
  }

  res.write(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="shortcut icon" sizes="48x48" href="${
          manifest['images/favicon.ico']
        }">
        <script>window.localStorage.clear();</script>
        <script async="" src="${manifest['index.js']}"></script>
        <link rel="stylesheet" href="${
          manifest['../node_modules/tachyons/css/tachyons.css']
        }">
        <script>
          window.__DATA__=${serialize({ blog, pages, page })};
          window.isUseDomain = ${isUseDomain};
        </script>
        ${blog && blog.headerTag ? blog.headerTag : ''}
      </head>
      <body></body>
    </html>`)

  res.end()
}
