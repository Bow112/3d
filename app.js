// Scene setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000033);

// Camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 50, 100);

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

// Controls
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.minDistance = 20;
controls.maxDistance = 500;

// Lighting
const ambientLight = new THREE.AmbientLight(0x333333);
scene.add(ambientLight);

const sunLight = new THREE.PointLight(0xffffff, 1, 300);
sunLight.castShadow = true;
sunLight.shadow.mapSize.width = 2048;
sunLight.shadow.mapSize.height = 2048;
scene.add(sunLight);

// Stars
function createStars() {
    const starsGeometry = new THREE.BufferGeometry();
    const starsMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.2,
        transparent: true
    });

    const starsVertices = [];
    for (let i = 0; i < 10000; i++) {
        const x = (Math.random() - 0.5) * 2000;
        const y = (Math.random() - 0.5) * 2000;
        const z = (Math.random() - 0.5) * 2000;
        starsVertices.push(x, y, z);
    }

    starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));
    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);
}

createStars();

// Planet data
const planetsData = [
    {
        name: "Sun",
        radius: 10,
        distance: 0,
        color: 0xffff00,
        speed: 0,
        texture: null,
        description: "The star at the center of our solar system.",
        diameter: "1.4 million km",
        orbit: "N/A",
        moons: "N/A",
        temp: "5,500°C",
        fact: "Contains 99.86% of the solar system's mass."
    },
    {
        name: "Mercury",
        radius: 3.2,
        distance: 28,
        color: 0xb5b5b5,
        speed: 0.04,
        texture: null,
        description: "The smallest planet in our solar system.",
        diameter: "4,880 km",
        orbit: "88 days",
        moons: "0",
        temp: "167°C",
        fact: "A day on Mercury lasts 59 Earth days."
    },
    {
        name: "Venus",
        radius: 6,
        distance: 44,
        color: 0xe6c229,
        speed: 0.015,
        texture: null,
        description: "Similar in size to Earth but with a toxic atmosphere.",
        diameter: "12,104 km",
        orbit: "225 days",
        moons: "0",
        temp: "464°C",
        fact: "Rotates in the opposite direction to most planets."
    },
    {
        name: "Earth",
        radius: 6.3,
        distance: 62,
        color: 0x3498db,
        speed: 0.01,
        texture: null,
        description: "Our home planet, the only known place with life.",
        diameter: "12,742 km",
        orbit: "365 days",
        moons: "1",
        temp: "15°C",
        fact: "70% of Earth's surface is covered in water."
    },
    {
        name: "Mars",
        radius: 3.4,
        distance: 78,
        color: 0xc1440e,
        speed: 0.008,
        texture: null,
        description: "Known as the Red Planet due to iron oxide on its surface.",
        diameter: "6,779 km",
        orbit: "687 days",
        moons: "2",
        temp: "-65°C",
        fact: "Home to the tallest volcano in the solar system (Olympus Mons)."
    },
    {
        name: "Jupiter",
        radius: 11,
        distance: 100,
        color: 0xe3dccb,
        speed: 0.002,
        texture: null,
        description: "The largest planet in our solar system.",
        diameter: "139,820 km",
        orbit: "12 years",
        moons: "79",
        temp: "-110°C",
        fact: "Has a storm (Great Red Spot) that's raged for centuries."
    },
    {
        name: "Saturn",
        radius: 9.5,
        distance: 130,
        color: 0xf1e5ac,
        speed: 0.0009,
        texture: null,
        description: "Famous for its beautiful ring system.",
        diameter: "116,460 km",
        orbit: "29 years",
        moons: "82",
        temp: "-140°C",
        fact: "Saturn's rings are made mostly of ice particles."
    },
    {
        name: "Uranus",
        radius: 8.5,
        distance: 160,
        color: 0xd1e7e7,
        speed: 0.0004,
        texture: null,
        description: "An ice giant that rotates on its side.",
        diameter: "50,724 km",
        orbit: "84 years",
        moons: "27",
        temp: "-195°C",
        fact: "Rotates on its side with an axial tilt of 98 degrees."
    },
    {
        name: "Neptune",
        radius: 8.3,
        distance: 190,
        color: 0x5b5ddf,
        speed: 0.0001,
        texture: null,
        description: "The windiest planet with violent storms.",
        diameter: "49,244 km",
        orbit: "165 years",
        moons: "14",
        temp: "-200°C",
        fact: "Has the strongest winds in the solar system (2,100 km/h)."
    }
];

