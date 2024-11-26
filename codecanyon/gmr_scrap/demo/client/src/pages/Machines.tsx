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
  createdAt: Timestamp
  message: string
  status: string
  updatedAt: Timestamp
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
                <th>Last Message</th>
                <th>Status</th>
                <th>Created At</th>
                <th>Updated At</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {machines.map(machine => (
                <tr key={machine.id}>
                  <td>{machine.id ? machine.id.slice(0, 8) : ""}...</td>
                  <td>
                    {machine.message ? machine.message.slice(0, 30) : ""}...
                  </td>
                  <td>{machine.status}</td>
                  <td>{machine.createdAt.toDate().toLocaleString()}</td>
                  <td>{machine.updatedAt.toDate().toLocaleString()}</td>
                  <td>
                    <button
                      className="button button-danger"
                      disabled={machine.status === "removed"}
                      onClick={() => removeMachine(machine.id)}
                    >
                      Remove
                    </button>
                  </td>
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
