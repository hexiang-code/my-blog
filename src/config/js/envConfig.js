let httpBaseUrl, wsBaseUrl
if (process.env.NODE_ENV == 'development') {
  httpBaseUrl = 'http://localhost:3000/api/'
  wsBaseUrl = 'ws://localhost:3000'
}

if (process.env.NODE_ENV == 'production') {
  httpBaseUrl = 'https://api.hexiangzone.cn/api'
  wsBaseUrl = 'wss://api.hexiangzone.cn'
}

export { wsBaseUrl, httpBaseUrl } 