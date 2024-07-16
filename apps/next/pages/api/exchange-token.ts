import { NextApiRequest, NextApiResponse } from 'next'
import { RecurseCenter } from 'recurse-center'
import { config } from 'lib/recurse-center'

const rcClient = new RecurseCenter(config)

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { code } = req.body

  if (typeof code !== 'string') {
    return res.status(400).json({ error: 'Invalid authorization code' })
  }

  try {
    const tokenResponse = await rcClient.exchangeCodeForTokens(code)

    // Combine access_token and refresh_token into a single string
    const combinedToken = JSON.stringify({
      access_token: tokenResponse.access_token,
      refresh_token: tokenResponse.refresh_token
    })

    // Set HTTP-Only cookie with combined token
    res.setHeader(
      'Set-Cookie',
      `auth_token=${encodeURIComponent(combinedToken)}; HttpOnly; Path=/; Max-Age=604800; SameSite=Strict${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`
    )

    res.status(200).json({ success: true })
  } catch (error) {
    console.error('Error exchanging code for tokens:', error)
    res.status(500).json({ error: 'Token exchange failed' })
  }
}
