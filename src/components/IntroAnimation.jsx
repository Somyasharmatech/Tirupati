import React, { useEffect, useState } from 'react';
import logo from '../assets/logo.png';

const IntroAnimation = ({ onComplete }) => {
    const [fadeOut, setFadeOut] = useState(false);

    useEffect(() => {
        // Start fade out after 3.5 seconds
        const timer = setTimeout(() => {
            setFadeOut(true);
        }, 3500);

        // Complete animation after 4 seconds (total duration)
        const completeTimer = setTimeout(() => {
            onComplete();
        }, 4000);

        return () => {
            clearTimeout(timer);
            clearTimeout(completeTimer);
        };
    }, [onComplete]);

    return (
        <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black transition-opacity duration-500 ${fadeOut ? 'opacity-0' : 'opacity-100'}`}>
            <div className="animate-netflix-intro">
                <img
                    src={logo}
                    alt="Tirupati Guest House"
                    className="w-64 h-auto md:w-96 object-contain"
                />
            </div>
        </div>
    );
};

export default IntroAnimation;
