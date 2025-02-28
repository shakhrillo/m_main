import { formatNumber } from "../../utils/formatNumber";
import { useEffect, useState } from "react";
import { getStatistics } from "../../services/statistics";

export const CommentsTotal = () => {
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
    <>
      <div className="dashboard-title">Reviews</div>
      <div className="dashboard-graph">
        <h1 className="m-0">{formatNumber(comments)}</h1>
      </div>
    </>
  );
};
