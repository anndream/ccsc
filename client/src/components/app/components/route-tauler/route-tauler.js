import React from "react";
import { useSelector } from "react-redux";
import { Redirect, Route, useLocation } from "react-router-dom";

export default ({ component, ...rest }) => {
  const user = useSelector(({ user }) => user.currentUser);
  const Component = component;
  const prevLocation = useLocation();

  return (
    <Route
      {...rest}
      render={() =>
        user.hasOwnProperty("id") ? (
          <Component />
        ) : (
          <Redirect
            replace
            to={{
              pathname: "/inicia-sessio",
              state: { prevLocation },
            }}
          />
        )
      }
    />
  );
};
