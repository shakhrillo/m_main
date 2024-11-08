interface TableColumn {
  field: string; // Field in the data object to display
  header?: string; // Optional header text (can be used in the TableHeader if needed)
  render?: (data: any) => React.ReactNode; // Optional custom render function for the cell
}

interface TableBodyProps {
  body: any[];
  columns: TableColumn[];
}

export const TableBody: React.FC<TableBodyProps> = ({ body, columns }) => (
  <tbody>
    {body.map((row, rowIndex) => (
      <tr key={rowIndex} className="table-custom__data-row">
        {columns.map((column, colIndex) => (
          <td key={colIndex} className="table-custom__data-row__body">
            <div className="table-custom__data-row__body__cell-content">
              {
                colIndex === 0 ? (
                  <span className="text-center w-100">
                    {rowIndex + 1}
                  </span>
                ) : (
                  column.render ? column.render(row) : row[column.field]
                )
              }
            </div>
          </td>
        ))}
      </tr>
    ))}
  </tbody>
);
