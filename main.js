import './style.css';
import * as THREE from 'three';

// Auth Logic
const authOverlay = document.getElementById('auth-overlay');
const loginBtn = document.getElementById('login-btn');

let isAppStarted = false;

loginBtn.addEventListener('click', () => {
  authOverlay.classList.add('hidden');
  isAppStarted = true;
  animate();
});

// Three.js Logic
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb); // sky blue

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(5, 5, 10);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('app') });
renderer.setSize(window.innerWidth, window.innerHeight);

// Simple ground and a test brick (a box)
const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(20, 20),
  new THREE.MeshStandardMaterial({ color: 0x228b22 })
);
ground.rotation.x = -Math.PI / 2;
scene.add(ground);

const brick = new THREE.Mesh(
  new THREE.BoxGeometry(2, 0.4, 1),
  new THREE.MeshStandardMaterial({ color: 0xff0000 })
);
brick.position.y = 0.2;
scene.add(brick);

// Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);
const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
dirLight.position.set(10, 20, 5);
scene.add(dirLight);

// Simple orbit controls
function animate() {
  if (!isAppStarted) return;
  
  requestAnimationFrame(animate);
  // For now, just spin the camera around the center
  const radius = 10;
  const speed = Date.now() * 0.0005;
  camera.position.x = Math.cos(speed) * radius;
  camera.position.z = Math.sin(speed) * radius;
  camera.lookAt(0, 0, 0);
  renderer.render(scene, camera);
}

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// We wait for login to call animate()
