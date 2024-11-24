import { useEffect, useState } from "react"
import { useFirebase } from "../contexts/FirebaseProvider"
import { collection, onSnapshot } from "firebase/firestore"

interface User {
  id: string
  coin: string
  displayName: string
  email: string
}

const Users: React.FC = () => {
  const { firestore } = useFirebase()
  const [users, setUsers] = useState<User[]>([])

  useEffect(() => {
    if (!firestore) return
    const usersRef = collection(firestore, "users")
    console.log(firestore)

    const unsubscribe = onSnapshot(usersRef, snapshot => {
      const usersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }))

      console.log(usersData)

      setUsers(usersData as User[])
    })

    return () => unsubscribe()
  }, [firestore])

  return (
    <div>
      <h2>Users</h2>
      <ul>
        {users.map(user => (
          <li key={user.id}>
            {user.displayName} - {user.email} - {user.coin}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Users
