import "./About.css"

export default function About() {
    return (
        <>
            <NavBar/>
            <div className="gitinfo">
                <p id="project">View our project: </p>
                <div>
                    <button className="git"></button>
                </div>
            </div>
            <div className="name-container">
                <ul className="names">
                    <li>
                        <p>Ethan Menand</p>
                    </li>
                    <li>
                        <p>Logan Forthman</p>
                    </li>
                    <li>
                        <p>Dominic Vinciulla</p>
                    </li>
                </ul>
            </div>

        </>
    )
}

import NavBar from "./NavBar.tsx";
