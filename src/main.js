// ✅ 이 줄을 제일 첫 줄에 추가!
import Phaser from "phaser";

import SmokeScene from "./scenes/SmokeScene.js";
import LobbyScene from "./scenes/LobbyScene.js";
import MainHallScene from "./scenes/MainHallScene.js";
import WestCorridorScene from "./scenes/WestCorridorScene.js";
// 각 층별 복도신
import Corridor2F1Scene from "./scenes/2f-1CorridorScene.js";
import Corridor2F2Scene from "./scenes/2f-2CorridorScene.js";
import Corridor3F1Scene from "./scenes/3f-1CorridorScene.js";
import Corridor3F2Scene from "./scenes/3f-2CorridorScene.js";
import Corridor4F1Scene from "./scenes/4f-1CorridorScene.js";
import Corridor4F2Scene from "./scenes/4f-2CorridorScene.js";
import Corridor5F1Scene from "./scenes/5f-1CorridorScene.js";
import Corridor5F2Scene from "./scenes/5f-2CorridorScene.js";
import Corridor6F1Scene from "./scenes/6f-1CorridorScene.js";
import Corridor6F2Scene from "./scenes/6f-2CorridorScene.js";
import Corridor7F1Scene from "./scenes/7f-1CorridorScene.js";
import Corridor7F2Scene from "./scenes/7f-2CorridorScene.js";
import Corridor8F1Scene from "./scenes/8f-1CorridorScene.js";
import Corridor8F2Scene from "./scenes/8f-2CorridorScene.js";

window.collectedNumbers = {};

const images = import.meta.glob(
    "./assets/*.png",
    { eager: true, import: "default" }
);

const GAME_WIDTH = 1280;
const GAME_HEIGHT = 720;
const PLAYER_SPEED = 3;
const PLAYER_SCALE = 0.07;
const ANIMATION_TICK = 8;

const BLOCKED = {
    BUILDING: { x1: 0, x2: 1280, y1: 120, y2: 370 },
    PARKING_RIGHT: { x1: 1180, x2: 1280, y1: 380, y2: 540 }
};

const SMOKE_ZONE = {
    x1: 0, x2: 80, y1: 380, y2: 540
};

class MainScene extends Phaser.Scene {
    constructor() {
        super("MainScene");
    }
    preload() {
        Object.entries(images).forEach(([path, image]) => {
            const key = path.split("/").pop().replace(".png", "");
            this.load.image(key, image);
        });
    }
    create() {
        const startX = 640;
        const startY = 650;
        const bg = this.add.image(GAME_WIDTH / 2, GAME_HEIGHT / 2, "campus");
        bg.setDisplaySize(GAME_WIDTH, GAME_HEIGHT);
        this.player = this.add.image(startX, startY, "player_down_idle").setScale(PLAYER_SCALE);
        this.currentDirection = "down";
        this.frameIndex = 0;
        this.frameTimer = 0;
        this.isTransitioning = false;
        this.keys = this.input.keyboard.addKeys({
            w: Phaser.Input.Keyboard.KeyCodes.W,
            a: Phaser.Input.Keyboard.KeyCodes.A,
            s: Phaser.Input.Keyboard.KeyCodes.S,
            d: Phaser.Input.Keyboard.KeyCodes.D
        });
    }
    getWalkFrames(direction) {
        return [
            `player_${direction}_idle`,
            `player_${direction}_1`,
            `player_${direction}_idle`,
            `player_${direction}_2`
        ];
    }
    getIdleTexture(direction) {
        return `player_${direction}_idle`;
    }
    update() {
        if (this.isTransitioning) return;
        const oldX = this.player.x;
        const oldY = this.player.y;
        let dx = 0, dy = 0;
        if (this.keys.w.isDown) dy -= 1;
        if (this.keys.s.isDown) dy += 1;
        if (this.keys.a.isDown) dx -= 1;
        if (this.keys.d.isDown) dx += 1;
        const isMoving = dx !== 0 || dy !== 0;
        if (isMoving) {
            const len = Math.hypot(dx, dy);
            dx /= len; dy /= len;
            this.currentDirection = Math.abs(dx) >= Math.abs(dy)
                ? (dx > 0 ? "right" : "left")
                : (dy > 0 ? "down" : "up");
        }
        this.player.x += dx * PLAYER_SPEED;
        this.player.y += dy * PLAYER_SPEED;
        this.player.x = Phaser.Math.Clamp(this.player.x, 20, GAME_WIDTH - 20);
        this.player.y = Phaser.Math.Clamp(this.player.y, 20, GAME_HEIGHT - 20);

        if (this.player.x > SMOKE_ZONE.x1 && this.player.x < SMOKE_ZONE.x2 &&
            this.player.y > SMOKE_ZONE.y1 && this.player.y < SMOKE_ZONE.y2) {
            this.isTransitioning = true;
            this.scene.start("SmokeScene");
            return;
        }
        if (this.player.x > 500 && this.player.x < 780 &&
            this.player.y > 150 && this.player.y < 350) {
            if (!this.isTransitioning) {
                this.isTransitioning = true;
                this.scene.start("LobbyScene");
                return;
            }
        }
        if (this.player.x > BLOCKED.BUILDING.x1 && this.player.x < BLOCKED.BUILDING.x2 &&
            this.player.y > BLOCKED.BUILDING.y1 && this.player.y < BLOCKED.BUILDING.y2) {
            this.player.x = oldX;
            this.player.y = oldY;
        }
        if (this.player.x > BLOCKED.PARKING_RIGHT.x1 && this.player.x < BLOCKED.PARKING_RIGHT.x2 &&
            this.player.y > BLOCKED.PARKING_RIGHT.y1 && this.player.y < BLOCKED.PARKING_RIGHT.y2) {
            this.player.x = oldX;
            this.player.y = oldY;
        }
        const walkFrames = this.getWalkFrames(this.currentDirection);
        if (isMoving) {
            this.frameTimer++;
            if (this.frameTimer > ANIMATION_TICK) {
                this.frameTimer = 0;
                this.frameIndex = (this.frameIndex + 1) % walkFrames.length;
                this.player.setTexture(walkFrames[this.frameIndex]);
            }
        } else {
            this.player.setTexture(this.getIdleTexture(this.currentDirection));
            this.frameIndex = 0;
            this.frameTimer = 0;
        }
    }
}

const config = {
    type: Phaser.AUTO,
    parent: "game",
    backgroundColor: "#000000",
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: GAME_WIDTH,
        height: GAME_HEIGHT
    },
    scene: [
        MainScene, SmokeScene, LobbyScene, MainHallScene, WestCorridorScene,
        Corridor2F1Scene, Corridor2F2Scene, Corridor3F1Scene, Corridor3F2Scene,
        Corridor4F1Scene, Corridor4F2Scene, Corridor5F1Scene, Corridor5F2Scene,
        Corridor6F1Scene, Corridor6F2Scene, Corridor7F1Scene, Corridor7F2Scene,
        Corridor8F1Scene, Corridor8F2Scene
    ]
};

new Phaser.Game(config);