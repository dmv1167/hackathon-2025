import {
    useState,
    useEffect,
    KeyboardEvent,
    ChangeEvent
} from "react";

import OpenAI from 'openai';

const openai = new OpenAI({
    organization: import.meta.env.VITE_ORGANIZATION_ID,
    project: import.meta.env.VITE_PROJECT_ID,
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
});

function App() {
    const [text, setText] = useState<string>("");
    const [inputValue, setInputValue] = useState<string>("");
    const [response, setResponse] = useState<string>("");

    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            setText(inputValue);
            setInputValue("");
        }
    };

    useEffect(() => {
        if (text.trim() === "") return;

        const fetchData = async () => {
            try {
                const completion = await openai.chat.completions.create({
                    model: "gpt-4o-mini",
                    messages: [
                        { role: "system", content: "You are a day trip planner, respond with locations from the web that fulfill what the user asks for." },
                        { role: "user", content: text }
                    ],
                    store: true,
                });

                setResponse(JSON.stringify(completion.choices[0].message));
            } catch (error) {
                console.error("Error fetching data from OpenAI:", error);
            }
        };

        fetchData();
    }, [text]);

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