import {
    useState,
    useEffect,
    KeyboardEvent,
    ChangeEvent
} from "react";

import 

function App() {
    const [prompt, setPrompt] = useState<string>("");
    const [inputValue, setInputValue] = useState<string>("");
    const [response, setResponse] = useState<string>("");

    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            setPrompt(inputValue);
            setInputValue("");
        }
    };

    useEffect(() => {
        if (prompt.trim() === "") return;

        const fetchData = async () => {
            try {
                const result = await fetch("http://localhost:8080/aicall", {
                    method: "POST",
                    headers: {
                    "Content-Type": "application/json",
                    },
                    body: JSON.stringify(
                        { prompt: prompt }
                    )
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
            <h2>React Textarea Update</h2>
            <textarea
                rows={5}
                cols={40}
                value={inputValue}
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type something here and press Enter..."
                style={{ marginBottom: "10px", padding: "10px", fontSize: "16px" }}
            ></textarea>
            <div>
                <strong>Output:</strong>
                <p>{response}</p>
            </div>
        </div>
    );
}

export default App;