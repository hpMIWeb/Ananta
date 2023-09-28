import { configureStore } from "@reduxjs/toolkit";
import loginReducers from "./loginReducers";
import getSubscriptionsListSlice from "./getSubscriptionsReducers";
import createSubscriptionsReducersSlice from "./createSubscriptionsReducers";
import deleteSubscriptionsReducersSlice from "./deleteSubscriptionsReducers";
import getAddonsReducersListSlice from "./getAddonsReducers";
import createAddonsReducersReducersSlice from "./createAddonsReducers";
import getPromocodeReducersListSlice from "./getPromocodeReducers";
import getUserInfoReducers from "./getUserInfoReducers";
import createPromoCodeReducers from "./createPromoCodeReducers";
import getClientsReducers from "./getClientsReducers";
import createClientReducers from "./createClientReducers";
import getEmployeesReducers from "./getEmployeesReducers";
import createEmployeeReducers from "./createEmployeeReducers";
import getRolesReducers from "./getRolesReducers";
import getRoleTypeReducers from "./getRoleTypeReducers";
import getDepartmentsReducers from "./getDepartmentsReducers";
import getTeamsReducer from "./getTeamsReducer";
import getDesignationReducers from "./getDesignationReducers";

export const store = configureStore({
    reducer: {
        login: loginReducers,
        userInfo: getUserInfoReducers,
        getSubscriptionsListApi: getSubscriptionsListSlice,
        createSubscriptions: createSubscriptionsReducersSlice,
        deleteSubscriptions: deleteSubscriptionsReducersSlice,
        getAddonsList: getAddonsReducersListSlice,
        createAddon: createAddonsReducersReducersSlice,
        getPromocodeList: getPromocodeReducersListSlice,
        createPromoCode: createPromoCodeReducers,
        getClients: getClientsReducers,
        getEmployees: getEmployeesReducers,
        getRoles: getRolesReducers,
        getRoleType: getRoleTypeReducers,
        getDepartments: getDepartmentsReducers,
        createClient: createClientReducers,
        createEmployee: createEmployeeReducers,
        getTeams: getTeamsReducer,
        getDesignation: getDesignationReducers,
    },
});
