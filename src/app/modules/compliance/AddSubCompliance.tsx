import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  Button,
  Select,
  Row,
  Col,
  Divider,
  TimePicker,
} from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { priorityOpts, workAreaOpts } from "../../utilities/utility";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
  SubCompliance as ISubCompliance,
  IClientDetails,
} from "./interfaces/ICompliance";
import "./subCompliance.scss";
import ComplianceDetails from "./ComplianceDetails";
import Stopwatch from "../../../components/Stockwatch/Stopwatch";
import customParseFormat from "dayjs/plugin/customParseFormat";
import dayjs from "dayjs";
import { nanoid } from "@reduxjs/toolkit";
import { useAppDispatch } from "../../states/store";
import { useSelector } from "react-redux";
import { getClientsReducersApi } from "../../../redux/getClientsReducers";
import { getEmployeesReducersApi } from "../../../redux/getEmployeesReducers";
dayjs.extend(customParseFormat);

const AddSubCompliance = (props: any) => {
  const [subCompliances, setSubCompliance] = useState<ISubCompliance[]>([
    {
      _id: "1",
      status: "pending",
    } as ISubCompliance,
  ]);
  const dispatch = useAppDispatch();
  const [complianceDetails, setComplianceDetails] = useState<IClientDetails[]>(
    []
  );

  useEffect(() => {}, []);

  const addNewCompliance = () => {
    const new_Id = subCompliances.length + 1;
    let newCompliance = {
      _id: new_Id.toString(),
      status: "pending",
    } as ISubCompliance;

    setSubCompliance([...subCompliances, newCompliance]);

    // TODO: update parent compliance
    // if (props.updateClients) {
    //     props.updateClients(subCompliances);
    // }
  };

  const removeTask = (item: ISubCompliance) => {
    const index = subCompliances.indexOf(item);
    if (index > -1) {
      const compliance = [...subCompliances].filter((compliance: any) => {
        return compliance._id !== item._id;
      });
      setSubCompliance(compliance);
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

    const updatedCompliance = [...subCompliances].map((item: any) => {
      if (item._id === subCompliance._id) {
        item[name] = value;
      }
      return item;
    });

    setSubCompliance(updatedCompliance);
  };

  const complianceDetailsHandler = (details: IClientDetails[]) => {
    const matchedItem = subCompliances.find((item: ISubCompliance) => {
      return (
        item._id === (details && details.length > 0 && details[0].parentId)
      );
    });

    if (matchedItem) {
      let newDataWithoutId = [];
      //TODO: need with API team _id Parameter discuss
      const complianceData = JSON.parse(JSON.stringify(details));
      for (const obj of complianceData) {
        const newObj = { ...obj }; // Create a shallow copy of the object
        delete newObj._id;
        newDataWithoutId.push(newObj);
      }
      matchedItem.clients = newDataWithoutId;
      setComplianceDetails(newDataWithoutId);
      //setSubCompliance([...subCompliances, matchedItem]);

      if (props.subComponentsHandler) {
        props.subComponentsHandler(newDataWithoutId);
      }
    }
  };

  useEffect(() => {
    if (props.subComponentsHandler) {
      props.subComponentsHandler(subCompliances);
    }
  }, [subCompliances]);

  return (
    <>
      <div>
        {subCompliances &&
          subCompliances.length > 0 &&
          subCompliances.map(
            (subComplianceItem: ISubCompliance, index: number) => (
              <div key={subComplianceItem._id}>
                {index !== 0 && (
                  <Divider style={{ backgroundColor: "#9da9bb" }} />
                )}
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
                <div className="sub-compliance-content">
                  <Row gutter={[8, 8]} className="form-row">
                    <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 12 }}>
                      <Form.Item
                        name={"sub_compliance_title" + index}
                        rules={[
                          {
                            required: true,
                            message: "Please enter Compliance.",
                          },
                        ]}
                      >
                        <Input
                          placeholder="Sub Compliance"
                          name={"title"}
                          value={subComplianceItem.title}
                          onChange={(event) => {
                            inputChangeHandler(
                              event,
                              subComplianceItem,
                              "title"
                            );
                          }}
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 6 }}>
                      <Form.Item
                        name={"sub_compliance_budget_time" + index}
                        rules={[
                          {
                            required: true,
                            message: "Please select budget time.",
                          },
                          {
                            pattern: /^(?:[01]\d|2[0-3]):[0-5]\d$/,
                            message:
                              "Please enter a valid time in the format HH:mm.",
                          },
                          ({ getFieldValue }) => ({
                            validator(_, value) {
                              if (value !== "00:00") {
                                return Promise.resolve();
                              }
                              return Promise.reject(
                                new Error("Budget Time cannot be set to 00:00.")
                              );
                            },
                          }),
                        ]}
                      >
                        <Input
                          placeholder="Budget Time"
                          name="budget_time"
                          onInput={(event) => {
                            const inputElement =
                              event.target as HTMLInputElement;
                            let input = inputElement.value;
                            input = input.replace(/[^0-9]/g, ""); // Remove non-numeric characters

                            if (input.length >= 3) {
                              input = input.slice(0, 2) + ":" + input.slice(2);
                            }

                            inputElement.value = input;
                            inputChangeHandler(
                              event,
                              subComplianceItem,
                              "budget_time"
                            );
                          }}
                          onChange={(dateString) => {
                            inputChangeHandler(
                              dateString,
                              subComplianceItem,
                              "budget_time"
                            );
                          }}
                          className="w100"
                          maxLength={5}
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 6 }}>
                      <Form.Item
                        name={"sub_compliance_work_area" + index}
                        rules={[
                          {
                            required: true,
                            message: "Please select work area.",
                          },
                        ]}
                      >
                        <Select
                          allowClear
                          placeholder="Select Work Area"
                          options={workAreaOpts}
                          value={subComplianceItem.workArea}
                          className="w100"
                          onChange={(value, event) => {
                            inputChangeHandler(event, subComplianceItem);
                          }}
                        ></Select>
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={[8, 8]} className="form-row">
                    <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 18 }}>
                      <Form.Item
                        name={"remak_" + index}
                        rules={[
                          {
                            required: false,
                            message: "Please entre remark.",
                          },
                        ]}
                      >
                        <ReactQuill
                          id={"subCompliance" + index}
                          theme="snow"
                          value={subComplianceItem.remark || ""}
                          placeholder="SubCompliance Remark"
                          onChange={(event) => {
                            inputChangeHandler(
                              event,
                              subComplianceItem,
                              "remark"
                            );
                          }}
                          style={{
                            minHeight: "0 !important",
                          }}
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 6 }}>
                      <Form.Item
                        name={"sub_compliance_priority" + index}
                        rules={[
                          {
                            required: true,
                            message: "Please select priority.",
                          },
                        ]}
                      >
                        <Select
                          allowClear
                          placeholder="Priority"
                          options={priorityOpts}
                          onChange={(value, event) => {
                            inputChangeHandler(event, subComplianceItem);
                          }}
                          className="w100"
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={[8, 8]} className="form-row">
                    <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 24 }}>
                      <ComplianceDetails
                        updateClients={complianceDetailsHandler}
                        isAllowAdd={true}
                        parentTitle={"sub_compliance"}
                        parentId={subComplianceItem._id}
                        scroll={{ x: 1000 }}
                        data={[]}
                        isEdit={true}
                      />
                    </Col>
                  </Row>
                </div>
              </div>
            )
          )}
      </div>
      <div className="sub-task-add">
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={addNewCompliance}
        >
          Add
        </Button>
      </div>
    </>
  );
};

export default AddSubCompliance;
