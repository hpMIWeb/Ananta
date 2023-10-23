import addSubImg from "../../../../assets/images/add-subscription.jpg";
import classNames from "classnames";
import styles from "./viewEmployee.module.scss";
import Tabs from "../../../components/Tabs/Index";
import Button from "../../../components/Button/Index";
import Icon from "../../../components/Icon/Index";
import { useEffect, useState } from "react";

import { useLocation, useNavigate, useParams } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import { Form } from "antd";
import { getEmployeesReducersApi } from "../../../redux/getEmployeesReducers";
import FormContentSkeletonLoader from "../../../components/FormContentSkeletonLoader/Index";

import { getClientsReducersApi } from "../../../redux/getClientsReducers";
import { getRolesReducersApi } from "../../../redux/getRolesReducers";
import { getRoleTypeReducersApi } from "../../../redux/getRoleTypeReducers";
import { getTeamReducersApi } from "../../../redux/getTeamsReducer";
import { getDepartmentsReducersApi } from "../../../redux/getDepartmentsReducers";
import { getDesignationReducersApi } from "../../../redux/getDesignationReducers";
import { useAppDispatch } from "../../states/store";
import AddEmployee from "./AddEmployee/Index";
import SubProfile from "./SubProfile/Index";

const EmployeeView = () => {
  const dispatch = useAppDispatch();
  const navigation = useNavigate();
  const { state } = useLocation();
  const [form] = Form.useForm();

  const [activeTab, setActiveTab] = useState(1);
  const [employeeDetails, setEmployeeDetails] = useState({});
  const [selectedEmployeeData, setSelectedEmployeeData] = useState<any>({});

  const getEmployeesListSuccess = useSelector(
    (state: any) => state.getEmployees.success
  );
  const getEmployeesListLoading = useSelector(
    (state: any) => state.getEmployees.loading
  );
  const getEmployeesList = useSelector((state: any) => state.getEmployees.data);
  const [employeeId, setEmployeeId] = useState<string>("");

  const { loading, success } = useSelector(
    (state: any) => state.createEmployee
  );

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
    if (getEmployeesList.length && employeeId) {
      const currentCardDetail = getEmployeesList.find(
        (s: any) => s._id === employeeId
      );
      form.setFieldsValue(currentCardDetail);
      setSelectedEmployeeData(currentCardDetail);
    }
  }, [getEmployeesList, employeeId, form]);

  useEffect(() => {
    if (success) {
      navigation("/employee");
    }
  }, [success]);

  const onChange = (key: any, formInfo: any) => {
    setActiveTab(key);
  };

  const items = [
    {
      key: 1,
      label: `Dashboard`,
    },
    {
      key: 2,
      label: `Performance`,
    },
    {
      key: 3,
      label: `Sub Profile`,
      children: <SubProfile selectedEmployeeData={selectedEmployeeData} />,
    },
    {
      key: 4,
      label: `Role & Access`,
    },
    {
      key: 5,
      label: `Profile`,
      children: (
        <AddEmployee
          selectedEmployeeID={employeeId}
          selectedEmployeeData={selectedEmployeeData}
        />
      ),
    },
    {
      key: 6,
      label: `Setting`,
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
              {selectedEmployeeData.firstName} {selectedEmployeeData.lastName}
            </h5>
          </div>
          <div className={classNames("ms-auto z-index-1")}>
            <Button
              onClick={handleCancelClick}
              className="greyBtn"
              shape="round"
            >
              <Icon
                height={14}
                width={8.75}
                name="prevArrow"
                className="rotateRevere"
              />
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

export default EmployeeView;
