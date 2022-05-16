import React from 'react';

import {
  GeoJSON,
  MapContainer,
  TileLayer,
} from 'react-leaflet';

import {
  LatLngTuple,
  LatLngBoundsExpression,
  LeafletEvent,
  PointTuple,
  StyleFunction,
} from 'leaflet';

import 'leaflet/dist/leaflet.css';
import countryData from './countries3a.json';
import statesData from './states2.json';
import { basemapLayer, BasemapLayer } from "esri-leaflet";
import { getOneMetric } from "../../api/api";
import { Geometry, Feature } from 'geojson';

interface IPropertiesCountry { // = GeoJSON.GeoJsonProperties
  NAME: string;
  NAME_LONG: string;
  FIPS_10_: string;
  FORMAL_EN: string;
  SOVEREIGNT: string;
  ABBREV: string;
  POSTAL: string;
  CONTINENT: string;
  SUBREGION: string;
  data: number;
}

interface IGeoJsonCountryFeatures { // = GeoJSON.Feature
  geometry: {
    type: string;
    coordinates: [][];
  }
  properties: IPropertiesCountry;
  type: string;
}

// interface IGeoJsonCountry { // = GeoJSON.FeatureCollection
//   type: string;
//   features: IGeoJsonCountryFeatures[];
// }

interface IProps {
  metric: string;
  metric2: string;
  location: string;
  location2: string;
  doneLoadingJson: () => void;

}

interface IConfig {
  params: {
    imageBounds: LatLngBoundsExpression;
    center: number[];
    zoom: number;
    maxZoom: number;
    minZoom: number;
  },
  tileLayer: {
    params: {
      id: string;
      token: string;
      noWrap: boolean;
      continuousWorld: boolean;
      bounds: LatLngBoundsExpression;
    }
  }
}
// store the map configuration properties in an object,
// we could also move this to a separate file & import it if desired.
// let config = { params: {}, tileLayer: { params: {}}};
let config: IConfig = { params: {
  center: [40.0, -100.0],
  zoom: 2,
  maxZoom: 20,
  minZoom: 2,
  imageBounds: [
    [48.1, -126.144], // latlng fmt
    [24.3, -69.35]
  ] as LatLngBoundsExpression
},
tileLayer: {
  //uri: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
  //uri: 'http://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
  params: {
    //attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
    id: "",
    token: process.env.REACT_APP_MAP_ACCESS_TOKEN || "",
    noWrap: false,
    continuousWorld: false,
    bounds: [[-90, -180], [90, 180]] as LatLngBoundsExpression // keep from duplicating world map
  }
}};

let ourLayerGroup: L.FeatureGroup<any> | undefined = undefined;
let countriesLayer: L.GeoJSON | undefined = undefined;
let min = 0;
let max = 0;

