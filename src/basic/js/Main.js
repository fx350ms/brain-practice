import { Preloader } from './Preloader.js';
import { LevelSelect } from './LevelSelect.js';
import { Play } from './Play.js';
import { GameOver } from './GameOver.js';
import { GameCompleted } from './GameCompleted.js';

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: [Preloader, LevelSelect, Play, GameOver, GameCompleted]
};

const game = new Phaser.Game(config);

window.onload = () => {
    game.scene.start('Preloader');
};