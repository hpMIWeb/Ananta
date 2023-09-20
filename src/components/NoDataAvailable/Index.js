import React from "react";
import styles from "./noDataAvailable.module.scss";

const NoDataAvailable = ({ name }) => {
  return (
    <div className={styles.noDataAvailableWrapper}>
      <h5 style={{ marginBottom: 4 }}>{name}</h5>
    </div>
  );
};

export default NoDataAvailable;
