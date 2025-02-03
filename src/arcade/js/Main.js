import { Preloader } from './Preloader.js';
import { MainMenu } from './MainMenu.js';
import { Play } from './Play.js';
import { GameOver } from './GameOver.js';
import { GameCompleted } from './GameCompleted.js';
import { Leaderboard } from './Leaderboard.js';
import { GameSuccess } from './GameSuccess.js';

const config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    scene: [Preloader, MainMenu, Play, GameOver, GameCompleted, Leaderboard, GameSuccess],
    scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH
    }
};

const game = new Phaser.Game(config);
window.onload = () => {
    game.scene.start('Preloader');
};