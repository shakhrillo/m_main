import { doc, onSnapshot } from "firebase/firestore"
import { useEffect, useState } from "react"
import { useFirebase } from "../contexts/FirebaseProvider"

const Info: React.FC = () => {
  const { firestore } = useFirebase()
  const [info, setInfo] = useState(null)

  useEffect(() => {
    if (!firestore) return
    const docAppInfo = doc(firestore, "app", "info")

    const unsubscribe = onSnapshot(docAppInfo, snapshot => {
      const data = snapshot.data()
      if (!data || !data.info) return
      setInfo(data.info)
    })

    return () => unsubscribe()
  }, [firestore])

  return (
    <div>
      <h2>Info</h2>
      <div className="card">
        <div className="card-body">
          <div className="text-wrap">{info}</div>
        </div>
      </div>
    </div>
  )
}

export default Info
