import 'core-js/stable'
import 'regenerator-runtime/runtime'

import 'tachyons'
import './water.css'

import App from './App.svelte'

window.localStorage.clear()

const app = new App({
  target: document.body
})

export default app
