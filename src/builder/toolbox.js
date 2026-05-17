import { pieceTypes, createPiece } from './pieces.js';

export function setupToolbox(scene, onPieceSelected) {
  const pieceList = document.getElementById('piece-list');
  let currentPieceType = null;

  pieceTypes.forEach(type => {
    const btn = document.createElement('button');
    btn.textContent = type.name;
    btn.addEventListener('click', () => {
      // Clear active class from all buttons
      pieceList.querySelectorAll('button').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      currentPieceType = type.name;
      if (onPieceSelected) onPieceSelected(type.name);
    });
    pieceList.appendChild(btn);
  });

  return {
    getCurrentType: () => currentPieceType
  };
}
