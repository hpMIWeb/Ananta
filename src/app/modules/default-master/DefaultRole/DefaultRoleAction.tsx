import React, { useEffect, useState } from "react";
import { Form, Input, Select } from "antd";
import "./DefaultRole.scss";
import {
  AddDefaultRole as IAddDefaultRole,
  DefaultRole as IDefaultRole,
  DefaultRoleType as IRoleType,
} from "./interfaces/IDefaultRole";
import { toast } from "react-toastify";
import addSubImg from "../../../../assets/images/add-subscription.jpg";
import classNames from "classnames";
import styles from "./defaultRole.module.scss";

import api from "../../../utilities/apiServices";

import { useLocation, useNavigate } from "react-router-dom";
import { capitalize } from "../../../utilities/utility";
import Button from "../../../../components/Button/Index";

const DefaultRoleAction = () => {
  const [addRole, setAddRole] = useState<IAddDefaultRole>(
    {} as IAddDefaultRole
  );
  const [roleTypeList, setRoleTypeList] = useState<IRoleType[]>([]);
  const [form] = Form.useForm();
  const location = useLocation();
  const navigate = useNavigate();

  const [roleData, setRoleData] = useState<IDefaultRole>(
    location.state?.roleData || ({} as IDefaultRole)
  );
  const isEditMode = !!location.state?.roleData;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getRoleType();
    if (location.state?.roleData) {
      const roleData = location.state.roleData;
      setRoleData(roleData);

      form.setFieldsValue({
        roleName: roleData.roleName,
        roleType: roleData.roleType,
      });
    }
  }, [location.state]);

  const getRoleType = () => {
    setLoading(true); // Set loading state to true
    api
      .getRoleType()
      .then((resp: any) => {
        setRoleTypeList(resp.data);
      })
      .finally(() => {
        setLoading(false); // Reset loading state
      });
  };

  const cancelNewRoleHandler = () => {
    navigate("/default-role");
  };

  const inputChangeHandler = (event: any, nameItem: string = "") => {
    let name = "";
    let value = "";
    if (event && event.target) {
      name = event.target.name;
      value = event.target.value;
    } else if (nameItem !== "" && event !== "" && event !== undefined) {
      name = nameItem;
      value = event.value ?? event;
    } else if (event) {
      name = event.name;
      value = event.value;
    }

    setAddRole({
      ...addRole,
      [name]: value,
    });
  };

  const handleRoleAction = () => {
    setLoading(true);
    form
      .validateFields()
      .then((values) => {
        try {
          const apiCall = isEditMode
            ? api.updateDefaultRole(addRole, roleData._id)
            : api.createDefaultRole(addRole);

          apiCall
            .then((resp: any) => {
              const successMessage = isEditMode
                ? "Role Updated."
                : "Role Added.";

              toast.success(successMessage, {
                position: toast.POSITION.TOP_RIGHT,
              });
              const updateRole = resp.data;

              navigate("/default-role", {
                state: {
                  roleData: updateRole,
                  updated: !isEditMode,
                },
              });
            })
            .finally(() => {
              setLoading(false); // Reset loading state
            });
        } catch (ex) {
          setLoading(false); // Reset loading state
          toast.error("Technical error while creating Role.", {
            position: toast.POSITION.TOP_RIGHT,
          });
        }
      })
      .catch((errorInfo) => {
        setLoading(false); // Reset loading state
        console.log("Validation failed:", errorInfo);
      });
  };

  return (
    <div className={classNames("card mb-3", styles.addPromoCodeCardWrapper)}>
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
              {isEditMode ? "Update Role" : "Create New Role"}
            </h5>
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

      <div className={styles.addPromoCodeFormWrapper}>
        <Form
          form={form}
          name="basic"
          initialValues={{
            remember: true,
            type: "Percentage",
            userTypes: "all",
            userCategory: "Accountant",
            status: "Active",
          }}
          //  onFinish={onFinish}
          autoComplete="off"
          requiredMark={false}
          className="customAddForm"
        >
          <div className="formFieldRowWrapper formAddPromoWrapper">
            <div className="col-12 col-sm-6 col-md-4 formInputWrapper">
              <Form.Item
                name="roleName"
                rules={[
                  {
                    required: true,
                    message: "Please enter role name.",
                  },
                ]}
              >
                <Input
                  placeholder="Role Name"
                  name="roleName"
                  onChange={(event: any) => {
                    inputChangeHandler(event);
                  }}
                  className="w100"
                />
              </Form.Item>
            </div>

            <div className="col-12 col-sm-6 col-md-4 formInputWrapper">
              <Form.Item
                name="roleType"
                rules={[
                  {
                    required: true,
                    message: "Please select role type.",
                  },
                ]}
              >
                <Select
                  allowClear
                  options={roleTypeList.map((roleTypeList) => ({
                    value: roleTypeList._id,
                    label: capitalize(roleTypeList.role_type),
                  }))}
                  placeholder="Select Role Type"
                  onChange={(value, event) => {
                    inputChangeHandler(event, "roleType");
                  }}
                  showSearch={true}
                ></Select>
              </Form.Item>
            </div>
            <div className="col-12 col-sm-6 col-md-2 formInputWrapper">
              <Button type="primary" danger onClick={cancelNewRoleHandler}>
                Cancel
              </Button>
            </div>
            <div className="col-12 col-sm-6 col-md-2 formInputWrapper">
              <Button
                htmlType="submit"
                type="primary"
                onClick={handleRoleAction}
              >
                {isEditMode ? "Update Role" : "Add Role"}
              </Button>
            </div>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default DefaultRoleAction;
