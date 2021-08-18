import React, {useEffect} from 'react';
import s from './Login.module.css';
import {useDispatch, useSelector} from 'react-redux';
import {login} from '../../redux/auth-reducer';
import {Form, Input, Button, Checkbox, message, Spin} from 'antd';
import {LoadingOutlined, LockOutlined, UserOutlined} from "@ant-design/icons";
import {s_getIsAuth, s_getIsFetching} from "../../redux/auth-selectors";
import {Link, Redirect, useHistory} from "react-router-dom";
import {s_getFormError, s_getFormSuccess} from "../../redux/app-selectors";
import {actions as appActions} from "../../redux/app-reducer";

export const Login: React.FC = () => {
    const isAuth = useSelector(s_getIsAuth);
    const formError = useSelector(s_getFormError);
    const formSuccess = useSelector(s_getFormSuccess);
    const isFetching = useSelector(s_getIsFetching);
    const history = useHistory()
    const dispatch = useDispatch();

    const onFinish = (values: { login: string, password: string }) => {
        dispatch(login(values.login, values.password));
    };

    useEffect(() => {
        if (formSuccess === true) {
            history.push('/')
            dispatch(appActions.setFormSuccess(null));
            dispatch(appActions.setFormError(''));
        }
    }, [formSuccess])

    if(isAuth)
        return <Redirect to='/'/>

    return (
        <div className={s.login_form_wrapper}>
            <div className={s.login_form}>
                <Form
                    name="login_form"
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                >
                    <Form.Item
                        name="login"
                        rules={[{ required: true, message: 'Please input your Login!' }]}
                    >
                        <Input prefix={<UserOutlined className="site-form-item-icon" />}
                               placeholder="Login"
                               onChange={() => dispatch(appActions.setFormError(''))} />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={[{ required: true, message: 'Please input your Password!' }]}
                    >
                        <Input
                            prefix={<LockOutlined className="site-form-item-icon" />}
                            type="password"
                            placeholder="Password"
                            onChange={() => dispatch(appActions.setFormError(''))}
                        />
                    </Form.Item>

                    <div className={s.form_error}>{formError}</div>


                    <Form.Item>
                        <Form.Item name="remember" valuePropName="checked" noStyle>
                            <Checkbox>Remember me</Checkbox>
                        </Form.Item>

                        <a className={s.login_form_forgot} href="">
                            Forgot password
                        </a>
                    </Form.Item>
                    <Form.Item>
                        <Button disabled={isFetching} type="primary" htmlType="submit" className={s.login_form_button}>
                            {isFetching
                                ? <Spin indicator={<LoadingOutlined style={{fontSize: 24}} spin/>}/>
                                : <span>Log in</span>}
                        </Button>
                        Or <Link to="/register">register now!</Link>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
};
