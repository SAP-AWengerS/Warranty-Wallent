import React, {
  forwardRef,
  useContext,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { Button, Form, Input, Modal, Select, Upload } from "antd";
import {
  CloseCircleFilled,
  PlusOutlined,
} from "@ant-design/icons";
import { Axios } from "../../Config/Axios/Axios";
import LoaderOverlay from "../LoaderOverlay/LoaderOverlay";
import { UserContext } from "../../App";
import ConfirmModal from "../ConfirmModal/ConfirmModal";
import { useToast } from "../ToastContext/ToastContext";
import moment from "moment";
import { ShareIcon } from "@primer/octicons-react";
import { useWarranty } from '../WarrantyContext/WarrantyContext';

const { Option } = Select;

const WarrantyDetailsModal = forwardRef(
  ({ warrantyDetails }, ref) => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [contentLoader, setContentLoader] = useState(false);
    const [warranty, setWarranty] = useState({});
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [isError, setIsError] = useState(false);
    const [deleteBtn, setDeleteBtn] = useState(false);
    const [form] = Form.useForm();
    const [deleteForm] = Form.useForm();

    const { user } = useContext(UserContext);
    const { setWarranties, warranties } = useWarranty();
    const toastMessage = useToast();
    const token = localStorage.getItem("token");

    const categories = [
      { id: "electronics", name: "Electronics" },
      { id: "fashion", name: "Fashion" },
      { id: "home_kitchen", name: "Home & Kitchen" },
      { id: "sport", name: "Sport" },
      { id: "kids_toys", name: "Kids & Toys" },
    ];

    useEffect(() => {
      setLoading(true);
      if (warrantyDetails) {
        Axios.get(
          `/api/v1/app/warranty/getWarrantyById/${warrantyDetails?._id}`,
          {
            params: {
              id: warrantyDetails?._id,
            },
          }
        )
          .then((res) => {
            setWarranty(res.data);
            setLoading(false);
          })
          .catch((err) => {
            setWarranty({});
            setIsError(true);
            setLoading(false);
          });
      }
      setLoading(false);
    }, []);

    const showLoading = () => {
      setOpen(true);
      // setLoading(true);
    };

    useImperativeHandle(ref, () => ({
      showLoading,
    }));

    const isDisabled = () => {
      return warranty && Object.keys(warranty).length > 0 && warranty.addedBy !== user.userId;
    };

    const handleDateChange = (e, dateType) => {
      const dateValue = e.target.value;
      // Convert date string to timestamp
      const timestamp = new Date(dateValue).valueOf();
      form.setFieldsValue({ [dateType]: dateValue });
    };

    const normFile = (e) => {
      if (Array.isArray(e)) {
        return e;
      }
      return e && e.fileList;
    };

    const handleDeleteForm = (e) => {
      setDeleteBtn(false);
      const { name, value } = e.target;

      form.setFieldsValue({
        [name]: value.toUpperCase(),
      });

      if (value === warrantyDetails?.itemName) {
        setDeleteBtn(true);
      }
    };

    const submitDetails = async () => {
      try {
        const values = await form.validateFields(); // Validate and get form values
        setContentLoader(true);
    
        const formData = new FormData();
        Object.keys(values).forEach((key) => {
          if (key === "invoiceURL" && values.invoiceURL?.[0]?.originFileObj && Object.keys(warranty).length === 0) {
            formData.append("invoiceFile", values.invoiceURL[0].originFileObj);
          } else if (key !== "invoiceURL") {
            formData.append(key, values[key]);
          }
        });
        formData.append("addedBy", user.userId);
    
        if (Object.keys(warranty).length > 0) {
          // Update existing warranty
          await Axios.put(
            `/api/v1/app/warranty/updateWarrantyById/${warranty?._id}`,
            formData,
            {
              headers: {
                authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
              },
            }
          ).then((res) => {
            setWarranty(res.data.warranty);  // Update the local state
            setWarranties(res.data.warranties); // Update context state
            toastMessage("success", "Warranty updated successfully!");
          });
        } else {
          // Add new warranty
          await Axios.post("/api/v1/app/warranty/addWarranty", formData, {
            headers: {
              authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }).then((res) => {
            setWarranties(res.data.warranties);  // Update context state with new warranties
            toastMessage("success", "Warranty added successfully!");
          });
        }
    
        setContentLoader(false);
        setOpen(false);
        form.resetFields();
      } catch (error) {
        console.error("Form submission failed:", error);
        toastMessage("warning", "Something went wrong!");
        setContentLoader(false);
      }
    };

    const deleteWarranty = () => {
      if (deleteWarranty) {
        Axios.delete(
          `/api/v1/app/warranty/deleteWarrantyById/${warranty._id}`,
          {
            headers: {
              authorization: `bearer ${token}`,
            },
          }
        )
          .then(() => {
            setShowDeleteConfirm(false);
            setOpen(false);
            window.location.reload();
          })
          .catch((err) => {
            console.error("Failed to delete warranty:", err);
          });
      }
    };

    const handleOk = () => {
      setShowDeleteConfirm(true);
    };

    const shareAccess = async () => {
      setLoading(true);

      const email = form.getFieldValue("shareWith");

      if (warranty && email) {
        try {
          const response = await Axios.post(
            `/api/v1/app/warranty/shareAccess/${warranty._id}`,
            { email },
            {
              headers: {
                authorization: `Bearer ${token}`,
              },
            }
          );
          setWarranty(response.data.warranty);
          console.log(response);
          
          toastMessage("success", response.data.message);
        } catch (err) {
          console.error("Failed to share access:", err);
          toastMessage("warning", err.response.data.message);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
        toastMessage(
          "warning",
          "Please enter an email address to share access."
        );
      }
    };

    const revokeAccess = async (email) => {
      setLoading(true);
      try {
        const response = await Axios.delete(
          `/api/v1/app/warranty/revokeAccess/${warranty._id}`,
          {
            headers: {
              authorization: `Bearer ${token}`,
            },
            data: { email }, // Pass email in the request body
          }
        );
        setWarranty(response.data.warranty); // Update warranty data with response
        toastMessage("success", response.data.message);
      } catch (err) {
        console.error("Failed to revoke access:", err);
        toastMessage("warning", err.response.data.message);
      } finally {
        setLoading(false);
      }
    };

    return (
      <>
        <LoaderOverlay isVisible={contentLoader} />
        <Modal
          title="Warranty Details"
          footer={
            !(isDisabled()) &&
            (warranty && Object.keys(warranty).length > 0
              ? [
                  <ConfirmModal
                    title="Confirm Action"
                    content="Are you sure you want to delete?"
                    onOk={handleOk}
                    onCancel={() => {}}
                  >
                    <Button type="primary" danger>
                      Delete
                    </Button>
                  </ConfirmModal>,
                  <Button type="primary" onClick={submitDetails}>
                    Update
                  </Button>,
                ]
              : [
                  <Button type="primary" onClick={submitDetails}>
                    Submit
                  </Button>,
                ])
          }
          open={open}
          onCancel={() => {
            setOpen(false);
            setIsError(false);
          }}
          loading={loading}
        >
          <Form
            form={form}
            name="form"
            labelCol={{ flex: "110px" }}
            labelAlign="left"
            labelWrap
            wrapperCol={{ flex: 1 }}
            colon={false}
            style={{ maxWidth: 600, marginTop: 50 }}
          >
            {warranty && warranty.invoiceURL ? (
              <Form.Item label="Invoice" name="invoiceURL">
                <Button
                  type="primary"
                  style={{ width: "100%" }}
                  onClick={() => window.open(warranty.invoiceURL, "_blank")}
                >
                  Preview
                </Button>
              </Form.Item>
            ) : (
              <Form.Item
                label="Upload Invoice"
                name="invoiceURL"
                valuePropName="fileList"
                getValueFromEvent={normFile}
                initialValue={
                  warranty &&
                  warranty.invoiceURL &&
                  warranty.invoiceURL.length > 0
                    ? [warranty.invoiceURL]
                    : []
                }
              >
                <Upload
                  listType="picture-card"
                  maxCount={1}
                  disabled={isDisabled()}
                  showUploadList={{ showRemoveIcon: true }}
                  // accept="image/*"
                >
                  <div>
                    <PlusOutlined />
                    <div style={{ marginTop: 8 }}>Upload</div>
                  </div>
                </Upload>
              </Form.Item>
            )}

            <Form.Item
              label="Category"
              name="category"
              initialValue={warranty ? warranty.category : ""}
              rules={[
                {
                  required: true,
                  message: "Please select a category",
                },
              ]}
            >
              <Select
                placeholder={"Select category"}
                disabled={isDisabled()}
              >
                {categories?.map((option) => (
                  <Option key={option.id} value={option.name}>
                    {option.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              label="Item Name"
              name="itemName"
              initialValue={warranty ? warranty.itemName : ""}
              rules={[
                {
                  required: true,
                  message: "Please enter the Item Name",
                },
              ]}
            >
              <Input
                // disabled={warranty ? true : false}
                disabled={isDisabled()}
                name="itemName"
              />
            </Form.Item>
            <Form.Item
              label="Purchase Date"
              name="purchasedOn"
              initialValue={
                warranty
                  ? moment(warranty.purchasedOn).format("YYYY-MM-DD")
                  : ""
              }
              rules={[
                {
                  required: true,
                  message: "Please select a purchase date",
                },
              ]}
            >
              <input
                type="date"
                max={moment().format("YYYY-MM-DD")}
                style={{
                  padding: "10px",
                  width: "100%",
                  border: "1px solid #ddd",
                  borderRadius: "7px",
                }}
                disabled={isDisabled()}
                onChange={(e) => handleDateChange(e, "purchasedOn")}
              />
            </Form.Item>
            <Form.Item
              label="Expiry Date"
              name="expiresOn"
              rules={[
                {
                  required: true,
                  message: "Please select a expiry date",
                },
              ]}
              initialValue={
                warranty
                  ? moment(warranty && warranty.expiresOn).format("YYYY-MM-DD")
                  : ""
              }
            >
              <input
                type="date"
                style={{
                  padding: "10px",
                  width: "100%",
                  border: "1px solid #ddd",
                  borderRadius: "7px",
                }}
                disabled={isDisabled()}
                onChange={(e) => handleDateChange(e, "expiresOn")}
              />
            </Form.Item>
            <Form.Item
              label="Description"
              name="description"
              initialValue={warranty ? warranty.description : ""}
            >
              <Input
                name="description"
                disabled={isDisabled()}
              />
            </Form.Item>
            <Form.Item
              label="Provider"
              name="warrantyProvider"
              initialValue={warranty ? warranty.warrantyProvider : ""}
            >
              <Input disabled={isDisabled()} />
            </Form.Item>
            {warranty && warranty.addedBy === user.userId && (
              <>
                <hr style={{ color: "#919191" }} />
                <Form.Item label="Share With" name="shareWith">
                  <div className="d-flex gap-2">
                    <Input />
                    <Button type="primary" onClick={shareAccess}>
                      <ShareIcon size={16} />
                    </Button>
                  </div>
                  {warranty?.sharedWith.length > 0 && (
                    <div
                      style={{ border: "1px solid #eee" }}
                      className="p-2 mt-2 rounded d-grid gap-2"
                    >
                      {warranty &&
                        warranty?.sharedWith?.map((user, index) => {
                          return (
                            <div
                              key={index}
                              className="rounded px-1 d-flex gap-2"
                              style={{
                                background: "#ddeafe",
                                width: "fit-content",
                              }}
                            >
                              <span style={{ fontSize: 14 }}>{user}</span>
                              <ConfirmModal
                                title="Remove Access"
                                content="Are you sure you want remove access for  this user?"
                                onOk={() => revokeAccess(user)}
                                onCancel={() => {}}
                              >
                                <CloseCircleFilled style={{ fontSize: 16 }} />
                              </ConfirmModal>
                            </div>
                          );
                        })}
                    </div>
                  )}
                </Form.Item>
              </>
            )}
          </Form>
        </Modal>
        <Modal
          title="Delete Warranty"
          open={showDeleteConfirm}
          onCancel={() => setShowDeleteConfirm(false)}
          footer={[
            <Button key="cancel" onClick={() => setShowDeleteConfirm(false)}>
              Cancel
            </Button>,
            <Button
              key="delete"
              type="primary"
              danger
              onClick={deleteWarranty}
              disabled={!deleteBtn}
            >
              Delete
            </Button>,
          ]}
        >
          <p>
            To confirm, type "<b>{warranty?.itemName}</b>" in the box below.
          </p>
          <Form
            form={deleteForm}
            name="deleteForm"
            labelCol={{ flex: "110px" }}
            labelAlign="left"
            labelWrap
            wrapperCol={{ flex: 1 }}
            colon={false}
          >
            <Form.Item name="deleteText">
              <Input name="deleteText" onChange={handleDeleteForm} />
            </Form.Item>
          </Form>
        </Modal>
      </>
    );
  }
);

export default WarrantyDetailsModal;
