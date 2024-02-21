"use client";

import { ZumaBallList } from "@/components/ZumaBallList/ZumaBallList";
import ZumaFrog from "@/components/ZumaFrog/ZumaFrog";
import { ZumaBall } from "@/types/ZumaBall";

import Image from "next/image";
import { useEffect, useState } from "react";

// Game events ---
import { generateBall } from "./GameEvents";
import { ZumaBallChainEvent } from "./GameEvents";


export const ZumaGame = () => {
    
    const BALL_OFFSET_X = 100;
    const BALL_OFFSET_Y = -10;

    const [currentBall, setCurrentBall] = useState<ZumaBall | null>(null);
    const [nextBall, setNextBall] = useState<ZumaBall | null>(null);
    const [shootingBall, setShootingBall] = useState<ZumaBall | null> (null);
    const [flyingBall, setFlyingBall] = useState<{ x_position: number, y_position: number, visible: boolean }>({ x_position: 0, y_position: 0, visible: false });
    const [shootingAngle, setShootingAngle] = useState<number>(0);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            const frogPosition = { x: window.innerWidth / 2, y: window.innerHeight };
            const angle = Math.atan2(e.clientY - frogPosition.y, e.clientX - frogPosition.x);
            setShootingAngle(angle);
        };

        window.addEventListener('mousemove', handleMouseMove);

        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    const shootCurrentBallAndPrepareNext = () => {
        if (!currentBall) return; // Ensure there is a ball to shoot
    
        const frogPositionX = window.innerWidth / 2 + BALL_OFFSET_X;
        const frogPositionY = window.innerHeight + BALL_OFFSET_Y;
    
        setFlyingBall({ x_position: frogPositionX, y_position: frogPositionY, visible: true });
    
        const animateBall = () => {
            setFlyingBall(prevState => {
                const speed = 0.10;
                const newX = prevState.x_position + Math.cos(shootingAngle) * (speed * 0.5);
                const newY = prevState.y_position + Math.sin(shootingAngle) * (speed * 0.5);
    
                // Stop the animation when the ball goes off-screen
                if (newY < 0 || newX < 0 || newX > window.innerWidth) {
                    return { ...prevState, visible: false };
                } else {
                    requestAnimationFrame(animateBall);
                    return { ...prevState, x_position: newX, y_position: newY };
                }
            });
        };
    
        requestAnimationFrame(animateBall);
    
        // Set shootingBall for rendering the flying ball's image
        setShootingBall(currentBall);
    
        // Update the balls after capturing the current one
        setCurrentBall(nextBall);
        setNextBall(generateBall());
    };

    useEffect(() => {
        setCurrentBall(generateBall());
        setNextBall(generateBall());
    }, []);

    if (!currentBall || !nextBall) return null;

    return (
        <>
            {flyingBall.visible && shootingBall && (
                <div style={{ position: 'absolute', left: flyingBall.x_position, top: flyingBall.y_position }}>
                    <Image src={shootingBall.image} width={100} height={100} alt="Flying Ball" />
                </div>
            )}
            <ZumaBallList frogBall={currentBall} generateNewBall={shootCurrentBallAndPrepareNext} zumaChainEffect={ZumaBallChainEvent} />
            <ZumaFrog currentZumaBall={currentBall} nextZumaBall={nextBall} shootCurrentBall={shootCurrentBallAndPrepareNext} />
        </>
    );
};
