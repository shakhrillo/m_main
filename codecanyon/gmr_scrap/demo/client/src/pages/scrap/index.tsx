import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useFirebase } from "../../contexts/FirebaseProvider";
import {
  startExtractGmapReviews,
  startExtractGmapReviewsOverview,
} from "../../services/firebaseService";
import { addDoc, collection, doc, onSnapshot } from "firebase/firestore";
import validateUrl from "../../utils/validateUrl";

import {
  IconWorldCheck,
  IconPhoto,
  IconStarFilled,
  IconCoins,
  IconVideo,
  IconMessageReply,
  IconPlayerPlay,
  IconCaretRight,
  IconInfoCircle,
} from "@tabler/icons-react";
import ScrapValidateForm from "./ScrapValidateForm";
import ScrapHelper from "./ScrapHelper";
import ScrapPlaceInfo from "./ScrapPlaceInfo";

const Scrap = () => {
  const { user, firestore } = useFirebase();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [overviewId, setOverviewId] = useState("");

  const [info, setInfo] = useState({} as any);
  const [scrap, setScrap] = useState({
    url: "",
    limit: 30,
    sortBy: "Most relevant",
    extractVideoUrls: false,
    extractImageUrls: false,
    ownerResponse: true,
  });
  const [selectedTariff, setSelectedTariff] = useState("default");

  const handleTariffChange = (event: any) => {
    setSelectedTariff(event.target.value);
  };

  // Handlers for input changes
  const handleInputChange = useCallback(
    (name: string, value: string | number) =>
      setScrap((prev) => ({ ...prev, [name]: value })),
    [],
  );

  const handleCheckboxChange = (name: string) =>
    setScrap((prev: any) => ({ ...prev, [name]: !prev[name] }));

  // Function to start scraping reviews
  const handleStartScraping = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await startExtractGmapReviews(user!.uid, overviewId, {
        ...info,
        ...scrap,
      });
      navigate(`/reviews/${overviewId}`);
    } catch (error) {
      console.error(error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!firestore || !user || !overviewId) return;

    const unsubscribe = onSnapshot(
      doc(firestore, `users/${user.uid}/reviewOverview/${overviewId}`),
      (doc) => {
        if (doc.exists()) {
          const result = doc.data() as any;
          console.log(">", result);
          setInfo(result);
          if (result && result.rating) {
            setLoading(false);
          }
        }
      },
    );

    return unsubscribe;
  }, [firestore, user, overviewId]);

  useEffect(() => {
    if (!validateUrl(scrap.url) || !user) return;
    // setLoading(true)
    // addDoc(collection(firestore, `users/${user.uid}/reviewOverview`), {
    //   url: scrap.url,
    // })
    //   .then(docRef => setOverviewId(docRef.id))
    //   .catch(error => console.error("Error adding document:", error))
  }, [user, scrap.url]);

  function getPlaceInfo(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);
    addDoc(collection(firestore, `users/${user?.uid}/reviewOverview`), {
      url: scrap.url,
    })
      .then((docRef) => setOverviewId(docRef.id))
      .catch((error) => console.error("Error adding document:", error));
  }

  function calculatePoints() {
    let points = scrap.limit || 0;

    if (scrap.extractImageUrls) {
      points += scrap.limit * 2;
    }

    if (scrap.extractVideoUrls) {
      points += scrap.limit * 3;
    }

    if (scrap.ownerResponse) {
      points += scrap.limit;
    }

    return points;
  }

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-4">
          <div className="card mb-3">
            <div className="card-body">
              <div className="d-flex flex-column gap-3">
                <ScrapValidateForm setDocumentId={setOverviewId} />
                <ScrapHelper />
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-8">
          <div className="row row-cols-1 g-3">
            <div className="col">
              <ScrapPlaceInfo info={info} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Scrap;
