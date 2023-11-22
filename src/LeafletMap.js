import React, { useEffect } from 'react';
import i18n from '@dhis2/d2-i18n'
import 'leaflet/dist/leaflet.css';
import './LeafletMap.css';
import L from 'leaflet';
import * as d3 from 'd3';

const LeafletMap = ({ data }) => {
  useEffect(() => {

    // Initialize the map
    const center =  [8.537, -12.321]
    const zoom = 7
    const map = L.map('leaflet-map').setView(center, zoom);

    // Add OpenStreetMap tiles to the map
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    // Add GeoJSON layer to the map
    const geojsonLayer = L.geoJSON(data.geojson, {
      style: (feature) => {
        // Get the ID of the current feature
        const featureId = feature.id;
        // Find the corresponding value from the query data
        const matchingValue = data.values.rows.find((entry) => entry[1] === featureId);
        // Use the value to determine the color
        const color = getColor(matchingValue[2]);
        // Return feature style
        return {
          fillColor: color,
          weight: 1.5,
          opacity: 1,
          color: 'white',
          dashArray: '3',
          fillOpacity: 0.8,
        };
      },
      onEachFeature: (feature, layer) => {
      // Get the ID of the current feature
        const featureId = feature.id;
        // Find the corresponding value from the query data
        const matchingValue = data.values.rows.find((entry) => entry[1] === featureId);
        // Find the corresponding organisation unit name from the query data
        const matchingOU = data.values.metaData.items[featureId].name;
        // Bind tooltip to feature
        const content = `<b>${matchingOU}</b><br>` + i18n.t('Bednet usage') + `: ${matchingValue[2]}%`;
        layer.bindTooltip(content, { permanent: false, direction: 'auto' });
      }
    }).addTo(map);

    // Fit the map bounds to the GeoJSON layer
    map.fitBounds(geojsonLayer.getBounds());

    // Add legend to the map
    const legend = L.control({ position: 'bottomright' });
    legend.onAdd = function (map) {
      // List legend values
      const valuesCount = colorScale.length
      const grades = Array.from({ length: valuesCount + 1 }, (_, index) => index * 100 / valuesCount)
      // Create legend content
      const div = L.DomUtil.create('div', 'info legend')
      for (var i = grades.length-2; i >=0 ; i--) {
        div.innerHTML += '<i style="background:' + getColor(grades[i] + 100 / valuesCount / 2) + '"></i> ' + grades[i] + '&ndash;' + grades[i + 1] + '%<br>';
      }
      return div;
    };
    legend.addTo(map);
  
  }, []); // Empty dependency array to run the effect only once

  // Define color scale using D3
  const colorScale = d3.schemeRdYlBu[5];

  // Color mapping logic
  const getColor = (value) => {  
    // Use the color scale to get a color based on the percentage value
    return colorScale[Math.floor(value / (100 / colorScale.length))];
  };

  return <div id="leaflet-map" style={{ height: '400px', width: '100%' }} />;
};

export default LeafletMap;