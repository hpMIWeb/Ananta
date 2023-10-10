import { DatePicker, Row, Col, Select, Button } from "antd";
import {
    clientOpts,
    assigneeOpts,
    statusList,
    priorityOpts,
} from "../../utilities/utility";
import "../fillter/Fillter.scss";
import { useEffect, useState } from "react";
const { RangePicker } = DatePicker;

let parameters: string[] = [];

const ComplianceFilter = (prop: any) => {
    // State variables for each dropdown filter
    const [clientValue, setClientValue] = useState<any>(null);
    const [statusValue, setStatusValue] = useState<any>(null);

    // Function to clear all filter values
    const clearAllFilters = () => {
        setClientValue(null);
        setStatusValue(null);

        // Reset the parameters array
        parameters = [];
        filterHandler("", "");
    };

    useEffect(() => {
        // Get the current URL
        console.log(prop);
        const currentURL = window.location.href;
        console.log("Current URL:", currentURL);
        // Split the URL by slashes and get the last part
        const parts = currentURL.split("/");
        const lastPart = parts[parts.length - 1];

        console.log("Last part of the URL:", lastPart);
    }, []); // Empty

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

        console.log("name", name);
        console.log("value", value);
        // Check if the filter parameter already exists in the parameters array
        const parameterExists = parameters.some((param) =>
            param.startsWith(`${name}=`)
        );

        // If the parameter already exists, remove it from the array
        if (parameterExists) {
            parameters = parameters.filter(
                (param) => !param.startsWith(`${name}=`)
            );
        }

        // Push the new parameter to the array
        if (value !== "") {
            parameters.push(`${name}=${encodeURIComponent(value)}`);
        }
        const queryString = "?" + parameters.join("&");
        console.log(queryString);
        prop.filterHandler(queryString);
    };

    return (
        <>
            <Row
                gutter={[8, 8]}
                className={`mt-10 form-row ${
                    prop.showMoreFilter
                        ? "fade-down-enter-active"
                        : "fade-up-enter-active"
                }`}
            >
                <Col
                    xs={{ span: 24 }}
                    sm={{ span: 24 }}
                    md={{ span: 8 }}
                    className="w100 border-bottom"
                >
                    <RangePicker bordered={false} />
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
            </Row>
        </>
    );
};
export default ComplianceFilter;
