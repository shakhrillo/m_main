import loadIcon from "../../assets/icons/loader-2.svg"

function Loader({ size = "md" }) {
  return (
    <div className={`loader loader--${size}`}>
      <img src={loadIcon} alt="loading" />
    </div>
  )
}

export default Loader
