import React, { forwardRef, useImperativeHandle, useState } from "react";
import { Modal } from "antd";

const PrivacyPolicyModal = forwardRef(({}, ref) => {
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
    <Modal
      title="Privacy Policy"
      open={isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      footer={null}l
    >
      <div className="mt-4 p-2" style={{ fontFamily: 'Arial, sans-serif', textAlign: 'justify' }}>
      At Warranty Wallet, your privacy is our top priority. We collect only the necessary information, such as your account details and warranty data, to provide seamless service. Your data is securely stored using industry-standard encryption, and we never share it with third parties without your consent. You remain in control of your information, and you can update or delete your data anytime.
      <br/><br/>For more details, please refer to our full Privacy Policy.

      </div>
    </Modal>
  );
});

export default PrivacyPolicyModal;
