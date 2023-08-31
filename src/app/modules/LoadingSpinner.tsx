import React from "react";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

const loadingPanel = <LoadingOutlined style={{ fontSize: 24 }} spin />;

interface LoadingSpinnerProps {
    isLoading: boolean;
    indicator?: React.ReactNode;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
    isLoading,
    indicator,
}) => {
    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "100vh",
                backgroundColor: "rgba(0, 0, 0, 0.3)",
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 9999,
                visibility: isLoading ? "visible" : "hidden",
            }}
        >
            <Spin indicator={loadingPanel} />
        </div>
    );
};

export default LoadingSpinner;
