import React, { useState, useEffect } from "react";
import "./stopwatch.scss";
import {
    setLocalstorage,
    getLocalStorage,
    Status,
} from "../../utilities/utility";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPause, faPlay, faStop } from "@fortawesome/free-solid-svg-icons";

const Stopwatch = (props: any) => {
    // state to store time
    const [time, setTime] = useState<number>(0);
    const [status, setStatus] = useState<string>("");
    const [showButtons, setShowButtons] = useState<Boolean>(true);
    const [showSeconds, setShowSeconds] = useState<Boolean>(
        true
        //props.showSeconds || true
    );
    const [label, setLabel] = useState<String>(props.label);

    useEffect(() => {
        if (props.parentId) {
            let taskTiming = getLocalStorage(label + "_" + props.parentId);
            taskTiming = taskTiming ?? "0";
            setTime(parseInt(taskTiming));
        }
    }, [props.parentId]);

    useEffect(() => {
        if (props.status) {
            setStatus(props.status);
            setShowButtons(
                [Status.completed, Status.cancelled].indexOf(props.status) ===
                    -1
            );
        }
    }, [props.status]);

    // state to check stopwatch running or not
    const [isRunning, setIsRunning] = useState(false);

    useEffect(() => {
        let intervalId: any;
        if (isRunning) {
            // setting time from 0 to 1 every 10 milisecond using javascript setInterval method
            intervalId = setInterval(() => {
                setTime(time + 1);
                setLocalstorage(label + "_" + props.parentId, time.toString());
            }, 10);
        }
        return () => clearInterval(intervalId);
    }, [isRunning, time]);

    // Hours calculation
    const hours = Math.floor(time / 360000);

    // Minutes calculation
    const minutes = Math.floor((time % 360000) / 6000);

    // Seconds calculation
    const seconds = Math.floor((time % 6000) / 100);

    // Milliseconds calculation
    const milliseconds = time % 100;

    const getTime = () => {
        return `${hours}:${minutes.toString().padStart(2, "0")}`;
    };

    // Method to start and stop timer
    const startAndPause = () => {
        const updatedStatus = !isRunning;
        setIsRunning(updatedStatus);

        if (props.handleTaskStatus) {
            props.handleTaskStatus(updatedStatus, getTime(), false);
        }
    };

    // Method to reset timer back to 0
    const stopEvent = () => {
        setIsRunning(false);
        setShowButtons(false);
        if (props.handleTaskStatus) {
            props.handleTaskStatus(false, getTime(), true);
        }
    };
    return (
        <div className="stopwatch-container">
            <div className="stopwatch-buttons">
                {showButtons && (
                    <>
                        <FontAwesomeIcon
                            icon={faPlay}
                            onClick={startAndPause}
                            className="timer-play"
                            title="Click here to start task"
                            style={{
                                display: !isRunning ? "block" : "none",
                            }}
                        />
                        <FontAwesomeIcon
                            icon={faPause}
                            onClick={startAndPause}
                            className="timer-pause"
                            title="Click here to pause task"
                            style={{
                                display: isRunning ? "block" : "none",
                            }}
                        />
                        <FontAwesomeIcon
                            icon={faStop}
                            onClick={stopEvent}
                            className="timer-stop"
                            title="Click here to stop task"
                        />
                    </>
                )}
                <span className="stopwatch-time">
                    {hours.toString().padStart(2, "0")}:
                    {minutes.toString().padStart(2, "0")}
                    {showSeconds && ":" + seconds.toString().padStart(2, "0")}
                </span>
            </div>
        </div>
    );
};

export default Stopwatch;
