import Phaser from "phaser";

const images = import.meta.glob(
    "../assets/*.png",
    { eager: true, import: "default" }
);

export default class SmokeScene extends Phaser.Scene {
    constructor() {
        super("SmokeScene");
        this.videoElement = null;
    }

    preload() {
        Object.entries(images).forEach(([path, image]) => {
            const key = path.split("/").pop().replace(".png", "");
            this.load.image(key, image);
        });
    }

    create() {
    const w = this.scale.width;
    const h = this.scale.height;

    this.bg1 = this.add.image(w / 2, h / 2, "smoke");
    this.bg1.setDisplaySize(w, h);

    this.bg2 = this.add.image(w / 2, h / 2, "smoke see");
    this.bg2.setDisplaySize(w, h);
    this.bg2.setVisible(false);

    this.player = this.add.image(w / 2 + 100, h - 70, "player_up_idle");
    this.player.setScale(0.07);
    this.currentDirection = "up";

    this.titleText = this.add.text(20, 20, "흡연장", {
        fontSize: "32px",
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 5
    });

    this.tweens.add({
        targets: this.titleText,
        alpha: 0,
        delay: 1000,
        duration: 500,
        onComplete: () => this.titleText.setVisible(false)
    });

    this.time.delayedCall(1500, () => {
        this.player.setAlpha(0);

        const flash = this.add.rectangle(w / 2, h / 2, w, h, 0x000000);
        flash.setDepth(200);
        flash.setAlpha(1);

        this.tweens.add({
            targets: flash,
            alpha: 0,
            duration: 150,
            onComplete: () => flash.destroy()
        });

        this.bg1.setVisible(false);
        this.bg2.setVisible(true);

        this.time.delayedCall(500, () => {
            this.showVideoDirectly();
        });
    });
}

    showVideoDirectly() {
        if (this.videoElement) {
            this.videoElement.remove();
        }

        this.videoElement = document.createElement("video");
        this.videoElement.src = "./intro.mp4";
        this.videoElement.muted = true;
        this.videoElement.autoplay = true;
        this.videoElement.playsInline = true;
        this.videoElement.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            object-fit: cover;
            z-index: 9999;
            background: #000;
        `;

        this.videoElement.onended = () => {
            this.removeVideoAndGo();
        };

        this.videoElement.onerror = () => {
            this.removeVideoAndGo();
        };

        document.body.appendChild(this.videoElement);

        this.videoElement.play()
            .catch(() => {
                const clickPlay = () => {
                    this.videoElement.play();
                    document.removeEventListener("click", clickPlay);
                };
                document.addEventListener("click", clickPlay);
            });
    }

    removeVideoAndGo() {
        if (this.videoElement) {
            this.videoElement.pause();
            this.videoElement.remove();
            this.videoElement = null;
        }
        this.scene.start("ExScene");
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

    update() {}
}