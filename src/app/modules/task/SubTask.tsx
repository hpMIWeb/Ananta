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
import { SubTask as ISubTask } from "./interfaces/ITask";
import "./subTask.scss";

const SubTask = (props: any) => {
  const subTaskObj = { subTaskId: 1, status: "Pending" } as ISubTask;
  const [subTasks, setSubTasks] = useState<ISubTask[]>([subTaskObj]);

  const addNewTask = () => {
    subTaskObj.subTaskId = subTasks.length + 1;
    setSubTasks([...subTasks, subTaskObj]);
  };

  const removeTask = (item: ISubTask) => {
    const index = subTasks.indexOf(item);
    if (index > -1) {
      const tasks = [...subTasks].filter((task: any) => {
        return task.subTaskId !== item.subTaskId;
      });
      setSubTasks(tasks);
    }
  };

  const inputChangeHandler = (
    event: any,
    subTask: ISubTask,
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

    const updatedTasks = [...subTasks].map((item: any) => {
      if (item.subTaskId === subTask.subTaskId) {
        item[name] = value;
      }
      return item;
    });

    // console.log(name, value, updatedTasks);

    setSubTasks(updatedTasks);
  };

  useEffect(() => {
    console.log(subTasks);
    if (props.subComponentsHandler) {
      props.subComponentsHandler(subTasks);
    }
  }, [subTasks]);

  return (
    <div>
      {subTasks.map((subTaskItem: any, index: number) => (
        <>
          {index !== 0 && <Divider />}
          <div key={index}>
            <div className="sub-task-header">
              <div className="sub-task-number">{index + 1}</div>
              <div className="sub-task-delete">
                <Button
                  type="primary"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => {
                    removeTask(subTaskItem);
                  }}
                >
                  Delete
                </Button>
              </div>
            </div>
            <div>
              <Form key={subTaskItem}>
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
                          inputChangeHandler(event, subTaskItem);
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
                          subTaskItem,
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
                                                    subTaskItem
                                                );
                                            }}
                                        /> */}
                    <ReactQuill
                      theme="snow"
                      value={subTaskItem.remark}
                      placeholder="Remark"
                      onChange={(event) => {
                        inputChangeHandler(event, subTaskItem, "remark");
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
                        inputChangeHandler(event, subTaskItem);
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
                        inputChangeHandler(event, subTaskItem);
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
                        inputChangeHandler(event, subTaskItem);
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
                        inputChangeHandler(event, subTaskItem);
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
        <Button type="primary" icon={<PlusOutlined />} onClick={addNewTask}>
          Add
        </Button>
      </div>
    </div>
  );
};

export default SubTask;
