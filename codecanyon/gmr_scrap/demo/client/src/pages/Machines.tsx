import { useEffect, useState } from "react"
import { useFirebase } from "../contexts/FirebaseProvider"
import {
  collection,
  doc,
  limit,
  onSnapshot,
  orderBy,
  query,
  Timestamp,
  updateDoc,
} from "firebase/firestore"
import { formatStats } from "../utils/formatStats"
import { formatTimestamp } from "../utils/formatTimestamp"
import { spentTime } from "../utils/spentTime"

interface Machine {
  id: string
  time: number
  Action: string
  Actor: {
    ID: string
    Attributes: {
      name: string
    }
  }
  status: string
  Type: string
  from: string
}

const Machines: React.FC = () => {
  const { firestore } = useFirebase()
  const [machines, setMachines] = useState<Machine[]>([])

  useEffect(() => {
    if (!firestore) return
    // const machinesRef = collection(firestore, "machines")
    // oreder by createdAt
    const machinesRef = query(
      collection(firestore, "machines"),
      orderBy("createdAt", "desc"),
      limit(20),
    )

    const unsubscribe = onSnapshot(machinesRef, snapshot => {
      const machinesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }))
      console.log(machinesData)
      setMachines(machinesData as Machine[])
    })

    return () => unsubscribe()
  }, [firestore])

  return (
    <div>
      <h2>Machines</h2>
      <div className="card">
        <div className="card-body">
          <table className="table">
            <thead>
              <tr>
                <th>Time</th>
                <th>Stats</th>
                <th>Spent Time</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {machines.map((machine: any) => (
                <tr key={machine.id}>
                  <td>{formatTimestamp(machine.createdAt)}</td>
                  <td>{formatStats(machine.stats)}</td>
                  <td>{spentTime(machine)}</td>
                  <td>{machine.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Machines
