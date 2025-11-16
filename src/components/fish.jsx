/*
🐟 FISH.JS OVERVIEW
--------------------
This file draws a fish using p5.js — a creative coding library that makes drawing and animation easy.

Each fish is built using shapes (like ellipses and curves), and it moves by following a flexible “spine”
made of connected points from the Chain.js file.

We use several special **p5.js functions** throughout this file:

🖌️  p.fill(r, g, b)
    → Sets the color used to fill shapes.
        Example: p.fill(255, 0, 0) makes shapes red.

🖊️  p.stroke(r, g, b)
    → Sets the color of shape outlines.

🔵  p.ellipse(x, y, w, h)
    → Draws an oval or circle at position (x, y) with width w and height h.

🎨  p.beginShape() and p.endShape()
    → Start and stop drawing a custom shape.
        You can add points inside using p.vertex() or p.curveVertex()
        to make smooth, curved outlines.

🧩  p.curveVertex(x, y)
    → Adds a curved line point inside a shape.

✨  p.bezierVertex(x1, y1, x2, y2, x3, y3)
    → Creates a smooth, flowing curve between points. Unlike curveVertex,
        Bezier curves use control points to define the curve shape.

🔄  p.push() and p.pop()
    → Save and restore drawing settings.
        This means you can move, rotate, or change color for one fin
        without messing up the rest of the fish.

🎯  p.translate(x, y)
    → Moves the origin (0,0) to a new position, so shapes draw around that point.

🔁  p.rotate(angle)
    → Rotates the drawing space by some angle (in radians).
        We use this for the fins and tail so they turn naturally.

🎚️  p.constrain(value, min, max)
    → Keeps a number from going too low or too high.
        For example, we use this to stop the tail from stretching too far.

💡  p.color(r, g, b)
    → Creates a color value that can be stored in a variable and reused.
        Example: this.bodyColor = p.color(58, 124, 165);

📏  p.PI and p.TWO_PI
    → Represent half-circle (π) and full-circle (2π) radians.
        These are used when rotating or curving the fish body.

🌊  p.createVector(x, y)
    → Creates a 2D vector — a direction and magnitude.
        We use vectors for positions (like fish.head) and velocities (how fast it moves).

So: this file is mostly about drawing the fish’s **appearance**,
while its **movement** comes from the SketchFish.js file.
*/

import Chain from "./Chain";

export default class Fish {
    constructor(p, origin, scale = 0.4) {
        // p is the p5 instance (so we can use p5 functions in this class)
        this.p = p;
        this.scale = scale; // defined in sketchFish setup()

        // Colors for body and fins
        this.bodyColor = p.color(58, 124, 165); // darker blue for body
        this.finColor = p.color(129, 195, 215); // lighter blue for fins

        // Width of the fish at each vertebra
        // larger near the head, tapering to smaller at the tail
        this.bodyWidth = [68, 81, 84, 83, 77, 64, 51, 38, 32, 19].map(
        (w) => w * scale // apply the scale to each width
        );

        // make a "spine" for the fish
        // this is a chain of connected points that bend and follow the head
        // this gives the fish it's wiggly movement
        this.spine = new Chain(p, origin, 12, 64 * scale, p.PI / 8);
    }

    // this moves the spine so it points towards the position of the head
    resolve(targetPos) {
        this.spine.resolve(targetPos);
    }

