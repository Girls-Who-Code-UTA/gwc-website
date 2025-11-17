// src/components/FishFood.jsx
// src/components/FishFood.jsx
export default class FishFood {
    constructor(p, x, y) {
        this.p = p;       // ✅ keep a reference to p
        this.x = x;
        this.y = y;
        this.size = 8;
        this.speed = 1.5;
        this.alpha = 255;
    }

    update() {
        this.y += this.speed;
        this.alpha -= 1.5; // fade out slowly
    }

    display() {
        const p = this.p;
        p.noStroke();
        p.fill(255, 204, 0, this.alpha); // yellow pellet
        p.ellipse(this.x, this.y, this.size);
    }

    isGone() {
        return this.alpha <= 0 || this.y > this.p.height;
    }
}
