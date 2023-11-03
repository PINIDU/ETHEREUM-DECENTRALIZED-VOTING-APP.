import '@/styles/globals.css'

import { VotingProvider } from '../../context/Voter';

export default function App({ Component, pageProps }) {
  return (
    <VotingProvider>
      <div>
        <Component {...pageProps} />
      </div>
    </VotingProvider>

  )
}
