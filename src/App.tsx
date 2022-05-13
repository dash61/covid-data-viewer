import React from 'react';
import './App.css';
import Header from "./components/Header";
import Indicator from "./components/Indicator";

function App() {
  return (
    <div className="App">
      <Header />
      <section style={{display: "flex", flexDirection: "column"}}>
        <Indicator title="New Cases" metric="cases" location="USA" />
        <Indicator title="Death Rates" metric="deaths" location="USA" />
        <Indicator title="Vaccination Rates" metric="vacc" location="USA" />
        <Indicator title="Hospitalization" metric="hospital" location="USA" />
      </section>
    </div>
  );
}

export default App;
