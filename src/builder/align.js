import gsap from 'gsap';

export function setupAlignView(camera, orbitControls) {
  const alignBtn = document.getElementById('align-view');

  alignBtn.addEventListener('click', () => {
    gsap.to(camera.position, {
      x: 0,
      y: 20,
      z: 0.1, // Slight offset to maintain orientation
      duration: 1,
      ease: 'power2.inOut',
      onUpdate: () => camera.lookAt(0, 0, 0)
    });

    gsap.to(orbitControls.target, {
      x: 0,
      y: 0,
      z: 0,
      duration: 1,
      ease: 'power2.inOut'
    });
  });
}
