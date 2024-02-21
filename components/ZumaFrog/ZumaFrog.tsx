"use client";
import React, { useState, useEffect, SetStateAction, Dispatch } from 'react';
import Image from 'next/image';
import { ZumaBall } from '@/types/ZumaBall';

type props = {
    currentZumaBall: ZumaBall,
    nextZumaBall: ZumaBall,
    shootCurrentBall: () => void
}

const ZumaFrog = ({ currentZumaBall, nextZumaBall, shootCurrentBall }: props) => {
    const [rotation, setRotation] = useState<number>(0);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            const { clientX, clientY } = e;
            const centerX = window.innerWidth / 2;
            // Use a fixed point at the bottom of the screen for centerY
            const centerY = window.innerHeight;
            let angle = Math.atan2(clientY - centerY, clientX - centerX) * (180 / Math.PI) + 90;

            // Constrain the angle to between -90 and 90 degrees
            angle = Math.max(-90, Math.min(angle, 90));

            setRotation(angle);
        };

        window.addEventListener('mousemove', handleMouseMove);

        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <div
            className="zuma-frog fixed left-1/2 bottom-0 transform -translate-x-1/2 -translate-y-1/2"
            style={{ transform: `rotate(${rotation}deg)` }} // Keep rotation inline as it's dynamic
        >
            {/* Container for the frog and the ball */}
            <div className="relative">
                <Image src={"/zuma-frog.svg"} height={200} width={200} alt='Zuma frog' />
                {/* Position the ball */}
                <div className="absolute left-1/2 top-[-10%] -z-10 transform -translate-x-1/2 -translate-y-1/2">
                    <Image src={currentZumaBall.image} height={100} width={100} alt='Ball' />
                </div>
                <div className="absolute left-[49%] top-1/2 z-10 transform -translate-x-1/2 -translate-y-1/2">
                    <Image src={nextZumaBall.image} height={50} width={50} alt='Ball' />
                </div>
            </div>
        </div>
    );
};

export default ZumaFrog;
