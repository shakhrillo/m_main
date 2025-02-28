import { Breadcrumb, Container } from "react-bootstrap";
import { ReceiptList } from "../components/receipt/ReceiptList";

export const Receipts = () => {
  return (
    <Container>
      <Breadcrumb>
        <Breadcrumb.Item active>Receipts</Breadcrumb.Item>
      </Breadcrumb>

      <ReceiptList />
    </Container>
  );
};
