import { useRef } from 'react';

const BentoCard = ({ children, className = '', href, onClick, ...props }) => {
    const cardRef = useRef(null);

    const handleMouseMove = (e) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        cardRef.current.style.setProperty('--x', `${x}px`);
        cardRef.current.style.setProperty('--y', `${y}px`);

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const isLarge = className.includes('span-full') || className.includes('span-2x2') || className.includes('span-2w');
        const divisor = isLarge ? 60 : 20;

        const rotateX = (y - centerY) / divisor;
        const rotateY = (centerX - x) / divisor;

        cardRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.01, 1.01, 1.01)`;
    };

    const handleMouseLeave = () => {
        if (!cardRef.current) return;
        cardRef.current.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    };

    const Component = href ? 'a' : 'div';

    return (
        <Component
            ref={cardRef}
            href={href}
            onClick={onClick}
            className={`card ${className}`}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            target={href ? "_blank" : undefined}
            rel={href ? "noreferrer" : undefined}
            {...props}
        >
            <div className="card-content w-full h-full">
                {children}
            </div>
        </Component>
    );
};

export default BentoCard;
