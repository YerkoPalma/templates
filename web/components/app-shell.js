/* global HTMLElement fetch */
import markdown from 'https://unpkg.com/md?module'

export default class Clock extends HTMLElement {
  get controller () {
    return this.getAttribute('controller')
  }
  set controller (value) {
    this.setAttribute('controller', value)
  }
  get default () {
    return this.getAttribute('default')
  }
  set default (value) {
    this.setAttribute('default', value)
  }
  constructor () {
    super()
    this.attachShadow({mode: 'open'})
  }
  connectedCallback () {
    const controller = document.querySelector(this.controller)
    const links = Array.from(controller.querySelectorAll('a[href]'))
    const template = document.createElement('template')
    const mdTemplate = md => {
      return `<style>
        :host {
          font-family: sans-serif;
        }
        :host div {
          padding-left: 2rem;
        }
      </style>
      <div>
        ${md}
      </div>
      `
    }
    links.forEach(link => {
      link.addEventListener('click', async e => {
        e.preventDefault()
        const target = e.target.href
        const NOT_FOUND_URL = 'content/404.html'
        let html
        let response
        try {
          response = await fetch(target)
          if (response && response.ok) {
            html = await response.text()
          } else {
            response = await fetch(NOT_FOUND_URL)
            html = await response.text()
          }
        } catch (ex) {
          response = await fetch(NOT_FOUND_URL)
          html = await response.text()
        }
        template.innerHTML = target.split('.').pop() === 'md' ?mdTemplate(markdown(html)) : html
        this.shadowRoot.innerHTML = ''
        this.shadowRoot.appendChild(template.content.cloneNode(true))
      })
    })
  }
}
