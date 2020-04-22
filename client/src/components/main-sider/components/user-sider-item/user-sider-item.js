import { Avatar, Dropdown, Menu } from "antd";
import { logoutUser } from "../../../../redux";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

import "./user-sider-item.css";

export default () => {
  const currentUser = useSelector((state) => state.user.currentUser);
  const dispatch = useDispatch();

  return (
    <Dropdown
      placement="topLeft"
      trigger={["click"]}
      overlay={
        <Menu>
          <Menu.Item>Perfil</Menu.Item>
          <Menu.Divider />
          <Menu.Item onClick={() => dispatch(logoutUser())}>
            Tanca la sessió
          </Menu.Item>
        </Menu>
      }
    >
      <div className="user-menu-item">
        <Avatar className="user-menu-item-avatar">
          {currentUser.nom[0] + currentUser.cognoms[0]}
        </Avatar>
        <span className="user-menu-item-name">
          {`${currentUser.nom} ${currentUser.cognoms}`}
        </span>
      </div>
    </Dropdown>
  );
};