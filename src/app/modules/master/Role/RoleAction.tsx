import React, { useEffect, useState } from "react";
import { Form, Select, Typography } from "antd";
import Input from "../../../../components/Input/Index";

//import "./Role.scss";
import {
  AddRole as IAddRole,
  Role as IRole,
  RoleType as IRoleType,
} from "./interfaces/IRole";
import addSubImg from "../../../../assets/images/add-subscription.jpg";
import classNames from "classnames";
import styles from "./role.module.scss";

import { ToastContainer, toast } from "react-toastify";
import api from "../../../utilities/apiServices";
import { useLocation, useNavigate } from "react-router-dom";
import { capitalize } from "../../../utilities/utility";
import LoadingSpinner from "../../../modules/LoadingSpinner"; // Update the path accordingly
import Icon from "../../../../components/Icon/Index";
import Button from "../../../../components/Button/Index";

const { Title } = Typography;
const pageSize = 25;

const RoleAction = () => {
  const [addRole, setAddRole] = useState<IAddRole>({} as IAddRole);
  const [roleTypeList, setRoleTypeList] = useState<IRoleType[]>([]);
  const [form] = Form.useForm();
  const location = useLocation();
  const navigate = useNavigate();

  const [roleData, setRoleData] = useState<IRole>(
    location.state?.roleData || ({} as IRole)
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
    navigate("/role");
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
            ? api.updateRole(addRole, roleData._id)
            : api.createRole(addRole);

          apiCall
            .then((resp: any) => {
              const successMessage = isEditMode
                ? "Role Updated."
                : "Role Added.";

              toast.success(successMessage, {
                position: toast.POSITION.TOP_RIGHT,
              });
              const updateRole = resp.data;

              navigate("/role", {
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
      });
  };

  return (
    <div className={classNames(styles.promoCodesPageWrapper)}>
      <div
        className={classNames(
          "card-header d-flex",
          styles.promoCodesPageHeader
        )}
        style={{ minHeight: 60 }}
      >
        <div
          className={classNames(
            "d-flex align-items-center w-100",
            styles.departmentHeaderTitle
          )}
        >
          <div className="me-auto">
            <h5
              className={classNames(
                "my-2 position-relative z-index-1",
                styles.deapartmentLabel
              )}
            >
              {isEditMode ? "Update Role" : "Create New Role"}
            </h5>
          </div>
        </div>
      </div>

      <div className={styles.departmentBottomWrapper}>
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

export default RoleAction;
