# Leaflet-Challenge

The primary task for this assignment was to visualize an earthquake dataset from the [USGS GeoJSON Feed](http://earthquake.usgs.gov/earthquakes/feed/v1.0/geojson.php) using Leaflet & Mapbox.  

1. **Get data set**

I chose to display all earthquakes from the last day.  Upon choosing the dataset from the USGS website, I was given a URL with a JSON representation of the data, which was used for plotting the visualization.

2.  ** Import & visualize the data**

I created a map using Leaflet that plotted all of the earthquakes based on their longitude & latitude.

* Data markers reflect the magnitude of the earthquake by their size & the depth of the earthquake by color.  Earthquakes with higher magnitudes appear larger & earthquakes with greater depth appear darker in color.  (the depth of the earth can be found as the 3rd coordinate for each earthquake)

* Include popups that provide the location & date/time about each earthquake when the marker is clicked.

* Create legend that provides context for map data.



* logic.js script assumes config.js file containing MapBox API Key as "API_KEY"

