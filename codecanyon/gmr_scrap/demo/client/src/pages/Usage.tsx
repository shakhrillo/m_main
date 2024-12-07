import { doc, onSnapshot, updateDoc } from "firebase/firestore"
import { useEffect, useState } from "react"
import { useFirebase } from "../contexts/FirebaseProvider"

const Usage: React.FC = () => {
  const { firestore } = useFirebase()
  const [totalCpuUsage, setTotalCpuUsage] = useState(0)
  const [totalMemory, setTotalMemory] = useState(0)
  const [memoryFree, setMemoryFree] = useState(0)
  const [memoryUsed, setMemoryUsed] = useState(0)

  useEffect(() => {
    if (!firestore) return
    const docAppInfo = doc(firestore, "docker", "info")

    const unsubscribe = onSnapshot(docAppInfo, snapshot => {
      const data = snapshot.data()
      if (!data || !data.info) return
      console.log(JSON.parse(data.info))
      const info = JSON.parse(data.info)

      // const totalCpuUsage = info.NCPU;  // Total number of CPUs
      // const totalMemory = info.MemTotal;  // Total memory in bytes
      // const memoryFree = info.MemFree;  // Free memory in bytes
      // const memoryUsed = totalMemory - memoryFree;  // Used memory

      // console.log(`Total CPUs: ${totalCpuUsage}`);
      // console.log(`Total Memory: ${totalMemory / (1024 * 1024)} MB`);
      // console.log(`Used Memory: ${memoryUsed / (1024 * 1024)} MB`);
      // console.log(`Free Memory: ${memoryFree / (1024 * 1024)} MB`);
      if (info) {
        setTotalCpuUsage(info.NCPU)
        setTotalMemory(info.MemTotal / (1024 * 1024))
        setMemoryFree(info.MemFree / (1024 * 1024))
        setMemoryUsed((info.MemTotal - info.MemFree) / (1024 * 1024))
      }
    })

    return () => unsubscribe()
  }, [firestore])

  return (
    <div>
      <h2>Usage</h2>
      <table className="table">
        <thead>
          <tr>
            <th>CPU</th>
            <th>Memory</th>
            <th>All containers</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{totalCpuUsage}</td>
            <td>{totalMemory}</td>
            <td>{memoryUsed}</td>
            <td>{memoryFree}</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export default Usage
