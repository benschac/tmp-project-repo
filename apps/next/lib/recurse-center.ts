import { OAuth2Config, RecurseCenter } from 'recurse-center' // Adjust import path as needed

export const config: OAuth2Config = {
  // TODO: this is test burner2
  clientId: 'lYxmn-I2EQStfAquOLGr53pkzqru30EYQvBGACG3PMU',
  clientSecret: '0A7VUfrgkpFMUx0u_jaCESTDT7XiKbGD2nzD03-d1I0',
  redirectUri: 'http://localhost:3000',
  authorizationEndpoint: 'https://www.recurse.com/oauth/authorize',
  tokenEndpoint: 'https://www.recurse.com/oauth/token',
  scope: 'public',
  apiBaseUrl: 'https://www.recurse.com',
}

export const rcClient = new RecurseCenter(config)
