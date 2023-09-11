import { Upload as AntdUpload } from "antd";
import "./upload.scss";

const Upload = ({ ...props }) => {
  return <AntdUpload {...props} />;
};

export default Upload;
