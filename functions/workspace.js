require('dotenv').config()
const axios = require('axios')
const { API_URL, API_KEY } = process.env

console.log(API_URL, API_KEY)

exports.handler = async function (event) {
  const options = JSON.parse(event.body)
  const { id = '', method, body } = options
  const { data } = await axios({
    method,
    url: `${API_URL}${id}`,
    headers: {
      'Content-Type': 'application/json',
      'x-username': API_KEY
    },
    data: body
  })
  return {
    statusCode: 200,
    body: JSON.stringify(data)
  }
}
