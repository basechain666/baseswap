
import Swap from '../views/Swap'

const IndexPage = ({ totalTx30Days, addressCount30Days, tvl }) => {
  return (
    // <SWRConfig
    //   value={{
    //     fallback: {
    //       totalTx30Days,
    //       addressCount30Days,
    //       tvl,
    //     },
    //   }}
    // >
      <Swap />
    // </SWRConfig>
  )
}


IndexPage.chains = []

export default IndexPage
