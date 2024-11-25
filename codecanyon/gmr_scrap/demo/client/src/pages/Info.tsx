import { doc, onSnapshot } from "firebase/firestore"
import { useEffect, useState } from "react"
import { useFirebase } from "../contexts/FirebaseProvider"

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
          {info ? (
            <>
              <p>Architecture: {info.Architecture}</p>
              <p>ServerVersion: {info.ServerVersion}</p>
              <p>KernelVersion: {info.KernelVersion}</p>
              <p>OSType: {info.OSType}</p>
              <p>
                MemTotal: {Number(info.MemTotal / 1024 / 1024).toFixed(0)} MB
              </p>
              <p>OperatingSystem: {info.OperatingSystem}</p>
              <p>NCPU: {info.NCPU}</p>
              <p>ID: {info.ID}</p>
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
