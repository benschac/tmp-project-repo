import Cookies from 'js-cookie'

export const setAuthToken = (token: string) => {
  console.log('token', token, 'is set')
  Cookies.set('auth_token', token, { expires: 7, sameSite: 'strict' })
  console.log('Cookies.get', Cookies.get('auth_token'))
}

export const getAuthToken = () => {
  return Cookies.get('auth_token')
}

export const removeAuthToken = () => {
  Cookies.remove('auth_token')
}
