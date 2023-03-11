import express from 'express';
import {Address, configureChains, createClient, readContracts} from "@wagmi/core";
import zip from 'lodash.zip'

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

    const functions = ['token0', 'token1', 'liquidity']
    const balances = await readContracts({
        allowFailure: true,
        contracts: functions.map((fn) => ({
            address: contract as Address,
            abi: uniswapV3ABI,
            functionName: fn,
        }) as const)
    })

    const zipped = zip(functions, balances)
    return res.status(200).json({
        [contract]: {
            ...Object.fromEntries(zipped)
        },
        etherscan: `https://etherscan.io/address/${contract}`
    })
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on Port: ${port}`));