const CustomMap = (props: IProps) => {
  // Todo - handle start/end times - need control on App.
  const [startTime, ] = React.useState(1583038800);  // default start = 3/1/2020; in seconds
  const [endTime, ] = React.useState(1652146532);    // default end = 5/10/2022, in seconds
  const [geoData, ] = React.useState<IGeoJsonCountryFeatures[]>([]);
  const [map, setMap] = React.useState<L.Map>();
  const [, setBaseMap] = React.useState<BasemapLayer>();
  const [currentZoomLevel, ] = React.useState(2);
  const mapRef = React.useRef(null);

  const typedCountryData: GeoJSON.FeatureCollection = countryData as GeoJSON.FeatureCollection;
  const typedStatesData: GeoJSON.FeatureCollection = statesData as GeoJSON.FeatureCollection;

  const center = [51.505, -0.09] as LatLngTuple;
  const geoStyle = {
    stroke: false,
    fillOpacity: 0.4,
  }

  // This fn is only called once, when the countries layer is created.
  const countriesStyle = (feature: Feature<Geometry, IPropertiesCountry>) => {
    let newColor = getColor(feature.properties?.data);

    return {
      weight: 1.0, // 0.4,
      opacity: 0.5,
      color: newColor,
      fillOpacity: 0.5
    };
  };

  // This fn gets called once.
  const setCountryStyle = (layer: L.FeatureGroup, zoom: number, highlightOn: boolean, data?: number) => {
    let newWeight = 1;
    const features: GeoJSON.Feature = layer.feature as GeoJSON.Feature;
    let newColor = getColor(data || features?.properties?.data);
    let newFillOpacity = 0.4;
    let newOpacity = 0.4;

    if (zoom < 4) newWeight = 0.2;
    else if (zoom === 4) newWeight = 0.4;
    else if (zoom > 4) newWeight = 0.6;
    else if (zoom > 5) newWeight = 1.0;

    if (highlightOn) {
      newFillOpacity = 0.25;
      newOpacity = 0.25;
      newWeight = 2.0;
    }

    layer.setStyle({
      weight: newWeight,
      opacity: newOpacity,
      color: newColor,
      fillOpacity: newFillOpacity,
      fillColor: newColor
    });
    if (!L.Browser.ie && !L.Browser.opera) {
      layer.bringToFront();
    }
  };

  const resetHighlightCountry = (event: LeafletEvent) => {
    setCountryStyle(event.target, currentZoomLevel, false);
  };

  const zoomToFeature = (event: LeafletEvent) => {
    // pad fitBounds() so features aren't hidden under the Filter UI element
    const fitBoundsParams = {
      paddingTopLeft: [10, 10] as PointTuple,
      paddingBottomRight: [10, 10] as PointTuple
    };
    // set the map's center & zoom so that it fits the geographic extent of the layer
    map?.fitBounds(event.target.getBounds(), fitBoundsParams);
  };

  // This gets called once *per country* when the countries3a.json file is loaded.
  const countriesOnEachFeature = (feature: Feature<Geometry, IPropertiesCountry>, layer: L.Layer) => {
    layer.bindTooltip(`<div><span>${feature.properties.NAME}</span>: ${feature.properties.data}</div>`, { sticky: true });

    let tempObj: IGeoJsonCountryFeatures = {
      properties: { NAME: "", NAME_LONG: "", FIPS_10_: "", FORMAL_EN: "", SOVEREIGNT: "",
        ABBREV: "", POSTAL: "", CONTINENT: "", SUBREGION: "", data: 0},
      geometry: { type: "", coordinates: [] },
      type: ""
    };
    tempObj.properties.NAME = feature.properties.NAME;
    tempObj.properties.FIPS_10_ = feature.properties.FIPS_10_; // 2 chars
    tempObj.properties.FORMAL_EN = feature.properties.FORMAL_EN;
    tempObj.properties.SOVEREIGNT = feature.properties.SOVEREIGNT;
    tempObj.properties.ABBREV = feature.properties.ABBREV;
    tempObj.properties.POSTAL = feature.properties.POSTAL;
    tempObj.properties.CONTINENT = feature.properties.CONTINENT;
    tempObj.properties.SUBREGION = feature.properties.SUBREGION;
    tempObj.properties.data = feature.properties.data;
    geoData.push(tempObj);

    layer.on({
      mouseover: highlightFeatureCountry,
      mouseout: resetHighlightCountry,
      click: zoomToFeature
    });
  }

  const fetchData = React.useCallback(async (
    metric: string,
    endTime: number,
  ) => {
    const dbResults = await getOneMetric(metric, endTime);
    // console.log("one metric result = ", dbResults);

    // We need to find the max/min values of the data so we can scale the color range right.
    min = Number.MAX_VALUE;
    max = 0;

    // We store the data in the country properties. Find the max/min also.
    for (const oneCountry of typedCountryData.features) {
      for (const oneDbResult of dbResults) {
        if (oneDbResult.iso_code === oneCountry?.properties?.ISO_CODE) {
          oneCountry.properties.data = (oneDbResult as any)[metric]; // force that property into data
        }
        min = Math.min(min, (oneDbResult as any)[metric]);
        max = Math.max(max, (oneDbResult as any)[metric]);    
      }
    }

    // Create layer overlay for countries -------------------------------
    countriesLayer = L.geoJSON(typedCountryData, {
      style : countriesStyle as StyleFunction, // don't need to call this per country, apply later to whole layer
      onEachFeature: countriesOnEachFeature,
      pane: "countriesPane"
    });
    if (countriesLayer) {
      ourLayerGroup?.addLayer(countriesLayer);
    }
  }, []);

  React.useEffect(() => {
    if (props.metric) {
      fetchData(props.metric, endTime);
    }
  }, [props.metric, props.metric2, props.location, props.location2,
      startTime, endTime, fetchData]);

  React.useEffect(() => {
    if (mapRef.current) {
      if (!map) {
        init(mapRef.current);
        const mainLayerGroup = L.featureGroup(); // create a group layer object
        ourLayerGroup = mainLayerGroup;
        mainLayerGroup?.addTo(mapRef.current);
        // could add esriNatGeo basemapLayer here
      }
    }
  }, [mapRef.current, map]);

  const init = (id: L.Map | null) => {
    if (map || !id) return;

    // this function creates the Leaflet map object and is called after the Map component mounts
    const leafletMap = id;

    // set our state to include the tile layer
    setMap(id);

    // a TileLayer is used as the "basemap"
    setBaseMap(basemapLayer("Topographic", config.tileLayer.params).addTo(leafletMap));

    const ele1 = leafletMap.createPane("countiesPane");
    ele1.style.zIndex = "641"; // set below state until zoom > 6
    const ele2 = leafletMap.createPane("statesPane");
    ele2.style.zIndex = "645";
    const ele3 = leafletMap.createPane("countriesPane");
    ele3.style.zIndex = "640";

    leafletMap.fitBounds(config.params.imageBounds);
    leafletMap.on("zoomend", (event: LeafletEvent) => {
      leafletMap.getZoom();
    });
  }

  // event.target is the layer
  const highlightFeatureCountry = (event: LeafletEvent) => {
    setCountryStyle(event.target, currentZoomLevel, true);
    if (!L.Browser.ie && !L.Browser.opera) {
      event.target.bringToFront();
    }
  };


  const getColor = (d: number): string => {
    // If max < 10**6, do linear ranges
    if (max < 1_000_000) {
      const gap = (max - min)/ 9; // 9 steps
      return d > (max - gap*1) ? '#7F0000' :
             d > (max - gap*2) ? '#B30000' :
             d > (max - gap*3) ? '#D7301F' :
             d > (max - gap*4) ? '#EF6548' :
             d > (max - gap*5) ? '#FC8D59' :
             d > (max - gap*6) ? '#FDBB84' :
             d > (max - gap*7) ? '#FDD49E' :
             d > (max - gap*8) ? '#FEE8C8' :
                                 '#FFF7EC';
    } else { // do logarithmic ranges
      return d > 100_000_000   ? '#7F0000' :
             d > 10_000_000    ? '#B30000' :
             d > 1_000_000     ? '#D7301F' :
             d > 100_000       ? '#EF6548' :
             d > 10_000        ? '#FC8D59' :
             d > 1_000         ? '#FDBB84' :
             d > 100           ? '#FDD49E' :
             d > 10            ? '#FEE8C8' :
                                 '#FFF7EC';
    }
  }

  return (
      <MapContainer center={center} zoom={2} scrollWheelZoom={false} ref={mapRef}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <GeoJSON style={geoStyle} data={typedStatesData} />
        
      </MapContainer>
    );
};

export default CustomMap;
