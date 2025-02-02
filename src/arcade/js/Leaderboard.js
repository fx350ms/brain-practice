export class Leaderboard extends Phaser.Scene {
    constructor() {
        super({
            key: 'Leaderboard'
        });
    }

    create() {
        const bg = this.add.image(0, 0, 'background').setOrigin(0, 0);
        bg.displayWidth = this.sys.game.config.width;
        bg.displayHeight = this.sys.game.config.height;
        const centerX = this.cameras.main.width / 2;

        this.add.text(centerX, 50, 'Bảng xếp hạng', { fontSize: '32px', fill: '#fff', fontWeight: 'bold',
            stroke: '#000',
            strokeThickness: 4
        }).setOrigin(0.5, 0.5);

        const highScores = JSON.parse(localStorage.getItem('highScores')) || [];
        highScores.forEach((score, index) => {
            this.add.text(centerX, 100 + index * 30, `${index + 1}. ${score}`, { fontSize: '24px', fill: '#fff' }).setOrigin(0.5, 0.5);
        });

        this.createButton(centerX, this.cameras.main.height - 50, 'Chơi lại', () => this.scene.start('Play', { level: 1 , score : 0}));
    }

   
    createButton(x, y, text, callback) {
        const button = this.add.graphics();
        button.fillStyle(0x0000ff, 1);
        button.fillRoundedRect(x, y, 200, 50, 10); // Added rounded corners with a radius of 10
    
        const buttonText = this.add.text(x + 100, y + 25, text, { fontSize: '24px', fill: '#fff' });
        buttonText.setOrigin(0.5, 0.5);
    
        button.setInteractive(new Phaser.Geom.Rectangle(x, y, 200, 50), Phaser.Geom.Rectangle.Contains);
        button.on('pointerdown', callback);
        button.on('pointerover', () => {
            button.clear();
            button.fillStyle(0x00ff00, 1);
            button.fillRoundedRect(x, y, 200, 50, 10); // Added rounded corners with a radius of 10
        });
        button.on('pointerout', () => {
            button.clear();
            button.fillStyle(0x0000ff, 1);
            button.fillRoundedRect(x, y, 200, 50, 10); // Added rounded corners with a radius of 10
        });
    }
}