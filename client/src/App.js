import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home";
import Exercice1 from "./Exercice1";
import Exercice2 from "./Exercice2";
import Exercice3 from "./Exercice3";
import Exercice4 from "./Exercice4";
import Exercice5 from "./Exercice5";
import Exercice6 from "./Exercice6";
import Exercice7 from "./Exercice7";
import Exercice8 from "./Exercice8";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/exercice1" element={<Exercice1 />} />
        <Route path="/exercice2" element={<Exercice2 />} />
        <Route path="/exercice3" element={<Exercice3 />} />
        <Route path="/exercice4" element={<Exercice4 />} />
        <Route path="/exercice5" element={<Exercice5 />} />
        <Route path="/exercice6" element={<Exercice6 />} />
        <Route path="/exercice7" element={<Exercice7 />} />
        <Route path="/exercice8" element={<Exercice8 />} />
        
      </Routes>
    </Router>
  );
}

export default App;