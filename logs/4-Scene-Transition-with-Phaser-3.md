# Scene Transition with Phaser 3

This is continuation of [Tiled Generated Map with Phaser 3](https://github.com/ioneone/shining-soul-j/blob/develop/logs/3-Tiled-Generated-Map-with-Phaser-3.md). In this tutorial, we will see how to implement scene transition transition.


Also don't forget to go to the bottom right corner and click `Edit Tileset`, in which you can set custom property for the tiles. Add `collision: true` for the wall tiles. When we export the map later, this information will also be stored in the file. Finally, remember to add a transition object on the stairs. Also, the transition objects in Tiled are converted to a JSON object as follows:

```typescript
export interface TiledTransitionObject
{
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  name: string;
  properties: Array<{
    name: string,
    type: string,
    value: string | number
  }>;
}
```


Let's start with transition layer.

```typescript
const transitionObjectGroup = this.physics.add.staticGroup();
const tiledTransitionObjects = 
  this.tilemap.getObjectLayer(TileLayer.Transition).objects 
    as TiledTransitionObject[];
tiledTransitionObjects.forEach(tiledTransitionObject => {
  // transitionObjectGroup?.add(
  //   new SceneTransitionObject(this, tiledTransitionObject)
  // );
});
```

You can use `transitionObjectGroup` to check the overlap between player and transition objects using `this.physics.add.overlap(player, transitionObjectGroup)`. `SceneTransitionObject` is just a custom class for parsing `tiledTransitionObject.properties`. Don't worry about this for now. I will publish tutorial about this later.