import { useEffect } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    Cookies.remove("jwt_token");
    navigate("../login", { replace: true });
  }, []);

  return null;
};

export default Logout;
