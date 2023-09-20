import { Switch as AntdSwitch } from "antd";
import "./switch.scss";

const Switch = ({ ...props }) => {
  return <AntdSwitch {...props} />;
};

export default Switch;
