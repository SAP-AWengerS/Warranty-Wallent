import React from 'react';
import { Modal } from 'antd';
import PropTypes from 'prop-types';

const ConfirmModal = ({ title, content, onOk, onCancel, children }) => {
  const handleClick = () => {
    Modal.confirm({
      title: (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          fontSize: '18px',
          fontWeight: '600',
          color: '#262626',
          marginBottom: '8px'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            backgroundColor: '#fff7e6',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: '12px',
            border: '2px solid #ffd591'
          }}>
            <span style={{ fontSize: '20px' }}>⚠️</span>
          </div>
          {title || 'Confirm Action'}
        </div>
      ),
      content: (
        <div style={{
          marginLeft: '52px',
          color: '#595959',
          fontSize: '14px',
          lineHeight: '1.5',
          marginBottom: '16px'
        }}>
          {content || 'Are you sure you want to proceed with this action?'}
        </div>
      ),
      onOk: onOk,
      onCancel: onCancel,
      okText: 'Yes, Continue',
      cancelText: 'Cancel',
      okButtonProps: {
        style: {
          backgroundColor: '#1890ff',
          borderColor: '#1890ff',
          borderRadius: '6px',
          fontWeight: '500',
          padding: '8px 20px',
          height: 'auto'
        }
      },
      cancelButtonProps: {
        style: {
          borderColor: '#d9d9d9',
          borderRadius: '6px',
          fontWeight: '500',
          padding: '8px 20px',
          height: 'auto',
          color: '#595959'
        }
      },
      centered: true,
      width: 420,
      bodyStyle: {
        padding: '24px'
      },
      maskStyle: {
        backgroundColor: 'rgba(0, 0, 0, 0.6)'
      }
    });
  };

  return React.cloneElement(children, { onClick: handleClick });
};

ConfirmModal.propTypes = {
  title: PropTypes.string,
  content: PropTypes.string,
  onOk: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  children: PropTypes.element.isRequired,
};

export default ConfirmModal;
