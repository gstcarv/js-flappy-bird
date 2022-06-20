import anime from "animejs/lib/anime.es.js";
import { debounce } from "debounce";

import BirdMidFlap from "../assets/sprites/redbird-midflap.png";
import BirdUpFlap from "../assets/sprites/redbird-upflap.png";
import BirdDownFlap from "../assets/sprites/redbird-downflap.png";
import { Game } from "./Game";
import { AudioManager } from "./AudioManager";

const FLAP_STATES = {
    UP: 0,
    DOWN: 1,
    MID: 2,
};

class Player {
    playerElement = null;

    constructor(gameContainer) {
        this.gameContainer = gameContainer;
        this.setup();
        this.setupAnimation();
    }

    flap() {
        if (Game.isOver) return;

        if (this.topPosition <= 0) return;

        AudioManager.flap();

        this.playerElement.style.animation = "none";
        this.flapState = FLAP_STATES.DOWN;
        this.topPosition = this.topPosition - 9;

        // Stops previous actions if exists
        this.fallAnimation?.pause();
        this.flapAnimation?.pause();
        this.fallRotateAnimation?.pause();

        // Debounce fall to fall bird after the last flap only
        if (!this.debouncedFall) {
            this.debouncedFall = debounce(this.beginFall.bind(this), 200);
        }

        // Creates animation to flap the bird
        this.flapAnimation = anime({
            targets: this.playerElement,
            top: {
                value: this.topPosition + "%",
                duration: 1000,
            },
            rotate: {
                value: -30,
                duration: 300,
            },
            begin: this.debouncedFall,
        });
    }

    beginFall() {
        if (Game.isOver) return;

        this.flapAnimation?.pause();
        this.fallRotateAnimation?.pause();

        // Creates animation to fall bird
        this.fallAnimation = anime({
            targets: this.playerElement,
            top: {
                value: "83%",
                duration: 9000,
            },
            update: (anim) => {
                this.topPosition = Number(this.playerElement.style.top.toString().replace("%", ""));
            },
        });

        this.fallRotateAnimation = anime({
            targets: this.playerElement,
            rotate: { value: 70, duration: 600 },
            easing: "easeInOutCubic",
            delay: 100,
        });

        // Removes the fall debounce
        this.debouncedFall = null;
    }

    setup() {
        // Creates the player bird and defines its default position
        const element = document.createElement("div");
        element.style.backgroundImage = `url(${BirdDownFlap})`;
        element.classList.add("player");

        this.topPosition = 40;
        element.style.top = this.topPosition + "%";
        element.style.left = "20%";

        // Add player to the container
        this.playerElement = element;
        this.gameContainer.append(element);
    }

    setupAnimation() {
        this.flapState = FLAP_STATES.MID;

        // Animates the bird flaps
        this.flatAnimationInterval = setInterval(() => {
            if (this.flapState === FLAP_STATES.MID) {
                this.flapState = FLAP_STATES.UP;
            } else if (this.flapState === FLAP_STATES.DOWN) {
                this.flapState = FLAP_STATES.MID;
            } else if (this.flapState === FLAP_STATES.UP) {
                this.flapState = FLAP_STATES.DOWN;
            }

            this.renderFlapState();
        }, 100);
    }

    renderFlapState() {
        const FlapImages = {
            [FLAP_STATES.DOWN]: BirdDownFlap,
            [FLAP_STATES.UP]: BirdUpFlap,
            [FLAP_STATES.MID]: BirdMidFlap,
        };

        this.playerElement.style.backgroundImage = `url(${FlapImages[this.flapState]})`;
    }

    overFall() {
        clearInterval(this.flatAnimationInterval);

        this.fallAnimation?.pause();
        this.flapAnimation?.pause();
        this.fallRotateAnimation?.pause();

        anime({
            targets: this.playerElement,
            top: `85%`,
            rotate: {
                value: 90,
                duration: 50,
            },
            duration: 300,
            easing: "linear",
        });
    }
}

export { Player };
