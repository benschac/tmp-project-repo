import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'

export function withAuth(handler: NextApiHandler) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const token = req.cookies.auth_token

    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    // Attach the token to the request for use in the handler
    req.authToken = token

    return handler(req, res)
  }
}

declare module 'next' {
  interface NextApiRequest {
    authToken?: string
  }
}
