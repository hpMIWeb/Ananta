import React, { useState, useEffect } from "react";
import "./stopwatch.scss";
import {
    setLocalstorage,
    removeLocalstorage,
    getLocalStorage,
} from "../../utilities/utility";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPause, faPlay, faStop } from "@fortawesome/free-solid-svg-icons";

const Stopwatch = (props: any) => {
    // state to store time
    const [time, setTime] = useState<number>(0);

    useEffect(() => {
        const taskTiming = getLocalStorage("task_" + props.taskId);
        console.log("taskTiming - ", taskTiming);
        if (taskTiming && taskTiming !== "") setTime(parseInt(taskTiming));
    }, [props.taskId]);

    // state to check stopwatch running or not
    const [isRunning, setIsRunning] = useState(false);

    useEffect(() => {
        let intervalId: any;
        if (isRunning) {
            // setting time from 0 to 1 every 10 milisecond using javascript setInterval method
            intervalId = setInterval(() => {
                setTime(time + 1);
                setLocalstorage("task_" + props.taskId, time.toString());
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

    // Method to start and stop timer
    const startAndStop = () => {
        setIsRunning(!isRunning);
    };

    // Method to reset timer back to 0
    const reset = () => {
        setTime(0);
    };
    return (
        <div className="stopwatch-container">
            <div className="stopwatch-buttons">
                <FontAwesomeIcon
                    icon={faPlay}
                    onClick={startAndStop}
                    className="timer-play"
                    title="Click here to start task"
                    style={{
                        display: !isRunning ? "block" : "none",
                    }}
                />
                <FontAwesomeIcon
                    icon={faPause}
                    onClick={startAndStop}
                    className="timer-pause"
                    title="Click here to pause task"
                    style={{
                        display: isRunning ? "block" : "none",
                    }}
                />
                <FontAwesomeIcon
                    icon={faStop}
                    onClick={reset}
                    className="timer-stop"
                    title="Click here to stop task"
                />
                <span className="stopwatch-time">
                    {hours}:{minutes.toString().padStart(2, "0")}:
                    {seconds.toString().padStart(2, "0")}:
                    {milliseconds.toString().padStart(2, "0")}
                </span>
            </div>
        </div>
    );
};

export default Stopwatch;
