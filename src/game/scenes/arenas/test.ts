export class TestScene extends Phaser.Scene {
  gameWidth: number;
  gameHeight: number;
  platforms: Phaser.Physics.Arcade.StaticGroup;
  ground: Phaser.GameObjects.Rectangle;
  player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  cursors: Phaser.Types.Input.Keyboard.CursorKeys;

  constructor() {
    super('TestScene');
  }

  preload() {
    this.load.image('platform', 'https://labs.phaser.io/assets/sprites/platform.png');
  }

  init() {
    this.gameWidth = this.scale.width;
    this.gameHeight = this.scale.height;
  }

  create() {
    this.createTitle();
    this.createGround();
    this.createPlatforms();
  }

  createTitle() {
    this.add.text(16, 16, 'Samurai Gunn Level Test', {
      fontSize: '24px',
      color: '#000',
    });
  }

  createGround() {
    this.ground = this.add
      .rectangle(
        0,
        Number(this.gameHeight),
        Number(this.gameWidth),
        Number(this.gameHeight) / 15,
        0x8b4513
      )
      .setOrigin(0, 1);

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
}
