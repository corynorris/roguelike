import Map from './map';

export function spawnPlayer(map) {
  return Map.getRandomSpawn(map);  
}