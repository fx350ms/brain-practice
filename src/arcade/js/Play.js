export class Play extends Phaser.Scene {
    constructor() {
        super({
            key: 'Play'
        });
    }

    init(data) {

        this.level = data.level || 1;
        this.gridSize = 10;
        this.randomCells = data.level;
        this.previewTimer = 5;
        this.gameTimer = 30;
        this.maxLevel = 100;
        this.score = data.score || 0;
        this.fillCells = [];
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
        this.createMuteButton();

        this.jumpSound = this.sound.add('jumpSound');
    }

    createGrid(size) {
        // Yêu cầu khoảng cách từ biên đến grid ít nhất là 20px
        const margin = 20;
        // Giới hạn kích thước cell: tối thiểu 25px, tối đa 50px
        const minCellSize = 20;
        const maxCellSize = 50;
        const { width, height } = this.sys.game.config;
        // Lấy kích thước cửa sổ từ camera
        const availableWidth = this.cameras.main.width;
        const availableHeight = this.cameras.main.height;

        // Tính kích thước cell tối đa sao cho toàn bộ grid (size x size) nằm trong khu vực có khoảng cách margin ở hai bên.
        // Sử dụng công thức: cellSize_candidate = min((availableWidth - 2*margin) / size, (availableHeight - 2*margin) / size)
        let cellSizeCandidate = Math.min(
            (availableWidth - margin * 2) / size,
            (availableHeight - margin * 2) / size
        );
        // Giới hạn cellSize trong khoảng từ minCellSize đến maxCellSize
        cellSizeCandidate = Phaser.Math.Clamp(cellSizeCandidate, minCellSize, maxCellSize);
        const cellSize = cellSizeCandidate;

        // Tính toán kích thước của grid (10 x 10 cells)
        const gridWidth = size * cellSize;
        const gridHeight = size * cellSize;

        // Tính toán offset để căn giữa grid:
        // Vì grid được đảm bảo không vượt quá (availableWidth - 2*margin) nên offsetX và offsetY sẽ luôn >= margin.
        const offsetX = (availableWidth - gridWidth) / 2;
        const offsetY = (availableHeight - gridHeight) / 2;

        // Danh sách màu: phần tử đầu tiên dùng cho ô trống
        const colors = [0xffffff, 0xff0000, 0x0000ff, 0x00ff00]; // Trắng, Đỏ, Xanh dương, Xanh lá
        this.colors = colors;
        // Lấy danh sách các ô cần tô màu ngẫu nhiên (hàm getRandomCells trả về danh sách các đối tượng có cấu trúc { row, col, color })
        this.coloredCells = this.getRandomCells(size, this.randomCells);

        // Tạo grid (mảng 2 chiều chứa các đối tượng rectangle)
        this.grid = [];
        for (let row = 0; row < size; row++) {
            this.grid[row] = [];
            for (let col = 0; col < size; col++) {
                // Kiểm tra nếu ô tại vị trí (row, col) có được chọn để tô màu
                const cellData = this.coloredCells.find(cell => cell.row === row && cell.col === col);
                const color = cellData ? cellData.color : colors[0]; // Nếu có, dùng màu của cellData, nếu không thì dùng màu trắng
                // Tạo một hình chữ nhật đại diện cho cell
                const rect = this.add.rectangle(
                    offsetX + col * cellSize + cellSize / 2, // Tọa độ X tính từ offset
                    offsetY + row * cellSize, // Tọa độ Y tính từ offset
                    cellSize,                 // Chiều rộng của cell
                    cellSize,                 // Chiều cao của cell
                    color                     // Màu nền của cell
                ).setStrokeStyle(2, 0x000000); // Thêm viền màu đen với độ dày 2

                // Lưu lại đối tượng cell vào mảng grid
                this.grid[row][col] = rect;
            }
        }

        const titleBackground = this.add.rectangle(width / 2, 60, width * 0.8, 70, 0x000000, 0.7);
        titleBackground.setOrigin(0.5, 0.5);
        // Hiển thị thông tin Level ở đầu màn hình
        this.title = this.add.text(this.cameras.main.width / 2, 60, `Cấp độ: ${this.level}`, {
            fontSize: `${Math.min(width, height) * 0.09}px`,
            fill: '#FFF',
            stroke: '#000',
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
        // Calculate the bottom position of the grid
        const gridBottom = offsetY + gridHeight;

        // // Add preview timer text 50px below the bottom of the grid
        // this.timerText = this.add.text(width / 2, gridBottom + 20, `Preview Time: ${this.timeLeft}`, {
        //     fontSize: `${Math.min(width, height) * 0.08}px`,
        //     fill: '#FFF',
        //     stroke: '#f00',
        //     strokeThickness: 4
        // }).setOrigin(0.5, 0.5);

        // Create a rectangle background for the timer text
        const timerBackground = this.add.rectangle(width / 2, gridBottom + 50, width * 0.8, 50, 0x000000, 0.5);
        timerBackground.setOrigin(0.5, 0.5);

        // Add preview timer text 50px below the bottom of the grid
        this.timerText = this.add.text(width / 2, gridBottom + 50, `Preview Time: ${this.timeLeft}`, {
            fontSize: `${Math.min(width, height) * 0.07}px`,
            fill: '#fa1010',
            stroke: '#ffffff',
            strokeThickness: 1,
            shadow: {
                offsetX: 3,
                offsetY: 3,
                color: '#000',
                blur: 3,
                stroke: true,
                fill: true
            }
        }).setOrigin(0.5, 0.5);
        var buttonWidth = 200;
        var x = (width - buttonWidth) / 2;
        this.createButton(x, gridBottom + 100, 200, 50, 'Ván mới', () => { this.scene.restart({ level: this.level, score: this.score }); });
    }

    createTimerText() {

    }


    createMuteButton() {
        const muteButton = this.add.text(this.cameras.main.width - 20, 20, '🔊', {
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

    createMuteButton() {
        const muteButton = this.add.text(this.cameras.main.width - 20, 20, '🔊', {
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


    // createRestartButton() {
    //     const { width, height } = this.sys.game.config;
    //     const restartButton = this.add.text(width - 20, height - 20, 'Chơi ván mới', {
    //         fontSize: '32px',
    //         fill: '#fff',
    //         backgroundColor: '#000',
    //         padding: { x: 10, y: 5 }
    //     }).setOrigin(1, 1).setInteractive();

    //     restartButton.on('pointerdown', () => {
    //         this.scene.restart({ level: this.level, score: this.score });
    //     });
    // }
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
            this.startGameTimer(this.gameTimer); // Start game timer for 30 seconds
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
                    .on('pointerdown', () => this.changeColor(this.grid[row][col], row, col));
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
                oldMatrix: this.coloredCells,
                currentMatrix: this.grid.map(row => row.map(cell => cell.fillColor)),
                gridSize: this.gridSize,
                randomCells: this.randomCells,
                score: this.score
            });
        }
    }

    changeColor(rect, row, col) {
        const currentColor = rect.fillColor;
        const nextColor = this.colors[(this.colors.indexOf(currentColor) + 1) % this.colors.length];
        rect.setFillStyle(nextColor);
        if (nextColor == 0xffffff) {
            var cellIndex = this.fillCells.findIndex(cell => cell.row === row && cell.col === col);
            if (cellIndex >= 0) {
                this.fillCells.splice(cellIndex, 1);
            }
        }
        else {
            var cellIndex = this.fillCells.findIndex(cell => cell.row === row && cell.col === col);
            if (cellIndex >= 0) {
                ///this.fillCells.pop(cell);
                this.fillCells[cellIndex].color = nextColor;
            }
            else {
                this.fillCells.push({ row: row, col: col, color: nextColor });
            }
        }
        this.jumpSound.play();
        this.checkGameFinish();
    }

    checkGameFinish() {
        if (this.fillCells.length == this.randomCells) {
            var isFinished = this.fillCells.every(cell => {
                return this.coloredCells.some(c => c.row == cell.row && c.col == cell.col && c.color == cell.color);
            });
            if (isFinished) {
                this.timerEvent.remove();
                const nextLevel = this.level < this.maxLevel ? this.level + 1 : this.level;
                const score = this.score + 1;
                this.scene.start('Play', { level: nextLevel, score });
                this.scene.start('GameSuccess', {
                    level: this.level,
                    maxLevel: 100, // Assuming max level is 9
                    oldMatrix: this.coloredCells,
                    currentMatrix: this.grid.map(row => row.map(cell => cell.fillColor)),
                    gridSize: this.gridSize,
                    randomCells: this.randomCells,
                    score: this.score
                });
            }
        }
    }


}