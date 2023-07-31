import { NextApiRequest, NextApiResponse } from 'next'
import handler from '../checkout_sessions'

export async function POST(req: NextApiRequest, res: NextApiResponse) {
    return handler(req, res)
}
