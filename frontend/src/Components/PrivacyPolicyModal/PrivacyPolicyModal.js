import React, { forwardRef, useImperativeHandle, useState } from "react";
import { Modal } from "antd";

const PrivacyPolicyModal = forwardRef((props, ref) => {
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
          Privacy Policy
        </div>
      }
      open={isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      footer={null}
      width={650}
    >
      <div style={{ padding: '20px 0' }}>
        {/* Hero Section */}
        <div style={{
          textAlign: 'center',
          marginBottom: '24px',
          padding: '20px',
          background: 'linear-gradient(135deg, #fff2e8 0%, #fff7e6 100%)',
          borderRadius: '12px',
          border: '1px solid #ffd591'
        }}>
          <h3 style={{
            color: '#d46b08',
            marginBottom: '8px',
            fontSize: '18px',
            fontWeight: '600'
          }}>
            🛡️ Your Privacy Matters
          </h3>
          <p style={{
            color: '#595959',
            margin: 0,
            fontSize: '14px',
            lineHeight: '1.5'
          }}>
            We're committed to protecting your personal information and being transparent about how we use it.
          </p>
        </div>

        {/* Privacy Principles */}
        <div style={{ marginBottom: '24px' }}>
          <h4 style={{
            color: '#262626',
            marginBottom: '16px',
            fontSize: '16px',
            fontWeight: '600'
          }}>
            🔐 Our Privacy Principles
          </h4>

          <div style={{
            display: 'grid',
            gap: '12px',
            marginBottom: '20px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              padding: '16px',
              backgroundColor: '#f6ffed',
              borderRadius: '8px',
              border: '1px solid #b7eb8f'
            }}>
              <div style={{
                fontSize: '20px',
                marginRight: '12px',
                marginTop: '2px'
              }}>
                📊
              </div>
              <div>
                <div style={{ fontWeight: '600', color: '#389e0d', fontSize: '14px', marginBottom: '4px' }}>
                  Minimal Data Collection
                </div>
                <div style={{ fontSize: '13px', color: '#595959', lineHeight: '1.4' }}>
                  We collect only the necessary information like account details and warranty data to provide seamless service.
                </div>
              </div>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              padding: '16px',
              backgroundColor: '#e6f7ff',
              borderRadius: '8px',
              border: '1px solid #91d5ff'
            }}>
              <div style={{
                fontSize: '20px',
                marginRight: '12px',
                marginTop: '2px'
              }}>
                🔒
              </div>
              <div>
                <div style={{ fontWeight: '600', color: '#0050b3', fontSize: '14px', marginBottom: '4px' }}>
                  Industry-Standard Security
                </div>
                <div style={{ fontSize: '13px', color: '#595959', lineHeight: '1.4' }}>
                  Your data is securely stored using advanced encryption and follows best security practices.
                </div>
              </div>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              padding: '16px',
              backgroundColor: '#fff0f6',
              borderRadius: '8px',
              border: '1px solid #ffadd2'
            }}>
              <div style={{
                fontSize: '20px',
                marginRight: '12px',
                marginTop: '2px'
              }}>
                🚫
              </div>
              <div>
                <div style={{ fontWeight: '600', color: '#c41d7f', fontSize: '14px', marginBottom: '4px' }}>
                  No Third-Party Sharing
                </div>
                <div style={{ fontSize: '13px', color: '#595959', lineHeight: '1.4' }}>
                  We never share your information with third parties without your explicit consent.
                </div>
              </div>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              padding: '16px',
              backgroundColor: '#f9f0ff',
              borderRadius: '8px',
              border: '1px solid #d3adf7'
            }}>
              <div style={{
                fontSize: '20px',
                marginRight: '12px',
                marginTop: '2px'
              }}>
              ⚡
              </div>
              <div>
                <div style={{ fontWeight: '600', color: '#722ed1', fontSize: '14px', marginBottom: '4px' }}>
                  Full Control
                </div>
                <div style={{ fontSize: '13px', color: '#595959', lineHeight: '1.4' }}>
                  You remain in control of your information and can update or delete your data anytime.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Your Rights Section */}
        <div style={{
          padding: '20px',
          backgroundColor: '#f0f5ff',
          borderLeft: '4px solid #1890ff',
          borderRadius: '0 8px 8px 0',
          marginBottom: '20px'
        }}>
          <h4 style={{
            color: '#1890ff',
            marginBottom: '12px',
            fontSize: '15px',
            fontWeight: '600'
          }}>
            📋 Your Data Rights
          </h4>
          <div style={{ fontSize: '13px', color: '#262626', lineHeight: '1.5' }}>
            • <strong>Access:</strong> Request a copy of your personal data<br/>
            • <strong>Correction:</strong> Update inaccurate or incomplete information<br/>
            • <strong>Deletion:</strong> Request removal of your data from our systems<br/>
            • <strong>Portability:</strong> Transfer your data to another service
          </div>
        </div>

        {/* Contact Information */}
        <div style={{
          textAlign: 'center',
          padding: '16px',
          backgroundColor: '#fafafa',
          borderRadius: '8px',
          border: '1px solid #f0f0f0'
        }}>
          <div style={{ fontSize: '16px', marginBottom: '8px' }}>📧</div>
          <div style={{
            color: '#262626',
            fontWeight: '600',
            fontSize: '14px',
            marginBottom: '6px'
          }}>
            Questions About Your Privacy?
          </div>
          <div style={{
            color: '#8c8c8c',
            fontSize: '12px',
            marginBottom: '8px'
          }}>
            Contact us for more details about our privacy practices
          </div>
          <a
            href="mailto:dev.codhub@gmail.com?subject=Privacy Policy Question - Warranty Wallet"
            style={{
              color: '#1890ff',
              textDecoration: 'none',
              fontWeight: '500',
              fontSize: '13px'
            }}
          >
            dev.codhub@gmail.com
          </a>
        </div>

        {/* Last Updated */}
        <div style={{
          textAlign: 'center',
          marginTop: '16px',
          color: '#8c8c8c',
          fontSize: '11px'
        }}>
          Last updated: November 2024
        </div>
      </div>
    </Modal>
  );
});

export default PrivacyPolicyModal;
