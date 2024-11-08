import { onSnapshot, Timestamp } from "firebase/firestore"
import React, { useEffect, useState } from "react"
import ReviewsCard from "../../components/reviews-card"
import { useFirebase } from "../../contexts/FirebaseProvider"
import { getReviewsQuery, startExtractGmapReviews } from "../../services/firebaseService"

const sortBy = ["Most Relevant", "Newest", "Lowest rating", "Highest rating"]

const defaultScrap = {
  url: "",
  limit: 50,
  sortBy: sortBy[1],
  extractImageUrls: false,
  ownerResponse: true,
  onlyGoogleReviews: false,
}

function renderCount(review: any) {
  if (!review || !review.totalReviews) {
    return <i className="bi-question-lg"></i>
  }
  let count = review.totalReviews || 0

  return <span>{count} reviews</span>
}

function formatTime(date: Timestamp) {
  if (!date || !date.seconds) return ""

  const d = new Date(date.seconds * 1000)
  return `${d.toLocaleDateString()} ${d.toLocaleTimeString()}`
}

function spentTime(start: Timestamp, end: Timestamp) {
  if (!start || !end) return "N/A"

  const diff = end.seconds - start.seconds
  if (diff < 60) {
    return `${diff} seconds`
  } else if (diff < 3600) {
    return `${Math.floor(diff / 60)} minutes`
  } else {
    return `${Math.floor(diff / 3600)} hours`
  }
}

