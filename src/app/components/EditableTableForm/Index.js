import React, { useState } from "react";
import {
  Table,
  Input,
  Button,
  Form,
  Divider,
  Popconfirm,
  InputNumber,
} from "antd";
import companyLogo from "../../assets/images/company_logo.png";
import remove from "../../assets/svg/remove.svg";
// import EditableCell from "./EditableCell";
import Upload from "../Upload/Index";
import "./editableTableForm.scss";
import RemoveIcon from "../../assets/SVGComponent/RemoveIcon";
import { getMinWidth } from "./helper";

const EditableContext = React.createContext();

const EditableRow = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

const EditableCell = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  handleFileUploadChange,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const form = React.useContext(EditableContext);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({ [dataIndex]: record[dataIndex] });
  };

  const save = async () => {
    try {
      const values = await form.validateFields();

      toggleEdit();
      handleSave({ ...record, ...values });
    } catch (errInfo) {
      console.log("Save failed:", errInfo);
    }
  };

  let childNode = children;

  const minWidth = getMinWidth(dataIndex);

  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{ margin: 0, height:"100%" }}
        name={dataIndex}
        rules={[
          {
            required: true,
            message: `${title} is required.`,
          },
        ]}
      >
        {dataIndex === "age" ? (
          <InputNumber style={{ height:"100%" }} onPressEnter={save} onBlur={save} />
        ) : (
          <Input style={{  height:"100%" }} onPressEnter={save} onBlur={save} />
        )}
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{ paddingRight: 24 }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }
  if (dataIndex === "uploadLogo") {
    childNode = (
      <Upload
        accept="image/*"
        showUploadList={false}
        onChange={(data) => {
          handleFileUploadChange(data, record, dataIndex);
        }}
      >
        <img
          height={40}
          src={
            record[dataIndex]
              ? URL.createObjectURL(record[dataIndex])
              : companyLogo
          }
          alt="Company Logo"
        />
      </Upload>
    );
  } else if (dataIndex === "uploadPhoto") {
    childNode = (
      <Upload
        accept="image/*"
        showUploadList={false}
        onChange={(data) => {
          handleFileUploadChange(data, record, dataIndex);
        }}
      >
        <Button
          icon={
            <img
              height={40}
              src={
                record[dataIndex]
                  ? URL.createObjectURL(record[dataIndex])
                  : companyLogo
              }
              alt="Upload"
            />
          }
        >
          Upload Photo
        </Button>
      </Upload>
    );
  }

  return (
    <td {...restProps} style={{ minWidth }}>
      {childNode}
    </td>
  );
};

const initialData = [
  {
    key: "1",
    id: "1",
    clientType: "Type A",
    firmName: "Firm A",
    firmType: "Type X",
    panNumber: "ABCDE1234F",
    gstin: "12ABCFG5678HIZ9",
    industryType: "Industry A",
    lineOfBusiness: "Business Line A",
    groupName: "Group A",
    fileNumber: "123456789",
    address: "123 Main St",
    pinCode: "12345",
    country: "Country A",
    state: "State A",
    city: "City A",
    firstName: "John",
    middleName: "Doe",
    lastName: "Smith",
    gender: "Male",
    dateOfBirth: "1990-01-01",
    emailId: "john@example.com",
    mobile: "1234567890",
    altMobile: "9876543210",
    referredBy: "Someone",
  },
];

