const loader = new THREE.CubeTextureLoader();
loader.setPath( 'textures/cube/pisa/' );

const textureCube = loader.load( [
	'px.png', 'nx.png',
	'py.png', 'ny.png',
	'pz.png', 'nz.png'
] );

const material = new THREE.MeshBasicMaterial( { color: 0xffffff, envMap: textureCube } );