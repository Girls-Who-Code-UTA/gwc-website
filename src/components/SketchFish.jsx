// src/components/SketchFish.jsx

// this file controls how the fish swim around
// it does not draw the fish itself, that is in Fish.jsx
// this is just a movement controller for the fish

import Fish from "./fish";

export default class SketchFish {
    constructor() {
        // Here we initialize variables for the fish sketch
        this.fish = null; // this fish object will be created in setup
        this.vel = null; // velocity vector for fish movement
        this.wanderAngle = 0; // angle for wandering behavior
        this.padding = 150; // extra space beyond canvas edges for border behavior
    }

    // this runs once at the beginning to set up the fish
    // it puts the fish in the center of the canvas and gives it a random velocity
    setup(p) {
        const padding = 150;
        const side = p.random(["left", "right", "top", "bottom"]);

        let x, y;
        if (side === "left") { 
            x = -padding; 
            y = p.random(-padding, p.height + padding); 
        } else if (side === "right") { 
            x = p.width + padding; 
            y = p.random(-padding, p.height + padding); 
        } else if (side === "top") { 
            x = p.random(-padding, p.width + padding); 
            y = -padding; 
        } else { 
            x = p.random(-padding, p.width + padding); 
            y = p.height + padding; 
        }

        // spawn fish off-screen
        this.fish = new Fish(p, p.createVector(x, y), 0.15);

        // random gentle movement
        this.vel = p.createVector(p.random(-0.5, 0.5), p.random(-1.5, 1.5));
    }


    // this runs every frame to update fish position and redraw
    draw(p, clearBackground = true) {
        // if fish or velocity not set up yet, do nothing
        if (!this.fish || !this.vel) return;

        // clear all the fish drawn before this set (stopping this reveals the onion skin effect)
        if(clearBackground){
            const topColor = p.color(255, 80, 120);
            const bottomColor = p.color(0, 30, 60);
            this.drawGradient(p, topColor, bottomColor);
        }

        // this is the head joint of the fish's spine
        // we use this as the main anchor point for movement
        const head = this.fish.spine.joints[0]; 

        // === NATURAL WANDERING ===
        // this makes the fish move in a smooth, natural way
        this.wanderAngle += p.random(-0.08, 0.08); // slowly change direction
        const wanderStrength = 0.15; // how much to adjust velocity
        this.vel.x += Math.cos(this.wanderAngle) * wanderStrength; 
        this.vel.y += Math.sin(this.wanderAngle) * wanderStrength;
        this.vel.limit(1); // fish speed limit

        // === BORDER BEHAVIOR ===
        // this makes the fish turn around when it nears the edge of the canvas
        // we use padding so fish can go slightly offscreen before turning (bc it looks crazy when it turns right at edge)
        const nextHead = p.createVector(head.x + this.vel.x, head.y + this.vel.y);
        const left = -this.padding;
        const right = p.width + this.padding;
        const top = -this.padding;
        const bottom = p.height + this.padding;

        // turn around if it goes too far left/right or top/bottom
        if (nextHead.x < left || nextHead.x > right) {
            this.vel.x *= -1; // reverse x velocity
            this.wanderAngle += p.PI / 2; // turn more sharply when bouncing off wall
        }

        // turn around if it goes too far up/down
        if (nextHead.y < top || nextHead.y > bottom) {
            this.vel.y *= -1; // reverse y velocity
            this.wanderAngle += p.PI / 2; // turn more sharply when bouncing off wall
        }

        // === UPDATE FISH POSITION AND DRAW ===
        // move the fish's head according to velocity
        this.fish.resolve(nextHead);

        // draw the fish at its new position
        this.fish.display();
    }

}