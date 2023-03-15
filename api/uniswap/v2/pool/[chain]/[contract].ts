import { VercelRequest, VercelResponse } from '@vercel/node'

export default async (req: VercelRequest, res: VercelResponse) => {

  const chain = req.query.chain as string
  const contract = req.query.contract as string

  // const pair = new Pair()
  // TODO Have UniswapV2 ABI from Etherscan
  res.status(200).json({
    chain,
    [contract]: {},
  })
}