var map = L.map('map').setView([40.022311, -82.964843], 12.4);
map.createPane('route').style.zIndex = 400;
map.createPane('stops').style.zIndex = 500;
map.createPane('bus').style.zIndex = 600;
map.createPane('SA').style.zIndex = 400;
map.createPane('heat').style.zIndex = 100;

L.tileLayer('https://api.maptiler.com/maps/pastel/{z}/{x}/{y}.png?key=hMJiBNueytGePGg1CnxE', {
    tileSize: 512,
    zoomOffset: -1,
    minZoom: 1,
    attribution: '<a href="https://www.maptiler.com/copyright/" target="_blank">© MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">© OpenStreetMap contributors</a>',
    crossOrigin: true
}).addTo(map);


//Main control with audio player


var healthAud = new Audio();
healthAud.src = 'audio/HeyHealthcare.mp3';

var jobAud = new Audio();
jobAud.src = "audio/HeyJobs.mp3";

var audPlayer = L.control({
    position: 'topleft'
});

audPlayer.onAdd = function(map) {
    var div = L.DomUtil.create('div', 'audPlayer');

    div.innerHTML += "Play the <b>Songs of the 614</b><br>below to watch the CMAX bus<br>run along Cleveland Ave.<br><br>Explore healthcare or job<br>accessibility along the way.<br><br>" +
        "<i id=\"playHealth\" class=\"fa fa-play\"></i> Hey, Healthcare!<br>" +
        "<i id=\"playJob\" class=\"fa fa-play\"></i> Hey, Jobs!";
    return div;
};

audPlayer.addTo(map);


//CMAX route setup


var routeStyle = {
    "color": "#469D96",
    "weight": 7
};

L.geoJSON(cmaxRoute, {
    style: routeStyle,
    pane: 'route'
}).addTo(map);


//CMAX stops setup


