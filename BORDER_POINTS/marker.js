const svg = `
<svg width="30" height="30" viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg">
  <circle cx="15" cy="15" r="13" stroke="black" stroke-width="3" fill="none" stroke-dasharray="80" stroke-dashoffset="60">
    <animateTransform
      attributeName="transform"
      type="rotate"
      from="0 15 15"
      to="360 15 15"
      dur="2s"
      repeatCount="indefinite"/>
    </circle>
</svg>
`;
function lMarker(
  data,
  map,
  text="",
) {
  L.marker(
    data, {
      icon: L.divIcon({
        className: 'custom-marker',
        iconSize: [30, 30],
        html: `<div class="marker">${svg}</div>`,
      })
    }).addTo(map)
  // .bindPopup('I am a custom marker with rounded corners.');
}