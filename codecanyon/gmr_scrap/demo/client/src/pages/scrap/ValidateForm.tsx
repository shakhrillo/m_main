import { IconPlayerPlay, IconWorldCheck } from "@tabler/icons-react";
import { addDoc, collection } from "firebase/firestore";
import { useState } from "react";
import { useFirebase } from "../../contexts/FirebaseProvider";

function ValidateForm() {
  const { user, firestore } = useFirebase();
  const [loading, setLoading] = useState(false);
  const [url, setUrl] = useState("");

  function getPlaceInfo(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);
    addDoc(collection(firestore, `users/${user?.uid}/reviewOverview`), {
      url,
    })
      .then((docRef) => {
        console.log("Document written with ID: ", docRef.id);
      })
      .catch((error) => console.error("Error adding document:", error));
  }
  return (
    <form onSubmit={getPlaceInfo} className="mb-3">
      <div className="mb-3">
        <label className="form-label">Google Maps URL</label>
        <div className="input-group mb-3">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://maps.app.goo.gl/..."
            disabled={loading}
            className="form-control"
          />
          <span className="input-group-text">
            <IconWorldCheck size={20} />
          </span>
        </div>
      </div>
      <button type="submit" className="btn btn-primary" disabled={loading}>
        Validate
        <span className="badge bg-secondary ms-2">3 points</span>
      </button>
    </form>
  );
}

export default ValidateForm;
