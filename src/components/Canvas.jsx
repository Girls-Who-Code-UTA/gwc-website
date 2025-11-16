// src/components/Canvas.jsx
// 🐟 This file makes a full-screen background for the fish to swim around in — like a digital tank!

import Sketch from "react-p5"; // lets us run p5 (the art library) inside React
import SketchFish from "./SketchFish"; // our custom fish-drawing class
import { Link } from "react-router-dom"; // for linking to other pages

// this is the main Canvas component — it’s the ocean backdrop for the whole site
export default function Canvas() {
  const fishes = []; // list of all the fish
  const numFishes = 15; // how many fish we want to swim around

  // runs once when the sketch starts
    const setup = (p, parent) => {
        // make the canvas a little larger than the screen (so fish can swim off-screen)
        p.createCanvas(p.windowWidth + 200, p.windowHeight + 200).parent(parent);

        // fill the screen with a deep ocean blue
        p.background(20, 50, 80);

        // create all the fish and get them swimming
        for (let i = 0; i < numFishes; i++) {
        const sketchFish = new SketchFish();
        sketchFish.setup(p);
        fishes.push(sketchFish);
        }
    };

  // runs every frame (about 60 times a second)
  // keeps the scene alive and the fish moving
    const draw = (p) => {
        // draw a soft blue gradient background
        const topColor = p.color(10, 80, 120);
        const bottomColor = p.color(0, 30, 60);
        drawGradient(p, topColor, bottomColor);

        // tell each fish to update and draw itself
        for (let fishSketch of fishes) {
        fishSketch.draw(p, false);
        }
    };

    // if the window changes size, resize the canvas too
    const windowResized = (p) => {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
        p.background(20, 50, 80);
    };

    // draw a smooth vertical gradient (lighter on top, darker below)
    const drawGradient = (p, colorTop, colorBottom) => {
        for (let y = 0; y < p.height; y++) {
        const inter = p.map(y, 0, p.height, 0, 1);
        const c = p.lerpColor(colorTop, colorBottom, inter);
        p.stroke(c);
        p.line(0, y, p.width, y);
        }
    };

  // render everything on the page
  // - canvas is the water
  // - overlay adds the underwater glow
  // - ui sits on top for text and buttons
    return (
        <div className="canvas-container">
        {/* the moving fish (bottom layer) */}
        <Sketch setup={setup} draw={draw} windowResized={windowResized} />

        {/* a see-through blue film to make it feel like water */}
        <div className="overlay"></div>

        {/* text and buttons on top of everything */}
        <div className="ui">
            {/* text and buttons on top of everything */}
            <span className="upper">WELCOME TO</span>
            <h1>Girls Who Code</h1>
            <span className="sub">At the University of Texas at Arlington</span>
            <Link to="/about"><button>Who We Are</button></Link>
            <Link to="/get-involved"><button>Get Involved!</button></Link>
            <Link to="/calendar"><button>Calendar</button></Link>
        </div>
        </div>
    );
}