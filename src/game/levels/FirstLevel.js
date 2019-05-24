import Enemy from '../Enemy';
import UI from '../../base/UI';
import Weapon from '../Weapon';
import Level from '../../base/Level';

export default class FirstLevel extends Level {

    setProperties() {

        // Menu
        this.menu = null;
        this.weapon = null;
        this.enemies = [];

    }

    setupAssets() {

        this.assets.addMergedMesh('shotgun', '/assets/models/weapons/shotgun.obj');
        this.assets.addMergedMesh('enemy', '/assets/models/skull/skull.babylon');

        // this.assets.addMusic('music', '/assets/musics/music.mp3');
        this.assets.addSound('shotgun', '/assets/sounds/shotgun.wav', { volume: 0.4 });
        // this.assets.addSound('robotOff', '/assets/sounds/robot_off.wav', { volume: 0.1 });
        
    }

    buildScene() {
        
        // this.scene.debugLayer.show();
        this.scene.clearColor = new BABYLON.Color3.FromHexString('#777');
        
        // Adding lights
        new BABYLON.DirectionalLight("DirectionalLight", new BABYLON.Vector3(0, -1, 0), this.scene);
        let hemiLight = new BABYLON.HemisphericLight("HemiLight", new BABYLON.Vector3(0, 1, 0), this.scene);
        // hemiLight.

        this.scene.gravity = new BABYLON.Vector3(0, -9.81, 0);
        this.scene.collisionsEnabled = true;

        this.createMenus();

        // Sets the active camera
        this.camera = this.createCamera();
        //this.scene.activeCamera = this.camera;
        this.enablePointerLock();
        
        this.createGround();
        this.addWeapon();
        this.addEnemies();

        this.setupEventListeners();
    }

    createGround() {
        let ground = BABYLON.Mesh.CreateGround("ground",  200,  200, 2, this.scene);
        ground.checkCollisions = true;
        
        let groundMaterial = new BABYLON.StandardMaterial("groundMaterial", this.scene);
        groundMaterial.diffuseTexture = new BABYLON.Texture("/assets/images/sand.jpg", this.scene);
        groundMaterial.specularColor = new BABYLON.Color3(0, 0, 0);

        ground.material = groundMaterial;
    }

    addWeapon() {
        this.weapon = new Weapon(this);
        this.weapon.create();
    }

    addEnemies() {
        for(var enemiesQuantity = 0; enemiesQuantity < 10; enemiesQuantity++) {
            let enemy = new Enemy(this).create();

            this.enemies.push(enemy);
        }
    }

    setupEventListeners() {
        GAME.canvas.addEventListener('click', () => {
            this.weapon.fire();
        }, false);
    }

    createMenus() {
        
    }

    createCamera() {
        var camera = new BABYLON.UniversalCamera("UniversalCamera", new BABYLON.Vector3(0, 3.5, -10), this.scene);
        camera.setTarget(new BABYLON.Vector3(0,2,0));
        
        camera.attachControl(GAME.canvas, true);
        
        camera.applyGravity = true;
        camera.ellipsoid = new BABYLON.Vector3(1, 1.7, 1);
        camera.checkCollisions = true;
        camera._needMoveForGravity = true;

        // Reducing the minimum visible FOV to show the Weapon correctly 
        camera.minZ = 0;

        // Remap keys to move with WASD
        camera.keysUp = [87]; // W
        camera.keysDown = [83]; // S
        camera.keysLeft = [65]; // A
        camera.keysRight = [68]; // D
        
        // camera.speed = 10;
        // camera.inertia = 5;
        // camera.angularSensibility = 1000;
        
        return camera;
    }

    beforeRender() {
        if(!GAME.isPaused()) {
            this.weapon.controlFireRate();

            this.enemies.forEach(enemy => enemy.move());
        }
    }
    
}