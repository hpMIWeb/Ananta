import addSubImg from "../../../../assets/images/add-subscription.jpg";
import classNames from "classnames";
import styles from "./addEmployee.module.scss";
import Tabs from "../../../../components/Tabs/Index";
import Button from "../../../../components/Button/Index";
import Icon from "../../../../components/Icon/Index";
import { useEffect, useState } from "react";
import OwnerInfo from "./EmergencyInfo/Index";
import { useNavigate, useParams } from "react-router-dom";
import BasicInfo from "./BasicInfo/Index";
import BankDetails from "./BankDetails/Index";
import { useDispatch, useSelector } from "react-redux";
import { Form } from "antd";
import { getEmployeesReducersApi } from "../../../../redux/getEmployeesReducers";
import {
    createEmployeeReducersApi,
    resetStateCreateEmployee,
} from "../../../../redux/createEmployeeReducers";
import FormContentSkeletonLoader from "../../../../components/FormContentSkeletonLoader/Index";
import OrganisationDetails from "./OrganisationDetails/Index";
import AssignClient from "./AssignClient/Index";
import { getClientsReducersApi } from "../../../../redux/getClientsReducers";
import { getRolesReducersApi } from "../../../../redux/getRolesReducers";
import { getRoleTypeReducersApi } from "../../../../redux/getRoleTypeReducers";
import { getTeamReducersApi } from "../../../../redux/getTeamsReducer";
import { getDepartmentsReducersApi } from "../../../../redux/getDepartmentsReducers";
import { getDesignationReducersApi } from "../../../../redux/getDesignationReducers";
import { useAppDispatch } from "../../../states/store";

const AddEmployee = ({ selectedEmployeeID, selectedEmployeeData }: any) => {
    const [activeTab, setActiveTab] = useState(1);
    const [disableTabArray, setDisableTabArray] = useState({
        1: false,
        2: true,
        3: true,
        4: true,
        5: true,
    });
    const [employeeDetails, setEmployeeDetails] = useState({});
    const dispatch = useAppDispatch();
    const navigation = useNavigate();
    const { clientId } = useParams();
    const [form] = Form.useForm();
    const getEmployeesListSuccess = useSelector(
        (state: any) => state.getEmployees.success
    );
    const getEmployeesListLoading = useSelector(
        (state: any) => state.getEmployees.loading
    );
    const getEmployeesList = useSelector(
        (state: any) => state.getEmployees.data
    );

    const { loading, success } = useSelector(
        (state: any) => state.createEmployee
    );

    useEffect(() => {
        dispatch(getRolesReducersApi());
        dispatch(getRoleTypeReducersApi());
        dispatch(getDepartmentsReducersApi());
        dispatch(getClientsReducersApi());
        dispatch(getTeamReducersApi());
        dispatch(getDesignationReducersApi());
        if (!getEmployeesListSuccess) {
            dispatch(getEmployeesReducersApi());
        }
    }, []);

    const handleCancelClick = () => {
        navigation("/employee");
    };

    const setEmployeeInfo = (value: any) => {
        setEmployeeDetails((prev) => ({ ...prev, ...value }));
    };

    useEffect(() => {
        if (getEmployeesList.length && clientId) {
            const currentCardDetail = getEmployeesList.find(
                (s: any) => s._id === clientId
            );
            form.setFieldsValue(currentCardDetail);
        }
    }, [getEmployeesList, clientId, form]);

    useEffect(() => {
        if (success) {
            dispatch(resetStateCreateEmployee());
            navigation("/employee");
        }
    }, [success]);

    const onChange = (key: any, formInfo: any) => {
        if (key === 6) {
            const payload = { ...employeeDetails, ...formInfo };

            dispatch(
                createEmployeeReducersApi({
                    payload: payload,
                    employeeId: selectedEmployeeID,
                })
            );
        } else {
            setDisableTabArray((prevDisableTabArray) => ({
                ...prevDisableTabArray,
                [key]: false,
            }));
            setActiveTab(key);
        }
    };

    const items = [
        {
            key: 1,
            label: `Basic Info`,
            disabled: disableTabArray[1],
            children: (
                <BasicInfo
                    onChange={onChange}
                    setEmployeeInfo={setEmployeeInfo}
                    selectedEmployeeID={selectedEmployeeID}
                    selectedEmployeeData={selectedEmployeeData}
                />
            ),
        },
        {
            key: 2,
            label: `Organization Details`,
            disabled: disableTabArray[2],
            children: (
                <OrganisationDetails
                    onChange={onChange}
                    setEmployeeInfo={setEmployeeInfo}
                    selectedEmployeeID={selectedEmployeeID}
                    selectedEmployeeData={selectedEmployeeData}
                />
            ),
        },
        {
            key: 3,
            label: `Assign Clients`,
            disabled: disableTabArray[3],
            children: (
                <AssignClient
                    onChange={onChange}
                    setEmployeeInfo={setEmployeeInfo}
                    selectedEmployeeID={selectedEmployeeID}
                    selectedEmployeeData={selectedEmployeeData}
                />
            ),
        },
        {
            key: 4,
            label: `Bank Details`,
            disabled: disableTabArray[4],
            children: (
                <BankDetails
                    onChange={onChange}
                    setEmployeeInfo={setEmployeeInfo}
                    selectedEmployeeID={selectedEmployeeID}
                    selectedEmployeeData={selectedEmployeeData}
                />
            ),
        },
        {
            key: 5,
            label: `Emergency Details`,
            disabled: disableTabArray[5],
            children: (
                <OwnerInfo
                    onChange={onChange}
                    loading={loading}
                    setEmployeeInfo={setEmployeeInfo}
                    selectedEmployeeID={selectedEmployeeID}
                    selectedEmployeeData={selectedEmployeeData}
                />
            ),
        },
    ];

    return (
        <div
            className={classNames("card mb-3", styles.addPromoCodeCardWrapper)}
        >
            {!selectedEmployeeData ? (
                <div
                    className={classNames(
                        "card-header d-flex",
                        styles.promoCodeCardHeaderBox
                    )}
                    style={{ minHeight: 60 }}
                >
                    <div
                        className={classNames(
                            "d-flex align-items-center w-100",
                            styles.promocodeHeaderTitle
                        )}
                    >
                        <div className="me-auto">
                            <h5
                                className={classNames(
                                    "my-2 position-relative z-index-1",
                                    styles.addPromoCodeLabel
                                )}
                            >
                                Add Employee
                            </h5>
                        </div>
                        <div className={classNames("ms-auto z-index-1")}>
                            <Button
                                onClick={handleCancelClick}
                                style={{
                                    minWidth: 104,
                                }}
                                className="greyBtn"
                            >
                                Cancel
                            </Button>
                        </div>
                    </div>
                </div>
            ) : null}

            <div className={styles.addEmployeeDetailBox}>
                {getEmployeesListLoading && clientId && (
                    <FormContentSkeletonLoader />
                )}
                {!(getEmployeesListLoading && clientId) && (
                    <Tabs
                        className="subscriptionTabs"
                        defaultActiveKey="1"
                        activeKey={activeTab}
                        items={items}
                        onChange={onChange}
                    />
                )}
            </div>
        </div>
    );
};

export default AddEmployee;
