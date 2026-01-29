/**
 * 3D Particle Animation for Index Page
 */

class Particle3D {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.particleCount = 100;

        this.init();
        this.animate();

        window.addEventListener('resize', () => this.resize());
    }

    init() {
        this.resize();
        this.particles = [];

        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                z: Math.random() * 1000,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                vz: (Math.random() - 0.5) * 2,
                size: Math.random() * 2 + 1,
                opacity: Math.random() * 0.5 + 0.3,
                hue: 180 + Math.random() * 20 // Cyan-ish colors
            });
        }
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.particles.forEach(particle => {
            // Update position
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.z += particle.vz;

            // Wrap around screen
            if (particle.x < 0) particle.x = this.canvas.width;
            if (particle.x > this.canvas.width) particle.x = 0;
            if (particle.y < 0) particle.y = this.canvas.height;
            if (particle.y > this.canvas.height) particle.y = 0;
            if (particle.z < 0) particle.z = 1000;
            if (particle.z > 1000) particle.z = 0;

            // Calculate 3D perspective
            const scale = 1000 / (1000 + particle.z);
            const x2d = particle.x * scale + (this.canvas.width * (1 - scale)) / 2;
            const y2d = particle.y * scale + (this.canvas.height * (1 - scale)) / 2;
            const size = particle.size * scale;

            // Draw particle with glow
            this.ctx.save();

            // Outer glow
            const gradient = this.ctx.createRadialGradient(x2d, y2d, 0, x2d, y2d, size * 4);
            gradient.addColorStop(0, `hsla(${particle.hue}, 100%, 70%, ${particle.opacity * scale})`);
            gradient.addColorStop(0.5, `hsla(${particle.hue}, 100%, 60%, ${particle.opacity * scale * 0.3})`);
            gradient.addColorStop(1, 'transparent');

            this.ctx.fillStyle = gradient;
            this.ctx.beginPath();
            this.ctx.arc(x2d, y2d, size * 4, 0, Math.PI * 2);
            this.ctx.fill();

            // Core
            this.ctx.fillStyle = `hsla(${particle.hue}, 100%, 90%, ${particle.opacity * scale})`;
            this.ctx.beginPath();
            this.ctx.arc(x2d, y2d, size, 0, Math.PI * 2);
            this.ctx.fill();

            this.ctx.restore();

            // Draw connections to nearby particles
            this.particles.forEach(other => {
                const dx = particle.x - other.x;
                const dy = particle.y - other.y;
                const dz = particle.z - other.z;
                const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

                if (distance < 150) {
                    const opacity = (1 - distance / 150) * 0.15;
                    const scale1 = 1000 / (1000 + particle.z);
                    const scale2 = 1000 / (1000 + other.z);

                    const x1 = particle.x * scale1 + (this.canvas.width * (1 - scale1)) / 2;
                    const y1 = particle.y * scale1 + (this.canvas.height * (1 - scale1)) / 2;
                    const x2 = other.x * scale2 + (this.canvas.width * (1 - scale2)) / 2;
                    const y2 = other.y * scale2 + (this.canvas.height * (1 - scale2)) / 2;

                    this.ctx.strokeStyle = `rgba(0, 229, 255, ${opacity})`;
                    this.ctx.lineWidth = 0.5;
                    this.ctx.beginPath();
                    this.ctx.moveTo(x1, y1);
                    this.ctx.lineTo(x2, y2);
                    this.ctx.stroke();
                }
            });
        });

        requestAnimationFrame(() => this.animate());
    }
}

// Initialize when page loads
if (window.location.pathname.includes('index.html') || window.location.pathname === '/' || window.location.pathname.endsWith('/')) {
    window.addEventListener('DOMContentLoaded', () => {
        const canvas = document.getElementById('particle-canvas');
        if (canvas) {
            new Particle3D(canvas);
        }
    });
}
