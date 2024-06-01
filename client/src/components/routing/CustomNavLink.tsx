import React from "react";
import { useLocation, NavLink } from "react-router-dom";

export const CustomNavLink = ({
  to,
  children,
  activeClassName,
  ...props
}: {
  to: string;
  children: React.ReactNode;
  activeClassName: string;
  className?: string;
}) => {
  let location = useLocation();
  let isActive;
  if (to.endsWith("admin")) {
    isActive = location.pathname.endsWith("admin");
  } else {
    isActive =
      location.pathname.startsWith(to) && !location.pathname.endsWith("admin");
  }
  let combinedProps = {
    ...props,
    className:
      (isActive ? activeClassName : "") + " " + (props.className || ""),
  };
  return (
    <NavLink to={to} {...combinedProps}>
      {children}
    </NavLink>
  );
};
