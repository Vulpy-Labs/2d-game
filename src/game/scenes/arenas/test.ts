import {
  CHARACTER_SPEED_X,
  CHARACTER_SPEED_Y,
  VIRTUAL_HEIGHT,
  VIRTUAL_WIDTH,
} from '../../constants';

type CharacterState =
  | 'IDLE'
  | 'RUNNING'
  | 'JUMPING'
  | 'IN_AIR'
  | 'LOOKING_UP'
  | 'LOOKING_DOWN'
  | 'ATTACKING_SWORD'
  | 'ATTACKING_SWORD_UP'
  | 'ATTACKING_SWORD_DOWN';

export class TestScene extends Phaser.Scene {
  gameWidth = VIRTUAL_WIDTH;
  gameHeight = VIRTUAL_HEIGHT;
  mapImages: string[];
  platforms: Phaser.Tilemaps.TilemapLayer;
  map: Phaser.Tilemaps.Tilemap;
  character: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  characterState: CharacterState = 'IDLE';

  constructor() {
    super('TestScene');
  }

  preload() {
    this.loadAssets();
  }

  loadAssets() {
    this.loadMapAssets();
    this.loadCharacterMovementAssets();
    this.loadCharacterAttackAssets();
  }

  loadMapAssets() {
    this.load.image('platform', 'https://labs.phaser.io/assets/sprites/platform.png');
    this.load.tilemapTiledJSON('canyon_map', 'assets/maps/canyon.json');
    this.loadMapImages();
  }

  loadCharacterMovementAssets() {
    this.load.spritesheet('spr_idle', 'assets/characters/otomo/v1/spr_idle.png', {
      frameWidth: 16,
      frameHeight: 16,
    });
    this.load.spritesheet('spr_running', 'assets/characters/otomo/v1/spr_running.png', {
      frameWidth: 16,
      frameHeight: 16,
    });
    this.load.spritesheet('spr_jump', 'assets/characters/otomo/v1/spr_jump.png', {
      frameWidth: 16,
      frameHeight: 16,
    });
    this.load.spritesheet('spr_look_up', 'assets/characters/otomo/v1/spr_lookup.png', {
      frameWidth: 16,
      frameHeight: 16,
    });
    this.load.spritesheet('spr_look_down', 'assets/characters/otomo/v1/spr_lookdown.png', {
      frameWidth: 16,
      frameHeight: 16,
    });
  }

  loadCharacterAttackAssets() {
    this.load.spritesheet('spr_sword', 'assets/sprites/combat/melee/spr_sword/spr_sword.png', {
      frameWidth: 16,
      frameHeight: 16,
    });
    this.load.spritesheet('spr_attack_sword', 'assets/characters/otomo/v1/spr_shortattack.png', {
      frameWidth: 16,
      frameHeight: 16,
    });
    this.load.spritesheet(
      'spr_attack_sword_up',
      'assets/characters/otomo/v1/spr_shortattackup.png',
      {
        frameWidth: 16,
        frameHeight: 16,
      }
    );
    this.load.spritesheet(
      'spr_attack_sword_down',
      'assets/characters/otomo/v1/spr_shortattackdown.png',
      {
        frameWidth: 16,
        frameHeight: 16,
      }
    );

    // Sword slash trail
    for (let i = 0; i < 5; i++) {
      this.load.image(`spr_sword_${i}`, `assets/sprites/combat/melee/spr_sword/spr_sword_${i}.png`);
    }
  }

  create() {
    this.createMap();
    this.createTitle();
    this.createCharacter();
    this.createKeyboardInputs();
  }

  update() {
    this.updateCharacterMovement();
  }

  loadMapImages() {
    this.mapImages = [
      'bg_FG_0',
      'at_bgrock_0',
      'bg_rock_0',
      'bg_bamboo_0',
      'spr_bamboo_1',
      'spr_grass_group_1',
      'spr_grass_group_2',
      'bg_forestrock_0',
    ];

    this.mapImages.forEach(image => {
      this.load.image(image, `assets/sprites/maps/${image}.png`);
    });
  }

  createTitle() {
    this.add.text(16, 16, 'Slash Out Level Test', {
      fontStyle: 'bold',
      fontSize: '14px',
      color: '#fff',
    });
  }

  createMap() {
    this.map = this.make.tilemap({ key: 'canyon_map' });
    const tilesets: Phaser.Tilemaps.Tileset[] = [];

    this.mapImages.forEach(image => {
      const tileset = this.map.addTilesetImage(image, image);
      if (tileset) tilesets.push(tileset);
    });

    this.createMapLayer('background', tilesets);

    const ground = this.createMapLayer('ground', tilesets);
    this.platforms = ground.find(ground => ground?.layer.name.includes('platform'))!;

    this.platforms.setCollisionByProperty({ collider: true });

    this.createMapLayer('foreground', tilesets);
  }

  createMapLayer(layersGroup: string, tilesets: Phaser.Tilemaps.Tileset[]) {
    return this.map.layers
      .filter(layer => layer.name.startsWith(`${layersGroup}/`))
      .map(layer => {
        return this.map.createLayer(layer.name, tilesets, 0, 0);
      });
  }

  createCharacter() {
    this.character = this.physics.add.sprite(150, 100, 'spr_idle');

    this.createCharacterCollisions();
    this.createCharacterAnimations();
  }

  createCharacterCollisions() {
    this.character.setCollideWorldBounds(true);
    this.physics.add.collider(this.character, this.platforms);
  }

  createCharacterAnimations() {
    this.createCharacterMovementAnimations();
  }

  createCharacterMovementAnimations() {
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
      frames: this.anims.generateFrameNumbers('spr_look_up', { start: 0, end: 0 }),
      frameRate: 7,
      repeat: -1,
    });

    this.anims.create({
      key: 'anim_look_down',
      frames: this.anims.generateFrameNumbers('spr_look_down', { start: 0, end: 0 }),
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
    const onGround = this.character.body.blocked.down;
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
    const onGround = this.character.body.blocked.down;
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
