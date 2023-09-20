import React, { useEffect, useState } from "react";
import { Button, Col, Divider, Row, Table, Typography } from "antd";
import styles from "./role.module.scss";
import addSubImg from "../../../../assets/images/add-subscription.jpg";
import classNames from "classnames";

import { SearchOutlined } from "@ant-design/icons";
import "./Role.scss";
import { AddRole as IAddRole, Role as IRole } from "./interfaces/IRole";
import { ToastContainer, toast } from "react-toastify";

import api from "../../../utilities/apiServices";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { useLocation, useNavigate } from "react-router-dom";
import LoadingSpinner from "../../../modules/LoadingSpinner"; // Update the path accordingly
import DeletePopupConfirm from "../../../../components/DeletePopupConfirm/DeletePopupConfirm";
import Input from "../../../../components/Input/Index";
import Icon from "../../../../components/Icon/Index";
const { Title } = Typography;
const pageSize = 25;

const Role = () => {
  const [current, setCurrent] = useState(1);
  const [roleList, setRoleList] = useState<IRole[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);
  const [selectedDepartmentEmployees, setSelectedDepartmentEmployees] =
    useState<IRole[]>([]);

  const navigate = useNavigate();
  const location = useLocation();

  const [loading, setLoading] = useState(true);

  const columns = [
    {
      title: "Sr.No",
      dataIndex: "srNo",
      key: "srNo",
      width: "5%",
      sorter: (a: any, b: any) => a.srNo - b.srNo,
      className: "center-align-cell",
    },
    {
      title: "Role Name",
      dataIndex: "roleName",
      width: "30%",
      sorter: (a: any, b: any) => a.roleName.localeCompare(b.roleName), // Add sorter for Role Name
    },
    {
      title: "Role Type",
      dataIndex: "roleTypeName",
      width: "25%",
      sorter: (a: any, b: any) => a.roleTypeName.localeCompare(b.roleTypeName), // Add sorter for Role Type
    },
    {
      title: "No of users",
      dataIndex: "userCount",
      width: "10%",
      className: "center-align-cell",
      render: (record: any) => (
        <span className="center-align-cell">
          {record.userCount ? record.userCount : 0}
        </span>
      ),
    },
    {
      title: "Modules",
      dataIndex: "modules",
      width: "10%",
      className: "center-align-cell",
      render: () => (
        <span>
          <img
            src={require("./Image/dd.jpg")}
            style={{ maxHeight: "20px", alignItems: "center" }}
          />
          &nbsp;&nbsp;4/8
        </span>
      ),
    },
    {
      title: "Action",
      dataIndex: "",
      key: "action",
      width: "10%",
      className: "center-align-cell",
      render: (_: any, record: IRole) => (
        <span className="actionColumn">
          <FontAwesomeIcon
            icon={faEdit}
            className="btn-at"
            title="Edit Role"
            style={{ color: "#2c7be5", marginLeft: "15px" }}
            onClick={() => editClickHandler(record)}
          />
          <Divider type="vertical" />

          <DeletePopupConfirm
            popUpTitle={`Do you want to delete ${record.roleName} Role?`}
            content=""
            onConfirm={() => deleteClickHandler(record._id)}
            button-label="Delete  Role"
          />
        </span>
      ),
    },
  ];

  useEffect(() => {
    getAllRole();
  }, []);

  const getAllRole = () => {
    setLoading(true); // Set loading state to true
    api
      .getRole()
      .then((resp: any) => {
        setRoleList(resp.data);
      })
      .finally(() => {
        setLoading(false); // Reset loading state
      });
  };

  // Search input change handler
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
  };

  const getData = (current: number, pageSize: number) => {
    const startIndex = (current - 1) * pageSize;
    let retVal = roleList;
    if (searchQuery.trim() !== "") {
      retVal = retVal.filter((item) => {
        return item.roleName.toLowerCase().includes(searchQuery.toLowerCase());
      });
    }

    return retVal.map((item: any, index: number) => {
      const serialNumber = startIndex + index + 1; // Calculate the serial number
      return {
        ...item,
        key: index,
        srNo: serialNumber, // Assign the serial number to the 'srNo' property
      };
    });
  };

  const deleteClickHandler = (roleId: string) => {
    // Delete from  DB
    setLoading(true); // Reset loading state
    api
      .deleteRole(roleId)

      .then((resp: any) => {
        const updatedData = roleList.filter(
          (item: IRole) => item._id !== roleId
        );

        setRoleList(updatedData);
        toast.success("Role successfully deleted.", {
          position: toast.POSITION.TOP_RIGHT,
        });
      })
      .catch((error) => {
        toast.error("Technical error while deleting Role.", {
          position: toast.POSITION.TOP_RIGHT,
        });
      })
      .finally(() => {
        setLoading(false); // Reset loading state
      });
  };

  const editClickHandler = (role: IRole) => {
    navigate("/role-action", {
      state: { roleData: role, updated: true },
    });
  };

  const addRoleHandler = () => {
    navigate("/role-action");
  };

  return (
    <>
      <ToastContainer autoClose={25000} />
      <LoadingSpinner isLoading={loading} />
      <div className={classNames(styles.promoCodesPageWrapper)}>
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
                Role
              </h5>
            </div>
            <div className={classNames("ms-auto z-index-1")}>
              <Button onClick={addRoleHandler} className={styles.newPromoBtn}>
                <Icon width={12.25} height={14} name="plus" />
                New
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

        {!loading && (
          <div className="client-details">
            <Row
              gutter={[8, 8]}
              className="form-row"
              style={{ marginTop: "0" }}
            >
              <Col
                xs={{ span: 24 }}
                sm={{ span: 24 }}
                md={{ span: 8 }}
                style={{
                  float: "right",
                  marginBottom: "10px",
                  marginTop: "7px",
                }}
              >
                <Input
                  placeholder="Search..."
                  className="search-box"
                  bordered={false}
                  onChange={handleSearch}
                  prefix={<SearchOutlined />}
                />
              </Col>
            </Row>
            <Table
              columns={columns}
              dataSource={getData(current, pageSize)}
              size="small"
              style={{ width: "100%" }}
              className="r4 table-striped-rows"
              bordered
            />
          </div>
        )}
      </div>
    </>
  );
};

export default Role;
