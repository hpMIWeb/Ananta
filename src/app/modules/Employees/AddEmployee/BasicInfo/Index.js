import classNames from "classnames";
import { useEffect, useState } from "react";
import { DatePicker, Form, InputNumber, Select } from "antd";
import { PhoneInput } from "react-contact-number-input";
import styles from "./basicInfo.module.scss";
import Input from "../../../../../components/Input/Index";
import TextArea from "antd/es/input/TextArea";
import Button from "../../../../../components/Button/Index";
import uploadLogo from "../../../../../assets/images/upload_logo.png";
import Upload from "../../../../../components/Upload/Index";
import axios from "axios";

const BasicInfo = ({ onChange, setEmployeeInfo }) => {
  const [form] = Form.useForm();
  const [countriesListData, setCountriesListData] = useState([]);
  const [statesListData, setStatesListData] = useState([]);
  const [citiesListData, setCitiesListData] = useState([]);

  const fetchCountries = async () => {
    try {
      const response = await fetch(
        "http://api.geonames.org/countryInfoJSON?username=cuirato"
      );
      if (!response.ok) {
        throw new Error("Failed to fetch countries");
      }
      const data = await response.json();
      setCountriesListData(data.geonames);
    } catch (error) {
      // Handle errors here
      console.error("Error fetching countries:", error);
    }
  };

  const getPostalCodeData = async (changedValues) => {
    try {
      const response = await axios.get(
        `https://api.postalpincode.in/pincode/${changedValues?.pinCode}`
      );
      const { Country, State, District } = response?.data[0]?.PostOffice[0];

      // Set the retrieved values in the form fields
      form.setFieldsValue({
        country: Country,
        state: State,
        city: District,
      });
    } catch (error) {
      console.error("Error fetching location data:", error);
    }
  };

  const fetchStates = async (geonameId) => {
    try {
      const response = await fetch(
        `http://api.geonames.org/childrenJSON?geonameId=${geonameId}&username=cuirato`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch states");
      }
      const data = await response.json();
      setStatesListData(data.geonames);
    } catch (error) {
      // Handle errors here
      console.error("Error fetching countries:", error);
    }
  };

  const fetchCities = async (geonameId) => {
    try {
      const response = await fetch(
        `http://api.geonames.org/childrenJSON?geonameId=${geonameId}&username=cuirato`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch states");
      }
      const data = await response.json();
      setCitiesListData(data.geonames);
    } catch (error) {
      // Handle errors here
      console.error("Error fetching countries:", error);
    }
  };

  const handleFormValuesChange = (changedValues, allValues) => {
    if ("country" in changedValues) {
      const selectedCountryId = countriesListData.find(
        (c) => c.countryName === changedValues["country"]
      ).geonameId;
      fetchStates(selectedCountryId);
    } else if ("state" in changedValues) {
      const selectedStateId = statesListData.find(
        (c) => c.name === changedValues["state"]
      ).geonameId;
      fetchCities(selectedStateId);
    }
    if ("pinCode" in changedValues && changedValues.pinCode.length === 6) {
      getPostalCodeData(changedValues);
    }
  };

  useEffect(() => {
    fetchCountries();
  }, []);

  const onFinish = (value) => {
    const mobilePhoneNumber = value.mobile.phoneNumber;
    const formattedMobilePhoneNumber = mobilePhoneNumber.replace("-", "");
    const combinedMobile = `${
      value.mobile.validData.countryCode || "+91"
    }${formattedMobilePhoneNumber}`;

    const alternateMobilePhoneNumber = value.alternateMobile.phoneNumber;
    const combinedAlternateMobile = alternateMobilePhoneNumber
      ? `${
          value.alternateMobile.countryCode || "+91"
        }${alternateMobilePhoneNumber}`
      : null;
    setEmployeeInfo({
      ...value,
      employeeId: `${value.employeeId}`,
      mobile: combinedMobile?.replace(/-/g, ''),
      alternateMobile: combinedAlternateMobile?.replace(/-/g, ''),
    });
    onChange(2);
  };

  return (
    <div>
      <Form
        form={form}
        name="basic"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onValuesChange={handleFormValuesChange}
        autoComplete="off"
        requiredMark={false}
        className="customAddForm"
      >
        <div style={{ marginTop: 2 }} className="row">
          <div className="col-12 col-md-9 col-lg-9">
            <div className="row">
              <div className={classNames("col-12 col-md-4 col-lg-4")}>
                <div className="mb-3">
                  <label className="form-label" for="">
                    Employee Id<sup class="text-danger fs--1">*</sup>
                  </label>
                  <Form.Item
                    name="employeeId"
                    className="customAddEmployeeSelectOptions"
                    rules={[
                      {
                        required: true,
                        message: "Please Enter Employee Id!",
                      },
                      {
                        pattern: /^[a-zA-Z0-9]+$/,
                        message: "Only alphanumeric characters are allowed.",
                      },
                    ]}
                  >
                    <InputNumber
                      style={{ width: "100%" }}
                      className="customInputNumber"
                      placeholder="Employee Id"
                      min={0}
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
                  <label className="form-label" for="">
                    First Name<sup class="text-danger fs--1">*</sup>
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
                  <label className="form-label" for="">
                    Middle Name
                  </label>
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
                  <label className="form-label" for="">
                    Last Name<sup class="text-danger fs--1">*</sup>
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
                  <label className="form-label" for="">
                    Gender
                  </label>
                  <Form.Item name="gender">
                    <Select
                      placeholder="Select Gender"
                      options={[
                        { value: "male", label: "Male" },
                        { value: "female", label: "Female" },
                        { value: "other", label: "Other" },
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
                  <label className="form-label" for="">
                    Date of Birth
                  </label>
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
                  <label className="form-label" for="">
                    Blood Group
                  </label>
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
                  <label className="form-label" for="">
                    Email<sup class="text-danger fs--1">*</sup>
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
                  <label className="form-label" for="">
                    Mobile<sup class="text-danger fs--1">*</sup>
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
                              new Error("Please enter a valid mobile number.")
                            );
                          }
                          return Promise.resolve();
                        },
                      }),
                    ]}
                  >
                    <PhoneInput
                      containerClass="phoneNumberContainerClassInput"
                      countryCode="in"
                      placeholder="Mobile"
                      onChange={(data) => {
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
                  <label className="form-label" for="">
                    Alt Mobile
                  </label>
                  <Form.Item
                    name="alternateMobile"
                    rules={[
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (getFieldValue("alternateMobile_hasError")) {
                            return Promise.reject(
                              new Error("Please enter a valid number.")
                            );
                          }
                          if (!value) {
                            return Promise.reject(
                              new Error("Alternate mobile is required.")
                            );
                          }
                          return Promise.resolve();
                        },
                      }),
                    ]}
                  >
                    <PhoneInput
                      containerClass="phoneNumberContainerClassInput"
                      countryCode="in"
                      placeholder="Alt Mobile"
                      onChange={(data) => {
                        const { hasError, phoneNumber, countryCode } = data;
                        form.setFieldsValue({
                          alternateMobile_hasError: hasError,
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
              "col-12 col-md-8 col-lg-8",
              styles.fieldPadding8
            )}
          >
            <div>
              <label className="form-label" for="">
                Address<sup class="text-danger fs--1">*</sup>
              </label>
              <Form.Item
                name="address"
                rules={[
                  {
                    required: true,
                    message: "Please Enter your Address!",
                  },
                ]}
              >
                <TextArea
                  placeholder="Address"
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
              <label className="form-label" for="">
                Pin Code<sup class="text-danger fs--1">*</sup>
              </label>
              <Form.Item
                name="pinCode"
                rules={[
                  {
                    required: true,
                    message: "Please Enter your Pin Code!",
                  },
                  {
                    pattern: /^[0-9]{6}$/,
                    message:
                      "Invalid Pin Code format. Please enter a valid 6-digit Pin Code.",
                  },
                ]}
              >
                <Input
                  placeholder="Pin Code"
                  className="customAddFormInputText"
                />
              </Form.Item>
            </div>
          </div>

          <div
            className={classNames(
              "col-12 col-md-4 col-lg-4 mb-3",
              styles.fieldPadding8
            )}
          >
            <div>
              <label className="form-label" for="">
                Country
              </label>
              <Form.Item name="country" className="customAddFormSelectOptions">
                <Select
                  placeholder="Select Country"
                  showSearch
                  options={countriesListData.map((country) => ({
                    value: country.countryName,
                    label: country.countryName,
                  }))}
                />
              </Form.Item>
            </div>
          </div>

          <div
            className={classNames(
              "col-12 col-md-4 col-lg-4 mb-3",
              styles.fieldPadding8
            )}
          >
            <div>
              <label className="form-label" for="">
                State
              </label>
              <Form.Item name="state" className="customAddFormSelectOptions">
                <Select
                  placeholder="Select State"
                  showSearch
                  options={statesListData.map((state) => ({
                    value: state.name,
                    label: state.name,
                  }))}
                />
              </Form.Item>
            </div>
          </div>
          <div
            className={classNames(
              "col-12 col-md-4 col-lg-4 mb-3",
              styles.fieldPadding8
            )}
          >
            <div>
              <label className="form-label" for="">
                City
              </label>
              <Form.Item name="city">
                <Select
                  placeholder="Select City"
                  showSearch
                  options={citiesListData.map((city) => ({
                    value: city.name,
                    label: city.name,
                  }))}
                />
              </Form.Item>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-12 my-2 text-end">
            <Button className={styles.nextBtn} type="primary" htmlType="submit">
              Next
            </Button>
          </div>
        </div>
      </Form>
    </div>
  );
};

export default BasicInfo;
