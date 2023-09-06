import { Navigate } from "react-router-dom";
import { getAuthToken } from "../../../utils/helpers";
import Cookies from "js-cookie";

const PrivateRoute = ({ component: Component, ...rest }: any) => {
    const jwtToken = Cookies.get("jwt_token");
    return jwtToken ? <Component {...rest} /> : <Navigate to="/login" />;
};

export default PrivateRoute;
