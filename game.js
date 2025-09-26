// Scene setup
  const scene = new THREE.Scene();

  // Camera setup
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
  camera.position.z = 7;
  camera.position.y = 1;

  // Renderer
  const renderer = new THREE.WebGLRenderer({antialias:true});
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // Light
  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(5, 10, 7);
  scene.add(light);

  // Player cube
  const playerGeometry = new THREE.BoxGeometry(1, 0.5, 1);
  const playerMaterial = new THREE.MeshStandardMaterial({color: 0x0077ff});
  const player = new THREE.Mesh(playerGeometry, playerMaterial);
  player.position.y = -2;
  scene.add(player);

  // Variables
  const spheres = [];
  let score = 0;
  const scoreElement = document.getElementById('score');

  // Controls
  let moveLeft = false;
  let moveRight = false;
  const playerSpeed = 0.1;

  // Event listeners for controls
  window.addEventListener('keydown', (event) => {
    if(event.code === 'ArrowLeft') moveLeft = true;
    if(event.code === 'ArrowRight') moveRight = true;
  });

  window.addEventListener('keyup', (event) => {
    if(event.code === 'ArrowLeft') moveLeft = false;
    if(event.code === 'ArrowRight') moveRight = false;
  });

  // Spawn sphere every 1.5 seconds
  setInterval(() => {
    const sphereGeometry = new THREE.SphereGeometry(0.3, 16, 16);
    const sphereMaterial = new THREE.MeshStandardMaterial({color: 0xff4444});
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.position.x = (Math.random() - 0.5) * 6; // between -3 and 3
    sphere.position.y = 5;
    scene.add(sphere);
    spheres.push(sphere);
  }, 1500);

  // Resize handler
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // Simple bounding box collision detection
  function checkCollision(obj1, obj2) {
    const box1 = new THREE.Box3().setFromObject(obj1);
    const box2 = new THREE.Box3().setFromObject(obj2);
    return box1.intersectsBox(box2);
  }

  // Animation loop
  function animate() {
    requestAnimationFrame(animate);

    // Move player left/right with clamping
    if(moveLeft) player.position.x -= playerSpeed;
    if(moveRight) player.position.x += playerSpeed;
    player.position.x = THREE.MathUtils.clamp(player.position.x, -3, 3);

    // Move spheres down and check collisions
    for(let i = spheres.length - 1; i >= 0; i--) {
      spheres[i].position.y -= 0.03; // fall speed

      // Remove spheres that fall off screen
      if(spheres[i].position.y < -3) {
        scene.remove(spheres[i]);
        spheres.splice(i, 1);
        continue;
      }

      // Check collision with player
      if(checkCollision(player, spheres[i])) {
        scene.remove(spheres[i]);
        spheres.splice(i, 1);
        score++;
        scoreElement.textContent = `Score: ${score}`;
      }
    }

    renderer.render(scene, camera);
  }

  animate();