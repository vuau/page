require('@gooddollar/gun')
require('@gooddollar/gun/sea')
require('@gooddollar/gun/lib/then')
require('@gooddollar/gun/lib/promise')

import { getData, domainMap } from '../src/stores.js'
const fs = require('fs')
const path = require('path')
const rawdata = fs.readFileSync(
  path.resolve(__dirname, '../dist/parcel-manifest.json')
)
const manifest = JSON.parse(rawdata)

module.exports = async (req, res) => {
  let slug1, slug2, pub, blog, pages, page
  const parts = req.url.split('/').filter(Boolean)
  if (!parts.length || parts.length === 1) {
    const domain = req.headers['x-forwarded-host'].split(':')[0]
    const domainInfo = domainMap[domain]
    pub = domainInfo.pub
    slug1 = domainInfo.slug
    slug2 = parts[0]
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
    ;({ blog, pages } = await getData({ slug: slug1, pub }))
  }
  if (slug2) {
    page = await getData({ slug: slug2, pub })
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
          window.__DATA__=${JSON.stringify({ blog, pages, page })};
        </script>
        ${blog && blog.headerTag ? blog.headerTag : ''}
      </head>
      <body></body>
    </html>`)

  res.end()
}