const planets = [];
const orbits = [];
let autoRotate = true;

// Create solar system
function createSolarSystem() {
    // Sun
    const sunGeometry = new THREE.SphereGeometry(planetsData[0].radius, 32, 32);
    const sunMaterial = new THREE.MeshBasicMaterial({ 
        color: planetsData[0].color,
        emissive: 0xffff00,
        emissiveIntensity: 1
    });
    const sun = new THREE.Mesh(sunGeometry, sunMaterial);
    sun.name = "Sun";
    sunLight.position.copy(sun.position);
    scene.add(sun);
    planets.push(sun);

    // Create planets
    for (let i = 1; i < planetsData.length; i++) {
        const planetData = planetsData[i];
        
        // Orbit path
        const orbitGeometry = new THREE.TorusGeometry(planetData.distance, 0.1, 2, 100);
        const orbitMaterial = new THREE.MeshBasicMaterial({ 
            color: 0x666666, 
            transparent: true, 
            opacity: 0.3 
        });
        const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial);
        orbit.rotation.x = Math.PI / 2;
        scene.add(orbit);
        orbits.push(orbit);

        // Planet
        const planetGeometry = new THREE.SphereGeometry(planetData.radius, 32, 32);
        const planetMaterial = new THREE.MeshPhongMaterial({ 
            color: planetData.color,
            shininess: 10
        });
        const planet = new THREE.Mesh(planetGeometry, planetMaterial);
        planet.name = planetData.name;
        planet.position.x = planetData.distance;
        planet.castShadow = true;
        planet.receiveShadow = true;
        scene.add(planet);
        planets.push(planet);
    }
}

createSolarSystem();

// Raycaster for planet selection
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

function onMouseClick(event) {
    // Calculate mouse position in normalized device coordinates
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Update the raycaster
    raycaster.setFromCamera(mouse, camera);

    // Calculate objects intersecting the ray
    const intersects = raycaster.intersectObjects(planets);

    if (intersects.length > 0) {
        const planet = intersects[0].object;
        showPlanetInfo(planet.name);
    }
}

function showPlanetInfo(planetName) {
    const planetData = planetsData.find(p => p.name === planetName);
    if (!planetData) return;

    document.getElementById('planet-name').textContent = planetData.name;
    document.getElementById('planet-description').textContent = planetData.description;
    document.getElementById('planet-diameter').textContent = planetData.diameter;
    document.getElementById('planet-distance').textContent = `${planetData.distance} million km from Sun`;
    document.getElementById('planet-orbit').textContent = planetData.orbit;
    document.getElementById('planet-moons').textContent = planetData.moons;
    document.getElementById('planet-temp').textContent = planetData.temp;
    document.getElementById('planet-fact').textContent = planetData.fact;

    document.getElementById('planet-info').style.display = 'block';
}

// Event listeners
window.addEventListener('click', onMouseClick, false);
window.addEventListener('resize', onWindowResize, false);

document.getElementById('close-info').addEventListener('click', function() {
    document.getElementById('planet-info').style.display = 'none';
});

document.getElementById('toggle-orbits').addEventListener('click', function() {
    orbits.forEach(orbit => {
        orbit.visible = !orbit.visible;
    });
    this.textContent = orbits[0].visible ? 'Hide Orbits' : 'Show Orbits';
});

document.getElementById('auto-rotate').addEventListener('click', function() {
    autoRotate = !autoRotate;
    this.textContent = autoRotate ? 'Disable Auto-Rotate' : 'Enable Auto-Rotate';
});

document.getElementById('reset-view').addEventListener('click', function() {
    camera.position.set(0, 50, 100);
    controls.reset();
});

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    // Rotate planets
    planets.forEach((planet, index) => {
        if (index === 0) return; // Skip sun
        
        const planetData = planetsData[index];
        planet.position.x = planetData.distance * Math.cos(Date.now() * 0.0001 * planetData.speed);
        planet.position.z = planetData.distance * Math.sin(Date.now() * 0.0001 * planetData.speed);
    });

    // Auto-rotate camera
    if (autoRotate) {
        controls.autoRotate = true;
        controls.autoRotateSpeed = 0.5;
    } else {
        controls.autoRotate = false;
    }

    controls.update();
    renderer.render(scene, camera);
}

animate();