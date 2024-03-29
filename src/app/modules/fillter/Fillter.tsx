import { DatePicker, Row, Col, Select, Button } from "antd";
import {
    clientOpts,
    assigneeOpts,
    statusList,
    priorityOpts,
} from "../../utilities/utility";
import "../fillter/Fillter.scss";
import { useEffect, useState } from "react";

let parameters: string[] = [];

const Fillter = (prop: any) => {
    // State variables for each dropdown filter
    const [clientValue, setClientValue] = useState<any>(null);
    const [assignedByValue, setAssignedByValue] = useState<any>(null);
    const [assignedToValue, setAssignedToValue] = useState<any>(null);
    const [dueDateValue, setDueDateValue] = useState<any>(null);
    const [statusValue, setStatusValue] = useState<any>(null);
    const [priorityValue, setPriorityValue] = useState<any>(null);

    // Function to clear all filter values
    const clearAllFilters = () => {
        setClientValue(null);
        setAssignedByValue(null);
        setAssignedToValue(null);
        setDueDateValue(null);
        setStatusValue(null);
        setPriorityValue(null);

        // Reset the parameters array
        parameters = [];
        filterHandler("", "");
    };

    const onClearData = (data: any) => {
        console.log(data);
    };
    const filterHandler = (event: any, nameItem: string = "") => {
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

        console.log("nameItem", nameItem);
        console.log("name", name);
        console.log("value", value);
        // Check if the filter parameter already exists in the parameters array
        const parameterExists = parameters.some((param) =>
            param.startsWith(`${nameItem}=`)
        );

        // If the parameter already exists, remove it from the array
        if (parameterExists) {
            parameters = parameters.filter((param) => {
                return !param.startsWith(`${nameItem}=`);
            });
        }

        // Push the new parameter to the array
        if (value !== "") {
            parameters.push(`${nameItem}=${encodeURIComponent(value)}`);
        }

        let queryString = "";
        if (parameters && parameters.length > 0) {
            queryString = "?" + parameters.join("&");
        }
        console.log(queryString);
        prop.filterHandler(queryString);
    };

    return (
        <div
            className={`${
                prop.showMoreFilter
                    ? "fade-down-enter-active"
                    : "fade-up-enter-active"
            }`}
        >
            <Row gutter={[8, 8]} className={`mt-10 form-row`}>
                <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 8 }}>
                    <Select
                        allowClear
                        showSearch
                        placeholder="Client"
                        options={clientOpts}
                        value={clientValue}
                        className="w100 border-bottom"
                        bordered={false}
                        onChange={(value, event) => {
                            setClientValue(value);
                            filterHandler(value, "client");
                        }}
                    />
                </Col>
                <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 8 }}>
                    <Select
                        allowClear
                        showSearch
                        placeholder="Assign By"
                        options={assigneeOpts}
                        value={assignedByValue}
                        className="w100 border-bottom"
                        bordered={false}
                        onChange={(value, event) => {
                            setAssignedByValue(value);
                            filterHandler(event, "assignedBy");
                        }}
                    ></Select>
                </Col>
                <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 8 }}>
                    <Select
                        allowClear
                        showSearch
                        placeholder="Assign To"
                        options={assigneeOpts}
                        value={assignedToValue}
                        className="w100 border-bottom"
                        bordered={false}
                        onChange={(value, event) => {
                            setAssignedToValue(value);
                            filterHandler(event, "assignedTo");
                        }}
                    ></Select>
                </Col>
            </Row>

            <Row
                gutter={[8, 8]}
                className={`mt-f10 form-row ${
                    prop.showMoreFilter
                        ? "fade-down-enter-active"
                        : "fade-up-enter-active"
                }`}
            >
                <Col
                    xs={{ span: 24 }}
                    sm={{ span: 24 }}
                    md={{ span: 8 }}
                    className="border-bottom"
                >
                    <DatePicker
                        placeholder="Due Date"
                        name="due_date_search"
                        className="w100 border-bottom"
                        bordered={false}
                        value={dueDateValue}
                        style={{ borderBottom: "1px solid" }}
                        onChange={(value, event) => {
                            setDueDateValue(value);
                            filterHandler(event, "dueDate");
                        }}
                    />
                </Col>
                <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 8 }}>
                    <Select
                        allowClear
                        showSearch
                        placeholder="Status"
                        value={statusValue}
                        options={statusList}
                        className="w100 border-bottom"
                        bordered={false}
                        onChange={(value, event) => {
                            setStatusValue(value);
                            filterHandler(event, "status");
                        }}
                    ></Select>
                </Col>
                <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 6 }}>
                    <Select
                        allowClear
                        showSearch
                        placeholder="Priority"
                        options={priorityOpts}
                        className="w100 border-bottom"
                        bordered={false}
                        value={priorityValue}
                        onChange={(value, event) => {
                            setPriorityValue(value);
                            filterHandler(event, "priority");
                        }}
                    ></Select>
                </Col>
                <Col
                    xs={{ span: 24 }}
                    sm={{ span: 24 }}
                    md={{ span: 2 }}
                    style={{ textAlign: "right" }}
                >
                    <Button
                        title="Clear"
                        className="clearlink"
                        style={{ border: "none" }}
                        onClick={clearAllFilters}
                    >
                        Clear
                    </Button>
                </Col>
            </Row>
        </div>
    );
};
export default Fillter;
