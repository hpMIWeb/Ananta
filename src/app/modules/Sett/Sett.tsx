import React, { useState } from "react";
import {
    Button,
    Checkbox,
    Col,
    Input,
    Radio,
    RadioChangeEvent,
    Row,
    Space,
    Switch,
    Tabs,
    TabsProps,
    Typography,
} from "antd";
import "./Sett.scss";
import { CheckboxValueType } from "antd/es/checkbox/Group";
const { Title } = Typography;

const Sett = () => {
    const [value, setValue] = useState(1);

    const onChange1 = (checked: boolean) => {
        console.log(`switch to ${checked}`);
    };
    const onChange = (e: RadioChangeEvent) => {
        console.log("radio checked", e.target.value);
        setValue(e.target.value);
    };
    const onChange2 = (checkedValues: CheckboxValueType[]) => {
        console.log("checked = ", checkedValues);
    };

    const [activeTab, setActiveTab] = useState<string>("2");

    const [fullScreenMode, setFullScreenMode] = useState<boolean>(false);

    const onTabChange = (key: string) => {
        setActiveTab(key);
        setFullScreenMode(false);
    };

    const tabContent: TabsProps["items"] = [
        {
            key: "1",
            label: "Task",
            children: (
                <div className="main2">
                    <p className="St1">Select Template</p>
                    <Radio.Group onChange={onChange} value={value}>
                        <Space direction="vertical">
                            <Radio value={1} className="St2">
                                Task Template
                            </Radio>
                            <Radio value={2} className="St2">
                                Project Template
                            </Radio>
                        </Space>
                    </Radio.Group>
                    <p className="St1">Select Field</p>
                    <Checkbox.Group
                        style={{ width: "100%" }}
                        onChange={onChange2}
                    >
                        <Space direction="vertical">
                            <Checkbox value="A" className="St2">
                                Client
                            </Checkbox>
                            <Checkbox value="B" className="St2">
                                Sub Task
                            </Checkbox>
                            <Checkbox value="C" className="St2">
                                Budget Time
                            </Checkbox>
                        </Space>
                    </Checkbox.Group>
                    <p className="St2">
                        Use Default Client Assignment?
                        <Switch className="St5" onChange={onChange1} />
                    </p>
                    <div className="St3">
                        <Button type="primary" className="St4">
                            Save
                        </Button>
                    </div>
                </div>
            ),
        },
        {
            key: "2",
            label: "Complaince",
            children: (
                <div className="main3">
                    <p className="St1">Select Field</p>
                    <Checkbox.Group
                        style={{ width: "100%" }}
                        onChange={onChange2}
                    >
                        <Space direction="vertical">
                            <Checkbox value="A" className="St2">
                                Remarks
                            </Checkbox>
                            <Checkbox value="B" className="St2">
                                Data Path
                            </Checkbox>
                            <Checkbox value="C" className="St2">
                                Budget Time
                            </Checkbox>
                            <Checkbox value="D" className="St2">
                                Billable
                            </Checkbox>
                            <Checkbox value="E" className="St2">
                                Sub Compliance
                            </Checkbox>
                        </Space>
                    </Checkbox.Group>
                    <p className="St2">
                        Use Default Client Assignment?
                        <Switch className="St5" onChange={onChange1} />
                    </p>
                    <div className="St3">
                        <Button type="primary" className="St4">
                            Save
                        </Button>
                    </div>
                </div>
            ),
        },
        {
            key: "3",
            label: "Timesheet",
        },
    ];

    return (
        <div className="main">
            <div>
                <div>
                    <Title level={5}>Settings</Title>
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
                            style={{ width: "200%", margin: "0px 20px" }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sett;
