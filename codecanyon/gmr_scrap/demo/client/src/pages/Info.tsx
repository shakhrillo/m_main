import { useEffect, useState } from "react"
import { useFirebase } from "../contexts/FirebaseProvider"
import { collection, doc, onSnapshot, Timestamp } from "firebase/firestore"

interface Info {
  info: string
  updatedAt: Timestamp
}

const Info: React.FC = () => {
  const { firestore } = useFirebase()
  const [info, setInfo] = useState({} as Info)

  useEffect(() => {
    if (!firestore) return
    const docAppInfo = doc(firestore, "app", "docker")

    const unsubscribe = onSnapshot(docAppInfo, snapshot => {
      setInfo(snapshot.data() as Info)
    })

    return () => unsubscribe()
  }, [firestore])

  return (
    <div>
      <h2>Info</h2>
      <div className="card">
        <div className="card-body">
          {info ? (
            <>
              <div dangerouslySetInnerHTML={{ __html: info.info }} />
              <p className="text-muted">
                Last updated at: {info.updatedAt?.toDate().toLocaleString()}
              </p>
            </>
          ) : (
            <p>Loading...</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default Info
