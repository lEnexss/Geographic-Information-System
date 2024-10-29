import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { DataService } from '../../services/data.service';
import { FeatureCollection, Feature } from 'geojson';
import * as L from 'leaflet';
import GeoRasterLayer from 'georaster-layer-for-leaflet';
import * as parse_georaster from 'georaster'; // needs file modules.d.ts with module declaration
import * as d3 from 'd3';


@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
}) 
export class MapComponent implements OnInit, OnChanges {

  @Input()
  miningBuffer: number = 0;

  @Input()
  ethnicGroupSenegal: number = 1;
  @Input()
  ethnicGroupCongo: number = 1;
  @Input()
  ethnicGroupKenya: number = 1;

  @Input()
  typeOfViolence: number = 1;

  private map!: L.Map;
  //
  private layersControl!: L.Control.Layers;
  private baseLayers: { [key: string]: L.TileLayer } = {};
  private overlayLayers: { [key: string]: L.Layer } = {};

  private bufferDistances: any[] = [undefined, undefined, undefined, undefined];
  private ethnicitySenegal: any[] = [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined];
  private ethnicityCongo: any[] = [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined];
  private ethnicityKenya: any[] = [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined];
  private conflictLayers: any[] = [undefined, undefined, undefined];
  //
  isLoading: boolean = true;
  colorScaleOn: boolean = false;

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.initializeMap();
    // load ethnicity rasters for each ethnicity
    this.loadEthnicDataCongo(1);
    this.loadEthnicDataCongo(2);
    this.loadEthnicDataCongo(3);
    this.loadEthnicDataCongo(4);
    this.loadEthnicDataCongo(5);
    this.loadEthnicDataCongo(6);
    this.loadEthnicDataCongo(7);
    this.loadEthnicDataCongo(8);
    this.loadEthnicDataSenegal(22);
    this.loadEthnicDataSenegal(23);
    this.loadEthnicDataSenegal(24);
    this.loadEthnicDataSenegal(25);
    this.loadEthnicDataSenegal(26);
    this.loadEthnicDataSenegal(27);
    this.loadEthnicDataSenegal(28);
    this.loadEthnicDataSenegal(29);
    this.loadEthnicDataKenya(9);
    this.loadEthnicDataKenya(10);
    this.loadEthnicDataKenya(11);
    this.loadEthnicDataKenya(12);
    this.loadEthnicDataKenya(13);
    this.loadEthnicDataKenya(14);
    this.loadEthnicDataKenya(15);
    this.loadEthnicDataKenya(16);
    this.loadEthnicDataKenya(17);
    this.loadEthnicDataKenya(18);
    this.loadEthnicDataKenya(19);
    this.loadEthnicDataKenya(20);
    this.loadEthnicDataKenya(21);
    // load mining polygons with 0, 3, 5, 10 km buffer
    this.loadMiningData(0);
    this.loadMiningData(3);
    this.loadMiningData(5);
    this.loadMiningData(10);
    // load conflict points for each type of violence
    this.loadConflictData(1);
    this.loadConflictData(2);
    this.loadConflictData(3);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["miningBuffer"]) {
      this.updateMapForBuffer(this.miningBuffer);
    }
    if (changes["ethnicGroupSenegal"]) {
      this.updateMapEthnicitySenegal(this.ethnicGroupSenegal);
    }
    if (changes["ethnicGroupCongo"]) {
      this.updateMapEthnicityCongo(this.ethnicGroupCongo);
    }
    if (changes["ethnicGroupKenya"]) {
      this.updateMapEthnicityKenya(this.ethnicGroupKenya);
    }
    if (changes["typeOfViolence"]) {
      // Call the update method for conflict data
      this.updateMapForConflict(this.typeOfViolence);
    }
  }
  
  updateMapForBuffer(buffer: number): void {
    // Remove all mining layers first
    Object.values(this.bufferDistances).forEach(layer => {
      if (layer && this.map.hasLayer(layer)) {
        this.map.removeLayer(layer);
      }
    });
  
    // If 'no mining area selected', keep it empty
    if (this.bufferDistances[buffer] == -1) {
      this.updateLayersControl();
      return;
    }
    // Add the selected buffer layer if it exists, else load it
    else if (!this.bufferDistances[buffer] && this.bufferDistances[buffer] != -1) {
      this.loadMiningData(buffer);
    } else {
      this.map.addLayer(this.bufferDistances[buffer]);
      this.updateLayersControl();
    }
  }


  updateMapEthnicitySenegal(groupID: number): void {
    // Remove all mining layers first
    Object.values(this.ethnicitySenegal).forEach(layer => {
      if (layer && this.map.hasLayer(layer)) {
        this.map.removeLayer(layer);
      }
    });

    if (this.colorScaleOn == false) {
    this.createColorScale();
    }
  
    // Add the selected buffer layer if it exists, else load it
    if (!this.ethnicitySenegal[groupID]) {
      this.loadEthnicDataSenegal(groupID);
    } else {
      this.map.addLayer(this.ethnicitySenegal[groupID]);
      this.updateLayersControl();
    }
  }



  updateMapEthnicityCongo(groupID: number): void {
    // Remove all mining layers first
    Object.values(this.ethnicityCongo).forEach(layer => {
      if (layer && this.map.hasLayer(layer)) {
        this.map.removeLayer(layer);
      }
    });

    if (this.colorScaleOn == false) {
    this.createColorScale();
    }
  
    // Add the selected buffer layer if it exists, else load it
    if (!this.ethnicityCongo[groupID]) {
      this.loadEthnicDataCongo(groupID);
    } else {
      this.map.addLayer(this.ethnicityCongo[groupID]);
      this.updateLayersControl();
    }
  }

  updateMapEthnicityKenya(groupID: number): void {
    // Remove all mining layers first
    Object.values(this.ethnicityKenya).forEach(layer => {
      if (layer && this.map.hasLayer(layer)) {
        this.map.removeLayer(layer);
      }
    });

    if (this.colorScaleOn == false) {
    this.createColorScale();
    }
  
    // Add the selected buffer layer if it exists, else load it
    if (!this.ethnicityKenya[groupID]) {
      this.loadEthnicDataKenya(groupID);
    } else {
      this.map.addLayer(this.ethnicityKenya[groupID]);
      this.updateLayersControl();
    }
  }

  updateMapForConflict(typeOfViolence: number): void {
    // Ensure all conflict layers are removed first
    this.conflictLayers.forEach((layer, index) => {
      if (layer && this.map.hasLayer(layer)) {
        this.map.removeLayer(layer);
      }
    });
  
    // Load and display the new conflict data
    this.loadConflictData(typeOfViolence);
  
    // Add the layer for the selected type of violence
    const selectedLayer = this.conflictLayers[typeOfViolence - 1];
    if (selectedLayer) {
      this.map.addLayer(selectedLayer);
    }
  }
  

  initializeMap(): void {
    // create map and set initial focus + zoom
    this.map = L.map('map', {preferCanvas: true}).setView([8, 8], 4);
    
    // load various baselayer tiles
    const osmTiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });
    const topoTiles = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.opentopomap.org">OpenTopoMap</a> contributors',
      maxZoom: 17
    });
    const esriTiles = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      attribution: '&copy; Powered by Esri'
    });
    const cartoTiles = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; Carto'
    });

    this.baseLayers = {
      "OSM": osmTiles,
      "Esri (Image)": esriTiles,
      "Topographic": topoTiles,
      "Carto": cartoTiles
    };

    this.baseLayers["Carto"].addTo(this.map);
    this.overlayLayers = {};
    this.layersControl = L.control.layers(this.baseLayers, this.overlayLayers).addTo(this.map);

  }


  loadEthnicDataSenegal(ethnic_group: number): void {
    this.dataService.ethnicDataSenegal(ethnic_group).subscribe((result: ArrayBuffer) => {
      parse_georaster(result).then((georaster: any) => {
        console.log("Fetched Data from backend (real/ethnic):", georaster); // check whether georaster is fine
        const max = 1;
        const min = 0;
        // normalize colours (percentage of ethnic group on total population, therefore 0 to 1)
        const normalize = (values: number[]) => {
            if (values[0] < 0) { // no data is any number below zero, make it invisible
              return '#00000000';
            } else {
              const v = (values[0] - min) / (max - min);
            return d3.interpolatePurples(v);
            }
        }
        const ethniclayerSenegal = new GeoRasterLayer({
          georaster: georaster,
          opacity: 0.8,
          pixelValuesToColorFn: normalize,
          resolution: 256
        });
        
        this.overlayLayers[''] = ethniclayerSenegal;
        this.ethnicitySenegal[ethnic_group] = ethniclayerSenegal;
        this.updateLayersControl();
      });

    });

}


  loadEthnicDataCongo(ethnic_group: number): void {
    this.dataService.ethnicDataCongo(ethnic_group).subscribe((result: ArrayBuffer) => {
      parse_georaster(result).then((georaster: any) => {
        console.log("Fetched Data from backend (real/ethnic):", georaster); // check whether georaster is fine
        const max = 1;
        const min = 0;
        // normalize colours (percentage of ethnic group on total population, therefore 0 to 1)
        const normalize = (values: number[]) => {
            if (values[0] < 0) { // no data is any number below zero, make it invisible
              return '#00000000';
            } else {
              const v = (values[0] - min) / (max - min);
            return d3.interpolatePurples(v);
            }
        }
        const ethniclayerCongo = new GeoRasterLayer({
          georaster: georaster,
          opacity: 0.8,
          pixelValuesToColorFn: normalize,
          resolution: 256
        });

        this.overlayLayers[''] = ethniclayerCongo;
        this.ethnicityCongo[ethnic_group] = ethniclayerCongo;
        this.updateLayersControl();
      });

    });

}


