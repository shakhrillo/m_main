import { useFloating, offset, flip, shift, useHover } from "@floating-ui/react";
import { useState } from "react";
import { IComment } from "../services/scrapService";
import { Col, Stack } from "react-bootstrap";

export const CommentQAView = ({
  comment,
  ...rest
}: {
  comment?: IComment;
} & React.HTMLAttributes<HTMLDivElement>) => {
  const [isVisible, setIsVisible] = useState(false);
  const { refs, floatingStyles, context } = useFloating({
    middleware: [offset(8), flip(), shift()],
    open: isVisible,
    onOpenChange: setIsVisible,
  });

  // Set up hover behavior
  useHover(context, {
    delay: { open: 400, close: 0 }, // Optional delay for hover
  });

  return (
    <div {...rest} ref={refs.setReference} style={{ display: "inline-block" }}>
      <span className="d-inline-block">
        {comment?.qa.map((qa, index) => {
          return (
            index < 2 && (
              <Stack key={"qa-" + index} direction="horizontal">
                {qa.split("\n").map((line, i) => (
                  <Col key={i} className="d-flex">
                    <span
                      className="d-inline-block text-truncate me-1"
                      style={{ width: i !== 0 ? "100px" : "auto" }}
                    >
                      {i === 0 && qa.split("\n").length > 1 ? (
                        <strong>{line}</strong>
                      ) : (
                        line
                      )}
                    </span>
                  </Col>
                ))}
              </Stack>
            )
          );
        })}
        {comment?.qa && comment?.qa?.length > 2 && (
          <span className="d-inline-block text-truncate">...</span>
        )}
      </span>
      {isVisible && (
        <div
          ref={refs.setFloating}
          style={{
            ...floatingStyles,
            backgroundColor: "black",
            color: "white",
            padding: "5px",
            borderRadius: "4px",
            zIndex: 1000,
            position: "absolute",
          }}
        >
          {comment?.qa.map((qa, index) => (
            <Stack direction="horizontal" key={"qa-" + index}>
              {qa.split("\n").map((line, i) => (
                <>
                  {i === 1 ? <span className="me-1">:</span> : null}
                  <span key={i}>{line}</span>
                </>
              ))}
            </Stack>
          ))}
        </div>
      )}
    </div>
  );
};
