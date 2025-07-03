// Enhanced Universe background using Canvas 2D API
document.addEventListener('DOMContentLoaded', function() {
    // Get the canvas element
    const canvas = document.getElementById('bg-canvas');
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Mouse position tracking for interactive universe
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;
    
    // Track mouse movement
    document.addEventListener('mousemove', (e) => {
        targetMouseX = e.clientX - canvas.width / 2;
        targetMouseY = e.clientY - canvas.height / 2;
    });
    
    // Universe elements
    const stars = [];
    const numStars = 1600;
    const twinkleStars = [];
    const numTwinkleStars = 250;
    const galaxies = [];
    const numGalaxies = 10;
    const nebulae = [];
    const numNebulae = 4;
    const distantPlanets = [];
    const numDistantPlanets = 8;
    
    // Create universe elements
    function createUniverseElements() {
        // Regular stars - create in layers for parallax effect
        for (let i = 0; i < numStars; i++) {
            // Assign different z-depths for parallax
            const zDepth = Math.random();
            stars.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 1.5,
                color: getRandomStarColor(),
                z: zDepth, // z-depth for parallax (0-1)
                parallaxFactor: 0.2 + zDepth * 0.8 // How much it moves with mouse
            });
        }
        
        // Twinkling stars
        for (let i = 0; i < numTwinkleStars; i++) {
            const zDepth = Math.random();
            twinkleStars.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: 1 + Math.random() * 2,
                alpha: Math.random(),
                alphaChange: 0.01 + Math.random() * 0.03,
                direction: Math.random() > 0.5 ? 1 : -1,
                color: getRandomStarColor(true),
                z: zDepth,
                parallaxFactor: 0.1 + zDepth * 0.7
            });
        }
        
        // Create galaxies
        for (let i = 0; i < numGalaxies; i++) {
            // Different galaxy types
            const galaxyType = Math.floor(Math.random() * 3); // 0: spiral, 1: elliptical, 2: irregular
            
            galaxies.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: 80 + Math.random() * 150, // Larger size for galaxies
                rotation: Math.random() * Math.PI * 2,
                rotationSpeed: (Math.random() - 0.5) * 0.001,
                type: galaxyType,
                hue: Math.random() * 50 + (galaxyType === 0 ? 200 : galaxyType === 1 ? 200 : 30), // Different hues based on type
                opacity: 0.2 + Math.random() * 0.3,
                z: Math.random() * 0.6, // Keep galaxies in background
                parallaxFactor: 0.05 + Math.random() * 0.15
            });
        }
        
        // Create nebulae
        for (let i = 0; i < numNebulae; i++) {
            nebulae.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                width: 150 + Math.random() * 250,
                height: 100 + Math.random() * 200,
                hue: Math.random() * 360, // Random colors for nebulae
                opacity: 0.1 + Math.random() * 0.2,
                z: Math.random() * 0.7,
                parallaxFactor: 0.1 + Math.random() * 0.2
            });
        }
        
        // Create distant planets
        for (let i = 0; i < numDistantPlanets; i++) {
            const planetSize = 5 + Math.random() * 15;
            const hasRings = Math.random() > 0.7;
            const ringWidth = hasRings ? planetSize * (0.8 + Math.random() * 0.7) : 0;
            
            distantPlanets.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: planetSize,
                hasRings: hasRings,
                ringWidth: ringWidth,
                ringAngle: Math.random() * Math.PI / 6,
                hue: Math.random() * 360,
                saturation: 20 + Math.random() * 80,
                lightness: 40 + Math.random() * 40,
                z: 0.3 + Math.random() * 0.7, // Keep planets in middle distance
                parallaxFactor: 0.15 + Math.random() * 0.25
            });
        }
    }
    
    // Get random star color
    function getRandomStarColor(bright = false) {
        const colors = [
            'rgb(154, 100, 100)', // White
            'rgb(200, 220, 255)', // Light blue
            'rgb(196, 165, 130)', // Light orange
            'rgb(200, 255, 255)'  // Cyan
        ];
        
        if (bright) {
            return colors[Math.floor(Math.random() * colors.length)];
        }
        
        // Add more white stars than colored ones
        return Math.random() > 0.3 ? colors[0] : colors[Math.floor(Math.random() * colors.length)];
    }
    
    // Create shooting stars
    const shootingStars = [];
    
    function createShootingStar() {
        if (shootingStars.length < 4 && Math.random() > 0.995) {
            const startX = Math.random() * canvas.width;
            const startY = Math.random() * (canvas.height / 3);
            
            shootingStars.push({
                x: startX,
                y: startY,
                length: 50 + Math.random() * 80,
                angle: Math.PI / 4 + Math.random() * (Math.PI / 4),
                speed: 5 + Math.random() * 10,
                opacity: 1
            });
        }
    }
    
    // Create main planet/moon
    const planet = {
        x: canvas.width / 2,
        y: canvas.height + 100,
        radius: 150,
        rotation: 0,
        draw: function() {
            // Create gradient for planet
            const gradient = ctx.createRadialGradient(
                this.x, this.y, 0,
                this.x, this.y, this.radius
            );
            gradient.addColorStop(0, 'rgba(170, 220, 255, 1)');
            gradient.addColorStop(0.5, 'rgba(100, 180, 255, 1)');
            gradient.addColorStop(1, 'rgba(70, 120, 200, 1)');
            
            // Rotate for simple planet rotation effect
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation);
            ctx.translate(-this.x, -this.y);
            
            // Draw planet
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = gradient;
            ctx.fill();
            
            // Draw highlight
            ctx.beginPath();
            ctx.arc(this.x - this.radius * 0.3, this.y - this.radius * 0.3, this.radius * 0.8, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
            ctx.fill();
            
            ctx.restore();
            
            // Draw glow - no rotation for glow
            const glowGradient = ctx.createRadialGradient(
                this.x, this.y, this.radius,
                this.x, this.y, this.radius * 1.4
            );
            glowGradient.addColorStop(0, 'rgba(100, 180, 255, 0.3)');
            glowGradient.addColorStop(1, 'rgba(100, 180, 255, 0)');
            
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius * 1.4, 0, Math.PI * 2);
            ctx.fillStyle = glowGradient;
            ctx.fill();
            
            // Increment rotation
            this.rotation += 0.0005;
        }
    };
    
    // Create silhouette
    const silhouette = {
        draw: function() {
            // Draw mountains
            ctx.beginPath();
            ctx.moveTo(0, canvas.height);
            
            // Left mountain range
            ctx.lineTo(canvas.width * 0.2, canvas.height - 50);
            ctx.lineTo(canvas.width * 0.3, canvas.height - 120);
            ctx.lineTo(canvas.width * 0.4, canvas.height - 80);
            
            // Center mountain range
            ctx.lineTo(canvas.width * 0.5, canvas.height - 150);
            ctx.lineTo(canvas.width * 0.6, canvas.height - 100);
            
            // Right mountain range
            ctx.lineTo(canvas.width * 0.7, canvas.height - 180);
            ctx.lineTo(canvas.width * 0.8, canvas.height - 70);
            ctx.lineTo(canvas.width * 0.9, canvas.height - 120);
            ctx.lineTo(canvas.width, canvas.height - 50);
            ctx.lineTo(canvas.width, canvas.height);
            
            ctx.fillStyle = 'black';
            ctx.fill();
            
            // Draw person silhouette
            const personX = canvas.width * 0.25;
            const personY = canvas.height - 120;
            const personHeight = 30;
            
            // Head
            ctx.beginPath();
            ctx.arc(personX, personY - personHeight, 5, 0, Math.PI * 2);
            ctx.fillStyle = 'black';
            ctx.fill();
            
            // Body
            ctx.beginPath();
            ctx.moveTo(personX, personY - personHeight + 5);
            ctx.lineTo(personX, personY - 5);
            ctx.strokeStyle = 'black';
            ctx.lineWidth = 3;
            ctx.stroke();
            
            // Legs
            ctx.beginPath();
            ctx.moveTo(personX, personY - 5);
            ctx.lineTo(personX - 5, personY);
            ctx.moveTo(personX, personY - 5);
            ctx.lineTo(personX + 5, personY);
            ctx.stroke();
            
            // Arms
            ctx.beginPath();
            ctx.moveTo(personX, personY - personHeight + 10);
            ctx.lineTo(personX - 8, personY - personHeight + 15);
            ctx.moveTo(personX, personY - personHeight + 10);
            ctx.lineTo(personX + 8, personY - personHeight + 15);
            ctx.stroke();
        }
    };
    
    // Draw background gradient
    function drawBackground() {
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, '#000033');    // Dark blue at top
        gradient.addColorStop(0.5, '#000066');  // Medium blue in middle
        gradient.addColorStop(1, '#003366');    // Lighter blue-teal at bottom
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    
    // Draw nebulae
    function drawNebulae() {
        nebulae.forEach(nebula => {
            const parallaxX = mouseX * nebula.parallaxFactor;
            const parallaxY = mouseY * nebula.parallaxFactor;
            
            // Create cloud-like nebula with gradients
            const gradient = ctx.createRadialGradient(
                nebula.x + parallaxX, nebula.y + parallaxY, 0,
                nebula.x + parallaxX, nebula.y + parallaxY, nebula.width / 2
            );
            
            const color = `hsla(${nebula.hue}, 70%, 60%, ${nebula.opacity})`;
            const colorTransparent = `hsla(${nebula.hue}, 70%, 60%, 0)`;
            
            gradient.addColorStop(0, color);
            gradient.addColorStop(1, colorTransparent);
            
            // Draw main nebula cloud
            ctx.beginPath();
            ctx.ellipse(
                nebula.x + parallaxX, 
                nebula.y + parallaxY, 
                nebula.width / 2, 
                nebula.height / 2, 
                0, 0, Math.PI * 2
            );
            ctx.fillStyle = gradient;
            ctx.fill();
            
            // Add some smaller cloud patches
            for (let i = 0; i < 5; i++) {
                const offsetX = (Math.random() - 0.5) * nebula.width * 0.8;
                const offsetY = (Math.random() - 0.5) * nebula.height * 0.8;
                const size = (0.3 + Math.random() * 0.5) * nebula.width / 2;
                
                const smallGradient = ctx.createRadialGradient(
                    nebula.x + parallaxX + offsetX, 
                    nebula.y + parallaxY + offsetY, 
                    0,
                    nebula.x + parallaxX + offsetX, 
                    nebula.y + parallaxY + offsetY, 
                    size
                );
                
                const hueShift = (Math.random() - 0.5) * 30;
                const smallColor = `hsla(${nebula.hue + hueShift}, 70%, 60%, ${nebula.opacity * 0.7})`;
                
                smallGradient.addColorStop(0, smallColor);
                smallGradient.addColorStop(1, colorTransparent);
                
                ctx.beginPath();
                ctx.ellipse(
                    nebula.x + parallaxX + offsetX, 
                    nebula.y + parallaxY + offsetY, 
                    size, 
                    size * 0.7, 
                    Math.random() * Math.PI, 
                    0, Math.PI * 2
                );
                ctx.fillStyle = smallGradient;
                ctx.fill();
            }
        });
    }
    
    // Draw galaxies
    function drawGalaxies() {
        galaxies.forEach(galaxy => {
            const parallaxX = mouseX * galaxy.parallaxFactor;
            const parallaxY = mouseY * galaxy.parallaxFactor;
            
            ctx.save();
            ctx.translate(galaxy.x + parallaxX, galaxy.y + parallaxY);
            ctx.rotate(galaxy.rotation);
            
            // Draw based on galaxy type
            if (galaxy.type === 0) { // Spiral galaxy
                drawSpiralGalaxy(galaxy);
            } else if (galaxy.type === 1) { // Elliptical galaxy
                drawEllipticalGalaxy(galaxy);
            } else { // Irregular galaxy
                drawIrregularGalaxy(galaxy);
            }
            
            ctx.restore();
            
            // Update rotation
            galaxy.rotation += galaxy.rotationSpeed;
        });
    }
    
    // Draw spiral galaxy
    function drawSpiralGalaxy(galaxy) {
        const arms = 2 + Math.floor(Math.random() * 3);
        const color = `hsla(${galaxy.hue}, 70%, 70%, ${galaxy.opacity})`;
        
        // Draw galaxy core
        const coreGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, galaxy.size / 4);
        coreGradient.addColorStop(0, `hsla(${galaxy.hue + 30}, 80%, 80%, ${galaxy.opacity + 0.2})`);
        coreGradient.addColorStop(1, `hsla(${galaxy.hue}, 70%, 60%, 0)`);
        
        ctx.beginPath();
        ctx.arc(0, 0, galaxy.size / 4, 0, Math.PI * 2);
        ctx.fillStyle = coreGradient;
        ctx.fill();
        
        // Draw spiral arms
        for (let a = 0; a < arms; a++) {
            const angleOffset = (Math.PI * 2 / arms) * a;
            
            for (let i = 0; i < galaxy.size / 2; i += 2) {
                const angle = angleOffset + (i / galaxy.size * Math.PI * 2 * 2);
                const x = Math.cos(angle) * i;
                const y = Math.sin(angle) * i;
                const size = 2 + (1 - i / galaxy.size) * 8;
                
                const opacity = galaxy.opacity * (1 - i / galaxy.size);
                
                ctx.beginPath();
                ctx.arc(x, y, size, 0, Math.PI * 2);
                ctx.fillStyle = `hsla(${galaxy.hue + i % 30}, 70%, 70%, ${opacity})`;
                ctx.fill();
            }
        }
    }
    
    // Draw elliptical galaxy
    function drawEllipticalGalaxy(galaxy) {
        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, galaxy.size / 2);
        gradient.addColorStop(0, `hsla(${galaxy.hue}, 70%, 70%, ${galaxy.opacity + 0.1})`);
        gradient.addColorStop(1, `hsla(${galaxy.hue}, 70%, 70%, 0)`);
        
        ctx.beginPath();
        ctx.ellipse(0, 0, galaxy.size / 2, galaxy.size / 3, 0, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
        
        // Add some star clusters
        for (let i = 0; i < 20; i++) {
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * galaxy.size / 2.5;
            const x = Math.cos(angle) * distance;
            const y = Math.sin(angle) * distance * 0.6;
            const size = 1 + Math.random() * 3;
            
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${galaxy.hue}, 80%, 80%, ${galaxy.opacity * (1 - distance / (galaxy.size / 2)) + 0.1})`;
            ctx.fill();
        }
    }
    
    // Draw irregular galaxy
    function drawIrregularGalaxy(galaxy) {
        // Create several random cloud-like shapes
        for (let i = 0; i < 8; i++) {
            const x = (Math.random() - 0.5) * galaxy.size * 0.8;
            const y = (Math.random() - 0.5) * galaxy.size * 0.8;
            const size = (0.2 + Math.random() * 0.5) * galaxy.size / 2;
            
            const gradient = ctx.createRadialGradient(x, y, 0, x, y, size);
            
            const hueShift = (Math.random() - 0.5) * 40;
            gradient.addColorStop(0, `hsla(${galaxy.hue + hueShift}, 70%, 70%, ${galaxy.opacity + 0.1})`);
            gradient.addColorStop(1, `hsla(${galaxy.hue}, 70%, 70%, 0)`);
            
            ctx.beginPath();
            ctx.ellipse(x, y, size, size * (0.6 + Math.random() * 0.4), Math.random() * Math.PI, 0, Math.PI * 2);
            ctx.fillStyle = gradient;
            ctx.fill();
        }
        
        // Add some bright stars within the galaxy
        for (let i = 0; i < 15; i++) {
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * galaxy.size / 2;
            const x = Math.cos(angle) * distance;
            const y = Math.sin(angle) * distance;
            const size = 1 + Math.random() * 2;
            
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${galaxy.hue + 30}, 80%, 80%, ${galaxy.opacity + 0.2})`;
            ctx.fill();
        }
    }
    
    // Draw distant planets
    function drawDistantPlanets() {
        distantPlanets.forEach(planet => {
            const parallaxX = mouseX * planet.parallaxFactor;
            const parallaxY = mouseY * planet.parallaxFactor;
            
            // Draw planet
            ctx.beginPath();
            ctx.arc(planet.x + parallaxX, planet.y + parallaxY, planet.size, 0, Math.PI * 2);
            ctx.fillStyle = `hsl(${planet.hue}, ${planet.saturation}%, ${planet.lightness}%)`;
            ctx.fill();
            
            // Draw highlight
            ctx.beginPath();
            ctx.arc(
                planet.x + parallaxX - planet.size * 0.3, 
                planet.y + parallaxY - planet.size * 0.3, 
                planet.size * 0.6, 
                0, Math.PI * 2
            );
            ctx.fillStyle = `hsla(${planet.hue}, ${planet.saturation * 0.8}%, ${planet.lightness * 1.2}%, 0.3)`;
            ctx.fill();
            
            // Draw rings if the planet has them
            if (planet.hasRings) {
                ctx.save();
                ctx.translate(planet.x + parallaxX, planet.y + parallaxY);
                ctx.rotate(planet.ringAngle);
                ctx.scale(1, 0.3); // Flatten to make it look like a ring
                
                // Outer ring
                ctx.beginPath();
                ctx.arc(0, 0, planet.size + planet.ringWidth, 0, Math.PI * 2);
                ctx.arc(0, 0, planet.size, Math.PI * 2, 0, true); // Cut out the planet
                ctx.fillStyle = `hsla(${planet.hue + 20}, ${planet.saturation * 0.7}%, ${planet.lightness * 1.1}%, 0.6)`;
                ctx.fill();
                
                ctx.restore();
            }
        });
    }
    
    // Draw stars
    function drawStars() {
        // Regular stars
        stars.forEach(star => {
            const parallaxX = mouseX * star.parallaxFactor;
            const parallaxY = mouseY * star.parallaxFactor;
            
            ctx.beginPath();
            ctx.arc(star.x + parallaxX, star.y + parallaxY, star.size, 0, Math.PI * 2);
            ctx.fillStyle = star.color;
            ctx.fill();
        });
        
        // Twinkling stars
        twinkleStars.forEach(star => {
            const parallaxX = mouseX * star.parallaxFactor;
            const parallaxY = mouseY * star.parallaxFactor;
            
            // Update alpha
            star.alpha += star.direction * star.alphaChange;
            
            if (star.alpha <= 0.3) {
                star.alpha = 0.3;
                star.direction = 1;
            } else if (star.alpha >= 1) {
                star.alpha = 1;
                star.direction = -1;
            }
            
            // Draw star with current alpha
            ctx.beginPath();
            ctx.arc(star.x + parallaxX, star.y + parallaxY, star.size, 0, Math.PI * 2);
            ctx.fillStyle = star.color.replace('rgb', 'rgba').replace(')', `, ${star.alpha})`);
            ctx.fill();
            
            // Add glow effect for some stars
            if (star.size > 1.5) {
                ctx.beginPath();
                ctx.arc(star.x + parallaxX, star.y + parallaxY, star.size * 3, 0, Math.PI * 2);
                ctx.fillStyle = star.color.replace('rgb', 'rgba').replace(')', `, ${star.alpha * 0.2})`);
                ctx.fill();
            }
        });
    }
    
    // Draw shooting stars
    function drawShootingStars() {
        for (let i = shootingStars.length - 1; i >= 0; i--) {
            const star = shootingStars[i];
            
            // Calculate end point
            const endX = star.x + Math.cos(star.angle) * star.length;
            const endY = star.y + Math.sin(star.angle) * star.length;
            
            // Create gradient for trail
            const gradient = ctx.createLinearGradient(star.x, star.y, endX, endY);
            gradient.addColorStop(0, `rgba(255, 255, 255, ${star.opacity})`);
            gradient.addColorStop(0.5, `rgba(200, 220, 255, ${star.opacity * 0.6})`);
            gradient.addColorStop(1, 'rgba(200, 220, 255, 0)');
            
            // Draw trail
            ctx.beginPath();
            ctx.moveTo(star.x, star.y);
            ctx.lineTo(endX, endY);
            ctx.strokeStyle = gradient;
            ctx.lineWidth = 2;
            ctx.stroke();
            
            // Draw head
            ctx.beginPath();
            ctx.arc(star.x, star.y, 2, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
            ctx.fill();
            
            // Move shooting star
            star.x += Math.cos(star.angle) * star.speed;
            star.y += Math.sin(star.angle) * star.speed;
            
            // Remove if off screen or faded out
            if (star.x > canvas.width || star.y > canvas.height || star.opacity <= 0) {
                shootingStars.splice(i, 1);
            } else if (star.x > canvas.width * 0.7 || star.y > canvas.height * 0.7) {
                // Start fading out when near edge
                star.opacity -= 0.02;
            }
        }
    }
    
    // Handle scroll position for parallax effect
    let scrollY = window.scrollY || document.documentElement.scrollTop;
    
    window.addEventListener('scroll', () => {
        scrollY = window.scrollY || document.documentElement.scrollTop;
    });
    
    // Animation loop
    function animate() {
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Smooth mouse movement
        mouseX += (targetMouseX - mouseX) * 0.05;
        mouseY += (targetMouseY - mouseY) * 0.05;
        
        // Draw background
        drawBackground();
        
        // Draw universe elements in order from back to front
        drawNebulae();
        drawGalaxies();
        drawDistantPlanets();
        drawStars();
        
        // Create new shooting stars randomly
        createShootingStar();
        drawShootingStars();
        
        // Update planet position based on scroll
        planet.y = canvas.height - 50 - (scrollY * 0.02);
        
        // Draw planet
        planet.draw();
        
        // Draw silhouette
        silhouette.draw();
        
        // Request next frame
        requestAnimationFrame(animate);
    }
    
    // Initialize
    createUniverseElements();
    animate();
}); 