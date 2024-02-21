
export enum SuperPower {
    EXPLODE = 1,
    REWIND = 2,
    PAIR_EXPLODE = 3,
    NO_SUPER_POWER = 4
}

export const generateSuperPower = () => {
    const randomChance = Math.random();
    let ballSuperPower = SuperPower.NO_SUPER_POWER;

    if (randomChance < 0.1) {
        ballSuperPower = Math.floor(Math.random() * 4);
    }

    return ballSuperPower;
};