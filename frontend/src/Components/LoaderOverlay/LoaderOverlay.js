import { Spin } from 'antd';
import React from 'react';

const LoaderOverlay = ({ isVisible }) => {
  return (
    isVisible ? (
      <div className="loader-overlay">
        <div className="loader">
        <Spin size="large" />
        </div>
      </div>
    ) : null
  );
};

export default LoaderOverlay;
