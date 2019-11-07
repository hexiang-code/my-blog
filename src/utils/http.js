import axios from 'axios'
const baseUrl = 'http://localhost:3000/api/'

const request = axios.create({
    url: baseUrl,
    imeout: 3000,
    withCredentials: false,
})


export default request