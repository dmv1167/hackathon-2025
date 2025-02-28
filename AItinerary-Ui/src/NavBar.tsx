import {NavLink} from "react-router";

import "./NavBar.css"

export default function NavBar() {
    return (
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
                    <NavLink to="/about" id="back" className="back" end>
                        About Us
                    </NavLink>
                </nav>
                <p id="title">AI Day Planner</p>
            </header>
        </div>
    )
}