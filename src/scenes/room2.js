import { makeCartridge } from "../entities/healthCartridge";
import { makePlayer } from "../entities/player";
import { healthBar } from "../ui/healthBar";
import { setBackgroundColor, setCameraControls, setCameraZones, setExitZones, setMapColliders } from "./roomUtils";

export function room2(k,roomData, previousSceneData) {
    setBackgroundColor(k,"#a2aed5");
    k.camScale(4);
    k.camPos(170, 100);
    k.setGravity(1000);

    const roomLayers = roomData.layers;
    const map = k.add([
        k.pos(0,0), k.sprite("room2"),
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
    setExitZones(k,map,exits,"room1");

    for(const position of positions){
        if (
            position.name === "entrance-1" &&
            previousSceneData.exitName === "exit-1"
          ) {
            player.setPosition(position.x, position.y);
            player.setControls();
            player.enablePassthrough();
            player.setEvents();
            continue;
          }
      
          if (
            position.name === "entrance-2" &&
            previousSceneData.exitName === "exit-2"
          ) {
            player.setPosition(position.x, position.y);
            player.setControls();
            player.enablePassthrough();
            player.setEvents();
            player.respawnIfOutOfBounds(1000, "room2", { exitName: "exit-2" });
            k.camPos(player.pos);
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