import { useEffect, useState } from "react";
import styles from "./subProfile.module.scss";
import classNames from "classnames";
import SubscriptionCard from "../../../../components/SubscriptionCard/Index";
import Button from "../../../../components/Button/Index";
import { useNavigate } from "react-router-dom";
import NoDataAvailable from "../../../../components/NoDataAvailable/Index";
import { useSelector } from "react-redux";
import { getEmployeesReducersApi } from "../../../../redux/getEmployeesReducers";
import { createEmployeeReducersApi } from "../../../../redux/createEmployeeReducers";
import CardContentSkeletonLoader from "../../../../components/CardContentSkeletonLoader/Index";
import { useAppDispatch } from "../../../states/store";
import { getCurrentItemNumber } from "../../../utilities/utility";
import { DatePicker, Form, Modal } from "antd";
import Input from "../../../../components/Input/Index";
import Select from "../../../../components/Select/Index";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import TextArea from "antd/es/input/TextArea";
import Upload from "../../../../components/Upload/Index";
import uploadLogo from "../../../../assets/images/upload_logo.png";
import { getRolesReducersApi } from "../../../../redux/getRolesReducers";
import { getRoleTypeReducersApi } from "../../../../redux/getRoleTypeReducers";
import { getDepartmentsReducersApi } from "../../../../redux/getDepartmentsReducers";
import { getTeamReducersApi } from "../../../../redux/getTeamsReducer";
import { getDesignationReducersApi } from "../../../../redux/getDesignationReducers";

