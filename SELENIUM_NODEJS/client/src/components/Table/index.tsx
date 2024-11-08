import { TableHeader } from "./TableHeader";
import { TableBody } from "./Tablebody";

export const Table: React.FC<{ tableHeader: any; body: any[] }> = ({ tableHeader, body }) => {
  return (
    <table
      className={'geo-dashboard__body-content__table table table-bordered'}
    >
      <TableHeader header={tableHeader} />
      <TableBody body={body} columns={tableHeader} />
    </table>
  )
}