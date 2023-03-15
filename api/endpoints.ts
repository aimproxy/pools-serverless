import { VercelRequest, VercelResponse } from '@vercel/node'

export default async (req: VercelRequest, res: VercelResponse) => {
  res.status(200).json({
    pool: '/api/v0/pool/0x8ad599c3A0ff1De082011EFDDc58f1908eb6e6D8',
    balance: '/api/v0/balance/0x1a9C8182C09F50C8318d769245beA52c32BE35BC',
  })
}