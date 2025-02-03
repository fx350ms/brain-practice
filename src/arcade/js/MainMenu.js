export class MainMenu extends Phaser.Scene {
    constructor() {
        super({
            key: 'MainMenu'
        });
    }

    create() {
        const { width, height } = this.sys.game.config;

        const bg = this.add.image(0, 0, 'background').setOrigin(0, 0);
        bg.displayWidth = width;
        bg.displayHeight = height;

        const titleText = this.add.text(width / 2, height * 0.1, 'SIÊU TRÍ TUỆ', {
            fontSize: `${Math.min(width, height) * 0.1}px`,
            fill: '#2689da',
            stroke: '#ffffff',
            strokeThickness: 2,

            shadow: {
                offsetX: 3,
                offsetY: 3,
                color: '#000',
                blur: 3,
                stroke: true,
                fill: true
            }
        }).setOrigin(0.5, 0.5);
        
        // Create animation for titleText
        this.tweens.add({
            targets: titleText,
            scale: { from: 1, to: 1.2 },
            duration: 1000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        var buttonWidth = 200;
        var x = (width - buttonWidth) / 2;

        this.createButton(x, height * 0.4, buttonWidth, 50, 'Chơi', () => this.scene.start('Play', { level: 1, score: 0 }));
        this.createButton(x, height * 0.5, buttonWidth, 50,  'Điểm cao', () => this.scene.start('Leaderboard'));
        this.createButton(x, height * 0.6, buttonWidth, 50,  'Hướng dẫn', () => this.scene.start('Help'));

        if (!this.sound.get('backgroundMusic')) {
            this.backgroundMusic = this.sound.add('backgroundMusic', { loop: true });
            this.backgroundMusic.play();
        }
        this.createMuteButton();
    }

    createMuteButton() {
        const { width } = this.sys.game.config;
        const muteButton = this.add.text(width - 20, 20, '🔊', {
            fontSize: '32px',
            fill: '#fff'
        }).setOrigin(1, 0).setInteractive();

        muteButton.on('pointerdown', () => {
            if (this.sound.mute) {
                this.sound.mute = false;
                muteButton.setText('🔊');
            } else {
                this.sound.mute = true;
                muteButton.setText('🔇');
            }
        });
    }

    createButton(x, y, w, h, text, callback) {
        const button = this.add.graphics();
        button.fillStyle(0x0000ff, 1);
        button.fillRoundedRect(x, y, w, h, 10); // Added rounded corners with a radius of 10
    
        const buttonText = this.add.text(x + w / 2, y + h / 2, text, { fontSize: '24px', fill: '#fff' });
        buttonText.setOrigin(0.5, 0.5); // Center the text within the button
    
        button.setInteractive(new Phaser.Geom.Rectangle(x, y, w, h), Phaser.Geom.Rectangle.Contains);
        button.on('pointerdown', callback);
        button.on('pointerover', () => {
            button.clear();
            button.fillStyle(0x00ff00, 1);
            button.fillRoundedRect(x, y, w, h, 10); // Added rounded corners with a radius of 10
        });
        button.on('pointerout', () => {
            button.clear();
            button.fillStyle(0x0000ff, 1);
            button.fillRoundedRect(x, y, w, h, 10); // Added rounded corners with a radius of 10
        });
        
    }
}