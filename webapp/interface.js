//Firebase configuration object
const firebaseConfig = {
        apiKey: "AIzaSyAe6JeKYjP5Q_zh689Rpn8dkARC3RCCEIk",
        authDomain: "gmssystem-4e138.firebaseapp.com",
        databaseURL: "https://gmssystem-4e138-default-rtdb.firebaseio.com",
        projectId: "gmssystem-4e138",
        storageBucket: "gmssystem-4e138.appspot.com",
        messagingSenderId: "952165713843",
        appId: "1:952165713843:web:7f7f7c22929d1760b72dc6",
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const database = firebase.database();
// Add event listener to "Add Bin" button
var addBinBtn = document.getElementById("addBin");
addBinBtn.addEventListener("click", function () {
        // Display the form
        var binForm = document.getElementById("binForm");
        binForm.classList.remove("hidden");
});
document.getElementById("logout").addEventListener("click", function () {
        window.location.href = "index.html";
});
// Add event listener to bin form submit button
var binForm = document.getElementById("binForm");
binForm.addEventListener("submit", function (event) {
        event.preventDefault();
        // Get the values from the form
        var binID = document.getElementById("binID").value;
        var latitude = document.getElementById("latitude").value;
        var longitude = document.getElementById("longitude").value;
        var fill = document.getElementById("fill").value;
        var weight = document.getElementById("weight").value;
        // Add the bin details to the database
        database.ref("Bins/Bin" + binID).set({
                Fill: fill,
                Weight: weight,
                ID: binID,
                latitude: latitude,
                longitude: longitude,
        });
        // Hide the form
        binForm.classList.add("hidden");
});

// Create a Leaflet map
const map = L.map("map");

// Fetch the Bins data from Firebase
database
        .ref("Bins")
        .once("value")
        .then((binsSnapshot) => {
                const bins = [];
                binsSnapshot.forEach((childSnapshot) => {
                        const binData = childSnapshot.val();
                        bins.push(binData);
                });
                // Calculate the center and zoom level of the map based on the Bins coordinates
                const bounds = L.latLngBounds(
                        bins.map((bin) => L.latLng(bin.latitude, bin.longitude))
                );
                map.fitBounds(bounds);
                // Add a tile layer to the map
                const tileLayer = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
                        {
                                attribution:"Mapdata &copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors", maxZoom: 16,
                        }
                        ).addTo(map);
                        })
        .catch((error) => {
                console.error(error);
});
                        var closeFormBtn = document.getElementById("closeForm");
                        closeFormBtn.addEventListener("click", function () {
                                var binForm = document.getElementById("binForm");
                                binForm.classList.add("hidden");
                        });


// Function to fetch data from Firebase
const getDataFromFirebase = async (binId) => {
        try {
                const snapshot = await database.ref(`Bins/${binId}`).once("value");
                const data = snapshot.val();
                return data;
        } catch (error) {
                console.error("Error fetching data from Firebase:", error);
                return null;
        }
};
                        // Function to display data in the marker popup
                        const displayDataInPopup = (marker, data) => {
                                if (data) {
                                        let popupContent = "";
                                        if (data.ID === "BASE") {
                                                popupContent = "<h2>BASE</h2>";
                                        } else if (data.ID === "DUMP") {
                                                popupContent = "<h2>DUMP</h2>";
                                        } else {
                                                popupContent = `<h2>Fill Level: ${data.Fill}%</h2>
                                                                <h4>Garbage Weight: ${data.Weight} g</h4>
                                                                <h4>Bin ID: ${data.ID}</h4>`;
                                        }
                                        marker.bindPopup(popupContent).openPopup();
                                } else {
                                        marker.bindPopup("No data available").openPopup();
                                }
                        };


// Add markers for all bins in the database
const binsRef = database.ref("Bins");
binsRef.on("value", (snapshot) => {
        snapshot.forEach((childSnapshot) => {
                const binId = childSnapshot.key;
                const data = childSnapshot.val();
                const coord = [data.latitude, data.longitude];
                const fill = data.Fill;
                let markerColor = "blue";
                if (fill >= 80) {
                        markerColor = "red";
                }
                if (fill > 60 && fill < 80) {
                        markerColor = "orange";
                }
                if (data.ID === "BASE") {
                        markerColor = "green";
                } else if (data.ID === "DUMP") {
                        markerColor = "green";
                }
                const marker = L.marker(coord, {
                        icon: L.icon({
                                iconUrl: `./marker-icons/marker-icon-2x-${markerColor}.png`,
                                iconSize: [25, 41],
                                iconAnchor: [12, 41],
                                popupAnchor: [1, -34],
                                shadowSize: [41, 41],
                        }),
                }).addTo(map);
                marker.on("click", async () => {
                        const data = await getDataFromFirebase(binId);
                        displayDataInPopup(marker, data);
                });
        });
});
let control;
let polyline;
document.getElementById("shortestRoute").addEventListener("click", async () => {
        if (control) {
                // Remove previous route if any
                map.removeControl(control);
                control = null;
        }
        if (polyline) {
                // Remove previous route if any
                map.removeLayer(polyline);
                polyline = null;
        } else {
                const binsSnapshot = await database.ref("Bins").once("value");
                const bins = [];
                binsSnapshot.forEach((childSnapshot) => {
                        const binData = childSnapshot.val();
                        if (binData.Fill >= 80 || binData.ID === "BASE") {
                                bins.push(binData);
                        }
                });
                // Fetch data for BASE from Firebase
                const baseSnapshot = await database.ref("Bins/BASE").once("value");
                const baseData = baseSnapshot.val();
                // Calculate the shortest route using leaflet-routing-machine
                const waypoints = [L.latLng(baseData.latitude, baseData.longitude)]; // BASE as the first waypoint
                waypoints.push(...bins.map((bin) => L.latLng(bin.latitude, bin.longitude)));
                waypoints.push(L.latLng(baseData.latitude, baseData.longitude)); // BASE as the last waypoint
                control = L.Routing.control({
                        waypoints: waypoints,
                        routeWhileDragging: false,
                        show: false,
                        addWaypoints: false,
                        lineOptions: {
                                styles: [{ color: "black", opacity: 1, weight: 5 }],
                        },
                        createMarker: function () {
                                return null;
                        }, // Hide route markers
                }).addTo(map);
                control.on("routesfound", function (e) {
                        const routes = e.routes;
                        const shortestRoute = routes.reduce((prev, current) => {
                                return prev.summary.totalDistance < current.summary.totalDistance
                                        ? prev
                                        : current;
                        });
                        // Display the calculated route on the map
                        const coordinates = shortestRoute.coordinates;
                        polyline = L.polyline(coordinates, {
                                color: "blue",
                                opacity: 0.6,
                                weight: 5,
                        }).addTo(map);
                });
                control.route();
        }
});
