import { Link, useLocation, useNavigate } from "react-router-dom";
import styles from "./resetPassword.module.scss";
import Logo from "../../../assets/images/main-logo.png";
import { Button, Form, Input } from "antd";
import api from "../../utilities/apiServices";
import { useEffect, useState } from "react";

const ResetPassword = ({}) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const useQuery = () => new URLSearchParams(useLocation().search);
    const query = useQuery();
    const email = query.get("email");

    useEffect(() => {
        form.setFieldsValue({ email: email });
    }, [email]);
    const onFinish = (e: any) => {
        const { email, password, newPassword } = e;
        const credentials = {
            email,
            password,
            newPassword,
        };
        setLoading(true); // Set loading state to true
        api.resetPassword(credentials)
            .then((resp: any) => {
                navigate("/login");
            })
            .finally(() => {
                navigate("/login");
                setLoading(false); // Reset loading state
            });
    };

    const onFinishFailed = () => {};

    return (
        <div className={styles.loginPage}>
            <div className={styles.loginBoxWrapper}>
                <div className={styles.loginCardHeading}>
                    <img width={58} src={Logo} />
                    <span className={styles.loginCardHeadingLabel}>
                        NV Associate
                    </span>
                </div>
                <div className={styles.loginCardBody}>
                    <h5 className={styles.loginCardSigninLabel}>
                        Reset Password
                    </h5>
                    <Form
                        form={form}
                        name="basic"
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        autoComplete="off"
                    >
                        <div className={styles.loginFormInputWrapper}>
                            <Form.Item name="email" style={{ margin: 0 }}>
                                <Input
                                    placeholder="Email"
                                    className={styles.loginFormInput}
                                    disabled
                                />
                            </Form.Item>
                        </div>

                        <div className={styles.loginFormPasswordWrapper}>
                            <Form.Item
                                name="password"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please Enter your password!",
                                    },
                                ]}
                                style={{ margin: 0 }}
                            >
                                <Input.Password
                                    placeholder="Password"
                                    className={styles.loginFormInput}
                                />
                            </Form.Item>
                        </div>
                        <div className={styles.loginFormPasswordWrapper}>
                            <Form.Item
                                name="newPassword"
                                rules={[
                                    {
                                        required: true,
                                        message:
                                            "Please Enter your confirm password!",
                                    },
                                    ({ getFieldValue }) => ({
                                        validator(_, value) {
                                            if (
                                                !value ||
                                                getFieldValue("password") ===
                                                    value
                                            ) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject(
                                                new Error(
                                                    "The two passwords do not match."
                                                )
                                            );
                                        },
                                    }),
                                ]}
                                style={{ margin: 0 }}
                            >
                                <Input.Password
                                    placeholder="Confirm Password"
                                    className={styles.loginFormInput}
                                />
                            </Form.Item>
                        </div>
                        <div className="row align-items-center justify-content-between">
                            <div className="col-auto"></div>
                            <div className="col-auto">
                                <Link
                                    className="text-decoration-none"
                                    style={{
                                        fontSize: 13.33,
                                        color: "#2c7be5",
                                    }}
                                    to="/login"
                                >
                                    Back to Login
                                </Link>
                            </div>
                        </div>

                        <Form.Item style={{ marginBottom: "1rem" }}>
                            <Button
                                className={styles.formLoginBtn}
                                type="primary"
                                htmlType="submit"
                                loading={loading}
                            >
                                Reset Password
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
