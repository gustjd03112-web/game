import Phaser from "phaser";

export default class WestCorridorScene extends Phaser.Scene {

    constructor() {
        super("WestCorridorScene");
    }

    create() {

        // 배경
        const bg = this.add.image(
            640,
            360,
            "1f_west_corridor"
        );

        bg.displayWidth = 1280;
        bg.displayHeight = 720;

        // 플레이어 (빨간 원 위치)
        this.player = this.add.image(
            80,
            420,
            "player_down_idle"
        );

        this.player.setScale(0.07);

        this.currentDirection = "down";
        this.frameIndex = 0;
        this.frameTimer = 0;

        this.keys = this.input.keyboard.addKeys({
            w: Phaser.Input.Keyboard.KeyCodes.W,
            a: Phaser.Input.Keyboard.KeyCodes.A,
            s: Phaser.Input.Keyboard.KeyCodes.S,
            d: Phaser.Input.Keyboard.KeyCodes.D,
            e: Phaser.Input.Keyboard.KeyCodes.E
        });

        // 로비 복귀 안내
        this.returnText = this.add.text(
    500,
    300,
    "E - 본관 로비 이동",
    {
        fontSize: "20px",
        color: "#ffff00",
        stroke: "#000000",
        strokeThickness: 4,
        padding: {
            top: 10,
            bottom: 10,
            left: 10,
            right: 10
        }
    }
);

this.returnText.setVisible(false);

        this.returnText.setVisible(false);
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

        const speed = 3;

        let isMoving = false;
        let direction = this.currentDirection;

        if (this.keys.w.isDown) {

            this.player.y -= speed;
            isMoving = true;
            direction = "up";
        }

        if (this.keys.s.isDown) {

            this.player.y += speed;
            isMoving = true;
            direction = "down";
        }

        if (this.keys.a.isDown) {

            this.player.x -= speed;
            isMoving = true;
            direction = "left";
        }

        if (this.keys.d.isDown) {

            this.player.x += speed;
            isMoving = true;
            direction = "right";
        }

        this.currentDirection = direction;

        const walkFrames =
            this.getWalkFrames(direction);

        if (isMoving) {

            this.frameTimer++;

            if (this.frameTimer > 8) {

                this.frameTimer = 0;

                this.frameIndex++;

                if (
                    this.frameIndex >=
                    walkFrames.length
                ) {
                    this.frameIndex = 0;
                }

                this.player.setTexture(
                    walkFrames[
                        this.frameIndex
                    ]
                );
            }

        } else {

            this.player.setTexture(
                this.getIdleTexture(
                    this.currentDirection
                )
            );

            this.frameIndex = 0;
            this.frameTimer = 0;
        }

        // 이동 가능 범위
        this.player.x = Phaser.Math.Clamp(
            this.player.x,
            40,
            1240
        );

        this.player.y = Phaser.Math.Clamp(
            this.player.y,
            350,
            650
        );

        // 왼쪽 출입구 쪽
        const nearExit =
            this.player.x < 140;

        if (nearExit) {

    this.returnText.setPosition(
        this.player.x + 40,
        this.player.y - 60
    );

    this.returnText.setVisible(true);

    if (
        Phaser.Input.Keyboard.JustDown(
            this.keys.e
        )
    ) {

        this.scene.start(
            "LobbyScene"
        );
    }

} else {

    this.returnText.setVisible(false);
}
    }
}