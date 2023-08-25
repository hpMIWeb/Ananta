import { Navigate } from "react-router-dom";
import { ComponentType } from "react";
import { getLocalStorage } from "../../../utilities/utility";

interface PrivateRouteProps {
    component: ComponentType<any>;
}

const PrivateRoute = ({ component: Component, ...rest }: PrivateRouteProps) => {
    const token = getLocalStorage("authtoken");

    return token ? <Component {...rest} /> : <Navigate to="/login" />;
};

export default PrivateRoute;
