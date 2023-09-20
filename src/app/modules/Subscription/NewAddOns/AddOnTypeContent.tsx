import { Form } from "antd";
import Input from "../../../../components/Input/Index";
import Switch from "../../../../components/Switch/Index";
import styles from "./newAddOns.module.scss";

const AddOnTypeContent = ({ selectedAddonType }: any) => {
  const featureList = [
    { feature: "TaskManager" },
    { feature: "FileManager" },
    { feature: "E-Commerce" },
    { feature: "Tamplate-Customization_for_import" },
    { feature: "Live_reports_on_client_mobile_app" },
  ];

  const getContent = () => {
    switch (selectedAddonType) {
      case "Features List":
        return (
          <div className="formFieldRowWrapper">
            <div className="col-auto formLabelWrapper">
              <label className="form-label">Features</label>
            </div>
            <div className="col-12 col-sm-6 col-md-4 formInputWrapper">
              <div className={styles.featureCheckBoxWrapper}>
                {featureList.map((task, index) => (
                  <div key={index}>
                    <Switch size="small" className="smallCheckBox"></Switch>
                    <label className={styles.featureCheckBoxLabel}>
                      {
                        task.feature
                          .replace(/_/g, " ") // Replace underscores with spaces
                          .replace(/-/g, " ") // Replace hyphens with spaces
                      }
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="formFieldRowWrapper">
            <div className="col-auto formLabelWrapper">
              <label className="form-label">{selectedAddonType}</label>
            </div>
            <div className="col-12 col-sm-6 col-md-4 formInputWrapper">
              <Form.Item
                name="storage_size"
                rules={[
                  {
                    required: true,
                    message: `Please Enter your ${selectedAddonType}!`,
                  },
                ]}
              >
                <Input
                  placeholder={selectedAddonType}
                  className="customAddFormInputText"
                  suffix={
                    selectedAddonType === "Storage Space" && (
                      <div className="inputSuffix">GB</div>
                    )
                  }
                />
              </Form.Item>
            </div>
          </div>
        );
    }
  };
  return getContent();
};

export default AddOnTypeContent;
