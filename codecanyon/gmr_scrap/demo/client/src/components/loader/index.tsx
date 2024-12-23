import loadIcon from "../../assets/icons/loader-2.svg"

function Loader({ size = "md", version = 1, cover = "" }) {
  return (
    <div
      className={`loader loader--${size}`}
      style={
        cover === "full"
          ? {
              width: "100%",
              height: "calc(100vh - 48px)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }
          : {}
      }
    >
      {version === 1 ? (
        <div className="spinner-border text-primary" role="status"></div>
      ) : (
        <div className="spinner-grow text-primary" role="status"></div>
      )}
      {/* <img src={loadIcon} alt="loading" /> */}
    </div>
  )
}

export default Loader
