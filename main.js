import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';

// Setup Scene, Camera, Renderer
const canvas = document.querySelector('#bg');
const scene = new THREE.Scene();
// Optional: add a very faint fog to give depth
scene.fog = new THREE.FogExp2(0x050505, 0.02);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.set(0, 0, 10);

// Post-processing for Bloom
const renderScene = new RenderPass(scene, camera);
const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    1.5, // strength
    0.4, // radius
    0.85 // threshold
);
// Make bloom subtle and neon-like
bloomPass.strength = 1.2;
bloomPass.radius = 0.5;
bloomPass.threshold = 0.1;

const composer = new EffectComposer(renderer);
composer.addPass(renderScene);
composer.addPass(bloomPass);

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
const pointLightBlue = new THREE.PointLight(0x00f3ff, 50, 50);
pointLightBlue.position.set(2, 3, 4);
const pointLightPurple = new THREE.PointLight(0x9d00ff, 50, 50);
pointLightPurple.position.set(-2, -3, 2);

scene.add(ambientLight, pointLightBlue, pointLightPurple);

// Helper function to create glowing materials
const getGlowingMaterial = (color) => new THREE.MeshStandardMaterial({
    color: color,
    emissive: color,
    emissiveIntensity: 0.5,
    roughness: 0.2,
    metalness: 0.8
});

// --- 3D Objects ---

// 1. Abstract "Computer Boy" & Desk (Hero Section)
const deskGroup = new THREE.Group();

// Desk Surface (Glass/Dark Metal)
const deskGeometry = new THREE.BoxGeometry(6, 0.2, 3);
const deskMaterial = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.1, metalness: 0.9 });
const desk = new THREE.Mesh(deskGeometry, deskMaterial);
deskGroup.add(desk);

// Abstract Character (Floating Sphere/Capsule)
const charGeometry = new THREE.CapsuleGeometry(0.5, 1, 4, 16);
const charMaterial = new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.5 });
const character = new THREE.Mesh(charGeometry, charMaterial);
character.position.set(0, 1.5, -0.5);
deskGroup.add(character);

// Hologram Monitors (Glowing Planes)
const monitorGeometry = new THREE.PlaneGeometry(2.5, 1.5);
const monitorMat1 = getGlowingMaterial(0x00f3ff);
const monitorMat2 = getGlowingMaterial(0x9d00ff);

const monitor1 = new THREE.Mesh(monitorGeometry, monitorMat1);
monitor1.position.set(0, 1.5, 0.5);
monitor1.rotation.x = -0.2;
deskGroup.add(monitor1);

const monitor2 = new THREE.Mesh(monitorGeometry, monitorMat2);
monitor2.position.set(-2, 1.3, 0.2);
monitor2.rotation.y = 0.5;
deskGroup.add(monitor2);

const monitor3 = new THREE.Mesh(monitorGeometry, monitorMat1);
monitor3.position.set(2, 1.3, 0.2);
monitor3.rotation.y = -0.5;
deskGroup.add(monitor3);

deskGroup.position.set(4, -1, 0); // Positioned to the right initially
scene.add(deskGroup);

// Floating Tech Components & Geometric Shapes
const floatingObjects = [];
const geometries = [
    new THREE.TorusGeometry(0.3, 0.1, 16, 50),
    new THREE.DodecahedronGeometry(0.4),
    new THREE.OctahedronGeometry(0.3),
    new THREE.BoxGeometry(0.5, 0.5, 0.5)
];

for(let i=0; i<15; i++) {
    const geo = geometries[Math.floor(Math.random() * geometries.length)];
    const mat = getGlowingMaterial(Math.random() > 0.5 ? 0x00f3ff : 0x9d00ff);
    mat.emissiveIntensity = 0.2;
    const mesh = new THREE.Mesh(geo, mat);
    
    mesh.position.set(
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 15 - 5
    );
    mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
    
    // Custom properties for animation
    mesh.userData = {
        rotationSpeed: {
            x: (Math.random() - 0.5) * 0.02,
            y: (Math.random() - 0.5) * 0.02,
            z: (Math.random() - 0.5) * 0.02
        },
        floatSpeed: Math.random() * 0.01 + 0.005,
        floatOffset: Math.random() * Math.PI * 2,
        initialY: mesh.position.y
    };
    
    scene.add(mesh);
    floatingObjects.push(mesh);
}

