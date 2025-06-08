import {
  CHARACTER_SPEED_X,
  CHARACTER_SPEED_Y,
  VIRTUAL_HEIGHT,
  VIRTUAL_WIDTH,
} from '../../constants';

export class TestScene extends Phaser.Scene {
  gameWidth = VIRTUAL_WIDTH;
  gameHeight = VIRTUAL_HEIGHT;
  platforms: Phaser.Physics.Arcade.StaticGroup;
  ground: Phaser.GameObjects.Rectangle;
  character: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  cursors: Phaser.Types.Input.Keyboard.CursorKeys;

  constructor() {
    super('TestScene');
  }

  preload() {
    this.load.image('platform', 'https://labs.phaser.io/assets/sprites/platform.png');
    this.load.image('character', 'https://labs.phaser.io/assets/sprites/phaser-dude.png');
  }

  create() {
    this.createTitle();
    this.createGround();
    this.createPlatforms();
    this.createCharacter();
    this.createKeyboardInputs();
  }

  update() {
    this.updateCharacterMoviment();
  }

  createTitle() {
    this.add.text(16, 16, 'Samurai Gunn Level Test', {
      fontSize: '24px',
      color: '#000',
    });
  }

  createGround() {
    this.ground = this.add.rectangle(
      this.gameWidth / 2,
      this.gameHeight,
      this.gameWidth,
      this.gameHeight / 6,
      0x8b4513
    );
    this.physics.add.existing(this.ground, true);
  }

  createPlatforms() {
    const data = [
      {
        posX: 0,
        posY: 600,
        scaleY: 0.5,
        scaleX: 0.4,
      },
      {
        posX: 0,
        posY: 360,
        scaleY: 0.5,
        scaleX: 1.1,
      },
      {
        posX: 270,
        posY: 520,
        scaleY: 0.5,
        scaleX: 0.6,
      },
      {
        posX: 650,
        posY: 460,
        scaleY: 0.5,
        scaleX: 0.25,
      },
      {
        posX: 625,
        posY: 600,
        scaleY: 0.5,
        scaleX: 0.8,
      },
      {
        posX: 875,
        posY: 370,
        scaleY: 0.5,
        scaleX: 0.3,
      },
    ];

    this.platformFactory(data);
  }

  platformFactory(data: { posX: number; posY: number; scaleX?: number; scaleY?: number }[]) {
    this.platforms = this.physics.add.staticGroup();

    data.forEach(({ posX, posY, scaleX = 1, scaleY = 1 }) => {
      this.platforms
        .create(posX, posY, 'platform')
        .setOrigin(0, 1)
        .setScale(scaleX, scaleY)
        .refreshBody();
    });
  }

  createCharacter() {
    this.character = this.physics.add.sprite(450, 600, 'character');

    this.character.setCollideWorldBounds(true);
    this.physics.add.collider(this.character, this.ground);
    this.physics.add.collider(this.character, this.platforms);
  }

  createKeyboardInputs() {
    this.cursors = this.input.keyboard!.createCursorKeys();
  }

  updateCharacterMoviment() {
    if (!this.character || !this.cursors) return;

    if (this.cursors.left?.isDown) {
      this.character.setVelocityX(-CHARACTER_SPEED_X);
    } else if (this.cursors.right?.isDown) {
      this.character.setVelocityX(CHARACTER_SPEED_X);
    } else {
      this.character.setVelocityX(0);
    }

    if (this.cursors.up?.isDown && this.character.body.touching.down) {
      this.character.setVelocityY(-CHARACTER_SPEED_Y);
    }
  }
}
