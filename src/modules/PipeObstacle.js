import DefaultPipeImage from "../assets/sprites/pipe-green.png";
import { config } from "../config";
import { Game } from "./Game";
import { PointManager } from "./PointManager";

class PipeObstacle {
    constructor(gameContainer, player) {
        this.gameContainer = gameContainer;
        this.player = player;

        this.setup();

        requestAnimationFrame(this.startMoving.bind(this));
    }

    setup() {
        this.pointRecorded = false;

        // Creates the pipe element
        const topPipe = document.createElement("div");
        const bottomPipe = document.createElement("div");

        topPipe.classList.add("pipe-obstacle");
        bottomPipe.classList.add("pipe-obstacle");

        topPipe.classList.add("pipe-top");
        bottomPipe.classList.add("pipe-bottom");

        topPipe.style.backgroundImage = `url(${DefaultPipeImage})`;
        bottomPipe.style.backgroundImage = `url(${DefaultPipeImage})`;

        topPipe.style.transform = "rotate(180deg)";

        // Insert the pipe in the game
        this.gameContainer.append(topPipe);
        this.gameContainer.append(bottomPipe);

        this.topPipe = topPipe;
        this.bottomPipe = bottomPipe;

        this.setupPipePosition();
    }

    setupPipePosition() {
        const boundingsOffset = 200;

        // Creates the position for the pipe
        let pipeHeight = Math.random() * (window.innerHeight - config.floor.size - boundingsOffset);

        if (pipeHeight < boundingsOffset) {
            pipeHeight = boundingsOffset;
        }

        this.topPipe.style.height = `${pipeHeight}px`;
        this.bottomPipe.style.height = `${window.innerHeight - pipeHeight - config.pipe.secureSpace}px`;

        this.topPipe.style.top = "0px";
        this.bottomPipe.style.bottom = "0px";

        // Creates pipe horizontal position
        this.position = window.innerWidth;

        this.bottomPipe.style.left = `${this.position}px`;
        this.topPipe.style.left = `${this.position}px`;
    }

    startMoving() {
        if (Game.isOver) return;

        this.position -= config.speed;

        this.bottomPipe.style.left = `${this.position}px`;
        this.topPipe.style.left = `${this.position}px`;

        if (this.position < this.player.playerElement.getBoundingClientRect().left && !this.pointRecorded) {
            PointManager.addPoint();
            this.pointRecorded = true;
        }

        requestAnimationFrame(this.startMoving.bind(this));
    }
}

export { PipeObstacle };
