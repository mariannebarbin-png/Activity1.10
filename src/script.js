import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const doorColorTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg')
const doorAlphaTexture = textureLoader.load('/textures/door/alpha.jpg')
const doorAmbientOcclusionTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg')
const doorHeightTexture = textureLoader.load('/textures/door/height.jpg')
const doorNormalTexture = textureLoader.load('/textures/door/normal.jpg')
const doorMetalnessTexture = textureLoader.load('/textures/door/metalness.jpg')
const doorRoughnessTexture = textureLoader.load('/textures/door/roughness.jpg')
const matcapTexture = textureLoader.load('/textures/matcaps/1.png')
const gradientTexture = textureLoader.load('/textures/gradients/3.jpg')

// Fix gradient texture for toon material
gradientTexture.minFilter = THREE.NearestFilter
gradientTexture.magFilter = THREE.NearestFilter
gradientTexture.generateMipmaps = false

/**
 * Objects - Different geometries for each material (like PDF page 33)
 */

// MeshBasicMaterial - SPHERE
const sphereGeometry = new THREE.SphereGeometry(0.5, 32, 32)
const basicMaterial = new THREE.MeshBasicMaterial()
basicMaterial.map = doorColorTexture
const sphere = new THREE.Mesh(sphereGeometry, basicMaterial)
sphere.position.x = -1.5
scene.add(sphere)

// MeshNormalMaterial - PLANE
const planeGeometry = new THREE.PlaneGeometry(1, 1, 100, 100)
const normalMaterial = new THREE.MeshNormalMaterial()
normalMaterial.flatShading = true
const plane = new THREE.Mesh(planeGeometry, normalMaterial)
scene.add(plane)

// MeshMatcapMaterial - TORUS
const torusGeometry = new THREE.TorusGeometry(0.3, 0.2, 16, 32)
const matcapMaterial = new THREE.MeshMatcapMaterial()
matcapMaterial.matcap = matcapTexture
const torus = new THREE.Mesh(torusGeometry, matcapMaterial)
torus.position.x = 1.5
scene.add(torus)

// MeshDepthMaterial - BOX
const boxGeometry = new THREE.BoxGeometry(0.7, 0.7, 0.7)
const depthMaterial = new THREE.MeshDepthMaterial()
const box = new THREE.Mesh(boxGeometry, depthMaterial)
box.position.y = -1.5
scene.add(box)

/**
 * Lights for materials that need them
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
scene.add(ambientLight)

const pointLight = new THREE.PointLight(0xffffff, 0.5)
pointLight.position.x = 2
pointLight.position.y = 3
pointLight.position.z = 4
scene.add(pointLight)

// MeshLambertMaterial - CONE
const coneGeometry = new THREE.ConeGeometry(0.5, 1, 32)
const lambertMaterial = new THREE.MeshLambertMaterial()
const cone = new THREE.Mesh(coneGeometry, lambertMaterial)
cone.position.x = -1.5
cone.position.y = 1.5
scene.add(cone)

// MeshPhongMaterial - CYLINDER
const cylinderGeometry = new THREE.CylinderGeometry(0.3, 0.3, 1, 32)
const phongMaterial = new THREE.MeshPhongMaterial()
phongMaterial.shininess = 100
phongMaterial.specular = new THREE.Color(0x1188ff)
const cylinder = new THREE.Mesh(cylinderGeometry, phongMaterial)
cylinder.position.y = 1.5
scene.add(cylinder)

// MeshToonMaterial - OCTAHEDRON
const octahedronGeometry = new THREE.OctahedronGeometry(0.5, 0)
const toonMaterial = new THREE.MeshToonMaterial()
toonMaterial.gradientMap = gradientTexture
const octahedron = new THREE.Mesh(octahedronGeometry, toonMaterial)
octahedron.position.x = 1.5
octahedron.position.y = 1.5
scene.add(octahedron)

// MeshStandardMaterial (PBR) - SPHERE (with more segments for displacement)
const detailedSphereGeometry = new THREE.SphereGeometry(0.5, 64, 64)
const standardMaterial = new THREE.MeshStandardMaterial()
standardMaterial.metalness = 0.7
standardMaterial.roughness = 0.2

// Set up UV2 for ambient occlusion
detailedSphereGeometry.setAttribute('uv2', new THREE.BufferAttribute(detailedSphereGeometry.attributes.uv.array, 2))

standardMaterial.map = doorColorTexture
standardMaterial.aoMap = doorAmbientOcclusionTexture
standardMaterial.aoMapIntensity = 1
standardMaterial.displacementMap = doorHeightTexture
standardMaterial.displacementScale = 0.05
standardMaterial.metalnessMap = doorMetalnessTexture
standardMaterial.roughnessMap = doorRoughnessTexture
standardMaterial.normalMap = doorNormalTexture
standardMaterial.normalScale.set(0.5, 0.5)

const detailedSphere = new THREE.Mesh(detailedSphereGeometry, standardMaterial)
detailedSphere.position.x = -1.5
detailedSphere.position.y = -1.5
scene.add(detailedSphere)

// MeshPhysicalMaterial - DODECAHEDRON
const dodecahedronGeometry = new THREE.DodecahedronGeometry(0.4, 0)
const physicalMaterial = new THREE.MeshPhysicalMaterial()
physicalMaterial.roughness = 0.2
physicalMaterial.metalness = 0.5
physicalMaterial.clearcoat = 1.0
physicalMaterial.clearcoatRoughness = 0.1
const dodecahedron = new THREE.Mesh(dodecahedronGeometry, physicalMaterial)
dodecahedron.position.y = -1.5
scene.add(dodecahedron)

// Environment Map - TORUS KNOT
const torusKnotGeometry = new THREE.TorusKnotGeometry(0.3, 0.1, 100, 16)
const cubeTextureLoader = new THREE.CubeTextureLoader()
const environmentMapTexture = cubeTextureLoader.load([
    '/textures/environmentMaps/0/px.jpg',
    '/textures/environmentMaps/0/nx.jpg',
    '/textures/environmentMaps/0/py.jpg',
    '/textures/environmentMaps/0/ny.jpg',
    '/textures/environmentMaps/0/pz.jpg',
    '/textures/environmentMaps/0/nz.jpg'
])

const torusKnot = new THREE.Mesh(torusKnotGeometry, new THREE.MeshStandardMaterial({
    metalness: 0.7,
    roughness: 0.2,
    envMap: environmentMapTexture
}))
torusKnot.position.x = 1.5
torusKnot.position.y = -1.5
scene.add(torusKnot)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Rotate all objects
    const objects = [
        sphere, plane, torus, box,
        cone, cylinder, octahedron, detailedSphere,
        dodecahedron, torusKnot
    ]
    
    objects.forEach(object => {
        object.rotation.y = 0.1 * elapsedTime
        object.rotation.x = 0.15 * elapsedTime
    })

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()