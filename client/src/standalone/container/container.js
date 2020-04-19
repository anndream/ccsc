import React from "react";

import "./container.css";

export default ({ noPadding, noBackground, style, ...rest }) => (
  <div
    {...rest}
    style={{
      padding: noPadding ? 0 : "3rem 10rem",
      backgroundColor: noBackground ? "none" : "#f4f5f7",
      ...style,
    }}
  />
);