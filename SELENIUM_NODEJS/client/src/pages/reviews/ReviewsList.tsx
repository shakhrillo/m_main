import React, { useEffect, useState } from "react"
import { useFirebase } from "../../contexts/FirebaseProvider"
import { onSnapshot, Timestamp } from "firebase/firestore"
import { getReviewsQuery } from "../../services/firebaseService"

function renderCount(review: any) {
  if (!review || !review.extractedReviews)
    return <i className="bi-question-lg"></i>
  let count = review.extractedReviews || 0
  if (count < (review.totalReviews || 0)) {
    count = review.totalReviews
  }

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

  // inputs
  const [formData, setFormData] = useState({
    scrapURl: "",
    extractLimit: "",
    sortBy: "",
  })

  const [filters, setFilters] = useState({
    extraImage: false,
    ownerResponse: true,
    onlyGoogleReviews: false,
  })

  const [inProggressTableShow, setInProggressTableShow] = useState(false)
  const [doneTableShow, setDoneTableShow] = useState(false)
  const [canceledTableShow, setCanceledTableShow] = useState(false)

  const [inProggressShow, setInProggressShow] = useState(false)
  const [doneShow, setDoneShow] = useState(false)
  const [canceledShow, setCanceledShow] = useState(false)

  const [viewAll, setViewAll] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const headerInputs = [
    {
      label: "Sharable URL",
      placeholder: "Place URL",
      value: formData.scrapURl,
      onChange: handleInputChange,
      name: "scrapURl",
    },
    {
      label: "Extract limit",
      placeholder: "Extract limit",
      value: formData.extractLimit,
      onChange: handleInputChange,
      name: "extractLimit",
    },
    {
      label: "Sort by",
      placeholder: "Sort by",
      value: formData.sortBy,
      onChange: handleInputChange,
      name: "sortBy",
    },
  ]

  type FilterKey = keyof typeof filters

  const handleFilterChange = (name: FilterKey) => {
    setFilters(prev => ({ ...prev, [name]: !prev[name] }))
  }
  const headerFilters = [
    {
      icon: "bi-image",
      label: "Extract image urls",
      name: "extraImage" as FilterKey,
    },
    {
      icon: "bi-megaphone",
      label: "Owner response",
      name: "ownerResponse" as FilterKey,
    },
    {
      icon: "bi-google",
      label: "Only Google reviews",
      name: "onlyGoogleReviews" as FilterKey,
    },
  ]

  const tableHeader = [
    { text: "#" },
    { text: "Place", icon: "geo" },
    { text: "Date", icon: "clock" },
    { text: "Reviews", icon: "chat-square-text" },
    { text: "Time", icon: "hourglass-split" },
    { text: "File format", icon: "file-earmark-zip" },
    { text: "", icon: "" },
  ]

  const [inProgressData, setInProgressData] = useState<TableBody[]>([])
  const [doneData, setDoneData] = useState<TableBody[]>([])
  const [canceledData, setCanceledData] = useState<TableBody[]>([])

  useEffect(() => {
    if (!firestore || !user) return;
  
    const unsubscribe = onSnapshot(getReviewsQuery(user.uid), querySnapshot => {
      const reviewsData = querySnapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
      }));
      
      const inProgress = reviewsData.filter((review: any) => review.status === "in-progress") || [];
      const done = reviewsData.filter((review: any) => review.status === "completed") || [];
      const canceled = reviewsData.filter((review: any) => review.status === "failed") || [];

      console.log("inProgress", inProgress)

      setInProgressData(inProgress as any[]);
      setDoneData(done as any[]);
      setCanceledData(canceled as any[]);
    });
  
    return () => unsubscribe();
  }, [firestore, user]);

  return (
    <div className="geo-dashboard">
      <div className="geo-dashboard__wrapper">
        <div className="geo-dashboard__header">
          <form className="geo-dashboard__form">
            <div className="geo-dashboard__row row">
              {headerInputs.map((input, index) => (
                <div key={index} className="geo-dashboard__column col">
                  <div className="geo-dashboard__form-group form-group">
                    <label
                      className="geo-dashboard__input-label"
                      htmlFor={input.name}
                    >
                      {input.label}
                    </label>
                    <input
                      name={input.name}
                      value={input.value}
                      onChange={input.onChange}
                      placeholder={input.placeholder}
                      type="text"
                      className="geo-dashboard__input geo-input form-control"
                      id={input.name}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="geo-dashboard__filter">
              <div className="geo-dashboard__form-group form-group">
                <div className="geo-dashboard__checkbox-group form-group">
                  {headerFilters.map((filter, index) => (
                    <div key={index} className="geo-dashboard__checkbox-item">
                      <input
                        checked={filters[filter.name]}
                        onChange={() => handleFilterChange(filter.name)}
                        type="checkbox"
                        className="geo-dashboard__checkbox-input btn-check"
                        id={filter.icon}
                      />
                      <label
                        className="geo-dashboard__checkbox-label btn geo-btn-transparent"
                        htmlFor={filter.icon}
                      >
                        <i className={`bi ${filter.icon}`}></i>
                        {filter.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              <button className="geo-dashboard__start-btn geo-btn-primary btn btn-primary">
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
                showTable={canceledTableShow}
                tableHeader={tableHeader}
                body={canceledData.map((review: any) => (review as TableBody))}
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
                showTable={inProggressTableShow}
                tableHeader={tableHeader}
                body={
                  inProgressData.map((review: any) => (review as TableBody)).slice(0, 10)
                }
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
                showTable={doneTableShow}
                tableHeader={tableHeader}
                body={doneData.map((review: any) => (review as TableBody)).slice(0, 10)}
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
                showTable={canceledTableShow}
                tableHeader={tableHeader}
                body={
                  canceledData.map((review: any) => (review as TableBody)).slice(0, 10)
                }
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

interface TableHeader {
  icon?: string
  text: string
}
interface TableBody {
  title: string
  completedAt: Timestamp
  createdAt: Timestamp
  error: string
  extractImageUrls: boolean
  id: string
  limit: number
  onlyGoogleReviews: boolean
  ownerResponse: boolean
  sortBy: string
  status: string
  url: string
}

interface TableInterface {
  showTable: boolean
  tableHeader: TableHeader[]
  body: TableBody[]
}

const Table: React.FC<TableInterface> = ({ showTable, tableHeader, body }) => {
  console.log("showTable", showTable)
  return (
    <table
      className={`${showTable && "d-none"} geo-dashboard__body-content__table table table-bordered`}
    >
      <thead>
        <tr>
          {tableHeader.map((header, index) => (
            <th
              key={header.text} // Use a unique key here if possible
              className="geo-dashboard__body-content__table-header"
            >
              {header.icon ? (
                <div className="geo-dashboard__body-content__table-header__content">
                  <i className={`bi bi-${header.icon}`}></i>
                  {header.text}
                </div>
              ) : (
                header.text
              )}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {body.map((row, index) => (
          <tr key={index} className="geo-dashboard__body-content__table__row">
            <th className="geo-dashboard__body-content__table__row-body">
              {index + 1}
            </th>
            <td className="geo-dashboard__body-content__table__row-body">
              <div className="geo-dashboard__body-content__table__row-body__content">
                <a href="#">
                  {row.title || row.url}
                </a>
              </div>
            </td>
            <td className="geo-dashboard__body-content__table__row-body">
              <div className="geo-dashboard__body-content__table__row-body__content">
                {formatTime(row.createdAt)}
              </div>
            </td>
            <td className="geo-dashboard__body-content__table__row-body">
              <div className="geo-dashboard__body-content__table__row-body__content">
                {renderCount(row)}
              </div>
            </td>
            <td className="geo-dashboard__body-content__table__row-body">
              <div className="geo-dashboard__body-content__table__row-body__content">
                {spentTime(row.createdAt, row.completedAt)}
              </div>
            </td>
            <td className="geo-dashboard__body-content__table__row-body">
              <div className="geo-dashboard__body-content__table__row-body__content">
                <select className="geo-select">
                  <option value="1" selected>
                    JSON
                  </option>
                  <option value="2">CSV</option>
                </select>
              </div>
            </td>
            <td className="geo-dashboard__body-content__table__row-body">
              <a href="#">
                <i className="bi bi-cloud-download"></i>
              </a>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

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
