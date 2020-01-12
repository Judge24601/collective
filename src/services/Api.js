import axios from 'axios'

export default() => {
  return axios.create({
    baseURL: `http://13.64.248.29:8081`
  })
}
