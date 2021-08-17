import React, {useEffect, useState} from 'react';
import 'antd/dist/antd.css';
import {Route, Switch} from 'react-router';
import './App.css'
import {useDispatch, useSelector} from "react-redux";
import {s_getIsAuth} from "./redux/auth-selectors";
import {s_getInitialised} from "./redux/app-selectors";
import {Redirect, useHistory} from "react-router-dom";
import {initialiseApp} from "./redux/app-reducer";
import {Button, Result} from "antd";
import {Login} from "./components/Login/Login";
import {Register} from "./components/Register/Register";
import {logout} from "./redux/auth-reducer";

export const App = () => {
    const isAuth = useSelector(s_getIsAuth);
    const initialised = useSelector(s_getInitialised);
    const history = useHistory();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(initialiseApp());
    }, [isAuth]);

    return (
        <Switch>
            <Route exact path="/" render={() => <MainPage/>}/>
            <Route path="/login" render={() => <Login/>}/>
            <Route path="/register" render={() => <Register/>}/>
            <Route path="*" render={() => <Result
                status="404"
                title="404"
                subTitle="Sorry, the page you visited does not exist."
                extra={<Button type="primary" onClick={() => history.push('/')}>Back Home</Button>}
            />}/>
        </Switch>
    );
}

const MainPage: React.FC = () => {
    const dispatch = useDispatch();
    const isAuth = useSelector(s_getIsAuth);
    if (!isAuth)
        return <Redirect to='/login'/>

    return (
        <div className='content'>
            content
            <button onClick={() => dispatch(logout())}>logout</button>
        </div>
    )
};
