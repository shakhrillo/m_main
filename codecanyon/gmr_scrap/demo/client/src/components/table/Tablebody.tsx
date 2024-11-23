interface TableColumn {
  field: string
  header?: string
  render?: (data: any) => React.ReactNode
}

interface TableBodyProps {
  body: any[]
  columns: TableColumn[]
}

export const TableBody: React.FC<TableBodyProps> = ({ body, columns }) => (
  <tbody>
    {body.map((row, rowIndex) => (
      <tr key={rowIndex}>
        {columns.map((column, colIndex) => (
          <td key={colIndex}>
            {column.render ? column.render(row) : row[column.field]}
          </td>
        ))}
      </tr>
    ))}
  </tbody>
)