loadEthnicDataKenya(ethnic_group: number): void {
  this.dataService.ethnicDataKenya(ethnic_group).subscribe((result: ArrayBuffer) => {
    parse_georaster(result).then((georaster: any) => {
      console.log("Fetched Data from backend (real/ethnic):", georaster); // check whether georaster is fine
      const max = 1;
      const min = 0;
      // normalize colours (percentage of ethnic group on total population, therefore 0 to 1)
      const normalize = (values: number[]) => {
          if (values[0] < 0) { // no data is any number below zero, make it invisible
            return '#00000000';
          } else {
            const v = (values[0] - min) / (max - min);
          return d3.interpolatePurples(v);
          }
      }
      const ethniclayerKenya = new GeoRasterLayer({
        georaster: georaster,
        opacity: 0.8,
        pixelValuesToColorFn: normalize,
        resolution: 256
      });

      this.overlayLayers[''] = ethniclayerKenya;
      this.ethnicityKenya[ethnic_group] = ethniclayerKenya;
      this.updateLayersControl();
    });

  });

}


createColorScale() {
  const width = 300; // Adjust as needed
  const height = 50; // Adjust as needed

  const svg = d3.select("#color-scale-legend").append("svg")
      .attr("width", width)
      .attr("height", height);

  const gradient = svg.append("defs")
    .append("linearGradient")
      .attr("id", "gradient-purples")
      .attr("x1", "0%")
      .attr("x2", "100%")
      .attr("y1", "0%")
      .attr("y2", "0%");

  d3.range(0, 1, 0.01).forEach(function(num) {
      gradient.append("stop")
          .attr("offset", `${num * 100}%`)
          .attr("stop-color", d3.interpolatePurples(num));
  });

  svg.append("rect")
      .attr("width", width)
      .attr("height", height - 30) // Adjust for labels
      .style("fill", "url(#gradient-purples)");

  svg.append("text")
      .attr("x", 0)
      .attr("y", height)
      .text("0%")
      .attr("font-size", "12px") // Adjust font size as needed
      .attr("fill", "#000"); // Adjust text color as needed

  // Add max label at the end of the gradient
  svg.append("text")
      .attr("x", width)
      .attr("y", height)
      .attr("text-anchor", "end") // Ensures the text aligns right at the end
      .text("100%")
      .attr("font-size", "12px") // Adjust font size as needed
      .attr("fill", "#000"); // Adjust text color as needed
  
  this.colorScaleOn = true
}


