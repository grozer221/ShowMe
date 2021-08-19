import React, {FC} from "react";
import s from './Actions.module.css';
import {useDispatch, useSelector} from "react-redux";
import {Avatar} from "antd";
import {LineOutlined, VideoCameraOutlined} from "@ant-design/icons";
import {actions, ClientType, toggleWebCam} from "../../redux/localhost-reducer";
import {s_getIsOnWebCam, s_getSelectedClient} from "../../redux/localhost-selectors";

export const Actions: FC = () => {
    const dispatch = useDispatch();
    const selectedClient = useSelector(s_getSelectedClient) as ClientType;
    const isOnWebCam = useSelector(s_getIsOnWebCam);


    const clickWebCamHandler = () => {
        if (isOnWebCam)
            dispatch(toggleWebCam(selectedClient.login, false));
        else
            dispatch(toggleWebCam(selectedClient.login, true));
        dispatch(actions.setIsOnWebCam(!isOnWebCam));
    }

    if (!selectedClient)
        return null;

    return (
        <div className={s.wrapperNavAction}>
            <button onClick={clickWebCamHandler}>
                <Avatar icon={<VideoCameraOutlined/>}/>
                {isOnWebCam || <Avatar icon={<LineOutlined/>}/>}
            </button>
        </div>
    );
}