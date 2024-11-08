import { onSnapshot, Timestamp } from "firebase/firestore"
import React, { useEffect, useState } from "react"
import { useFirebase } from "../../contexts/FirebaseProvider"
import { getReviewsQuery, startExtractGmapReviews } from "../../services/firebaseService"
import { Table } from "../../components/Table/Table"

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

  const [inProggressTableShow, setInProggressTableShow] = useState(false)
  const [doneTableShow, setDoneTableShow] = useState(false)
  const [canceledTableShow, setCanceledTableShow] = useState(false)

  const [inProggressShow, setInProggressShow] = useState(false)
  const [doneShow, setDoneShow] = useState(false)
  const [canceledShow, setCanceledShow] = useState(false)

  const [viewAll, setViewAll] = useState(false)

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
    if (!firestore || !user) return

    const unsubscribe = onSnapshot(getReviewsQuery(user.uid), querySnapshot => {
      const reviewsData = querySnapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
      }))

      const inProgress =
        reviewsData.filter((review: any) => review.status === "in-progress") ||
        []
      const done =
        reviewsData.filter((review: any) => review.status === "completed") || []
      const canceled =
        reviewsData.filter((review: any) => review.status === "failed") || []

      console.log("inProgress", inProgress)

      setInProgressData(inProgress as any[])
      setDoneData(done as any[])
      setCanceledData(canceled as any[])
    })

    return () => unsubscribe()
  }, [firestore, user])

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
          <a
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
          </a>
        </div>
        <div
          className={`geo-dashboard__body ${!viewAll && "d-none"} ${inProggressShow && "geo-dashboard__full-screen"}`}
        >
          <div className="geo-dashboard__body-wrapper">
            <div className="geo-dashboard__body-header">
              <div className="geo-dashboard__progress">
                <span className="geo-dashboard__progress-badge">
                  <i className="bi bi-grid"></i>
                  All
                </span>
                <span className="geo-dashboard__progress-count">211</span>
              </div>
              <div className="geo-dashboard__progress__btns">
                {!inProggressShow && (
                  <a
                    onClick={() => {
                      setInProggressTableShow(!inProggressTableShow)
                    }}
                    className="geo-dashboard__progress-icon"
                  >
                    <i
                      className={`bi bi-chevron-${inProggressTableShow ? "down" : "up"}`}
                    ></i>
                  </a>
                )}
                <a
                  onClick={() => {
                    setViewAll(false)
                    setInProggressShow(false)
                    setDoneShow(false)
                    setCanceledShow(false)
                  }}
                  className="geo-dashboard__progress-icon"
                >
                  <i className={"bi bi-x-lg"}></i>
                </a>
              </div>
            </div>
            <div className="geo-dashboard__body-content">
              <Table
                tableHeader={tableHeader}
                body={canceledData.map((review: any) => review)}
              />
            </div>
          </div>
          {viewAll && Pagination()}
        </div>
        <div
          className={`geo-dashboard__body ${(doneShow || canceledShow) && "d-none"} ${inProggressShow && "geo-dashboard__full-screen"}`}
        >
          <div className="geo-dashboard__body-wrapper">
            <div className="geo-dashboard__body-header">
              <div className="geo-dashboard__progress">
                <span className="geo-dashboard__progress-badge geo-dashboard__progress-badge--warning">
                  In Progress
                </span>
                <span className="geo-dashboard__progress-count">
                  {inProgressData.length}
                </span>
              </div>
              <div className="geo-dashboard__progress__btns">
                {!inProggressShow && (
                  <a
                    onClick={() => {
                      setInProggressTableShow(prewState => !prewState)
                    }}
                    className="geo-dashboard__progress-icon"
                  >
                    <i
                      className={`bi bi-chevron-${inProggressTableShow ? "down" : "up"}`}
                    ></i>
                  </a>
                )}
                <a
                  onClick={() => {
                    setInProggressShow(!inProggressShow)
                    setInProggressTableShow(false)
                  }}
                  className="geo-dashboard__progress-icon"
                >
                  <i
                    className={`bi bi-fullscreen${inProggressShow ? "-exit" : ""}`}
                  ></i>
                </a>
              </div>
            </div>
            <div className="geo-dashboard__body-content">
              <Table
                tableHeader={tableHeader}
                body={inProgressData
                  .map((review: any) => review)
                  .slice(0, 5)}
              />
            </div>
          </div>
          {inProggressShow && Pagination()}
        </div>
        <div
          className={`geo-dashboard__body ${(inProggressShow || canceledShow) && "d-none"} ${doneShow && "geo-dashboard__full-screen"}`}
        >
          <div className="geo-dashboard__body-wrapper">
            <div className="geo-dashboard__body-header">
              <div className="geo-dashboard__progress">
                <span className="geo-dashboard__progress-badge geo-dashboard__progress-badge--success">
                  Done
                </span>
                <span className="geo-dashboard__progress-count">
                  {doneData.length}
                </span>
              </div>
              <div className="geo-dashboard__progress__btns">
                {!doneShow && (
                  <a
                    onClick={() => {
                      setDoneTableShow(prevState => !prevState)
                    }}
                    className="geo-dashboard__progress-icon"
                  >
                    <i
                      className={`bi bi-chevron-${doneTableShow ? "down" : "up"}`}
                    ></i>
                  </a>
                )}
                <a
                  onClick={() => {
                    setDoneShow(!doneShow)
                    setDoneTableShow(false)
                  }}
                  className="geo-dashboard__progress-icon"
                >
                  <i
                    className={`bi bi-fullscreen${doneShow ? "-exit" : ""}`}
                  ></i>
                </a>
              </div>
            </div>
            <div className=" geo-dashboard__body-content">
              <Table
                tableHeader={tableHeader}
                body={doneData
                  .map((review: any) => review)
                  .slice(0, 5)}
              />
            </div>
          </div>
          {doneShow && Pagination()}
        </div>
        <div
          className={`geo-dashboard__body ${(inProggressShow || doneShow) && "d-none"} ${canceledShow && "geo-dashboard__full-screen"}`}
        >
          <div className="flex-grow-1 geo-dashboard__body-wrapper">
            <div className="geo-dashboard__body-header">
              <div className="geo-dashboard__progress">
                <span className="geo-dashboard__progress-badge geo-dashboard__progress-badge--danger">
                  Canceled
                </span>
                <span className="geo-dashboard__progress-count">
                  {canceledData.length}
                </span>
              </div>
              <div className="geo-dashboard__progress__btns">
                {!canceledShow && (
                  <a
                    onClick={() => {
                      setCanceledTableShow(prevState => !prevState)
                    }}
                    className="geo-dashboard__progress-icon"
                  >
                    <i
                      className={`bi bi-chevron-${canceledTableShow ? "down" : "up"}`}
                    ></i>
                  </a>
                )}
                <a
                  onClick={() => {
                    setCanceledShow(!canceledShow)
                    setCanceledTableShow(false)
                  }}
                  className="geo-dashboard__progress-icon"
                >
                  <i
                    className={`bi bi-fullscreen${canceledShow ? "-exit" : ""}`}
                  ></i>
                </a>
              </div>
            </div>
            <div className="geo-dashboard__body-content">
              <Table
                tableHeader={tableHeader}
                body={canceledData
                  .map((review: any) => review)
                  .slice(0, 5)}
              />
            </div>
          </div>
          {canceledShow && Pagination()}
        </div>
      </div>
    </div>
  )
}

