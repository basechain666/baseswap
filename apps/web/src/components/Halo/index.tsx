import { FC, useState } from 'react'
import { HaloWrap, BlueHalo, RedHalo } from './style'

const Halo: FC = () => {
  return (
    <>
      {/* <HaloWrap style={{ left: '20%', top: '150px' }}>
        <BlueHalo />
        <RedHalo />
      </HaloWrap> */}

      <HaloWrap style={{ right: '0px', top: '0' }}>
        <BlueHalo />
        <RedHalo />
      </HaloWrap>
    </>
  )
}
export default Halo
