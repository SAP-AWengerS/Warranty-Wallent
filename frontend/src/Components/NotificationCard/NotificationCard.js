import { MessageTwoTone } from "@ant-design/icons";
import React from "react";
import { Axios } from "../../Config/Axios/Axios";

const NotificationCard = ({notification}) => {
  // Determine urgency level and styling based on days left
  const getUrgencyStyle = (daysLeft) => {
    if (daysLeft <= 3) {
      return {
        background: 'linear-gradient(135deg, #fff2f0 0%, #ffebe6 100%)',
        borderLeft: '4px solid #f5222d',
        iconColor: '#f5222d',
        textColor: '#cf1322',
        urgencyText: 'Critical',
        icon: '🚨'
      };
    } else if (daysLeft <= 7) {
      return {
        background: 'linear-gradient(135deg, #fff7e6 0%, #fff2e8 100%)',
        borderLeft: '4px solid #fa8c16',
        iconColor: '#fa8c16',
        textColor: '#d46b08',
        urgencyText: 'High',
        icon: '⚠️'
      };
    } else if (daysLeft <= 14) {
      return {
        background: 'linear-gradient(135deg, #feffe6 0%, #fffbe6 100%)',
        borderLeft: '4px solid #fadb14',
        iconColor: '#fadb14',
        textColor: '#d4b106',
        urgencyText: 'Medium',
        icon: '📋'
      };
    } else {
      return {
        background: 'linear-gradient(135deg, #f6ffed 0%, #f0f9ff 100%)',
        borderLeft: '4px solid #52c41a',
        iconColor: '#52c41a',
        textColor: '#389e0d',
        urgencyText: 'Low',
        icon: '📅'
      };
    }
  };

  const urgencyStyle = getUrgencyStyle(notification.daysLeft);

  return (
    <div
      style={{
        background: urgencyStyle.background,
        borderLeft: urgencyStyle.borderLeft,
        borderRadius: '12px',
        padding: '16px',
        marginBottom: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        border: '1px solid rgba(0,0,0,0.06)',
        transition: 'all 0.3s ease',
        cursor: 'pointer'
      }}
      onMouseEnter={(e) => {
        e.target.style.transform = 'translateY(-2px)';
        e.target.style.boxShadow = '0 4px 16px rgba(0,0,0,0.12)';
      }}
      onMouseLeave={(e) => {
        e.target.style.transform = 'translateY(0)';
        e.target.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)';
      }}
    >
      {/* Header Section */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '18px' }}>{urgencyStyle.icon}</span>
          <div>
            <div style={{
              fontSize: '14px',
              fontWeight: '700',
              color: urgencyStyle.textColor,
              marginBottom: '2px'
            }}>
              Warranty Expiry Alert
            </div>
            <div style={{
              fontSize: '11px',
              fontWeight: '500',
              color: urgencyStyle.textColor,
              backgroundColor: 'rgba(255,255,255,0.7)',
              padding: '2px 8px',
              borderRadius: '10px',
              display: 'inline-block'
            }}>
              {urgencyStyle.urgencyText} Priority
            </div>
          </div>
        </div>

        {/* Days Left Badge */}
        <div style={{
          backgroundColor: urgencyStyle.textColor,
          color: 'white',
          fontSize: '12px',
          fontWeight: '700',
          padding: '6px 12px',
          borderRadius: '20px',
          minWidth: '45px',
          textAlign: 'center'
        }}>
          {notification.daysLeft}d
        </div>
      </div>

      {/* Content Section */}
      <div style={{
        backgroundColor: 'rgba(255,255,255,0.8)',
        borderRadius: '8px',
        padding: '12px',
        border: '1px solid rgba(255,255,255,0.9)'
      }}>
        <div style={{
          fontSize: '13px',
          lineHeight: '1.5',
          color: '#262626',
          fontWeight: '500'
        }}>
          <span style={{ fontWeight: '700', color: urgencyStyle.textColor }}>
            {notification.itemName}
          </span> warranty expires in{' '}
          <span style={{
            fontWeight: '700',
            color: urgencyStyle.textColor,
            backgroundColor: 'rgba(255,255,255,0.9)',
            padding: '2px 6px',
            borderRadius: '4px'
          }}>
            {notification.daysLeft} {notification.daysLeft === 1 ? 'day' : 'days'}
          </span>
        </div>

        <div style={{
          fontSize: '11px',
          color: '#8c8c8c',
          marginTop: '8px',
          fontStyle: 'italic'
        }}>
          💡 Don't miss out on your warranty coverage - take action soon!
        </div>
      </div>

      {/* Action Hint */}
      <div style={{
        marginTop: '8px',
        fontSize: '10px',
        color: urgencyStyle.textColor,
        textAlign: 'center',
        fontWeight: '500'
      }}>
        Tap for warranty details →
      </div>
    </div>
  );
};

export default NotificationCard;
