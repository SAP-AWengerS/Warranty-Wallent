import { Divider, Drawer, FloatButton } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import React, { useContext, useEffect, useState } from "react";
import { VersionsIcon } from "@primer/octicons-react";
import NotificationCard from "../NotificationCard/NotificationCard";
import { UserContext } from "../../App";
import { Axios } from "../../Config/Axios/Axios";

const NotificationDrawer = ({ navOpen, setNavOpen }) => {
  const [isError, setIsError] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const onNavClose = () => {
    setNavOpen(false);
  };

  const { user } = useContext(UserContext);
  const token = localStorage.getItem("token");

  useEffect(() => {
    // setContentLoader(true);
    Axios.get(
      `/api/v1/app/warranty/getExpiringWarrantiesByUser/${user.userId}`,
      {
        params: {
          addedBy: user.userId,
        },
        headers: {
          authorization: `bearer ${token}`,
        },
      }
    )
      .then((res) => {
        setNotifications(res.data);
        // setContentLoader(false);
        console.log(res);
      })
      .catch((err) => {
        setIsError(true);
        // setContentLoader(false);
      });

    return () => {};
  }, []);

  return (
    <Drawer
      placement={"left"}
      closable={false}
      onClose={onNavClose}
      open={navOpen}
      style={{
        padding: 0,
        height: "100vh",
        background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)'
      }}
      key={"left"}
      width={380}
    >
      {/* Header Section */}
      <div style={{
        background: 'linear-gradient(135deg, #1890ff 0%, #096dd9 100%)',
        padding: '20px',
        color: 'white',
        marginBottom: '20px',
        position: 'relative'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '8px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <img
              src="/ww_logo.png"
              alt="Warranty Wallet"
              style={{ width: '28px', height: '28px', marginRight: '12px' }}
            />
            <div>
              <h3 style={{
                margin: 0,
                color: 'white',
                fontSize: '18px',
                fontWeight: '700'
              }}>
                Notifications
              </h3>
            </div>
          </div>

          {/* Notification Count Badge */}
          {notifications.length > 0 && (
            <div style={{
              backgroundColor: '#f5222d',
              color: 'white',
              borderRadius: '12px',
              padding: '4px 8px',
              fontSize: '12px',
              fontWeight: '700',
              minWidth: '20px',
              textAlign: 'center',
              border: '2px solid white'
            }}>
              {notifications.length}
            </div>
          )}
        </div>

        <div style={{
          fontSize: '12px',
          opacity: 0.9,
          color: 'rgba(255,255,255,0.8)'
        }}>
          {notifications.length > 0
            ? `${notifications.length} warranty${notifications.length > 1 ? 'ies' : 'y'} expiring soon`
            : 'No pending notifications'
          }
        </div>
      </div>

      {/* Content Area */}
      <div style={{ padding: '0 20px', height: 'calc(100vh - 120px)', overflowY: 'auto' }}>
        {notifications.length > 0 ? (
          <>
            {/* Notification Stats */}
            <div style={{
              background: 'white',
              borderRadius: '12px',
              padding: '16px',
              marginBottom: '16px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              border: '1px solid #f0f0f0'
            }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '16px',
                textAlign: 'center'
              }}>
                <div>
                  <div style={{
                    fontSize: '20px',
                    fontWeight: '700',
                    color: '#f5222d',
                    marginBottom: '4px'
                  }}>
                    {notifications.filter(n => n.daysLeft <= 7).length}
                  </div>
                  <div style={{
                    fontSize: '11px',
                    color: '#8c8c8c',
                    fontWeight: '500'
                  }}>
                    Critical (≤7 days)
                  </div>
                </div>
                <div>
                  <div style={{
                    fontSize: '20px',
                    fontWeight: '700',
                    color: '#fa8c16',
                    marginBottom: '4px'
                  }}>
                    {notifications.filter(n => n.daysLeft > 7).length}
                  </div>
                  <div style={{
                    fontSize: '11px',
                    color: '#8c8c8c',
                    fontWeight: '500'
                  }}>
                    Upcoming (>7 days)
                  </div>
                </div>
              </div>
            </div>

            {/* Notifications List */}
            <div style={{ marginBottom: '20px' }}>
              {notifications?.map((notification, index) => {
                return <NotificationCard notification={notification} key={index} />;
              })}
            </div>

            {/* Action Footer */}
            <div style={{
              background: 'white',
              borderRadius: '12px',
              padding: '16px',
              textAlign: 'center',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              border: '1px solid #f0f0f0',
              marginBottom: '20px'
            }}>
              <div style={{ fontSize: '12px', color: '#8c8c8c', marginBottom: '8px' }}>
                💡 Pro tip: Click on any notification to view warranty details
              </div>
              <div style={{ fontSize: '10px', color: '#bfbfbf' }}>
                Stay on top of your warranty coverage!
              </div>
            </div>
          </>
        ) : (
          /* Enhanced Empty State */
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '60%',
            textAlign: 'center'
          }}>
            <div style={{
              background: 'white',
              borderRadius: '20px',
              padding: '40px 20px',
              boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
              border: '1px solid #f0f0f0',
              maxWidth: '280px'
            }}>
              <div style={{ fontSize: '64px', marginBottom: '16px' }}>🎉</div>

              <h3 style={{
                color: '#52c41a',
                fontSize: '18px',
                fontWeight: '700',
                margin: '0 0 8px 0'
              }}>
                All Caught Up!
              </h3>

              <p style={{
                color: '#8c8c8c',
                fontSize: '14px',
                lineHeight: '1.5',
                margin: '0 0 16px 0'
              }}>
                No warranty notifications at the moment. We'll alert you when warranties are about to expire.
              </p>

              <div style={{
                background: '#f6ffed',
                borderRadius: '8px',
                padding: '12px',
                border: '1px solid #b7eb8f'
              }}>
                <div style={{ fontSize: '24px', marginBottom: '8px' }}>📱</div>
                <div style={{
                  fontSize: '12px',
                  color: '#389e0d',
                  fontWeight: '500'
                }}>
                  Keep adding warranties to stay protected!
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <FloatButton
        shape="circle"
        type="primary"
        style={{
          insetInlineStart: 340,
          top: 16,
          backgroundColor: '#f5222d',
          borderColor: '#f5222d'
        }}
        onClick={onNavClose}
        icon={<CloseOutlined />}
      />
    </Drawer>
  );
};

export default NotificationDrawer;
