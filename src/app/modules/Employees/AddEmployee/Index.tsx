import addSubImg from "../../../../assets/images/add-subscription.jpg";
import classNames from "classnames";
import styles from "./addEmployee.module.scss";
import Tabs from "../../../../components/Tabs/Index";
import Button from "../../../../components/Button/Index";
import Icon from "../../../../components/Icon/Index";
import { useEffect, useState } from "react";
import OwnerInfo from "./EmergencyInfo/Index";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import BasicInfo from "./BasicInfo/Index";
import BankDetails from "./BankDetails/Index";
import { useDispatch, useSelector } from "react-redux";
import { Form } from "antd";
import { getEmployeesReducersApi } from "../../../../redux/getEmployeesReducers";
import { createEmployeeReducersApi } from "../../../../redux/createEmployeeReducers";
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

const AddEmployee = () => {
  const [activeTab, setActiveTab] = useState(1);
  const [disableTabArray, setDisableTabArray] = useState({
    1: false,
    2: true,
    3: true,
    4: true,
    5: true,
  });
  const [employeeDetails, setEmployeeDetails] = useState({});
  const [selectedEmployeeData, setSelectedEmployeeData] = useState<any>({});
  const dispatch = useAppDispatch();
  const navigation = useNavigate();
  const { state } = useLocation();
  const [form] = Form.useForm();
  const getEmployeesListSuccess = useSelector(
    (state: any) => state.getEmployees.success
  );
  const getEmployeesListLoading = useSelector(
    (state: any) => state.getEmployees.loading
  );
  const getEmployeesList = useSelector((state: any) => state.getEmployees.data);

  const { loading, success } = useSelector(
    (state: any) => state.createEmployee
  );
  const [employeeId, setEmployeeId] = useState<string>("");
  useEffect(() => {
    if (state) setEmployeeId(state.id);
  }, []);

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
    if (success) {
      navigation("/employee");
    }
  }, [success]);

  const onChange = (key: any, formInfo: any) => {
    console.log("key", key);
    if (key === 6) {
      const payload = { ...employeeDetails, ...formInfo };
      console.log("payload", payload);

      dispatch(
        createEmployeeReducersApi({
          payload: payload,
          employeeId: "",
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
          employeeId={employeeId}
        />
      ),
    },
    {
      key: 2,
      label: `Organisation Details`,
      disabled: disableTabArray[2],
      children: (
        <OrganisationDetails
          onChange={onChange}
          setEmployeeInfo={setEmployeeInfo}
          employeeId={employeeId}
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
          employeeId={employeeId}
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
          employeeId={employeeId}
        />
      ),
    },
    {
      key: 5,
      label: `Emergency Details`,
      disabled: disableTabArray[5],
      children: (
        <OwnerInfo
          employeeId={employeeId}
          onChange={onChange}
          loading={loading}
          setEmployeeInfo={setEmployeeInfo}
        />
      ),
    },
  ];

  return (
    <div className={classNames("card mb-3", styles.addPromoCodeCardWrapper)}>
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
      <div className={styles.addEmployeeDetailBox}>
        {getEmployeesListLoading && employeeId && <FormContentSkeletonLoader />}
        {!(getEmployeesListLoading && employeeId) && (
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
