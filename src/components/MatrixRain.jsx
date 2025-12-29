import { useRef, useEffect } from 'react';

const MatrixRain = ({ theme, mode }) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let width = window.innerWidth;
        let height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;

        // Initial Fill to prevent white background flash
        ctx.fillStyle = theme === 'dark' ? '#020202' : '#f0f2f5';
        ctx.fillRect(0, 0, width, height);

        const fontSize = 14;
        const columns = Math.floor(width / fontSize);
        const drops = [];
        // Initialize drops
        for (let i = 0; i < columns; i++) {
            drops[i] = Math.random() * -100; // Start above screen
        }

        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$#@%&*<>[]{}";

        const draw = () => {
            // Fade effect - using pure black for dark mode to avoid grey buildup/haze
            // We use a very slight opacity to create trails, but keep it dark
            const fadeColor = theme === 'dark' ? "rgba(2, 2, 2, 0.1)" : "rgba(240, 242, 245, 0.15)";
            ctx.fillStyle = fadeColor;
            ctx.fillRect(0, 0, width, height);

            // Text attributes
            ctx.font = `${fontSize}px 'JetBrains Mono', monospace`;

            for (let i = 0; i < drops.length; i++) {
                const text = chars.charAt(Math.floor(Math.random() * chars.length));

                // Reduced frequency of white characters for a darker, sleeker look
                const isWhite = Math.random() > 0.995;

                if (theme === 'dark') {
                    // Dark Mode: White rain for visibility (brighter)
                    const opacity = 0.5 + Math.random() * 0.5; // Increased min from 0.3 to 0.5
                    ctx.fillStyle = isWhite ? "#ffffff" : `rgba(255, 255, 255, ${opacity})`;
                } else {
                    // Light Mode: Red rain (brighter)
                    const opacity = 0.6 + Math.random() * 0.4; // Increased min from 0.4 to 0.6
                    ctx.fillStyle = isWhite ? "#000000" : `rgba(220, 38, 38, ${opacity})`;
                }

                ctx.fillText(text, i * fontSize, drops[i] * fontSize);

                if (drops[i] * fontSize > height && Math.random() > 0.985) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
        };

        let animationId;
        const animate = () => {
            draw();
            animationId = requestAnimationFrame(animate);
        };
        animate();

        const handleResize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
            // Refill on resize to avoid white patches
            ctx.fillStyle = theme === 'dark' ? '#020202' : '#f0f2f5';
            ctx.fillRect(0, 0, width, height);
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationId);
        };
    }, [theme]);

    // Adjust opacity to be subtle but visible
    const getOpacity = () => {
        if (mode === 'landing') return 0.5;
        return 0.15;
    };

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none transition-opacity duration-1000"
            style={{ opacity: getOpacity(), zIndex: 0 }}
        />
    );
};

export default MatrixRain;
