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
import docs from './docs.json'
import classes from './classes.json'

interface Docs {
  version: string
  data: Array<{
    head: string
    list: Array<{
      title: string
      url: string
    }>
  }>
}

class TailwindCSSDoc implements ImmutableListTemplate {
  code = 'tailwindcss-doc'
  placeholder = '搜索文档，回车打开，Tailwind CSS ' + ((docs as Docs)).version.split('.').shift()
  list: Array<ImmutableListItem>

  constructor() {
    this.list = (docs as Docs).data.flatMap((item) =>
      item.list.map((subItem) => ({
        title: subItem.title,
        description: item.head,
        icon: 'logo.png',
        handler: () => {
          utools.shellOpenExternal(subItem.url)
          hideAndOutPlugin()
        }
      }))
    )
  }

  search(action: Action, searchWord: string, render: ListRenderFunction) {
    render(searchList(this.list, searchWord.split(/ +/), ['title', 'description']))
  }
}

interface Classes {
  version: string
  data: Array<{
    selector: string
    classes: string
  }>
}

interface ClassListItem extends ListItem {
  abbreviation: string
}

class TailwindCSSClass implements MutableListTemplate {
  code = 'tailwindcss-class'
  placeholder = '搜索类名，回车粘贴，Tailwind CSS v' + (classes as Classes).version
  $list: Array<ClassListItem>

  constructor() {
    this.$list = (classes as Classes).data.map((item) => ({
      title: item.selector,
      description: item.classes,
      abbreviation: item.selector
        .substring(1)
        .split('-')
        .map((item) => item[0] ?? '')
        .join(''),
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
      searchList<ClassListItem>(this.$list, searchWord.split(/ +/), [
        'title',
        'description',
        'abbreviation'
      ])
    )
  }

  select(action: Action, item: ListItem) {
    const className = item.title.substring(1)
    utools.hideMainWindowPasteText(className)
    utools.outPlugin()
  }
}

window.exports = templateBuilder()
  .immutableList(new TailwindCSSDoc())
  .mutableList(new TailwindCSSClass())
  .build()
