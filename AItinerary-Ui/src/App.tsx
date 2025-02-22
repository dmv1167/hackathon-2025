import { useState, ChangeEvent } from "react";

function OpenAICall({prompt}:{prompt:string}) {

};

function App() {
    const [text, setText] = useState<string>("");

    return (
        <div style={{ padding: "20px", textAlign: "center" }}>
            <h2>React Textarea Update</h2>
            <textarea
                rows={5}
                cols={40}
                value={text}
                onInputCapture={(e: ChangeEvent<HTMLTextAreaElement>) => setText(e.target.value)}
                placeholder="Type something here..."
                style={{ marginBottom: "10px", padding: "10px", fontSize: "16px" }}
            ></textarea>
            <div>
                <strong>Output:</strong>
                <
            </div>
        </div>
    );
}

export default App;
