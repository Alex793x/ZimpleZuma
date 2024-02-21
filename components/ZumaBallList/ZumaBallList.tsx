"use client";
import React, { useState, useEffect, Dispatch, SetStateAction } from 'react';
import LinkedList from "@/components/LinkedList/LinkedList";
import { SuperPower } from "@/types/SuperPower";
import { ZumaBall } from "@/types/ZumaBall";
import Image from "next/image";

type props = {
    frogBall: ZumaBall,
    generateNewBall: () => void
    zumaChainEffect: (position: number, shootingBall: ZumaBall, linkedList: LinkedList<ZumaBall>) => void
}

export const ZumaBallList = ({ frogBall, generateNewBall, zumaChainEffect }: props) => {
    const [zumaBallList, setZumaBallList] = useState(new LinkedList<ZumaBall>());
    const [updateTrigger, setUpdateTrigger] = useState(false); // Simple flag to trigger re-render

    useEffect(() => {
        const interval = setInterval(() => {
            if (zumaBallList.size() < 15) {
                const randomChance = Math.random();
                let ballSuperPower = SuperPower.NO_SUPER_POWER;

                // With 10% chance, assign a random superpower
                if (randomChance < 0.1) {
                    ballSuperPower = Math.floor(Math.random() * 4); // Adjusted for enum indexing
                }

                const newBall: ZumaBall = {
                    image: `${Math.floor(Math.random() * 5) + 1}.svg`,
                    superPower: ballSuperPower
                };

                zumaBallList.add(newBall); // Directly add the new ball to the list
                setUpdateTrigger(!updateTrigger); // Toggle the flag to trigger re-render
            }
        }, 2000);

        return () => clearInterval(interval); // Clean up component on dismount
    }, [updateTrigger]); // Effect depends on the updateTrigger flag

    const handleCaretClick = (position: number) => {
        zumaChainEffect(position, frogBall, zumaBallList)
        generateNewBall()
        console.log(`Shooting ball {${frogBall.image}, ${frogBall.superPower}} at position ${position}`);
        // Update the state to trigger a re-render
        setUpdateTrigger(!updateTrigger);

        zumaBallList.dumpList()
    };

    const renderBalls = () => {
        const balls = zumaBallList.copyToArray();
        const ballElements = balls.flatMap((ball, index) => [
            <div key={`ball-${index}`} className="flex items-baseline min-h-screen">
                <Image src={ball.image} width={100} height={100} alt="Ball" />
                {index < balls.length - 1 && (
                    <button onClick={() => handleCaretClick(index + 1)} className="text-center scale-150 mx-2">
                        ^
                    </button>
                )}
            </div>
        ]);
    
        return ballElements;
    };
    

    return (
        <div className={'flex'} style={{ width: '100%', textAlign: 'left' }}>
            {renderBalls()}
        </div>
    );
};