const SubProfile = ({ selectedEmployeeData }: any) => {
  const navigation = useNavigate();
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();
  // const getEmployeesList = useSelector((state: any) => state.getEmployees.data);
  const getEmployeesLoading = useSelector(
    (state: any) => state.getEmployees.loading
  );

  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [subProfileList, setSubProfileList] = useState<any>([]);

  const getRolesList = useSelector((state: any) => state.getRoles.data) || [];
  const getTeamList = useSelector((state: any) => state.getTeams.data) || [];
  const getDesignationList =
    useSelector((state: any) => state.getDesignation.data) || [];

  const getDepartmentsList =
    useSelector((state: any) => state.getDepartments.data) || [];

  function generateUniqueEmployeeID() {
    // You can use a timestamp or a random number to create a unique ID
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `E-${random}`;
  }

  const showModal = () => {
    form.setFieldsValue({ subProfileId: generateUniqueEmployeeID() });
    setOpen(true);
  };

  const handleOk = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setOpen(false);
    }, 3000);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const handleViewBtnClick = (id: string) => {
    console.log(id);
  };

  useEffect(() => {
    setSubProfileList(selectedEmployeeData.subProfile);
    dispatch(getDepartmentsReducersApi());
    dispatch(getRolesReducersApi());
    dispatch(getRoleTypeReducersApi());
    dispatch(getTeamReducersApi());
    dispatch(getDesignationReducersApi());
  }, []);

  const onChangeActiveClick = (e: any, id: any) => {
    dispatch(
      createEmployeeReducersApi({
        payload: { status: !!e ? true : false },
        employeeId: id,
      })
    );
  };
  const cardDesc = (cardData: any) => {
    console.log("subProfile", cardData);

    return [
      {
        iconName: "client",
        descComponent: (
          <>
            <p className="mb-0 fs--1 description-label">Department</p>
            <p className="semiBold">
              {" "}
              {cardData.department?.name || "Department Not Available"}
            </p>
          </>
        ),
      },
      {
        iconName: "employee",
        descComponent: (
          <>
            <p className="mb-0 fs--1 description-label">Designation</p>
            <p className="semiBold">
              {cardData.designation?.name || "Designation Not Available"}
            </p>
          </>
        ),
      },
      {
        iconName: "transaction",
        descComponent: (
          <>
            <div>
              <p className="mb-0 fs--1 description-label">Role</p>
              <p className="semiBold">
                {cardData.role?.roleName || "Role Not Available"}
              </p>
            </div>
          </>
        ),
      },
      {
        iconName: "storage",
        descComponent: (
          <>
            <p className="mb-0 fs--1 description-label">Client Assign</p>
            <p className="semiBold">0</p>
          </>
        ),
      },
      {
        iconName: "subscribe",
        descComponent: (
          <>
            <p className="mb-0 fs--1 description-label">Current Task</p>
            <p className="semiBold">3/6</p>
          </>
        ),
      },
      {
        iconName: "cash",
        descComponent: (
          <>
            <p className="mb-0 fs--1 description-label">Total Task</p>
            <p className="semiBold">56/85</p>
          </>
        ),
      },
      {
        iconName: "order",
        descComponent: (
          <>
            <p className="mb-0 fs--1 description-label">Pending Approval</p>
            <p className="semiBold">56</p>
          </>
        ),
      },
      {
        iconName: "time",
        descComponent: (
          <>
            <p className="mb-0 fs--1 description-label">Total Hours</p>
            <p className="semiBold">45:11 Hours</p>
          </>
        ),
      },
      {
        iconName: "time",
        descComponent: (
          <>
            <p className="mb-0 fs--1 description-label">Billable Hours</p>
            <p className="semiBold">45:11 Hours</p>
          </>
        ),
      },
    ];
  };

  const onFinish = (value: any) => {
    console.log("value", value);
    const newSubProfile = [...subProfileList, value];
    //  onChange(2);
    setSubProfileList(newSubProfile);

    dispatch(
      createEmployeeReducersApi({
        payload: { subProfile: newSubProfile },
        employeeId: selectedEmployeeData._id,
      })
    );
  };

  return (
    <div className={styles.promoCodesPageWrapper}>
      <div
        className={classNames(
          "card-header d-flex",
          styles.promoCodesPageHeader
        )}
      >
        <div
          className={classNames(
            "d-flex align-items-center w-100",
            styles.promocodeHeaderTitle
          )}
        >
          <div className={classNames("ms-auto z-index-1")}>
            <Button
              onClick={showModal}
              className={styles.newPromoBtn}
              type="primary"
            >
              Add New
            </Button>
          </div>
        </div>
      </div>
      <div className={styles.promoCodesBottomWrapper}>
        {getEmployeesLoading && <CardContentSkeletonLoader />}
        {!getEmployeesLoading &&
          subProfileList.map((card: any, index: number) => (
            <SubscriptionCard
              displayIndex={index + 1}
              key={card._id}
              id={card._id}
              planNameLabelBlue
              column={3}
              cardDetails={card}
              titleDesc={card.subProfileId}
              planName={card.firstName + " " + card.lastName}
              cardDesc={cardDesc}
              isProfileViewAction
              onChangeActiveClick={onChangeActiveClick}
              isActive={card.status}
              handleViewBtnClick={handleViewBtnClick}
            />
          ))}

        {!getEmployeesLoading && !subProfileList.length && (
          <NoDataAvailable name="No Sub Profile Available!" />
        )}
      </div>
      <Modal
        open={open}
        onOk={handleOk}
        onCancel={handleCancel}
        width={1000}
        footer=""
      >
        <div>
          <Form
            form={form}
            name="basic"
            onFinish={onFinish}
            autoComplete="off"
            requiredMark={false}
            className="customAddForm"
          >
            <div style={{ marginTop: 2 }} className="row">
              <div className="col-12 col-md-9 col-lg-9">
                <div className="row">
                  <div className={classNames("col-12 col-md-4 col-lg-4")}>
                    <div className="mb-3">
                      <label className="form-label">
                        Sub Profile ID
                        <sup className="text-danger fs--1">*</sup>
                      </label>
                      <Form.Item
                        name="subProfileId"
                        className="customAddEmployeeSelectOptions"
                        rules={[
                          {
                            required: true,
                            message: "Please Enter your Sub Profile ID!",
                          },
                        ]}
                      >
                        <Input
                          className="customInputNumber"
                          placeholder="Sub Profile ID"
                        />
                      </Form.Item>
                    </div>
                  </div>
                </div>
                <div className={classNames("row", styles.formFieldWrapper)}>
                  <div
                    className={classNames(
                      "col-12 col-md-4 col-lg-4",
                      styles.fieldPadding8
                    )}
                  >
                    <div>
                      <label className="form-label">
                        First Name
                        <sup className="text-danger fs--1">*</sup>
                      </label>
                      <Form.Item
                        name="firstName"
                        rules={[
                          {
                            required: true,
                            message: "Please Enter your First Name!",
                          },
                          {
                            pattern: /^[A-Za-z]+$/,
                            message: "Only alphabetic characters are allowed.",
                          },
                        ]}
                      >
                        <Input
                          placeholder="First Name"
                          className="customAddFormInputText"
                        />
                      </Form.Item>
                    </div>
                  </div>
                  <div
                    className={classNames(
                      "col-12 col-md-4 col-lg-4",
                      styles.fieldPadding8
                    )}
                  >
                    <div>
                      <label className="form-label">Middle Name</label>
                      <Form.Item
                        name="middleName"
                        rules={[
                          {
                            pattern: /^[A-Za-z]+$/,
                            message: "Only alphabetic characters are allowed.",
                          },
                        ]}
                      >
                        <Input
                          placeholder="Middle Name"
                          className="customAddFormInputText"
                        />
                      </Form.Item>
                    </div>
                  </div>
                  <div
                    className={classNames(
                      "col-12 col-md-4 col-lg-4",
                      styles.fieldPadding8
                    )}
                  >
                    <div>
                      <label className="form-label">
                        Last Name
                        <sup className="text-danger fs--1">*</sup>
                      </label>
                      <Form.Item
                        name="lastName"
                        rules={[
                          {
                            required: true,
                            message: "Please Enter your Last Name!",
                          },
                          {
                            pattern: /^[A-Za-z]+$/,
                            message: "Only alphabetic characters are allowed.",
                          },
                        ]}
                      >
                        <Input
                          placeholder="Last Name"
                          className="customAddFormInputText"
                        />
                      </Form.Item>
                    </div>
                  </div>

                  <div
                    className={classNames(
                      "col-12 col-md-4 col-lg-4",
                      styles.fieldPadding8
                    )}
                  >
                    <div>
                      <label className="form-label">Gender</label>
                      <Form.Item name="gender">
                        <Select
                          placeholder="Select Gender"
                          options={[
                            {
                              value: "male",
                              label: "Male",
                            },
                            {
                              value: "female",
                              label: "Female",
                            },
                            {
                              value: "other",
                              label: "Other",
                            },
                          ]}
                        />
                      </Form.Item>
                    </div>
                  </div>
                  <div
                    className={classNames(
                      "col-12 col-md-4 col-lg-4",
                      styles.fieldPadding8
                    )}
                  >
                    <div>
                      <label className="form-label">Date of Birth</label>
                      <Form.Item name="dateOfBirth">
                        <DatePicker
                          placeholder="Date of Birth"
                          className="customFormDatePicker"
                          format="DD/MM/YYYY"
                        />
                      </Form.Item>
                    </div>
                  </div>
                  <div
                    className={classNames(
                      "col-12 col-md-4 col-lg-4",
                      styles.fieldPadding8
                    )}
                  >
                    <div>
                      <label className="form-label">Blood Group</label>
                      <Form.Item name="bloodGroup">
                        <Select
                          placeholder="Select Blood Group"
                          options={[
                            { value: "A+", label: "A+" },
                            { value: "A-", label: "A-" },
                            { value: "B+", label: "B+" },
                            { value: "B-", label: "B-" },
                            { value: "O+", label: "O+" },
                            { value: "O-", label: "O-" },
                            { value: "AB+", label: "AB+" },
                            { value: "AB-", label: "AB-" },
                          ]}
                        />
                      </Form.Item>
                    </div>
                  </div>
                  <div
                    className={classNames(
                      "col-12 col-md-4 col-lg-4",
                      styles.fieldPadding8
                    )}
                  >
                    <div>
                      <label className="form-label">
                        Email
                        <sup className="text-danger fs--1">*</sup>
                      </label>
                      <Form.Item
                        name="email"
                        rules={[
                          {
                            required: true,
                            message: "Please Enter your Email!",
                          },
                        ]}
                      >
                        <Input
                          placeholder="Email"
                          type="email"
                          className="customAddFormInputText"
                        />
                      </Form.Item>
                    </div>
                  </div>
                  <div
                    className={classNames(
                      "col-12 col-md-4 col-lg-4",
                      styles.fieldPadding8
                    )}
                  >
                    <div>
                      <label className="form-label">
                        Mobile
                        <sup className="text-danger fs--1">*</sup>
                      </label>
                      <Form.Item
                        name="mobile"
                        rules={[
                          {
                            required: true,
                            message: "Please Enter your Mobile!",
                          },
                          ({ getFieldValue }) => ({
                            validator(_, value) {
                              const hasError = getFieldValue("mobile_hasError");
                              if (hasError) {
                                return Promise.reject(
                                  new Error(
                                    "Please enter a valid mobile number."
                                  )
                                );
                              }
                              return Promise.resolve();
                            },
                          }),
                        ]}
                      >
                        <PhoneInput
                          placeholder="Mobile"
                          containerClass="phoneNumberContainerClassInput"
                          country="in"
                          countryCodeEditable={false}
                          onChange={(data: any) => {
                            const { hasError } = data;
                            form.setFieldsValue({
                              mobile_hasError: hasError,
                            });
                          }}
                        />
                      </Form.Item>
                    </div>
                  </div>

                  <div
                    className={classNames(
                      "col-12 col-md-4 col-lg-4",
                      styles.fieldPadding8
                    )}
                  >
                    <div>
                      <label className="form-label">Alternative Mobile</label>
                      <Form.Item name="alternateMobile">
                        <PhoneInput
                          placeholder="Mobile"
                          containerClass="phoneNumberContainerClassInput"
                          country="in"
                          countryCodeEditable={false}
                          onChange={(data: any) => {
                            const { hasError } = data;
                            form.setFieldsValue({
                              mobile_hasError: hasError,
                            });
                          }}
                        />
                      </Form.Item>
                    </div>
                  </div>
                </div>
                <div className="row"></div>
              </div>
              <div className="col-12 col-md-3 col-lg-3 text-center">
                <div className={styles.avatarOutlineBoxWrapper}>
                  <div className="h-100 w-100 rounded-circle overflow-hidden position-relative">
                    <Upload
                      name="avatar"
                      listType="picture-circle"
                      className="avatar-uploader"
                      showUploadList={false}
                      // action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                      // beforeUpload={beforeUpload}
                      // onChange={handleChange}
                    >
                      <img
                        src={uploadLogo}
                        alt="avatar"
                        style={{ width: "100%" }}
                      />
                    </Upload>
                  </div>
                </div>
                <div className={styles.uploadLogoText}>Upload Logo</div>
              </div>
            </div>

            <div className={classNames("row", styles.formFieldWrapper)}>
              <div
                className={classNames(
                  "col-12 col-md-3 col-lg-3",
                  styles.fieldPadding8
                )}
              >
                <div className="mb-3">
                  <label style={{ marginBottom: 7 }} className="custom-label">
                    Department
                  </label>
                  <Form.Item
                    name="department"
                    className="customAddFormSelectOptions"
                  >
                    <Select
                      placeholder="Select Department"
                      options={getDepartmentsList.map((department: any) => ({
                        label: department?.name,
                        value: department?._id,
                      }))}
                    />
                  </Form.Item>
                </div>
              </div>
              <div
                className={classNames(
                  "col-12 col-md-3 col-lg-3",
                  styles.fieldPadding8
                )}
              >
                <div className="mb-3">
                  <label style={{ marginBottom: 7 }} className="custom-label">
                    Team
                  </label>
                  <Form.Item name="team" className="customAddFormSelectOptions">
                    <Select
                      placeholder="Select Team"
                      options={getTeamList.map((team: any) => ({
                        label: team?.name,
                        value: team?._id,
                      }))}
                    />
                  </Form.Item>
                </div>
              </div>
              <div
                className={classNames(
                  "col-12 col-md-3 col-lg-3",
                  styles.fieldPadding8
                )}
              >
                <div className="mb-3">
                  <label style={{ marginBottom: 7 }} className="custom-label">
                    Designation
                  </label>
                  <Form.Item
                    name="designation"
                    className="customAddFormSelectOptions"
                  >
                    <Select
                      placeholder="Select Designation"
                      options={getDesignationList.map((designation: any) => ({
                        label: designation?.name,
                        value: designation?._id,
                      }))}
                    />
                  </Form.Item>
                </div>
              </div>
              <div
                className={classNames(
                  "col-12 col-md-3 col-lg-3",
                  styles.fieldPadding8
                )}
              >
                <div className="mb-3">
                  <label style={{ marginBottom: 7 }} className="custom-label">
                    Role
                    <sup className="text-danger fs--1">*</sup>
                  </label>
                  <Form.Item
                    name="role"
                    className="customAddFormSelectOptions"
                    rules={[
                      {
                        required: true,
                        message: "Please Select your Role!",
                      },
                    ]}
                  >
                    <Select
                      placeholder="Select Role"
                      options={getRolesList.map((role: any) => ({
                        label: role.roleName,
                        value: role._id,
                      }))}
                    />
                  </Form.Item>
                </div>
              </div>
            </div>
            <div className="d-flex">
              <div className="me-auto"></div>
              <div className="ms-auto">
                <Button
                  style={{ minWidth: 104, marginRight: 12 }}
                  className="greyBtn"
                  onClick={handleCancel}
                >
                  Cancel
                </Button>
                <Button
                  className={styles.nextBtn}
                  loading={loading}
                  type="primary"
                  htmlType="submit"
                >
                  Save
                </Button>
              </div>
            </div>
          </Form>
        </div>
      </Modal>
    </div>
  );
};

export default SubProfile;
