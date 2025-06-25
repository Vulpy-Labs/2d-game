import {
  CHARACTER_SPEED_X,
  CHARACTER_SPEED_Y,
  VIRTUAL_HEIGHT,
  VIRTUAL_WIDTH,
} from '../../constants';

export class TestScene extends Phaser.Scene {
  gameWidth = VIRTUAL_WIDTH;
  gameHeight = VIRTUAL_HEIGHT;
  mapImages: string[];
  platforms: Phaser.Tilemaps.TilemapLayer;
  map: Phaser.Tilemaps.Tilemap;
  character: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  cursors: Phaser.Types.Input.Keyboard.CursorKeys;

  constructor() {
    super('TestScene');
  }

  preload() {
    this.load.image('platform', 'https://labs.phaser.io/assets/sprites/platform.png');
    this.load.image('character', 'https://labs.phaser.io/assets/sprites/phaser-dude.png');
    this.load.tilemapTiledJSON('canyon_map', 'assets/maps/canyon.json');
    this.loadMapImages();
  }

  create() {
    this.createMap();
    this.createTitle();
    this.createKeyboardInputs();
  }

  update() {
    this.updateCharacterMoviment();
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
    this.add.text(16, 16, 'Samurai Gunn Level Test', {
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

    this.createCharacter();

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
    this.character = this.physics.add.sprite(150, 150, 'character');

    this.character.setScale(0.4);

    this.character.setCollideWorldBounds(true);
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

    if (this.cursors.up?.isDown && this.character.body.blocked.down) {
      this.character.setVelocityY(-CHARACTER_SPEED_Y);
    }
  }
}