// 2. Services Cards (3D Grid)
const servicesGroup = new THREE.Group();
const cardGeometry = new THREE.BoxGeometry(2, 3, 0.1);
const cardMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x1a1a1a, 
    roughness: 0.2, 
    metalness: 0.8,
    transparent: true,
    opacity: 0.9
});

const cardEdges = new THREE.EdgesGeometry(cardGeometry);
const lineMaterialBlue = new THREE.LineBasicMaterial({ color: 0x00f3ff, linewidth: 2 });
const lineMaterialPurple = new THREE.LineBasicMaterial({ color: 0x9d00ff, linewidth: 2 });

const cards = [];
const cardPositions = [
    { x: -3, y: 0, z: 0, color: lineMaterialBlue },
    { x: 0, y: 0, z: 0, color: lineMaterialPurple },
    { x: 3, y: 0, z: 0, color: lineMaterialBlue }
];

cardPositions.forEach((pos, index) => {
    const card = new THREE.Mesh(cardGeometry, cardMaterial);
    card.position.set(pos.x, pos.y, pos.z);
    
    const lines = new THREE.LineSegments(cardEdges, pos.color);
    card.add(lines);
    
    card.userData = { 
        index: index,
        baseScale: 1,
        targetScale: 1
    };
    
    servicesGroup.add(card);
    cards.push(card);
});

// Position services group down below the hero section
servicesGroup.position.set(-10, -15, -5); 
scene.add(servicesGroup);


// --- Interaction & Scroll Behavior ---

// Raycaster for hover effects
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

window.addEventListener('mousemove', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
});

// GSAP ScrollTrigger setup
gsap.registerPlugin(ScrollTrigger);

// Camera Path Setup (Lerp transitions via GSAP)
const tl = gsap.timeline({
    scrollTrigger: {
        trigger: "main",
        start: "top top",
        end: "bottom bottom",
        scrub: 1 // Smooth scrubbing
    }
});

// Section 1 -> Section 2 (Services)
tl.to(camera.position, { x: -10, y: -15, z: 12, ease: "power1.inOut" }, 0)
  .to(deskGroup.position, { x: 10, y: 5, z: -10 }, 0) // Move desk away
  .to(servicesGroup.position, { x: 0 }, 0); // Bring services into view

// Section 2 -> Section 3 (About)
tl.to(camera.position, { x: 0, y: -30, z: 8, ease: "power1.inOut" }, 1)
  .to(servicesGroup.position, { y: -5, z: -20 }, 1); // Push services back

// Section 3 -> Section 4 (Contact)
tl.to(camera.position, { x: 0, y: -45, z: 5, ease: "power1.inOut" }, 2);


// Animation Loop
const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);
    const time = clock.getElapsedTime();

    // Hover effect on Cards via Raycasting
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(cards);
    
    // Reset target scale
    cards.forEach(card => card.userData.targetScale = 1);
    
    // Set hovered scale
    if (intersects.length > 0) {
        intersects[0].object.userData.targetScale = 1.1;
        document.body.style.cursor = 'pointer';
    } else {
        document.body.style.cursor = 'default';
    }
    
    // Lerp scale
    cards.forEach(card => {
        card.scale.lerp(new THREE.Vector3(card.userData.targetScale, card.userData.targetScale, card.userData.targetScale), 0.1);
        // Slight floating rotation
        card.rotation.y = Math.sin(time + card.userData.index) * 0.1;
    });

    // Animate Hero Desk Group
    deskGroup.rotation.y = Math.sin(time * 0.5) * 0.1;
    deskGroup.position.y += Math.sin(time * 2) * 0.002;

    // Animate Floating Objects
    floatingObjects.forEach(obj => {
        obj.rotation.x += obj.userData.rotationSpeed.x;
        obj.rotation.y += obj.userData.rotationSpeed.y;
        obj.rotation.z += obj.userData.rotationSpeed.z;
        obj.position.y = obj.userData.initialY + Math.sin(time * 2 + obj.userData.floatOffset) * 0.5;
    });

    // Render using composer for bloom
    composer.render();
}

// Handle Resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    composer.setSize(window.innerWidth, window.innerHeight);
});

// Start Animation Loop
animate();
