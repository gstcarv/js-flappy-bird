import { AudioManager } from "./AudioManager";

class PointManager {
    static totalPoints = 0;

    static setup() {
        PointManager.totalPoints = 0;
        this.renderPoints();
    }

    static async addPoint() {
        AudioManager.point();
        PointManager.totalPoints++;

        this.renderPoints();
    }

    static async renderPoints() {
        const pointsContainer = document.querySelector(".points-container");

        const pointsChar = this.totalPoints.toString().split("");
        const pointsSprites = await Promise.all(pointsChar.map((p) => import(`../assets/sprites/${p}.png`)));

        pointsContainer.innerHTML = "";

        pointsSprites.forEach((sprite) => {
            const pointImage = document.createElement("img");
            pointImage.setAttribute("src", sprite.default);

            pointsContainer.append(pointImage);
        });
    }
}

export { PointManager };
