var map = L.map('map').setView([40.022311, -82.964843], 12.4);
map.createPane('route').style.zIndex=400;
map.createPane('stops').style.zIndex=500;
map.createPane('bus').style.zIndex=600;
map.createPane('toggle').style.zIndex=300;

L.tileLayer('https://api.maptiler.com/maps/darkmatter/{z}/{x}/{y}.png?key=hMJiBNueytGePGg1CnxE',{
  tileSize: 512,
  zoomOffset: -1,
  minZoom: 12,
  attribution: '<a href="https://www.maptiler.com/copyright/" target="_blank">© MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">© OpenStreetMap contributors</a>',
  crossOrigin: true
}).addTo(map);

var infoText = L.control({position: 'topright'});

infoText.onAdd = function (map) {
	var div = L.DomUtil.create('div', 'infoText');
    div.innerHTML += "Explore healthcare and<br> job accessbility through the<br> <b>Songs of the 614</b>.<br>"+
                    "<br>Watch and listen as the<br> bus travels along the CMAX<br> route into downtown Columbus."
                     ;
	return div;
};

infoText.addTo(map);

var audPlayer = L.control({position: 'topright'});

audPlayer.onAdd = function (map) {
	var div = L.DomUtil.create('div', 'audPlayer');
    div.innerHTML += "<i id=\"playHealth\" class=\"fa fa-play\"></i> Hey, Healthcare!<br>"+
                     "<i id=\"playJob\" class=\"fa fa-play\"></i> Hey, Jobs!";
	return div;
};

audPlayer.addTo(map);

var cmaxRoute = [{
	"type": "LineString",
	"coordinates": [ [ -82.95201, 40.07240 ], [ -82.95278, 40.061996 ], [ -82.95379, 40.04981 ], [ -82.95390, 40.04940 ], [-82.960049, 40.042897], [ -82.960310, 40.042497 ], [ -82.96343, 40.03539 ], [ -82.963617, 40.0344512 ], [-82.963817, 40.033700], [-82.964202, 40.029507], [ -82.96517, 40.01737 ], [ -82.96530, 40.01699 ], [ -82.965829, 40.016194 ], [ -82.968457, 40.012003 ], [ -82.969453, 40.010317 ], [ -82.970034, 40.009443 ], [ -82.969999, 40.009505 ], [ -82.971945, 40.006256 ], [ -82.973051, 40.004529 ], [ -82.973986, 40.002959 ], [-82.976975, 39.998341], [-82.977296, 39.997884], [-82.984231, 39.991338], [-82.985371, 39.990130], [-82.987965, 39.987666], [-82.989146, 39.986437], [-82.990238, 39.971973], [-82.990395, 39.970710], [-82.990436, 39.969816], [-82.990552, 39.968587], [-82.993139, 39.968649], [-82.998450, 39.968895], [-82.999760, 39.969086], [-82.999965, 39.969181], [-83.000927, 39.969127], [-83.001330, 39.969106], [-83.001965, 39.969031], [-83.00113, 39.96467], [-83.00067, 39.96226] ] 
}];

var routeStyle = {
	"color": "#87fbff",
	"weight": 5,
	"opacity": 1
};

L.geoJSON(cmaxRoute, {
  style: routeStyle,
  pane: 'route'
}).addTo(map);

L.geoJSON([cmaxStops], {
  style : function(feature) {
      return feature.properties && feature.properties.style;
  },
  pointToLayer : function(feature, latlng) {
      return L.circleMarker(latlng, {
          radius : 4,
          fillColor : "#faf8a0",
          color : "#000",
          weight : 1,
          opacity : 5,
          fillOpacity : 0.8,
          pane: 'stops'
      }).bindTooltip(feature.properties.Stop_Name, {
        permanent: false,
        opacity: 0.9,
        direction: 'right',
        className: 'labelCSS'
      });
  }
}).addTo(map)
.openTooltip();


function highlightFeature(e) {
	var layer = e.target;

	layer.setStyle({
		weight: 5,
		color: '#ffffff',
		dashArray: '',
		fillOpacity: 0.7
	});
	if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
    layer.bringToFront();
	}
}

