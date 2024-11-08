import React, { useState } from "react";
import { Table } from "../table";

interface ReviewsCardProps {
  data: any[];
  statusText?: string;
  badgeType?: "warning" | "success" | "error";
  displayCount?: number;
  tableHeader: any;
}

const ReviewsCard: React.FC<ReviewsCardProps> = ({
  data,
  statusText = "In Progress",
  badgeType = "warning",
  displayCount = 5,
  tableHeader,
}) => {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isTableExpanded, setIsTableExpanded] = useState(false);

  const toggleFullScreen = () => {
    setIsFullScreen((prev) => !prev);
    setIsTableExpanded(false); // Close expanded view when toggling fullscreen
  };

  const toggleTableExpanded = () => setIsTableExpanded((prev) => !prev);

  const displayedData = data.slice(0, displayCount);

  return (
    <div className={`geo-dashboard__body ${isFullScreen ? "geo-dashboard__full-screen" : ""}`}>
      <div className="geo-dashboard__body-wrapper">
        <Header
          dataCount={data.length}
          statusText={statusText}
          badgeType={badgeType}
          isFullScreen={isFullScreen}
          isTableExpanded={isTableExpanded}
          onToggleFullScreen={toggleFullScreen}
          onToggleTableExpanded={toggleTableExpanded}
        />
        <div className="geo-dashboard__body-content">
          <Table tableHeader={tableHeader} body={displayedData} />
        </div>
      </div>
      {/* {isFullScreen && <Pagination />} */}
    </div>
  );
};

// Header Component
interface HeaderProps {
  dataCount: number;
  statusText: string;
  badgeType: "warning" | "success" | "error";
  isFullScreen: boolean;
  isTableExpanded: boolean;
  onToggleFullScreen: () => void;
  onToggleTableExpanded: () => void;
}

const Header: React.FC<HeaderProps> = ({
  dataCount,
  statusText,
  badgeType,
  isFullScreen,
  isTableExpanded,
  onToggleFullScreen,
  onToggleTableExpanded,
}) => (
  <div className="geo-dashboard__body-header">
    <StatusBadge text={statusText} type={badgeType} count={dataCount} />
    <div className="geo-dashboard__progress__btns">
      {!isFullScreen && (
        <IconButton
          icon={`bi-chevron-${isTableExpanded ? "down" : "up"}`}
          onClick={onToggleTableExpanded}
        />
      )}
      <IconButton
        icon={`bi-fullscreen${isFullScreen ? "-exit" : ""}`}
        onClick={onToggleFullScreen}
      />
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
  onClick: () => void;
}

const IconButton: React.FC<IconButtonProps> = ({ icon, onClick }) => (
  <a onClick={onClick} className="geo-dashboard__progress-icon">
    <i className={`bi ${icon}`}></i>
  </a>
);

export default ReviewsCard;
