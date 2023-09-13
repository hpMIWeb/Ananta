import addSubImg from "../../../../assets/images/add-subscription.jpg";
import classNames from "classnames";
import styles from "./addEmployee.module.scss";
import Tabs from "../../../components/ui/Tabs/Index";
import Button from "../../../components/ui/Button/Index";
import Icon from "../../../components/ui/Icon/Index";
import { useEffect, useState } from "react";
import OwnerInfo from "./EmergencyInfo/Index";
import { useNavigate, useParams } from "react-router-dom";
import BasicInfo from "./BasicInfo/Index";
import BankDetails from "./BankDetails/Index";
import { useDispatch, useSelector } from "react-redux";
import { Form } from "antd";
import { getEmployeesReducersApi } from "../../../../redux/getEmployeesReducers";
import { createEmployeeReducersApi } from "../../../../redux/createEmployeeReducers";
import FormContentSkeletonLoader from "../../../components/ui/FormContentSkeletonLoader/Index";
import OrganisationDetails from "./OrganisationDetails/Index";
import AssignClient from "./AssignClient/Index";
import { getClientsReducersApi } from "../../../../redux/getClientsReducers";
import { getRolesReducersApi } from "../../../../redux/getRolesReducers";
import { getRoleTypeReducersApi } from "../../../../redux/getRoleTypeReducers";
import { getDepartmentsReducersApi } from "../../../../redux/getDepartmentsReducers";
import { useAppDispatch } from "../../../../states/store";

const AddEmployee = () => {
    const [activeTab, setActiveTab] = useState(1);
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
            navigation("/employee");
        }
    }, [success]);

    const operations = (
        <Button
            onClick={handleCancelClick}
            className={classNames("cancelBtn", styles.cancelAddEmployeeBtn)}
            type="primary"
            danger
        >
            <Icon
                className={styles.cancelBtnIcon}
                name="cross"
                height={18}
                width={18}
            />
            Cancel
        </Button>
    );

    const onChange = (key: number, formInfo: any) => {
        if (key === 6) {
            const payload = { ...employeeDetails, ...formInfo };
            dispatch(
                createEmployeeReducersApi({
                    payload: payload,
                    subscriptionId: "",
                })
            );
        } else {
            setActiveTab(key);
        }
    };

    const items = [
        {
            key: 1,
            label: `Basic Info`,
            children: (
                <BasicInfo
                    onChange={onChange}
                    setEmployeeInfo={setEmployeeInfo}
                />
            ),
        },
        {
            key: 2,
            label: `Organisation Details`,
            children: (
                <OrganisationDetails
                    onChange={onChange}
                    setEmployeeInfo={setEmployeeInfo}
                />
            ),
        },
        {
            key: 3,
            label: `Assign Clients`,
            children: (
                <AssignClient
                    onChange={onChange}
                    setEmployeeInfo={setEmployeeInfo}
                />
            ),
        },
        {
            key: 4,
            label: `Bank Details`,
            children: (
                <BankDetails
                    onChange={onChange}
                    setEmployeeInfo={setEmployeeInfo}
                />
            ),
        },
        {
            key: 5,
            label: `Emergency Details`,
            children: (
                <OwnerInfo
                    onChange={onChange}
                    loading={loading}
                    setEmployeeInfo={setEmployeeInfo}
                />
            ),
        },
    ];

    const handleBulkClick = () => {
        navigation("/employee/createbulk");
    };

    return (
        <div
            className={classNames("card mb-3", styles.addPromoCodeCardWrapper)}
        >
            <div
                className={classNames(
                    "card-header d-flex",
                    styles.promoCodeCardHeaderBox
                )}
                style={{ minHeight: 90 }}
            >
                <div className="d-flex align-items-center w-100">
                    <div className="me-auto">
                        <h5
                            className={classNames(
                                "my-2 text-white position-relative z-index-1",
                                styles.addPromoCodeLabel
                            )}
                        >
                            Add Employee
                        </h5>
                    </div>
                    <div className="ms-auto z-index-1">
                        <Button
                            onClick={handleBulkClick}
                            className={styles.newPromoBtn}
                        >
                            Add In Bulk
                        </Button>
                    </div>
                </div>
                <div
                    style={{
                        backgroundImage: `url(${addSubImg})`,
                    }}
                    className={classNames(
                        "rounded-3 rounded-bottom-0",
                        styles.addPromoCodeImg
                    )}
                ></div>
            </div>
            <div className={styles.addEmployeeDetailBox}>
                {getEmployeesListLoading && clientId && (
                    <FormContentSkeletonLoader />
                )}
                {!(getEmployeesListLoading && clientId) && (
                    <Tabs
                        tabBarExtraContent={operations}
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