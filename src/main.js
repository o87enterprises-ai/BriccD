import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { VRButton } from 'three/examples/jsm/webxr/VRButton.js';
import { createPiece, BRICK_H, BRICK_W } from './builder/pieces.js';
import { setupToolbox } from './builder/toolbox.js';
import { setupControls } from './builder/controls.js';
import { setupEraser } from './builder/eraser.js';
import { setupAlignView } from './builder/align.js';

import { initLandingScene } from './landing/scene.js';
import { assembleAvatar } from './auth/avatar.js';
import { signInWithGoogle, signInWithEmail, signUpWithEmail, signOut, getSession } from './auth/supabase.js';
import { saveToLocal, loadFromLocal } from './builder/persistence.js';

// UI Elements
const authOverlay = document.getElementById('auth-overlay');
const loginBtn = document.getElementById('login-btn');
const signupBtn = document.getElementById('signup-btn');
const googleLoginBtn = document.getElementById('google-login-btn');
const logoutBtn = document.getElementById('logout-btn');

const toolbox = document.getElementById('toolbox');
const profileUI = document.getElementById('profile-ui');
const movementControls = document.getElementById('movement-controls');

let isAppStarted = false;
let landingScene = initLandingScene();

// Auth Handlers
loginBtn.addEventListener('click', async () => {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const { error } = await signInWithEmail(email, password);
  if (error) alert(error.message);
  else startApp();
});

signupBtn.addEventListener('click', async () => {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const { error } = await signUpWithEmail(email, password);
  if (error) alert(error.message);
  else alert('Check your email for confirmation!');
});

googleLoginBtn.addEventListener('click', async () => {
  await signInWithGoogle();
});

logoutBtn.addEventListener('click', async () => {
  await signOut();
  window.location.reload();
});

// Check Session on Load
getSession().then(session => {
  if (session) {
    startApp();
  }
});

function startApp() {
  if (isAppStarted) return;
  landingScene.stop();
  authOverlay.classList.add('hidden');
  toolbox.classList.remove('hidden');
  isAppStarted = true;
  init();
}

// Profile Logic
document.getElementById('open-profile').addEventListener('click', () => profileUI.classList.remove('hidden'));
document.getElementById('close-profile').addEventListener('click', () => profileUI.classList.add('hidden'));

window.addEventListener('resize', () => {
  if (!isAppStarted) {
    landingScene.resize();
  }
});

function init() {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x87ceeb);

  let currentAvatar = assembleAvatar(scene);
  currentAvatar.position.set(-5, 0, -5);
  scene.add(currentAvatar);

  // Update Avatar Logic
  document.getElementById('save-avatar').addEventListener('click', () => {
    scene.remove(currentAvatar);
    currentAvatar = assembleAvatar(scene, {
      head: document.getElementById('head-color').value,
      torso: document.getElementById('torso-color').value,
      legs: document.getElementById('legs-color').value,
      faceType: document.getElementById('face-type').value
    });
    currentAvatar.position.set(-5, 0, -5);
    scene.add(currentAvatar);
    profileUI.classList.add('hidden');
  });

  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(10, 10, 10);

  const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('app'), antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  
  // WebXR Support
  renderer.xr.enabled = true;
  document.getElementById('vr-controls').appendChild(VRButton.createButton(renderer));

  const orbitControls = new OrbitControls(camera, renderer.domElement);
  orbitControls.enableDamping = true;

  // Ground
  const gridHelper = new THREE.GridHelper(20, 20, 0x000000, 0x444444);
  scene.add(gridHelper);
  
  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20),
    new THREE.MeshStandardMaterial({ color: 0x228b22 })
  );
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -0.01;
  scene.add(ground);

  // Lights
  scene.add(new THREE.AmbientLight(0xffffff, 0.6));
  const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
  dirLight.position.set(10, 20, 10);
  scene.add(dirLight);

  // Core Systems
  const builderControls = setupControls(camera, renderer, scene, orbitControls);
  const eraser = setupEraser(camera, scene, builderControls.getDraggables, builderControls.removeDraggable);
  setupAlignView(camera, orbitControls);

  let selectedPiece = null;

  const toolboxState = setupToolbox(scene, (pieceType) => {
    const piece = createPiece(pieceType);
    piece.position.set(0, piece.userData.height / 2, 0);
    scene.add(piece);
    builderControls.addDraggable(piece);
    selectedPiece = piece;
    movementControls.classList.remove('hidden');
  });

  // Persistence Logic
  document.getElementById('save-local').addEventListener('click', () => {
    saveToLocal(scene, builderControls.getDraggables());
  });

  document.getElementById('load-local').addEventListener('click', () => {
    loadFromLocal(scene, builderControls.addDraggable);
  });

  // Rotation/Lift/Drop Logic
  document.getElementById('rotate-piece').addEventListener('click', () => {
    if (selectedPiece) {
      selectedPiece.rotation.y += Math.PI / 2;
    }
  });

  document.getElementById('lift-piece').addEventListener('click', () => {
    if (selectedPiece) {
      selectedPiece.position.y += BRICK_H;
    }
  });

  document.getElementById('drop-piece').addEventListener('click', () => {
    if (selectedPiece) {
      const h = selectedPiece.userData.height || BRICK_H;
      selectedPiece.position.y = h / 2;
    }
  });

  // Directional Movement Logic
  const movePiece = (dx, dy, dz) => {
    if (selectedPiece) {
      selectedPiece.position.x += dx * BRICK_W;
      selectedPiece.position.y += dy * BRICK_H;
      selectedPiece.position.z += dz * BRICK_W;
      // Snap to grid
      selectedPiece.position.x = Math.round(selectedPiece.position.x / BRICK_W) * BRICK_W;
      selectedPiece.position.z = Math.round(selectedPiece.position.z / BRICK_W) * BRICK_W;
      const h = selectedPiece.userData.height || BRICK_H;
      selectedPiece.position.y = Math.max(h/2, Math.round((selectedPiece.position.y - h/2) / BRICK_H) * BRICK_H + h/2);
    }
  };

  document.getElementById('move-fwd').addEventListener('click', () => movePiece(0, 0, -1));
  document.getElementById('move-back').addEventListener('click', () => movePiece(0, 0, 1));
  document.getElementById('move-left').addEventListener('click', () => movePiece(-1, 0, 0));
  document.getElementById('move-right').addEventListener('click', () => movePiece(1, 0, 0));
  document.getElementById('move-up').addEventListener('click', () => movePiece(0, 1, 0));
  document.getElementById('move-down').addEventListener('click', () => movePiece(0, -1, 0));

  // Selection Logic for Lift/Drop & Duplication
  window.addEventListener('mousedown', (event) => {
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(builderControls.getDraggables(), true);
    if (intersects.length > 0) {
      let obj = intersects[0].object;
      while (obj.parent && obj.parent !== scene) obj = obj.parent;
      
      // Duplicate if Ctrl or Cmd is held
      if (event.ctrlKey || event.metaKey) {
        const clone = obj.clone();
        clone.position.y += BRICK_H; 
        scene.add(clone);
        builderControls.addDraggable(clone);
        selectedPiece = clone;
        movementControls.classList.remove('hidden');
      } else {
        selectedPiece = obj;
        movementControls.classList.remove('hidden');
      }
    }
  });

  // Animation Loop
  renderer.setAnimationLoop(() => {
    orbitControls.update();
    renderer.render(scene, camera);
  });

  // Handle Resize
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}
