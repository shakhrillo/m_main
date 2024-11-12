import loaderIcon from "../assets/icons/loader-2.svg"
import circleCheckIcon from "../assets/icons/circle-check.svg"
import xIcon from "../assets/icons/x.svg"

export const statusRender = (status: string, isLabel = true) => {
  switch (status) {
    case "completed":
      return (
        <>
          <img src={circleCheckIcon} alt="Completed" className="completed" />
          {isLabel && <p>Completed</p>}
        </>
      )
    case "failed":
      return (
        <>
          <img src={xIcon} alt="Failed" className="failed" />
          {isLabel && <p>Failed</p>}
        </>
      )
    default:
      return (
        <>
          <img src={loaderIcon} alt="In progress" className="loader" />
          {isLabel && <p>In progress</p>}
        </>
      )
  }
}
