import React, { forwardRef, useImperativeHandle, useState } from "react";
import { Modal } from "antd";

const AboutUsModal = forwardRef((props, ref) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => setIsModalOpen(true);
  const handleOk = () => setIsModalOpen(false);
  const handleCancel = () => setIsModalOpen(false);

  useImperativeHandle(ref, () => ({
    showModal,
  }));

  return (
    <Modal
      title={
        <div style={{
          display: 'flex',
          alignItems: 'center',
          fontSize: '20px',
          fontWeight: 'bold',
          color: '#1890ff'
        }}>
          <img
            src="/ww_logo.png"
            alt="Warranty Wallet"
            style={{ width: '32px', height: '32px', marginRight: '12px' }}
          />
          About Warranty Wallet
        </div>
      }
      open={isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      footer={null}
      width={600}
    >
      <div style={{ padding: '20px 0' }}>
        {/* Hero Section */}
        <div style={{
          textAlign: 'center',
          marginBottom: '24px',
          padding: '20px',
          background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
          borderRadius: '12px',
          border: '1px solid #e6f7ff'
        }}>
          <h3 style={{
            color: '#1890ff',
            marginBottom: '12px',
            fontSize: '18px',
            fontWeight: '600'
          }}>
            🛡️ Your Digital Warranty Companion
          </h3>
          <p style={{
            color: '#595959',
            margin: 0,
            fontSize: '16px',
            lineHeight: '1.6'
          }}>
            Never lose track of your warranties again!
          </p>
        </div>

        {/* Features Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '16px',
          marginBottom: '24px'
        }}>
          <div style={{
            padding: '16px',
            backgroundColor: '#fafafa',
            borderRadius: '8px',
            border: '1px solid #f0f0f0'
          }}>
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>📱</div>
            <h4 style={{ color: '#262626', fontSize: '14px', fontWeight: '600', margin: '0 0 8px 0' }}>
              Easy Organization
            </h4>
            <p style={{ color: '#8c8c8c', fontSize: '12px', margin: 0, lineHeight: '1.4' }}>
              Keep all your warranties in one secure place
            </p>
          </div>

          <div style={{
            padding: '16px',
            backgroundColor: '#fafafa',
            borderRadius: '8px',
            border: '1px solid #f0f0f0'
          }}>
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>🔔</div>
            <h4 style={{ color: '#262626', fontSize: '14px', fontWeight: '600', margin: '0 0 8px 0' }}>
              Smart Reminders
            </h4>
            <p style={{ color: '#8c8c8c', fontSize: '12px', margin: 0, lineHeight: '1.4' }}>
              Get notified before your warranties expire
            </p>
          </div>

          <div style={{
            padding: '16px',
            backgroundColor: '#fafafa',
            borderRadius: '8px',
            border: '1px solid #f0f0f0'
          }}>
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>🔒</div>
            <h4 style={{ color: '#262626', fontSize: '14px', fontWeight: '600', margin: '0 0 8px 0' }}>
              Secure Storage
            </h4>
            <p style={{ color: '#8c8c8c', fontSize: '12px', margin: 0, lineHeight: '1.4' }}>
              Your warranty documents are safely encrypted
            </p>
          </div>

          <div style={{
            padding: '16px',
            backgroundColor: '#fafafa',
            borderRadius: '8px',
            border: '1px solid #f0f0f0'
          }}>
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>🌐</div>
            <h4 style={{ color: '#262626', fontSize: '14px', fontWeight: '600', margin: '0 0 8px 0' }}>
              Access Anywhere
            </h4>
            <p style={{ color: '#8c8c8c', fontSize: '12px', margin: 0, lineHeight: '1.4' }}>
              Available on all your devices, anytime
            </p>
          </div>
        </div>

        {/* Mission Statement */}
        <div style={{
          padding: '20px',
          backgroundColor: '#f6ffed',
          borderLeft: '4px solid #52c41a',
          borderRadius: '0 8px 8px 0',
          marginBottom: '16px'
        }}>
          <h4 style={{
            color: '#389e0d',
            marginBottom: '12px',
            fontSize: '16px',
            fontWeight: '600'
          }}>
            Our Mission
          </h4>
          <p style={{
            color: '#262626',
            margin: 0,
            fontSize: '14px',
            lineHeight: '1.6',
            textAlign: 'justify'
          }}>
            We believe that warranty management shouldn't be a hassle. Our platform empowers you
            to take control of your product warranties with an intuitive, secure, and reliable solution
            that grows with your needs.
          </p>
        </div>

        {/* Call to Action */}
        <div style={{
          textAlign: 'center',
          padding: '16px',
          backgroundColor: '#fff7e6',
          borderRadius: '8px',
          border: '1px solid #ffd591'
        }}>
          <p style={{
            color: '#d46b08',
            margin: 0,
            fontSize: '14px',
            fontWeight: '500'
          }}>
            ✨ Start organizing your warranties today and never miss important coverage again!
          </p>
        </div>
      </div>
    </Modal>
  );
});

export default AboutUsModal;
