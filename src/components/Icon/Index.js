import classNames from "classnames";
import React from "react";
import Isvg from "react-inlinesvg";

const Icon = ({
    name,
    width = 20,
    height = 20,
    className = "",
    onClick = () => {},
}) => {
    try {
        return (
            <Isvg
                width={width}
                height={height}
                className={classNames({ [className]: className })}
                src={require(`../../assets/svg/${name}.svg`)}
                onClick={onClick}
            />
        );
    } catch (e) {
        const err = `Icon Error: ${
            !name ? "name is missing in prop" : e.message
        }`;
        console.error(err);
        return <span title={err}>icon error</span>;
    }
};

export default Icon;
