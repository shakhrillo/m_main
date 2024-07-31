function lMarker(
  data,
  map,
  text="",
) {
  L.marker(
    data, {
      icon: L.divIcon({
        className: 'custom-marker',
        iconSize: [60, 20],
        html: '<div class="marker">'+text+'</div>',
      })
    }).addTo(map)
  // .bindPopup('I am a custom marker with rounded corners.');
}