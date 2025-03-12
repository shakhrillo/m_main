import { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { filter, take } from "rxjs";
import { settingValue } from "../services/settingService";

/**
 * Help page component.
 */
export const Terms = () => {
  const [terms, setTerms] = useState(null as any);

  useEffect(() => {
    const subscription = settingValue({ tag: "terms", type: "general" })
      .pipe(
        filter((data) => !!data),
        take(1),
      )
      .subscribe((data) => setTerms(data["value"]));

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <Container>
      <Row>
        <Col>
          <h5>Terms and Conditions</h5>
          <div className="help-container">
            <div dangerouslySetInnerHTML={{ __html: terms }}></div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};
