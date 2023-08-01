import styled, { css } from 'styled-components'

export const HaloWrap = styled.span`
  position: fixed;
  height: 500px;
  width: 500px;
  z-index: -1000;
`
export const BlueHalo = styled.span`
  position: absolute;
  height: 500px;
  width: 500px;
  background-color: #3c00ff;
  border-radius: 50%;
  transform-origin: 100px;
  animation: halo 10s linear infinite;
  animation-duration: 8s;
  animation-direction: reverse;
  mix-blend-mode: plus-lighter;
  filter: blur(300px);
`
export const RedHalo = styled.span`
  position: absolute;
  height: 200px;
  width: 200px;
  background-color: #ec6eff;
  border-radius: 50%;
  transform-origin: 100px;
  animation: halo 10s linear infinite;
  animation-duration: 5s;
  mix-blend-mode: plus-lighter;
  filter: blur(100px);
`
