import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  Button,
  Select,
  Row,
  Col,
  Upload,
  Divider,
  TimePicker,
} from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import {
  assigneeOpts,
  clientOpts,
  priorityOpts,
} from "../../utilities/utility";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { SubCompliance as ISubCompliance } from "./interfaces/ICompliance";
import "./subCompliance.scss";

const SubCompliance = (props: any) => {
  const subComplianceObj = {
    subComplianceId: 1,
    status: "Pending",
  } as ISubCompliance;
  const [subTasks, setCompliance] = useState<ISubCompliance[]>([
    subComplianceObj,
  ]);

  const addNewCompliance = () => {
    subComplianceObj.subComplianceId = subTasks.length + 1;
    setCompliance([...subTasks, subComplianceObj]);
  };

  const removeTask = (item: ISubCompliance) => {
    const index = subTasks.indexOf(item);
    if (index > -1) {
      const compliance = [...subTasks].filter((compliance: any) => {
        return compliance.subComplianceId !== item.subComplianceId;
      });
      setCompliance(compliance);
    }
  };

  const inputChangeHandler = (
    event: any,
    subCompliance: ISubCompliance,
    nameItem: string = ""
  ) => {
    let name: any = "";
    let value: any = "";

    if (event && event.target) {
      name = event.target.name;
      value = event.target.value;
    } else if (nameItem !== "" && event !== "") {
      name = nameItem;
      value = event;
    } else if (event) {
      name = event.name;
      value = event.value;
    }

    const updatedCompliance = [...subTasks].map((item: any) => {
      if (item.subComplianceId === subCompliance.subComplianceId) {
        item[name] = value;
      }
      return item;
    });

    // console.log(name, value, updatedCompliance);

    setCompliance(updatedCompliance);
  };

  useEffect(() => {
    console.log(subTasks);
    if (props.subComponentsHandler) {
      props.subComponentsHandler(subTasks);
    }
  }, [subTasks]);

  return (
    <div>
      {subTasks.map((subComplianceItem: any, index: number) => (
        <>
          {index !== 0 && <Divider />}
          <div key={index}>
            <div className="sub-compliance-header">
              <div className="sub-compliance-number">{index + 1}</div>
              <div className="sub-compliance-delete">
                <Button
                  type="primary"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => {
                    removeTask(subComplianceItem);
                  }}
                >
                  Delete
                </Button>
              </div>
            </div>
            <div>
              <Form key={subComplianceItem}>
                <Row gutter={[8, 8]} className="form-row">
                  <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 16 }}>
                    <Form.Item
                      name={"title_" + index}
                      rules={[
                        {
                          required: true,
                          message: "Please enter subtitle name.",
                        },
                      ]}
                    >
                      <Input
                        placeholder="Sub Task"
                        name={"title_" + index}
                        onChange={(event) => {
                          inputChangeHandler(event, subComplianceItem);
                        }}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 8 }}>
                    <TimePicker
                      placeholder="Time"
                      name="budgetTime"
                      onChange={(date, dateString) => {
                        inputChangeHandler(
                          dateString,
                          subComplianceItem,
                          "budgetTime"
                        );
                      }}
                      className="w100"
                    />
                  </Col>
                </Row>
                <Row gutter={[8, 8]} className="form-row">
                  <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 24 }}>
                    {/* <Input
                                            placeholder="Remark"
                                            name="remark"
                                            onChange={(event) => {
                                                inputChangeHandler(
                                                    event,
                                                    subComplianceItem
                                                );
                                            }}
                                        /> */}
                    <ReactQuill
                      theme="snow"
                      value={subComplianceItem.remark}
                      placeholder="Remark"
                      onChange={(event) => {
                        inputChangeHandler(event, subComplianceItem, "remark");
                      }}
                    />
                  </Col>
                </Row>
                <Row gutter={[8, 8]} className="form-row">
                  <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 8 }}>
                    <Select
                      allowClear
                      showSearch
                      placeholder="Client"
                      options={clientOpts}
                      onChange={(value, event) => {
                        inputChangeHandler(event, subComplianceItem);
                      }}
                      className="w100"
                    />
                  </Col>
                  <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 8 }}>
                    <Select
                      allowClear
                      showSearch
                      placeholder="Assign Person"
                      options={assigneeOpts}
                      onChange={(value, event) => {
                        inputChangeHandler(event, subComplianceItem);
                      }}
                      className="w100"
                    ></Select>
                  </Col>
                  <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 8 }}>
                    <Select
                      allowClear
                      placeholder="Priority"
                      options={priorityOpts}
                      onChange={(value, event) => {
                        inputChangeHandler(event, subComplianceItem);
                      }}
                      className="w100"
                    />
                  </Col>
                </Row>
                <Row gutter={[8, 8]} className="form-row">
                  <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 4 }}>
                    <Upload>
                      <Button type="primary">Attach Files</Button>
                    </Upload>
                  </Col>
                  <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 20 }}>
                    <Input
                      placeholder="Data Path"
                      name="dataPath"
                      onChange={(event) => {
                        inputChangeHandler(event, subComplianceItem);
                      }}
                      className="w100"
                    />
                  </Col>
                </Row>
              </Form>
            </div>
          </div>
        </>
      ))}
      <div className="sub-task-add">
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={addNewCompliance}
        >
          Add
        </Button>
      </div>
    </div>
  );
};

export default SubCompliance;
