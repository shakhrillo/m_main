import { useEffect, useState } from "react"
import { useFirebase } from "../contexts/FirebaseProvider"
import { collection, onSnapshot, Timestamp } from "firebase/firestore"

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
    const machinesRef = collection(firestore, "machines")

    const unsubscribe = onSnapshot(machinesRef, snapshot => {
      const machinesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }))
      setMachines(machinesData as Machine[])
    })

    return () => unsubscribe()
  }, [firestore])

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
                  <td>{machine.id.slice(0, 8)}...</td>
                  <td>{machine.message.slice(0, 30)}...</td>
                  <td>{machine.status}</td>
                  <td>{machine.createdAt.toDate().toLocaleString()}</td>
                  <td>{machine.updatedAt.toDate().toLocaleString()}</td>
                  <td>
                    <button className="button">Remove</button>
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
