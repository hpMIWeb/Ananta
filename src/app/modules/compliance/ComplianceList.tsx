import React, { useState, useEffect } from "react";
import type { TabsProps } from "antd";
import {
  Button,
  Space,
  Tabs,
  Typography,
  Table,
  Tag,
  Row,
  Col,
  Select,
  Switch,
} from "antd";
import {
  AddCompliance,
  AddCompliance as IAddCompliance,
  AddCompliance as ISubTask,
} from "./interfaces/ICompliance";
import dayjs from "dayjs";
import "./ComplianceList.scss";
import { useNavigate } from "react-router-dom";
import ComplianceViewEdit from "./ComplianceViewEdit";
import api from "../../utilities/apiServices";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAlignLeft,
  faCalendarAlt,
  faCalendarDays,
  faUser,
  faUserAlt,
} from "@fortawesome/free-solid-svg-icons";
import { complianceReportOpts, clientOpts } from "../../utilities/utility";
const { Title } = Typography;
const pageSize = 20;

const ComplianceList = () => {
  const [showMoreFilter, setShowMoreFilterTask] = useState<boolean>(false);

  const onSwitchMoreFilter = () => {
    setShowMoreFilterTask(!showMoreFilter);
  };
  const [current, setCurrent] = useState(1);
  const [activeTab, setActiveTab] = useState<string>("1");
  const dateFormat = "YYYY-MM-DD";
  const [fullScreenMode, setFullScreenMode] = useState<boolean>(false);
  const [reportTab, setReportTab] = useState<boolean>(false);
  const [tableRowSelected, setTableRowSelected] = useState<any>({});
  const [allCompliance, setAllCompliance] = useState<[]>([]);

  const screenModeToggle = () => {
    setFullScreenMode(!fullScreenMode);
  };

  const reportTabToggle = () => {
    setReportTab(!reportTab);
  };

  const onTabChange = (key: string) => {
    setActiveTab(key);
    setFullScreenMode(false);
    setReportTab(key === "2" ? true : false);
  };

  useEffect(() => {
    api.getAllCompliance().then((resp: any) => {
      console.log(resp.data);
      setAllCompliance(resp.data);
    });
  }, []);

  const colInfo = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (text: string) => (
        <p className="text-truncate tasklist button p nav-link">{text}</p>
      ),
    },
    {
      title: "Compliance date",
      dataIndex: "start_date",
      key: "start_date",
      render: (start_date: string) => (
        <div className="dateDisplay">
          <FontAwesomeIcon icon={faCalendarAlt} style={{}} />
          &nbsp; {dayjs(start_date).format(dateFormat)}
        </div>
      ),
    },
    {
      title: "Sub Compliance",
      dataIndex: "start1_date",
      key: "start1_date",
      render: (start_date1: string) => (
        <div className="dateDisplay">
          <FontAwesomeIcon icon={faUser} style={{}} />
          &nbsp; 0/10
        </div>
      ),
    },
    {
      title: "task date",
      dataIndex: "start_date",
      key: "start_date",
      render: (start_date: string) => (
        <div className="dateDisplay">
          <FontAwesomeIcon icon={faAlignLeft} style={{}} />
          &nbsp; 0/10
        </div>
      ),
    },
    {
      title: "Status",
      key: "status",
      dataIndex: "status",
      render: (status: string) => (
        <span>
          {[status].map((item) => {
            let color = "#fb275d";
            let title = item;
            switch (item) {
              case "completed": {
                color = "#00ca72";
                break;
              }
              case "in_progress": {
                color = "#ffcc00";
                break;
              }
              case "cancelled": {
                color = "#5e6e82";
                break;
              }
              case "1": {
                color = "#fb275d";
                title = "pending";
                break;
              }
              case "2": {
                color = "#40fb27";
                title = "completed";
              }
            }

            return (
              <Tag
                color={color}
                key={item}
                style={{ fontWeight: "500", fontSize: "12px" }}
              >
                {title.toUpperCase()}
              </Tag>
            );
          })}
        </span>
      ),
    },
  ];

  const colInfoForReportTab = [
    {
      title: "title",
      dataIndex: "title",
      key: "title",
      render: (text: string) => <p className="text-truncate">{text}</p>,
    },
  ];

  const rowClassHandler = (record: IAddCompliance) => {
    let rowClassName = "";
    switch (record.status.toLowerCase()) {
      case "pending":
      case "1": {
        rowClassName = "tasklist complianceListRow data-row-pending";
        break;
      }
      case "completed": {
        rowClassName = "tasklist complianceListRow data-row-completed";
        break;
      }
      case "in_progress": {
        rowClassName = "tasklist complianceListRow data-row-in-progress";
        break;
      }
      case "cancelled": {
        rowClassName = "tasklist complianceListRow data-row-cancel";
        break;
      }
    }
    return rowClassName;
  };

  const getData = (current: number, pageSize: number, rangeMode: string) => {
    let retVal: AddCompliance[] = [];

    switch (rangeMode) {
      case "today": {
        retVal = allCompliance.filter((item: IAddCompliance) => {
          return dayjs(item.start_date, dateFormat).isSame(
            dayjs().format(dateFormat)
          );
        });
        break;
      }
      case "report": {
        retVal = allCompliance.filter((item: IAddCompliance) => {
          return dayjs(item.start_date, dateFormat).isAfter(
            dayjs().format(dateFormat)
          );
        });
        break;
      }

      default: {
        retVal = [];
      }
    }

    return retVal
      .map((item: any, index: number) => {
        item.key = index;
        return item;
      })
      .slice((current - 1) * pageSize, current * pageSize);
  };

  const todayContent = () => {
    return (
      <div>
        <Table
          id={"complianceListRow"}
          dataSource={getData(current, pageSize, "today")}
          rowClassName={rowClassHandler}
          onRow={(record, rowIndex) => {
            return {
              onClick: (event) => {
                setTableRowSelected(record);
              },
            };
          }}
          className=""
          columns={colInfo}
          showHeader={false}
          pagination={false}
          style={{ width: "100%" }}
          size="small"
          showSorterTooltip
        />
      </div>
    );
  };

  const reportContent = () => {
    return (
      <div>
        <Row gutter={[8, 8]} className="form-row"></Row>
        <Row gutter={[8, 8]} className="form-row">
          <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 8 }}>
            <Select
              allowClear
              showSearch
              placeholder="Client"
              options={clientOpts}
              className="w100"
            />
          </Col>
          <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 8 }}>
            <Select
              allowClear
              showSearch
              placeholder="Report Type"
              options={complianceReportOpts}
              className="w100"
            />
          </Col>
          <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 8 }}>
            <Switch onChange={onSwitchMoreFilter}></Switch>
          </Col>
        </Row>
        <Row
          gutter={[8, 8]}
          className={"form-row " + (!showMoreFilter ? "hide" : "")}
        >
          <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 24 }}></Col>
        </Row>
        <Table
          id={"complianceListRow"}
          dataSource={getData(current, pageSize, "today")}
          rowClassName={rowClassHandler}
          onRow={(record, rowIndex) => {
            return {
              onClick: (event) => {
                setTableRowSelected(record);
              },
            };
          }}
          columns={colInfoForReportTab}
          showHeader={true}
          style={{ width: "100%" }}
          size="small"
          showSorterTooltip
        />
      </div>
    );
  };

  const getContentRender = () => {
    switch (activeTab) {
      case "1": {
        return todayContent();
      }
      case "2": {
        return reportContent();
      }
    }
    return null;
  };

  const tabContent: TabsProps["items"] = [
    {
      key: "1",
      label: "Today",
    },
    {
      key: "2",
      label: "Report",
    },
  ];

  const navigate = useNavigate();
  const addNewComplianceHandler = () => {
    navigate("/add-compliance");
  };

  return (
    <>
      <div>
        <Title level={5}>Compliance</Title>
      </div>

      <div
        className="task-list-header"
        style={{ borderBottom: "2px solid #d8e2ef" }}
      >
        <div>
          <Tabs
            defaultActiveKey="1"
            items={tabContent}
            onChange={onTabChange}
            style={{ width: "100%" }}
          ></Tabs>
        </div>
        <div className="compliance-list-add">
          <div>
            <Space>
              <Button type="primary" onClick={addNewComplianceHandler}>
                Add New Compliance
              </Button>
            </Space>
          </div>
        </div>
      </div>
      <div>
        <div
          style={{
            width: reportTab ? "100%" : "64%",
            float: "left",
            display: fullScreenMode ? "none" : "block",
            marginRight: "15px",
          }}
        >
          {getContentRender()}
        </div>
        {tableRowSelected && Object.keys(tableRowSelected).length > 0 && (
          <div
            style={{
              float: "right",
              width: fullScreenMode ? "100%" : "35%",
              display: reportTab ? "none" : "",
              //textAlign: "right",
              //border: "1px solid #d8e2ef",
            }}
          >
            <ComplianceViewEdit
              handleScreenMode={screenModeToggle}
              fullScreenMode={fullScreenMode}
              tableRowSelected={tableRowSelected}
              isEdit={false}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default ComplianceList;
