import classNames from "classnames";
import styles from "./basicInfo.module.scss";
import { Form, Select } from "antd";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

import Input from "../../../../../components/Input/Index";
import TextArea from "antd/es/input/TextArea";
import Button from "../../../../../components/Button/Index";
import uploadPhoto from "../../../../../assets/images/upload_photo.jpg";
import Upload from "../../../../../components/Upload/Index";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { firmTypes } from "../../../../../utils/constant";

const BasicInfo = ({
    onChange,
    setFormValue,
    partnerType,
    selectedAssociatePartnerData,
}: any) => {
    const [countriesListData, setCountriesListData] = useState<any>([]);
    const [statesListData, setStatesListData] = useState<any>([]);
    const [citiesListData, setCitiesListData] = useState<any>([]);
    const [form] = Form.useForm();
    const roleType = Cookies.get("roleTypeName");

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

    const fetchStates = async (geonameId: string) => {
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

    const fetchCities = async (geonameId: string) => {
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

    const getPostalCodeData = async (changedValues: any) => {
        try {
            const response = await axios.get(
                `https://api.postalpincode.in/pincode/${changedValues?.pinCode}`
            );
            const { Country, State, District } =
                response?.data[0]?.PostOffice[0];

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
    const handleFormValuesChange = (changedValues: any, allValues: any) => {
        if ("country" in changedValues) {
            const selectedCountryId = countriesListData.find(
                (c: any) => c.countryName === changedValues["country"]
            ).geonameId;
            fetchStates(selectedCountryId);
        } else if ("state" in changedValues) {
            const selectedStateId = statesListData.find(
                (c: any) => c.name === changedValues["state"]
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

    useEffect(() => {
        if (selectedAssociatePartnerData) {
            form.setFieldsValue({
                firmName: selectedAssociatePartnerData.firmName,
                firmType: selectedAssociatePartnerData.firmType,
                partnerId: selectedAssociatePartnerData.partnerId,
                firmPAN: selectedAssociatePartnerData.firmPAN,
                firmGSTIN: selectedAssociatePartnerData.firmGSTIN,
                firmRegistrationNo:
                    selectedAssociatePartnerData.firmRegistrationNo,
                email: selectedAssociatePartnerData.email,
                mobile: selectedAssociatePartnerData.mobile,
                address: selectedAssociatePartnerData.address,
                pinCode: selectedAssociatePartnerData.pinCode,
                country: selectedAssociatePartnerData.country,
                state: selectedAssociatePartnerData.state,
                city: selectedAssociatePartnerData.city,
                groupName: selectedAssociatePartnerData.groupName,
                referredBy: selectedAssociatePartnerData.referredBy,
            });
        }
    }, []);

    const onFinish = (value: any) => {
        console.log("basic details ", value);
        setFormValue(value);
        onChange(2);
    };

    return (
        <div>
            <Form
                form={form}
                name="basic"
                onFinish={onFinish}
                onValuesChange={handleFormValuesChange}
                autoComplete="off"
                requiredMark={false}
                className="customAddForm"
            >
                <div style={{ marginTop: 2 }} className="row">
                    <div className="col-12 col-md-9 col-lg-9">
                        <div
                            className={classNames(
                                "row",
                                styles.formFieldWrapper
                            )}
                        >
                            <div
                                className={classNames(
                                    "col-12 col-md-4 col-lg-4",
                                    styles.fieldPadding8
                                )}
                            >
                                <div>
                                    <label className="form-label">
                                        Firm Name
                                        <sup className="text-danger fs--1">
                                            *
                                        </sup>
                                    </label>
                                    <Form.Item
                                        name="firmName"
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    "Please Enter your Firm Name!",
                                            },
                                        ]}
                                    >
                                        <Input
                                            placeholder="Firm Name"
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
                                        Firm Type
                                    </label>
                                    <Form.Item
                                        name="firmType"
                                        className="customAddFormSelectOptions"
                                    >
                                        <Select options={firmTypes} />
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
                                        Partner ID
                                        <sup className="text-danger fs--1">
                                            *
                                        </sup>
                                    </label>
                                    <Form.Item
                                        name="partnerId"
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    "Please Enter your Partner ID!",
                                            },
                                        ]}
                                    >
                                        <Input
                                            placeholder="Partner ID"
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
                                        Firm PAN
                                        <sup className="text-danger fs--1">
                                            *
                                        </sup>
                                    </label>
                                    <Form.Item
                                        name="firmPAN"
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    "Please Enter your PAN Number!",
                                            },
                                            {
                                                pattern:
                                                    /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
                                                message:
                                                    "Invalid PAN Number! Format: ABCDE1234F",
                                            },
                                        ]}
                                    >
                                        <Input
                                            placeholder="Pan Number"
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
                                        Firm GSTIN
                                        <sup className="text-danger fs--1">
                                            *
                                        </sup>
                                    </label>
                                    <Form.Item
                                        name="firmGSTIN"
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    "Please Enter your GSTIN!",
                                            },
                                            {
                                                pattern: /^[0-9A-Za-z]{15}$/, // GSTIN pattern: 15 alphanumeric characters
                                                message:
                                                    "Invalid GSTIN format!",
                                            },
                                        ]}
                                    >
                                        <Input
                                            placeholder="GSTIN"
                                            className="customAddFormInputText"
                                        />
                                    </Form.Item>
                                </div>
                            </div>

                            {partnerType === "ca" && ( // Check if partnerType is "CA"
                                <div
                                    className={classNames(
                                        "col-12 col-md-4 col-lg-4",
                                        styles.fieldPadding8
                                    )}
                                >
                                    <div>
                                        <label className="form-label">
                                            Firm Registration No
                                            <sup className="text-danger fs--1">
                                                *
                                            </sup>
                                        </label>
                                        <Form.Item
                                            name="firmRegistrationNo"
                                            rules={[
                                                {
                                                    required: true,
                                                    message:
                                                        "Please Enter your Firm Registration No!",
                                                },
                                            ]}
                                        >
                                            <Input
                                                placeholder="Firm Registration No"
                                                className="customAddFormInputText"
                                            />
                                        </Form.Item>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="row"></div>
                        <div
                            className={classNames(
                                "row",
                                styles.formFieldWrapper
                            )}
                        >
                            <div
                                className={classNames(
                                    "col-12 col-md-4 col-lg-4",
                                    styles.fieldPadding8
                                )}
                            >
                                <div>
                                    <label className="form-label">
                                        Email
                                        <sup className="text-danger fs--1">
                                            *
                                        </sup>
                                    </label>
                                    <Form.Item
                                        name="email"
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    "Please Enter your Email!",
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
                                        <sup className="text-danger fs--1">
                                            *
                                        </sup>
                                    </label>
                                    <Form.Item
                                        name="mobile"
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    "Please Enter your Mobile!",
                                            },
                                        ]}
                                    >
                                        <PhoneInput
                                            containerClass="phoneNumberContainerClassInput"
                                            country="in"
                                            placeholder="Mobile"
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

                        <div
                            className={classNames(
                                "row",
                                styles.formFieldWrapper
                            )}
                        ></div>
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
                                        src={uploadPhoto}
                                        alt="avatar"
                                        style={{ width: "100%" }}
                                    />
                                </Upload>
                            </div>
                        </div>
                        <div className={styles.uploadLogoText}>
                            Upload Photo
                        </div>
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
                            <label className="form-label">
                                Address
                                <sup className="text-danger fs--1">*</sup>
                            </label>
                            <Form.Item
                                rules={[
                                    {
                                        required: true,
                                        message: "Please Enter Address!",
                                    },
                                ]}
                                name="address"
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
                            <label className="form-label">
                                Pin Code
                                <sup className="text-danger fs--1">*</sup>
                            </label>
                            <Form.Item
                                name="pinCode"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please Enter Pin Code!",
                                    },
                                    {
                                        pattern: /^[0-9]{6}$/, // Pin Code pattern: 6 digits
                                        message: "Invalid Pin Code format!",
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
                            <label className="form-label">Country</label>
                            <Form.Item
                                name="country"
                                className="customAddFormSelectOptions"
                            >
                                <Select
                                    showSearch
                                    placeholder="Select Country"
                                    options={countriesListData.map(
                                        (country: any) => ({
                                            value: country.countryName,
                                            label: country.countryName,
                                        })
                                    )}
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
                            <label className="form-label">State</label>
                            <Form.Item
                                name="state"
                                className="customAddFormSelectOptions"
                            >
                                <Select
                                    placeholder="Select State"
                                    showSearch
                                    options={statesListData.map(
                                        (state: any) => ({
                                            value: state.name,
                                            label: state.name,
                                        })
                                    )}
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
                            <label className="form-label">City</label>
                            <Form.Item name="city">
                                <Select
                                    placeholder="Select City"
                                    showSearch
                                    options={citiesListData.map(
                                        (city: any) => ({
                                            value: city.name,
                                            label: city.name,
                                        })
                                    )}
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
                                Group Name
                                <sup className="text-danger fs--1">*</sup>
                            </label>
                            <Form.Item
                                name="groupName"
                                rules={[
                                    {
                                        required: true,
                                        message:
                                            "Please Enter your Group Name!",
                                    },
                                ]}
                            >
                                <Input
                                    placeholder="Group Name"
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
                            <label className="form-label">Referred By</label>
                            <Form.Item name="referredBy">
                                <Input
                                    placeholder="Referred By"
                                    className="customAddFormInputText"
                                />
                            </Form.Item>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12 my-2 text-end">
                        <Form.Item>
                            <Button
                                className={styles.nextBtn}
                                type="primary"
                                htmlType="submit"
                            >
                                Next
                            </Button>
                        </Form.Item>
                    </div>
                </div>
            </Form>
        </div>
    );
};

export default BasicInfo;
