export class GameOver extends Phaser.Scene {
    constructor() {
        super({
            key: 'GameOver'
        });
    }

    init(data) {
        this.level = data.level;
        this.maxLevel = data.maxLevel;
        this.oldMatrix = data.oldMatrix;
        this.currentMatrix = data.currentMatrix;
        this.gridSize = data.gridSize;
    }

    create() {
        this.add.text(100, 50, 'Game Over', { fontSize: '32px', fill: '#f00' });

        this.displayMatrices();

        this.createButton(100, 500, 'New Game', () => this.scene.start('Play', { level: this.level }));
        this.createButton(300, 500, 'Select Level', () => this.scene.start('LevelSelect'));
    }

    displayMatrices() {
        const cellSize = 50;
        const offsetX = 100;
        const offsetY = 100;

        // Display old matrix
        this.add.text(offsetX, offsetY - 50, 'Old Matrix', { fontSize: '24px', fill: '#fff' });
        debugger;
        for (let row = 0; row < this.gridSize; row++) {
            for (let col = 0; col < this.gridSize; col++) {
                const cell = this.oldMatrix.find(cell => cell.row === row && cell.col === col);
                const color = cell ? cell.color : 0xffffff;
                this.add.rectangle(offsetX + col * cellSize, offsetY + row * cellSize, cellSize, cellSize, color)
                    .setStrokeStyle(2, 0x000000);
            }
        }

        // Display current matrix
        const currentOffsetX = offsetX + this.gridSize * cellSize + 50;
        this.add.text(currentOffsetX, offsetY - 50, 'Current Matrix', { fontSize: '24px', fill: '#fff' });
        for (let row = 0; row < this.gridSize; row++) {
            for (let col = 0; col < this.gridSize; col++) {
                const color = this.currentMatrix[row][col];
                this.add.rectangle(currentOffsetX + col * cellSize, offsetY + row * cellSize, cellSize, cellSize, color)
                    .setStrokeStyle(2, 0x000000);
            }
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