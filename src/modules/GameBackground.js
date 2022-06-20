import GameBackgroundImage from "../assets/sprites/background-day.png";
import FloorImage from "../assets/sprites/base.png";
import { config } from "../config";
import { Game } from "./Game";

class GameBackground {
    constructor(gameContainer) {
        this.gameContainer = gameContainer;

        this.setup();
        requestAnimationFrame(this.startAnimation.bind(this));
    }

    setup() {
        // Set game background image
        this.gameContainer.style.backgroundImage = `url(${GameBackgroundImage})`;

        // Create floor
        const floor = document.createElement("div");
        floor.classList.add("floor");
        floor.style.backgroundImage = `url(${FloorImage})`;
        floor.style.height = `${config.floor.size}px`;

        this.floor = floor;
        this.gameContainer.append(floor);

        this.floorPosition = 0;
        this.backgroundPosition = 0;
    }

    startAnimation() {
        if (Game.isOver) return;

        this.floorPosition += config.speed;
        this.floor.style.backgroundPosition = `${-this.floorPosition}px 0`;

        requestAnimationFrame(this.startAnimation.bind(this));
    }
}

export { GameBackground };
