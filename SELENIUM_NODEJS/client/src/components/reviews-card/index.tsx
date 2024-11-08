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
  statusText = "In Progress",
  badgeType = "warning",
  tableHeader,
}) => (
  <div className="geo-dashboard__body">
    <div className="geo-dashboard__body-wrapper">
      <Header
        dataCount={data.length}
        statusText={statusText}
        badgeType={badgeType}
      />
      <div className="geo-dashboard__body-content">
        <Table tableHeader={tableHeader} body={data} />
      </div>
    </div>
  </div>
);

// Header Component
interface HeaderProps {
  dataCount: number;
  statusText: string;
  badgeType: "warning" | "success" | "error";
}

const Header: React.FC<HeaderProps> = ({ dataCount, statusText, badgeType }) => (
  <div className="geo-dashboard__body-header">
    <StatusBadge text={statusText} type={badgeType} count={dataCount} />
    <div className="geo-dashboard__progress__btns">
      <IconButton icon="bi-chevron-up" />
      <IconButton icon="bi-fullscreen-exit" />
    </div>
  </div>
);

// StatusBadge Component
interface StatusBadgeProps {
  text: string;
  type: "warning" | "success" | "error";
  count: number;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ text, type, count }) => (
  <div className="geo-dashboard__progress">
    <span className={`geo-dashboard__progress-badge geo-dashboard__progress-badge--${type}`}>
      {text}
    </span>
    <span className="geo-dashboard__progress-count">{count}</span>
  </div>
);

// IconButton Component
interface IconButtonProps {
  icon: string;
}

const IconButton: React.FC<IconButtonProps> = ({ icon }) => (
  <a className="geo-dashboard__progress-icon">
    <i className={`bi ${icon}`}></i>
  </a>
);

export default ReviewsCard;
