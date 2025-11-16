// src/components/Chain.jsx

// this file defines a Chain class used for simulating a series of connected joints
// like a fish's spine that can bend and follow a target position

export default class Chain {
    constructor(p, origin, jointCount, linkSize, angleConstraint = p.TWO_PI) {
        this.p = p;
        this.linkSize = linkSize; // how far apart each joint is
        this.angleConstraint = angleConstraint; // how far each joint can bend

        this.joints = []; 
        this.angles = [];

        // --- Create the first joint at the origin (the head) ---
        this.joints.push(origin.copy());
        this.angles.push(0);

        // --- Create the rest of the joints in a vertical line below the head ---
        for (let i = 1; i < jointCount; i++) {
            const prev = this.joints[i - 1];
            this.joints.push(p.createVector(prev.x, prev.y + this.linkSize));
            this.angles.push(0);
        }
    }

    // == Move the chain so the head joint follows the target position ==
    resolve(pos) {
        const p = this.p;

        // move head joint towards target position
        this.angles[0] = p.createVector(pos.x - this.joints[0].x, pos.y - this.joints[0].y).heading();
        this.joints[0] = pos.copy();

        // move each subsequent joint to follow the one before it
        for (let i = 1; i < this.joints.length; i++) {
        const curAngle = p.createVector(
            this.joints[i - 1].x - this.joints[i].x,
            this.joints[i - 1].y - this.joints[i].y
        ).heading();

        // constrain the angle change based on the angleConstraint
        // (to prevent sharp bends)
        this.angles[i] = this.constrainAngle(curAngle, this.angles[i - 1], this.angleConstraint);

        // update joint position based on constrained angle
        const offset = p.createVector(
            Math.cos(this.angles[i]) * this.linkSize,
            Math.sin(this.angles[i]) * this.linkSize
        );

        // set joint position relative to previous joint
        this.joints[i] = p.createVector(
            this.joints[i - 1].x - offset.x,
            this.joints[i - 1].y - offset.y
        );
        }
    }

    // == Constrain the angle change between joints ==
    constrainAngle(curAngle, prevAngle, constraint) {
        const p = this.p;
        let diff = curAngle - prevAngle;

        // wrap angle difference to [-PI, PI] so it wraps around in a circle
        while (diff > p.PI) diff -= p.TWO_PI;
        while (diff < -p.PI) diff += p.TWO_PI;

        // limit the angle difference to the constraint
        diff = p.constrain(diff, -constraint, constraint);

        // return the new constrained angle
        return prevAngle + diff;
    }
}