import styles from "./branches.module.scss";
import classNames from "classnames";
import { Form, Select } from "antd";
import Input from "../../../../components/ui/Input/Index";
import TextArea from "antd/es/input/TextArea";
import Button from "../../../../components/ui/Button/Index";
import Icon from "../../../../components/ui/Icon/Index";
import { useEffect, useState } from "react";

const BranchInfoCard = ({
    index,
    field,
    branchDetailsFormValue,
    remove,
    onDeleteCardClick,
    countriesListData,
}: any) => {
    const [statesListData, setStatesListData] = useState([]);
    const [citiesListData, setCityListData] = useState([]);

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
                throw new Error("Failed to fetch Cities");
            }
            const data = await response.json();
            setCityListData(data.geonames);
        } catch (error) {
            // Handle errors here
            console.error("Error fetching Cities:", error);
        }
    };

    useEffect(() => {
        console.log("branchDetailsFormValue", branchDetailsFormValue);
        if (branchDetailsFormValue?.branchCountry) {
            const selectedCountryId = countriesListData.find(
                (c: any) =>
                    c.countryName === branchDetailsFormValue?.branchCountry
            ).geonameId;
            fetchStates(selectedCountryId);
        }
    }, [branchDetailsFormValue?.branchCountry]);

    useEffect(() => {
        if (branchDetailsFormValue?.branchState) {
            const selectedStateId = statesListData.find(
                (c: any) => c.name === branchDetailsFormValue?.branchState
            );
            if (selectedStateId) {
                fetchCities(selectedStateId["geonameId"]);
            }
        }
    }, [branchDetailsFormValue?.branchState]);

    return (
        <div
            key={index}
            className={classNames(
                styles.branchInfoCard,
                "bg-white border rounded-1 p-3 js-branches"
            )}
        >
            <div className="col-12 col-md-12 col-lg-12">
                <div className={styles.branchFieldWrapper}>
                    <div className={classNames("row", styles.formFieldWrapper)}>
                        <div
                            className={classNames(
                                "col-12 col-md-4 col-lg-4",
                                styles.fieldPadding8
                            )}
                        >
                            <div>
                                <label
                                    style={{ marginBottom: 7 }}
                                    className="custom-label"
                                    htmlFor={`branchGSTIN-${field.key}`}
                                >
                                    GSTIN
                                    <sup className="text-danger fs--1">*</sup>
                                </label>
                                <Form.Item
                                    {...field}
                                    name={[field.name, "branchGSTIN"]}
                                    fieldKey={[field.fieldKey, "branchGSTIN"]}
                                    rules={[
                                        {
                                            required: true,
                                            message: "Please Enter your GSTIN!",
                                        },
                                        {
                                            pattern: /^[0-9A-Za-z]{15}$/, // GSTIN pattern: 15 alphanumeric characters
                                            message: "Invalid GSTIN format!",
                                        },
                                    ]}
                                >
                                    <Input
                                        id={`branchGSTIN-${field.key}`}
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
                                <label
                                    style={{ marginBottom: 7 }}
                                    className="custom-label"
                                    htmlFor={`branchAddress-${field.key}`}
                                >
                                    Address
                                    <sup className="text-danger fs--1">*</sup>
                                </label>
                                <Form.Item
                                    {...field}
                                    name={[field.name, "branchAddress"]}
                                    fieldKey={[field.fieldKey, "branchAddress"]}
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                "Please Enter the branch address!",
                                        },
                                    ]}
                                >
                                    <TextArea
                                        id={`branchAddress-${field.key}`}
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
                                <label
                                    style={{ marginBottom: 7 }}
                                    className="custom-label"
                                    htmlFor={`branchPinCode-${field.key}`}
                                >
                                    Pin Code
                                    <sup className="text-danger fs--1">*</sup>
                                </label>
                                <Form.Item
                                    {...field}
                                    name={[field.name, "branchPinCode"]}
                                    fieldKey={[field.fieldKey, "branchPinCode"]}
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
                                        id={`branchPinCode-${field.key}`}
                                        placeholder="Pin Code"
                                        className="customAddFormInputText"
                                    />
                                </Form.Item>
                            </div>
                        </div>
                        {/* Add other branch fields here */}
                        <div
                            className={classNames(
                                "col-12 col-md-4 col-lg-4",
                                styles.fieldPadding8
                            )}
                        >
                            <div className="mb-3">
                                <label
                                    style={{ marginBottom: 7 }}
                                    className="custom-label"
                                    htmlFor={`branchCountry-${field.key}`}
                                >
                                    Country
                                    <sup className="text-danger fs--1">*</sup>
                                </label>
                                <Form.Item
                                    {...field}
                                    name={[field.name, "branchCountry"]}
                                    fieldKey={[field.fieldKey, "branchCountry"]}
                                    className="customAddFormSelectOptions"
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                "Please Select your Country!",
                                        },
                                    ]}
                                >
                                    <Select
                                        id={`branchCountry-${field.key}`}
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
                                "col-12 col-md-4 col-lg-4",
                                styles.fieldPadding8
                            )}
                        >
                            <div className="mb-3">
                                <label
                                    style={{ marginBottom: 7 }}
                                    className="custom-label"
                                    htmlFor={`branchState-${field.key}`}
                                >
                                    State
                                    <sup className="text-danger fs--1">*</sup>
                                </label>
                                <Form.Item
                                    {...field}
                                    name={[field.name, "branchState"]}
                                    fieldKey={[field.fieldKey, "branchState"]}
                                    className="customAddFormSelectOptions"
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                "Please Select your State!",
                                        },
                                    ]}
                                >
                                    <Select
                                        id={`branchState-${field.key}`}
                                        showSearch
                                        placeholder="Select State"
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
                                "col-12 col-md-4 col-lg-4",
                                styles.fieldPadding8
                            )}
                        >
                            <div className="mb-3">
                                <label
                                    style={{ marginBottom: 7 }}
                                    className="custom-label"
                                    htmlFor={`branchCity-${field.key}`}
                                >
                                    Branch City
                                </label>
                                <Form.Item
                                    {...field}
                                    name={[field.name, "branchCity"]}
                                    fieldKey={[field.fieldKey, "branchCity"]}
                                    className="customAddFormSelectOptions"
                                >
                                    <Select
                                        id={`branchCity-${field.key}`}
                                        showSearch
                                        placeholder="Select City"
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
                        <div
                            className={classNames(
                                "col-12 col-md-4 col-lg-4",
                                styles.fieldPadding8
                            )}
                        >
                            <div className="mb-3">
                                <label
                                    style={{ marginBottom: 7 }}
                                    className="custom-label"
                                    htmlFor={`seperateTallyData-${field.key}`}
                                >
                                    Separate Tally Data?
                                    <sup className="text-danger fs--1">*</sup>
                                </label>
                                <Form.Item
                                    {...field}
                                    name={[field.name, "seperateTallyData"]}
                                    fieldKey={[
                                        field.fieldKey,
                                        "seperateTallyData",
                                    ]}
                                    className="customAddFormSelectOptions"
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                "Please Select Separate Tally Data!",
                                        },
                                    ]}
                                >
                                    <Select
                                        id={`seperateTallyData-${field.key}`}
                                        placeholder="Select Type"
                                        options={[
                                            { value: true, label: "Yes" },
                                            { value: false, label: "No" },
                                        ]}
                                    />
                                </Form.Item>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="d-grid gap-2">
                <Button
                    className={classNames("cancelBtn", styles.deleteCardBtn)}
                    type="primary"
                    onClick={() => {
                        onDeleteCardClick(index);
                    }}
                    danger
                >
                    <Icon height={14} width={14} name="trashIcon" />
                    <span style={{ marginLeft: 5 }}>Delete</span>
                </Button>
            </div>
        </div>
    );
};

export default BranchInfoCard;
