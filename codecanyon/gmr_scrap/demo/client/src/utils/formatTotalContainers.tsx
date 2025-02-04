export const formatTotalContainers = (data: any[], startDate?: Date) => {
  const dateArray: Record<
    string,
    {
      date: string;
      total: number;
      totalImages: number;
      totalOwnerReviews: number;
      totalReviews: number;
      totalReviewsScraped: number;
      totalUserReviews: number;
      totalVideos: number;
    }
  > = {};
  const currentDate = new Date();

  if (!startDate) {
    startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 2);
  }

  const tempDate = new Date(startDate);
  while (tempDate <= currentDate) {
    const monthKey = `${tempDate.getFullYear()}-${String(tempDate.getMonth() + 1).padStart(2, "0")}`;
    dateArray[monthKey] = {
      date: monthKey,
      total: 0,
      totalImages: 0,
      totalOwnerReviews: 0,
      totalReviews: 0,
      totalReviewsScraped: 0,
      totalUserReviews: 0,
      totalVideos: 0,
    };
    tempDate.setMonth(tempDate.getMonth() + 1);
  }

  const grouped = data.reduce((acc: Record<string, number>, item) => {
    const date = new Date(item.createdAt.seconds * 1000);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    const totalImages = item.totalImages || 0;
    const totalOwnerReviews = item.totalOwnerReviews || 0;
    const totalReviews = item.totalReviews || 0;
    const totalReviewsScraped = item.totalReviewsScraped || 0;
    const totalUserReviews = item.totalUserReviews || 0;
    const totalVideos = item.totalVideos || 0;

    if (acc[monthKey]) {
      acc[monthKey] += 1;
      dateArray[monthKey].totalImages += totalImages;
      dateArray[monthKey].totalOwnerReviews += totalOwnerReviews;
      dateArray[monthKey].totalReviews += totalReviews;
      dateArray[monthKey].totalReviewsScraped += totalReviewsScraped;
      dateArray[monthKey].totalUserReviews += totalUserReviews;
      dateArray[monthKey].totalVideos += totalVideos;
    } else {
      acc[monthKey] = 1;
      dateArray[monthKey].totalImages = totalImages;
      dateArray[monthKey].totalOwnerReviews = totalOwnerReviews;
      dateArray[monthKey].totalReviews = totalReviews;
      dateArray[monthKey].totalReviewsScraped = totalReviewsScraped;
      dateArray[monthKey].totalUserReviews = totalUserReviews;
      dateArray[monthKey].totalVideos = totalVideos;
    }

    return acc;
  }, {});

  Object.keys(dateArray).forEach((monthKey) => {
    if (grouped[monthKey]) {
      dateArray[monthKey].total = grouped[monthKey];
    }
  });

  return Object.values(dateArray);
};
