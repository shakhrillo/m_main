import { formatNumber } from "../../utils/formatNumber";
import type { JSX } from "react";
import { useEffect, useState } from "react";
import { getStatistics } from "../../services/statistics";

/**
 * CommentsTotal component
 * @returns {JSX.Element}
 */
export const CommentsTotal = (): JSX.Element => {
  const [comments, setComments] = useState(0);

  useEffect(() => {
    const subscribtion = getStatistics("comments").subscribe((data) => {
      setComments(data.total);
    });

    return () => {
      subscribtion.unsubscribe();
    };
  }, []);

  return (
    <div>
      <div className="dashboard-title">Reviews</div>
      <div className="dashboard-graph">
        <h3 className="m-0">{formatNumber(comments)}</h3>
      </div>
    </div>
  );
};
