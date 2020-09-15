import Gun from '@gooddollar/gun/gun'
import SEA from '@gooddollar/gun/sea'
import '@gooddollar/gun/lib/not'
import '@gooddollar/gun/lib/then'

let gun

if (process.env.NODE_ENV === 'production') {
  gun = Gun(['https://pensync.glitch.me/gun'])
} else {
  gun = Gun(['http://localhost:8765/gun'])
}

const gunUser = gun.user()

window.gun = gun
if (process.env.NODE_ENV !== 'production') {
  window.gunUser = gunUser
}

export { gun, gunUser, SEA }
