
import React, {useCallback, useEffect, useState} from "react";
import Modal from './Modal'
import {IProgressResponse} from "../interface/interfaces";

interface Props {
    isOpen: boolean,
    onClose: () => void,
}

function ProgressModal({isOpen, onClose}: Props) {
    const [count, setCount] = useState(0);
    const [progress, setProgress] = useState('The  0  record.');
    const intervalRef = React.useRef<number>();

    const fetchProgress = () => {
        if (count === -1) {
            stop();
        }
        if (isOpen) {
            fetch('http://localhost:8080/invoice/upload/progress', {
                method: 'GET',
                headers: [
                    ['withCredentials', 'false']
                ],
            })
                .then(res => res.json())
                .then((data: IProgressResponse) => {
                    setCount(data.result)
                    setProgress('The  ' + data.result + '  record.');
                });
        }
    }

    const start = () => {
        intervalRef.current = window.setInterval(() => {
            fetchProgress();
        }, 500)
    }

    const stop = () => {
        clearInterval(intervalRef.current);
    }


    useEffect(() => {
        start();
        return () => stop();
    }, [isOpen]);

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Uploading..."
            body={progress}
        />
    )
}

export default ProgressModal;