const DashboardTest: React.FC = () => {
  const { firestore, user } = useFirebase()

  const [scrap, setScrap] = useState(defaultScrap)

  const tableHeader = [
    {
      text: "#",
      field: 'index',
      render: (_: any, rowIndex: number) => rowIndex + 1,
    },
    {
      text: "Place",
      icon: "geo",
      field: 'title',
      render: (row: any) => {
        return <a href={`/reviews/${row.id}`}>{row.title || row.url}</a>
      }
    },
    {
      text: "Date",
      icon: "clock",
      field: 'createdAt',
      render: (row: any) => <span>{formatTime(row.createdAt)}</span>,
    },
    {
      text: "Reviews",
      icon: "chat-square-text",
      field: 'totalReviews',
      render: (row: any) => renderCount(row),
    },
    {
      text: "Time",
      icon: "hourglass-split",
      field: 'timeSpent',
      render: (row: any) => spentTime(row.createdAt, row.completedAt),
    },
    {
      text: "File format",
      icon: "file-earmark-zip",
      field: 'format',
      render: () => (
        <select className="geo-select">
          <option value="1" selected>JSON</option>
          <option value="2">CSV</option>
        </select>
      ),
    },
    {
      text: "",
      icon: "",
      field: 'download',
      render: () => (
        <button className="btn btn-sm btn-primary">
          <i className="bi bi-cloud-download"></i>
        </button>
      ),
    },
  ];

  const [inProgressData, setInProgressData] = useState<any[]>([])
  const [doneData, setDoneData] = useState<any[]>([])
  const [canceledData, setCanceledData] = useState<any[]>([])

  useEffect(() => {
    if (!firestore || !user) return;
  
    const fetchReviews = (status: string, setData: any) => {
      return onSnapshot(
        getReviewsQuery({ uid: user.uid, status, orderByField: "createdAt", loadLimit: 5 }),
        querySnapshot => {
          const reviewsData = querySnapshot.docs.map(doc => ({
            ...doc.data(),
            id: doc.id,
          }));
          setData(reviewsData);
        }
      );
    };
  
    const unsubscribeCompleted = fetchReviews("completed", setDoneData);
    const unsubscribeInProgress = fetchReviews("in-progress", setInProgressData);
    const unsubscribeFailed = fetchReviews("failed", setCanceledData);
  
    return () => {
      unsubscribeCompleted();
      unsubscribeInProgress();
      unsubscribeFailed();
    };
  }, [firestore, user]);  

  async function startScraping(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault()
    if (!firestore || !user) return
    setScrap(defaultScrap)
    console.log("startScraping", scrap)
    await startExtractGmapReviews(user.uid, scrap)
  }

  return (
    <div className="geo-dashboard">
      <div className="geo-dashboard__wrapper">
        <div className="geo-dashboard__header">
          <form className="geo-dashboard__form">
            <div className="geo-dashboard__row row">
              <div className="geo-dashboard__column col">
                <div className="geo-dashboard__form-group form-group">
                  <label
                    className="geo-dashboard__input-label"
                    htmlFor="scrapURl"
                  >
                    Sharable URL
                  </label>
                  <input
                    name="scrapURl"
                    value={scrap.url}
                    onChange={e =>
                      setScrap(prev => ({ ...prev, url: e.target.value }))
                    }
                    placeholder="Place URL"
                    type="text"
                    className="geo-dashboard__input geo-input form-control"
                    id="scrapURl"
                  />
                </div>
              </div>
              <div className="geo-dashboard__column col">
                <div className="geo-dashboard__form-group form-group">
                  <label
                    className="geo-dashboard__input-label"
                    htmlFor="extractLimit"
                  >
                    Extract limit
                  </label>
                  <input
                    name="extractLimit"
                    value={scrap.limit}
                    onChange={e =>
                      setScrap(prev => ({
                        ...prev,
                        limit: Number(e.target.value),
                      }))
                    }
                    placeholder="Extract limit"
                    type="text"
                    className="geo-dashboard__input geo-input form-control"
                    id="extractLimit"
                  />
                </div>
              </div>
              <div className="geo-dashboard__column col">
                <div className="geo-dashboard__form-group form-group">
                  <label
                    className="geo-dashboard__input-label"
                    htmlFor="sortBy"
                  >
                    Sort by
                  </label>
                  <select
                    name="sortBy"
                    value={scrap.sortBy}
                    onChange={e =>
                      setScrap(prev => ({ ...prev, sortBy: e.target.value }))
                    }
                    className="geo-dashboard__input geo-input form-select"
                    id="sortBy"
                  >
                    {sortBy.map((sort, index) => (
                      <option key={index} value={sort}>
                        {sort}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="geo-dashboard__filter">
              <div className="geo-dashboard__form-group form-group">
                <div className="geo-dashboard__checkbox-group form-group">
                  <div className="geo-dashboard__checkbox-item">
                    <input
                      checked={scrap.extractImageUrls}
                      onChange={() =>
                        setScrap(prev => ({
                          ...prev,
                          extractImageUrls: !prev.extractImageUrls,
                        }))
                      }
                      type="checkbox"
                      className="geo-dashboard__checkbox-input btn-check"
                      id="extraImage"
                    />
                    <label
                      className="geo-dashboard__checkbox-label btn geo-btn-transparent"
                      htmlFor="extraImage"
                    >
                      <i className="bi bi-image"></i>
                      Extract image urls
                    </label>
                  </div>
                  <div className="geo-dashboard__checkbox-item">
                    <input
                      checked={scrap.ownerResponse}
                      onChange={() =>
                        setScrap(prev => ({
                          ...prev,
                          ownerResponse: !prev.ownerResponse,
                        }))
                      }
                      type="checkbox"
                      className="geo-dashboard__checkbox-input btn-check"
                      id="ownerResponse"
                    />
                    <label
                      className="geo-dashboard__checkbox-label btn geo-btn-transparent"
                      htmlFor="ownerResponse"
                    >
                      <i className="bi bi-megaphone"></i>
                      Owner response
                    </label>
                  </div>
                  <div className="geo-dashboard__checkbox-item">
                    <input
                      checked={scrap.onlyGoogleReviews}
                      onChange={() =>
                        setScrap(prev => ({
                          ...prev,
                          onlyGoogleReviews: !prev.onlyGoogleReviews,
                        }))
                      }
                      type="checkbox"
                      className="geo-dashboard__checkbox-input btn-check"
                      id="onlyGoogleReviews"
                    />
                    <label
                      className="geo-dashboard__checkbox-label btn geo-btn-transparent"
                      htmlFor="onlyGoogleReviews"
                    >
                      <i className="bi bi-google"></i>
                      Only Google reviews
                    </label>
                  </div>
                </div>
              </div>
              <button
                className="geo-dashboard__start-btn geo-btn-primary btn btn-primary"
                onClick={startScraping}
              >
                <i className="bi bi-play-fill"></i>
                Start
              </button>
            </div>
          </form>
        </div>
        <div className="geo-dashboard__view-all">
          {/* <a
            onClick={() => {
              setViewAll(true)
              setInProggressShow(true)
              setDoneShow(true)
              setCanceledShow(true)
            }}
            className="geo-dashboard__view-all__btn"
          >
            <i className="bi bi-grid"></i>
            View all
          </a> */}
        </div>
        
        {
          [
            {
              data: inProgressData,
              statusText: "In progress",
              badgeType: "warning",
            },
            {
              data: doneData,
              statusText: "Done",
              badgeType: "success",
            },
            {
              data: canceledData,
              statusText: "Canceled",
              badgeType: "danger",
            },
          ].map(({
            data,
            statusText,
            badgeType = "success",
          }, index) => (
            <ReviewsCard
              key={index}
              data={data}
              statusText={statusText}
              badgeType={badgeType as any}
              tableHeader={tableHeader}
            />
          ))
        }
      </div>
    </div>
  )
}

export default DashboardTest