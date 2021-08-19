import React, {FC, useEffect, useState} from "react";
import s from './Clients.module.css';
import {useDispatch, useSelector} from "react-redux";
import {Avatar, Form, Input, Modal} from "antd";
import {PlusCircleOutlined, UserAddOutlined} from "@ant-design/icons";
import {s_getFormError, s_getFormSuccess} from "../../redux/app-selectors";
import {actions as appActions} from '../../redux/app-reducer';
import {
    s_getClients,
    s_getIsFetching,
    s_getIsOpenAddClientForm,
    s_getSelectedClient
} from "../../redux/localhost-selectors";
import {actions, addClient, getClients} from "../../redux/localhost-reducer";

export const Clients: FC = () => {
    const dispatch = useDispatch();

    const clients = useSelector(s_getClients);
    const selectedClient = useSelector(s_getSelectedClient);

    useEffect(() => {
        dispatch(getClients());
    }, [])

    const clickAddUserHandler = () => {
        dispatch(actions.setIsOpenAddClientForm(true))
        dispatch(appActions.setFormSuccess(null));
    }

    return (
        <div className={s.wrapperClients}>
            <div className={s.clients}>
                {clients.map(client =>
                    <button key={client.id}
                            onClick={() => dispatch(actions.setSelectedClient(client))}
                            className={[s.client, client === selectedClient ? s.selected : ''].join(' ')}
                    >
                        <div>{client.login}</div>
                        {client.isOnline && <div>Online</div>}
                    </button>
                )}
            </div>
            <div className={s.actionWithClients}>
                <button>
                    <Avatar icon={<UserAddOutlined/>}/>
                </button>
                <button onClick={clickAddUserHandler}>
                    <Avatar icon={<PlusCircleOutlined/>}/>
                </button>
            </div>
            <AddClientForm/>
        </div>
    );
};


const AddClientForm: FC = () => {
    const dispatch = useDispatch();
    const [form] = Form.useForm();
    const isFetching = useSelector(s_getIsFetching);
    const isOpenAddClientForm = useSelector(s_getIsOpenAddClientForm);
    const formSuccess = useSelector(s_getFormSuccess);
    const formError = useSelector(s_getFormError);


    const addUserHandler = () => {
        form.validateFields()
            .then((values: { login: string, password: string }) => {
                dispatch(addClient(values.login, values.password));
            })
            .catch(info => {
                console.log('Validate Failed:', info);
            });
    };

    useEffect(() => {
        if (formSuccess) {
            dispatch(actions.setIsOpenAddClientForm(false));
        }
    }, [formSuccess])

    return (
        <Modal title="Add client form"
               visible={isOpenAddClientForm}
               onOk={addUserHandler}
               onCancel={() => dispatch(actions.setIsOpenAddClientForm(false))}
               okButtonProps={{disabled: isFetching}}
        >
            <Form
                name="addClientForm"
                form={form}
            >
                <Form.Item
                    label="Login"
                    name="login"
                    rules={[{required: true, message: 'Please input client login!'}]}
                >
                    <Input onChange={() => dispatch(appActions.setFormSuccess(null))}/>
                </Form.Item>

                <Form.Item
                    label="Password"
                    name="password"
                    rules={[{required: true, message: 'Please input client password!'}]}
                >
                    <Input.Password onChange={() => dispatch(appActions.setFormSuccess(null))}/>
                </Form.Item>

                {formSuccess === false && <div className={s.error}>{formError}</div>}
            </Form>
        </Modal>
    );
};