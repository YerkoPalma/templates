var Markdown = require('markdown-it')
var twemoji = require('twemoji')
var Highlight = require('highlight-syntax')
var highlight = Highlight([ require('highlight-syntax/js') ])
var md = Markdown('default', {
  html: true,
  highlight: function (str, lang) {
    if (lang) {
      try {
        return highlight(str, { lang: lang })
      } catch (__) {}
    }

    return ''
  }
})
var defaultRender = function (tokens, idx, options, env, self) {
  return self.renderToken(tokens, idx, options)
}
function paragraph_open (tokens, idx, options, env, self) { // eslint-disable-line camelcase
  var aIndex = tokens[idx].attrIndex('class')
  if (aIndex < 0) {
    tokens[idx].attrPush(['class', 'f4 f2-ns lh-copy georgia mv0'])
  } else {
    tokens[idx].attrs[aIndex][1] = 'f4 f2-ns lh-copy georgia mv0'
  }
  return defaultRender(tokens, idx, options, env, self)
}
function list_item_open (tokens, idx, options, env, self) { // eslint-disable-line camelcase
  var aIndex = tokens[idx].attrIndex('class')
  if (aIndex < 0) {
    tokens[idx].attrPush(['class', 'f4 f2-ns lh-copy georgia'])
  } else {
    tokens[idx].attrs[aIndex][1] = 'f4 f2-ns lh-copy georgia'
  }
  return defaultRender(tokens, idx, options, env, self)
}
function link_open (tokens, idx, options, env, self) { // eslint-disable-line camelcase
  var aIndex = tokens[idx].attrIndex('class')
  if (aIndex < 0) {
    tokens[idx].attrPush(['class', 'link pointer bb b--dashed bt-0 bl-0 br-0 bw2 bg-animate hover-bg-light-red b--light-red black'])
  } else {
    tokens[idx].attrs[aIndex][1] = 'link pointer bb b--dashed bt-0 bl-0 br-0 bw2 bg-animate hover-bg-light-red b--light-red black'
  }
  return defaultRender(tokens, idx, options, env, self)
}
function blockquote_open (tokens, idx, options, env, self) { // eslint-disable-line camelcase
  var aIndex = tokens[idx].attrIndex('class')
  if (aIndex < 0) {
    tokens[idx].attrPush(['class', 'i pl4 bl bw1 b--light-red mb4'])
  } else {
    tokens[idx].attrs[aIndex][1] = 'i pl4 bl bw1 b--light-red mb4'
  }
  return defaultRender(tokens, idx, options, env, self)
}
function image (tokens, idx, options, env, self) { // eslint-disable-line camelcase
  var aIndex = tokens[idx].attrIndex('class')
  if (aIndex < 0) {
    tokens[idx].attrPush(['class', 'mw-100 w-50-ns w-100 db center'])
  } else {
    tokens[idx].attrs[aIndex][1] = 'mw-100 w-50-ns w-100 db center'
  }
  return defaultRender(tokens, idx, options, env, self)
}
function fence (tokens, idx, options, env, self) { // eslint-disable-line camelcase
  var token = tokens[idx]
  var info = token.info ? md.utils.unescapeAll(token.info).trim() : ''
  var langName = ''
  var highlighted, i, tmpAttrs, tmpToken

  if (info) {
    langName = info.split(/\s+/g)[0]
  }

  if (options.highlight) {
    highlighted = options.highlight(token.content, langName) || md.utils.escapeHtml(token.content)
  } else {
    highlighted = md.utils.escapeHtml(token.content)
  }

  if (highlighted.indexOf('<pre') === 0) {
    return highlighted + '\n'
  }

  if (info) {
    i = token.attrIndex('class')
    tmpAttrs = token.attrs ? token.attrs.slice() : []

    if (i < 0) {
      tmpAttrs.push([ 'class', options.langPrefix + langName ])
    } else {
      tmpAttrs[i][1] += ' ' + options.langPrefix + langName
    }

    // Fake token just to render attributes
    tmpToken = {
      attrs: tmpAttrs
    }

    return '<pre class="near-white bg-mid-gray overflow-x-visible-ns overflow-x-scroll pa3"><code' + self.renderAttrs(tmpToken) + '>' +
           highlighted +
          '</code></pre>\n'
  }

  return '<pre class="near-white bg-mid-gray overflow-x-visible-ns overflow-x-scroll pa3"><code' + self.renderAttrs(token) + '>' +
      highlighted +
      '</code></pre>\n'
}
function heading_open (tokens, idx, options, env, self) { // eslint-disable-line camelcase
  var aIndex = tokens[idx].attrIndex('class')
  var level = parseInt(tokens[idx].tag.slice(-1))
  if (level === 1) level = '-subheadline-ns f1 word-wrap lh-title mb2 mt0'

  if (aIndex < 0) {
    tokens[idx].attrPush(['class', 'f' + level])
  } else {
    tokens[idx].attrs[aIndex][1] = 'f' + level
  }
  return defaultRender(tokens, idx, options, env, self)
}
function emoji (token, idx) {
  return twemoji.parse(token[idx].content)
}

module.exports = function (text) {
  md.use(require('markdown-it-meta'))
  md.use(require('markdown-it-emoji'))
  var rules = {
    paragraph_open,
    list_item_open,
    link_open,
    image,
    heading_open,
    blockquote_open,
    fence,
    emoji
  } // eslint-disable-line
  for (var rule in rules) {
    md.renderer.rules[rule] = rules[rule]
  }
  var rendered
  if (typeof document !== 'undefined') {
    var div = document.createElement('div')
    div.innerHTML = md.render(text)
    rendered = div
  } else {
    rendered = md.render(text)
  }
  var meta = md.meta
  return {
    render: rendered,
    meta
  }
}