import Phaser from "phaser";
export default class Corridor4F1Scene extends Phaser.Scene {
    constructor() { super("4f-1CorridorScene"); }
    init(data) { this.floor=4; this.answerNumber="4103"; this.saveKey="4L"; this.collected=window.collectedNumbers[this.saveKey]||false; }
    create() {
        const [W,H]=[1280,720];
        this.add.image(640,360,"복도ex").setDisplaySize(W,H);
        this.add.text(640,50,"4층 왼쪽 복도",{fontSize:"36px",color:"#fff",fontStyle:"bold",stroke:"#000",strokeThickness:5}).setOrigin(0.5);
        if(this.collected)this.add.text(640,100,"✅ 번호를 이미 받았습니다",{fontSize:"22px",color:"#8f8",stroke:"#000",strokeThickness:3}).setOrigin(0.5);
        this.player=this.add.image(120,360,"player_right_idle").setScale(0.07);
        this.currentDirection="right";this.frameIndex=0;this.frameTimer=0;this.isTransitioning=false;
        this.keys=this.input.keyboard.addKeys({w:"W",a:"A",s:"S",d:"D"});
        this.add.rectangle(1120,360,200,220,0x000,0.4).setStrokeStyle(3,0xff0);
        this.add.text(1120,290,"🔒 비밀번호 입력",{fontSize:"22px",color:"#ff0",stroke:"#000",strokeThickness:3}).setOrigin(0.5);
        this.inputText=this.add.text(1120,350,"____",{fontSize:"32px",color:"#fff",stroke:"#000",strokeThickness:4}).setOrigin(0.5);
        this.typed="";
        this.input.keyboard.on("keydown",e=>{
            if(this.collected||this.isTransitioning)return;
            if(e.key>="0"&&e.key<="9"&&this.typed.length<4)this.inputText.setText((this.typed+=e.key).padEnd(4,"_"));
            if(e.key==="Backspace")this.inputText.setText((this.typed=this.typed.slice(0,-1)).padEnd(4,"_"));
            if(e.key==="Enter")this.checkAnswer();
        });
        this.add.text(100,660,"⬅️ 중앙공간",{fontSize:"20px",color:"#fd0",backgroundColor:"rgba(0,0,0,0.6)",padding:{x:15,y:8}})
            .setOrigin(0.5).setInteractive({useHandCursor:true}).on("pointerdown",()=>{this.isTransitioning=true;this.scene.start("MainHallScene",{floor:4});});
    }
    checkAnswer() {
        if(this.typed==="0000"){
            this.collected=true;window.collectedNumbers[this.saveKey]=this.answerNumber;
            this.add.text(1120,420,`✅ 번호: ${this.answerNumber}`,{fontSize:"24px",color:"#8f8",stroke:"#000",strokeThickness:4}).setOrigin(0.5);
            this.input.keyboard.off("keydown");
        }else{
            const m=this.add.text(1120,420,"❌ 틀렸습니다",{fontSize:"22px",color:"#f44",stroke:"#000",strokeThickness:3}).setOrigin(0.5);
            this.time.delayedCall(1500,()=>{m.destroy();this.typed="";this.inputText.setText("____");});
        }
    }
    getWalkFrames(d){return[`player_${d}_idle`,`player_${d}_1`,`player_${d}_idle`,`player_${d}_2`];}
    getIdleTexture(d){return`player_${d}_idle`;}
    update() {
        if(this.isTransitioning||this.collected)return;
        let dx=0,dy=0;
        if(this.keys.w.isDown)dy-=1;if(this.keys.s.isDown)dy+=1;
        if(this.keys.a.isDown)dx-=1;if(this.keys.d.isDown)dx+=1;
        const mv=dx||dy;
        if(mv){const l=Math.hypot(dx,dy);dx/=l;dy/=l;this.currentDirection=Math.abs(dx)>=Math.abs(dy)?(dx>0?"right":"left"):(dy>0?"down":"up");}
        this.player.x+=dx*3;this.player.y+=dy*3;
        this.player.x=Phaser.Math.Clamp(this.player.x,80,1200);this.player.y=Phaser.Math.Clamp(this.player.y,120,640);
        const f=this.getWalkFrames(this.currentDirection);
        if(mv){if(++this.frameTimer>8){this.frameTimer=0;this.frameIndex=(this.frameIndex+1)%f.length;this.player.setTexture(f[this.frameIndex]);}}
        else{this.player.setTexture(this.getIdleTexture(this.currentDirection));this.frameIndex=0;this.frameTimer=0;}
    }
}