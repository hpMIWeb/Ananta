import { Link, useNavigate } from "react-router-dom";
//import Cookies from "js-cookie";
import styles from "./login.module.scss";
import Logo from "../../../assets/images/main-logo.png";
import Email from "../../../assets/svg/email.svg";
import Password from "../../../assets/svg/password.svg";
import { Button, Checkbox, Form, Input } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { loginUserApi } from "../../../redux/loginReducers";
import { useEffect } from "react";

const Login = ({}) => {
    const natigate = useNavigate();
    const dispatch = useDispatch();
    const { success, loading, data } = useSelector((state: any) => state.login);

    const onFinish = (e: any) => {
        const { email, password } = e;
        const credentials = {
            email,
            password,
        };
        // @ts-ignore
        dispatch(loginUserApi(credentials));
    };

    useEffect(() => {
        if (success && data?.payload?.token) {
            natigate("/");
        }
    }, [success]);
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
                                        message: "Please Enter your Email!",
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
