import { Table as AntdTable } from "antd";

const Table = ({ columns, data }) => {
  return <AntdTable columns={columns} dataSource={data} />;
};

export default Table;
