import styles from "./branches.module.scss";
import Switch from "../../../../../components/Switch/Index";
import { Form } from "antd";
import CardBottomAction from "../OwnerInfo/CardBottomAction";
import { useEffect, useState } from "react";
import BranchInfoCard from "./BranchInfoCard";
import { filterObjectByKey } from "../../../../../utils/helpers";

const initialBranchInfoData = [{ type: "default", index: 0, name: "index0" }];

const Branches = ({ onChange, setFormValue }: any) => {
  const [form] = Form.useForm();
  const [branchInfoData, setBranchInfoData] = useState<any>([]);
  const [branchChecked, setBranchChecked] = useState<boolean>(false);
  const [countriesListData, setCountriesListData] = useState([]);

  const fetchCountries = async () => {
    try {
      const response = await fetch(
        "http://api.geonames.org/countryInfoJSON?username=cuirato"
      );
      if (!response.ok) {
        throw new Error("Failed to fetch countries");
      }
      const data = await response.json();
      setCountriesListData(data.geonames);
    } catch (error) {
      // Handle errors here
      console.error("Error fetching countries:", error);
    }
  };

  const branchDetailsFormValue = Form.useWatch("branches", form) || {};

  useEffect(() => {
    fetchCountries();
  }, []);

  const onFinish = (value: any) => {
    const filteredValue = filterObjectByKey(
      value.branches,
      branchInfoData.map((a: any) => a.name)
    );
    setFormValue({ branches: Object.values(filteredValue) });
    onChange(3);
  };

  const addMoreOwnerCard = () => {
    setBranchInfoData((prev: any) => [
      ...prev,
      {
        type: "new",
        index: branchInfoData.length,
        name: `index${branchInfoData.length}`,
      },
    ]);
  };

  const onDeleteCardClick = (cardIndex: boolean) => {
    const newOwnerInfoData = branchInfoData.filter(
      (a: any) => a.index !== cardIndex
    );
    setBranchInfoData(newOwnerInfoData);
  };

  const handleBranchChecked = (cheked: boolean) => {
    setBranchChecked(cheked);
    if (cheked) {
      setBranchInfoData(initialBranchInfoData);
    } else {
      setBranchInfoData([]);
    }
  };

  return (
    <div>
      <Form
        name="basic"
        form={form}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        autoComplete="off"
        requiredMark={false}
        className="customAddForm"
      >
        <div className={styles.featureCheckBoxLabelWrapper}>
          <Switch
            onChange={(e: any) => handleBranchChecked(e)}
            size="small"
            className="smallCheckBox"
          ></Switch>
          <label className={styles.featureCheckBoxLabel}>Branches</label>
        </div>
        <div className={styles.branchesContentWrapper}>
          <Form.List name="branches">
            {(fields, { add, remove }) => (
              <>
                {branchInfoData.map((field: any, index: number) => (
                  <BranchInfoCard
                    index={index}
                    field={field}
                    branchDetailsFormValue={branchDetailsFormValue[field.name]}
                    remove={remove}
                    countriesListData={countriesListData}
                    onDeleteCardClick={onDeleteCardClick}
                  />
                ))}
              </>
            )}
          </Form.List>

          {!!branchChecked && (
            <CardBottomAction
              addCardClick={addMoreOwnerCard}
              onChange={onChange}
            />
          )}
        </div>
      </Form>
    </div>
  );
};

export default Branches;
