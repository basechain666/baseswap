import React from "react";
import { PancakeStack, PancakeInput, PancakeLabel } from "./StyledPancakeToggle";
import { PancakeToggleProps, scales } from "./types";

const PancakeToggle: React.FC<React.PropsWithChildren<PancakeToggleProps>> = ({
  checked,
  scale = scales.LG,
  ...props
}) => (
  <PancakeStack scale={scale}>
    <PancakeInput id={props.id || "base-toggle"} scale={scale} type="checkbox" checked={checked} {...props} />
    <PancakeLabel scale={scale} checked={checked} htmlFor={props.id || "base-toggle"}>
      <div className="pancakes">
        <div className="base" />
        <div className="base" />
        <div className="base" />
        <div className="butter" />
      </div>
    </PancakeLabel>
  </PancakeStack>
);

export default PancakeToggle;
