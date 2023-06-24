import {
  ImmutableListItem,
  ImmutableListTemplate,
  hideAndOutPlugin,
  templateBuilder,
  searchList,
  Action,
  ListRenderFunction,
  MutableListTemplate,
  ListItem
} from 'utools-utils'
import tailwindcss from './tailwindcss'
import classes from './classes.json'

class TailwindCSSDoc implements ImmutableListTemplate {
  code = 'tailwindcss-doc'
  placeholder = '搜索文档，回车打开'
  list: Array<ImmutableListItem>

  constructor() {
    this.list = []
    for (const key in tailwindcss) {
      const items = tailwindcss[key]
      for (const item of items) {
        this.list.push({
          title: item.title,
          description: key,
          icon: 'logo.png',
          handler: () => {
            utools.shellOpenExternal(item.url)
            hideAndOutPlugin()
          }
        })
      }
    }
  }

  search(action: Action, searchWord: string, render: ListRenderFunction) {
    render(
      searchList(this.list, searchWord.split(/ +/), ['title', 'description'])
    )
  }
}

class TailwindCSSClass implements MutableListTemplate {
  code = 'tailwindcss-class'
  placeholder = '搜索类名，回车复制'
  $list: Array<ListItem>

  constructor() {
    this.$list = (
      classes as Array<{
        selector: string
        classes: string
      }>
    ).map((item) => ({
      title: item.selector,
      description: item.classes,
      handler: () => {
        utools.copyText(item.selector)
        hideAndOutPlugin()
      }
    }))
  }

  enter(action: Action, render: ListRenderFunction) {
    render(this.$list)
  }

  search(action: Action, searchWord: string, render: ListRenderFunction) {
    render(
      searchList(this.$list, searchWord.split(/ +/), ['title', 'description'])
    )
  }

  select(action: Action, item: ListItem) {
    utools.copyText(item.title)
    hideAndOutPlugin()
  }
}

window.exports = templateBuilder()
  .immutableList(new TailwindCSSDoc())
  .mutableList(new TailwindCSSClass())
  .build()
