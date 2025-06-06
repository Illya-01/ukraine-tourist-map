import axios from 'axios'

// TODO: Replace with actual API base URL
const API_BASE_URL = 'https://api.example.com'

export const fetchData = async (endpoint: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${endpoint}`)
    return response.data
  } catch (error) {
    console.error('Error fetching data:', error)
    throw error
  }
}

export const postData = async (endpoint: string, data: unknown) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/${endpoint}`, data)
    return response.data
  } catch (error) {
    console.error('Error posting data:', error)
    throw error
  }
}