const EditableTableForm = () => {
  const [dataSource, setDataSource] = useState(initialData);
  console.log("dataSource", dataSource);
  const [count, setCount] = useState(2);

  const handleDelete = (key) => {
    const newData = dataSource.filter((item) => item.key !== key);
    setDataSource(newData);
  };

  const defaultColumns = [
    {
      title: "Remove",
      dataIndex: "remove",
      render: (_, record) => (
        <button
          style={{ paddingLeft: 40 }}
          onClick={() => handleDelete(record.key)}
          className="transparentBtn"
        >
          <RemoveIcon />
        </button>
      ),
    },
    {
      title: "Id",
      width: 150,
      dataIndex: "id",
    },
    {
      title: "Upload Logo",
      dataIndex: "uploadLogo",
      editable: true,
      // render: (_, record) => (
      //   <Upload showUploadList={false}>
      //     <img height={40} src={companyLogo} />
      //   </Upload>
      // ),
    },
    {
      title: "Client Type",
      dataIndex: "clientType",
      width: 200,
      editable: true,
    },
    {
      title: "Firm Name",
      dataIndex: "firmName",
      width: 200,
      editable: true, // Allow editing this column
    },
    {
      title: "Firm Type",
      dataIndex: "firmType",
      width: 200,
      editable: true,
    },
    {
      title: "Pan Number",
      dataIndex: "panNumber",
      width: 200,
      editable: true,
    },
    {
      title: "GSTIN",
      dataIndex: "gstin",
      width: 200,
      editable: true,
    },
    {
      title: "Industry Type",
      dataIndex: "industryType",
      width: 200,
      editable: true,
    },
    {
      title: "Line of Business",
      dataIndex: "lineOfBusiness",
      width: 200,
      editable: true,
    },
    {
      title: "Group Name",
      dataIndex: "groupName",
      width: 200,
      editable: true,
    },
    {
      title: "File Number",
      dataIndex: "fileNumber",
      width: 200,
      editable: true,
    },
    {
      title: "Address",
      dataIndex: "address",
      width: 200,
      editable: true,
    },
    {
      title: "Pin code",
      dataIndex: "pinCode",
      width: 200,
      editable: true,
    },
    {
      title: "Country",
      dataIndex: "country",
      width: 200,
      editable: true,
    },
    {
      title: "State",
      dataIndex: "state",
      width: 200,
      editable: true,
    },
    {
      title: "City",
      dataIndex: "city",
      width: 200,
      editable: true,
    },
    {
      title: "Upload Photo",
      dataIndex: "uploadPhoto",
      editable: true,
      // render: (_, record) => (
      //   <Upload>
      //     <Button icon={<img height={40} src={companyLogo} />}>
      //       Upload Photo
      //     </Button>
      //   </Upload>
      // ),
    },
    {
      title: "First Name",
      dataIndex: "firstName",
      width: 200,
      editable: true,
    },
    {
      title: "Middle Name",
      dataIndex: "middleName",
      width: 200,
      editable: true,
    },
    {
      title: "Last Name",
      dataIndex: "lastName",
      width: 200,
      editable: true,
    },
    {
      title: "Gender",
      dataIndex: "gender",
      width: 200,
      editable: true,
    },
    {
      title: "Date of Birth",
      dataIndex: "dateOfBirth",
      width: 200,
      editable: true,
    },
    {
      title: "Email Id",
      dataIndex: "emailId",
      width: 200,
      editable: true,
    },
    {
      title: "Mobile",
      dataIndex: "mobile",
      width: 200,
      editable: true,
    },
    {
      title: "Alt Mobile",
      dataIndex: "altMobile",
      width: 200,
      editable: true,
    },
    {
      title: "Referred By",
      dataIndex: "referredBy",
      width: 200,
      editable: true,
    },
  ];

  const handleFileUploadChange = (file, record, dataIndex) => {
    // Update the record with the uploaded file or other relevant data
    const newData = [...dataSource];
    const index = newData.findIndex((item) => record.key === item.key);

    if (dataIndex === "uploadLogo") {
      newData[index].uploadLogo = file.file.originFileObj; // Update with the uploaded file
    } else if (dataIndex === "uploadPhoto") {
      newData[index].uploadPhoto = file.file.originFileObj; // Update with the uploaded file
    }

    setDataSource(newData);
  };

  const handleAdd = () => {
    const newData = {
      key: count,
      name: `Edward King ${count}`,
      age: "32",
      address: `London, Park Lane no. ${count}`,
    };
    setDataSource([...dataSource, newData]);
    setCount(count + 1);
  };

  const handleSave = (row) => {
    const newData = [...dataSource];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    setDataSource(newData);
  };

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };

  const columns = defaultColumns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave,
        handleFileUploadChange,
      }),
    };
  });

  return (
    <div className="tableFormWrapper">
      <Button onClick={handleAdd} type="primary" style={{ marginBottom: 16 }}>
        Add a row
      </Button>
      <Table
        components={components}
        rowClassName={() => "editable-row"}
        bordered
        dataSource={dataSource}
        columns={columns}
        scroll={{ x: "100%" }}
      />
    </div>
  );
};

export default EditableTableForm;
