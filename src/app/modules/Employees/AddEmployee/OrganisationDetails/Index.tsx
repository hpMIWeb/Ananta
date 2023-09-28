import { useSelector } from "react-redux";
import { DatePicker, Form, InputNumber, TimePicker } from "antd";
import styles from "./organisationDetails.module.scss";
import CardBottomAction from "../EmergencyInfo/CardBottomAction";
import { useState } from "react";
import classNames from "classnames";
import Input from "../../../../../components/Input/Index";
import Select from "../../../../../components/Select/Index";

const initialBranchInfoData = [{ type: "default", index: 0 }];

const OrganisationDetails = ({ onChange, setEmployeeInfo }: any) => {
    const getRolesList = useSelector((state: any) => state.getRoles.data) || [];
    const getTeamList = useSelector((state: any) => state.getTeams.data) || [];
    console.log("getTeamList", getTeamList);
    const getRoleTypesList =
        useSelector((state: any) => state.getRoleType.data) || [];
    const getDepartmentsList =
        useSelector((state: any) => state.getDepartments.data) || [];
    const [branchInfoData, setBranchInfoData] = useState<any>([]);
    const [branchChecked, setBranchChecked] = useState(false);
    console.log("getDepartmentsList", getDepartmentsList);
    const onFinish = (value: any) => {
        setEmployeeInfo(value);
        onChange(3);
    };

    const addMoreOwnerCard = () => {
        setBranchInfoData((prev: any) => [
            ...prev,
            { type: "new", index: branchInfoData.length },
        ]);
    };

    const onDeleteCardClick = (cardIndex: any) => {
        const newOwnerInfoData = branchInfoData.filter(
            (a: any) => a.index !== cardIndex
        );
        setBranchInfoData(newOwnerInfoData);
    };

    const handleBranchChecked = (cheked: any) => {
        setBranchChecked(cheked);
        if (cheked) {
            setBranchInfoData(initialBranchInfoData);
        } else {
            setBranchInfoData([]);
        }
    };

    return (
        <div>
            <Form
                name="basic"
                initialValues={{ remember: true }}
                onFinish={onFinish}
                autoComplete="off"
                requiredMark={false}
                className="customAddForm"
            >
                <div className="col-12 col-md-12 col-lg-12">
                    <div className={styles.branchFieldWrapper}>
                        <div
                            className={classNames(
                                "row",
                                styles.formFieldWrapper
                            )}
                        >
                            {" "}
                            <div
                                className={classNames(
                                    "col-12 col-md-3 col-lg-3",
                                    styles.fieldPadding8
                                )}
                            >
                                <div className="mb-3">
                                    <label
                                        style={{ marginBottom: 7 }}
                                        className="custom-label"
                                    >
                                        Department
                                    </label>
                                    <Form.Item
                                        name="department"
                                        className="customAddFormSelectOptions"
                                    >
                                        <Select
                                            placeholder="Select Department"
                                            options={getDepartmentsList.map(
                                                (department: any) => ({
                                                    label: department?.name,
                                                    value: department?._id,
                                                })
                                            )}
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
                                    <label
                                        style={{ marginBottom: 7 }}
                                        className="custom-label"
                                    >
                                        Team
                                    </label>
                                    <Form.Item
                                        name="team"
                                        className="customAddFormSelectOptions"
                                    >
                                        <Select
                                            placeholder="Select Team"
                                            options={getTeamList.map(
                                                (team: any) => ({
                                                    label: team?.name,
                                                    value: team?._id,
                                                })
                                            )}
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
                                    <label
                                        style={{ marginBottom: 7 }}
                                        className="custom-label"
                                    >
                                        Designation
                                    </label>
                                    <Form.Item
                                        name="designation"
                                        className="customAddFormSelectOptions"
                                    >
                                        <Select
                                            placeholder="Select Designation"
                                            options={getRoleTypesList.map(
                                                (role: any) => ({
                                                    label: role?.role_type,
                                                    value: role?._id,
                                                })
                                            )}
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
                                    <label
                                        style={{ marginBottom: 7 }}
                                        className="custom-label"
                                    >
                                        Role
                                        <sup className="text-danger fs--1">
                                            *
                                        </sup>
                                    </label>
                                    <Form.Item
                                        name="role"
                                        className="customAddFormSelectOptions"
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    "Please Select your Role!",
                                            },
                                        ]}
                                    >
                                        <Select
                                            placeholder="Select Role"
                                            options={getRolesList.map(
                                                (role: any) => ({
                                                    label: role.roleName,
                                                    value: role._id,
                                                })
                                            )}
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
                                    <label
                                        style={{ marginBottom: 7 }}
                                        className="custom-label"
                                    >
                                        Aadhar
                                    </label>
                                    <Form.Item
                                        name="aadhar"
                                        className="customAddFormSelectOptions"
                                        rules={[
                                            {
                                                len: 12,
                                                message:
                                                    "Aadhar number should be exactly 12 digits!",
                                            },
                                        ]}
                                    >
                                        <InputNumber
                                            style={{ width: "100%" }}
                                            className="customInputNumber"
                                            placeholder="Aadhar Number"
                                            min={0}
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
                                    <label
                                        style={{ marginBottom: 7 }}
                                        className="custom-label"
                                    >
                                        PAN Number
                                        <sup className="text-danger fs--1">
                                            *
                                        </sup>
                                    </label>
                                    <Form.Item
                                        name="pan"
                                        className="customAddFormSelectOptions"
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
                                            placeholder="PAN Number"
                                            className="customAddFormInputText"
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
                                    <label
                                        style={{ marginBottom: 7 }}
                                        className="custom-label"
                                    >
                                        Date of Joining
                                    </label>
                                    <Form.Item
                                        name="dateOfJoining"
                                        className="customAddFormSelectOptions"
                                    >
                                        <DatePicker
                                            placeholder="Date of Joining"
                                            className="customFormDatePicker"
                                            format="DD/MM/YYYY"
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
                                    <label
                                        style={{ marginBottom: 7 }}
                                        className="custom-label"
                                    >
                                        Last Date in Firm
                                    </label>
                                    <Form.Item
                                        name="lastDayInFirm"
                                        className="customAddFormSelectOptions"
                                    >
                                        <DatePicker
                                            placeholder="Last Date in Firm"
                                            className="customFormDatePicker"
                                            format="DD/MM/YYYY"
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
                                    <label
                                        style={{ marginBottom: 7 }}
                                        className="custom-label"
                                    >
                                        Working Time (From)
                                    </label>
                                    <Form.Item
                                        name="workingTimeFrom"
                                        className="customAddFormSelectOptions"
                                    >
                                        <TimePicker
                                            placeholder="From"
                                            className="customFormDatePicker"
                                            use12Hours
                                            format="h:mm a"
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
                                    <label
                                        style={{ marginBottom: 7 }}
                                        className="custom-label"
                                    >
                                        Working Time (To)
                                    </label>
                                    <Form.Item
                                        name="workingTimeTo"
                                        className="customAddFormSelectOptions"
                                    >
                                        <TimePicker
                                            placeholder="To"
                                            className="customFormDatePicker"
                                            format="h:mm a"
                                            use12Hours
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
                                    <label
                                        style={{ marginBottom: 7 }}
                                        className="custom-label"
                                    >
                                        Allow Login?
                                    </label>
                                    <Form.Item
                                        name="allowLogin"
                                        className="customAddFormSelectOptions"
                                    >
                                        <Select
                                            placeholder="Select Type"
                                            options={[
                                                { value: "Yes", label: "Yes" },
                                                { value: "No", label: "No" },
                                            ]}
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
                                    <label
                                        style={{ marginBottom: 7 }}
                                        className="custom-label"
                                    >
                                        Reference
                                        <sup className="text-danger fs--1">
                                            *
                                        </sup>
                                    </label>
                                    <Form.Item
                                        name="referance"
                                        className="customAddFormSelectOptions"
                                        rules={[
                                            {
                                                pattern: /^[a-zA-Z0-9]*$/,
                                                message:
                                                    "Only alphanumeric characters are allowed.",
                                            },
                                        ]}
                                    >
                                        <Input
                                            placeholder="Reference"
                                            className="customAddFormInputText"
                                        />
                                    </Form.Item>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <CardBottomAction
                    addCardClick={addMoreOwnerCard}
                    onChange={onChange}
                />
            </Form>
        </div>
    );
};

export default OrganisationDetails;
