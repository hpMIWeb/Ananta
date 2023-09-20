import { Select as AntdSelect } from "antd";
import "./select.scss";

const Select = ({ ...props }) => {
  return <AntdSelect {...props} />;
};

export default Select;
