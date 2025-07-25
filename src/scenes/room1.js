import { makeBoss } from "../entities/enemyBoss";
import { makeDrone } from "../entities/enemyDrone";
import { makeCartridge } from "../entities/healthCartridge";
import { makePlayer } from "../entities/player";
import { state } from "../state/globalStateManager";
import { healthBar } from "../ui/healthBar";
import { setBackgroundColor, setCameraControls, setCameraZones, setExitZones, setMapColliders } from "./roomUtils";

export function room1(k, roomData,previousSceneData = {exitName: null}){
    setBackgroundColor(k,"#a2aed5");

    k.camScale(4);
    k.camPos(170,100);
    k.setGravity(1000);

    const roomLayers = roomData.layers;

    const map = k.add([
        k.pos(0,0),
        k.sprite("room1"),
    ]);

    const colliders = [];
    const positions = [];
    const cameras = [];
    const exits = [];
    
    for(const layer of roomLayers){
        if(layer.name === 'cameras'){
            cameras.push(...layer.objects);
        }

        if(layer.name === 'positions'){
            positions.push(...layer.objects); // [[1,2,3]] [1,2,3]
            continue;
        }

        if(layer.name === "exits"){
            exits.push(...layer.objects);
            continue;
        }
        
        if(layer.name === 'colliders'){
            colliders.push(...layer.objects)
        }
    }
    
    setMapColliders(k, map, colliders);
    setCameraZones(k,map,cameras);

    const player = map.add(makePlayer(k));
    setCameraControls(k, player, map, roomData);
    setExitZones(k,map,exits,"room2");

    for(const position of positions){
        if(position.name === "player" && !previousSceneData.exitName){
            player.setPosition(position.x, position.y);
            player.setControls();
            player.setEvents();
            player.enablePassthrough();
            player.respawnIfOutOfBounds(1000,"room1");
            continue;
        }
        if(position.name === "entrance-1" && previousSceneData.exitName === "exit-1") {
            player.setPosition(position.x, position.y);
            player.setControls();
            player.setEvents();
            player.enablePassthrough();
            player.respawnIfOutOfBounds(1000,"room1");
            k.camPos(player.pos);
            continue;
        }
        if(position.name === "entrance-2" && previousSceneData.exitName === "exit-2") {
            player.setPosition(position.x, position.y);
            player.setControls();
            player.setEvents();
            player.enablePassthrough();
            player.respawnIfOutOfBounds(1000,"room1");
            k.camPos(player.pos);
            continue;
        }

        if(position.type === "drone"){
            const drone = map.add(makeDrone(k, k.vec2(position.x, position.y)));
            drone.setBehavior();
            drone.setEvents();
            continue;
        }
        if(position.name === "boss" && !state.current().isBossDefeated){
            const boss = map.add(makeBoss(k,k.vec2(position.x,position.y)));
            boss.setBehavior();
            boss.setEvents();
            continue;
        }
        if(position.type === "cartridge"){
            map.add(makeCartridge(k,k.vec2(position.x, position.y)));
        }
    }
    healthBar.setEvents();
    healthBar.trigger("update");
    k.add(healthBar);
}