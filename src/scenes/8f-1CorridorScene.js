import Phaser from "phaser";

export default class Corridor8F1Scene extends Phaser.Scene {
    constructor() {
        super("8f-1CorridorScene");
    }

    init(data) {
        this.floor = 8;
        this.side = "left";
        // ✅ 이 방에서 주는 번호 (다른 방으로 복사할 때 이것만 바꾸세요!)
        this.answerNumber = "8123"; 
        this.saveKey = "8L";
        this.collected = window.collectedNumbers[this.saveKey] || false;
    }

    create() {
        const GAME_WIDTH = 1280;
        const GAME_HEIGHT = 720;

        // ✅ 배경: 복도ex 사용
        const bg = this.add.image(640, 360, "복도ex");
        bg.setDisplaySize(GAME_WIDTH, GAME_HEIGHT);

        // 층/방향 표시
        this.add.text(640, 50, "8층 왼쪽 복도", {
            fontSize: "36px",
            color: "#ffffff",
            fontStyle: "bold",
            stroke: "#000000",
            strokeThickness: 5
        }).setOrigin(0.5);

        // ✅ 수집 상태 표시
        if (this.collected) {
            this.add.text(640, 100, "✅ 번호를 이미 받았습니다", {
                fontSize: "22px",
                color: "#88ff88",
                stroke: "#000000",
                strokeThickness: 3
            }).setOrigin(0.5);
        }

        // ✅ 플레이어 — 가장 왼쪽에서 스폰
        const PLAYER_SCALE = 0.07;
        this.player = this.add.image(120, 360, "player_right_idle")
            .setScale(PLAYER_SCALE);

        this.currentDirection = "right";
        this.frameIndex = 0;
        this.frameTimer = 0;
        this.isTransitioning = false;

        // ✅ WASD 키
        this.keys = this.input.keyboard.addKeys({
            w: Phaser.Input.Keyboard.KeyCodes.W,
            a: Phaser.Input.Keyboard.KeyCodes.A,
            s: Phaser.Input.Keyboard.KeyCodes.S,
            d: Phaser.Input.Keyboard.KeyCodes.D
        });

        // ✅ 오른쪽 끝 — 문제 입력 영역
        this.zoneX1 = 1080;
        this.zoneX2 = 1200;
        this.zoneY1 = 260;
        this.zoneY2 = 460;

        // 문제 영역 표시
        this.add.rectangle(1120, 360, 200, 220, 0x000000, 0.4).setStrokeStyle(3, 0xffff00);
        this.add.text(1120, 290, "🔒 비밀번호 입력", {
            fontSize: "22px",
            color: "#ffff00",
            stroke: "#000000",
            strokeThickness: 3
        }).setOrigin(0.5);

        // 입력창 & 확인 버튼
        this.inputText = this.add.text(1120, 350, "____", {
            fontSize: "32px",
            color: "#ffffff",
            stroke: "#000000",
            strokeThickness: 4
        }).setOrigin(0.5);

        this.typed = "";

        // 키보드 입력 처리
        this.input.keyboard.on("keydown", (e) => {
            if (this.collected || this.isTransitioning) return;

            // 숫자 키
            if (e.key >= "0" && e.key <= "9") {
                if (this.typed.length < 4) {
                    this.typed += e.key;
                    this.inputText.setText(this.typed.padEnd(4, "_"));
                }
            }
            // 백스페이스
            if (e.key === "Backspace") {
                this.typed = this.typed.slice(0, -1);
                this.inputText.setText(this.typed.padEnd(4, "_"));
            }
            // 엔터 = 확인
            if (e.key === "Enter") {
                this.checkAnswer();
            }
        });

        // ✅ 뒤로 가기 버튼
        this.add.text(100, 660, "⬅️ 중앙공간", {
            fontSize: "20px",
            color: "#ffd700",
            backgroundColor: "rgba(0,0,0,0.6)",
            padding: { x: 15, y: 8 }
        }).setOrigin(0.5).setInteractive({ useHandCursor: true })
            .on("pointerdown", () => {
                if (!this.isTransitioning) {
                    this.isTransitioning = true;
                    this.scene.start("MainHallScene", { floor: this.floor });
                }
            });
    }

    checkAnswer() {
        if (this.typed === "0000") {
            // ✅ 정답! 번호 지급
            this.collected = true;
            window.collectedNumbers[this.saveKey] = this.answerNumber;
            
            this.add.text(1120, 420, `✅ 번호: ${this.answerNumber}`, {
                fontSize: "24px",
                color: "#88ff88",
                stroke: "#000000",
                strokeThickness: 4
            }).setOrigin(0.5);

            this.input.keyboard.off("keydown"); // 입력 차단
        } else {
            // ❌ 틀림
            this.add.text(1120, 420, "❌ 틀렸습니다", {
                fontSize: "22px",
                color: "#ff4444",
                stroke: "#000000",
                strokeThickness: 3
            }).setOrigin(0.5).setAlpha(1).setScale(1)
                .setInteractive(false);
            
            // 1.5초 후 메시지 사라짐 & 입력 초기화
            this.time.delayedCall(1500, () => {
                this.children.list.filter(c => c.text === "❌ 틀렸습니다").forEach(c => c.destroy());
                this.typed = "";
                this.inputText.setText("____");
            });
        }
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
        if (this.isTransitioning || this.collected) return;

        const PLAYER_SPEED = 3;
        const ANIMATION_TICK = 8;
        const GAME_WIDTH = 1280;
        const GAME_HEIGHT = 720;

        let dx = 0, dy = 0;

        if (this.keys.w.isDown) dy -= 1;
        if (this.keys.s.isDown) dy += 1;
        if (this.keys.a.isDown) dx -= 1;
        if (this.keys.d.isDown) dx += 1;

        const isMoving = dx !== 0 || dy !== 0;
        if (isMoving) {
            const len = Math.hypot(dx, dy);
            dx /= len;
            dy /= len;
            this.currentDirection = Math.abs(dx) >= Math.abs(dy)
                ? (dx > 0 ? "right" : "left")
                : (dy > 0 ? "down" : "up");
        }

        this.player.x += dx * PLAYER_SPEED;
        this.player.y += dy * PLAYER_SPEED;

        // ✅ 복도 범위 제한
        this.player.x = Phaser.Math.Clamp(this.player.x, 80, GAME_WIDTH - 80);
        this.player.y = Phaser.Math.Clamp(this.player.y, 120, GAME_HEIGHT - 80);

        // ✅ 걷기 애니메이션
        const frames = this.getWalkFrames(this.currentDirection);
        if (isMoving) {
            if (++this.frameTimer > ANIMATION_TICK) {
                this.frameTimer = 0;
                this.frameIndex = (this.frameIndex + 1) % frames.length;
                this.player.setTexture(frames[this.frameIndex]);
            }
        } else {
            this.player.setTexture(this.getIdleTexture(this.currentDirection));
            this.frameIndex = 0;
            this.frameTimer = 0;
        }
    }
}