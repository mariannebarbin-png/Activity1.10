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
 * Textures (from PDF Page 34)
 */
const textureLoader = new THREE.TextureLoader()
const doorColorTexture = textureLoader.load('/textures/door/color.jpg')
const doorAlphaTexture = textureLoader.load('/textures/door/alpha.jpg')
const doorAmbientOcclusionTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg')
const doorHeightTexture = textureLoader.load('/textures/door/height.jpg')
const doorNormalTexture = textureLoader.load('/textures/door/normal.jpg')
const doorMetalnessTexture = textureLoader.load('/textures/door/metalness.jpg')
const doorRoughnessTexture = textureLoader.load('/textures/door/roughness.jpg')
const matcapTexture = textureLoader.load('/textures/matcaps/1.png')
const gradientTexture = textureLoader.load('/textures/gradients/3.jpg')

// Fix gradient texture for toon material (from PDF Page 42)
gradientTexture.minFilter = THREE.NearestFilter
gradientTexture.magFilter = THREE.NearestFilter
gradientTexture.generateMipmaps = false

/**
 * Objects - Using only sphere, plane, and torus as shown in PDF (Page 33)
 */
const sphereGeometry = new THREE.SphereGeometry(0.5, 32, 32)
const planeGeometry = new THREE.PlaneGeometry(1, 1, 100, 100)
const torusGeometry = new THREE.TorusGeometry(0.3, 0.2, 32, 64)

// Set up UV2 for ambient occlusion (from PDF Page 45)
sphereGeometry.setAttribute('uv2', new THREE.BufferAttribute(sphereGeometry.attributes.uv.array, 2))
planeGeometry.setAttribute('uv2', new THREE.BufferAttribute(planeGeometry.attributes.uv.array, 2))
torusGeometry.setAttribute('uv2', new THREE.BufferAttribute(torusGeometry.attributes.uv.array, 2))

/**
 * Lights for materials that need them (from PDF Page 40)
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
scene.add(ambientLight)

const pointLight = new THREE.PointLight(0xffffff, 0.5)
pointLight.position.x = 2
pointLight.position.y = 3
pointLight.position.z = 4
scene.add(pointLight)

/**
 * Test different materials on the three geometries (from PDF Pages 34-48)
 */

// MeshBasicMaterial (PDF Page 34-36)
const basicMaterial = new THREE.MeshBasicMaterial()
basicMaterial.map = doorColorTexture
const basicSphere = new THREE.Mesh(sphereGeometry, basicMaterial)
basicSphere.position.x = -1.5
scene.add(basicSphere)

const basicPlane = new THREE.Mesh(planeGeometry, basicMaterial)
scene.add(basicPlane)

const basicTorus = new THREE.Mesh(torusGeometry, basicMaterial)
basicTorus.position.x = 1.5
scene.add(basicTorus)

// MeshNormalMaterial (PDF Page 37-38)
const normalMaterial = new THREE.MeshNormalMaterial()
normalMaterial.flatShading = true
const normalSphere = new THREE.Mesh(sphereGeometry, normalMaterial)
normalSphere.position.x = -1.5
normalSphere.position.y = -1.5
scene.add(normalSphere)

const normalPlane = new THREE.Mesh(planeGeometry, normalMaterial)
normalPlane.position.y = -1.5
scene.add(normalPlane)

const normalTorus = new THREE.Mesh(torusGeometry, normalMaterial)
normalTorus.position.x = 1.5
normalTorus.position.y = -1.5
scene.add(normalTorus)

// MeshMatcapMaterial (PDF Page 38-39)
const matcapMaterial = new THREE.MeshMatcapMaterial()
matcapMaterial.matcap = matcapTexture
const matcapSphere = new THREE.Mesh(sphereGeometry, matcapMaterial)
matcapSphere.position.x = -1.5
matcapSphere.position.y = 1.5
scene.add(matcapSphere)

const matcapPlane = new THREE.Mesh(planeGeometry, matcapMaterial)
matcapPlane.position.y = 1.5
scene.add(matcapPlane)

const matcapTorus = new THREE.Mesh(torusGeometry, matcapMaterial)
matcapTorus.position.x = 1.5
matcapTorus.position.y = 1.5
scene.add(matcapTorus)

// MeshStandardMaterial with PBR textures (PDF Pages 43-48)
const standardMaterial = new THREE.MeshStandardMaterial()
standardMaterial.metalness = 0.7
standardMaterial.roughness = 0.2
standardMaterial.map = doorColorTexture
standardMaterial.aoMap = doorAmbientOcclusionTexture
standardMaterial.aoMapIntensity = 1
standardMaterial.displacementMap = doorHeightTexture
standardMaterial.displacementScale = 0.05
standardMaterial.metalnessMap = doorMetalnessTexture
standardMaterial.roughnessMap = doorRoughnessTexture
standardMaterial.normalMap = doorNormalTexture
standardMaterial.normalScale.set(0.5, 0.5)

const standardSphere = new THREE.Mesh(sphereGeometry, standardMaterial)
standardSphere.position.x = -1.5
standardSphere.position.y = -3
scene.add(standardSphere)

const standardPlane = new THREE.Mesh(planeGeometry, standardMaterial)
standardPlane.position.y = -3
scene.add(standardPlane)

const standardTorus = new THREE.Mesh(torusGeometry, standardMaterial)
standardTorus.position.x = 1.5
standardTorus.position.y = -3
scene.add(standardTorus)

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
camera.position.z = 4
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
 * Animate (from PDF Page 33)
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update objects rotation (from PDF Page 33)
    const objects = [
        basicSphere, basicPlane, basicTorus,
        normalSphere, normalPlane, normalTorus,
        matcapSphere, matcapPlane, matcapTorus,
        standardSphere, standardPlane, standardTorus
    ]
    
    objects.forEach(obj => {
        obj.rotation.y = 0.1 * elapsedTime
        obj.rotation.x = 0.15 * elapsedTime
    })

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()