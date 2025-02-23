import React, { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import { createRoot } from 'react-dom/client'
import viteLogo from '/vite.svg'
import './App.css'
import { APIProvider, GoogleMapsContext, Map, useMap, useMapsLibrary } from '@vis.gl/react-google-maps'
import { json } from 'stream/consumers'


type jsonObj = {
  lat1: number,
  lng1: number,
  addr1: string,
  lat2: number,
  lng2: number,
  addr2: string
}


const jsonString = `{"lat1": 55.96577224651859, "lng1": -3.181451871369203, "addr1": "3 Av. du Général Leclerc, 77380 Combs-la-Ville, France", 
"lat2": 50.722880248014626, "lng2": -3.5320598627471984,"addr2": "Qazhymuqan Munaytpasov St 3, Astana 010000, Kazakhstan"}`

let parsed : jsonObj = JSON.parse(jsonString);


const GOOGLE_API_KEY = (import.meta.env.VITE_GOOGLE_MAPS_API_KEY)!


const App = () => {
  return(
    <APIProvider apiKey={GOOGLE_API_KEY}>
    <Map
      defaultZoom={9}
      defaultCenter={{lat: (parsed.lat1 + parsed.lat2)/2, 
        lng: (parsed.lng1 + parsed.lng2)/2}}
      gestureHandling={'none'}
      fullscreenControl = {false}>
      <Directions />
    </Map>
  </APIProvider>
  )
  // const parsedData = () => JSON.parse(jsonString); 
}



function Directions(){
  const map = useMap();
  const routesLibrary = useMapsLibrary('routes');
  const [directionsService, setDirectionsService] =
    useState<google.maps.DirectionsService>();
  const [directionsRenderer, setDirectionsRenderer] =
    useState<google.maps.DirectionsRenderer>();
  const [routes, setRoutes] = useState<google.maps.DirectionsRoute[]>([]);
  const [routeIndex, setRouteIndex] = useState(0);
  const selected = routes[routeIndex];
  const leg = selected?.legs[0];

  // Initialize directions service/renderer
  useEffect(() => {
    if (!routesLibrary || !map) return;
    setDirectionsService(new routesLibrary.DirectionsService());
    setDirectionsRenderer(
      new routesLibrary.DirectionsRenderer({
        draggable: false,
        map
      })
    );
  }, [routesLibrary, map]);

  // Use directions Service
  useEffect(() => {
    if (!directionsService || !directionsRenderer) return;

    directionsService.route({
      origin: parsed.addr1,
      destination: parsed.addr2,
      travelMode: google.maps.TravelMode.DRIVING,
      provideRouteAlternatives: true
    })
    .then(response => {
      directionsRenderer.setDirections(response);
      setRoutes(response.routes);
    });
    return () => directionsRenderer.setMap(null);
  }, [directionsService, directionsRenderer]);

  // Update direction route
  useEffect(() => {
    if (!directionsRenderer) return;
    directionsRenderer.setRouteIndex(routeIndex);
  }, [routeIndex, directionsRenderer]);
  
  if (!leg) return null;

  return (
    // div for the directions
    <div className="directions">
      <h2>{selected.summary}</h2>
      <p>
        {leg.start_address.split(',')[0]} to {leg.end_address.split(',')[0]}
      </p>
      <p>Distance: {leg.distance?.text}</p>
      <p>Duration: {leg.duration?.text}</p>

      <h2>Other Routes</h2>
      <ul>
        {routes.map((route, index) => (
          <li key={route.summary}>
            <button onClick={() => setRouteIndex(index)}>
              {route.summary}
            </button>

          </li>
        ))}
      </ul>
    </div> 
  )


}
export default App;

export function renderToDom(container:HTMLElement){
  const root = createRoot(container);

  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
