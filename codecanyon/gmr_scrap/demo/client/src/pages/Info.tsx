import { doc, onSnapshot } from "firebase/firestore"
import { useEffect, useState } from "react"
import { useFirebase } from "../contexts/FirebaseProvider"

const Info: React.FC = () => {
  const { firestore } = useFirebase()
  const [info, setInfo] = useState(null as any)

  useEffect(() => {
    if (!firestore) return
    const docAppInfo = doc(firestore, "docker", "image")

    const unsubscribe = onSnapshot(docAppInfo, snapshot => {
      const data = snapshot.data()
      if (!data || !data.info) return
      console.log(JSON.parse(data.info))
      setInfo(JSON.parse(data.info))
    })

    return () => unsubscribe()
  }, [firestore])

  return (
    <div className="row">
      <h2>Info</h2>
      {info && (
        <ol className="list-group list-group-numbered">
          {Object.entries(info).map(([key, value]: [string, any]) => (
            <li key={key} className="list-group-item">
              <strong className="me-1">{key}</strong>
              {JSON.stringify(value)}
            </li>
          ))}
        </ol>
      )}
    </div>
  )
}

export default Info
