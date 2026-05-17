import * as THREE from 'three';
import { createPiece, BRICK_H } from './pieces.js';

const SAVE_KEY = 'briccd_save_data';

export function saveToLocal(scene, draggables) {
  const data = draggables.map(obj => ({
    type: obj.name,
    position: obj.position.toArray(),
    rotation: obj.rotation.toArray().slice(0, 3), // [x, y, z]
    color: obj.children[0].material.color.getHex(),
    userData: obj.userData
  }));

  localStorage.setItem(SAVE_KEY, JSON.stringify(data));
  console.log('Saved to local device');
}

export function loadFromLocal(scene, addDraggable) {
  const raw = localStorage.getItem(SAVE_KEY);
  if (!raw) return false;

  const data = JSON.parse(raw);
  
  // Clear existing (optional - maybe user wants to merge? Let's clear for "Load")
  // For now, let's just add them.
  
  data.forEach(item => {
    const piece = createPiece(item.type);
    if (piece) {
      piece.position.fromArray(item.position);
      piece.rotation.fromArray([...item.rotation, 'XYZ']);
      
      // Update color if it was custom
      if (item.color) {
        piece.traverse(child => {
          if (child.isMesh) child.material.color.setHex(item.color);
        });
      }
      
      scene.add(piece);
      addDraggable(piece);
    }
  });

  return true;
}
