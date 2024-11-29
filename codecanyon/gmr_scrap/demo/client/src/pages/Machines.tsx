import { useEffect, useState } from "react"
import { useFirebase } from "../contexts/FirebaseProvider"
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  Timestamp,
  updateDoc,
} from "firebase/firestore"

interface Machine {
  id: string
  time: Timestamp
  Action: string
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
      orderBy("time", "desc"),
    )

    const unsubscribe = onSnapshot(machinesRef, snapshot => {
      const machinesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }))
      setMachines(machinesData as Machine[])
    })

    return () => unsubscribe()
  }, [firestore])

  function removeMachine(id: string) {
    const machineRef = doc(firestore, "machines", id)
    updateDoc(machineRef, {
      status: "remove",
    })
  }

  return (
    <div>
      <h2>Users</h2>
      <div className="card">
        <div className="card-body">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Machine Type</th>
                <th>From</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {machines.map(machine => (
                <tr key={machine.id}>
                  <td>{machine.Type}</td>
                  <td>{machine.Type}</td>
                  <td>{machine.from}</td>
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
