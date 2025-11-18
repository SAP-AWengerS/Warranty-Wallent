import React, { forwardRef, useImperativeHandle, useState } from "react";
import { Button, Modal } from "antd";
import { MailIcon } from "@primer/octicons-react";
import { Link } from "react-router-dom";

const GetHelpModal = forwardRef(({}, ref) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  useImperativeHandle(ref, () => ({
    showModal,
  }));

  return (
    <>
      <Modal
        title="Get Help"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
      >
        <div className="mt-4">
          <div className="d-flex align-items-center">
            <div className="w-25">
              <MailIcon size={20} />
              <b className="ms-2">Email</b>
            </div>
            <a
              href="mailto:dev.codhub@gmail.com"
              style={{ textDecoration: "none" }}
            >
              <b style={{ color: "#808080" }}>dev.codhub@gmail.com</b>
            </a>
          </div>
        </div>
      </Modal>
    </>
  );
});
export default GetHelpModal;
