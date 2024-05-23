const superagent = require('superagent')
const cheerio = require('cheerio')
const fs = require('fs')
const path = require('path')

const url = 'https://tailwindcss.com/docs/installation'
superagent.get(url).end((err, res) => {
  if (err) throw err
  const html = res.text

  const $ = cheerio.load(html)
  const version = $('#__next button').first().text()
  const data = []
  $('#nav>ul>li[class]').each((i, el) => {
    const head = $(el).find('h5').text()
    const list = []
    $(el)
      .find('ul>li a')
      .each((j, subEl) => {
        const title = $(subEl).text()
        const href = $(subEl).attr('href')
        if (!href) throw new Error(title, 'href is null')
        list.push({
          title,
          url: href?.startsWith('http') ? href : 'https://tailwindcss.com' + href
        })
      })
    data.push({ head, list })
  })
  fs.writeFileSync(
    path.join(__dirname, '../src/docs.json'),
    JSON.stringify({ version, data }, null, 2),
    { encoding: 'utf8' }
  )
})
