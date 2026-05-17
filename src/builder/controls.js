import * as THREE from 'three';
import { DragControls } from 'three/examples/jsm/controls/DragControls.js';
import { BRICK_H, BRICK_W, GRID_SIZE } from './pieces.js';

export function setupControls(camera, renderer, scene, orbitControls) {
  const draggableObjects = [];
  const dragControls = new DragControls(draggableObjects, camera, renderer.domElement);

  dragControls.addEventListener('dragstart', () => {
    orbitControls.enabled = false;
  });

  dragControls.addEventListener('drag', (event) => {
    // Snap to grid & Clamp to boundaries
    const h = event.object.userData.height || BRICK_H;
    
    event.object.position.x = Math.max(-GRID_SIZE, Math.min(GRID_SIZE, Math.round(event.object.position.x / BRICK_W) * BRICK_W));
    event.object.position.z = Math.max(-GRID_SIZE, Math.min(GRID_SIZE, Math.round(event.object.position.z / BRICK_W) * BRICK_W));
    
    const gridY = Math.round((event.object.position.y - h/2) / BRICK_H);
    event.object.position.y = Math.max(h/2, (gridY * BRICK_H) + (h/2));
  });

  dragControls.addEventListener('dragend', (event) => {
    orbitControls.enabled = true;
    // Final "Pinning" snap
    const h = event.object.userData.height || BRICK_H;
    
    event.object.position.x = Math.round(event.object.position.x / BRICK_W) * BRICK_W;
    event.object.position.z = Math.round(event.object.position.z / BRICK_W) * BRICK_W;
    
    const gridY = Math.round((event.object.position.y - h/2) / BRICK_H);
    event.object.position.y = Math.max(h/2, (gridY * BRICK_H) + (h/2));
    
    // Add a visual "locked" flash or sound effect later
  });

  function addDraggable(obj) {
    draggableObjects.push(obj);
  }

  function removeDraggable(obj) {
    const index = draggableObjects.indexOf(obj);
    if (index > -1) draggableObjects.splice(index, 1);
  }

  return {
    dragControls,
    addDraggable,
    removeDraggable,
    getDraggables: () => draggableObjects
  };
}
