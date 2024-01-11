import classNames from "classnames";
import styles from "./basicInfo.module.scss";
import { Form, Select } from "antd";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import Input from "../../../../../components/Input/Index";
import TextArea from "antd/es/input/TextArea";
import Button from "../../../../../components/Button/Index";
import uploadLogo from "../../../../../assets/images/upload_logo.png";
import Upload from "../../../../../components/Upload/Index";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { firmTypes } from "../../../../../utils/constant";
import { getClientId } from "../../../../utilities/utility";

const BasicInfo = ({
    onChange,
    setFormValue,
    clientType,
    selectedClientData,
    isEdit,
    showEditButton,
}: any) => {
    const lineOfBusinessList =
        useSelector((state: any) => state.getLineOfBusiness.data) || [];
    const clientList = useSelector((state: any) => state.getClients.data) || [];
    const industryTypeList =
        useSelector((state: any) => state.getIndustryType.data) || [];
    const [countriesListData, setCountriesListData] = useState<any>([]);
    const [statesListData, setStatesListData] = useState<any>([]);
    const [citiesListData, setCitiesListData] = useState<any>([]);
    const registrationValidClientType = ["ca"];
    const [newClientId, setNewClientId] = useState<string>(getClientId());

    const validClientTypes = ["business_enterprise", "regular", "non_regular"];
    const [form] = Form.useForm();
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
            // After setting the values, re-fetch states and cities and update the dropdowns
            if (Country) {
                // Fetch states based on the selected country (Country)
                const selectedCountryId = countriesListData.find(
                    (country: any) => country.countryName === Country
                )?.geonameId;
                if (selectedCountryId) {
                    await fetchStates(selectedCountryId);
                }

                // Fetch cities based on the selected state (State)
                const selectedStateId = statesListData.find(
                    (state: any) => state.name === State
                )?.geonameId;
                if (selectedStateId) {
                    await fetchCities(selectedStateId);
                }
            }
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
        if ("firmPAN" in changedValues) {
            form.setFieldsValue({
                firmPAN: changedValues.firmPAN.toUpperCase(),
            });
        }
        if ("firmGSTIN" in changedValues) {
            form.setFieldsValue({
                firmGSTIN: changedValues.firmGSTIN.toUpperCase(),
            });
        }
        if ("firmRegistrationNo" in changedValues) {
            form.setFieldsValue({
                firmRegistrationNo:
                    changedValues.firmRegistrationNo.toUpperCase(),
            });
        }
    };

    useEffect(() => {
        fetchCountries();
    }, []);

    const onFinish = (value: any) => {
        setFormValue(value);
        onChange(4);
    };

    useEffect(() => {
        if (selectedClientData) {
            setNewClientId(selectedClientData.clientId);
            form.setFieldsValue({
                clientId: selectedClientData.clientId,
                firmName: selectedClientData.firmName,
                firmType: selectedClientData.firmType,
                firmPAN: selectedClientData.firmPAN,
                firmGSTIN: selectedClientData.firmGSTIN,
                email: selectedClientData.email,
                mobile: selectedClientData.mobile,
                firmRegistrationNo: selectedClientData.firmRegistrationNo,
                industryType: selectedClientData.industryType,
                lineOfBusiness: selectedClientData.lineOfBusiness,
                address: selectedClientData.address,
                pinCode: selectedClientData.pinCode,
                country: selectedClientData.country,
                state: selectedClientData.state,
                city: selectedClientData.city,
                groupName: selectedClientData.groupName,
                refferedBy: selectedClientData.refferedBy,
            });
        } else {
            //setNewClientId(getClientId());
            form.setFieldsValue({
                clientId: getClientId(),
            });
        }
    }, []);

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
                                            {
                                                pattern:
                                                    /^[a-zA-Z0-9&.@\/\s-]+$/,
                                                message:
                                                    "Only alphabets, numbers, spaces, &, ., @, /, and - are allowed.",
                                            },
                                        ]}
                                    >
                                        <Input
                                            placeholder="Firm Name"
                                            className="customAddFormInputText"
                                            onChange={(e: any) => {
                                                const inputValue =
                                                    e.target.value;
                                                const filteredValue =
                                                    inputValue.replace(
                                                        /[^a-zA-Z0-9&.@\/\s-]/g,
                                                        ""
                                                    ); // Remove disallowed characters
                                                e.target.value = filteredValue;
                                            }}
                                            disabled={!isEdit}
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
                                            showSearch
                                            placeholder="Select Firm Type"
                                            options={firmTypes}
                                            disabled={!isEdit}
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
                                        Client ID
                                        <sup className="text-danger fs--1">
                                            *
                                        </sup>
                                    </label>
                                    <Form.Item
                                        name="clientId"
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    "Please Enter your Client ID!",
                                            },
                                        ]}
                                    >
                                        <Input
                                            placeholder="Client ID"
                                            className="customInputNumber"
                                            disabled
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
                                            maxLength={10}
                                            disabled={!isEdit}
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
                                                    "Please enter your GSTIN!",
                                            },
                                            ({ getFieldValue }) => ({
                                                validator(rule, value) {
                                                    if (value !== undefined) {
                                                        if (
                                                            value &&
                                                            value.toUpperCase() ===
                                                                "UNREGISTERED"
                                                        ) {
                                                            return Promise.resolve();
                                                        }

                                                        const gstinRegex =
                                                            /\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}[Z]{1}[A-Z\d]{1}/;

                                                        if (
                                                            value &&
                                                            !gstinRegex.test(
                                                                value
                                                            )
                                                        ) {
                                                            return Promise.reject(
                                                                "Invalid GSTIN format!"
                                                            );
                                                        }

                                                        const gstinPAN =
                                                            value.substr(2, 10);
                                                        if (
                                                            gstinPAN !==
                                                            getFieldValue(
                                                                "firmPAN"
                                                            )
                                                        ) {
                                                            return Promise.reject(
                                                                "PAN & GSTIN do not match!"
                                                            );
                                                        }

                                                        // Skip validation if the email matches the current email
                                                        if (
                                                            value ===
                                                            selectedClientData?.firmGSTIN
                                                        ) {
                                                            return Promise.resolve();
                                                        }
                                                        const firmGSTINExistsInList =
                                                            clientList.some(
                                                                (client: any) =>
                                                                    client.firmGSTIN ===
                                                                    value
                                                            );
                                                        if (
                                                            firmGSTINExistsInList
                                                        ) {
                                                            return Promise.reject(
                                                                "GST TIN already exists in the database."
                                                            );
                                                        }

                                                        return Promise.resolve();
                                                    } else {
                                                        return Promise.reject();
                                                    }
                                                },
                                            }),
                                        ]}
                                    >
                                        <Input
                                            placeholder="GSTIN"
                                            className="customAddFormInputText"
                                            maxLength={15}
                                            disabled={!isEdit}
                                        />
                                    </Form.Item>
                                </div>
                            </div>

                            {registrationValidClientType.indexOf(clientType) !==
                                -1 && ( // Check if clientType is "CA"
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
                                                {
                                                    validator: (_, value) => {
                                                        if (
                                                            value !== undefined
                                                        ) {
                                                            if (
                                                                value &&
                                                                /^\d{6}[a-zA-Z]$/.test(
                                                                    value
                                                                )
                                                            ) {
                                                                // Skip validation if the email matches the current email
                                                                if (
                                                                    value ===
                                                                    selectedClientData?.firmRegistrationNo
                                                                ) {
                                                                    return Promise.resolve();
                                                                }
                                                                const firmGSTINExistsInList =
                                                                    clientList.some(
                                                                        (
                                                                            client: any
                                                                        ) =>
                                                                            client.firmRegistrationNo ===
                                                                            value
                                                                    );
                                                                if (
                                                                    firmGSTINExistsInList
                                                                ) {
                                                                    return Promise.reject(
                                                                        "Firm Registration No already exists in the database."
                                                                    );
                                                                }
                                                                return Promise.resolve();
                                                            } else {
                                                                return Promise.reject(
                                                                    "Enter valid Firm Registration No Format: 123456D"
                                                                );
                                                            }
                                                        } else {
                                                            return Promise.reject();
                                                        }
                                                    },
                                                },
                                            ]}
                                        >
                                            <Input
                                                placeholder="Firm Registration No"
                                                className="customAddFormInputText"
                                                maxLength={7}
                                                disabled={!isEdit}
                                            />
                                        </Form.Item>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div
                            className={classNames(
                                "row",
                                styles.formFieldWrapper
                            )}
                        ></div>
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
                                                type: "email",
                                            },
                                            {
                                                validator: (_, value) => {
                                                    // Skip validation if the email matches the current email
                                                    if (
                                                        value ===
                                                        selectedClientData?.email
                                                    ) {
                                                        return Promise.resolve();
                                                    }
                                                    const emailExistsInList =
                                                        clientList.some(
                                                            (client: any) =>
                                                                client.email ===
                                                                value
                                                        );
                                                    if (emailExistsInList) {
                                                        return Promise.reject(
                                                            "Email already exists in the database"
                                                        );
                                                    }
                                                    return Promise.resolve();
                                                },
                                            },
                                        ]}
                                    >
                                        <Input
                                            placeholder="Email"
                                            type="email"
                                            className="customAddFormInputText"
                                            disabled={!isEdit}
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
                                            {
                                                validator: (_, value) => {
                                                    if (value !== undefined) {
                                                        // Trim the input value to remove leading/trailing whitespace
                                                        const trimmedValue =
                                                            value.trim();

                                                        // Use a regular expression pattern for 12 digits
                                                        const mobileNumberPattern =
                                                            /^[0-9]{12}$/;

                                                        if (
                                                            !mobileNumberPattern.test(
                                                                trimmedValue
                                                            )
                                                        ) {
                                                            return Promise.reject(
                                                                "Invalid mobile number format"
                                                            );
                                                        }

                                                        // Skip validation if the mobile matches the current mobile
                                                        if (
                                                            value ===
                                                            selectedClientData?.mobile
                                                        ) {
                                                            return Promise.resolve();
                                                        }

                                                        const mobileExistsInList =
                                                            clientList.some(
                                                                (client: any) =>
                                                                    client.mobile ===
                                                                    value
                                                            );

                                                        if (
                                                            mobileExistsInList
                                                        ) {
                                                            return Promise.reject(
                                                                "Mobile already exists in the database"
                                                            );
                                                        }

                                                        return Promise.resolve();
                                                    } else {
                                                        return Promise.reject();
                                                    }
                                                },
                                            },
                                        ]}
                                    >
                                        <PhoneInput
                                            containerClass="phoneNumberContainerClassInput"
                                            country="in"
                                            countryCodeEditable={false}
                                            placeholder="Mobile"
                                            onChange={(data: any) => {
                                                const { hasError } = data;
                                                form.setFieldsValue({
                                                    mobile_hasError: hasError,
                                                });
                                            }}
                                            disabled={!isEdit}
                                        />
                                    </Form.Item>
                                </div>
                            </div>
                        </div>
                        {validClientTypes.includes(clientType) && (
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
                                            Industry Type
                                        </label>
                                        <Form.Item
                                            name="industryType"
                                            className="customAddFormSelectOptions"
                                        >
                                            <Select
                                                showSearch
                                                placeholder="Select Industry Type"
                                                options={industryTypeList.map(
                                                    (industryType: any) => ({
                                                        value: industryType._id,
                                                        label: industryType.name,
                                                    })
                                                )}
                                                disabled={!isEdit}
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
                                            Line Of Business
                                        </label>
                                        <Form.Item
                                            name="lineOfBusiness"
                                            className="customAddFormSelectOptions"
                                        >
                                            <Select
                                                showSearch
                                                placeholder="Select Industry Type"
                                                options={lineOfBusinessList.map(
                                                    (lineOfBusiness: any) => ({
                                                        value: lineOfBusiness._id,
                                                        label: lineOfBusiness.name,
                                                    })
                                                )}
                                                disabled={!isEdit}
                                            />
                                        </Form.Item>
                                    </div>
                                </div>
                            </div>
                        )}
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
                                    <img src={uploadLogo} alt="avatar" />
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
                                    disabled={!isEdit}
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
                                    maxLength={6}
                                    onKeyPress={(event: any) => {
                                        if (!/[0-9]/.test(event.key)) {
                                            event.preventDefault();
                                        }
                                    }}
                                    disabled={!isEdit}
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
                                    disabled={!isEdit}
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
                                    disabled={!isEdit}
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
                            <Form.Item
                                name="city"
                                className="customAddFormSelectOptions"
                            >
                                <Select
                                    placeholder="Select City"
                                    showSearch
                                    options={citiesListData.map(
                                        (city: any) => ({
                                            value: city.name,
                                            label: city.name,
                                        })
                                    )}
                                    disabled={!isEdit}
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
                            <label className="form-label">Group Name</label>
                            <Form.Item
                                name="groupName"
                                rules={[
                                    {
                                        pattern: /^[a-zA-Z0-9\s&/,.-]+$/,
                                        message:
                                            "Please enter alphanumeric characters and limited symbols: - & / , .",
                                    },
                                ]}
                            >
                                <Input
                                    placeholder="Group Name"
                                    className="customAddFormInputText"
                                    onKeyPress={(event: any) => {
                                        if (
                                            !/^[a-zA-Z0-9\s&/,.-]+$/.test(
                                                event.key
                                            )
                                        ) {
                                            event.preventDefault();
                                        }
                                    }}
                                    disabled={!isEdit}
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
                            <Form.Item
                                name="refferedBy"
                                rules={[
                                    {
                                        pattern: /^[a-zA-Z0-9\s&/,.-]+$/,
                                        message:
                                            "Please enter alphanumeric characters and limited symbols: - & / , .",
                                    },
                                ]}
                            >
                                <Input
                                    placeholder="Referred By"
                                    className="customAddFormInputText"
                                    onKeyPress={(event: any) => {
                                        if (
                                            !/^[a-zA-Z0-9\s&/,.-]+$/.test(
                                                event.key
                                            )
                                        ) {
                                            event.preventDefault();
                                        }
                                    }}
                                    disabled={!isEdit}
                                />
                            </Form.Item>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12 my-2 text-end">
                        <Form.Item>
                            <div className="ms-auto">
                                <Button
                                    className={styles.nextBtn}
                                    type="primary"
                                    htmlType="submit"
                                >
                                    Next
                                </Button>
                            </div>
                        </Form.Item>
                    </div>
                </div>
            </Form>
        </div>
    );
};

export default BasicInfo;
