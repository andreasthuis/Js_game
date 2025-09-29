  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
  camera.position.z = 7;
  camera.position.y = 1;

  const renderer = new THREE.WebGLRenderer({antialias:true});
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  const loader = new THREE.OBJLoader()
  loader.load('/workspaces/Js_game/Car.obj', (object) => {
    scene.add(object)
  })

  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(5, 10, 7);
  scene.add(light);

  const playerGeometry = new THREE.BoxGeometry(1, 0.5, 1);
  const playerMaterial = new THREE.MeshStandardMaterial({color: 0x0077ff});
  const player = new THREE.Mesh(playerGeometry, playerMaterial);
  player.position.y = -2;
  scene.add(player);

  const spheres = [];
  let score = 0;
  const scoreElement = document.getElementById('score');

  let moveLeft = false;
  let moveRight = false;
  const playerSpeed = 0.1;

  window.addEventListener('keydown', (event) => {
    if(event.code === 'ArrowLeft') moveLeft = true;
    if(event.code === 'ArrowRight') moveRight = true;
  });

  window.addEventListener('keyup', (event) => {
    if(event.code === 'ArrowLeft') moveLeft = false;
    if(event.code === 'ArrowRight') moveRight = false;
  });

  setInterval(() => {
    const sphereGeometry = new THREE.SphereGeometry(0.3, 16, 16);
    const sphereMaterial = new THREE.MeshStandardMaterial({color: 0xff4444});
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.position.x = (Math.random() - 0.5) * 6;
    sphere.position.y = 5;
    scene.add(sphere);
    spheres.push(sphere);
  }, 1500);

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  function checkCollision(obj1, obj2) {
    const box1 = new THREE.Box3().setFromObject(obj1);
    const box2 = new THREE.Box3().setFromObject(obj2);
    return box1.intersectsBox(box2);
  }

  function animate() {
    requestAnimationFrame(animate);

    if(moveLeft) player.position.x -= playerSpeed;
    if(moveRight) player.position.x += playerSpeed;
    player.position.x = THREE.MathUtils.clamp(player.position.x, -3, 3);

    for(let i = spheres.length - 1; i >= 0; i--) {
      spheres[i].position.y -= 0.03;

      if(spheres[i].position.y < -3) {
        scene.remove(spheres[i]);
        spheres.splice(i, 1);
        continue;
      }

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