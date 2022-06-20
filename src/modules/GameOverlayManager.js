import anime from "animejs/lib/anime.es.js";

class GameOverlayManager {
    static showDieOverlay() {
        anime({
            targets: ".die-overlay",
            keyframes: [{ opacity: 1 }, { opacity: 0 }],
            duration: 700,
        });
    }

    static showReloadOverlay() {
        anime({
            targets: ".restart-overlay",
            keyframes: [{ opacity: 1 }, { opacity: 0 }],
            duration: 1500,
        });
    }
}

export { GameOverlayManager };
