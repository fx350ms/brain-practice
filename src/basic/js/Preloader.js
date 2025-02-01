export class Preloader extends Phaser.Scene {
    constructor() {
        super({
            key: 'Preloader'
        });
    }

    preload() {
       // this.load.setBaseURL('https://cdn.phaserfiles.com/v385');
        this.load.setPath("./assets/");
        this.load.image("tiles", "drawtiles-spaced.png");
        this.load.image("background", "background.jpg");
      //  this.load.audio("backgroundMusic", "background.mp3");
        this.load.audio("jumpSound", "jump.wav");
    }

    create() {
        this.scene.start("LevelSelect");
    }
}