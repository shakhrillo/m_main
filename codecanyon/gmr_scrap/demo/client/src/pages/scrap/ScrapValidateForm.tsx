// Modules
import { IconWorldCheck } from "@tabler/icons-react";
import { addDoc, collection } from "firebase/firestore";
import { JSX, useState } from "react";
import { useFirebase } from "../../contexts/FirebaseProvider";

/**
 * Form which sends a Google Maps URL to the server for validation
 * Server will scrape the URL and return the place information
 * If the URL is not valid or the place information is not found, an error will be returned
 * Maximum wait time for the server response is 90 seconds
 *
 * @returns {JSX.Element}
 */
function ScrapValidateForm(): JSX.Element {
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

export default ScrapValidateForm;
