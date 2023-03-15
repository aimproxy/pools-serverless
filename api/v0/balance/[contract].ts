import { VercelRequest, VercelResponse } from '@vercel/node'

import { NonfungiblePositionManager__factory as INonFungiblePositionManager } from '../../../types'
import { NONFUNGIBLE_POSITION_MANAGER_ADDRESSES } from '../../../consts/uniswap/addresses'
import { SupportedChainId } from '@uniswap/sdk-core'
import { ethers } from 'ethers'

const RPC_HOST = 'https://mainnet.infura.io/v3/d45cd5f5f19b4ff8b6d00265ecb56a6b'

export default async (req: VercelRequest, res: VercelResponse) => {

  const contract = req.query.contract as string

  // Connect to mainnet (homestead) with no API key
  const provider = new ethers.JsonRpcProvider(RPC_HOST)

  // Is there uniswap v3 pools on this address?
  // @uniswap/v3-periphery/artifacts/contracts/NonfungiblePositionManager.sol/NonfungiblePositionManager.json

  // https://github.com/Uniswap/interface/blob/main/src/hooks/useContract.ts
  // https://github.com/Uniswap/interface/blob/main/src/hooks/useV3Positions.ts

  const wallet = INonFungiblePositionManager.connect(NONFUNGIBLE_POSITION_MANAGER_ADDRESSES[SupportedChainId.MAINNET], provider)
  const balance = await wallet.balanceOf(contract)

  res.status(200).json({
    [contract]: {
      balance: String(balance),
    },
  })
}