import { useEffect, useState } from "react";

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/message")
      .then((res) => res.json())
      .then((data) => setMessage(data.message))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div style={{ backgroundColor: "red", textAlign: "center", marginTop: "50px" }}>
      <h1>Frontend (React + Vite)</h1>
      <h2>Message from Backend:</h2>
      <p>{message || "Loading..."}</p>
    </div>
  );
}

export default App;
