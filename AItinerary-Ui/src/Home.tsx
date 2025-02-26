import "./App.css"
import {NavLink} from "react-router";

function Home() {
  return (
    <>
      <header>
        <img
          src="/—Pngtree—vector%20earth%20globe%20icon_3762811.png"
          alt="woah"
          id="dom"
        />
        <nav>
          <NavLink to="/" id="back" className="back">
            Home
          </NavLink>
          <NavLink to="/chat" id="back" className="back">
            Chat
          </NavLink>
        </nav>
      </header>
      <hr />
      <main>
        <h1>THE TO DO PLANNER</h1>
        <p>
          Hey this is our hackathon project click the link below to have your
          day planned out
        </p>
        <a href="chat.html" id="goto">
          HERE
        </a>
      </main>
    </>
  );
}

export default Home;
