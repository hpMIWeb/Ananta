import addSubImg from "../../../../assets/images/add-subscription.jpg";
import classNames from "classnames";
import styles from "./viewClient.module.scss";
import Tabs from "../../../components/Tabs/Index";
import Button from "../../../components/Button/Index";
import Icon from "../../../components/Icon/Index";
import { useEffect, useState } from "react";

import { useLocation, useNavigate } from "react-router-dom";

import { useSelector } from "react-redux";
import { Form } from "antd";
import FormContentSkeletonLoader from "../../../components/FormContentSkeletonLoader/Index";
import { getClientsReducersApi } from "../../../redux/getClientsReducers";
import { useAppDispatch } from "../../states/store";
import AddClient from "./AddClient/Index";

const ClientView = () => {
  const dispatch = useAppDispatch();
  const navigation = useNavigate();
  const { state } = useLocation();
  const [form] = Form.useForm();

  const [activeTab, setActiveTab] = useState(1);
  const [selectedClientData, setSelectedClientData] = useState<any>({});

  const getClientsList = useSelector((state: any) => state.getClients.data);
  const getClientsLoading = useSelector(
    (state: any) => state.getClients.loading
  );
  const getClientListSuccess = useSelector(
    (state: any) => state.getEmployees.success
  );

  const [clientId, setClientId] = useState<string>("");

  const { loading, success } = useSelector(
    (state: any) => state.createEmployee
  );

  useEffect(() => {
    if (state) setClientId(state.id);
  }, []);
  useEffect(() => {
    if (!getClientListSuccess) {
      dispatch(getClientsReducersApi());
    }
  }, []);

  const handleCancelClick = () => {
    navigation("/caclient");
  };

  useEffect(() => {
    if (getClientsList.length && clientId) {
      const currentCardDetail = getClientsList.find(
        (s: any) => s._id === clientId
      );
      form.setFieldsValue(currentCardDetail);
      setSelectedClientData(currentCardDetail);
    }
  }, [getClientsList, clientId, form]);

  useEffect(() => {
    if (success) {
      navigation("/caclient");
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
      label: `Profile`,
      children: <AddClient selectedClientData={selectedClientData} />,
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
              {selectedClientData.firmName}
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
        {getClientsLoading && clientId && <FormContentSkeletonLoader />}
        {!(getClientsLoading && clientId) && (
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

export default ClientView;