function resetHighlight(e) {
  if (selectedBaseLayer == "Healthcare Facilities")
    healthDataLayer.resetStyle(e.target);
  else if (selectedBaseLayer == "Jobs<br>Within 400ft of CMAX Stops")
    jobDataLayer.resetStyle(e.target);
}

function onEachFeature(feature, layer) {
	layer.on({
		mouseover: highlightFeature,
		mouseout: resetHighlight
	});
}

var healthData = L.layerGroup();

function healthgetColor(d) {
	return d > 30 ? '#15400e' :
	       d > 20 ? '#235e1a' :
	       d > 10 ? '#37732e' :
	       d > 4  ? '#54944a' :
	       d > 3  ? '#78b56e' :
	       d > 2  ? '#9bd492' :
	       d > 1  ? '#b8f0af' :
                  '#d9fad4';
}

function healthStyle(feature) {
	return {
		fillColor: healthgetColor(feature.properties.All),
		weight: 0.5,
		opacity: 1,
    color: 'white',
		fillOpacity: 0.7
	};
}

var healthDataLayer = L.geoJSON([healthGeojson], {
  style: healthStyle,
  pane: 'toggle',
  onEachFeature: onEachFeature
}).bindTooltip((layer) => {
  return layer.feature.properties.All + " healthcare facilities";
}, {permanent: false, opacity: 0.9, className: 'tooltipCSS'}).addTo(healthData);

var jobsData = L.layerGroup();

function jobgetColor(d) {
	return d > 5200 ? '#8f5600' :
	       d > 2500 ? '#8a5a12' :
	       d > 1200 ? '#b06f0c' :
	       d > 650  ? '#ba7b1c' :
	       d > 100  ? '#db942a' :
	       d > 50   ? '#e0a348' :
	       d > 1    ? '#f2bc6b' :
	                  '#ffd391';
}

function jobStyle(feature) {
	return {
		fillColor: jobgetColor(feature.properties.C000),
		weight: 0.5,
		opacity: 1,
    color: 'white',
		fillOpacity: 0.7
	};
}
var jobDataLayer = L.geoJSON([jobGeojson], {
  style: jobStyle,
  pane: 'toggle',
  onEachFeature: onEachFeature
}).bindTooltip((layer) => {
  return layer.feature.properties.C000 + " jobs";
}, {permanent: false, opacity: 0.9, className: 'tooltipCSS'}).addTo(jobsData);

var overlayData = {
  "Healthcare Facilities": healthData,
  "Jobs<br>Within 400ft of CMAX Stops": jobsData,
  "None": L.layerGroup()
};

var layerControl = L.control.layers(overlayData).addTo(map);



var defaultBaseLayer = "None";
overlayData[defaultBaseLayer].addTo(map); // default to no overlay

var selectedBaseLayer = defaultBaseLayer;
map.on('baselayerchange', function (e) {
  selectedBaseLayer = e.name; 
});

//Job

var jobIcon = L.icon({
  iconUrl: 'img/jobBus.png',
  iconAnchor: [25, 50]
});

var jobBus = L.Marker.movingMarker([ [ 40.07240, -82.95201 ], [40.07241, -82.9521], [ 40.061996, -82.95278 ], [ 40.04981, -82.95379 ], [ 40.04940, -82.95390 ], [40.042897, -82.960049], [ 40.042497, -82.960310 ], [ 40.03539, -82.96343 ], [ 40.0344512, -82.963617 ], [40.033700, -82.963817], [ 40.0313, -82.96403], [40.029507, -82.964202], [ 40.01737, -82.96517 ], [ 40.01699, -82.96530 ], [ 40.016194, -82.965829 ], [ 40.012003, -82.968457 ], [ 40.010317, -82.969453 ], [ 40.009443, -82.970034 ], [ 40.009505, -82.969999 ], [ 40.006256, -82.971945 ], [ 40.004529, -82.973051 ], [ 40.002959, -82.973986 ], [39.998341, -82.976975], [39.997884, -82.977296], [39.99373, -82.98167], [39.991338, -82.984231], [39.990130, -82.985371], [39.987666, -82.987965], [39.986437, -82.989146], [39.971973, -82.990238], [39.970710, -82.990395], [39.969816, -82.990436], [39.968587, -82.990552], [39.968649, -82.993139], [39.968895, -82.998450], [39.969086, -82.999760], [39.969181, -82.999965], [39.969127, -83.000927], [39.969106, -83.001330], [39.969031, -83.001965], [39.96467, -83.00113], [ 39.96223, -83.00064 ], [39.96226, -83.00067] ],
  126000, {
    icon: jobIcon,
    pane: 'bus'
  }).addTo(map);
  jobBus.addStation(1, 37000);
  jobBus.addStation(10, 18000);
  jobBus.addStation(24, 14000);

