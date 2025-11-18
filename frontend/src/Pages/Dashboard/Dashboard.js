import React, { useContext, useEffect, useState } from "react";
import { Axios } from "../../Config/Axios/Axios";
import { UserContext } from "../../App";
import { message, Spin } from "antd";
import Filters from "../../Components/Filters/Filters";
import WarrantyCard from "../../Components/WarrantyCard/WarrantyCard";
import { useWarranty } from '../../Components/WarrantyContext/WarrantyContext';

const Dashboard = () => {
  const [contentLoader, setContentLoader] = useState(true);
  const [searchValue, setSearchValue] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [showSharedWarranties, setShowSharedWarranties] = useState(false);
  const [showActiveWarranties, setShowActiveWarranties] = useState(false);

  const [messageApi, contextHolder] = message.useMessage();
  const { setWarranties, warranties } = useWarranty();

  const { user } = useContext(UserContext);

  const toastMessage = (type, mssg) => {
    messageApi.open({
      type: type,
      content: mssg,
    });
  };

  const token = localStorage.getItem("token");

  useEffect(() => {
    const lowercasedValue = searchValue.toLowerCase().trim();
    const currentDate = new Date();

    const filtered = warranties.filter((item) => {
      const matchesSearch =
        item.itemName.toLowerCase().includes(lowercasedValue) ||
        item.category.toLowerCase().includes(lowercasedValue);

      const matchesCategory = selectedCategories.length
        ? selectedCategories.includes(item.category)
        : true; // If no categories are selected, show all

      // Shared warranties filter - show warranties where current user is in sharedWith array
      const matchesSharedFilter = showSharedWarranties
        ? (item.sharedWith && item.sharedWith.includes(user.email))
        : true;

      // Active warranties filter
      const matchesActiveFilter = showActiveWarranties
        ? (new Date(item.expiresOn) > currentDate)
        : true;

      return matchesSearch && matchesCategory && matchesSharedFilter && matchesActiveFilter;
    });

    setFilteredData(filtered); // Set filtered data based on search input and selected categories
  }, [searchValue, selectedCategories, warranties, showSharedWarranties, showActiveWarranties, user.userId]);

  useEffect(() => {
    setContentLoader(true);
    Axios.get(`/api/v1/app/warranty/getAllWarrantyByUser/${user.userId}`, {
      params: {
        addedBy: user.userId,
      },
      headers: {
        authorization: `bearer ${token}`,
      },
    })
      .then((res) => {
        setWarranties(res.data);
        setContentLoader(false);
      })
      .catch((err) => {
        console.error('Error fetching warranties:', err);
        setContentLoader(false);
      });

    return () => {};
  }, [setWarranties, token, user.userId]);

  return (
    <>
      {contextHolder}
      <Filters
        setSearchValue={setSearchValue}
        selectedCategories={selectedCategories}
        setSelectedCategories={setSelectedCategories}
        showSharedWarranties={showSharedWarranties}
        setShowSharedWarranties={setShowSharedWarranties}
        showActiveWarranties={showActiveWarranties}
        setShowActiveWarranties={setShowActiveWarranties}
      />
      {/* <LoaderOverlay isVisible={contentLoader} /> */}
      {contentLoader ? (
        <div className="w-100 my-5 d-flex align-items-center justify-content-center">
          <b className="me-3" style={{ color: "#000" }}>
            Loading
          </b>
          <Spin size="large" />
        </div>
      ) : filteredData.length ? (
        <div className="warranty-card-list">
          {filteredData.map((item, index) => (
            <WarrantyCard warranty={item} key={index} toastMessage={toastMessage}/>
          ))}
        </div>
      ) : (
        <b className="fs-5" style={{ color: "#d3d3d3" }}>
          No warranties added yet—add one and give your brain a little break!
        </b>
      )}
    </>
  );
};

export default Dashboard;
