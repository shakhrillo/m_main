/**
 * Fetch visible elements
 * @returns {Object} Updated GmrScrap object
 */
return (async () => {
  await fetchVisibleElements();
  return gmrScrap;
})();
