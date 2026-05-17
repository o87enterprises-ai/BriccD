import * as THREE from 'three';

export function setupEraser(camera, scene, getDraggables, removeDraggable) {
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  let isEraserMode = false;

  const eraseBtn = document.getElementById('erase-mode');
  eraseBtn.addEventListener('click', () => {
    isEraserMode = !isEraserMode;
    eraseBtn.classList.toggle('active', isEraserMode);
  });

  window.addEventListener('click', (event) => {
    if (!isEraserMode) return;

    // Calculate mouse position in normalized device coordinates
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(getDraggables(), true);

    if (intersects.length > 0) {
      // Find the root group of the brick
      let obj = intersects[0].object;
      while (obj.parent && obj.parent !== scene) obj = obj.parent;
      
      scene.remove(obj);
      removeDraggable(obj);
    }
  });

  return {
    isEraserMode: () => isEraserMode
  };
}
