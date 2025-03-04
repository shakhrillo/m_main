import file from "../img/downloadFile.svg";
import clip from "../img/clip.svg";
import headset from "../img/headset.svg";
import thumpUp from "../img/thumpUp.svg";
import thumpDown from "../img/thumpDown.svg";

function RightSection() {
  return (
    <div class="col-2">
      <div class="documentation__navigation d-flex flex-column gap-3">
        <div className="documentation__navigation-item d-flex gap-1">
          <img src={file} alt="file" />
          <h6 class="documentation__navigation-title m-0">Download pdf</h6>
        </div>
        <div className="documentation__navigation-item d-flex gap-1">
          <img src={clip} alt="clip" />
          <h6 class="documentation__navigation-title m-0">Copy link</h6>
        </div>
        <hr />
        <h5>On this page</h5>
        <div className="documentation__navigation-item d-flex gap-1">
          <h6 class="documentation__navigation-title m-0">Overview</h6>
        </div>
        <div className="documentation__navigation-item d-flex gap-1">
          <h6 class="documentation__navigation-title m-0">
            Dashboard and enabling shipment
          </h6>
        </div>
        <div className="documentation__navigation-item d-flex gap-1">
          <h6 class="documentation__navigation-title m-0">
            Shipment tracking Dashboard
          </h6>
        </div>
        <hr />
        <h5>Do you need help?</h5>
        <div className="documentation__navigation-item d-flex gap-1">
          <img src={headset} alt="headset" />
          <h6 class="documentation__navigation-title m-0">Chatbot</h6>
        </div>
        <hr />
        <h5>Is this page helpfull?</h5>
        <div className="documentation__navigation-item d-flex justify-content-between">
          <div className="d-flex gap-2 align-items-center">
            <img src={thumpUp} alt="thumpUp" />
            <h6 class="documentation__navigation-title m-0">Yes</h6>
          </div>
          <div className="d-flex gap-2 align-items-center">
            <img src={thumpDown} alt="thumpDown" />
            <h6 class="documentation__navigation-title m-0">No</h6>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RightSection;
