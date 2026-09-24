import Phaser from "phaser";

export default class LobbyScene extends Phaser.Scene {

    constructor() {
        super("LobbyScene");
    }

    create() {

        // 왼쪽 복도 안내
this.leftCorridorText = this.add.text(
    120,
    330,
    "E - 왼쪽 복도 이동",
    {
        fontSize: "20px",
        color: "#ffff00",
        stroke: "#000000",
        strokeThickness: 4
    }
);

this.leftCorridorText.setVisible(false);

        // 배경
        const bg = this.add.image(
            640,
            360,
            "lobby"
        );

        bg.setDisplaySize(
            1280,
            720
        );

        // 플레이어
        this.player = this.add.image(
            640,
            520,
            "player_up_idle"
        );

        this.player.setScale(0.07);

        this.currentDirection = "up";
        this.frameIndex = 0;
        this.frameTimer = 0;

        this.keys = this.input.keyboard.addKeys({
            w: Phaser.Input.Keyboard.KeyCodes.W,
            a: Phaser.Input.Keyboard.KeyCodes.A,
            s: Phaser.Input.Keyboard.KeyCodes.S,
            d: Phaser.Input.Keyboard.KeyCodes.D,
            e: Phaser.Input.Keyboard.KeyCodes.E
        });

        // 계단 안내
        this.stairText = this.add.text(
            560,
            250,
            "E - 2층 이동",
            {
                fontSize: "20px",
                color: "#ffff00",
                stroke: "#000000",
                strokeThickness: 4
            }
        );

        this.stairText.setVisible(false);

    
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

        const oldX = this.player.x;
        const oldY = this.player.y;

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

        // 화면 범위 제한
        this.player.x = Phaser.Math.Clamp(
            this.player.x,
            40,
            1240
        );

        this.player.y = Phaser.Math.Clamp(
            this.player.y,
            80,
            680
        );

        // 아래 검은 영역 충돌
        if (
            this.player.y > 530
        ) {
            this.player.x = oldX;
            this.player.y = oldY;
        }

        // 위쪽 2층 영역 충돌
if (
    this.player.y < 300
) {
    this.player.x = oldX;
    this.player.y = oldY;
}

        // 계단 앞
        const nearStair =
            this.player.x > 520 &&
            this.player.x < 760 &&
            this.player.y > 260 &&
            this.player.y < 420;

        if (nearStair) {

            this.stairText.setVisible(true);

            if (
                Phaser.Input.Keyboard.JustDown(
                    this.keys.e
                )
            ) {

                console.log(
                    "2층 이동"
                );

                // this.scene.start("SecondFloorScene");
            }

        } else {

            this.stairText.setVisible(false);
        }

        // 왼쪽 통로 입구
const nearLeftCorridor =
    this.player.x > 40 &&
    this.player.x < 260 &&
    this.player.y > 250 &&
    this.player.y < 450;

if (nearLeftCorridor) {

    this.leftCorridorText.setVisible(true);

    if (
        Phaser.Input.Keyboard.JustDown(
            this.keys.e
        )
    ) {

        console.log(
            "왼쪽 복도 이동"
        );

        this.scene.start(
            "WestCorridorScene"
        );
    }

} else {

    this.leftCorridorText.setVisible(false);
}
    }
}