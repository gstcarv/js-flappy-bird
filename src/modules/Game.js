import { Player } from "./Player";
import { GameBackground } from "./GameBackground";
import { PipeGenerator } from "./PipeGenerator";
import { CollisionDetector } from "./CollisionDetector";
import { PlayerControl } from "./PlayerControl";
import { AudioManager } from "./AudioManager";
import { PointManager } from "./PointManager";
import { MenuManager } from "./MenuManager";
import { GameOverlayManager } from "./GameOverlayManager";

class Game {
    static isOver = false;
    static isStarted = false;
    static canRestart = false;

    constructor() {
        this.gameContainer = document.querySelector("#game");
        MenuManager.setup();

        this.setupGame();
    }

    setupGame() {
        Game.canRestart = false;

        MenuManager.showInstructions();
        PointManager.setup();

        new GameBackground(this.gameContainer);

        this.player = new Player(this.gameContainer);

        // only creates a new player control if needed to avoid event listener duplication
        if (!this.playerControl) {
            this.playerControl = new PlayerControl(this, this.player);
        } else {
            this.playerControl.player = this.player;
        }
    }

    startGame() {
        // reset game status
        Game.isStarted = true;
        Game.isOver = false;

        // create the obstables generator
        new PipeGenerator(this.gameContainer, this.player);

        // detect game collision
        new CollisionDetector(this.player, () => {
            // set game over
            if (!Game.isOver) {
                Game.isOver = true;
                this.player.overFall();

                AudioManager.hit();
                AudioManager.die();

                GameOverlayManager.showDieOverlay();

                MenuManager.showInstructions();

                clearInterval(PipeGenerator.generateInterval);

                setTimeout(() => (Game.canRestart = true), 1000);
            }
        });

        new PointManager(this.player);
    }

    restart() {
        // delete all existing data from last game
        document.querySelectorAll(".pipe-obstacle").forEach((o) => o.remove());
        document.querySelector(".floor").remove();
        document.querySelector(".player").remove();

        clearInterval(PipeGenerator.generateInterval);

        // restart the game
        Game.isOver = false;
        Game.isStarted = false;

        this.setupGame();
    }
}

export { Game };
