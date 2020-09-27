const axios = require('axios');
const APIConfig = requre('./config.json').APIConfig
const baseURL = APIConfig.baseURL

const request = axios.create({
    baseURL: APIConfig.baseURL,
    timeout: 60000
})

async function fetchScores() {
    return await request.get(
        baseURL + '/scores'
    )
}

async function submitSatta(data) {
    return await request.post(
        baseURL + '/submitSatta', { data }
    )
}

async function login(data) {
    return await request.post(
        baseURL + '/login', { data }
    )
}