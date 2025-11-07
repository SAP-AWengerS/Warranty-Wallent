import React from 'react';
import { Modal } from 'antd';
import PropTypes from 'prop-types';

const ConfirmModal = ({ title, content, onOk, onCancel, children }) => {
  const handleClick = () => {
    Modal.confirm({
      title: title || 'Are you sure?',
      content: content || 'Do you really want to perform this action?',
      onOk: onOk,
      onCancel: onCancel,
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
