export class GameCompleted extends Phaser.Scene {
    constructor() {
        super({
            key: 'GameCompleted'
        });
    }

    init(data) {
        this.level = data.level;
        this.maxLevel = data.maxLevel;
        this.level = data.level;
        this.gridSize = data.gridSize;
        this.randomCells = data.randomCells;

    }
   

    create() {
        const bg = this.add.image(0, 0, 'background').setOrigin(0, 0);
        bg.displayWidth = this.sys.game.config.width;
        bg.displayHeight = this.sys.game.config.height;
        const centerX = this.cameras.main.width / 2;
        this.add.text(centerX, 100, 'Congratulations!', { fontSize: '32px', fill: '#0f0',
            stroke: '#fff',
            strokeThickness: 4

         }).setOrigin(0.5, 0.5);

        this.createButton(centerX/2, 200, 'Play Again', () => this.scene.start('Play', { level: this.level , gridSize: this.gridSize, randomCells: this.randomCells }));
        
        // if (this.level < this.maxLevel) {
        //     this.createButton(100, 300, 'Next Level', () => this.scene.start('Play', { level: this.level + 1 }));
        // }

        this.createButton(centerX/2 + 220, 200, 'Level Select', () => this.scene.start('LevelSelect'));
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