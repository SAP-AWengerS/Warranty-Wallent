import React, { useState, useRef, useEffect } from "react";
import { Button, Input, Popover } from "antd";
import { FilterIcon, PlusIcon, SearchIcon } from "@primer/octicons-react";
import WarrantyDetailsModal from "../WarrantyDetailsModal/WarrantyDetailsModal";

const Filters = ({ setSearchValue, setSelectedCategories, selectedCategories, setWarranty, warranty }) => {
  const [open, setOpen] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const categories = [
    { id: "electronics", name: "Electronics" },
    { id: "fashion", name: "Fashion" },
    { id: "home_kitchen", name: "Home & Kitchen" },
    { id: "sport", name: "Sport" },
    { id: "kids_toys", name: "Kids & Toys" },
  ];
  const warrantyDetailsModalRef = useRef();

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

  return (
    <>
    <div className="bg-light p-3 mb-5 rounded">
      <div className="d-flex align-items-center justify-content-center gap-2 mb-2">
        <Input
          placeholder="Search your warranty"
          size="large"
          prefix={<SearchIcon />}
          style={{ height: "48px" }}
          onChange={(e) => {
            setSearchValue(e.target.value);
          }}
        />
        <Popover
          content={<></>}
          placement="bottomRight"
          title="Filters"
          trigger="click"
          open={open}
          onOpenChange={handleOpenChange}
        >
          <Button style={{ background: "#00348a", height: "48px" }}>
            <FilterIcon fill="white" />
          </Button>
        </Popover>
        <Button style={{ background: "#00348a", height: "48px" }} onClick={callWarrantyDetailsModal}>
          <PlusIcon fill="white" />
        </Button>
      </div>
      <div
        className="d-flex gap-2 flex-wrap mt-3"
        ref={categoryContainerRef}
        style={{
          maxHeight: showMore ? "none" : "75px", // Limit height to show two lines
          overflow: "hidden", // Hide overflow
          transition: "max-height 0.3s ease", // Smooth transition
        }}
      >
        {categories.map((category) => (
          <Button
            key={category.name}
            className={
              selectedCategories.includes(category.name)
                ? "categorySelect-selected px-3 rounded"
                : "categorySelect px-3 rounded"
            }
            style={{
              fontSize: 11,
            }}
            onClick={() => handleButtonClick(category.name)}
          >
            {category.name}
          </Button>
        ))}
      </div>
      {(shouldShowMoreButton || showMore) && (
        <Button
          type="link"
          onClick={toggleShowMore}
          style={{ marginTop: "8px" }}
        >
          {showMore ? "Show Less" : "Show More"}
        </Button>
      )}
    </div>
    <WarrantyDetailsModal
        ref={warrantyDetailsModalRef}
        warrantyDetails={warranty}
      />
    </>
  );
};

export default Filters;
