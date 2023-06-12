import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../states/store";
import { setCounter } from "../../states/app";

const Home = () => {
  const dispatch = useDispatch();
  const { hello, counter } = useSelector((state: RootState) => state.app);

  useEffect(() => {
    setTimeout(() => {
      dispatch(setCounter());
    }, 1000);
  }, [counter, dispatch]);
  return (
    <p>
      Home , {hello} {counter}
    </p>
  );
};

export default Home;
