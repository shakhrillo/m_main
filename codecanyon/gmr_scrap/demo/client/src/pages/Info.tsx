import { doc, onSnapshot } from "firebase/firestore"
import { useEffect, useState } from "react"
import { useFirebase } from "../contexts/FirebaseProvider"

const renderObject = (obj: any) => {
  return (
    <ul className="info-list">
      {Object.keys(obj).map((key, index) => {
        const value = obj[key]

        if (typeof value === "object" && value !== null) {
          return (
            <li key={index}>
              <strong>{key}:</strong>
              <ul>{renderObject(value)}</ul>
            </li>
          )
        }

        return (
          <li key={index}>
            <strong>{key}:</strong> {value}
          </li>
        )
      })}
    </ul>
  )
}

const Info: React.FC = () => {
  const { firestore } = useFirebase()
  const [info, setInfo] = useState(null as any)

  useEffect(() => {
    if (!firestore) return
    const docAppInfo = doc(firestore, "app", "info")

    const unsubscribe = onSnapshot(docAppInfo, snapshot => {
      const data = snapshot.data()
      if (!data || !data.info) return
      console.log(JSON.parse(data.info))
      setInfo(JSON.parse(data.info))
    })

    return () => unsubscribe()
  }, [firestore])

  return (
    <div>
      <h2>Info</h2>
      <div className="card">
        <div className="card-body">
          {info ? <>{renderObject(info)}</> : <p>Loading...</p>}
        </div>
      </div>
    </div>
  )
}

export default Info
