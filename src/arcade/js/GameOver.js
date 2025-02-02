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
        this.randomCells = data.randomCells;
        this.score = data.score; // Add score to init data
    }

    create() {
        const bg = this.add.image(0, 0, 'background').setOrigin(0, 0);
        bg.displayWidth = this.sys.game.config.width;
        bg.displayHeight = this.sys.game.config.height;
        const centerX = this.cameras.main.width / 2;
        this.add.text(centerX, 50, 'Game Over', { fontSize: '32px', fill: '#f00', fontWeight: 'bold',
            stroke: '#000',
            strokeThickness: 4
        }).setOrigin(0.5, 0.5);

        this.displayMatrices();

        this.saveHighScore(this.score); // Save the high score

        this.createButton(100, 500, 'Chơi lại', () => this.scene.start('Play', { level: this.level, gridSize: this.gridSize, randomCells: this.randomCells }));
        this.createButton(300, 500, 'Bảng xếp hạng', () => this.scene.start('Leaderboard')); // Add button to go to leaderboard
    }

    displayMatrices() {
        const cellSize = 30; // Reduced cell size to half
        const halfWidth = this.cameras.main.width / 2;
        const offsetY = 150; // Adjusted to leave space for the label

        // Display old matrix
        const oldMatrixCenterX = halfWidth / 2;
        const oldMatrixOffsetX = oldMatrixCenterX - (this.gridSize * cellSize) / 2;
        this.add.text(oldMatrixCenterX, offsetY - 50, 'Old Matrix', { fontSize: '24px', fill: '#fff' }).setOrigin(0.5, 0.5);
        for (let row = 0; row < this.gridSize; row++) {
            for (let col = 0; col < this.gridSize; col++) {
                const cell = this.oldMatrix.find(cell => cell.row === row && cell.col === col);
                const color = cell ? cell.color : 0xffffff;
                this.add.rectangle(oldMatrixOffsetX + col * cellSize, offsetY + row * cellSize, cellSize, cellSize, color)
                    .setStrokeStyle(2, 0x000000);
            }
        }

        // Display current matrix
        const currentMatrixCenterX = halfWidth + halfWidth / 2;
        const currentMatrixOffsetX = currentMatrixCenterX - (this.gridSize * cellSize) / 2;
        this.add.text(currentMatrixCenterX, offsetY - 50, 'Current Matrix', { fontSize: '24px', fill: '#fff' }).setOrigin(0.5, 0.5);
        for (let row = 0; row < this.gridSize; row++) {
            for (let col = 0; col < this.gridSize; col++) {
                const color = this.currentMatrix[row][col];
                this.add.rectangle(currentMatrixOffsetX + col * cellSize, offsetY + row * cellSize, cellSize, cellSize, color)
                    .setStrokeStyle(2, 0x000000);
            }
        }
    }

    saveHighScore(score) {
        debugger;
        let highScores = JSON.parse(localStorage.getItem('highScores')) || [];
        highScores.push(score);
        highScores.sort((a, b) => b - a);
        highScores = highScores.slice(0, 10); // Keep only top 10 scores
        localStorage.setItem('highScores', JSON.stringify(highScores));
    }

    // createButton(x, y, text, callback) {
    //     const button = this.add.text(x, y, text, { fontSize: '32px', fill: '#0f0' })
    //         .setInteractive()
    //         .on('pointerdown', callback)
    //         .on('pointerover', () => button.setStyle({ fill: '#ff0' }))
    //         .on('pointerout', () => button.setStyle({ fill: '#0f0' }));
    // }
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