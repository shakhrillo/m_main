function filterUniqueElements(elements) {
  return elements.filter((element, index, self) => {
    // Ensure element is an object and not null or undefined
    const isObject = element && typeof element === "object";
    const isEmptyObject = isObject && Object.keys(element).length === 0;

    // Ensure the element is unique and not an empty object
    return (
      isObject &&
      !isEmptyObject &&
      index === self.findIndex((t) => t.id === element.id)
    );
  });
}

module.exports = filterUniqueElements;
