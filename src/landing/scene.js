import * as THREE from 'three';
import { createPiece } from '../builder/pieces.js';

export function initLandingScene() {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 15;

  const renderer = new THREE.WebGLRenderer({ 
    canvas: document.getElementById('app'),
    antialias: true,
    alpha: true 
  });
  renderer.setSize(window.innerWidth, window.innerHeight);

  scene.add(new THREE.AmbientLight(0xffffff, 0.6));
  const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
  dirLight.position.set(10, 20, 10);
  scene.add(dirLight);

  const floatingBricks = [];
  const pieceNames = ['1x1 Brick', '1x2 Brick', '2x4 Brick'];

  for (let i = 0; i < 20; i++) {
    const name = pieceNames[Math.floor(Math.random() * pieceNames.length)];
    const piece = createPiece(name);
    piece.position.set(
      (Math.random() - 0.5) * 30,
      (Math.random() - 0.5) * 30,
      (Math.random() - 0.5) * 30
    );
    piece.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
    scene.add(piece);
    floatingBricks.push({
      mesh: piece,
      rotSpeed: {
        x: (Math.random() - 0.5) * 0.02,
        y: (Math.random() - 0.5) * 0.02,
        z: (Math.random() - 0.5) * 0.02
      },
      floatSpeed: Math.random() * 0.005 + 0.002,
      floatOffset: Math.random() * Math.PI * 2
    });
  }

  let animationId;
  function animate() {
    animationId = requestAnimationFrame(animate);
    
    floatingBricks.forEach(b => {
      b.mesh.rotation.x += b.rotSpeed.x;
      b.mesh.rotation.y += b.rotSpeed.y;
      b.mesh.rotation.z += b.rotSpeed.z;
      b.mesh.position.y += Math.sin(Date.now() * b.floatSpeed + b.floatOffset) * 0.01;
    });

    renderer.render(scene, camera);
  }

  animate();

  return {
    stop: () => cancelAnimationFrame(animationId),
    resize: () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }
  };
}
