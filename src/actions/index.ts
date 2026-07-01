import { Coord } from "../types";

export interface ResetDataAction {
  type: "RESET_DATA";
}

export interface SetSpritePositionAction {
  type: "SET_SPRITE_POSITION";
  id: string;
  x: number;
  y: number;
}

export interface SpawnSpriteAction {
  type: "SPAWN_SPRITE";
  name: string;
  level: number;
  x: number;
  y: number;
}

export interface SetScreenOffsetAction {
  type: "SET_SCREEN_OFFSET";
  top: number;
  left: number;
}

export interface DestroySpriteAction {
  type: "DESTROY_SPRITE";
  id: string;
}

export interface AttackSpriteAction {
  type: "ATTACK_SPRITE";
  id: string;
  damage: number;
}

export interface SetSpriteHealthAction {
  type: "SET_SPRITE_HEALTH";
  id: string;
  health: number;
}

export interface SetSpritePowerAction {
  type: "SET_SPRITE_POWER";
  id: string;
  power: number;
}

export interface ToggleFogAction {
  type: "TOGGLE_FOG";
}

export interface SetBloodAction {
  type: "SET_BLOOD";
  value: boolean;
}

export interface DefeatAction {
  type: "DEFEAT";
}

export interface VictoryAction {
  type: "VICTORY";
}

export interface AddExperienceAction {
  type: "ADD_EXPERIENCE";
  id: string;
  experience: number;
}

export type Action =
  | ResetDataAction
  | SetSpritePositionAction
  | SpawnSpriteAction
  | SetScreenOffsetAction
  | DestroySpriteAction
  | AttackSpriteAction
  | SetSpriteHealthAction
  | SetSpritePowerAction
  | ToggleFogAction
  | SetBloodAction
  | DefeatAction
  | VictoryAction
  | AddExperienceAction;

export const resetData = (): ResetDataAction => ({
  type: "RESET_DATA",
});

export const setSpritePosition = (
  id: string,
  x: number,
  y: number,
): SetSpritePositionAction => ({
  type: "SET_SPRITE_POSITION",
  id,
  x,
  y,
});

export const spawnSprite = (
  name: string,
  level: number,
  { x, y }: Coord,
): SpawnSpriteAction => ({
  type: "SPAWN_SPRITE",
  name,
  level,
  x,
  y,
});

export const setScreenOffset = (
  top: number,
  left: number,
): SetScreenOffsetAction => ({
  type: "SET_SCREEN_OFFSET",
  top,
  left,
});

export const destroySprite = (id: string): DestroySpriteAction => ({
  type: "DESTROY_SPRITE",
  id,
});

export const attackSprite = (
  id: string,
  damage: number,
): AttackSpriteAction => ({
  type: "ATTACK_SPRITE",
  id,
  damage,
});

export const setSpriteHealth = (
  id: string,
  health: number,
): SetSpriteHealthAction => ({
  type: "SET_SPRITE_HEALTH",
  id,
  health,
});

export const setSpritePower = (
  id: string,
  power: number,
): SetSpritePowerAction => ({
  type: "SET_SPRITE_POWER",
  id,
  power,
});

export const toggleFog = (): ToggleFogAction => ({
  type: "TOGGLE_FOG",
});

export const setBlood = (value: boolean): SetBloodAction => ({
  type: "SET_BLOOD",
  value,
});

export const defeat = (): DefeatAction => ({
  type: "DEFEAT",
});

export const victory = (): VictoryAction => ({
  type: "VICTORY",
});

export const addExperience = (
  id: string,
  experience: number,
): AddExperienceAction => ({
  type: "ADD_EXPERIENCE",
  id,
  experience,
});
