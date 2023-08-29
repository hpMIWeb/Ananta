import { useEffect, useState } from "react";
import { Button, Checkbox, Form, Input } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { loginUserApi } from "../../../redux/loginReducers";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Login.module.scss";
import { ILogin } from "../../utilities/globalInterfaces";
import { useAppDispatch } from "../../../states/store";

const Login = () => {
    const dispatch = useAppDispatch();
    const { success, loading, data } = useSelector((state: any) => state.login);

    const navigate = useNavigate();

    const onFinish = (e: any) => {
        const { email, password } = e;
        const credentials = {
            email,
            password,
        } as ILogin;
        dispatch(loginUserApi(credentials));
    };

    useEffect(() => {
        if (success && data?.payload?.token) {
            navigate("/");
        }
    }, [success]);

    const onFinishFailed = () => {};

    return (
        <div className={styles.loginPage}>
            <div className={styles.loginBoxWrapper}>
                <div className={styles.loginCardHeading}>
                    <span className={styles.loginCardHeadingLabel}>
                        NV Associate
                    </span>
                </div>
                <div className={styles.loginCardBody}>
                    <h5 className={styles.loginCardSigninLabel}>Log in</h5>
                    <Form
                        name="basic"
                        initialValues={{ remember: true }}
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        autoComplete="off"
                    >
                        <div className={styles.loginFormInputWrapper}>
                            <Form.Item
                                name="email"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please enter your Email!",
                                    },
                                ]}
                                style={{ margin: 0 }}
                            >
                                <Input
                                    placeholder="Email"
                                    className={styles.loginFormInput}
                                />
                            </Form.Item>
                        </div>

                        <div className={styles.loginFormPasswordWrapper}>
                            <Form.Item
                                name="password"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please enter your Password!",
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
                        <div className="row align-items-center justify-content-between">
                            <div className="col-auto">
                                <Form.Item
                                    name="remember"
                                    valuePropName="checked"
                                    className={styles.loginCheckBoxWrapper}
                                >
                                    <Checkbox className={styles.loginCheckBox}>
                                        Remember me
                                    </Checkbox>
                                </Form.Item>
                            </div>
                            <div className="col-auto">
                                <Link
                                    className="text-decoration-none"
                                    style={{
                                        fontSize: 13.33,
                                        color: "#2c7be5",
                                    }}
                                    to="/reset-password"
                                >
                                    Forgot Password?
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
                                Log in
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </div>
        </div>
    );
};

export default Login;
