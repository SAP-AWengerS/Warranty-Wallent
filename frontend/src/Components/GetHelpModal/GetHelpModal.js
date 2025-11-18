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
            Get Help & Support
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
            background: 'linear-gradient(135deg, #f6ffed 0%, #f0f9ff 100%)',
            borderRadius: '12px',
            border: '1px solid #d9f7be'
          }}>
            <h3 style={{
              color: '#52c41a',
              marginBottom: '8px',
              fontSize: '18px',
              fontWeight: '600'
            }}>
              🤝 We're Here to Help!
            </h3>
            <p style={{
              color: '#595959',
              margin: 0,
              fontSize: '14px',
              lineHeight: '1.5'
            }}>
              Need assistance? Our support team is ready to help you get the most out of Warranty Wallet.
            </p>
          </div>

          {/* Contact Options */}
          <div style={{ marginBottom: '24px' }}>
            <h4 style={{
              color: '#262626',
              marginBottom: '16px',
              fontSize: '16px',
              fontWeight: '600'
            }}>
              📞 Contact Us
            </h4>

            {/* Email Support */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              padding: '16px',
              backgroundColor: '#fafafa',
              borderRadius: '8px',
              border: '1px solid #f0f0f0',
              marginBottom: '12px'
            }}>
              <div style={{
                backgroundColor: '#1890ff',
                borderRadius: '50%',
                padding: '8px',
                marginRight: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <MailIcon size={16} color="white" />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: '600', color: '#262626', marginBottom: '4px' }}>
                  Email Support
                </div>
                <div style={{ fontSize: '12px', color: '#8c8c8c', marginBottom: '8px' }}>
                  Get detailed help via email - We respond within 24 hours
                </div>
                <a
                  href="mailto:dev.codhub@gmail.com?subject=Warranty Wallet Support Request"
                  style={{
                    textDecoration: 'none',
                    color: '#1890ff',
                    fontWeight: '500',
                    fontSize: '14px'
                  }}
                >
                  dev.codhub@gmail.com
                </a>
              </div>
            </div>

            {/* Documentation */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              padding: '16px',
              backgroundColor: '#fafafa',
              borderRadius: '8px',
              border: '1px solid #f0f0f0'
            }}>
              <div style={{
                backgroundColor: '#722ed1',
                borderRadius: '50%',
                padding: '8px',
                marginRight: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '16px'
              }}>
                📚
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: '600', color: '#262626', marginBottom: '4px' }}>
                  Documentation & Guides
                </div>
                <div style={{ fontSize: '12px', color: '#8c8c8c', marginBottom: '8px' }}>
                  Learn how to use all features with our comprehensive guides
                </div>
                <a
                  href="https://github.com/SAP-AWengerS/Warranty-Wallet/blob/main/README.md"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: '#722ed1',
                    fontWeight: '500',
                    fontSize: '14px',
                    textDecoration: 'none'
                  }}
                  onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
                  onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
                >
                  View Documentation →
                </a>
              </div>
            </div>
          </div>

          {/* Quick Help Section */}
          <div style={{ marginBottom: '24px' }}>
            <h4 style={{
              color: '#262626',
              marginBottom: '16px',
              fontSize: '16px',
              fontWeight: '600'
            }}>
              💡 Quick Help
            </h4>

            <div style={{
              display: 'grid',
              gap: '12px'
            }}>
              <div style={{
                padding: '12px 16px',
                backgroundColor: '#fff7e6',
                borderRadius: '6px',
                border: '1px solid #ffd591'
              }}>
                <div style={{ fontWeight: '600', color: '#d46b08', fontSize: '13px', marginBottom: '4px' }}>
                  How to add a warranty?
                </div>
                <div style={{ fontSize: '12px', color: '#8c8c8c' }}>
                  Click the "+" button on your dashboard and fill in the warranty details
                </div>
              </div>

              <div style={{
                padding: '12px 16px',
                backgroundColor: '#f6ffed',
                borderRadius: '6px',
                border: '1px solid #b7eb8f'
              }}>
                <div style={{ fontWeight: '600', color: '#389e0d', fontSize: '13px', marginBottom: '4px' }}>
                  How to set up notifications?
                </div>
                <div style={{ fontSize: '12px', color: '#8c8c8c' }}>
                  Go to your profile settings and enable warranty expiration alerts
                </div>
              </div>

              <div style={{
                padding: '12px 16px',
                backgroundColor: '#f0f5ff',
                borderRadius: '6px',
                border: '1px solid #adc6ff'
              }}>
                <div style={{ fontWeight: '600', color: '#1d39c4', fontSize: '13px', marginBottom: '4px' }}>
                  Can't find your warranty?
                </div>
                <div style={{ fontSize: '12px', color: '#8c8c8c' }}>
                  Use the search and filter options to quickly locate specific warranties
                </div>
              </div>
            </div>
          </div>

          {/* Response Time */}
          <div style={{
            textAlign: 'center',
            padding: '16px',
            backgroundColor: '#e6f7ff',
            borderRadius: '8px',
            border: '1px solid #91d5ff'
          }}>
            <div style={{ fontSize: '20px', marginBottom: '8px' }}>⏰</div>
            <div style={{
              color: '#0050b3',
              fontWeight: '600',
              fontSize: '14px',
              marginBottom: '4px'
            }}>
              Average Response Time: 24 Hours
            </div>
            <div style={{
              color: '#8c8c8c',
              fontSize: '12px'
            }}>
              We're committed to helping you quickly resolve any issues
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
});
export default GetHelpModal;
