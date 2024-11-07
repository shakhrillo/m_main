const DashboardTest: React.FC = () => {
  return (
    <div className="geo-dashboard">
      <div className="geo-dashboard__wrapper">
        <div className="geo-dashboard__header">
          <form className="geo-dashboard__form">
            <div className="geo-dashboard__row row">
              <div className="geo-dashboard__column col">
                <div className="geo-dashboard__form-group form-group">
                  <label className="geo-dashboard__input-label" htmlFor="url">
                    Sharable URL
                  </label>
                  <input
                    placeholder="Place URL"
                    type="text"
                    className="geo-dashboard__input geo-input form-control"
                    id="url"
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
                    placeholder="Extract limit"
                    type="text"
                    className="geo-dashboard__input geo-input form-control "
                    id="extractLimit"
                    aria-describedby="extractLimit"
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
                  <input
                    placeholder="Sort by"
                    type="text"
                    className="geo-dashboard__input geo-input form-control"
                    id="sortBy"
                    aria-describedby="sortByHelp"
                  />
                </div>
              </div>
            </div>
            <div className="geo-dashboard__filter">
              <div className="geo-dashboard__form-group form-group">
                <div className="geo-dashboard__checkbox-group form-group">
                  <div className="geo-dashboard__checkbox-item">
                    <input
                      type="checkbox"
                      className="geo-dashboard__checkbox-input btn-check"
                      id="extract-image"
                    />
                    <label
                      className="geo-dashboard__checkbox-label btn geo-btn-transparent"
                      htmlFor="extract-image"
                    >
                      <i className="bi bi-image"></i>
                      Extract image URLs
                    </label>
                  </div>
                  <div className="geo-dashboard__checkbox-item">
                    <input
                      type="checkbox"
                      className="geo-dashboard__checkbox-input btn-check"
                      id="owner-response"
                    />
                    <label
                      className="geo-dashboard__checkbox-label btn geo-btn-transparent"
                      htmlFor="owner-response"
                    >
                      <i className="bi bi-megaphone"></i>
                      Owner response
                    </label>
                  </div>
                  <div className="geo-dashboard__checkbox-item">
                    <input
                      type="checkbox"
                      className="geo-dashboard__checkbox-input btn-check"
                      id="google-reviews"
                    />
                    <label
                      className="geo-dashboard__checkbox-label btn geo-btn-transparent"
                      htmlFor="google-reviews"
                    >
                      <i className="bi bi-google"></i>
                      Only Google reviews
                    </label>
                  </div>
                </div>
              </div>
              <button className="geo-dashboard__start-btn geo-btn-primary btn btn-primary">
                <i className="bi bi-play-fill"></i>
                Start
              </button>
            </div>
          </form>
        </div>
        <div className="geo-dashboard__body">
          <div className="geo-dashboard__body-wrapper">
            <div className="geo-dashboard__body-header">
              <div className="geo-dashboard__progress">
                <span className="geo-dashboard__progress-badge geo-dashboard__progress-badge--warning">
                  In Progress
                </span>
                <span className="geo-dashboard__progress-count">4</span>
              </div>
              <span className="geo-dashboard__progress-icon">
                <i className="bi bi-chevron-down"></i>
              </span>
            </div>
            <div className="geo-dashboard__body-content">
              <table className="geo-dashboard__body-content__table table table-bordered">
                <thead>
                  <tr>
                    <th className="geo-dashboard__body-content__table-header">
                      #
                    </th>
                    <th className="geo-dashboard__body-content__table-header">
                      <div className="geo-dashboard__body-content__table-header__content">
                        <i className="bi bi-geo"></i>
                        Place
                      </div>
                    </th>
                    <th className="geo-dashboard__body-content__table-header">
                      <div className="geo-dashboard__body-content__table-header__content">
                        <i className="bi bi-clock"></i>
                        Date
                      </div>
                    </th>
                    <th className="geo-dashboard__body-content__table-header">
                      <div className="geo-dashboard__body-content__table-header__content">
                        <i className="bi bi-chat-square-text"></i>
                        Reviews
                      </div>
                    </th>
                    <th className="geo-dashboard__body-content__table-header">
                      <div className="geo-dashboard__body-content__table-header__content">
                        <i className="bi bi-hourglass-split"></i>
                        Time
                      </div>
                    </th>
                    <th className="geo-dashboard__body-content__table-header">
                      <div className="geo-dashboard__body-content__table-header__content">
                        <i className="bi bi-file-earmark-zip"></i>
                        File format
                      </div>
                    </th>
                    <th className="geo-dashboard__body-content__table-header">
                      <div className="geo-dashboard__body-content__table-header__content"></div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="geo-dashboard__body-content__table__row">
                    <th className="geo-dashboard__body-content__table__row-body">
                      1
                    </th>
                    <td className="geo-dashboard__body-content__table__row-body">
                      <div className="geo-dashboard__body-content__table__row-body__content">
                        <a href="#">Selectum colours Bodrum</a>
                      </div>
                    </td>
                    <td className="geo-dashboard__body-content__table__row-body">
                      <div className="geo-dashboard__body-content__table__row-body__content">
                        6 November 2024 - 03:01:51 PM
                      </div>
                    </td>
                    <td className="geo-dashboard__body-content__table__row-body">
                      <div className="geo-dashboard__body-content__table__row-body__content">
                        1438 - reviews
                      </div>
                    </td>
                    <td className="geo-dashboard__body-content__table__row-body">
                      <div className="geo-dashboard__body-content__table__row-body__content">
                        46 seconds
                      </div>
                    </td>
                    <td className="geo-dashboard__body-content__table__row-body">
                      <div className="geo-dashboard__body-content__table__row-body__content">
                        <select className="geo-select">
                          <option selected value="1">
                            JSON
                          </option>
                          <option value="1">SCV</option>
                        </select>
                        {/* <button className="btn geo-btn-white">
                          <i className="bi bi-cloud-download"></i>
                        </button> */}
                      </div>
                    </td>
                    <td className="geo-dashboard__body-content__table__row-body">
                      <a href="#">
                        <i className="bi bi-cloud-download"></i>
                        {/* <button className="btn geo-btn-white">
                          <i className="bi bi-cloud-download"></i>
                        </button> */}
                      </a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="geo-dashboard__body">
          <div className="geo-dashboard__body-wrapper">
            <div className="geo-dashboard__body-header">
              <div className="geo-dashboard__progress">
                <span className="geo-dashboard__progress-badge geo-dashboard__progress-badge--success">
                  Done
                </span>
                <span className="geo-dashboard__progress-count">4</span>
              </div>
              <span className="geo-dashboard__progress-icon">
                <i className="bi bi-chevron-down"></i>
              </span>
            </div>
            <div className="geo-dashboard__body-content">
              <table className="geo-dashboard__body-content__table table table-bordered">
                <thead>
                  <tr>
                    <th className="geo-dashboard__body-content__table-header">
                      #
                    </th>
                    <th className="geo-dashboard__body-content__table-header">
                      <div className="geo-dashboard__body-content__table-header__content">
                        <i className="bi bi-geo"></i>
                        Place
                      </div>
                    </th>
                    <th className="geo-dashboard__body-content__table-header">
                      <div className="geo-dashboard__body-content__table-header__content">
                        <i className="bi bi-clock"></i>
                        Date
                      </div>
                    </th>
                    <th className="geo-dashboard__body-content__table-header">
                      <div className="geo-dashboard__body-content__table-header__content">
                        <i className="bi bi-chat-square-text"></i>
                        Reviews
                      </div>
                    </th>
                    <th className="geo-dashboard__body-content__table-header">
                      <div className="geo-dashboard__body-content__table-header__content">
                        <i className="bi bi-hourglass-split"></i>
                        Time
                      </div>
                    </th>
                    <th className="geo-dashboard__body-content__table-header">
                      <div className="geo-dashboard__body-content__table-header__content">
                        <i className="bi bi-file-earmark-zip"></i>
                        File format
                      </div>
                    </th>
                    <th className="geo-dashboard__body-content__table-header">
                      <div className="geo-dashboard__body-content__table-header__content"></div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="geo-dashboard__body-content__table__row">
                    <th className="geo-dashboard__body-content__table__row-body">
                      1
                    </th>
                    <td className="geo-dashboard__body-content__table__row-body">
                      <div className="geo-dashboard__body-content__table__row-body__content">
                        <a href="#">Selectum colours Bodrum</a>
                      </div>
                    </td>
                    <td className="geo-dashboard__body-content__table__row-body">
                      <div className="geo-dashboard__body-content__table__row-body__content">
                        6 November 2024 - 03:01:51 PM
                      </div>
                    </td>
                    <td className="geo-dashboard__body-content__table__row-body">
                      <div className="geo-dashboard__body-content__table__row-body__content">
                        1438 - reviews
                      </div>
                    </td>
                    <td className="geo-dashboard__body-content__table__row-body">
                      <div className="geo-dashboard__body-content__table__row-body__content">
                        46 seconds
                      </div>
                    </td>
                    <td className="geo-dashboard__body-content__table__row-body">
                      <div className="geo-dashboard__body-content__table__row-body__content">
                        <select className="geo-select">
                          <option selected value="1">
                            JSON
                          </option>
                          <option value="1">SCV</option>
                        </select>
                        {/* <button className="btn geo-btn-white">
                          <i className="bi bi-cloud-download"></i>
                        </button> */}
                      </div>
                    </td>
                    <td className="geo-dashboard__body-content__table__row-body">
                      <a href="#">
                        <i className="bi bi-cloud-download"></i>
                        {/* <button className="btn geo-btn-white">
                          <i className="bi bi-cloud-download"></i>
                        </button> */}
                      </a>
                    </td>
                  </tr>
                  <tr className="geo-dashboard__body-content__table__row">
                    <th className="geo-dashboard__body-content__table__row-body">
                      1
                    </th>
                    <td className="geo-dashboard__body-content__table__row-body">
                      <div className="geo-dashboard__body-content__table__row-body__content">
                        <a href="#">Selectum colours Bodrum</a>
                      </div>
                    </td>
                    <td className="geo-dashboard__body-content__table__row-body">
                      <div className="geo-dashboard__body-content__table__row-body__content">
                        6 November 2024 - 03:01:51 PM
                      </div>
                    </td>
                    <td className="geo-dashboard__body-content__table__row-body">
                      <div className="geo-dashboard__body-content__table__row-body__content">
                        1438 - reviews
                      </div>
                    </td>
                    <td className="geo-dashboard__body-content__table__row-body">
                      <div className="geo-dashboard__body-content__table__row-body__content">
                        46 seconds
                      </div>
                    </td>
                    <td className="geo-dashboard__body-content__table__row-body">
                      <div className="geo-dashboard__body-content__table__row-body__content">
                        <select className="geo-select">
                          <option selected value="1">
                            JSON
                          </option>
                          <option value="1">SCV</option>
                        </select>
                        {/* <button className="btn geo-btn-white">
                          <i className="bi bi-cloud-download"></i>
                        </button> */}
                      </div>
                    </td>
                    <td className="geo-dashboard__body-content__table__row-body">
                      <a href="#">
                        <i className="bi bi-cloud-download"></i>
                        {/* <button className="btn geo-btn-white">
                          <i className="bi bi-cloud-download"></i>
                        </button> */}
                      </a>
                    </td>
                  </tr>
                  <tr className="geo-dashboard__body-content__table__row">
                    <th className="geo-dashboard__body-content__table__row-body">
                      1
                    </th>
                    <td className="geo-dashboard__body-content__table__row-body">
                      <div className="geo-dashboard__body-content__table__row-body__content">
                        <a href="#">Selectum colours Bodrum</a>
                      </div>
                    </td>
                    <td className="geo-dashboard__body-content__table__row-body">
                      <div className="geo-dashboard__body-content__table__row-body__content">
                        6 November 2024 - 03:01:51 PM
                      </div>
                    </td>
                    <td className="geo-dashboard__body-content__table__row-body">
                      <div className="geo-dashboard__body-content__table__row-body__content">
                        1438 - reviews
                      </div>
                    </td>
                    <td className="geo-dashboard__body-content__table__row-body">
                      <div className="geo-dashboard__body-content__table__row-body__content">
                        46 seconds
                      </div>
                    </td>
                    <td className="geo-dashboard__body-content__table__row-body">
                      <div className="geo-dashboard__body-content__table__row-body__content">
                        <select className="geo-select">
                          <option selected value="1">
                            JSON
                          </option>
                          <option value="1">SCV</option>
                        </select>
                        {/* <button className="btn geo-btn-white">
                          <i className="bi bi-cloud-download"></i>
                        </button> */}
                      </div>
                    </td>
                    <td className="geo-dashboard__body-content__table__row-body">
                      <a href="#">
                        <i className="bi bi-cloud-download"></i>
                        {/* <button className="btn geo-btn-white">
                          <i className="bi bi-cloud-download"></i>
                        </button> */}
                      </a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="geo-dashboard__body">
          <div className="geo-dashboard__body-wrapper">
            <div className="geo-dashboard__body-header">
              <div className="geo-dashboard__progress">
                <span className="geo-dashboard__progress-badge geo-dashboard__progress-badge--danger">
                  Canceled
                </span>
                <span className="geo-dashboard__progress-count">4</span>
              </div>
              <span className="geo-dashboard__progress-icon">
                <i className="bi bi-chevron-down"></i>
              </span>
            </div>
            <div className="geo-dashboard__body-content">
              <table className="geo-dashboard__body-content__table table table-bordered">
                <thead>
                  <tr>
                    <th className="geo-dashboard__body-content__table-header">
                      #
                    </th>
                    <th className="geo-dashboard__body-content__table-header">
                      <div className="geo-dashboard__body-content__table-header__content">
                        <i className="bi bi-geo"></i>
                        Place
                      </div>
                    </th>
                    <th className="geo-dashboard__body-content__table-header">
                      <div className="geo-dashboard__body-content__table-header__content">
                        <i className="bi bi-clock"></i>
                        Date
                      </div>
                    </th>
                    <th className="geo-dashboard__body-content__table-header">
                      <div className="geo-dashboard__body-content__table-header__content">
                        <i className="bi bi-chat-square-text"></i>
                        Reviews
                      </div>
                    </th>
                    <th className="geo-dashboard__body-content__table-header">
                      <div className="geo-dashboard__body-content__table-header__content">
                        <i className="bi bi-hourglass-split"></i>
                        Time
                      </div>
                    </th>
                    <th className="geo-dashboard__body-content__table-header">
                      <div className="geo-dashboard__body-content__table-header__content">
                        <i className="bi bi-file-earmark-zip"></i>
                        File format
                      </div>
                    </th>
                    <th className="geo-dashboard__body-content__table-header">
                      <div className="geo-dashboard__body-content__table-header__content"></div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="geo-dashboard__body-content__table__row">
                    <th className="geo-dashboard__body-content__table__row-body">
                      1
                    </th>
                    <td className="geo-dashboard__body-content__table__row-body">
                      <div className="geo-dashboard__body-content__table__row-body__content">
                        <a href="#">Selectum colours Bodrum</a>
                      </div>
                    </td>
                    <td className="geo-dashboard__body-content__table__row-body">
                      <div className="geo-dashboard__body-content__table__row-body__content">
                        6 November 2024 - 03:01:51 PM
                      </div>
                    </td>
                    <td className="geo-dashboard__body-content__table__row-body">
                      <div className="geo-dashboard__body-content__table__row-body__content">
                        1438 - reviews
                      </div>
                    </td>
                    <td className="geo-dashboard__body-content__table__row-body">
                      <div className="geo-dashboard__body-content__table__row-body__content">
                        46 seconds
                      </div>
                    </td>
                    <td className="geo-dashboard__body-content__table__row-body">
                      <div className="geo-dashboard__body-content__table__row-body__content">
                        <select className="geo-select">
                          <option selected value="1">
                            JSON
                          </option>
                          <option value="1">SCV</option>
                        </select>
                        {/* <button className="btn geo-btn-white">
                          <i className="bi bi-cloud-download"></i>
                        </button> */}
                      </div>
                    </td>
                    <td className="geo-dashboard__body-content__table__row-body">
                      <a href="#">
                        <i className="bi bi-cloud-download"></i>
                        {/* <button className="btn geo-btn-white">
                          <i className="bi bi-cloud-download"></i>
                        </button> */}
                      </a>
                    </td>
                  </tr>
                  <tr className="geo-dashboard__body-content__table__row">
                    <th className="geo-dashboard__body-content__table__row-body">
                      1
                    </th>
                    <td className="geo-dashboard__body-content__table__row-body">
                      <div className="geo-dashboard__body-content__table__row-body__content">
                        <a href="#">Selectum colours Bodrum</a>
                      </div>
                    </td>
                    <td className="geo-dashboard__body-content__table__row-body">
                      <div className="geo-dashboard__body-content__table__row-body__content">
                        6 November 2024 - 03:01:51 PM
                      </div>
                    </td>
                    <td className="geo-dashboard__body-content__table__row-body">
                      <div className="geo-dashboard__body-content__table__row-body__content">
                        1438 - reviews
                      </div>
                    </td>
                    <td className="geo-dashboard__body-content__table__row-body">
                      <div className="geo-dashboard__body-content__table__row-body__content">
                        46 seconds
                      </div>
                    </td>
                    <td className="geo-dashboard__body-content__table__row-body">
                      <div className="geo-dashboard__body-content__table__row-body__content">
                        <select className="geo-select">
                          <option selected value="1">
                            JSON
                          </option>
                          <option value="1">SCV</option>
                        </select>
                        {/* <button className="btn geo-btn-white">
                          <i className="bi bi-cloud-download"></i>
                        </button> */}
                      </div>
                    </td>
                    <td className="geo-dashboard__body-content__table__row-body">
                      <a href="#">
                        <i className="bi bi-cloud-download"></i>
                        {/* <button className="btn geo-btn-white">
                          <i className="bi bi-cloud-download"></i>
                        </button> */}
                      </a>
                    </td>
                  </tr>
                  <tr className="geo-dashboard__body-content__table__row">
                    <th className="geo-dashboard__body-content__table__row-body">
                      1
                    </th>
                    <td className="geo-dashboard__body-content__table__row-body">
                      <div className="geo-dashboard__body-content__table__row-body__content">
                        <a href="#">Selectum colours Bodrum</a>
                      </div>
                    </td>
                    <td className="geo-dashboard__body-content__table__row-body">
                      <div className="geo-dashboard__body-content__table__row-body__content">
                        6 November 2024 - 03:01:51 PM
                      </div>
                    </td>
                    <td className="geo-dashboard__body-content__table__row-body">
                      <div className="geo-dashboard__body-content__table__row-body__content">
                        1438 - reviews
                      </div>
                    </td>
                    <td className="geo-dashboard__body-content__table__row-body">
                      <div className="geo-dashboard__body-content__table__row-body__content">
                        46 seconds
                      </div>
                    </td>
                    <td className="geo-dashboard__body-content__table__row-body">
                      <div className="geo-dashboard__body-content__table__row-body__content">
                        <select className="geo-select">
                          <option selected value="1">
                            JSON
                          </option>
                          <option value="1">SCV</option>
                        </select>
                        {/* <button className="btn geo-btn-white">
                          <i className="bi bi-cloud-download"></i>
                        </button> */}
                      </div>
                    </td>
                    <td className="geo-dashboard__body-content__table__row-body">
                      <a href="#">
                        <i className="bi bi-cloud-download"></i>
                        {/* <button className="btn geo-btn-white">
                          <i className="bi bi-cloud-download"></i>
                        </button> */}
                      </a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardTest
