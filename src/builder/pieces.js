import * as THREE from 'three';

// Standard brick dimensions: 1 unit = 1 stud width (8mm at 1:1)
export const BRICK_W = 1;
export const BRICK_H = 0.4;
export const STUD_R = 0.16;
export const STUD_H = 0.06;
export const GRID_SIZE = 10; // -10 to 10 range (20x20)

export const pieceTypes = [
  { name: '1x1 Brick',  grid: [1,1,1], color: 0xff3333 },
  { name: '1x2 Brick',  grid: [1,2,1], color: 0x33ff33 },
  { name: '2x4 Brick',  grid: [2,4,1], color: 0x3333ff },
  { name: '1x1 Plate',  grid: [1,1,1], color: 0xffaa00, isPlate: true },
  { name: '1x2 Tile',   grid: [1,2,1], color: 0xaaaaaa, isTile: true },
];

export function createPiece(typeKey) {
  const spec = pieceTypes.find(p => p.name === typeKey);
  if (!spec) return null;

  const [h, w, d] = spec.grid;
  
  const actualH = spec.isPlate || spec.isTile ? BRICK_H / 3 : BRICK_H * h;
  const group = new THREE.Group();
  group.name = typeKey;
  group.userData.height = actualH;
  
  const bodyGeo = new THREE.BoxGeometry(w * BRICK_W, actualH, d * BRICK_W);
  const bodyMat = new THREE.MeshStandardMaterial({ color: spec.color });
  const body = new THREE.Mesh(bodyGeo, bodyMat);
  group.add(body);

  // Add studs (skip for tiles)
  if (!spec.isTile) {
    const studGeo = new THREE.CylinderGeometry(STUD_R, STUD_R, STUD_H, 8);
    const studMat = new THREE.MeshStandardMaterial({ color: spec.color });
    for (let x = 0; x < w; x++) {
      for (let z = 0; z < d; z++) {
        const stud = new THREE.Mesh(studGeo, studMat);
        stud.position.set(
          (x - (w-1)/2) * BRICK_W,
          actualH/2 + STUD_H/2,
          (z - (d-1)/2) * BRICK_W
        );
        group.add(stud);
      }
    }
  }
  return group;
}
