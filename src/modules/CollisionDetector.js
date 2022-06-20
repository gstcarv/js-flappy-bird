import collider from "collider-js";
import { ColliderUtils } from "../utils/ColliderUtils";

class CollisionDetector {
    constructor(player, onColide = () => {}) {
        this.player = player;
        this.onColide = onColide;

        requestAnimationFrame(this.listenForCollisions.bind(this));
    }

    listenForCollisions() {
        const existingPipes = document.querySelectorAll(".pipe-obstacle");

        existingPipes.forEach((element) => {
            if (ColliderUtils.isCollide(element, this.player.playerElement)) {
                this.onColide();
            }
        });

        const floorElement = document.querySelector(".floor");

        if (ColliderUtils.isCollide(floorElement, this.player.playerElement)) {
            this.onColide();
        }

        requestAnimationFrame(this.listenForCollisions.bind(this));
    }
}

export { CollisionDetector };
