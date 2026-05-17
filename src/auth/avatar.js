import * as THREE from 'three';

export function assembleAvatar(scene, options = {}) {
  const {
    head = '#ffff00',
    torso = '#ff0000',
    legs = '#0000ff',
    faceType = 'classic'
  } = options;

  const group = new THREE.Group();
  group.name = 'Avatar';

  // Head
  const headGeo = new THREE.CylinderGeometry(0.4, 0.4, 0.8, 16);
  const headMat = new THREE.MeshStandardMaterial({ color: head });
  
  // Create face texture
  const faceTexture = createFaceTexture(faceType);
  const faceMat = new THREE.MeshStandardMaterial({ 
    map: faceTexture,
    transparent: true,
    color: head // Tint with head color
  });

  const headMesh = new THREE.Mesh(headGeo, [
    headMat, // sides
    headMat, // top
    headMat  // bottom
  ]);
  
  // Add a separate mesh for the face to avoid cylinder mapping issues
  const faceGeo = new THREE.PlaneGeometry(0.5, 0.5);
  const faceMesh = new THREE.Mesh(faceGeo, faceMat);
  faceMesh.position.set(0, 0, 0.41);
  headMesh.add(faceMesh);

  headMesh.position.y = 1.6;
  group.add(headMesh);

  // Torso
  const torsoGeo = new THREE.BoxGeometry(0.8, 0.8, 0.4);
  const torsoMat = new THREE.MeshStandardMaterial({ color: torso });
  const torsoMesh = new THREE.Mesh(torsoGeo, torsoMat);
  torsoMesh.position.y = 0.8;
  group.add(torsoMesh);

  // Legs
  const legGeo = new THREE.BoxGeometry(0.35, 0.8, 0.35);
  const legMat = new THREE.MeshStandardMaterial({ color: legs });
  
  const leftLeg = new THREE.Mesh(legGeo, legMat);
  leftLeg.position.set(-0.2, 0, 0);
  group.add(leftLeg);

  const rightLeg = new THREE.Mesh(legGeo, legMat);
  rightLeg.position.set(0.2, 0, 0);
  group.add(rightLeg);

  return group;
}

function createFaceTexture(type) {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');

  ctx.strokeStyle = '#000';
  ctx.lineWidth = 8;
  ctx.lineCap = 'round';

  switch (type) {
    case 'cool':
      // Sunglasses
      ctx.fillStyle = '#000';
      ctx.fillRect(20, 40, 35, 20);
      ctx.fillRect(73, 40, 35, 20);
      ctx.beginPath();
      ctx.moveTo(55, 50); ctx.lineTo(73, 50);
      ctx.stroke();
      // Smile
      ctx.beginPath();
      ctx.arc(64, 80, 25, 0, Math.PI);
      ctx.stroke();
      break;
    case 'surprised':
      // Big Eyes
      ctx.strokeRect(35, 40, 10, 10);
      ctx.strokeRect(83, 40, 10, 10);
      // O mouth
      ctx.beginPath();
      ctx.arc(64, 90, 15, 0, Math.PI * 2);
      ctx.stroke();
      break;
    case 'wink':
      // One eye, one wink
      ctx.strokeRect(35, 40, 10, 10);
      ctx.beginPath();
      ctx.moveTo(80, 45); ctx.lineTo(100, 45);
      ctx.stroke();
      // Smile
      ctx.beginPath();
      ctx.arc(64, 80, 25, 0, Math.PI);
      ctx.stroke();
      break;
    default: // classic
      // Eyes
      ctx.fillStyle = '#000';
      ctx.beginPath(); ctx.arc(40, 50, 6, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(88, 50, 6, 0, Math.PI * 2); ctx.fill();
      // Smile
      ctx.beginPath();
      ctx.arc(64, 75, 30, 0.2 * Math.PI, 0.8 * Math.PI);
      ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}
