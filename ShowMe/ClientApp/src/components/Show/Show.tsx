import React, {FC, useEffect, useRef} from "react";
import s from './Show.module.css';
import {useSelector} from "react-redux";
import {
    s_getIsOnWebCam,
    s_getMessageTexts,
    s_getSelectedClient,
    s_getWebCamFrame
} from "../../redux/localhost-selectors";

export const Show: FC = () => {
    const selectedClient = useSelector(s_getSelectedClient);
    const isOnWebCam = useSelector(s_getIsOnWebCam);
    const webCamFrame = useSelector(s_getWebCamFrame);
    const messageTexts = useSelector(s_getMessageTexts);
    const imgRef = useRef<HTMLImageElement>(null);

    useEffect(() => {
        if (webCamFrame && imgRef.current) {
            imgRef.current.src = webCamFrame;
        }
    }, [webCamFrame]);

    if (!selectedClient)
        return <div className={s.noneInfo}>Select a client</div>

    return (
        <div className={s.wrapperShow}>
            {isOnWebCam && <img className='webCamVideo' src="" alt='WebCamVideo' ref={imgRef}/>}
            <div className={s.logs}>
                {messageTexts.map((message, i) => <div key={i}>{message}</div>)}
            </div>
        </div>
    );
}