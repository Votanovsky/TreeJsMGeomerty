// Ensure ThreeJS is in global scope for the 'examples/'
global.THREE = require("three");

// Include any additional ThreeJS examples below
require("three/examples/js/controls/OrbitControls");

// require("three/examples/js/geometries/ParametricGeometry");

const canvasSketch = require("canvas-sketch");

const settings = {
  // Make the loop animated
  animate: true,
  // Get a WebGL canvas rather than 2D
  context: "webgl"
};

const sketch = ({ context }) => {
  // Create a renderer
  const renderer = new THREE.WebGLRenderer({
    canvas: context.canvas
  });

  // WebGL background color
  renderer.setClearColor("#000", 1);

  // Setup a camera
  const camera = new THREE.PerspectiveCamera(50, 1, 0.01, 100);
  camera.position.set(0, 0, 4);
  camera.lookAt(new THREE.Vector3());

  // Setup camera controller
  const controls = new THREE.OrbitControls(camera, context.canvas);

  // Setup your scene
  const scene = new THREE.Scene();

  // Setup a geometry
  let geometry = new THREE.IcosahedronBufferGeometry(1, 5);

  function Helicoid(u, v, target) {
    let alpha = Math.PI*2*u;
    let theta = Math.PI*2*v;
    let x = Math.sin(alpha)*Math.cos(theta);
    let y = Math.sin(alpha)*Math.sin(theta);
    let z = Math.cos(alpha);
    target.set(x,y,z);
  };

  geometry = new THREE.PolyhedronGeometry(Helicoid, 25, 25);

  // Setup a material
  // const material = new THREE.MeshBasicMaterial({
  //   color: "white",
  //   wireframe: true
  // });

  let material = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    roughness: 0,
    metalness: 0.5,
    clearcoat: 1,
    clearcoatRoughness: 0.4,
    side: THREE.DoubleSide,
    // wireframe: true
  });

  // Setup a mesh with geometry + material
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  scene.add(new THREE.AmbientLight(0xcccccc, 0.5));

  let light = new THREE.DirectionalLight(0xffffff, 1);

  light.position.x = 1;
  light.position.y = 0;
  light.position.z = 1;

  scene.add(light)

  // draw each frame
  return {
    // Handle resize events here
    resize({ pixelRatio, viewportWidth, viewportHeight }) {
      renderer.setPixelRatio(pixelRatio);
      renderer.setSize(viewportWidth, viewportHeight, false);
      camera.aspect = viewportWidth / viewportHeight;
      camera.updateProjectionMatrix();
    },
    // Update & render your scene here
    render({ time }) {
      controls.update();
      renderer.render(scene, camera);
    },
    // Dispose of events & renderer for cleaner hot-reloading
    unload() {
      controls.dispose();
      renderer.dispose();
    }
  };
};

canvasSketch(sketch, settings);
