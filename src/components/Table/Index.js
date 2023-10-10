import { Table as AntdTable } from "antd";

const Table = ({ columns, data, pagination = true }) => {
    return (
        <AntdTable
            columns={columns}
            dataSource={data}
            pagination={pagination}
        />
    );
};

export default Table;
