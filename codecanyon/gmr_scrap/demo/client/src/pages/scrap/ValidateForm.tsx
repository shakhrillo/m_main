import { IconWorldCheck } from "@tabler/icons-react";
import { addDoc, collection } from "firebase/firestore";
import { useState } from "react";
import { useFirebase } from "../../contexts/FirebaseProvider";

function ValidateForm() {
  const { user, firestore } = useFirebase();
  const [loading, setLoading] = useState(false);
  const [url, setUrl] = useState("");

  /**
   * Get place information from Google Maps URL
   *
   * @param {React.FormEvent} event
   * @returns {Promise<void>}
   */
  async function getPlaceInfo(event: React.FormEvent): Promise<void> {
    event.preventDefault();
    const uid = user?.uid;
    const collectionPath = `users/${uid}/reviewOverview`;
    setLoading(true);
    try {
      const collectionRef = collection(firestore, collectionPath);
      const document = await addDoc(collectionRef, {
        url,
      });
      console.log("Document written with ID: ", document.id);
    } catch (error) {
      console.error("Error adding document: ", error);
    } finally {
      setLoading(false);
      setUrl("");
    }
  }

  return (
    <form onSubmit={getPlaceInfo}>
      <div className="mb-3">
        <label className="form-label">Google Maps URL</label>
        <div className="input-group">
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
