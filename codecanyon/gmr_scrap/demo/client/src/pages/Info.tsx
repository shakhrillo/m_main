import { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { filter, take } from "rxjs";
import { settingValue } from "../services/settingService";

export const Info = () => {
  const [info, setInfo] = useState(null as any);

  useEffect(() => {
    const subscription = settingValue({ tag: "help", type: "general" })
      .pipe(
        filter((data) => !!data),
        take(1),
      )
      .subscribe((data) => setInfo(data["value"]));

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <Container>
      <Row>
        <Col>
          <h5>Info</h5>
          {info}
        </Col>
      </Row>
    </Container>
  );
};
