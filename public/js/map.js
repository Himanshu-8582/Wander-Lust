mapboxgl.accessToken = mapToken;
    const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v9',
        projection: 'globe', // Display the map as a globe, since satellite-v9 defaults to Mercator
        center: listing.geometry.coordinates,   //[longitude,latitude]
        zoom: 9
    });


// console.log(coordinates);
const marker = new mapboxgl.Marker({ color: "red" })
    .setLngLat(listing.geometry.coordinates?listing.geometry.coordinates : [77.1025, 28.7041] )
    .setPopup(new mapboxgl.Popup({ offset: 25})
    .setHTML(`<h4> ${listing.location} </h4>  <p>Exact Location provided after booking</p>`))
    .addTo(map);
        
