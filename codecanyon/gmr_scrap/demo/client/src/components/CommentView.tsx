import { useFloating, offset, flip, shift, useHover } from "@floating-ui/react";
import { useState } from "react";
import { IComment } from "../services/scrapService";

export const CommentView = ({
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
      <span
        className="d-inline-block text-truncate"
        style={{
          maxWidth: "100px",
        }}
      >
        {comment?.review}
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
          {comment?.review}
        </div>
      )}
    </div>
  );
};
