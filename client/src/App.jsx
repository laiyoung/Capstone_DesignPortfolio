import { useState, useEffect } from "react";



function App() {
  const [error, setError] = useState(null);

  return (
    <>
    <header className="login">Login</header>
      <div>
        <h1>Design Portfolio</h1>
        <h2>Laigha Young</h2>
        {error && <p>{error.error}</p>}
      </div>



    </>
  );
}

export default App;
