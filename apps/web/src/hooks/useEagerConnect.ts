import { useConfig, useConnect } from 'wagmi'
import { useEffect } from 'react'
import { isCyberWallet } from '@cyberlab/cyber-app-sdk'

import { CHAINS } from 'config/chains'
import { cyberWalletConnector } from 'utils/wagmi'

const useEagerConnect = () => {
  const config = useConfig()
  const { connectAsync, connectors } = useConnect()
  useEffect(() => {
    if (!(typeof window === 'undefined') && window?.parent !== window && isCyberWallet() && cyberWalletConnector) {
      connectAsync({ connector: cyberWalletConnector as any }).catch(() => {
        config.autoConnect()
      })
      return
    }

    if (
      !(typeof window === 'undefined') &&
      window?.parent !== window &&
      // @ts-ignore
      !window.cy
    ) {
      import('wagmi/connectors/safe').then(({ SafeConnector }) => {
        const safe = new SafeConnector({ chains: CHAINS })
        connectAsync({ connector: safe }).catch(() => {
          config.autoConnect()
        })
      })
      return
    }

    config.autoConnect()
  }, [config, connectAsync, connectors])
}

export default useEagerConnect
