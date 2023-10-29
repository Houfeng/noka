import React from "react";
import { createRoot } from "react-dom/client";

function App() {
  return (
    <div>你好中国</div>
  )
}

const root = createRoot(document.getElementById('root'));
root.render(<App />);