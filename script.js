const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.001,
    1000
);

camera.position.z = 7;
const renderer = new THREE.WebGLRenderer({canvas: document.getElementById('myCanvas')});
scene.add(new THREE.AmbientLight(0x333333));
const earthMesh = new THREE.MeshPhongMaterial({
    map: new THREE.TextureLoader().load('images/1_earth_8k.jpg'),
    bumpMap: new THREE.TextureLoader().load('images/elev_bump_8k.jpg'),
    bumpScale: 0.1
})

const earhGeometry = new THREE.SphereGeometry(2,32,32);
const earth = new THREE.Mesh(earhGeometry, earthMesh);

scene.add(earth);
const stars = new THREE.Mesh(new THREE.SphereGeometry(4,24,4), new THREE.MeshBasicMaterial({
    map: new THREE.TextureLoader().load('images/starfield.jpg'),
    side: THREE.BackSide
}));
scene.add(stars);
const directionalLight = new THREE.DirectionalLight(0xffffff,1);
directionalLight.position.set(4,3,4)
scene.add(directionalLight)
renderer.setSize(window.innerWidth, window.innerHeight)

function show() {
    requestAnimationFrame(show);
    earth.rotation.y +=0.005;
    renderer.render(scene, camera);
}

show();

let isDragging = false;
let previosMousePosition = {
    x: 0,
    y: 0
}

document.addEventListener('mousedown', (event)=> {
    isDragging = true;
    previosMousePosition = {
        x: event.clientX,
        y: event.clientY
    };
});

document.addEventListener('mousemove', (event)=> {
    if (!isDragging) {
        return;
    }

    const deltaMove = {
        x: event.clientX - previosMousePosition.x,
        y: event.clientY - previosMousePosition.y,

    }

    const deltaRotation = new THREE.Quaternion().setFromEuler(
        new THREE.Euler(
            toRadians(deltaMove.y),
            toRadians(deltaMove.x),
            0,
            'XYZ'
        )
    );
    earth.quaternion.multiplyQuaternions(
        deltaRotation,
        earth.quaternion
    );
    previosMousePosition = {
        x: event.clientX,
        y: event.clientY,

    };
})

function toRadians (degrees) {
    return degrees*(Math.PI / 180);
}

document.addEventListener('mouseup', (event) => {
    isDragging = false;
});

document.addEventListener('wheel', (event) => {
    camera.position.z += event.deltaY * 0.01;
})
