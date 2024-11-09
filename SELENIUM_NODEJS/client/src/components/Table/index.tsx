import { TableHeader } from "./TableHeader";
import { TableBody } from "./Tablebody";

export const Table: React.FC<{ tableHeader: any; body: any[] }> = ({ tableHeader, body }) => {
  return (
    <table>
      <TableHeader header={tableHeader} />
      <TableBody body={body} columns={tableHeader} />
    </table>
  )
}