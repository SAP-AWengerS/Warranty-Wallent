import React, { useContext, useRef, useState } from "react";
import {
  EditOutlined,
  EllipsisOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { Progress } from "antd";
import WarrantyDetailsModal from "../WarrantyDetailsModal/WarrantyDetailsModal";
import { PeopleIcon } from "@primer/octicons-react";
import { UserContext } from "../../App";

const WarrantyCard = ({ warranty }) => {
  const [loading, setLoading] = useState(false);
  const warrantyDetailsModalRef = useRef();

  const { user } = useContext(UserContext);

  const callWarrantyDetailsModal = () => {
    if (warrantyDetailsModalRef.current) {
      warrantyDetailsModalRef.current.showLoading();
    }
  };

  return (
    <>
      <div
        className="warranty-card p-2 rounded d-flex gap-3 align-items-center"
        style={{
          background: "#00348a1f",
          maxWidth: "500px",
          boxShadow: "3px 4px 2px 2px #f6f6f6",
          cursor: "pointer",
        }}
        onClick={callWarrantyDetailsModal}
      >
        <div
          className="bg-white rounded p-3 d-flex align-items-center justify-content-center"
          style={{
            width: "120px",
            height: "120px",
            backgroundColor: "#f0f0f0",
            flexShrink: 0,
          }}
        >
          <img
            src={`../../assets/img/${warranty.category.toLowerCase()}.png`}
            alt="product"
            style={{
              objectFit: "contain",
              width: "100%",
              height: "100%",
            }}
          />
        </div>
        <div className="p-2 w-100 h-100 d-flex flex-column justify-content-between">
          <div className="d-flex justify-content-between">
            <div style={{ textAlign: "left" }}>
              <h6 className="fw-bold m-0 p-0">{warranty.itemName}</h6>
              <span className="p-0 b-0 text-secondary" style={{ fontSize: 11 }}>
                Expires on{" "}
                {warranty.expiresOn
                  .split("T")[0]
                  .split("-")
                  .reverse()
                  .join("/")}
              </span>
            </div>
            {user.userId != warranty.addedBy && (
              <div>
                <PeopleIcon />
              </div>
            )}
          </div>
          <div className="w-100" style={{ textAlign: "left" }}>
            <span style={{ fontSize: 12, fontWeight: "bold" }}>
              {warranty.daysLeft === 0
                ? "Warranty expired"
                : `Expires in ${warranty.daysLeft} days`}
            </span>
            <Progress
              percent={warranty.percentage}
              status={warranty.daysLeft === 0 ? "exception" : "active"}
              format={warranty.daysLeft === 0 ? "" : () => ""}
              strokeColor={warranty.daysLeft === 0 ? "red" : "#00348a"}
            />
          </div>
        </div>
      </div>
      <WarrantyDetailsModal
        ref={warrantyDetailsModalRef}
        warrantyDetails={warranty}
      />
    </>
  );
};

export default WarrantyCard;
