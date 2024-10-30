function filterUniqueElements(elements) {
  return elements.filter((element, index, self) =>
    index === self.findIndex((t) => t.id === element.id)
  );
}

module.exports = filterUniqueElements;
