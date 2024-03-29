import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import io from "socket.io-client";

const redmark = new L.Icon({
  iconUrl: require("./redmark.png"),
  iconSize: [20, 30],
});
const yellowmark = new L.Icon({
  iconUrl: require("./yellowmark.png"),
  iconSize: [20, 30],
});
const greenmark = new L.Icon({
  iconUrl: require("./greenmark.png"),
  iconSize: [20, 30],
});
const blackmark = new L.Icon({
  iconUrl: require("./blackmark.png"),
  iconSize: [20, 30],
});

const App = () => {
  const [data, setData] = useState([]);
  const position = [28.2096, 83.9856];

  useEffect(() => {
    const socket = io("https://dms2.dhm.gov.np", {
      path: "/gss/socket.io",
    });

    socket.on("connect", () => {
      // recieve a msg from the server
      socket.on("river_test", (data) => {
        setData(data);
      });
      // send a msg to the server
      socket.emit("client_request", "river_test");
    });
  }, []);
  return (
    <MapContainer
      center={position}
      zoom={10}
      style={{ width: "100vw", height: "100vh" }}
    >
      <TileLayer url="https://api.maptiler.com/maps/basic-v2/256/{z}/{x}/{y}.png?key=sAjH1zwzrhuRgbtxViCr" />
      {data.map((item) => {
        if (item.latitude != null || item.longitude != null) {
          return (
            <Marker
              position={[item.latitude, item.longitude]}
              icon={
                item.steady === "STEADY"
                  ? greenmark
                  : item.steady === "RISING"
                  ? redmark
                  : item.steady === "FALLING"
                  ? yellowmark
                  : blackmark
              }
            >
              <Popup>{item.name}</Popup>
            </Marker>
          );
        }
      })}

      {/* <LocationMarker /> */}
    </MapContainer>
  );
};

export default App;
