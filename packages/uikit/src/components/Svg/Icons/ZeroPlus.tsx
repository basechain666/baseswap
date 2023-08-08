import * as React from "react";
import Svg from "../Svg";
import { SvgProps } from "../types";

// const zeroPlus = require("./0plus.png")
const Icon: React.FC<React.PropsWithChildren<SvgProps>> = (props) => {
  return (
    <img src="/0plus.png" style={{width: "20px"}}/>
  );
};

export default Icon;
