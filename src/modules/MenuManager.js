import GameInstructions from "../assets/sprites/message.png";

class MenuManager {
    static setup() {
        const element = document.createElement("img");
        element.setAttribute("src", GameInstructions);
        element.classList.add("game-instructions");

        document.querySelector("#game").append(element);
    }

    static showInstructions() {
        document.querySelector(".game-instructions").style.opacity = 1;
    }

    static hideInstructions() {
        document.querySelector(".game-instructions").style.opacity = 0;
    }
}

export { MenuManager };
