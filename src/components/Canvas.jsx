// src/components/Canvas.jsx
// 🐟 This file makes a full-screen background for the fish to swim around in — like a digital tank!


import { useState, useRef } from "react";
import Sketch from "react-p5"; // lets us run p5 (the art library) inside React
import SketchFish from "./SketchFish"; // our custom fish-drawing class
import { Link } from "react-router-dom"; // for linking to other pages
import { useLocation } from "react-router-dom";
import FishFood from "./FishFood";

// this is the main Canvas component — it’s the ocean backdrop for the whole site
export default function Canvas() {
    const fishesRef = useRef([]); // list of all the fish
    const numFishes = 15; // how many fish we want to swim around

    const [feeding, setFeeding] = useState(false); // track if feeding mode is active
    const foodRef = useRef([]); // store fish food pieces

    const sparkleCount = 200;
    let sparklePositions = [];

    const location = useLocation();
    const isHome = location.pathname === "/";

    // runs once when the sketch starts
        const setup = (p, parent) => {
            p.createCanvas(p.windowWidth + 200, p.windowHeight + 200).parent(parent);
            p.background(20, 50, 80);

            if (fishesRef.current.length === 0) {
                for (let i = 0; i < numFishes; i++) {
                    const sketchFish = new SketchFish();
                    sketchFish.setup(p);
                    fishesRef.current.push(sketchFish);
                }
            }

            for (let i = 0; i < sparkleCount; i++) {
                sparklePositions.push({
                    x: p.random(p.width),
                    y: p.random(p.height),
                    offset: p.random(1000)
                });
            }
        };


    const draw = (p) => {
    const topColor = p.color(90, 200, 210);   // bright aqua-teal
    const bottomColor = p.color(0, 90, 110);  // deep teal-blue

        drawGradient(p, topColor, bottomColor);

        // fish movement and eating
        for (let fishSketch of fishesRef.current) {
            let closestFood = null;
            let minDist = Infinity;

            for (let food of foodRef.current) {
                const head = fishSketch.fish.spine.joints[0];
                const d = p.dist(head.x, head.y, food.x, food.y);
                if (d < minDist) {
                    minDist = d;
                    closestFood = food;
                }
            }

            if (closestFood && minDist < 350) {
                const head = fishSketch.fish.spine.joints[0];
                const dir = p.createVector(closestFood.x - head.x, closestFood.y - head.y);
                dir.normalize();

                // make fish move faster the closer they are
                const chaseSpeed = p.map(minDist, 350, 0, 2, 6, true); // smoothly goes from 2 → 6
                dir.mult(chaseSpeed);

                // steer more sharply when food is close
                fishSketch.vel.lerp(dir, 0.2);
            }


            // eat the food if close enough
            if (closestFood && minDist < 25) {
                const index = foodRef.current.indexOf(closestFood);
                if (index > -1) {
                    foodRef.current.splice(index, 1);
                    console.log("yum!");
                }
            }

            fishSketch.draw(p, false);
        }

        for (let i = foodRef.current.length - 1; i >= 0; i--) {
            const food = foodRef.current[i];
            food.update();
            food.display();
            if (food.isGone()) foodRef.current.splice(i, 1);
        }

        drawWaterLines(p);
        drawSparkles(p);
    };

    const mousePressed = (p) => {
        if (feeding) {
            const food = new FishFood(p, p.mouseX, p.mouseY);
            foodRef.current.push(food);
            console.log("food dropped", foodRef.current.length);
        }
    };

    const windowResized = (p) => {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
        p.background(20, 50, 80);
    };

    const drawGradient = (p, colorTop, colorBottom) => {
        for (let y = 0; y < p.height; y++) {
            const inter = p.map(y, 0, p.height, 0, 1);
            const c = p.lerpColor(colorTop, colorBottom, inter);
            p.stroke(c);
            p.line(0, y, p.width, y);
        }
    };

    const drawSparkles = (p) => {
        p.noStroke();

        const time = p.millis() * 0.001;

        for (let s of sparklePositions) {
            const pulse = (Math.sin(time * 2 + s.offset) + 1) * 0.5;
            const size = 1 + pulse * 3;

            p.fill(255, 255, 255, 25 + pulse * 60);
            p.ellipse(s.x, s.y, size, size);
        }
    };

    const drawWaterLines = (p) => {
        p.noFill();
        p.stroke(255, 255, 255, 28); // translucent white
        p.strokeWeight(1.2);

        const spacing = 120; // distance between ripple layers

        for (let y = -50; y < p.height + 100; y += spacing) {
            p.beginShape();
            for (let x = 0; x < p.width; x += 40) {
                const wave =
                    Math.sin(x * 0.015 + p.frameCount * 0.01 + y * 0.02) * 18 +
                    Math.sin(x * 0.03 + p.frameCount * 0.02) * 9;

                p.curveVertex(x, y + wave);
            }
            p.endShape();
        }
    };

    return (
        <div className="canvas-container">
            <Sketch setup={setup} draw={draw} windowResized={windowResized} mousePressed={mousePressed} />

            {isHome && <div className="overlay"></div>}   {/* overlay ONLY on home */}

            <button
                className={`feed-btn ${feeding ? "active" : ""}`}
                onClick={() => setFeeding(!feeding)}
            >
                {feeding ? "🐠 Feeding Mode On!" : "Feed the Phish!"}
            </button>

            <div className="ui">
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