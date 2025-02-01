export class GameCompleted extends Phaser.Scene {
    constructor() {
        super({
            key: 'GameCompleted'
        });
    }

    init(data) {
        this.level = data.level;
        this.maxLevel = data.maxLevel;
    }

    create() {
        this.add.text(100, 100, 'Congratulations!', { fontSize: '32px', fill: '#0f0' });

        this.createButton(100, 200, 'Play Again', () => this.scene.start('Play', { level: this.level }));
        
        if (this.level < this.maxLevel) {
            this.createButton(100, 300, 'Next Level', () => this.scene.start('Play', { level: this.level + 1 }));
        }

        this.createButton(100, 400, 'Level Select', () => this.scene.start('LevelSelect'));
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

    checkGameFinish() {
        const isFinished = this.savedState.every(cell => {
            return this.grid[cell.row][cell.col].fillColor === cell.color;
        });
    
        if (isFinished) {
            this.timerEvent.remove();
            this.scene.start('GameOver', { 
                level: this.level, 
                maxLevel: 9, // Assuming max level is 9
                oldMatrix: this.savedState,
                currentMatrix: this.grid.map(row => row.map(cell => cell.fillColor))
            });
        }
    }
}