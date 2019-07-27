import React from 'react';
import './App.css';
import "./css/paint-props.css";
import PaintContainer from "./components/PaintContainer.jsx";

function getCookie(name) {
    var match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    if (match) return match[2];
}

function App() {
    let username = getCookie("username");
    // let username = "matan";
    let colors = ["green", "blue", "pink", "purple"];

    return <PaintContainer colors={colors} username={username} />;
}

export default App;