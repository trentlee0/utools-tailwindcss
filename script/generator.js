const fs = require('fs')
const path = require('path')
const css = require('css')

const tempOutput = path.join(__dirname, './output.css')
const file = fs.readFileSync(tempOutput, 'utf8')

const json = css
  .parse(file)
  .stylesheet.rules.filter((rule) => !!rule.selectors)
  .map((rule) => {
    if (!rule.selectors) {
      return
    }
    const selector = rule.selectors[0].replace('\\', '').split(' ')[0]
    const classes = css
      .stringify({ stylesheet: { rules: [rule] } })
      .split('\n')
      .slice(1, -1)
      .map((line) => line.trim())
      .join(' ')

    return {
      selector,
      classes
    }
  })

fs.writeFileSync(
  path.join(__dirname, '../src/classes.json'),
  JSON.stringify(json)
)

fs.rmSync(tempOutput)
