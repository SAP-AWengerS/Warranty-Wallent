import React, { forwardRef, useImperativeHandle, useState } from "react";
import { Modal } from "antd";

const AboutUsModal = forwardRef(({}, ref) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => setIsModalOpen(true);
  const handleOk = () => setIsModalOpen(false);
  const handleCancel = () => setIsModalOpen(false);

  useImperativeHandle(ref, () => ({
    showModal,
  }));

  return (
    <Modal
      title="About Us"
      open={isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      footer={null}
    >
      <div className="mt-4 p-2" style={{ textAlign: "justify" }}>
        Welcome to Warranty Wallet, your go-to solution for hassle-free warranty
        management! Our mission is to simplify the way you organize and track
        your warranties by providing a secure, user-friendly platform. We
        believe that staying on top of your warranties shouldn’t be complicated,
        so we’ve built an intuitive tool to keep your coverage information
        accessible and organized—anytime, anywhere.
      </div>
    </Modal>
  );
});

export default AboutUsModal;
