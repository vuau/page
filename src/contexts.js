import Gun from '@gooddollar/gun/gun'
import SEA from '@gooddollar/gun/sea'
import '@gooddollar/gun/lib/not'
import '@gooddollar/gun/lib/then'
import '@gooddollar/gun/lib/promise'

let gun

if (process.env.NODE_ENV === 'production') {
  gun = Gun(['https://pensync.glitch.me/gun', 'https://pvaklb.ddns.net/gun'])
} else {
  gun = Gun(['http://localhost:8765/gun'])
}

const gunUser = gun.user()

window.gun = gun
if (process.env.NODE_ENV !== 'production') {
  window.gunUser = gunUser
}

export { gun, gunUser, SEA }
