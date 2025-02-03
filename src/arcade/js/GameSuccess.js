export class GameSuccess extends Phaser.Scene {
    constructor() {
        super({
            key: 'GameSuccess'
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
        const { width, height } = this.sys.game.config;
        bg.displayWidth = this.sys.game.config.width;
        bg.displayHeight = this.sys.game.config.height;
        const centerX = this.cameras.main.width / 2;

        // this.add.text(centerX, 50, 'YEAHHH!!!!!', { fontSize: '32px', fill: '#f00', fontWeight: 'bold',
        //     stroke: '#000',
        //     strokeThickness: 4
        // }).setOrigin(0.5, 0.5);

        this.displayMatrices();

        //  this.saveHighScore(this.score); // Save the high score


        const titleBackground = this.add.rectangle(width / 2, 60, width * 0.8, 70, 0x000000, 0.5);
        titleBackground.setOrigin(0.5, 0.5);
        // Hiển thị thông tin Level ở đầu màn hình
        this.title = this.add.text(this.cameras.main.width / 2, 60, 'YEAHHH!!!!!', {
            fontSize: `${Math.min(width, height) * 0.09}px`,
            fill: '#5fc309',
            stroke: '#ffffff',
            strokeThickness: 4,
            shadow: {
                offsetX: 3,
                offsetY: 3,
                color: '#000',
                blur: 3,
                stroke: true,
                fill: true
            }
        }).setOrigin(0.5, 0.5);

        const nextLevel = this.level < this.maxLevel ? this.level + 1 : this.level;
        const score = this.score + 1;
     

        this.createButton(100, 500, 'Chơi tiếp', () =>   this.scene.start('Play', { level: nextLevel, score }));

    }

    displayMatrices() {
        const cellSize = 16; // Reduced cell size to half
        const halfWidth = this.cameras.main.width / 2;
        const offsetY = 250; // Adjusted to leave space for the label

        // Display old matrix
        const oldMatrixCenterX = halfWidth / 2;
        const oldMatrixOffsetX = oldMatrixCenterX - (this.gridSize * cellSize) / 2;

        const titleBackground1 = this.add.rectangle(oldMatrixCenterX,  offsetY - 30, halfWidth * 0.7, 30, 0x000000, 0.8);
        titleBackground1.setOrigin(0.5, 0.5);


        this.add.text(oldMatrixCenterX, offsetY - 30, 'Mục tiêu', {
            fontSize: '28px',
            fill: '#37b5ff',
            fontweight: 'bold',
            stroke: '#ffffff',
        }).setOrigin(0.5, 0.5);
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

        
        const titleBackground2 = this.add.rectangle(currentMatrixCenterX,  offsetY - 30, halfWidth * 0.7, 30, 0x000000, 0.8);
        titleBackground2.setOrigin(0.5, 0.5);

        this.add.text(currentMatrixCenterX, offsetY - 30, 'Của bạn', {
            fontSize: '28px',
            fill: '#92e726',
            stroke: '#ffffff',
            fontweight: 'bold',

        }).setOrigin(0.5, 0.5);
        for (let row = 0; row < this.gridSize; row++) {
            for (let col = 0; col < this.gridSize; col++) {
                const color = this.currentMatrix[row][col];
                this.add.rectangle(currentMatrixOffsetX + col * cellSize, offsetY + row * cellSize, cellSize, cellSize, color)
                    .setStrokeStyle(2, 0x000000);
            }
        }
    }

    saveHighScore(score) {
        let highScores = JSON.parse(localStorage.getItem('highScores')) || [];
        highScores.push(score);
        highScores.sort((a, b) => b - a);
        highScores = highScores.slice(0, 10); // Keep only top 10 scores
        localStorage.setItem('highScores', JSON.stringify(highScores));
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