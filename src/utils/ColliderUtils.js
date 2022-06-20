export const ColliderUtils = {
    isCollide(a, b) {
        const aRect = a.getBoundingClientRect();
        let bRect = b.getBoundingClientRect();

        return !(aRect.top + aRect.height < bRect.top + 15 || aRect.top > bRect.top + bRect.height - 10 || aRect.left + aRect.width < bRect.left + 30 || aRect.left > bRect.left + bRect.width - 20);
    },
};
