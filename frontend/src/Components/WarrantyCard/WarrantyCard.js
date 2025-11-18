import React, { useContext, useRef } from "react";
import { Progress } from "antd";
import WarrantyDetailsModal from "../WarrantyDetailsModal/WarrantyDetailsModal";
import { PeopleIcon } from "@primer/octicons-react";
import { UserContext } from "../../App";

const WarrantyCard = ({ warranty }) => {
  const warrantyDetailsModalRef = useRef();

  const { user } = useContext(UserContext);

  const callWarrantyDetailsModal = () => {
    if (warrantyDetailsModalRef.current) {
      warrantyDetailsModalRef.current.showLoading();
    }
  };

  const getStatusColor = () => {
    if (warranty.daysLeft === 0) return "#8b7dd6";
    if (warranty.daysLeft <= 30) return "#8fc5ff";
    if (warranty.daysLeft <= 90) return "#4a9fe7";
    return "#4dc0a7";
  };

  const getBackgroundGradient = () => {
    if (warranty.daysLeft === 0) return "linear-gradient(135deg, #f5f5ff 0%, #fcfcff 100%)";
    if (warranty.daysLeft <= 30) return "linear-gradient(135deg, #f0f7fe 0%, #f8fcff 100%)";
    if (warranty.daysLeft <= 90) return "linear-gradient(135deg, #e8f2ff 0%, #f5f9ff 100%)";
    return "linear-gradient(135deg, #eef9fb 0%, #f7feff 100%)";
  };

  return (
    <>
      <div
        className="warranty-card p-3 rounded-4 d-flex gap-3 align-items-center position-relative"
        style={{
          background: getBackgroundGradient(),
          maxWidth: "520px",
          minHeight: "140px",
          boxShadow: "0 4px 20px rgba(59, 130, 246, 0.1), 0 1px 3px rgba(59, 130, 246, 0.06)",
          cursor: "pointer",
          border: `1px solid ${getStatusColor()}25`,
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          transform: "translateY(0)",
          overflow: "hidden",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-4px)";
          e.currentTarget.style.boxShadow = "0 8px 30px rgba(59, 130, 246, 0.18), 0 2px 8px rgba(59, 130, 246, 0.1)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "0 4px 20px rgba(59, 130, 246, 0.1), 0 1px 3px rgba(59, 130, 246, 0.06)";
        }}
        onClick={callWarrantyDetailsModal}
      >
        {/* Decorative corner accent */}
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: "50px",
            height: "50px",
            background: `linear-gradient(225deg, ${getStatusColor()}15 0%, transparent 80%)`,
          }}
        />

        <div
          className="bg-white rounded-3 p-3 d-flex align-items-center justify-content-center position-relative"
          style={{
            width: "120px",
            height: "120px",
            flexShrink: 0,
            boxShadow: "0 2px 12px rgba(59, 130, 246, 0.12)",
            border: `2px solid rgba(147, 197, 253, 0.3)`,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "-50%",
              left: "-50%",
              width: "200%",
              height: "200%",
              background: `radial-gradient(circle, ${getStatusColor()}08 0%, transparent 60%)`,
            }}
          />
          <img
            src={`../../assets/img/${warranty.category.toLowerCase()}.png`}
            alt="product"
            style={{
              objectFit: "contain",
              width: "85%",
              height: "85%",
              filter: "drop-shadow(0 2px 8px rgba(0, 0, 0, 0.1))",
              transition: "transform 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.05)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
            }}
          />
        </div>

        <div className="p-2 w-100 h-100 d-flex flex-column justify-content-between">
          <div className="d-flex justify-content-between align-items-start">
            <div style={{ textAlign: "left" }}>
              <h6
                className="fw-bold m-0 p-0"
                style={{
                  color: "#475569",
                  fontSize: "18px",
                  letterSpacing: "-0.5px",
                  marginBottom: "4px"
                }}
              >
                {warranty.itemName}
              </h6>
              <span
                className="p-0 b-0"
                style={{
                  fontSize: "12px",
                  color: "#64748b",
                  fontWeight: "500",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px"
                }}
              >
                <span style={{
                  width: "6px",
                  height: "6px",
                  backgroundColor: getStatusColor(),
                  borderRadius: "50%",
                  display: "inline-block"
                }} />
                Expires on{" "}
                {warranty.expiresOn
                  .split("T")[0]
                  .split("-")
                  .reverse()
                  .join("/")}
              </span>
            </div>
            {user.userId !== warranty.addedBy && (
              <div
                style={{
                  backgroundColor: "rgba(147, 197, 253, 0.15)",
                  padding: "8px",
                  borderRadius: "8px",
                  color: "#64748b",
                  boxShadow: "0 1px 3px rgba(59, 130, 246, 0.12)",
                }}
              >
                <PeopleIcon size={16} />
              </div>
            )}
          </div>

          <div className="w-100" style={{ textAlign: "left", marginTop: "16px" }}>
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span
                style={{
                  fontSize: "13px",
                  fontWeight: "600",
                  color: warranty.daysLeft === 0 ? "#6c5ce7" : "#1e40af"
                }}
              >
                {warranty.daysLeft === 0
                  ? "⚠️ Warranty expired"
                  : `⏰ Expires in ${warranty.daysLeft} days`}
              </span>
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: "600",
                  color: "white",
                  backgroundColor: getStatusColor(),
                  padding: "4px 8px",
                  borderRadius: "12px",
                  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.2)",
                }}
              >
                {warranty.percentage}%
              </span>
            </div>
            <Progress
              percent={warranty.percentage}
              status={warranty.daysLeft === 0 ? "exception" : "active"}
              format={() => ""}
              strokeColor={getStatusColor()}
              trailColor="rgba(0, 0, 0, 0.06)"
              strokeWidth={6}
              style={{
                marginBottom: 0,
              }}
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
