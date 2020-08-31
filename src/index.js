import 'core-js/stable'
import 'regenerator-runtime/runtime'

import 'tachyons'

import App from './App.svelte'

const app = new App({
  target: document.body
})

export default app
