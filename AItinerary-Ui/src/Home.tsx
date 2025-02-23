import "./App.css"

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
          <a href="home.html" id="back" className="back">
            Home
          </a>
          <a href="app.html" id="back" className="back">
            Chat
          </a>
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
