import React, {useEffect, useState} from 'react';
import './App.css';
import {Redirect, Route, Switch, useHistory} from 'react-router-dom';
import {Login} from './components/Login/Login';
import {useDispatch, useSelector} from 'react-redux';
import {initialiseApp} from './redux/app-reducer';
import 'antd/dist/antd.css';
import {s_getInitialised} from "./redux/app-selectors";
import {s_getIsAuth} from "./redux/auth-selectors";
import {Button, Result} from "antd";
import {Register} from "./components/Register/Register";
import {useMediaQuery} from 'react-responsive'
import {logout} from "./redux/auth-reducer";
import {sendMessage, startDialogsListening, stopDialogsListening} from "./redux/localhost-reducer";
import {s_getMessageTexts} from "./redux/localhost-selectors";

export const App: React.FC = () => {
    const isAuth = useSelector(s_getIsAuth);
    const initialised = useSelector(s_getInitialised);
    const history = useHistory();
    const dispatch = useDispatch();

    useEffect(() => {
        if (isAuth)
            dispatch(startDialogsListening());
        dispatch(initialiseApp());
        return () => {
            if (isAuth)
                dispatch(stopDialogsListening());
        }
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
    const isPhone = useMediaQuery({query: '(max-width: 900px)'})
    const isAuth = useSelector(s_getIsAuth);
    const messageTexts = useSelector(s_getMessageTexts);
    const [messageText, setMessageText] = useState('');
    if (!isAuth)
        return <Redirect to='/login'/>

    return (
        <div className='content'>
            content
            <Button type="primary" onClick={() => dispatch(logout())}>logout</Button>
            <div>
                <input type="text" value={messageText} onChange={(e) => setMessageText(e.target.value)}/>
                <button onClick={() => {
                    dispatch(sendMessage(messageText));
                    setMessageText('');
                }}>send</button>
                {messageTexts.map((message, i) => <div key={i}>{message}</div>)}
            </div>
        </div>
    )
};
