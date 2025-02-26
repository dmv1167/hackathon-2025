import {
    APIProvider,
    Map,
    useMap,
    useMapsLibrary,
} from "@vis.gl/react-google-maps";
import { useState, useEffect, KeyboardEvent, ChangeEvent } from "react";
import "./App.css";
import {NavLink} from "react-router";

interface Place {
    name: string;
    address: string;
    information: string;
    latitude: number;
    longitude: number;
}

const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY!;

function AiInput({
    inputValue,
    setInputValue,
    setPrompt,
    setDests,
}: {
    inputValue: string;
    setInputValue: (value: string) => void;
    setPrompt: (value: string) => void;
    setDests: (places: Place[]) => void;
}) {
    const handleKeyDown = async (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            setPrompt(inputValue);
            setInputValue("");

            if (inputValue.trim() === "") return;

            try {
                const result = await fetch("http://localhost:8080/aicall", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ prompt: inputValue }),
                });

                const airespond = await result.json(); // Parse the JSON response body

                // Assuming the response contains a list of places
                const placesData: Place[] = JSON.parse(
                    airespond.message
                ).placeList;
                placesData.unshift(JSON.parse(airespond.message).startLocation); // Debugging log
                setDests(placesData);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        }
    };

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
        </div>
    );
}

function MapElement({
    start,
    end,
    setDistance,
    setDuration,
}: {
    start: Place;
    end: Place;
    setDistance: (value: string) => void;
    setDuration: (value: string) => void;
}) {
    function Directions() {
        const map = useMap();
        const routesLibrary = useMapsLibrary("routes");
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

        setDistance(leg.distance?.text!);
        setDuration(leg.duration?.text!);

        return (
            // div for the directions
            <div className="directions">
                <h2>{selected.summary}</h2>
                <p>
                    {leg.start_address.split(",")[0]} to{" "}
                    {leg.end_address.split(",")[0]}
                </p>

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
                mapId="MainMap"
            >
            </Map>
            <Directions />
        </APIProvider>
    );
}

function InfoSection({ start, end }: { start: Place; end: Place }) {
    const [distance, setDistance] = useState("");
    const [duration, setDuration] = useState("");

    let distanceInfo: string = distance;
    let durationInfo: string = duration;

    useEffect(() => {
        distanceInfo = distance;
        durationInfo = duration;
    }, [distance, duration]);

    return (
        <>
            <div id="wrap">
                <details>
                    <summary>{end.name}</summary>
                        <div id="detColor">
                            <div className="mapView">
                                <MapElement
                                    start={start}
                                    end={end}
                                    setDistance={setDistance}
                                    setDuration={setDuration}
                                />
                            </div>
                            <div className="infoSection">
                                <p>{end.information}</p>
                            </div>
                        </div>

                        <div className="item4">
                            <p>Distance: {distanceInfo}</p>
                            <p>Duration: {durationInfo}</p>
                        </div>
                </details>
            </div>
        </>
    );
}

function InfoList({ dests }: { dests: Place[] }) {
    return (
        <>
            {dests.map((_, index) => {
                if (index < dests.length - 1) {
                    return (
                        <InfoSection
                            key={index}
                            start={dests[index]}
                            end={dests[index + 1]}
                        />
                    );
                }
                return null;
            })}
        </>
    );
}

function App() {
    const [dests, setDests] = useState<Place[]>([] as Place[]);
    const [prompt, setPrompt] = useState<string>("");
    const [inputValue, setInputValue] = useState<string>("");

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
                        <NavLink to="/" id="back" className="back" end>
                            Home
                        </NavLink>
                        <NavLink to="/chat" id="back" className="back" end>
                            Chat
                        </NavLink>
                    </nav>
                    <p id="title">AI Day Planner</p>
                </header>
            </div>
            <div id="cen">
                <img src="/better.jpg" alt="sunset drive" id="hero"></img>
            </div>

            <main>
                <h1 id="col">Have your day planned</h1>
                <AiInput
                    inputValue={inputValue}
                    setInputValue={setInputValue}
                    setPrompt={setPrompt}
                    setDests={setDests}
                />
                <button>sendMessage</button>
            </main>
            <section>
                <InfoList dests={dests} />
            </section>
        </>
    );
}

export default App;
