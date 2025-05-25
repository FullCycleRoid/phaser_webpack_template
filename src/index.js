import Phaser from 'phaser';
import sky from './assets/sky.jpg';
import star from './assets/star.png';
import dude from './assets/dude2.png';
import box from './assets/box.png';

const config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    backgroundColor: '#2d2d2d',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);

function preload() {
    this.load.image('sky', sky);
    this.load.image('star', star);
    this.load.image('box', box);
    this.load.spritesheet('dude', dude, { frameWidth: 128, frameHeight: 128 });
    // this.load.audio('jump', 'assets/jump.mp3'); // Раскомментируй, если добавишь звук

    this.load.on('filecomplete', (key) => {
        console.log(`Loaded: ${key}`);
    });
    this.load.on('loaderror', (file) => {
        console.error(`Error loading: ${file.key}`);
    });
}

function create() {
    // Фон
    this.add.image(window.innerWidth / 2, window.innerHeight / 2, 'sky').setDisplaySize(window.innerWidth, window.innerHeight);

    // Звезда
    this.star = this.physics.add.image(window.innerWidth / 2, window.innerHeight / 2, 'star');
    this.star.setCollideWorldBounds(true);
    this.star.setBounce(0.8);

    // Анимации игрока
    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });
    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('dude', { start: 3, end: 0 }), // Проверь кадры
        frameRate: 10,
        repeat: -1
    });
    // Игрок
    this.player = this.physics.add.sprite(100, window.innerHeight - 200, 'dude'); // Сместили выше
    this.player.setBounce(0.2);
    this.player.setCollideWorldBounds(true);
    this.player.anims.play('turn');

    // Платформы (коробки)
    this.platforms = this.physics.add.staticGroup();
    this.platforms.create(300, window.innerHeight - 100, 'box').setScale(0.1).refreshBody();
    this.platforms.create(400, window.innerHeight - 150, 'box').setScale(0.1).refreshBody();
    this.platforms.create(500, window.innerHeight - 200, 'box').setScale(0.1).refreshBody();
    this.platforms.create(650, window.innerHeight - 250, 'box').setScale(0.1).refreshBody();

    // Коллизия между игроком и платформами
    this.physics.add.collider(this.player, this.platforms);

    // Управление
    this.cursors = this.input.keyboard.createCursorKeys();
}

function update() {
    this.star.rotation += 0.01;

    // Управление игроком
    if (this.cursors.left.isDown) {
        this.player.setVelocityX(-160);
        this.player.anims.play('left', true);
    } else if (this.cursors.right.isDown) {
        this.player.setVelocityX(160);
        this.player.anims.play('right', true);
    } else {
        this.player.setVelocityX(0);
        this.player.anims.play('turn', true);
    }

    // Прыжок только при касании платформы или земли
    if (this.cursors.up.isDown ) {
        this.player.setVelocityY(-130);
        // this.sound.play('jump'); // Раскомментируй, если добавишь звук
    }
}