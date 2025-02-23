import { User } from "firebase/auth";
import { Breadcrumb, Container } from "react-bootstrap";
import { useOutletContext } from "react-router-dom";
import { ReceiptList } from "../components/receipt/ReceiptList";

export const Receipts = () => {
  const { uid } = useOutletContext<User>();

  return (
    <Container>
      <Breadcrumb>
        <Breadcrumb.Item active>Receipts</Breadcrumb.Item>
      </Breadcrumb>

      <ReceiptList uid={uid} />
    </Container>
  );
};
