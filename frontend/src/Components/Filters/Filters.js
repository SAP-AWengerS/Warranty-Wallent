import React, { useState, useRef, useEffect, useMemo } from "react";
import { Button, Input, Popover } from "antd";
import { FilterIcon, PlusIcon, SearchIcon } from "@primer/octicons-react";
import WarrantyDetailsModal from "../WarrantyDetailsModal/WarrantyDetailsModal";
import { Axios } from "../../Config/Axios/Axios";
import { useContext } from "react";
import { UserContext } from "../../App";

const Filters = ({ setSearchValue, setSelectedCategories, selectedCategories, setWarranty, warranty, showSharedWarranties, setShowSharedWarranties, showActiveWarranties, setShowActiveWarranties }) => {
  const [open, setOpen] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
  });
  const categories = useMemo(() => [
    { id: "electronics", name: "Electronics" },
    { id: "fashion", name: "Fashion" },
    { id: "home_kitchen", name: "Home & Kitchen" },
    { id: "sport", name: "Sport" },
    { id: "kids_toys", name: "Kids & Toys" },
  ], []);
  const warrantyDetailsModalRef = useRef();

  const { user } = useContext(UserContext);
  const token = localStorage.getItem("token");

  useEffect(() => {
      // setContentLoader(true);
      Axios.get(
        `/api/v1/app/warranty/stats/${user.userId}`,
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
          setStats(res.data);
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });

      return () => {};
    }, [token, user.userId]);

  const callWarrantyDetailsModal = () => {
    if (warrantyDetailsModalRef.current) {
      warrantyDetailsModalRef.current.showLoading();
    }
  };

  const categoryContainerRef = useRef(null);

  const handleButtonClick = (category) => {
    setSelectedCategories(
      (prevSelected) =>
        prevSelected.includes(category)
          ? prevSelected.filter((item) => item !== category)
          : [...prevSelected, category]
    );
  };

  const handleOpenChange = (newOpen) => {
    setOpen(newOpen);
  };

  const toggleShowMore = () => {
    setShowMore((prev) => !prev);
  };

  const isOverflowing = () => {
    const container = categoryContainerRef.current;
    return container ? container.scrollHeight > container.clientHeight : false;
  };

  // State to track if we need to show the "Show More" button
  const [shouldShowMoreButton, setShouldShowMoreButton] = useState(false);

  useEffect(() => {
    // Update button visibility whenever the categories or showMore state changes
    setShouldShowMoreButton(isOverflowing());
  }, [categories, showMore]);

  const cardData = [
    {
      id: "total",
      icon: "∑",
      label: "Total Count",
      value: stats?.total,
      gradient: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)",
      shadowColor: "rgba(30, 60, 114, 0.3)",
      hoverShadowColor: "rgba(30, 60, 114, 0.4)",
      rotateY: "1deg"
    },
    {
      id: "active",
      icon: "✓",
      label: "Active Warranty",
      value: stats?.active,
      gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      shadowColor: "rgba(102, 126, 234, 0.3)",
      hoverShadowColor: "rgba(102, 126, 234, 0.4)",
      rotateY: "-1deg"
    }
  ];

  const renderCard = (card, index) => (
    <div key={card.id} className="col-6 col-lg-2">
      <div
        className="d-flex flex-column rounded-3 position-relative overflow-hidden h-100"
        style={{
          background: card.gradient,
          boxShadow: `0 10px 25px ${card.shadowColor}`,
          border: "1px solid rgba(255, 255, 255, 0.2)",
          minHeight: window.innerWidth >= 992 ? "120px" : "100px",
          padding: window.innerWidth >= 992 ? "16px 12px" : "12px",
          transform: `perspective(1000px) rotateY(${card.rotateY})`,
          transition: "all 0.3s ease"
        }}
        onMouseEnter={(e) => {
          if (window.innerWidth >= 992) {
            e.currentTarget.style.transform = "perspective(1000px) rotateY(0deg) translateY(-2px)";
            e.currentTarget.style.boxShadow = `0 15px 35px ${card.hoverShadowColor}`;
          }
        }}
        onMouseLeave={(e) => {
          if (window.innerWidth >= 992) {
            e.currentTarget.style.transform = `perspective(1000px) rotateY(${card.rotateY})`;
            e.currentTarget.style.boxShadow = `0 10px 25px ${card.shadowColor}`;
          }
        }}
      >
        <div className="d-flex align-items-center mb-2" style={{ gap: window.innerWidth >= 992 ? "8px" : "4px" }}>
          <div
            className="d-flex align-items-center justify-content-center rounded-circle"
            style={{
              width: window.innerWidth >= 992 ? "20px" : "18px",
              height: window.innerWidth >= 992 ? "20px" : "18px",
              background: "rgba(255, 255, 255, 0.2)",
              backdropFilter: "blur(10px)"
            }}
          >
            <span style={{
              fontSize: window.innerWidth >= 992 ? "10px" : "9px",
              color: "#fff"
            }}>
              {card.icon}
            </span>
          </div>
          <b
            className="text-white"
            style={{
              fontSize: window.innerWidth >= 992 ? "12px" : "11px",
              fontWeight: "600",
              textShadow: "0 1px 3px rgba(0,0,0,0.3)",
              letterSpacing: window.innerWidth >= 992 ? "0.3px" : "0"
            }}
          >
            {window.innerWidth >= 992 ? card.label.split(' ')[0] : card.label.split(' ')[0]}
          </b>
        </div>
        <div className="d-flex align-items-baseline gap-1">
          <b
            className="text-white"
            style={{
              fontSize: window.innerWidth >= 992 ? "2.6rem" : "1.5rem",
              fontWeight: "700",
              lineHeight: "1",
              textShadow: "0 2px 8px rgba(0,0,0,0.3)"
            }}
          >
            {card.value}
          </b>
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-100 mb-4 p-3">
      <div className="row g-3 align-items-center mb-4 mb-lg-0">
        {/* Cards Section */}
        {cardData.map((card, index) => renderCard(card, index))}

        {/* Search and Filter Section */}
        <div className="col-12 col-lg-8">
          <div
            className="rounded-4 p-3 h-100 position-relative overflow-hidden"
            style={{
              background: "linear-gradient(135deg, #e2e8f0 100%, #cbd5e1 50%, #f8fafc 0%)",
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.6)",
              border: "1px solid rgba(255, 255, 255, 0.8)"
            }}
          >
            {/* Decorative Background Elements */}
            <div
              className="position-absolute"
              style={{
                top: "-20px",
                right: "-20px",
                width: "80px",
                height: "80px",
                background: "linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1))",
                borderRadius: "50%",
                filter: "blur(20px)"
              }}
            />
            <div
              className="position-absolute"
              style={{
                bottom: "-15px",
                left: "-15px",
                width: "60px",
                height: "60px",
                background: "linear-gradient(135deg, rgba(30, 60, 114, 0.1), rgba(42, 82, 152, 0.1))",
                borderRadius: "50%",
                filter: "blur(15px)"
              }}
            />

            <div className="row g-3 align-items-center position-relative" style={{ zIndex: 1 }}>
              {/* Search Input */}
              <div className="col-12 col-lg-8">
                <div className="position-relative">
                  <Input
                    placeholder="Search your warranty"
                    size="large"
                    prefix={
                      <div
                        className="d-flex align-items-center justify-content-center"
                        style={{
                          width: "20px",
                          height: "20px",
                          background: "linear-gradient(135deg, #667eea, #764ba2)",
                          borderRadius: "6px",
                          marginRight: "8px"
                        }}
                      >
                        <SearchIcon size={12} fill="white" />
                      </div>
                    }
                    style={{
                      height: "52px",
                      borderRadius: "16px",
                      border: "2px solid rgba(255, 255, 255, 0.6)",
                      background: "rgba(255, 255, 255, 0.9)",
                      backdropFilter: "blur(10px)",
                      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.8)"
                    }}
                    onChange={(e) => {
                      setSearchValue(e.target.value);
                    }}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="col-12 col-lg-4">
                <div className="d-flex gap-2 justify-content-center justify-content-lg-end">
                  <Popover
                    content={
                      <div style={{ width: '250px', padding: '8px' }}>
                        <div className="mb-3">
                          <div className="d-flex align-items-center justify-content-between mb-2">
                            <span style={{ fontSize: '14px', fontWeight: '500', color: '#475569' }}>Shared Warranties</span>
                            <div
                              className="position-relative"
                              style={{
                                width: '44px',
                                height: '24px',
                                borderRadius: '12px',
                                background: showSharedWarranties
                                  ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                                  : '#e2e8f0',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                border: '2px solid rgba(255, 255, 255, 0.3)'
                              }}
                              onClick={() => setShowSharedWarranties(!showSharedWarranties)}
                            >
                              <div
                                style={{
                                  position: 'absolute',
                                  top: '2px',
                                  left: showSharedWarranties ? '22px' : '2px',
                                  width: '16px',
                                  height: '16px',
                                  borderRadius: '50%',
                                  background: '#fff',
                                  transition: 'all 0.3s ease',
                                  boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                                }}
                              />
                            </div>
                          </div>
                          <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>
                            Show warranties shared with me
                          </p>
                        </div>

                        <div className="mb-3">
                          <div className="d-flex align-items-center justify-content-between mb-2">
                            <span style={{ fontSize: '14px', fontWeight: '500', color: '#475569' }}>Active Warranties</span>
                            <div
                              className="position-relative"
                              style={{
                                width: '44px',
                                height: '24px',
                                borderRadius: '12px',
                                background: showActiveWarranties
                                  ? 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)'
                                  : '#e2e8f0',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                border: '2px solid rgba(255, 255, 255, 0.3)'
                              }}
                              onClick={() => setShowActiveWarranties(!showActiveWarranties)}
                            >
                              <div
                                style={{
                                  position: 'absolute',
                                  top: '2px',
                                  left: showActiveWarranties ? '22px' : '2px',
                                  width: '16px',
                                  height: '16px',
                                  borderRadius: '50%',
                                  background: '#fff',
                                  transition: 'all 0.3s ease',
                                  boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                                }}
                              />
                            </div>
                          </div>
                          <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>
                            Show only warranties that haven't expired
                          </p>
                        </div>
                      </div>
                    }
                    placement="bottomRight"
                    title="Filters"
                    trigger="click"
                    open={open}
                    onOpenChange={handleOpenChange}
                  >
                    <Button
                      className="d-flex align-items-center justify-content-center"
                      style={{
                        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        height: "52px",
                        width: "52px",
                        minWidth: "52px",
                        borderRadius: "16px",
                        border: "none",
                        boxShadow: "0 8px 20px rgba(102, 126, 234, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)",
                        transition: "all 0.3s ease"
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-2px)";
                        e.currentTarget.style.boxShadow = "0 12px 25px rgba(102, 126, 234, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0px)";
                        e.currentTarget.style.boxShadow = "0 8px 20px rgba(102, 126, 234, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)";
                      }}
                    >
                      <FilterIcon fill="white" size={16} />
                    </Button>
                  </Popover>
                  <Button
                    className="d-flex align-items-center justify-content-center"
                    style={{
                      background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)",
                      height: "52px",
                      width: "52px",
                      minWidth: "52px",
                      borderRadius: "16px",
                      border: "none",
                      boxShadow: "0 8px 20px rgba(30, 60, 114, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)",
                      transition: "all 0.3s ease"
                    }}
                    onClick={callWarrantyDetailsModal}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-2px)";
                      e.currentTarget.style.boxShadow = "0 12px 25px rgba(30, 60, 114, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0px)";
                      e.currentTarget.style.boxShadow = "0 8px 20px rgba(30, 60, 114, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)";
                    }}
                  >
                    <PlusIcon fill="white" size={16} />
                  </Button>
                </div>
              </div>
            </div>

            {/* Enhanced Category Section - Desktop: Always visible with overflow, Mobile: Hidden by default */}
            <div
              className="d-none d-lg-flex gap-2 flex-wrap mt-4 position-relative"
              ref={categoryContainerRef}
              style={{
                maxHeight: showMore ? "none" : "75px",
                overflow: "hidden",
                transition: "max-height 0.3s ease",
                zIndex: 1
              }}
            >
              {categories.map((category) => (
                <Button
                  key={category.name}
                  className="px-4 rounded-pill border-0"
                  style={{
                    fontSize: "12px",
                    fontWeight: "500",
                    height: "36px",
                    background: selectedCategories.includes(category.name)
                      ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                      : "rgba(255, 255, 255, 0.8)",
                    color: selectedCategories.includes(category.name) ? "#fff" : "#475569",
                    boxShadow: selectedCategories.includes(category.name)
                      ? "0 4px 15px rgba(102, 126, 234, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)"
                      : "0 2px 8px rgba(0, 0, 0, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.6)",
                    backdropFilter: "blur(10px)",
                    border: selectedCategories.includes(category.name)
                      ? "1px solid rgba(255, 255, 255, 0.3)"
                      : "1px solid rgba(255, 255, 255, 0.4)",
                    transition: "all 0.3s ease",
                    textShadow: selectedCategories.includes(category.name)
                      ? "0 1px 3px rgba(0,0,0,0.3)"
                      : "none"
                  }}
                  onClick={() => handleButtonClick(category.name)}
                  onMouseEnter={(e) => {
                    if (!selectedCategories.includes(category.name)) {
                      e.currentTarget.style.background = "rgba(255, 255, 255, 0.95)";
                      e.currentTarget.style.transform = "translateY(-1px)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!selectedCategories.includes(category.name)) {
                      e.currentTarget.style.background = "rgba(255, 255, 255, 0.8)";
                      e.currentTarget.style.transform = "translateY(0px)";
                    }
                  }}
                >
                  {category.name}
                </Button>
              ))}
            </div>

            {/* Mobile Category Section - Only shown when showMore is true */}
            {showMore && (
              <div className="d-flex d-lg-none gap-2 flex-wrap mt-4 position-relative" style={{ zIndex: 1 }}>
                {categories.map((category) => (
                  <Button
                    key={category.name}
                    className="px-4 rounded-pill border-0"
                    style={{
                      fontSize: "12px",
                      fontWeight: "500",
                      height: "36px",
                      background: selectedCategories.includes(category.name)
                        ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                        : "rgba(255, 255, 255, 0.8)",
                      color: selectedCategories.includes(category.name) ? "#fff" : "#475569",
                      boxShadow: selectedCategories.includes(category.name)
                        ? "0 4px 15px rgba(102, 126, 234, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)"
                        : "0 2px 8px rgba(0, 0, 0, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.6)",
                      backdropFilter: "blur(10px)",
                      border: selectedCategories.includes(category.name)
                        ? "1px solid rgba(255, 255, 255, 0.3)"
                        : "1px solid rgba(255, 255, 255, 0.4)",
                      transition: "all 0.3s ease",
                      textShadow: selectedCategories.includes(category.name)
                        ? "0 1px 3px rgba(0,0,0,0.3)"
                        : "none"
                    }}
                    onClick={() => handleButtonClick(category.name)}
                  >
                    {category.name}
                  </Button>
                ))}
              </div>
            )}

            {/* Show More Button - Desktop: Only when overflowing, Mobile: Always visible */}
            <div className="text-center position-relative" style={{ zIndex: 1 }}>
              {/* Desktop Show More/Less Button */}
              {((shouldShowMoreButton || showMore) && window.innerWidth >= 992) && (
                <Button
                  type="link"
                  onClick={toggleShowMore}
                  style={{
                    marginTop: "12px",
                    color: "#667eea",
                    fontWeight: "500",
                    fontSize: "13px",
                    textDecoration: "none",
                    padding: "8px 16px",
                    borderRadius: "12px",
                    background: "rgba(102, 126, 234, 0.1)",
                    border: "1px solid rgba(102, 126, 234, 0.2)",
                    transition: "all 0.3s ease"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(102, 126, 234, 0.15)";
                    e.currentTarget.style.transform = "translateY(-1px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(102, 126, 234, 0.1)";
                    e.currentTarget.style.transform = "translateY(0px)";
                  }}
                >
                  {showMore ? "Show Less ↑" : "Show More ↓"}
                </Button>
              )}

              {/* Mobile Show/Hide Filters Button */}
              <div className="d-block d-lg-none">
                <Button
                  type="link"
                  onClick={toggleShowMore}
                  style={{
                    marginTop: "12px",
                    color: "#667eea",
                    fontWeight: "500",
                    fontSize: "13px",
                    textDecoration: "none",
                    padding: "8px 16px",
                    borderRadius: "12px",
                    background: "rgba(102, 126, 234, 0.1)",
                    border: "1px solid rgba(102, 126, 234, 0.2)",
                    transition: "all 0.3s ease"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(102, 126, 234, 0.15)";
                    e.currentTarget.style.transform = "translateY(-1px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(102, 126, 234, 0.1)";
                    e.currentTarget.style.transform = "translateY(0px)";
                  }}
                >
                  {showMore ? "Hide Filters ↑" : "Show Filters ↓"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <WarrantyDetailsModal
        ref={warrantyDetailsModalRef}
        warrantyDetails={warranty}
      />
    </div>
  );
};

export default Filters;
