import React, { useState } from "react";
import { Button, Divider, Space } from "antd";
import { MenuFoldOutlined } from "@ant-design/icons";
import { PersonIcon } from "@primer/octicons-react";
import ProfileDrawer from "../ProfileDrawer/ProfileDrawer";
import NotificationDrawer from "../NotificationDrawer/NotificationDrawer";

const NavBar = () => {
  const [navOpen, setNavOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const showNavDrawer = () => {
    setNavOpen(true);
  };

  const showProfileDrawer = () => {
    setProfileOpen(true);
  };

  return (
    <div className="mb-4">
      <Space className="p-3 pb-0 w-100 rounded-3 d-flex justify-content-between align-items-center">
        <div>
          <b className="fw-800 fs-3" style={{ color: "#00348a" }}>
            Warranty Wallet
          </b>
        </div>
        <div className="d-flex align-items-center gap-4">
          <Button
            type="dark"
            className="p-2"
            style={{
              border: "1px solid #00348a",
              borderRadius: "160px",
              height: "40px",
              width: "40px",
            }}
            onClick={showNavDrawer}
          >
            <MenuFoldOutlined style={{ color: "#00348a", fontSize: 18 }} />
          </Button>
          <Button
            type="dark"
            className="p-2"
            style={{
              border: "1px solid #00348a",
              borderRadius: "160px",
              height: "40px",
              width: "40px",
            }}
            onClick={showProfileDrawer}
          >
            <PersonIcon fill={"#00348a"} size={24} />
          </Button>
        </div>
      </Space>

      <NotificationDrawer navOpen={navOpen} setNavOpen={setNavOpen} />
      <ProfileDrawer
        profileOpen={profileOpen}
        setProfileOpen={setProfileOpen}
      />
      <Divider
        style={{
          borderColor: "#ddd",
        }}
      ></Divider>
    </div>
  );
};

export default NavBar;
