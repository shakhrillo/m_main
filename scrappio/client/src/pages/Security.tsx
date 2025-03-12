import { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { filter, take } from "rxjs";
import { settingValue } from "../services/settingService";

/**
 * Security page component.
 */
export const Security = () => {
  const [info, setInfo] = useState(null as any);

  useEffect(() => {
    const subscription = settingValue({ tag: "security", type: "general" })
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
          <h5>Security</h5>
          <div className="help-container">
            <div dangerouslySetInnerHTML={{ __html: info }}></div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};
