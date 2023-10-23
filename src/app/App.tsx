import React, { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./modules/Layout/Index";
import Home from "./modules/Home/Index";
import NoMatch from "./modules/NoMatch/Index";
import Login from "./modules/Login/Index";
import PrivateRoute from "../components/PrivateRoute/Index";
import Subscription from "./modules/Subscription/Index";
import AddOns from "./modules/AddOns/Index";
import useLocalStorage from "use-local-storage";
import "../styles/index.scss";
import "./App.scoped.css";
import AddSubscription from "./modules/Subscription/AddSubscription/Index";
import NewAddOns from "./modules/AddOns/NewAddOns/Index";
import PromoCodes from "./modules/PromoCodes/Index";
import AddPromoCode from "./modules/PromoCodes/AddPromoCode/Index";
import Clients from "./modules/Clients/Index";
import AddClient from "./modules/Clients/AddClient/Index";
import Logout from "./modules/Logout/Index";
import BulkAddClient from "./modules/Clients/AddClient/BulkAddClient/Index";
import { getAuthToken } from "../utils/helpers.js";
import { useDispatch } from "react-redux";
import { getUserInfoReducersApi } from "../redux/getUserInfoReducers";
import Employees from "./modules/Employees/Index";
import AddEmployee from "./modules/Employees/AddEmployee/Index";
import ResetPassword from "./modules/ResetPassword/Index";
import EmployeeView from "./modules/Employees/EmployeeView";

//master code

import Department from "./modules/master/Department/Department";
import DefaultDepartment from "./modules/default-master/DefaultDepartment/DefaultDepartment";
import Designation from "./modules/master/Designation/Designation";
import DefaultDesignation from "./modules/default-master/DefaultDesignation/DefaultDesignation";
import Role from "./modules/master/Role/Role";
import DefaultRole from "./modules/default-master/DefaultRole/DefaultRole";
import RoleAction from "./modules/master/Role/RoleAction";
import DefaultRoleAction from "./modules/default-master/DefaultRole/DefaultRoleAction";
import DefaultChecklist from "./modules/default-master/DefaultChecklist/DefaultChecklist";
import Team from "./modules/master/Team/Team";
import Checklist from "./modules/master/Checklist/Checklist";
import DefaultIndustryType from "./modules/default-master/DefaultIndustryType/DefaultIndustryType";
import DefaultLineOfBusiness from "./modules/default-master/DefaultLineOfBusiness/DefaultLineOfBusiness";
import AssociatePartners from "./modules/AssociatePartners/Index";
import AddAssociatePartners from "./modules/AssociatePartners/AddAssociatePartners/Index";
import TaskList from "./modules/task/TaskList";
import AddTask from "./modules/task/AddTask";
import AddMultipleTask from "./modules/task/AddMultipleTask";
import ComplianceList from "./modules/compliance/ComplianceList";
import AddCompliance from "./modules/compliance/AddCompliance";
import Approval from "./modules/aproval/Aproval";
import TimeSheet from "./modules/timesheet/TimeSheet";
import EmpTimeSheet from "./modules/timesheet/EmpTimeSheet";
import ClientTimeSheet from "./modules/timesheet/ClientTimeSheet";
import Setting from "./modules/Setting/Setting";
import AssociatePartnerView from "./modules/AssociatePartners/AssociatePartnerView";
import ClientView from "./modules/Clients/ClientView";

const App = () => {
  const dispatch = useDispatch();
  const defaultDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const [theme, setTheme] = useLocalStorage(
    "theme",
    defaultDark ? "dark" : "light"
  );

  const switchTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
  };

  useEffect(() => {
    if (getAuthToken) {
      // @ts-ignore
      dispatch(getUserInfoReducersApi());
    }
  }, [getAuthToken]);

  return (
    <div className="AppWrapper" style={{ paddingRight: 16 }} data-theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={<Layout switchTheme={switchTheme} theme={theme} />}
          >
            <Route path="login" element={<Login />} />
            <Route path="reset-password" element={<ResetPassword />} />
            <Route index element={<PrivateRoute component={Home} />} />
            <Route
              path="subscription"
              element={<PrivateRoute component={Subscription} />}
            />
            <Route
              path="subscription/add-subscription"
              element={<PrivateRoute component={AddSubscription} />}
            />
            <Route
              path="subscription/edit-subscription"
              element={<PrivateRoute component={AddSubscription} />}
            />
            <Route
              path="addons"
              element={<PrivateRoute component={AddOns} />}
            />
            <Route
              path="addons/create"
              element={<PrivateRoute component={NewAddOns} />}
            />
            <Route
              path="addons/edit"
              element={<PrivateRoute component={NewAddOns} />}
            />
            <Route
              path="promocodes"
              element={<PrivateRoute component={PromoCodes} />}
            />
            <Route
              path="promocodes/create"
              element={<PrivateRoute component={AddPromoCode} />}
            />
            <Route
              path="promocodes/edit"
              element={<PrivateRoute component={AddPromoCode} />}
            />
            <Route
              path="caclient"
              element={<PrivateRoute component={Clients} />}
            />
            <Route
              path="caclient/create"
              element={<PrivateRoute component={AddClient} />}
            />
            <Route
              path="caclient/edit/:clientId"
              element={<PrivateRoute component={AddClient} />}
            />
            <Route
              path="caclient/view-caclient"
              element={<PrivateRoute component={ClientView} />}
            />
            <Route
              path="caclient/createbulk"
              element={<PrivateRoute component={BulkAddClient} />}
            />
            <Route
              path="employee"
              element={<PrivateRoute component={Employees} />}
            />
            <Route
              path="employee/add-employee"
              element={<PrivateRoute component={AddEmployee} />}
            />
            <Route
              path="employee/edit-employee/:employeeId"
              element={<PrivateRoute component={AddEmployee} />}
            />{" "}
            <Route
              path="employee/view-employee"
              element={<PrivateRoute component={EmployeeView} />}
            />
            <Route path="associatePartners" element={<AssociatePartners />} />
            <Route
              path="associatePartners/create"
              element={<AddAssociatePartners />}
            />
            <Route
              path="associatePartners/create/edit/:associatePartnerId"
              element={<PrivateRoute component={AddAssociatePartners} />}
            />
            <Route
              path="associatePartners/view-associatePartners"
              element={<PrivateRoute component={AssociatePartnerView} />}
            />
            {/* Master link */}
            <Route path="department" element={<Department />} />
            <Route path="designation" element={<Designation />} />
            <Route path="role" element={<Role />} />
            <Route path="role-action" element={<RoleAction />} />
            <Route path="team" element={<Team />} />
            <Route path="checklist" element={<Checklist />} />
            {/* Default Master link */}
            <Route
              path="default-department"
              element={<DefaultDepartment />}
            />{" "}
            <Route
              path="default-designation"
              element={<DefaultDesignation />}
            />{" "}
            <Route path="default-role" element={<DefaultRole />} />
            <Route
              path="default-role-action"
              element={<DefaultRoleAction />}
            />{" "}
            <Route path="default-checklist" element={<DefaultChecklist />} />{" "}
            <Route
              path="default-industry-type"
              element={<DefaultIndustryType />}
            />
            <Route
              path="default-line-of-business"
              element={<DefaultLineOfBusiness />}
            />{" "}
            <Route
              path="logout"
              element={<PrivateRoute component={Logout} />}
            />
            {/* Task Master link */}
            <Route index path="task" element={<TaskList />} />
            <Route path="add-task" element={<AddTask />} />
            <Route path="add-multi-task" element={<AddMultipleTask />} />
            <Route path="compliance" element={<ComplianceList />} />
            <Route path="add-compliance" element={<AddCompliance />} />
            <Route path="approval" element={<Approval />} />
            <Route path="timesheet" element={<TimeSheet />} />
            <Route path="emp-time-sheet" element={<EmpTimeSheet />} />
            <Route path="client-time-sheet" element={<ClientTimeSheet />} />
            <Route path="Setting" element={<Setting />} />
            <Route path="*" element={<NoMatch />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