var jobAud = new Audio();
jobAud.src = 'audio/HeyJobs.mp3'


var playingJobs = false;
$("#playJob").click(function() {
  if (playingJobs) {
    jobAud.pause();
    jobBus.pause();
    playingJobs = false;
  } else {
    jobAud.play();
    jobBus.start();
    playingJobs = true;
    if (playingHealth) {
      healthAud.pause();
      healthBus.pause();
      playingHealth = false;
      $("#playHealth").toggleClass('fa-pause fa-play');
    }
  }
  $("#playJob").toggleClass('fa-pause fa-play');
});

// Health

var healthIcon = L.icon({
  iconUrl: 'img/healthBus.png',
  iconAnchor: [25, 50]
});

var healthBus = L.Marker.movingMarker([ [ 40.07240, -82.95201 ], [40.07241, -82.9521], [ 40.061996, -82.95278 ], [ 40.04981, -82.95379 ], [ 40.04940, -82.95390 ], [40.042897, -82.960049], [ 40.042497, -82.960310 ], [ 40.03539, -82.96343 ], [ 40.0344512, -82.963617 ], [40.033700, -82.963817], [ 40.0313, -82.96403], [40.029507, -82.964202], [ 40.01737, -82.96517 ], [ 40.01699, -82.96530 ], [ 40.016194, -82.965829 ], [ 40.012003, -82.968457 ], [ 40.010317, -82.969453 ], [ 40.009443, -82.970034 ], [ 40.009505, -82.969999 ], [ 40.006256, -82.971945 ], [ 40.004529, -82.973051 ], [ 40.002959, -82.973986 ], [39.998341, -82.976975], [39.997884, -82.977296], [39.99373, -82.98167], [39.991338, -82.984231], [39.990130, -82.985371], [39.987666, -82.987965], [39.986437, -82.989146], [39.971973, -82.990238], [39.970710, -82.990395], [39.969816, -82.990436], [39.968587, -82.990552], [39.968649, -82.993139], [39.968895, -82.998450], [39.969086, -82.999760], [39.969181, -82.999965], [39.969127, -83.000927], [39.969106, -83.001330], [39.969031, -83.001965], [39.96467, -83.00113], [ 39.96223, -83.00064 ], [39.96226, -83.00067] ],
  133000, {
    icon: healthIcon,
    pane: 'bus'
  }).addTo(map);
  healthBus.addStation(1, 37000);
  healthBus.addStation(10, 20000);
  healthBus.addStation(24, 16000);

var healthAud = new Audio();
healthAud.src = 'audio/HeyHealthcare.mp3';

var jobsAud = new Audio();
jobsAud.src = "audio/HeyJobs.mp3";

var playingHealth = false;
$("#playHealth").click(function() {
  if (playingHealth) {
    healthAud.pause();
    healthBus.pause();
    playingHealth = false;
  } else {
    healthAud.play();
    healthBus.start();
    playingHealth = true;
    if (playingJobs) {
      jobAud.pause();
      jobBus.pause();
      playingJobs = false;
      $("#playJob").toggleClass('fa-pause fa-play');
    }
  }
  $("#playHealth").toggleClass('fa-pause fa-play');
});