    // this is where the fish is actually drawn on the canvas
    display() {
        const p = this.p;
        const j = this.spine.joints; // spine positions
        const a = this.spine.angles; // spine angles

        // calculate some relative angles for fin and body drawing
        const headToMid1 = this.relativeAngleDiff(a[0], a[6]);
        const headToMid2 = this.relativeAngleDiff(a[0], a[7]);
        const headToTail = headToMid1 + this.relativeAngleDiff(a[6], a[11]);

        // === PECTORAL FINS (the ones by the head) ===
        this.drawFin(3, p.PI / 3, 0, a[2] - p.PI / 4, 160 * this.scale, 64 * this.scale); // right fin
        this.drawFin(3, -p.PI / 3, 0, a[2] + p.PI / 4, 160 * this.scale, 64 * this.scale); // left fin

        // === VENTRAL FINS (lower middle fins) ===
        this.drawFin(7, p.PI / 2, 0, a[6] - p.PI / 4, 96 * this.scale, 32 * this.scale); // right fin
        this.drawFin(7, -p.PI / 2, 0, a[6] + p.PI / 4, 96 * this.scale, 32 * this.scale); // left fin

        // === CAUDAL FIN (ze tail)===
        p.fill(this.finColor);
        p.beginShape();

        // bottom of tail
        for (let i = 8; i < 12; i++) {
            const tailWidth = 1.5 * headToTail * (i - 8) * (i - 8) * this.scale;
            p.curveVertex(
                j[i].x + Math.cos(a[i] - p.PI / 2) * tailWidth,
                j[i].y + Math.sin(a[i] - p.PI / 2) * tailWidth
            );
        }

        // top of tail
        for (let i = 11; i >= 8; i--) {
            const tailWidth = p.constrain(headToTail * 6 * this.scale, -13 * this.scale, 13 * this.scale);
            p.curveVertex(
                j[i].x + Math.cos(a[i] + p.PI / 2) * tailWidth, 
                j[i].y + Math.sin(a[i] + p.PI / 2) * tailWidth
            );
        }
        p.endShape(p.CLOSE);

        // === BODY ===
        p.fill(this.bodyColor);
        p.beginShape();

        // Right half of the body
        for (let i = 0; i < 10; i++)
        p.curveVertex(this.getPosX(i, p.PI / 2, 0), this.getPosY(i, p.PI / 2, 0));

        // Bottom of the fish
        p.curveVertex(this.getPosX(9, p.PI, 0), this.getPosY(9, p.PI, 0));

        // Left half of the body
        for (let i = 9; i >= 0; i--)
        p.curveVertex(this.getPosX(i, -p.PI / 2, 0), this.getPosY(i, -p.PI / 2, 0));

        // Top of the head 
        p.curveVertex(this.getPosX(0, -p.PI / 6, 0), this.getPosY(0, -p.PI / 6, 0));
        p.curveVertex(this.getPosX(0, 0, 4 * this.scale), this.getPosY(0, 0, 4 * this.scale));
        p.curveVertex(this.getPosX(0, p.PI / 6, 0), this.getPosY(0, p.PI / 6, 0));

        p.endShape(p.CLOSE);

        // === DORSAL FIN (on top of the fish) ===
        p.fill(this.finColor);
        p.beginShape();
        p.vertex(j[4].x, j[4].y);
        p.bezierVertex(j[5].x, j[5].y, j[6].x, j[6].y, j[7].x, j[7].y);
        p.bezierVertex(
            j[6].x + Math.cos(a[6] + p.PI / 2) * headToMid2 * 16 * this.scale,
            j[6].y + Math.sin(a[6] + p.PI / 2) * headToMid2 * 16 * this.scale,
            j[5].x + Math.cos(a[5] + p.PI / 2) * headToMid1 * 16 * this.scale,
            j[5].y + Math.sin(a[5] + p.PI / 2) * headToMid1 * 16 * this.scale,
            j[4].x,
            j[4].y
        );
        p.endShape();

        // === EYES ===
        p.fill(255);
        p.ellipse(
            this.getPosX(0, p.PI / 2, -18 * this.scale),
            this.getPosY(0, p.PI / 2, -18 * this.scale),
            24 * this.scale,
            24 * this.scale
        );
        p.ellipse(
            this.getPosX(0, -p.PI / 2, -18 * this.scale),
            this.getPosY(0, -p.PI / 2, -18 * this.scale),
            24 * this.scale,
            24 * this.scale
        );
    }

    // helper function to draw a single fin at a specific joint
    drawFin(index, angleOffset, lengthOffset, rotation, w, h) {
        const p = this.p;
        p.push();
        p.translate(
        this.getPosX(index, angleOffset, lengthOffset),
        this.getPosY(index, angleOffset, lengthOffset)
        );
        p.rotate(rotation);
        p.ellipse(0, 0, w, h);
        p.pop();
    }

    // helper functions to get position offsets for drawing
    getPosX(i, angleOffset, lengthOffset) {
        const p = this.p;
        return (
        this.spine.joints[i].x +
        Math.cos(this.spine.angles[i] + angleOffset) *
            (this.bodyWidth[i] + lengthOffset)
        );
    }     

    getPosY(i, angleOffset, lengthOffset) {
        const p = this.p;
        return (
        this.spine.joints[i].y +
        Math.sin(this.spine.angles[i] + angleOffset) *
            (this.bodyWidth[i] + lengthOffset)
        );
    }

    // helper function to calculate relative angle difference
    relativeAngleDiff(a1, a2) {
        const p = this.p;
        let diff = a2 - a1;
        while (diff > p.PI) diff -= p.TWO_PI;
        while (diff < -p.PI) diff += p.TWO_PI;
        return diff;
    }
}