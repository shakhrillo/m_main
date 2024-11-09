interface TableHeader {
  text: string;
  icon?: string;
  textRender?: () => JSX.Element;
}

interface TableHeaderProps {
  header: TableHeader[];
}

// IconText Component for icon and text rendering
const IconText: React.FC<{ icon: string; text: string }> = ({ icon, text }) => (
  <div className="icon-text">
    <i className={`bi bi-${icon}`}></i>
    {text}
  </div>
);

// TableHeaderCell Component for individual header cells
const TableHeaderCell: React.FC<{ item: TableHeader }> = ({ item }) => (
  <th>
    {
      item.textRender ? item.textRender() : (
        item.icon ? <IconText icon={item.icon} text={item.text} /> : item.text
      )
    }
  </th>
);

// Main TableHeader Component
export const TableHeader: React.FC<TableHeaderProps> = ({ header }) => (
  <thead>
    <tr>
      {header.map((item, index) => <TableHeaderCell key={index} item={item} />)}
    </tr>
  </thead>
);
