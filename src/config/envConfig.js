let httpBaseUrl, wsBaseUrl
if (process.env.NODE_ENV == 'development') {
  httpBaseUrl = 'http://localhost:3000/api/'
  wsBaseUrl = 'ws://localhost:3000'
}

if (process.env.NODE_ENV == 'production') {
  httpBaseUrl = 'http://api.hexiangzone.cn/api'
  wsBaseUrl = 'ws://api.hexiangzone.cn'
}

export {wsBaseUrl, httpBaseUrl } 