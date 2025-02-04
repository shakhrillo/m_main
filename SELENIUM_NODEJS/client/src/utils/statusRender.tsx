import loaderIcon from "../assets/icons/loader-2.svg"
import circleCheckIcon from "../assets/icons/circle-check.svg"
import xIcon from "../assets/icons/x.svg"

export const statusRender = (
  status: string,
  { width = 24, height = 24 }: { width?: number; height?: number } = {},
) => {
  switch (status) {
    case "completed":
      return (
        <>
          <img
            src={circleCheckIcon}
            alt="Completed"
            width={width}
            height={height}
          />
        </>
      )
    case "failed":
      return (
        <>
          <img src={xIcon} alt="Failed" width={width} height={height} />
        </>
      )
    default:
      return (
        <>
          <img
            src={loaderIcon}
            alt="In progress"
            width={width}
            height={height}
          />
        </>
      )
  }
}