export default DashboardTest

function Pagination() {
  return (
    <nav aria-label="scrap-pagination">
      <ul className="pagination">
        {/* Previous Button (Double Left) */}
        <li className={`pagination__item pagination__item--disabled`}>
          <a
            className="pagination__item__button pagination__link"
            onClick={() => {}}
          >
            <i className="bi-chevron-double-left pagination__icon"></i>
          </a>
        </li>

        {/* Previous Button */}
        <li className={`pagination__item pagination__item--disabled`}>
          <a
            className="pagination__item__button pagination__link"
            onClick={() => {}}
          >
            <i className="bi-chevron-left pagination__icon"></i>
          </a>
        </li>

        {/* Page Numbers */}
        {/* {Array.from({ length: 1 }, (_, pageIndex) => ( */}
        <li className={`pagination__item pagination__item--active`}>
          {/* key={pageIndex + 1} */}
          <a
            className="pagination__item__button pagination__link"
            onClick={() => {}}
          >
            {/* {pageIndex + 1} */}1
          </a>
        </li>
        {/* ))} */}

        {/* Next Button */}
        <li className={`pagination__item pagination__item--disabled"}`}>
          <a
            className="pagination__item__button pagination__link"
            // onClick={handleNextPage}
          >
            <i className="bi-chevron-right pagination__icon"></i>
          </a>
        </li>

        {/* Next Button (Double Right) */}
        <li className={`pagination__item pagination__item--disabled`}>
          <a
            className="pagination__item__button pagination__link"
            onClick={
              () => {}
              // () => handlePageClick(totalPages)
            }
          >
            <i className="bi-chevron-double-right pagination__icon"></i>
          </a>
        </li>
      </ul>
    </nav>
  )
}
