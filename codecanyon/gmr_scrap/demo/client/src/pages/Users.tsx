import { useEffect, useState } from "react"
import { useFirebase } from "../contexts/FirebaseProvider"
import { collection, onSnapshot } from "firebase/firestore"
import Loader from "../components/loader"
import { Table } from "../components/table"

interface User {
  id: string
  coin: string
  displayName: string
  email: string
}

const Users: React.FC = () => {
  const { firestore } = useFirebase()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!firestore) return
    setLoading(true)
    const usersRef = collection(firestore, "users")

    const unsubscribe = onSnapshot(usersRef, snapshot => {
      const usersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }))
      setUsers(usersData as User[])
      setLoading(false)
    })
    return () => unsubscribe()
  }, [firestore])

  const tableHeader = [
    {
      text: "Display Name",
      field: "displayName",
      render: (row: any) => <span>{row.displayName}</span>,
    },
    {
      text: "Email",
      field: "email",
      render: (row: any) => <span>{row.email}</span>,
    },
    {
      text: "Coin",
      field: "coin",
      render: (row: any) => <span>{row.coin || "0"}</span>,
    },
  ]
  return (
    <>
      {loading ? (
        <Loader version={2} cover="full" />
      ) : (
        <div>
          <h3>Users</h3>
          <div className="mt-4">
            <Table tableHeader={tableHeader} tableBody={users}></Table>
          </div>
        </div>
      )}
    </>
  )
}

export default Users
