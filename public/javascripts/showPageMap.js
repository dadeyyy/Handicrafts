mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
  container: 'map', // container ID
  style: 'mapbox://styles/mapbox/streets-v12', // style URL
  center: handicraft.geometry.coordinates, // starting position [lng, lat]
  zoom: 12, // starting zoom
});

const marker = new mapboxgl.Marker()
  .setLngLat(handicraft.geometry.coordinates)
  .setPopup(
    new mapboxgl.Popup({ offset: 25 }).setHTML(
      `<h5>${handicraft.title}</h5> <p>${handicraft.location}</p>`
    )
  )
  .addTo(map);
