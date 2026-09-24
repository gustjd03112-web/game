import Phaser from "phaser";

export default class ExScene extends Phaser.Scene {
    constructor() {
        super("ExScene");
    }

    preload() {
        // 이미지는 main.js에서 미리 불러옴
    }

    create() {
        // ==============================================
        // ✅ 넓은 전체 지도 배경
        // ==============================================
        this.MAP_WIDTH = 4000;  // 사진 가로 크기에 맞춰 조절하세요
        this.MAP_HEIGHT = 720;

        // 전체 지도 — 중앙에 배치
        this.fullMap = this.add.image(this.MAP_WIDTH / 2, 360, "ex_full");
        this.fullMap.setDisplaySize(this.MAP_WIDTH, this.MAP_HEIGHT);

        // ==============================================
        // ✅ 플레이어 위치 (보이지 않는 시점의 중심)
        // ==============================================
        this.playerX = this.MAP_WIDTH / 2;  // 시작: 지도 정중앙
        this.playerY = 360;
        this.speed = 4;     // 이동 속도
        this.turnSpeed = 3; // 마우스 회전 민감도

        // ==============================================
        // ✅ 카메라 설정
        // ==============================================
        this.cameras.main.setBounds(0, 0, this.MAP_WIDTH, this.MAP_HEIGHT);
        this.cameras.main.startFollow(
            { x: this.playerX, y: this.playerY },
            false,
            0.1,
            0.1
        );

        // ==============================================
        // ✅ 키보드 & 마우스 입력
        // ==============================================
        this.keys = this.input.keyboard.addKeys({
            w: Phaser.Input.Keyboard.KeyCodes.W,
            a: Phaser.Input.Keyboard.KeyCodes.A,
            s: Phaser.Input.Keyboard.KeyCodes.S,
            d: Phaser.Input.Keyboard.KeyCodes.D
        });

        // 마우스 드래그로 시점 회전
        this.isDragging = false;
        this.input.on("pointerdown", () => {
            this.isDragging = true;
        });
        this.input.on("pointerup", () => {
            this.isDragging = false;
        });
        this.input.on("pointermove", (pointer) => {
            if (this.isDragging) {
                // 마우스 드래그 = 시점 좌우 이동
                this.cameras.main.scrollX -= pointer.movementX * this.turnSpeed;
            }
        });

        // ==============================================
        // ✅ 조작 안내
        // ==============================================
        this.add.text(20, 20, 
            "W 앞으로  S 뒤로  A 왼쪽  D 오른쪽  |  마우스 드래그: 시점 돌리기",
            {
                fontSize: "18px",
                color: "#ffffff",
                stroke: "#000000",
                strokeThickness: 4
            }
        );
    }

    update() {
        // ==============================================
        // ✅ 키보드 이동
        // ==============================================
        let dx = 0;
        let dy = 0;

        if (this.keys.w.isDown) dy -= 1;
        if (this.keys.s.isDown) dy += 1;
        if (this.keys.a.isDown) dx -= 1;
        if (this.keys.d.isDown) dx += 1;

        // 대각선 이동 속도 보정
        const len = Math.hypot(dx, dy) || 1;
        dx /= len;
        dy /= len;

        // 실제 플레이어 위치 이동
        this.playerX += dx * this.speed;
        this.playerY += dy * this.speed;

        // 지도 밖으로 나가지 않도록 제한
        this.playerX = Phaser.Math.Clamp(this.playerX, 200, this.MAP_WIDTH - 200);
        this.playerY = Phaser.Math.Clamp(this.playerY, 100, this.MAP_HEIGHT - 100);

        // 카메라 위치 갱신
        this.cameras.main.startFollow(
            { x: this.playerX, y: this.playerY },
            false,
            0.1,
            0.1
        );
    }
}