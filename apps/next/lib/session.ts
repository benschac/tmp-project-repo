import { IronSession, getIronSession, type SessionOptions } from 'iron-session'
import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'
import { TokenResponse } from 'recurse-center'

export interface NextApiRequestWithSession extends NextApiRequest {
  session?: IronSession<TokenResponse>
}
// TODO: get better session password
export const sessionOptions: SessionOptions = {
  password:
    process.env.SECRET_COOKIE_PASSWORD ??
    ('big-scary-thing-here-very-insecure' as string),
  cookieName: 'recurse-center-session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
  },
}
export function withSession(handler: NextApiHandler): NextApiHandler {
  return async (req: NextApiRequestWithSession, res: NextApiResponse) => {
    req.session = await getIronSession<TokenResponse>(req, res, sessionOptions)
    return handler(req, res)
  }
}

// This is where we specify the typings of req.session.*
declare module 'iron-session' {
  interface IronSessionData {
    accessToken?: string
  }
}
