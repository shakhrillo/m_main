import { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { filter, take } from "rxjs";
import { settingValue } from "../services/settingService";

/**
 * Help page component.
 */
export const Help = () => {
  const [help, setHelp] = useState(null as any);

  useEffect(() => {
    const subscription = settingValue({ tag: "help", type: "general" })
      .pipe(
        filter((data) => !!data),
        take(1),
      )
      .subscribe((data) => setHelp(data["value"]));

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <Container>
      <Row>
        <Col>
          <h5>Help</h5>
          <div className="help-container">
            <div dangerouslySetInnerHTML={{ __html: help }}></div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};
