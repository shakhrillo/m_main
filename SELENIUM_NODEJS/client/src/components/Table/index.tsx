import { an } from "vitest/dist/chunks/reporters.C4ZHgdxQ.js"
import { TableHeader } from "./TableHeader"
import { TableBody } from "./Tablebody"

export const Table: React.FC<{
  tableHeader: any
  body: any[]
}> = ({ tableHeader, body }) => {
  return (
    <table className={"table"}>
      <TableHeader header={tableHeader} />
      <TableBody body={body} columns={tableHeader} />
    </table>
  )
}
