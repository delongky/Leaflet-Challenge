// Perform an API call to the USGS geojson feed (last day)
var earthquakeURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";


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

    // Create function for circle size based on magnitude
    function circleSize(mag) {
        return mag * 5
    }; // ends size function

    // Create new geojson layer
    var earthquakes = L.geoJson(earthquakeData, {
        pointToLayer: function(feature, latlng) {
            return new L.CircleMarker(latlng, {
                radius: circleSize(feature.properties.mag),
                color: circleColor(feature.geometry.coordinates[2]),
                fillColor: circleColor(feature.geometry.coordinates[2]),
                fillOpacity: 0.75
            }); // ends circleMarker formatting
        }, // ends point to layer conversion function
        onEachFeature: onEachFeature
    }); // ends earthquake layer

    // Send earthquakes layer to createMap function
    createMap(earthquakes);
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
    var myMap = L.map("map", {
        center: [37.09, -95.71],
        zoom: 5,
        layers: [outdoorsmap, earthquakes]
    }); // ends map object

    // Create layer control, pass in layers & add to map
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);

    // Build legend
    var legend = L.control({ position: "bottomright" });
    legend.onAdd = function() {
        var div = L.DomUtil.create("div", "info legend");
        var depth = [0, 20, 40, 60, 80];
        var labels = []
        var colors = [
            "#6b0bd9", 
            "#ff63d9",
            "#e552d9",
            "#ca42da",
            "#ae31da",
            "#8f1fd9"
        ];

        // Loop to add colors to legend
        for (var i = 0; i < depth.length; i++) {
            div.innerHTML += "<i style='background: " + colors[i] + "'></i> " +
            depth[i] + (depth[i + 1] ? "&ndash;" + depth[i + 1] + "<br>" : "+");
        }
        return div;
    }; // ends legend
    // Add legend to map
    legend.addTo(myMap);
} // ends createMap function

// Create function for circle color based on depth
function circleColor(depth) {
    if (depth <= 0) {
        return "#ff63d9"
    }
    else if (depth <= 20) {
        return "#e552d9"
    }
    else if (depth <= 40) {
        return "#ca42da"
    }
    else if (depth <= 60) {
        return "#ae31da"
    }
    else if (depth <= 80) {
        return "#8f1fd9"
    }
    else {
        return "#6b0bd9"
    }
}; // ends color function