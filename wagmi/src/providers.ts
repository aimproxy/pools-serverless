import type {ChainProviderFn} from "@wagmi/core";
import {publicProvider} from "@wagmi/core/providers/public";

export const providers: ChainProviderFn[] = [
    publicProvider({
        priority: 1,
    }),
]