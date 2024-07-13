import { Profile } from './../src/types'
import readline from 'readline'
import { OAuth2Config } from '../dist/index.mjs'
import { RecurseCenter } from '../src'

const config: OAuth2Config = {
  clientId: 'tG7GqaULTLEm1CucOIOvc0jn0DDmes5Xi8ferrXKSAc',
  clientSecret: 'aAG8j8cKwgmaSs1FPpk2ofcUqiQ4HBjKL1f9UH7062c',
  redirectUri: 'urn:ietf:wg:oauth:2.0:oob',
  authorizationEndpoint: 'https://www.recurse.com/oauth/authorize',
  tokenEndpoint: 'https://www.recurse.com/oauth/token',
  scope: 'public',
  apiBaseUrl: 'https://www.recurse.com',
}

const client = new RecurseCenter(config)

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

async function promptUser(question: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer)
    })
  })
}

async function main() {
  try {
    // Step 1: Get authorization URL
    const authUrl = client.getAuthorizationUrl()
    console.log('Please visit this URL to authorize the application:')
    console.log(authUrl)

    // Step 2: Get the authorization code from the user
    const authCode = await promptUser('Enter the authorization code: ')

    // Step 3: Exchange the code for tokens
    await client.exchangeCodeForTokens(authCode)
    console.log('Authentication successful!')

    // Step 4: Use the API to get profiles
    const profiles = await client.getProfiles()
    console.log(`Retrieved ${profiles.length} profiles.`)

    // Display some information about the first few profiles
    profiles.slice(0, 5).forEach((profile: Profile) => {
      console.log(`\nName: ${profile.name}`)
      console.log(`Email: ${profile.email}`)
      console.log(`GitHub: ${profile.github}`)
      console.log(`Current batch: ${profile.stints[0]?.batch?.name || 'N/A'}`)
    })

    // Step 5: Search for profiles
    const searchQuery = await promptUser(
      'Enter a search query (or press Enter to skip): '
    )
    if (searchQuery) {
      const searchResults = await client.getProfiles(searchQuery)
      console.log(
        `\nFound ${searchResults.length} profiles matching "${searchQuery}"`
      )
      searchResults.slice(0, 3).forEach((profile) => {
        console.log(`\nName: ${profile.name}`)
        console.log(`Bio: ${profile.bio_truncated}`)
      })
    }
  } catch (error) {
    console.error('An error occurred:', error)
  } finally {
    rl.close()
  }
}

main()
  .catch(console.error)
  .finally(() => rl.close())
