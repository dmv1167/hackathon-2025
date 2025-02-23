import { useState, useEffect } from 'react'
import './App.css'
import { APIProvider, Map, useMap, useMapsLibrary } from '@vis.gl/react-google-maps'

const GOOGLE_API_KEY = (import.meta.env.VITE_GOOGLE_MAPS_API_KEY)!

function App() {
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
          origin: '115 Madison Ave, Van Buren ME',
          destination: '348 Fegan Dr, San Clemente CA',
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
    return (
        <APIProvider apiKey={GOOGLE_API_KEY}>
            <Map
                defaultZoom={9}
                defaultCenter={{lat: 43.65, lng: -79.38}}
                gestureHandling={'none'}
                fullscreenControl = {false}
                disableDefaultUI={true}>
                <Directions />
            </Map>
        </APIProvider>
    );
}
export default App;

