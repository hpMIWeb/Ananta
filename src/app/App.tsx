import React from "react";
import { Provider } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { HotKeys } from "react-hotkeys";
import store from "../states/store";
import Layout from "./modules/Layout";
import Home from "./modules/Home";
import Dashboard from "./modules/Dashboard";
import NoMatch from "./modules/NoMatch";
import TaskList from "./modules/task/TaskList";
import AddTask from "./modules/task/AddTask";
import AddMultipleTask from "./modules/task/AddMultipleTask";
import TimeSheet from "./modules/timesheet/TimeSheet";
import ComplianceList from "./modules/compliance/ComplianceList";
import "./App.scss";
import "antd/dist/reset.css";
import AddCompliance from "./modules/compliance/AddCompliance";
import EmpTimeSheet from "./modules/timesheet/EmpTimeSheet";
import ClientTimeSheet from "./modules/timesheet/ClientTimeSheet";
import Approval from "./modules/aproval/Aproval";
import Setting from "./modules/Setting/Setting";
import Login from "./modules/login/Login";
import PrivateRoute from "./components/Auth/PrivateRoute/PrivateRoute";

const keyMap = {
    SNAP_LEFT: "command+left",
    DELETE_NODE: ["del", "backspace"],
    openAddTask: "F8",
};

const App = () => {
    const handlers = {
        openAddTask: () => {
            console.log("Add Task will open");
            // navigate("/addTask");
        },
    };

    return (
        <div data-theme={"dark"}>
            <HotKeys keyMap={keyMap} handlers={handlers}>
                <Provider store={store}>
                    <BrowserRouter>
                        <Routes>
                            <Route path="login" element={<Login />} />
                            <Route path="/" element={<Layout />}>
                                <Route element={<Home />} />
                                <Route
                                    index
                                    path="task"
                                    element={
                                        <PrivateRoute component={TaskList} />
                                    }
                                />
                                <Route path="about" element={<Dashboard />} />
                                <Route
                                    path="add-task"
                                    element={
                                        <PrivateRoute component={AddTask} />
                                    }
                                />
                                <Route
                                    path="add-multi-task"
                                    element={
                                        <PrivateRoute
                                            component={AddMultipleTask}
                                        />
                                    }
                                />
                                <Route
                                    path="compliance"
                                    element={
                                        <PrivateRoute
                                            component={ComplianceList}
                                        />
                                    }
                                />
                                <Route
                                    path="add-compliance"
                                    element={
                                        <PrivateRoute
                                            component={AddCompliance}
                                        />
                                    }
                                />
                                <Route
                                    path="approval"
                                    element={
                                        <PrivateRoute component={Approval} />
                                    }
                                />
                                <Route
                                    path="timesheet"
                                    element={
                                        <PrivateRoute component={TimeSheet} />
                                    }
                                />
                                <Route
                                    path="emp-time-sheet"
                                    element={
                                        <PrivateRoute
                                            component={EmpTimeSheet}
                                        />
                                    }
                                />
                                <Route
                                    path="client-time-sheet"
                                    element={
                                        <PrivateRoute
                                            component={ClientTimeSheet}
                                        />
                                    }
                                />
                                <Route
                                    path="Setting"
                                    element={
                                        <PrivateRoute component={Setting} />
                                    }
                                />
                                <Route path="*" element={<NoMatch />} />
                            </Route>
                        </Routes>
                    </BrowserRouter>
                </Provider>
            </HotKeys>
        </div>
    );
};

export default App;
