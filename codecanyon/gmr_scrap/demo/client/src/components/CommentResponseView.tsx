import { useFloating, offset, flip, shift, useHover } from "@floating-ui/react";
import { useState } from "react";
import { IComment } from "../services/scrapService";

export const CommentResponseView = ({
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

  useHover(context, {
    delay: { open: 400, close: 0 },
  });

  return (
    <div {...rest} ref={refs.setReference} style={{ display: "inline-block" }}>
      <span
        className="d-inline-block text-truncate"
        style={{ maxWidth: "250px" }}
      >
        {comment?.response}
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
          {comment?.response}
        </div>
      )}
    </div>
  );
};
