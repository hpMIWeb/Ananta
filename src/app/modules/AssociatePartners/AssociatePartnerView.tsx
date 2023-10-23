import classNames from "classnames";
import styles from "./viewAssocicatePartner.module.scss";
import Tabs from "../../../components/Tabs/Index";
import Button from "../../../components/Button/Index";
import Icon from "../../../components/Icon/Index";
import { useEffect, useState } from "react";

import { useLocation, useNavigate } from "react-router-dom";

import { useSelector } from "react-redux";
import { Form } from "antd";
import FormContentSkeletonLoader from "../../../components/FormContentSkeletonLoader/Index";

import { useAppDispatch } from "../../states/store";
import { getAssociatePartnerReducersApi } from "../../../redux/getAssociatePartnerReducers";
import SubProfile from "./SubProfile/Index";
import AddAssociatePartners from "./AddAssociatePartners/Index";

const AssociatePartnerView = () => {
  const dispatch = useAppDispatch();
  const navigation = useNavigate();
  const { state } = useLocation();
  const [form] = Form.useForm();

  const [activeTab, setActiveTab] = useState(1);
  const [selectedAssociatePartnerData, setSelectedAssociatePartnerData] =
    useState<any>({});

  const getAssociatePartnerListSuccess = useSelector(
    (state: any) => state.getAssociatePartner.success
  );
  const getAssociatePartnerListLoading = useSelector(
    (state: any) => state.getAssociatePartner.loading
  );
  const getAssociatePartnerList = useSelector(
    (state: any) => state.getAssociatePartner.data
  );
  const [associatePartnerId, setAssociatePartnerId] = useState<string>("");

  const { loading, success } = useSelector(
    (state: any) => state.createEmployee
  );

  useEffect(() => {
    if (state) setAssociatePartnerId(state.id);
  }, []);
  useEffect(() => {
    if (!getAssociatePartnerListSuccess) {
      dispatch(getAssociatePartnerReducersApi());
    }
  }, []);

  const handleCancelClick = () => {
    navigation("/associatePartners");
  };

  // const setEmployeeInfo = (value: any) => {
  //   setEmployeeDetails((prev) => ({ ...prev, ...value }));
  // };

  useEffect(() => {
    if (getAssociatePartnerList.length && associatePartnerId) {
      const currentCardDetail = getAssociatePartnerList.find(
        (s: any) => s._id === associatePartnerId
      );
      form.setFieldsValue(currentCardDetail);
      setSelectedAssociatePartnerData(currentCardDetail);
    }
  }, [getAssociatePartnerList, associatePartnerId, form]);

  useEffect(() => {
    if (success) {
      navigation("/associatePartners");
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
      // children: (
      //   <SubProfile
      //     selectedAssociatePartnerData={selectedAssociatePartnerData}
      //   />
      // ),
    },
    {
      key: 4,
      label: `Role & Access`,
    },
    {
      key: 5,
      label: `Profile`,
      children: (
        <AddAssociatePartners
          selectedAssociatePartnerData={selectedAssociatePartnerData}
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
              {selectedAssociatePartnerData.firmName}s{" "}
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
        {getAssociatePartnerListLoading && associatePartnerId && (
          <FormContentSkeletonLoader />
        )}
        {!(getAssociatePartnerListLoading && associatePartnerId) && (
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

export default AssociatePartnerView;
