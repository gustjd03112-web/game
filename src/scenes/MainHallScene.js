import Phaser from "phaser";
import { FLOORS, ROOM_NUMBERS } from "../config.js";

export default class MainHallScene extends Phaser.Scene {
    constructor() {
        super("MainHallScene");
    }

    init(data) {
        this.floor = data.floor || 2;
    }

    create() {
        // 배경: 중앙공간ex
        const bg = this.add.image(640, 360, "중앙공간ex");
        bg.setDisplaySize(1280, 720);

        // 층 제목
        this.add.text(640, 70, `${this.floor}층 중앙공간`, {
            fontSize: "40px",
            color: "#ffffff",
            fontStyle: "bold",
            stroke: "#000000",
            strokeThickness: 5
        }).setOrigin(0.5);

        // 엘리베이터 패널
        this.add.text(640, 140, "🛗 엘리베이터", {
            fontSize: "24px",
            color: "#00ddff",
            stroke: "#000000",
            strokeThickness: 4
        }).setOrigin(0.5);

        // 층 선택 버튼
        FLOORS.forEach(f => {
            const col = f >= 5 ? f - 4 : f;
            const row = f >= 5 ? 0 : 1;
            const x = 320 + (col - 2) * 180;
            const y = 200 + row * 70;
            const isCurrent = f === this.floor;
            const doneL = window.collectedNumbers[`${f}L`];
            const doneR = window.collectedNumbers[`${f}R`];

            let bgColor = isCurrent ? "#ffd700" : "#334455";
            let txColor = "#ffffff";
            if (!isCurrent && doneL && doneR) {
                bgColor = "#226644";
                txColor = "#88ff88";
            }

            const btn = this.add.text(x, y, `${f}층`, {
                fontSize: "22px",
                color: txColor,
                backgroundColor: bgColor,
                padding: { x: 20, y: 10 }
            }).setOrigin(0.5);

            if (!isCurrent) {
                btn.setInteractive({ useHandCursor: true });
                btn.on("pointerdown", () => this.goToFloor(f));
            } else {
                btn.setStyle({ fontStyle: "bold" });
            }
        });

        // 왼쪽 복도 (f-1)
        this.add.text(300, 500, "🚪 왼쪽 복도 (1)", {
            fontSize: "28px",
            color: "#ffffff",
            backgroundColor: "rgba(0,0,0,0.5)",
            padding: { x: 25, y: 15 }
        }).setOrigin(0.5).setInteractive({ useHandCursor: true })
            .on("pointerdown", () => this.enterCorridor(1));

        // 오른쪽 복도 (f-2)
        this.add.text(980, 500, "🚪 오른쪽 복도 (2)", {
            fontSize: "28px",
            color: "#ffffff",
            backgroundColor: "rgba(0,0,0,0.5)",
            padding: { x: 25, y: 15 }
        }).setOrigin(0.5).setInteractive({ useHandCursor: true })
            .on("pointerdown", () => this.enterCorridor(2));

        // 2층일 때만 1층 로비로 내려가기
        if (this.floor === 2) {
            this.add.text(640, 660, "⬇️ 1층 로비로", {
                fontSize: "24px",
                color: "#ffd700",
                backgroundColor: "rgba(0,0,0,0.6)",
                padding: { x: 30, y: 12 }
            }).setOrigin(0.5).setInteractive({ useHandCursor: true })
                .on("pointerdown", () => this.scene.start("LobbyScene"));
        }
    }

    goToFloor(floor) {
        const fade = this.add.rectangle(640, 360, 1280, 720, 0x000000).setAlpha(0);
        this.tweens.add({
            targets: fade,
            alpha: 0.8,
            duration: 400,
            yoyo: true,
            onComplete: () => this.scene.restart({ floor })
        });
    }

    enterCorridor(sideNum) {
        // ✅ 층과 방향에 맞는 실제 씬 이름으로 변경
        const floor = this.floor;
        const sceneKey = `${floor}f-${sideNum}CorridorScene`;

        this.scene.start(sceneKey, {
            floor: this.floor,
            side: sideNum === 1 ? "left" : "right",
            number: sideNum === 1 ? ROOM_NUMBERS[this.floor].left : ROOM_NUMBERS[this.floor].right,
            saveKey: `${this.floor}${sideNum === 1 ? "L" : "R"}`
        });
    }
}