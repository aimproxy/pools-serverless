import {Address, configureChains, createClient, fetchToken, readContracts} from "@wagmi/core";
import express from 'express';
import zip from 'lodash.zip';

import {chains} from "./chains";
import {providers} from "./providers";
import {uniswapV3ABI} from "./protocols/uniswap-v3";

const app = express();

app.use(express.json());

const {provider} = configureChains(chains, providers)
createClient({
    autoConnect: true,
    provider,
})

app.get(`/`, async (req, res) => {
    const contract = "0x8ad599c3A0ff1De082011EFDDc58f1908eb6e6D8"

    const functions = ['token0', 'token1', 'liquidity', 'protocolFees']
    const outputs = await readContracts({
        allowFailure: true,
        contracts: functions.map((fn) => ({
            address: contract as Address,
            abi: uniswapV3ABI,
            functionName: fn,
        }) as const)
    })

    const zipped = Object.fromEntries(zip(functions, outputs))
    const token0 = await fetchToken({address: zipped.token0 as Address})
    const token1 = await fetchToken({address: zipped.token1 as Address})

    return res.status(200).json({
        [contract]: {
            pair: `${token0.symbol}/${token1.symbol}`,
            ...zipped
        },
        'etherscan.io': `https://etherscan.io/address/${contract}`
    })
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on Port: ${port}`));