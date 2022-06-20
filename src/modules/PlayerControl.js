import { Game } from "./Game";
import { GameOverlayManager } from "./GameOverlayManager";
import { MenuManager } from "./MenuManager";
import { AgentUtils } from "../utils/AgentUtils";

class PlayerControl {
    static listenersWasSet = false;

    constructor(game, player) {
        this.game = game;
        this.player = player;

        if (AgentUtils.isMobile()) {
            document.addEventListener("touchstart", () => this.handleAction());
        } else {
            document.addEventListener("click", () => this.handleAction());
            document.addEventListener("keydown", () => this.handleAction());
        }
    }

    handleAction() {
        // starts a new game
        if (!Game.isStarted && !Game.isOver) {
            MenuManager.hideInstructions();
            this.game.startGame();
            return this.player.flap();
        }

        // flaps the user
        if (!Game.isOver) {
            // flap and hide the instructions
            this.player.flap();
            return MenuManager.hideInstructions();
        }

        // restarts the game
        if (Game.canRestart) {
            // restart game if the game is over
            GameOverlayManager.showReloadOverlay();
            setTimeout(() => this.game.restart(), 500);
        }
    }
}

export { PlayerControl };
