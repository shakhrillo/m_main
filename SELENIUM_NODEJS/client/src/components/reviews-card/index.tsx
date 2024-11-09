import React from "react";
import { Table } from "../table";

interface ReviewsCardProps {
  data: any[];
  statusText?: string;
  badgeType?: "warning" | "success" | "error";
  tableHeader: any;
}

const ReviewsCard: React.FC<ReviewsCardProps> = ({
  data,
  tableHeader,
}) => (
  <div className="custom-card">
    <div className="custom-card__header">
      <div className="custom-card__header-action">
        <button className="btn me-auto">
          <i className="bi bi-table"></i>
          Total: {data.length}
        </button>
        <button className="btn">
          <i className="bi bi-filter"></i>
          Filter
        </button>
        <button className="btn">
          <i className="bi bi-search"></i>
          Search
        </button>
        <button className="btn btn-danger">
          <i className="bi bi-trash"></i>
          Delete
        </button>
      </div>
    </div>
    <div className="custom-card__body">
      <Table tableHeader={tableHeader} body={data} />
    </div>
  </div>
);

export default ReviewsCard;
