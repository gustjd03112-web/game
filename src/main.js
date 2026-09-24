import Phaser from "phaser";
import SmokeScene from "./scenes/SmokeScene";
import ExScene from "./scenes/ExScene";
import LobbyScene from "./scenes/LobbyScene";
import WestCorridorScene from "./scenes/WestCorridorScene";

// .png 파일만 불러오기
const images = import.meta.glob(
    "./assets/*.png",
    {
        eager: true,
        import: "default"
    }
);

// 게임 상수
const GAME_WIDTH = 1280;
const GAME_HEIGHT = 720;
const PLAYER_SPEED = 3;
const PLAYER_SCALE = 0.07;
const ANIMATION_TICK = 8;

// 충돌 영역
const BLOCKED = {
    BUILDING: { x1: 0, x2: 1280, y1: 120, y2: 370 },
    PARKING_RIGHT: { x1: 1180, x2: 1280, y1: 380, y2: 540 }
};

// 흡연장 자동 이동 영역
const SMOKE_ZONE = {
    x1: 0,
    x2: 80,
    y1: 380,
    y2: 540
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
        // 메인 입구에서 시작
        const startX = 640;
        const startY = 650;

        // 배경
        const bg = this.add.image(GAME_WIDTH / 2, GAME_HEIGHT / 2, "campus");
        bg.setDisplaySize(GAME_WIDTH, GAME_HEIGHT);

        // 플레이어
        this.player = this.add.image(startX, startY, "player_down_idle")
            .setScale(PLAYER_SCALE);

        this.currentDirection = "down";
        this.frameIndex = 0;
        this.frameTimer = 0;
        this.isTransitioning = false;

        // WASD 키 등록
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
        let dx = 0;
        let dy = 0;

        if (this.keys.w.isDown) dy -= 1;
        if (this.keys.s.isDown) dy += 1;
        if (this.keys.a.isDown) dx -= 1;
        if (this.keys.d.isDown) dx += 1;

        const isMoving = dx !== 0 || dy !== 0;

        if (isMoving) {
            const length = Math.hypot(dx, dy);
            dx /= length;
            dy /= length;

            if (Math.abs(dx) >= Math.abs(dy)) {
                this.currentDirection = dx > 0 ? "right" : "left";
            } else {
                this.currentDirection = dy > 0 ? "down" : "up";
            }
        }

        this.player.x += dx * PLAYER_SPEED;
        this.player.y += dy * PLAYER_SPEED;

        this.player.x = Phaser.Math.Clamp(this.player.x, 20, GAME_WIDTH - 20);
        this.player.y = Phaser.Math.Clamp(this.player.y, 20, GAME_HEIGHT - 20);

        // 흡연장 영역 → SmokeScene
        if (
            this.player.x > SMOKE_ZONE.x1 &&
            this.player.x < SMOKE_ZONE.x2 &&
            this.player.y > SMOKE_ZONE.y1 &&
            this.player.y < SMOKE_ZONE.y2
        ) {
            this.isTransitioning = true;
            console.log("흡연장으로 이동");
            this.scene.start("SmokeScene");
            return;
        }

        // 건물 영역 충돌
        if (
            this.player.x > BLOCKED.BUILDING.x1 &&
            this.player.x < BLOCKED.BUILDING.x2 &&
            this.player.y > BLOCKED.BUILDING.y1 &&
            this.player.y < BLOCKED.BUILDING.y2
        ) {
            this.player.x = oldX;
            this.player.y = oldY;
        }

        // 오른쪽 주차장 충돌
        if (
            this.player.x > BLOCKED.PARKING_RIGHT.x1 &&
            this.player.x < BLOCKED.PARKING_RIGHT.x2 &&
            this.player.y > BLOCKED.PARKING_RIGHT.y1 &&
            this.player.y < BLOCKED.PARKING_RIGHT.y2
        ) {
            this.player.x = oldX;
            this.player.y = oldY;
        }

        // 걷기 애니메이션
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
    backgroundColor: "#000000", // ✅ 여백이 검은색으로 보이게
    scale: {
        mode: Phaser.Scale.FIT,      // ✅ 비율 유지하며 꽉 채우기
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 1280,
        height: 720
    },
    scene: [
        MainScene,
        SmokeScene,
        ExScene,
        // ... 다른 씬들
    ]
};

new Phaser.Game(config);