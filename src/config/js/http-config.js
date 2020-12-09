import { isDev, isProd } from './env-config'

let httpBaseUrl, wsBaseUrl
if (isDev) {
  httpBaseUrl = 'http://localhost:3000/api/'
  wsBaseUrl = 'ws://localhost:3000'
}

if (isProd) {
  httpBaseUrl = 'https://api.hexiangzone.cn/api/'
  wsBaseUrl = 'wss://api.hexiangzone.cn'
}

export { wsBaseUrl, httpBaseUrl }
