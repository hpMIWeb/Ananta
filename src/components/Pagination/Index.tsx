import React, { useEffect, useState } from "react";
import { Pagination as AntdPagination } from "antd";
import type { PaginationProps } from "antd";
import "./pagination.scss";
import Icon from "../Icon/Index";

interface PageProps {
  data: any[];
  setPaginationDisplayedItems: any;
  setPageNumber: any;
}

const Pagination = ({
  data = [],
  setPaginationDisplayedItems,
  setPageNumber,
}: PageProps) => {
  const totalItems = data.length;

  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageSize, setCurrentPageSize] = useState<number>(5);

  useEffect(() => {
    updateDisplayedItems(currentPage);
  }, [data, currentPageSize, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    updateDisplayedItems(page);
  };

  const updateDisplayedItems = (page: number) => {
    const startIndex = (page - 1) * currentPageSize;
    const endIndex = startIndex + currentPageSize;
    console.log("startIndex", startIndex);
    console.log("endIndex", endIndex);
    const itemsToDisplay = data.slice(startIndex, endIndex);
    console.log("itemsToDisplay", itemsToDisplay);
    console.log("length", itemsToDisplay.length);
    setPaginationDisplayedItems(itemsToDisplay);
    setPageNumber(page, currentPageSize);
  };

  const paginationItemRender = (page: number, originalElement: any) => {
    switch (originalElement) {
      case "prev":
        return (
          <span className="pageLink">
            <Icon height={14} width={8.75} name="prevArrow" />
          </span>
        );
      case "next":
        return (
          <span className="pageLink">
            <Icon
              height={14}
              width={8.75}
              name="prevArrow"
              className="rotateRevere"
            />
          </span>
        );
      case "page":
        return <span className="pageLink">{page}</span>;
      case "jump-next":
        return (
          <span className="pageLink">
            <Icon height={14} width={8.75} name="rightSkipArrow" />
          </span>
        );
      case "jump-prev":
        return (
          <span className="pageLink">
            <Icon
              height={14}
              width={8.75}
              name="rightSkipArrow"
              className="rotateRevere"
            />
          </span>
        );
    }
  };

  const onShowSizeChange: PaginationProps["onShowSizeChange"] = (
    current,
    pageSize
  ) => {
    setCurrentPage(current);
    setCurrentPageSize(pageSize);
  };

  return (
    <div
      style={{ marginBottom: 16 }}
      className="row flex-between-center custom-pagination"
    >
      <div className="col-12">
        <div className="d-flex justify-content-end">
          <AntdPagination
            showSizeChanger
            onShowSizeChange={onShowSizeChange}
            itemRender={paginationItemRender}
            className="customPagination"
            total={totalItems}
            defaultPageSize={currentPageSize}
            current={currentPage}
            onChange={handlePageChange}
            pageSizeOptions={[1, 2, 3, 5, 10, 20, 50, 100]}
          />
        </div>
      </div>
    </div>
  );
};

export default Pagination;