loadMiningData(buffer: number): void {
  this.dataService.miningData(buffer).subscribe({
    next: (result: FeatureCollection) => {
      const miningLayer = L.geoJson(result, {
        style: () => ({
          color: 'brown',
          weight: 1,
          opacity: 1,
          fillOpacity: 0.5
        })
      });

      this.bufferDistances[buffer] = miningLayer;
      this.updateLayersControl();

      this.isLoading = false;
    },
    error: (error) => {
      console.error('Error loading mining areas:', error);
    }
  });
}

loadConflictData(typeOfViolence: number): void {
  this.dataService.conflictData(typeOfViolence).subscribe((result: FeatureCollection) => {
    // Check if the layer for this type of violence exists
    if (!this.conflictLayers[typeOfViolence - 1]) {
      // If it doesn't exist, create a new GeoJSON layer for it
      const conflictLayer = L.geoJson(result, {
        onEachFeature: (feature, layer) => {
          const { id, type_of_violence, best, dyad_name } = feature.properties;
          layer.bindPopup(`Number of Deaths: ${best}<br>Conflict Parties: ${dyad_name}`);
        },
        pointToLayer: (feature, latlng) => {
          let color;
          switch (feature.properties.type_of_violence) {
            case 1: color = 'red'; break;
            case 2: color = 'green'; break;
            case 3: color = 'blue'; break;
            default: color = 'gray';
          }
          return L.circleMarker(latlng, {
            radius: 3,
            fillColor: color,
            color: color,
            weight: 1,
            opacity: 1,
            fillOpacity: 0.4
          });
        }
      });

      // Store the layer in the array
      this.conflictLayers[typeOfViolence - 1] = conflictLayer;
    } else {
      // If it exists, just update its data
      this.conflictLayers[typeOfViolence - 1].clearLayers().addData(result);
    }

    // Update the layers control to include this layer if it's not already included
    if (!this.overlayLayers['Conflict Data']) {
      //this.overlayLayers['Conflict Data'] = this.conflictLayers[typeOfViolence - 1];
      this.updateLayersControl();
    }
  });
}



  updateLayersControl(): void {
    // Remove the existing control from the map
    this.layersControl.remove();

    // Create a new layersControl with the updated layers and add it to the map
    this.layersControl = L.control.layers(this.baseLayers, this.overlayLayers).addTo(this.map);
  }


}