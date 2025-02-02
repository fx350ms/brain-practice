import { Preloader } from './Preloader.js';
import { MainMenu } from './MainMenu.js';
import { Play } from './Play.js';
import { GameOver } from './GameOver.js';
import { GameCompleted } from './GameCompleted.js';
import { Leaderboard } from './Leaderboard.js';

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: [Preloader, MainMenu, Play, GameOver, GameCompleted, Leaderboard]
};

const game = new Phaser.Game(config);
window.onload = () => {
    game.scene.start('Preloader');
};