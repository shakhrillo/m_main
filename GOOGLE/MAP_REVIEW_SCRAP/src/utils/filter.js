function filterUniqueElements(elements) {
  return elements.filter((element, index, self) => {
    // Check if the element is an empty object
    const isEmptyObject = Object.keys(element).length === 0;

    // Ensure the element is unique and not an empty object
    return (
      !isEmptyObject && index === self.findIndex((t) => t.id === element.id)
    );
  });
}

module.exports = filterUniqueElements;
