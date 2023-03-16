import { VercelRequest, VercelResponse } from '@vercel/node'

export default async (req: VercelRequest, res: VercelResponse) => {
  res.status(200).json({
    uniswap: {
      v2: {
        params: {
          0: 'lp owner contract',
          1: 'lp contract',
        },
        pool: '/api/uniswap/v2/pool/0xab0b79f8357cba2c33a6d2815b85c7624959fea7/0x0d4a11d5eeaac28ec3f61d100daf4d40471f1852',
      },
    },
    pool: '/api/v0/pool/0x8ad599c3A0ff1De082011EFDDc58f1908eb6e6D8',
    balance: '/api/v0/balance/0x1a9C8182C09F50C8318d769245beA52c32BE35BC',
  })
}