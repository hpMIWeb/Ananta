import { Navigate } from "react-router-dom";
import Cookies from 'js-cookie';

const PrivateRoute = ({ component: Component, ...rest }) => {
  const jwtToken = Cookies.get('jwt_token');

  return jwtToken ? <Component {...rest} /> : <Navigate to="/login" />;
};

export default PrivateRoute;
