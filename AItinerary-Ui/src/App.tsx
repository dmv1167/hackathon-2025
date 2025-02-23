import {
    APIProvider,
    Map,
    useMap,
    useMapsLibrary,
} from "@vis.gl/react-google-maps";
import { useState, useEffect, KeyboardEvent, ChangeEvent } from "react";
import "./App.css";

function App() {
    const [places, setPlaces] = useState<Places>();
    const [prompt, setPrompt] = useState<string>("");
    const [inputValue, setInputValue] = useState<string>("");
    const [response, setResponse] = useState<string>("");

    const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY!;

    interface Place {
        address: string;
        information: string;
        latitude: number;
        longitude: number;
    }

    interface Places {
        placeList: Place[];
    }

    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            setPrompt(inputValue);
            setInputValue("");
        }
    };

    function AiInput() {
        useEffect(() => {
            if (prompt.trim() === "") return;

            const fetchData = async () => {
                try {
                    const result = await fetch("http://localhost:8080/aicall", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ prompt: prompt }),
                    });

                    const airespond = await result.json(); // Parse the JSON response body
                    setResponse(airespond.message);
                } catch (error) {
                    console.error("Error fetching data:", error);
                    setResponse("An error occurred while fetching data.");
                }
            };

            fetchData();
        }, [prompt]);

        return (
            <div style={{ padding: "20px", textAlign: "center" }}>
                <textarea
                    rows={5}
                    cols={80}
                    value={inputValue}
                    onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                        setInputValue(e.target.value)
                    }
                    onKeyDown={handleKeyDown}
                    placeholder="Tell us about your day"
                    style={{
                        marginBottom: "10px",
                        padding: "10px",
                        fontSize: "16px",
                    }}
                ></textarea>
                <div>
                    <strong>Output:</strong>
                    <p>{response}</p>
                </div>
            </div>
        );
    }

    function InfoSection({ start, end }: { start: Place; end: Place }) {
        return (
            <>
                <section id="faded">
                    <div id="wrap">
                        <details>
                            <summary>Map</summary>
                            <div id="detColor">
                                <div className="mapView">
                                    <MapElement start={start} end={end} />
                                </div>
                                <div className="item2">
                                    <p>hey hey hey dragons</p>
                                </div>
                                <div className="item3">
                                    <p>trolled</p>
                                </div>
                                <div className="item4">
                                    <p>why god</p>
                                </div>
                            </div>
                        </details>
                    </div>
                </section>
            </>
        );
    }

    function MapElement({ start, end }: { start: Place; end: Place }) {
        function Directions() {
            const map = useMap();
            const routesLibrary = useMapsLibrary("routes");
            const [directionsService, setDirectionsService] =
                useState<google.maps.DirectionsService>();
            const [directionsRenderer, setDirectionsRenderer] =
                useState<google.maps.DirectionsRenderer>();
            const [routes, setRoutes] = useState<google.maps.DirectionsRoute[]>(
                []
            );
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
                        map,
                    })
                );
            }, [routesLibrary, map]);

            // Use directions Service
            useEffect(() => {
                if (!directionsService || !directionsRenderer) return;

                directionsService
                    .route({
                        origin: { lat: start.latitude, lng: start.longitude },
                        destination: { lat: end.latitude, lng: end.longitude },
                        travelMode: google.maps.TravelMode.DRIVING,
                        provideRouteAlternatives: true,
                    })
                    .then((response) => {
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
                        {leg.start_address.split(",")[0]} to{" "}
                        {leg.end_address.split(",")[0]}
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
            );
        }
        return (
            <APIProvider apiKey={GOOGLE_API_KEY}>
                <Map
                    defaultZoom={9}
                    defaultCenter={{ lat: 43.65, lng: -79.38 }}
                    gestureHandling={"none"}
                    fullscreenControl={false}
                    disableDefaultUI={true}
                >
                    <Directions />
                </Map>
            </APIProvider>
        );
    }

    return (
        <>
            <div className="god">
                <header>
                    <img
                        src="/—Pngtree—vector%20earth%20globe%20icon_3762811.png"
                        alt="woah"
                        id="dom"
                    ></img>
                    <nav>
                        <a href="index.html" id="back" className="back">
                            Home
                        </a>
                        <a href="chat.html" id="back" className="back">
                            Chat
                        </a>
                    </nav>
                    <p id="title">AI Day Planner</p>
                </header>
            </div>
            <div id="cen">
                <img src="/better.jpg" alt="sunset drive" id="hero"></img>
            </div>
            <h1 id="col">Have your day planned</h1>
            <p id="col">Write what you need to have your day planned</p>

            <main>
                <h1 id="col">Have your day planned</h1>
                <AiInput />
                <button>sendMessage</button>
            </main>
        </>
    );
}

export default App;
