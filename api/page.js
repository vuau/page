const fs = require('fs')
const path = require('path')
const rawdata = fs.readFileSync(
  path.resolve(__dirname, '../dist/parcel-manifest.json')
)
const manifest = JSON.parse(rawdata)

module.exports = async (req, res) => {
  console.log(req.url)
  res.write(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="shortcut icon" sizes="48x48" href="${manifest['images/favicon.ico']}">
        <script>window.localStorage.clear();</script>
        <script async="" src="${manifest['index.js']}"></script>
        <link rel="stylesheet" href="${manifest['../node_modules/tachyons/css/tachyons.css']}">
        <script>
          alert('from server');
        </script>
      </head>
      <body></body>
    </html>`)

  res.end()
}
