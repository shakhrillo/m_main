import { doc, onSnapshot, updateDoc } from "firebase/firestore"
import { useEffect, useState } from "react"
import { useFirebase } from "../contexts/FirebaseProvider"

interface IUsage {
  Active: string
  Reclaimable: string
  Size: string
  TotalCount: string
  Type: string
}

const Usage: React.FC = () => {
  const { firestore } = useFirebase()
  const [usage, setUsage] = useState<IUsage[]>([])

  useEffect(() => {
    if (!firestore) return
    const docAppInfo = doc(firestore, "app", "usage")

    const unsubscribe = onSnapshot(docAppInfo, snapshot => {
      const data = snapshot.data()
      if (!data || !data.usage) return
      const dataArray = data.usage.split("\n").filter((item: any) => item)
      const objects = dataArray.map((item: any) => JSON.parse(item))
      console.log(objects)
      setUsage(objects)
    })

    return () => unsubscribe()
  }, [firestore])

  async function refresh() {
    const docAppInfo = doc(firestore, "app", "usage")
    await updateDoc(docAppInfo, {
      refresh: true,
    })
  }

  async function clearCache() {
    const docAppInfo = doc(firestore, "app", "usage")
    await updateDoc(docAppInfo, {
      clearCache: true,
    })
  }

  return (
    <div>
      <h2>Usage</h2>
      <div className="card">
        <div className="card-header">
          <button className="button" onClick={clearCache}>
            Clear cache
          </button>
          <button className="button button-primary" onClick={refresh}>
            Refresh
          </button>
        </div>
        <div className="card-body">
          <table className="table">
            <thead>
              <tr>
                <th>Type</th>
                <th>Size</th>
                <th>Active</th>
                <th>Total Count</th>
                <th>Reclaimable</th>
              </tr>
            </thead>

            <tbody>
              {usage.map((item, index) => (
                <tr key={index}>
                  <td>{item.Type}</td>
                  <td>{item.Size}</td>
                  <td>{item.Active}</td>
                  <td>{item.TotalCount}</td>
                  <td>{item.Reclaimable}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Usage
