import { Divider, Drawer, FloatButton } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import React, { useContext, useEffect, useState } from "react";
import { VersionsIcon } from "@primer/octicons-react";
import NotificationCard from "../NotificationCard/NotificationCard";
import { UserContext } from "../../App";
import { Axios } from "../../Config/Axios/Axios";

const NotificationDrawer = ({ navOpen, setNavOpen }) => {
  const [isError, setIsError] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const onNavClose = () => {
    setNavOpen(false);
  };

  const { user } = useContext(UserContext);
  const token = localStorage.getItem("token");

  useEffect(() => {
    // setContentLoader(true);
    Axios.get(
      `/api/v1/app/warranty/getExpiringWarrantiesByUser/${user.userId}`,
      {
        params: {
          addedBy: user.userId,
        },
        headers: {
          authorization: `bearer ${token}`,
        },
      }
    )
      .then((res) => {
        setNotifications(res.data);
        // setContentLoader(false);
        console.log(res);
      })
      .catch((err) => {
        setIsError(true);
        // setContentLoader(false);
      });

    return () => {};
  }, []);

  return (
    <Drawer
      placement={"left"}
      closable={false}
      onClose={onNavClose}
      open={navOpen}
      style={{ padding: 0, height: "100vh" }}
      key={"left"}
    >
      <div className="w-100 d-flex flex-column justify-content-center mb-4">
        <b className="fs-4" style={{ color: "#808080" }}>
          Notifications
        </b>
      </div>

      <FloatButton
        shape="circle"
        type="dark"
        style={{
          insetInlineStart: 320,
          top: 16,
        }}
        onClick={onNavClose}
        icon={<CloseOutlined />}
      />
      {notifications.length>0 ? (
        notifications?.map((notification, index) => {
          return <NotificationCard notification={notification} key={index} />;
        })
      ) : (
        <b className="fs-5" style={{ color: "#d3d3d3" }}>
          You're all caught up!
        </b>
      )}
    </Drawer>
  );
};

export default NotificationDrawer;
