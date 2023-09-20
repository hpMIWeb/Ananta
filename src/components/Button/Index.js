import { Button as AntdButton } from "antd";
import "./button.scss";

const Button = ({ ...props }) => {
  return <AntdButton {...props} />;
};

export default Button;
