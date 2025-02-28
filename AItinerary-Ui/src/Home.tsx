import "./Home.css"
import {NavLink} from "react-router";
import NavBar from "./NavBar.tsx";

function Home() {
  return (
    <>
      <NavBar />
      <main>
        <h1>THE TO DO PLANNER</h1>
        <p>
          Hey this is our hackathon project click the link below to have your
          day planned out
        </p>
        <NavLink to="/chat" id="goto">
          Click Here
        </NavLink>
      </main>
    </>
  );
}

export default Home;
