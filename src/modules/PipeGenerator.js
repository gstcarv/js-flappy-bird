import { config } from "../config";
import { PipeObstacle } from "./PipeObstacle";

class PipeGenerator {
    static generateInterval;

    constructor(gameContainer, player) {
        this.gameContainer = gameContainer;
        this.player = player;

        this.setup();
    }

    setup() {
        // creates the initial pipe
        new PipeObstacle(this.gameContainer, this.player);

        // creates pipe each distance seconds
        PipeGenerator.generateInterval = setInterval(() => new PipeObstacle(this.gameContainer, this.player), config.pipe.distance);
    }
}

export { PipeGenerator };
