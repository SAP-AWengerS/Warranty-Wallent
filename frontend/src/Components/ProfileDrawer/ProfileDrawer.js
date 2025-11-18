import { Divider, Drawer, FloatButton } from "antd";
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { googleLogout } from "@react-oauth/google";
import ConfirmModal from "../ConfirmModal/ConfirmModal";
import { CloseOutlined } from "@ant-design/icons";
import GetHelpModal from "../GetHelpModal/GetHelpModal";
import PrivacyPolicyModal from "../PrivacyPolicyModal/PrivacyPolicyModal";
import AboutUsModal from "../AboutUsModal/AboutUsModal";
import { Axios } from "../../Config/Axios/Axios";
import { UserContext } from "../../App";
const ReachableContext = createContext(null);
const UnreachableContext = createContext(null);

const ProfileDrawer = ({ profileOpen, setProfileOpen }) => {
  const [userCredentials, setuserCredentials] = useState(null);
  const [metadata, setMetadata] = useState({});
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(true);

  const { user } = useContext(UserContext);

  const token = localStorage.getItem('token')

  useEffect(() => {
    // const userCred = jwtDecode(localStorage.getItem("token"));
    // setuserCredentials(userCred);

    // setLoading(true);

    // Axios.get(`/api/v1/app/metadata/getProfileMetadataByUserId`, {
    //   params: {
    //     userId: user?.userId,
    //   },
    //   headers: {
    //     authorization: `bearer ${token}`,
    //   },
    // })
    //   .then((res) => {
    //     setMetadata(res.data);
    //     setLoading(false);
    //   })
    //   .catch((err) => {
    //     setIsError(true);
    //     setLoading(false);
    //   });
    setLoading(false);

  }, []);

  const onProfileClose = () => {
    setProfileOpen(false);
  };

  const getHelpRef = useRef();
  const privacyPolicyRef = useRef();
  const aboutUsRef = useRef();

  const handleOk = () => {
    googleLogout();
    localStorage.removeItem("token");
    window.location.reload();
  };

  const callGetHelpModal = () => {
    if (getHelpRef.current) {
      getHelpRef.current.showModal();
    }
  };

  const callPrivacyPolicyModal = () => {
    if (privacyPolicyRef.current) {
      privacyPolicyRef.current.showModal();
    }
  };

  const callAboutUsModal = () => {
    if (aboutUsRef.current) {
      aboutUsRef.current.showModal();
    }
  };

  return (
    <Drawer
      placement={"right"}
      closable={false}
      onClose={onProfileClose}
      open={profileOpen}
      style={{
        padding: 0,
        background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)'
      }}
      key={"right"}
      loading={loading}
      width={350}
    >
      {/* Header with Logo */}
      <div style={{
        background: 'linear-gradient(135deg, #1890ff 0%, #096dd9 100%)',
        padding: '20px',
        textAlign: 'center',
        color: 'white',
        marginBottom: '20px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px' }}>
          <img
            src="/ww_logo.png"
            alt="Warranty Wallet"
            style={{ width: '32px', height: '32px', marginRight: '10px' }}
          />
          <h3 style={{ margin: 0, color: 'white', fontSize: '18px', fontWeight: '600' }}>
            Warranty Wallet
          </h3>
        </div>
        <div style={{ fontSize: '12px', opacity: 0.9 }}>
          Your Digital Warranty Manager
        </div>
      </div>

      <div style={{ padding: '0 20px' }}>
        {/* User Profile Section */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '24px',
          textAlign: 'center',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          marginBottom: '20px',
          border: '1px solid #f0f0f0'
        }}>
          <div style={{
            position: 'relative',
            display: 'inline-block',
            marginBottom: '16px'
          }}>
            <img
              src={
                user?.picture
                  ? user.picture
                  : "https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava1-bg.webp"
              }
              referrerPolicy="no-referrer"
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                border: "4px solid #1890ff",
                objectFit: "cover"
              }}
              alt="User"
            />
            <div style={{
              position: 'absolute',
              bottom: '0',
              right: '0',
              width: '20px',
              height: '20px',
              backgroundColor: '#52c41a',
              borderRadius: '50%',
              border: '2px solid white'
            }}></div>
          </div>

          <h4 style={{
            margin: '0 0 8px 0',
            color: '#262626',
            fontSize: '18px',
            fontWeight: '600'
          }}>
            {user?.name}
          </h4>

          <p style={{
            color: '#8c8c8c',
            margin: 0,
            fontSize: '14px',
            padding: '8px 12px',
            backgroundColor: '#f8f9fa',
            borderRadius: '20px',
            display: 'inline-block'
          }}>
            {user?.email}
          </p>
        </div>

        {/* Menu Buttons */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '16px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            border: '1px solid #f0f0f0'
          }}>
            <button
              type="button"
              style={{
                width: '100%',
                padding: '12px 16px',
                marginBottom: '8px',
                border: 'none',
                borderRadius: '8px',
                backgroundColor: '#f6ffed',
                color: '#52c41a',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-start'
              }}
              onClick={callGetHelpModal}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#52c41a';
                e.target.style.color = 'white';
                e.target.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#f6ffed';
                e.target.style.color = '#52c41a';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              <span style={{ fontSize: '16px', marginRight: '12px' }}>🤝</span>
              Get Help & Support
            </button>

            <button
              type="button"
              style={{
                width: '100%',
                padding: '12px 16px',
                marginBottom: '8px',
                border: 'none',
                borderRadius: '8px',
                backgroundColor: '#fff7e6',
                color: '#d46b08',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-start'
              }}
              onClick={callPrivacyPolicyModal}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#d46b08';
                e.target.style.color = 'white';
                e.target.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#fff7e6';
                e.target.style.color = '#d46b08';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              <span style={{ fontSize: '16px', marginRight: '12px' }}>🛡️</span>
              Privacy Policy
            </button>

            <button
              type="button"
              style={{
                width: '100%',
                padding: '12px 16px',
                marginBottom: '0',
                border: 'none',
                borderRadius: '8px',
                backgroundColor: '#f0f5ff',
                color: '#1890ff',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-start'
              }}
              onClick={callAboutUsModal}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#1890ff';
                e.target.style.color = 'white';
                e.target.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#f0f5ff';
                e.target.style.color = '#1890ff';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              <span style={{ fontSize: '16px', marginRight: '12px' }}>ℹ️</span>
              About Warranty Wallet
            </button>
          </div>
        </div>

        {/* Logout Section */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '16px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          border: '1px solid #f0f0f0',
          marginBottom: '20px'
        }}>
          <ConfirmModal
            title="Confirm Logout"
            content="Are you sure you want to sign out of your account?"
            onOk={handleOk}
            onCancel={() => {}}
          >
            <button
              type="button"
              style={{
                width: '100%',
                padding: '12px 16px',
                border: 'none',
                borderRadius: '8px',
                backgroundColor: '#fff2f0',
                color: '#f5222d',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#f5222d';
                e.target.style.color = 'white';
                e.target.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#fff2f0';
                e.target.style.color = '#f5222d';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              <span style={{ fontSize: '16px', marginRight: '8px' }}>🚪</span>
              Sign Out
            </button>
          </ConfirmModal>
        </div>

        {/* Footer */}
        <div style={{
          textAlign: 'center',
          padding: '16px',
          backgroundColor: 'rgba(255,255,255,0.8)',
          borderRadius: '8px',
          marginBottom: '20px'
        }}>
          <div style={{
            color: '#8c8c8c',
            fontSize: '11px',
            marginBottom: '4px'
          }}>
            Developed with ❤️ by
          </div>
          <div style={{
            color: '#1890ff',
            fontSize: '12px',
            fontWeight: '600'
          }}>
            AWengerS Team
          </div>
        </div>
      </div>

      <FloatButton
        shape="circle"
        type="primary"
        style={{
          insetInlineEnd: 16,
          top: 16,
          backgroundColor: '#f5222d',
          borderColor: '#f5222d'
        }}
        onClick={onProfileClose}
        icon={<CloseOutlined />}
      />
      <GetHelpModal ref={getHelpRef} />
      <PrivacyPolicyModal ref={privacyPolicyRef} />
      <AboutUsModal ref={aboutUsRef} />
    </Drawer>
  );
};

export default ProfileDrawer;
