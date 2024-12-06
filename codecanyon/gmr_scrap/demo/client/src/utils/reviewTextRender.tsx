export const reviewTextRender = (text: string) => {
  const textLength = text.length
  const renderTextLength = 260
  if (textLength === 0) return "No review"
  return (
    <p title={text}>
      {textLength > renderTextLength
        ? text.slice(0, renderTextLength) + "..."
        : text}
    </p>
  )
}
