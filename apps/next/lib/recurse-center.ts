import { OAuth2Config, RecurseCenter } from 'recurse-center' // Adjust import path as needed

export const config: OAuth2Config = {
  clientId: '',
  clientSecret: '',
  redirectUri: 'http://localhost:3000',
  authorizationEndpoint: 'https://www.recurse.com/oauth/authorize',
  tokenEndpoint: 'https://www.recurse.com/oauth/token',
  scope: 'public',
  apiBaseUrl: 'https://www.recurse.com',
}

export const rcClient = new RecurseCenter(config)
