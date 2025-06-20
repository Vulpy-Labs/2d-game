import {
  CHARACTER_SPEED_X,
  CHARACTER_SPEED_Y,
  VIRTUAL_HEIGHT,
  VIRTUAL_WIDTH,
} from '../../constants';

type CharacterState = 'IDLE' | 'RUNNING' | 'JUMPING' | 'IN_AIR' | 'LOOKING_UP' | 'LOOKING_DOWN';

export class TestScene extends Phaser.Scene {
  gameWidth = VIRTUAL_WIDTH;
  gameHeight = VIRTUAL_HEIGHT;
  platforms: Phaser.Physics.Arcade.StaticGroup;
  ground: Phaser.GameObjects.Rectangle;
  character: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  characterState: CharacterState = 'IDLE';

  constructor() {
    super('TestScene');
  }

  preload() {
    this.load.image('platform', 'https://labs.phaser.io/assets/sprites/platform.png');

    this.load.spritesheet('spr_idle', 'assets/characters/otomo/v1/spr_idle.png', {
      frameWidth: 16,
      frameHeight: 18,
    });
    this.load.spritesheet('spr_running', 'assets/characters/otomo/v1/spr_running.png', {
      frameWidth: 16,
      frameHeight: 18,
    });
    this.load.spritesheet('spr_jump', 'assets/characters/otomo/v1/spr_jump.png', {
      frameWidth: 16,
      frameHeight: 18,
    });
    this.load.spritesheet('spr_lookup', 'assets/characters/otomo/v1/spr_lookup.png', {
      frameWidth: 16,
      frameHeight: 18,
    });
    this.load.spritesheet('spr_lookdown', 'assets/characters/otomo/v1/spr_lookdown.png', {
      frameWidth: 16,
      frameHeight: 18,
    });
  }

  create() {
    this.createTitle();
    this.createGround();
    this.createPlatforms();
    this.createCharacter();
    this.createKeyboardInputs();
  }

  update() {
    this.updateCharacterMovement();
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
      { posX: 0, posY: 930, scaleX: 0.4, scaleY: 0.5 },
      { posX: 0, posY: 680, scaleX: 1.1, scaleY: 0.5 },
      { posX: 280, posY: 850, scaleX: 0.7, scaleY: 0.5 },
      { posX: 620, posY: 560, scaleX: 0.4, scaleY: 0.5 },
      { posX: 680, posY: 760, scaleX: 0.3, scaleY: 0.5 },
      { posX: 700, posY: 930, scaleX: 0.3, scaleY: 0.5 },
      { posX: 925, posY: 800, scaleX: 0.8, scaleY: 0.5 },
      { posX: 950, posY: 600, scaleX: 0.3, scaleY: 0.5 },
      { posX: 1100, posY: 700, scaleX: 0.3, scaleY: 0.5 },
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
    this.character = this.physics.add.sprite(450, 600, 'spr_idle').setScale(3);

    this.createCharacterCollisions();
    this.createCharacterAnimations();
  }

  createCharacterCollisions() {
    this.character.setCollideWorldBounds(true);
    this.physics.add.collider(this.character, this.ground);
    this.physics.add.collider(this.character, this.platforms);
  }

  createCharacterAnimations() {
    this.anims.create({
      key: 'anim_idle',
      frames: this.anims.generateFrameNumbers('spr_idle', { start: 0, end: 0 }),
      frameRate: 7,
      repeat: -1,
    });

    this.anims.create({
      key: 'anim_running',
      frames: this.anims.generateFrameNumbers('spr_running', { start: 0, end: 1 }),
      frameRate: 6,
      repeat: -1,
    });

    this.anims.create({
      key: 'anim_look_up',
      frames: this.anims.generateFrameNumbers('spr_lookup', { start: 0, end: 0 }),
      frameRate: 7,
      repeat: -1,
    });

    this.anims.create({
      key: 'anim_look_down',
      frames: this.anims.generateFrameNumbers('spr_lookdown', { start: 0, end: 0 }),
      frameRate: 7,
      repeat: -1,
    });

    this.anims.create({
      key: 'anim_jump',
      frames: this.anims.generateFrameNumbers('spr_jump', { start: 1, end: 2 }),
      frameRate: 12,
    });

    this.anims.create({
      key: 'anim_in_air',
      frames: this.anims.generateFrameNumbers('spr_jump', { start: 2, end: 2 }),
      frameRate: 12,
    });
  }

  setCharacterState(newState: CharacterState) {
    if (this.characterState === newState) return;

    this.characterState = newState;

    switch (newState) {
      case 'IDLE':
        this.character.anims.play('anim_idle', true);
        break;
      case 'RUNNING':
        this.character.anims.play('anim_running', true);
        break;
      case 'JUMPING':
        this.character.anims.play('anim_jump', true);
        break;
      case 'IN_AIR':
        this.character.anims.play('anim_in_air', true);
        break;
      case 'LOOKING_UP':
        this.character.anims.play('anim_look_up', true);
        break;
      case 'LOOKING_DOWN':
        this.character.anims.play('anim_look_down', true);
        break;
    }
  }

  createKeyboardInputs() {
    this.cursors = this.input.keyboard!.createCursorKeys();
  }

  updateCharacterMovement() {
    if (!this.character || !this.cursors) return;

    this.updateHorizontalMovement();
    this.updateVerticalMovement();
  }

  updateHorizontalMovement() {
    const onGround = this.character.body.touching.down;
    const isMovingHorizontally = this.cursors.left.isDown || this.cursors.right.isDown;

    if (this.cursors.left.isDown) {
      this.character.setVelocityX(-CHARACTER_SPEED_X);
      this.character.setFlipX(true);

      if (onGround) {
        this.setCharacterState('RUNNING');
      }
    } else if (this.cursors.right.isDown) {
      this.character.setVelocityX(CHARACTER_SPEED_X);
      this.character.setFlipX(false);

      if (onGround) {
        this.setCharacterState('RUNNING');
      }
    } else if (onGround && !isMovingHorizontally) {
      this.character.setVelocityX(0);
      this.setCharacterState('IDLE');
    }
  }

  updateVerticalMovement() {
    const onGround = this.character.body.touching.down;
    const isMovingHorizontally = this.cursors.left.isDown || this.cursors.right.isDown;

    if (Phaser.Input.Keyboard.JustDown(this.cursors.space) && onGround) {
      this.character.setVelocityY(-CHARACTER_SPEED_Y);
      this.setCharacterState('JUMPING');
    }

    if (!onGround) {
      this.setCharacterState('IN_AIR');
    }

    if (this.cursors.up.isDown && !isMovingHorizontally && onGround) {
      this.setCharacterState('LOOKING_UP');
    } else if (this.cursors.down.isDown && !isMovingHorizontally && onGround) {
      this.setCharacterState('LOOKING_DOWN');
    }
  }
}
