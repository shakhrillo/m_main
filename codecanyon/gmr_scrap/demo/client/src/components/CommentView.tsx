import { useFloating, offset, flip, shift, useHover } from "@floating-ui/react";
import { useState } from "react";
import { IComment } from "../services/scrapService";

export const CommentView = ({
  comment,
  ...rest
}: {
  comment?: IComment;
} & React.HTMLAttributes<HTMLDivElement>) => {
  const textLimit = 150;
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
      <span>
        {comment?.review && comment.review.length > textLimit
          ? comment.review.slice(0, textLimit) + "..."
          : comment?.review}
      </span>
      {isVisible && comment?.review && comment.review.length > textLimit && (
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
