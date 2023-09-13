import React, { useEffect, useState } from "react";
import { Pagination as AntdPagination } from "antd";
import "./pagination.scss";
import Icon from "../Icon/Index";

const Pagination = ({ data = [], setPaginationDisplayedItems }) => {
    const pageSize = 5; // Number of items to display per page
    const totalItems = data.length;

    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        updateDisplayedItems(currentPage);
    }, [data]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
        updateDisplayedItems(page);
    };

    const updateDisplayedItems = (page) => {
        const startIndex = (page - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        const itemsToDisplay = data.slice(startIndex, endIndex);
        setPaginationDisplayedItems(itemsToDisplay);
    };

    return (
        <div
            style={{ marginBottom: 5, marginTop: 10 }}
            className="row flex-between-center custom-pagination"
        >
            <div className="col-12">
                <div className="d-flex justify-content-end">
                    <AntdPagination
                        itemRender={(page, originalElement) => {
                            switch (originalElement) {
                                case "prev":
                                    return (
                                        <span className="pageLink">
                                            <Icon
                                                height={14}
                                                width={8.75}
                                                name="prevArrow"
                                            />
                                        </span>
                                    );
                                case "next":
                                    return (
                                        <span className="pageLink">
                                            <Icon
                                                height={14}
                                                width={8.75}
                                                name="prevArrow"
                                                className="rotateReverce"
                                            />
                                        </span>
                                    );
                                case "page":
                                    return (
                                        <span className="pageLink">{page}</span>
                                    );
                                case "jump-next":
                                    return (
                                        <span className="pageLink">
                                            <Icon
                                                height={14}
                                                width={8.75}
                                                name="rightSkipArrow"
                                            />
                                        </span>
                                    );
                                case "jump-prev":
                                    return (
                                        <span className="pageLink">
                                            <Icon
                                                height={14}
                                                width={8.75}
                                                name="rightSkipArrow"
                                                className="rotateReverce"
                                            />
                                        </span>
                                    );
                            }
                        }}
                        className="customPagination"
                        total={totalItems}
                        pageSize={pageSize}
                        current={currentPage}
                        onChange={handlePageChange}
                    />
                </div>
            </div>
        </div>
    );
};

export default Pagination;
