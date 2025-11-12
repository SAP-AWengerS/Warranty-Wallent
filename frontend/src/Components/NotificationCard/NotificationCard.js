import { MessageTwoTone } from "@ant-design/icons";
import React from "react";
import { Axios } from "../../Config/Axios/Axios";

const NotificationCard = ({notification}) => {
  return (
    <div className="p-3 rounded mb-3" style={{ background: "#eee" }}>
      <div className="d-flex gap-2">
        <MessageTwoTone style={{ fontSize: 16 }} />
        <b style={{ fontSize: 13 }}>Expiry Alert!</b>
      </div>
      <div className="mt-1">
      <span style={{fontSize:12}}>Your {notification.itemName} warranty expires in just {notification.daysLeft} days—don't miss out on coverage!</span>
      </div>
    </div>
  );
};

export default NotificationCard;