L.geoJSON([cmaxStops], {
        style: function(feature) {
            return feature.properties && feature.properties.style;
        },
        pointToLayer: function(feature, latlng) {
            return L.circleMarker(latlng, {
                radius: 4,
                fillColor: "#FFFFFF",
                color: "#000",
                weight: 1,
                fillOpacity: 1,
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


//Get health and job service area coordinates into right format, create heatmaps


let healthCoords = [];
for (let feature of health_in_SA["features"]) {
    let pos = feature.geometry.coordinates;
    healthCoords.push({
        lat: pos[1],
        lng: pos[0]
    });
}

let jobCoords = [];
for (let feature of jobs_in_SA["features"]) {
    let pos = feature.geometry.coordinates;
    //let emp_num = feature.properties['Employee_Size__5____Location']
    jobCoords.push({
        lat: pos[1],
        lng: pos[0],
    //    intensity: emp_num
    })
}

var healthHeat = L.heatLayer(healthCoords, {
    pane: 'heat'
});

var jobHeat = L.heatLayer(jobCoords, {
    pane: 'heat',
//    max: 20000
});


//Bus markers setup


var healthIcon = L.icon({
    iconUrl: 'img/newhealthBus.png',
    iconAnchor: [53, 92]
});

var jobIcon = L.icon({
    iconUrl: 'img/newjbus.png',
    iconAnchor: [53, 92]
});

var healthBus = L.Marker.movingMarker(
    busRoute,
    133000, { //Duration of entire movement along route
        icon: healthIcon,
        pane: 'bus'
    });
healthBus.addStation(1, 37000); //Index of coordinate to stop at, Duration at each stop
healthBus.addStation(10, 20000);
healthBus.addStation(24, 16000);

var jobBus = L.Marker.movingMarker(
    busRoute,
    120000, { 
        icon: jobIcon,
        pane: 'bus'
    });
jobBus.addStation(1, 37000); 
jobBus.addStation(10, 19000);
jobBus.addStation(24, 15000);


//Factoid popups

var blurbCoords = [
    [40.07239914, -82.95200348],
    [40.05953, -82.95301],
    [40.0313, -82.96403],
    [40.029507, -82.964202],
    [39.99373, -82.98167],
    [39.991338, -82.984231],
    [39.96223, -83.00064]
]

var r = 0.0005

const fact = L.control({
    position: 'topright'
});

function updateBlurb(str) {
    fact.remove();
    fact.onAdd = function(map) {
        var div = L.DomUtil.create('div', 'busText');
        div.innerHTML += str;
        return div;
    }
    fact.addTo(map);
}

function removeBlurb() {
    fact.remove();
}

const healthBlurbs = function() {
    if (healthBus.getLatLng().equals(new L.LatLng(blurbCoords[0][0], blurbCoords[0][1]), r)) {
        updateBlurb("As the bus moves along the CMAX route,<br>notice how the intensity of the song relates<br>"
                    + "to the intensity of the healthcare accessibility<br>heatmap.<br>"
                    + "<br>Accessiblity is measured by how many<br>healthcare facilities are within 20 min<br>of each CMAX"
                    + " bus stop by either walking<br>or taking a different COTA bus.<br>"
                    + "<br>This twenty minute area is shown<br>by the black outlined polygons.<br>"
                    + "Hover over the white dots<br> to see which stop is at that location.");
    }
    if (healthBus.getLatLng().equals(new L.LatLng(blurbCoords[1][0], blurbCoords[1][1]), r)) {
        removeBlurb();
    }
    if (healthBus.getLatLng().equals(new L.LatLng(blurbCoords[2][0], blurbCoords[2][1]), r)) {
        updateBlurb("Something here");
    }
    if (healthBus.getLatLng().equals(new L.LatLng(blurbCoords[3][0], blurbCoords[3][1]), r)) {
        removeBlurb();
    }
    if (healthBus.getLatLng().equals(new L.LatLng(blurbCoords[4][0], blurbCoords[4][1]), r)) {
        updateBlurb("Something here");
    }
    if (healthBus.getLatLng().equals(new L.LatLng(blurbCoords[5][0], blurbCoords[5][1]), r)) {
        removeBlurb();
    }
    if (healthBus.getLatLng().equals(new L.LatLng(blurbCoords[6][0], blurbCoords[6][1]), r)) {
        updateBlurb("Something here");
    }
};

const jobBlurbs = function() {
    if (jobBus.getLatLng().equals(new L.LatLng(blurbCoords[0][0], blurbCoords[0][1]), r)) {
        updateBlurb("As the bus moves along the CMAX route,<br>notice how the intensity of the song relates<br>"
                    + "to the intensity of the job heatmap.<br>"
                    + "<br>Accessiblity is measured by how many<br>jobs are within 20 min of each<br>CMAX"
                    + " bus stop by either walking<br>or taking a different COTA bus.<br>"
                    + "<br>This twenty minute area is shown<br>by the black outlined polygons.<br>"
                    + "Hover over the white dots<br> to see which stop is at that location.");
    }
    if (jobBus.getLatLng().equals(new L.LatLng(blurbCoords[1][0], blurbCoords[1][1]), r)) {
        removeBlurb();
    }
    if (jobBus.getLatLng().equals(new L.LatLng(blurbCoords[2][0], blurbCoords[2][1]), r)) {
        updateBlurb("Something Here");
    }
    if (jobBus.getLatLng().equals(new L.LatLng(blurbCoords[3][0], blurbCoords[3][1]), r)) {
        removeBlurb();
    }
    if (jobBus.getLatLng().equals(new L.LatLng(blurbCoords[4][0], blurbCoords[4][1]), r)) {
        updateBlurb("Something Here");
    }
    if (jobBus.getLatLng().equals(new L.LatLng(blurbCoords[5][0], blurbCoords[5][1]), r)) {
        removeBlurb();
    }
    if (jobBus.getLatLng().equals(new L.LatLng(blurbCoords[6][0], blurbCoords[6][1]), r)) {
        updateBlurb("Something Here");
    }
};


//Actions while songs are playing


var playingHealth = false;
var healthServiceAreas;
var healthBlurb;
$("#playHealth").click(function() {
    if (playingHealth) {
        healthBus.remove();
        healthHeat.remove();
        healthAud.pause();
        healthBus.pause();
        playingHealth = false;
        for (var i = 0; i < cmaxStops.features.length; i++) {
            areas[0][i].remove();
        }
        clearInterval(healthServiceAreas);
        clearInterval(healthBlurb);
        removeBlurb();
    } else {
        healthBus.addTo(map);
        healthHeat.addTo(map);
        healthAud.play();
        healthBus.start();
        
        healthServiceAreas = setInterval(function() {
            var n = 0;
            for (c of cmaxStops.features) {
                if (healthBus.getLatLng().equals(new L.LatLng(c.geometry.coordinates[1], c.geometry.coordinates[0]), r)) {        
                    areas[0][n].addTo(map);
                    if (n != 0) {
                        areas[0][n-1].remove();
                }};
                n++;
            }}, 500);

        healthBlurb = setInterval(healthBlurbs, 500);
        playingHealth = true;
        
        if (playingJobs) {
            jobBus.remove();
            jobHeat.remove();
            jobAud.pause();
            jobBus.pause();
             for (var i = 0; i < cmaxStops.features.length; i++) {
                areas[0][i].remove();
            }
            clearInterval(jobServiceAreas);
            clearInterval(jobBlurb);
            removeBlurb();
            playingJobs = false;
            $("#playJob").toggleClass('fa-pause fa-play');
        }
    }
    $("#playHealth").toggleClass('fa-pause fa-play');
});

var playingJobs = false;
var jobServiceAreas;
var jobBlurb;
$("#playJob").click(function() {
    if (playingJobs) {
        jobBus.remove();
        jobHeat.remove();
        jobAud.pause();
        jobBus.pause();
        playingJobs = false;
        for (var i = 0; i < cmaxStops.features.length; i++) {
            areas[0][i].remove();
        }
        clearInterval(jobServiceAreas);
        clearInterval(jobBlurb);
        removeBlurb();
    } else {
        jobBus.addTo(map);
        jobHeat.addTo(map);
        jobAud.play();
        jobBus.start();

        jobServiceAreas = setInterval(function() {
            var n = 0;
            for (c of cmaxStops.features) {
                if (jobBus.getLatLng().equals(new L.LatLng(c.geometry.coordinates[1], c.geometry.coordinates[0]), r)) {
                    areas[0][n].addTo(map);
                    if (n != 0) {
                        areas[0][n-1].remove();
                    }};
                n++;
            }}, 500);

        jobBlurb = setInterval(jobBlurbs, 500);
        playingJobs = true;
        
        if (playingHealth) {
            healthBus.remove();
            healthHeat.remove();
            healthAud.pause();
            healthBus.pause();
            for (var i = 0; i < cmaxStops.features.length; i++) {
                areas[0][i].remove();
            }
            clearInterval(healthServiceAreas);
            clearInterval(healthBlurb);
            removeBlurb();
            playingHealth = false;
            $("#playHealth").toggleClass('fa-pause fa-play');
        } }
    $("#playJob").toggleClass('fa-pause fa-play');
});