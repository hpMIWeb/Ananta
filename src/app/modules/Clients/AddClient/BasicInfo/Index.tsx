import classNames from "classnames";
import styles from "./basicInfo.module.scss";
import { Form, Select } from "antd";
import Input from "../../../..//components/ui/Input/Index";
import TextArea from "antd/es/input/TextArea";
import Button from "../../../../components/ui/Button/Index";
import uploadLogo from "../../../../../assets/images/upload_logo.png";
import Upload from "../../../../components/ui/Upload/Index";
import { useEffect, useState } from "react";

const BasicInfo = ({ onChange, setFormValue }: any) => {
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

    const handleFormValuesChange = (changedValues: any, allValues: any) => {
        if ("country" in changedValues) {
            const selectedCountryId = countriesListData.find(
                (c: any) => c.countryName === changedValues["country"]
            );
            if (selectedCountryId !== undefined) {
                fetchStates(selectedCountryId["geonameId"]);
            }
        } else if ("state" in changedValues) {
            const selectedStateId = statesListData.find(
                (c: any) => c.name === changedValues["state"]
            );
            if (selectedStateId) {
                fetchCities(selectedStateId["geonameId"]);
            }
        }
    };

    useEffect(() => {
        fetchCountries();
    }, []);

    const onFinish = (value: any) => {
        setFormValue(value);
        onChange(2);
    };

    return (
        <div>
            <Form
                name="basic"
                initialValues={{ remember: true, firmType: "Partnership" }}
                onFinish={onFinish}
                onValuesChange={handleFormValuesChange}
                autoComplete="off"
                requiredMark={false}
                className="customAddForm"
            >
                <div style={{ marginTop: 2 }} className="row">
                    <div className="col-12 col-md-9 col-lg-9">
                        <div className="row">
                            <div
                                className={classNames(
                                    "col-12 col-md-4 col-lg-4"
                                )}
                            >
                                <div className="mb-3">
                                    <label className="form-label">
                                        Client Type
                                        <sup className="text-danger fs--1">
                                            *
                                        </sup>
                                    </label>
                                    <Form.Item
                                        name="clientType"
                                        className="customAddClientSelectOptions"
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    "Please Enter Client Type!",
                                            },
                                        ]}
                                    >
                                        <Select
                                            options={[
                                                {
                                                    value: "Non Regular",
                                                    label: "Non Regular",
                                                },
                                                {
                                                    value: "Regular",
                                                    label: "Regular",
                                                },
                                            ]}
                                            placeholder="Select Type"
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
                                        <Select
                                            defaultValue="Partnership"
                                            options={[
                                                {
                                                    value: "Partnership",
                                                    label: "Partnership",
                                                },
                                                {
                                                    value: "Private",
                                                    label: "Private",
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
                                    <label className="form-label">
                                        Pan Number
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
                                        GSTIN
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
                            <div
                                className={classNames(
                                    "col-12 col-md-4 col-lg-4",
                                    styles.fieldPadding8
                                )}
                            >
                                <div>
                                    <label className="form-label">
                                        Indusrty type
                                        <sup className="text-danger fs--1">
                                            *
                                        </sup>
                                    </label>
                                    <Form.Item
                                        name="industryType"
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    "Please Enter your Indusrty type!",
                                            },
                                        ]}
                                    >
                                        <Input
                                            placeholder="Select Indusrty type"
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
                                        Line of Business
                                        <sup className="text-danger fs--1">
                                            *
                                        </sup>
                                    </label>
                                    <Form.Item
                                        name="lineOfBusiness"
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    "Please Enter your Line of Business!",
                                            },
                                        ]}
                                    >
                                        <Input
                                            placeholder="Select Line of Business"
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
                                        Group Name
                                        <sup className="text-danger fs--1">
                                            *
                                        </sup>
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
                                    <label className="form-label">
                                        File Number
                                        <sup className="text-danger fs--1">
                                            *
                                        </sup>
                                    </label>
                                    <Form.Item
                                        name="fileNumber"
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    "Please Enter your File Number!",
                                            },
                                        ]}
                                    >
                                        <Input
                                            placeholder="File Number"
                                            className="customAddFormInputText"
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
