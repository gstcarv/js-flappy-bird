import Wing from "../assets/audio/wing.ogg";
import Hit from "../assets/audio/hit.ogg";
import Point from "../assets/audio/point.ogg";
import Die from "../assets/audio/die.ogg";

class AudioManager {
    static flap() {
        new Audio(Wing).play();
    }

    static hit() {
        new Audio(Hit).play();
    }

    static point() {
        new Audio(Point).play();
    }

    static die() {
        new Audio(Die).play();
    }
}

export { AudioManager };
