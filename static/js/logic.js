// Perform an API call to the USGS geojson feed (last 7 days)
var earthquakeURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";


d3.json(earthquakeURL).then(function(data) {
    createFeatures(data.features);
    console.log(data.features);
}); // ends GET request


function createFeatures(earthquakeData) {

    // Binds pop-up to each layer
    function onEachFeature(feature, layer) {
        layer.bindPopup("<h3>" + feature.properties.place + 
        "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
    } // ends pop-up binding

    // Create new geojson layer
    var earthquakes = L.geoJson(earthquakeData, {
        pointToLayer: function(feature, latlng) {
            return new L.CircleMarker(latlng, {
                radius: circleSize(feature.properties.mag),
                fillColor: circleColor(feature.properties.mag)
            }); // ends circleMarker formatting
        }, // ends point to layer conversion function
        onEachFeature: onEachFeature
    }); // ends earthquake layer

    // Send earthquakes layer to createMap function
    createMap(earthquakes)
} // ends createFeatures function


function createMap(earthquakes) {
    // Adding tile layers to the map
    var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "light-v10",
        accessToken: API_KEY
    }); // ends lightmap layer

    var outdoorsmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox/outdoors-v11",
        accessToken: API_KEY
    }); // ends outdoorsmap layer

    // Create a baseMaps object to hold the lightmap & outdoor layer
    var baseMaps = {
        "Light Map": lightmap,
        "Outdoor Map": outdoorsmap
    }; // ends baseMap

    // Create overlay object to hold our geoJSON layer
    var overlayMaps = {
        Earthquakes: earthquakes
    }; // ends overlayMap

    // Create map object w/ options
    var myMap = L.map("mapid", {
        center: [37.09, -95.71],
        zoom: 5,
        layers: [outdoorsmap, earthquakes]
    }); // ends map object

    // Create layer control, pass in layers & add to map
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);
} // ends createMap function

// Create function for circle size based on magnitude
function circleSize(mag) {
    return mag * 20000
}; // ends size function

// Create function for circle color based on depth
function circleColor(mag) {
    if (mag <= 1) {
        return "#ff63d9"
    }
    else if (mag <= 2) {
        return "#e552d9"
    }
    else if (mag <= 3) {
        return "#ca42da"
    }
    else if (mag <= 4) {
        return "#ae31da"
    }
    else if (mag <= 5) {
        return "#8f1fd9"
    }
    else {
        return "#6b0bd9"
    }
}; // ends color function






// Build legend