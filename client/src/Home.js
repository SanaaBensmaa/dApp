import React from "react";
import { Link } from "react-router-dom";
import "./App.css"; // si tu veux appliquer un style global

const Home = () => {
  return (
    <div className="container">
      <h1 className="page-title">TPF dApp : Liste des Exercices</h1>
      <ul className="exercise-list">
        <li><Link to="/exercice1" className="exercise-link">Exercice 1 : Addition</Link></li>
        <li><Link to="/exercice2" className="exercise-link">Exercice 2 : Conversion</Link></li>
        <li><Link to="/exercice3" className="exercise-link">Exercice 3 : GestionChaines</Link></li>
        <li><Link to="/exercice4" className="exercise-link">Exercice 4 : EstPositif</Link></li>
        <li><Link to="/exercice5" className="exercise-link">Exercice 5 : Parité</Link></li>
        <li><Link to="/exercice6" className="exercise-link">Exercice 6 : GestionNombres</Link></li>
        <li><Link to="/exercice7" className="exercise-link">Exercice 7 : Forme</Link></li>
        <li><Link to="/exercice8" className="exercise-link">Exercice 8 : Payment</Link></li>
      </ul>
    </div>
  );
};

export default Home;