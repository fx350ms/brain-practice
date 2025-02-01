export class Play extends Phaser.Scene {
    constructor() {
        super({
            key: 'Play'
        });
    }

    init(data) {
        this.level = data.level;
        this.gridSize = data.gridSize;
        this.randomCells = data.randomCells;
        this.previewTimer = 3;
        this.gameTimer = 15;
    }

    create() {
        // Add background image and set it to fill the canvas
        const bg = this.add.image(0, 0, 'background').setOrigin(0, 0);
        bg.displayWidth = this.sys.game.config.width;
        bg.displayHeight = this.sys.game.config.height;

        this.timeLeft = this.previewTimer; // Initialize timeLeft before creating the grid
        this.createGrid(this.gridSize);
        this.startPreviewTimer(this.timeLeft); // Start preview timer for 5 seconds

        if (!this.sound.get('backgroundMusic')) {
           this.backgroundMusic = this.sound.add('backgroundMusic', { loop: true });
           this.backgroundMusic.play();
        }

        this.jumpSound = this.sound.add('jumpSound');
    }

    createGrid(size) {
        const cellSize = 50;
        const gridWidth = size * cellSize;
        const gridHeight = size * cellSize;
        const offsetX = (this.cameras.main.width - gridWidth) / 2;
        const offsetY = (this.cameras.main.height - gridHeight) / 2;

        const colors = [0xffffff, 0xff0000, 0x0000ff, 0x00ff00]; // Blank, Red, Blue, Green
        this.colors = colors;
        this.coloredCells = this.getRandomCells(size, this.randomCells);

        this.grid = [];
        for (let row = 0; row < size; row++) {
            this.grid[row] = [];
            for (let col = 0; col < size; col++) {
                const cell = this.coloredCells.find(cell => cell.row === row && cell.col === col);
                const color = cell ? cell.color : colors[0];
                const rect = this.add.rectangle(offsetX + col * cellSize, offsetY + row * cellSize, cellSize, cellSize, color)
                    .setStrokeStyle(2, 0x000000);
                this.grid[row][col] = rect;
            }
        }

        // Add preview timer text above the grid with border
        this.timerText = this.add.text(this.cameras.main.width / 2, offsetY - 50, `Preview Time: ${this.timeLeft}`, {
            fontSize: '32px',
            fill: '#fff',
            stroke: '#000',
            strokeThickness: 4
        }).setOrigin(0.5, 0.5);
    }


    getRandomCells(size, count) {
        const cells = [];
        while (cells.length < count) {
            const row = Phaser.Math.Between(0, size - 1);
            const col = Phaser.Math.Between(0, size - 1);
            if (!cells.some(cell => cell.row === row && cell.col === col)) {
                const color = Phaser.Utils.Array.GetRandom(this.colors.slice(1));
                cells.push({ row, col, color });
            }
        }
        return cells;
    }

    startPreviewTimer(seconds) {
        this.timeLeft = seconds;

        this.timerEvent = this.time.addEvent({
            delay: 1000,
            callback: this.updatePreviewTimer,
            callbackScope: this,
            loop: true
        });
    }

    updatePreviewTimer() {
        this.timeLeft--;
        this.timerText.setText(`Preview Time: ${this.timeLeft}`);

        if (this.timeLeft <= 0) {
            this.timerEvent.remove();
            this.saveState();
            this.resetGrid();
            this.startGameTimer(this.gameTimer ); // Start game timer for 30 seconds
        }
    }

    saveState() {
        this.savedState = this.coloredCells.map(cell => ({
            row: cell.row,
            col: cell.col,
            color: this.grid[cell.row][cell.col].fillColor
        }));
        console.log('Saved State:', this.savedState);
    }

    resetGrid() {
        for (let row = 0; row < this.gridSize; row++) {
            for (let col = 0; col < this.gridSize; col++) {
                this.grid[row][col].setFillStyle(0xffffff)
                    .setInteractive()
                    .on('pointerdown', () => this.changeColor(this.grid[row][col]));
            }
        }
    }

    startGameTimer(seconds) {
        this.timeLeft = seconds;
        this.timerText.setText(`Time: ${this.timeLeft}`);

        this.timerEvent = this.time.addEvent({
            delay: 1000,
            callback: this.updateGameTimer,
            callbackScope: this,
            loop: true
        });
    }


    updateGameTimer() {
        this.timeLeft--;
        this.timerText.setText(`Time: ${this.timeLeft}`);

        if (this.timeLeft <= 0) {
            this.timerEvent.remove();
            this.scene.start('GameOver', {
                level: this.level,
                maxLevel: 9, // Assuming max level is 9
                oldMatrix: this.coloredCells,
                currentMatrix: this.grid.map(row => row.map(cell => cell.fillColor)),
                gridSize: this.gridSize,
                randomCells: this.randomCells
            });
        }
    }

    changeColor(rect) {
        const currentColor = rect.fillColor;
        const nextColor = this.colors[(this.colors.indexOf(currentColor) + 1) % this.colors.length];
        rect.setFillStyle(nextColor);
        this.jumpSound.play();
        this.checkGameFinish();
    }

    checkGameFinish() {
        const isFinished = this.savedState.every(cell => {
            return this.grid[cell.row][cell.col].fillColor === cell.color;
        });

        if (isFinished) {
            this.timerEvent.remove();
            this.scene.start('GameCompleted', { level: this.level, gridSize : this.gridSize, randomCells : this.randomCells}); // Assuming max level is 9
        }
    }


}