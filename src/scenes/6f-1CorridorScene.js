import Phaser from "phaser";
export default class Corridor6F1Scene extends Phaser.Scene {
    constructor() {
        super("6f-1CorridorScene");
    }
    create() {
        if (!window.collectedNumbers) window.collectedNumbers = {};
        const bg = this.add.image(640, 360, "복도ex");
        bg.setDisplaySize(1280, 720);
        this.add.text(640, 80, "6층 복도 (1)", {
            fontSize: "36px", color: "#fff", fontStyle: "bold",
            stroke: "#000", strokeThickness: 5
        }).setOrigin(0.5);
        const key = "6L";
        if (window.collectedNumbers[key]) {
            this.add.text(640, 320, `이미 가져간 번호:\n${window.collectedNumbers[key]}`, {
                fontSize: "32px", color: "#88ff88", align: "center",
                stroke: "#000", strokeThickness: 4
            }).setOrigin(0.5);
        } else {
            this.add.text(640, 280, "이 공간의 번호", {
                fontSize: "24px", color: "#ddd",
                stroke: "#000", strokeThickness: 3
            }).setOrigin(0.5);
            this.add.text(640, 360, "4", {
                fontSize: "72px", color: "#ffd700", fontStyle: "bold",
                stroke: "#000", strokeThickness: 6
            }).setOrigin(0.5);
            this.add.text(640, 430, "기억해두세요!", {
                fontSize: "22px", color: "#fff",
                stroke: "#000", strokeThickness: 3
            }).setOrigin(0.5);
            this.add.text(640, 520, "✅ 번호 가져가기", {
                fontSize: "26px", color: "#00ff88",
                backgroundColor: "rgba(34,68,51,0.8)",
                padding: { x: 30, y: 15 }
            }).setOrigin(0.5).setInteractive({ useHandCursor: true })
                .on("pointerdown", () => {
                    window.collectedNumbers[key] = 4;
                    this.add.text(640, 600, "번호가 수집되었습니다!", {
                        fontSize: "22px", color: "#88ff88",
                        stroke: "#000", strokeThickness: 3
                    }).setOrigin(0.5);
                });
        }
        this.add.text(640, 700, "← 6층 중앙공간으로 돌아가기", {
            fontSize: "22px", color: "#00ddff",
            backgroundColor: "rgba(0,0,0,0.6)",
            padding: { x: 25, y: 10 }
        }).setOrigin(0.5).setInteractive({ useHandCursor: true })
            .on("pointerdown", () => this.scene.start("MainHallScene", { floor: 6 }));
    }
}