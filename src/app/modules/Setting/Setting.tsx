import React, { useEffect, useState } from "react";
import {
    Button,
    Checkbox,
    Radio,
    RadioChangeEvent,
    Space,
    Switch,
    Tabs,
    TabsProps,
    Typography,
    Row,
} from "antd";
import "./Setting.scss";
import styles from "./setting.module.scss";
import { AddSetting, Task, Compliance, Settings } from "./interfaces/Isetting";
import { CheckboxValueType } from "antd/es/checkbox/Group";
import api from "../../utilities/apiServices";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
    taskSettingFields,
    complianceSettingFields,
    taskSettingTemplates,
} from "../../utilities/utility";
import classNames from "classnames";

const { Title } = Typography;

const Setting = () => {
    const [value, setValue] = useState<string>("");
    const [settingData, setSettingData] = useState<AddSetting>(new Settings());
    const [taskData, setTaskData] = useState<Task>({} as Task);
    const [complianceData, setComplianceData] = useState<Compliance>(
        {} as Compliance
    );
    const [activeTab, setActiveTab] = useState<string>("2");
    const [fullScreenMode, setFullScreenMode] = useState<boolean>(false);

    // `task` checkboxes
    const taskFields = taskSettingFields.map((field, index: number) => (
        <Checkbox value={field.value} key={field.value} className="St2">
            {field.label}
        </Checkbox>
    ));

    // `compliance` checkboxes
    const complianceFields = complianceSettingFields.map((field) => (
        <Checkbox value={field.value} key={field.value} className="St2">
            {field.label}
        </Checkbox>
    ));

    // Switch or Toggle change event handler
    const onSwitchHandler = (checked: boolean, actionTab: string) => {
        if (actionTab === "task") {
            taskData.client_assignment = checked;
            setTaskData(taskData);
        } else if (actionTab === "compliance") {
            complianceData.client_assignment = checked;
            setComplianceData(complianceData);
        }
    };

    // Radio change event handler
    const radioButtonHandler = (e: RadioChangeEvent, actionTab: string) => {
        if (actionTab === "task") {
            taskData.select_template = e.target.value;
            setTaskData(taskData);
            setValue(e.target.value);
        } else if (actionTab === "compliance") {
            complianceData.select_template = e.target.value;
            setComplianceData(complianceData);
        }
    };

    // Checkboxes change event handler
    const checkBoxHandler = (
        checkedValues: CheckboxValueType[],
        actionTab: string
    ) => {
        if (actionTab === "task") {
            console.log("before save ", taskData);
            setTaskData((prevTaskData) => ({
                ...prevTaskData,
                select_fields: checkedValues as string[], // You can cast CheckboxValueType[] to string[] if required.
            }));
        } else if (actionTab === "compliance") {
            setComplianceData((prevTaskData) => ({
                ...prevTaskData,
                select_fields: checkedValues as string[], // You can cast CheckboxValueType[] to string[] if required.
            }));
        }

        console.log("taskData", taskData);
    };

    // Save settings
    const saveTaskSettingHandler = () => {
        const addSetting = new Settings();
        addSetting.task = taskData;
        addSetting.compliance = complianceData;
        addSetting._id = settingData._id;

        try {
            api.updateSetting(addSetting).then((resp: any) => {
                toast.success("Successfully Settings saved.", {
                    position: toast.POSITION.TOP_RIGHT,
                });
            });
        } catch (ex) {
            toast.error("Technical error while saving settings", {
                position: toast.POSITION.TOP_RIGHT,
            });
        }
    };

    // Tab change event handler
    const onTabChange = (key: string) => {
        setActiveTab(key);
        setFullScreenMode(false);
    };

    // on load
    useEffect(() => {
        getSetting();
    }, []);

    //Fetch Settings
    const getSetting = () => {
        api.getSettings().then((resp: any) => {
            //TODO: taking only first record of the array, `payload` should not be an array
            console.log(resp.data);
            var respData = resp.data;

            setSettingData(respData);
            setValue(respData.task.select_template);
            setComplianceData(respData.compliance);
            setTaskData(respData.task);
        });
    };

    const tabContent: TabsProps["items"] = [
        {
            key: "1",
            label: "Task",
            children: (
                <div className="main2">
                    <p className="St1">Select Template</p>
                    <Radio.Group
                        value={value}
                        onChange={(check) => {
                            radioButtonHandler(check, "task");
                        }}
                    >
                        <Space direction="vertical">
                            {taskSettingTemplates.map(
                                (template: any, index: number) => {
                                    return (
                                        <Radio
                                            value={template.value}
                                            className="St2"
                                            key={template.label}
                                        >
                                            {template.label}
                                        </Radio>
                                    );
                                }
                            )}
                        </Space>
                    </Radio.Group>
                    <p className="St1 mt-20">Select Fields</p>
                    <Checkbox.Group
                        style={{ width: "100%" }}
                        onChange={(check) => {
                            checkBoxHandler(check, "task");
                        }}
                        value={taskData && taskData.select_fields}
                    >
                        <Space direction="vertical">{taskFields}</Space>
                    </Checkbox.Group>
                    <p className="St2 mt-20">
                        Use Default Client Assignment?
                        <Switch
                            className="St5"
                            onChange={(check) => {
                                onSwitchHandler(check, "task");
                            }}
                            checked={taskData.client_assignment}
                        />
                    </p>
                    <div>
                        <Button
                            type="primary"
                            size={"large"}
                            onClick={saveTaskSettingHandler}
                        >
                            Save
                        </Button>
                    </div>
                </div>
            ),
        },
        {
            key: "2",
            label: "Compliance",
            children: (
                <div className="main3">
                    <p className="St1">Select Fields</p>
                    <Checkbox.Group
                        style={{ width: "100%" }}
                        onChange={(check) => {
                            checkBoxHandler(check, "compliance");
                        }}
                        value={complianceData && complianceData.select_fields}
                    >
                        <Space direction="vertical">{complianceFields}</Space>
                    </Checkbox.Group>
                    <p className="St2 mt-20">
                        Use Default Client Assignment?
                        <Switch
                            className="St5"
                            onChange={(check) => {
                                onSwitchHandler(check, "compliance");
                            }}
                            defaultChecked={
                                complianceData &&
                                complianceData.client_assignment
                            }
                        />
                    </p>
                    <div>
                        <Button
                            type="primary"
                            size={"large"}
                            onClick={saveTaskSettingHandler}
                        >
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
        <>
            <ToastContainer autoClose={25000} />
            <div
                className={classNames(
                    "card mb-3",
                    styles.addPromoCodeCardWrapper
                )}
            >
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
                                Settings
                            </h5>
                        </div>
                        <div className={classNames("ms-auto z-index-1")}></div>
                    </div>
                </div>
                <div className={styles.addClientDetailBox}>
                    <Tabs
                        defaultActiveKey="1"
                        items={tabContent}
                        onChange={onTabChange}
                        style={{ width: "200%", margin: "0px 20px" }}
                        size={"large"}
                    />
                </div>
            </div>
        </>
    );
};

export default Setting;
