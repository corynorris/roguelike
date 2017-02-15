export default class Const {
  static WIDTH = 77;
  static HEIGHT = 37;
  static UNIT_WIDTH = 16;
  static UNIT_HEIGHT = 16;

  static PLAYER = 'Player';
  static PLAYER_LEVELS = 50;
  static PLAYER_COUNT = 1;

  static BOSS = 'Boss';
  static BOSS_LEVELS = 10;
  static BOSS_COUNT = 1;

  static WEAPON = 'Weapon';
  static WEAPON_LEVELS = 3;
  static WEAPON_COUNT = 3;

  static HEALTH = 'Health';
  static HEALTH_LEVELS = 6;
  static HEALTH_COUNT = 15;

  static ENEMY = 'Enemy';
  static ENEMY_LEVELS = 9;
  static ENEMY_COUNT = 25;
  static ENEMY_MAX_HEALTH = 300;

  static get TOTAL_ENTITIES() {
    return Const.ENEMY_COUNT + Const.HEALTH_COUNT + Const.WEAPON_COUNT + Const.BOSS_COUNT;
  }
  
}

