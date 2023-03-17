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
  })
}