export const Table: React.FC<{
  tableHeader: any[]
  tableBody: any[]
}> = ({ tableHeader, tableBody }) => {
  return (
    <table className="table table-hover">
      <thead>
        <tr>
          <th className="text-secondary">#</th>
          {tableHeader.map((item, index) => (
            <th className="text-uppercase text-secondary" key={index}>
              {item.text}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {tableBody.map((row, rowIndex) => (
          <tr key={rowIndex}>
            <td>{rowIndex + 1}</td>
            {tableHeader.map((column, colIndex) => (
              <td key={colIndex}>
                {column.render ? column.render(row) : row[column.field]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}
