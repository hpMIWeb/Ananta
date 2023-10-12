import styles from "./revenueProgram.module.scss";
import { Form } from "antd";

import Button from "../../../../../components/Button/Index";

const RevenueProgram = ({ onChange, setFormValue, clientType }: any) => {
    const [form] = Form.useForm();

    const onFinish = (value: any) => {
        onChange(4);
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
                <div className="d-flex">
                    <div className="ms-auto">
                        <Button
                            style={{ minWidth: 104, marginRight: 12 }}
                            className="greyBtn"
                            onClick={() => onChange(1)}
                        >
                            Previous
                        </Button>
                        <Button
                            className={styles.nextBtn}
                            type="primary"
                            htmlType="submit"
                        >
                            Next
                        </Button>
                    </div>
                </div>
            </Form>
        </div>
    );
};

export default RevenueProgram;
