import { NextApiRequest, NextApiResponse } from 'next'
import { RecurseCenter } from 'recurse-center'
import { config } from 'lib/recurse-center'
import { parse } from 'cookie'

const rcClient = new RecurseCenter(config)

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const cookies = parse(req.headers.cookie ?? '')

    if (!cookies.auth_token) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    const { access_token, refresh_token } = JSON.parse(decodeURIComponent(cookies.auth_token))

    if (!access_token || !refresh_token) {
      return res.status(401).json({ error: 'Invalid token' })
    }

    const profiles = await rcClient.getProfiles({
      token: access_token,
      refreshToken: refresh_token,
    })

    res.status(200).json(profiles)
  } catch (error) {
    console.error('Error fetching profiles:', error)
    res.status(500).json({ error: 'Failed to fetch profiles' })
  }
}

export default handler
