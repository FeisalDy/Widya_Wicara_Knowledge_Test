import Cookies from 'js-cookie'

export function setJWTToken (token: string) {
  Cookies.set('jwtToken', token, {
    httpOnly: false,
    secure: true,
    sameSite: 'strict',
    expires: 1 / 24
  })
}
