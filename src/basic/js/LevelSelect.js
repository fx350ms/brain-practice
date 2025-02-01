export class LevelSelect extends Phaser.Scene {
    constructor() {
        super({
            key: 'LevelSelect'
        });
    }

    create() {
        const bg = this.add.image(0, 0, 'background').setOrigin(0, 0);
        bg.displayWidth = this.sys.game.config.width;
        bg.displayHeight = this.sys.game.config.height;
        
        this.add.text(100, 50, 'Select Level:', { fontSize: '32px', fill: '#fff' });

        this.createButton(100, 100, 'Very Easy', () => this.scene.start('Play', { level: 'veryEasy', gridSize: 4, randomCells: 4 }));
        this.createButton(100, 175, 'Easy', () => this.scene.start('Play', { level: 'easy', gridSize: 4, randomCells: 6 }));
        this.createButton(100, 250, 'Normal', () => this.scene.start('Play', { level: 'normal', gridSize: 6, randomCells: 4 }));
        this.createButton(100, 325, 'Medium', () => this.scene.start('Play', { level: 'medium', gridSize: 6, randomCells: 6 }));
        this.createButton(100, 400, 'Hard', () => this.scene.start('Play', { level: 'hard', gridSize: 9, randomCells: 6 }));
        this.createButton(100, 475, 'Very Hard', () => this.scene.start('Play', { level: 'veryHard', gridSize: 9, randomCells: 8 }));
     
        if (!this.sound.get('backgroundMusic')) {
            // this.backgroundMusic = this.sound.add('backgroundMusic', { loop: true });
            // this.backgroundMusic.play();
        }
    }

    createButton(x, y, text, callback) {
        const button = this.add.graphics();
        button.fillStyle(0x0000ff, 1);
        button.fillRect(x, y, 200, 50);

        const buttonText = this.add.text(x + 100, y + 25, text, { fontSize: '24px', fill: '#fff' });
        buttonText.setOrigin(0.5, 0.5);

        button.setInteractive(new Phaser.Geom.Rectangle(x, y, 200, 50), Phaser.Geom.Rectangle.Contains);
        button.on('pointerdown', callback);
        button.on('pointerover', () => button.fillStyle(0x00ff00, 1).fillRect(x, y, 200, 50));
        button.on('pointerout', () => button.fillStyle(0x0000ff, 1).fillRect(x, y, 200, 50));
    }
}