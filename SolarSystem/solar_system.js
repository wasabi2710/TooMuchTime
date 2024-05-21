class Planet {
    constructor(centerX, centerY, orbitalSpeed, orbitalRadius, planetRadius, angle, color, labelText, doTrail = true, type = 'planet') {
        this.centerX = centerX;
        this.centerY = centerY;
        this.orbitalSpeed = orbitalSpeed; 
        this.orbitalRadius = orbitalRadius; 
        this.planetRadius = planetRadius;
        this.angle = angle;
        this.color = color;
        this.labelText = labelText; 
        this.doTrail = doTrail;
        this.type = type;
        
        this.trails = [];
        this.newX = null;
        this.newY = null;
    }

    draw(ctx) {
        this.newX = this.centerX + this.orbitalRadius * Math.cos(this.angle);
        this.newY = this.centerY + this.orbitalRadius * Math.sin(this.angle);

        ctx.beginPath();
        ctx.arc(this.newX, this.newY, this.planetRadius, 0, Math.PI * 2.0, false);
        ctx.fillStyle = this.color;
        ctx.fill(); 

        // Draw text label next to the planet
        this.drawTextLabel(ctx, this.newX, this.newY);

        // Update earth angle
        this.angle += (this.orbitalSpeed * Math.PI) / 365;

        // Update trails
        this.trails.push({x: this.newX, y: this.newY});
        if (this.trails.length > 80) {
            this.trails.shift(); // Drop first element
        }
        // draw trails
        if (this.doTrail) this.drawTrail(ctx);    
    } 

    drawTextLabel(ctx, x, y) {
        // Adjust position for text placement
        let textX = x - 10; // Offset X position
        let textY = y - 10; // Offset Y position

        // Draw the text label
        ctx.font = "16px Arial"; // Font style
        ctx.fillStyle = this.color; // Text color
        ctx.fillText(this.labelText, textX, textY);
    }

    drawTrail(ctx) {    
        // Draw the trail
        ctx.lineWidth = 4; 
        ctx.strokeStyle = this.color;
        ctx.beginPath();
        for (let i = 1; i < this.trails.length; i++) {
            ctx.moveTo(this.trails[i - 1].x, this.trails[i - 1].y);
            ctx.lineTo(this.trails[i].x, this.trails[i].y);
        }
        ctx.stroke();
    }
}

window.onload = () => {
    // Get the canvas element and its context
    const space = document.getElementById('euclidean');
    const ctx = space.getContext('2d');

    // Determine the device pixel ratio
    const dpi = window.devicePixelRatio;
    // Set the canvas size to match the display size, adjusted for dpi
    space.width = space.offsetWidth * dpi;
    space.height = space.offsetHeight * dpi;
    // Scale the context by the dpi to ensure crisp rendering
    ctx.scale(dpi, dpi);

    // solar system     
    var centerX = space.width;
    var centerY = space.height;
    
    // Initialize planets with labels
    const planets = [
        new Planet(centerX / 2, centerY / 2, 6, 70, 5, 0, '#1a1a1a', 'Mercury', true, 'planet'),
        new Planet(centerX / 2, centerY / 2, 4, 110, 8, 0, '#e6e6e6', 'Venus', true, 'planet'),
        new Planet(centerX / 2, centerY / 2, 3, 160, 9, 0, '#2f6a69', 'Earth', true, 'planet'),
        new Planet(centerX / 2, centerY / 2, 1.5, 210, 6, 0, '#993d00', 'Mars', true, 'planet'),
        // asteroid belt
        ...Array.from({ length: 200 }, (_, i) => new Planet(centerX / 2, centerY / 2, 0.1, 220 + i * 0.5, 0.9, Math.random() * 360, '#ffff', '', false, 'asteroid')),
        new Planet(centerX / 2, centerY / 2, 0.1, 265, 0.9, 0, '#ffff', 'Asteroid Belt', false, 'asteroid'),
        new Planet(centerX / 2, centerY / 2, 0.8, 320, 15, 0, '#b07f35', 'Jupiter', true, 'planet'),
        new Planet(centerX / 2, centerY / 2, 0.6, 370, 12, 0, '#b08f36', 'Saturn', true, 'planet'),
        new Planet(centerX / 2, centerY / 2, 0.4, 400, 10, 0, '#5580aa', 'Uranus', true, 'planet'),
        new Planet(centerX / 2, centerY / 2, 0.2, 450, 8, 0, '#366896', 'Neptune', true, 'planet'),
    ];

    const earthCoord = [];
    let newX = 0;
    let newY = 0;
    let moonOrbitRadius = 20;
    let moonAngle = 0;

    // earth    
    function solarSystem() {
        // Clear the canvas to prepare for dra ing
        ctx.clearRect(0, 0, space.width, space.height);

        // sun: stationary
        ctx.beginPath();
        ctx.arc(space.width / 2, space.height / 2, 20, 0, Math.PI * 2.0, false);
        ctx.fillStyle = "#ffa500";
        ctx.fill();

        // planets
        planets.forEach((planet) => {
            planet.draw(ctx);
            if (planet.labelText === "Earth") {
                newX = planet.newX;
                newY = planet.newY;
            }
        });

        // draw moon
        let moonNewX = newX + moonOrbitRadius * Math.cos(moonAngle);
        let moonNewY = newY + moonOrbitRadius * Math.sin(moonAngle);

        // update angle
        moonAngle += 0.08; 

        // Draw the Moon
        ctx.beginPath();
        ctx.arc(moonNewX, moonNewY, 1.5, 0, Math.PI * 2.0, false);
        ctx.fillStyle = '#03cafc';
        ctx.fill();

        // Adjust position for text placement
        let textX = moonNewX - 10; 
        let textY = moonNewY - 10; 

        // Draw the text label
        ctx.font = "16px Arial"; 
        ctx.fillStyle = "#03cafc"; 
        ctx.fillText("Moon", textX, textY);

        // anim recursion
        requestAnimationFrame(solarSystem);

    }

    solarSystem();

}
