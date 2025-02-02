export class MainMenu extends Phaser.Scene {
    constructor() {
        super({
            key: 'MainMenu'
        });
    }

    create() {
       
        const bg = this.add.image(0, 0, 'background').setOrigin(0, 0);
        bg.displayWidth = this.sys.game.config.width;
        bg.displayHeight = this.sys.game.config.height;
        
        this.add.text(100, 50, 'Welcome to crazy brain', { fontSize: '40px', fill: '#fff', 
        stroke: '#000',
        strokeThickness: 4,
        shadow: {
            offsetX: 3,
            offsetY: 3,
            color: '#000',
            blur: 3,
            stroke: true,
            fill: true

        } }
        
    );

        this.createButton(100, 220, 'Chơi', () => this.scene.start('Play', { level: 1 , score : 0}));
        this.createButton(100, 295, 'Điểm cao', () => this.scene.start('TopScore'));
        this.createButton(100, 370, 'Hướng dẫn', () => this.scene.start('Help'));
        if (!this.sound.get('backgroundMusic')) {
             this.backgroundMusic = this.sound.add('backgroundMusic', { loop: true });
             this.backgroundMusic.play();
        }
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