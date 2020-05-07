import Phaser from 'phaser'

class AnimationFactory
{

  public static PANTS = "pants";
  public static PANTS_UP = "pants_up";
  public static PANTS_LEFT = "pants_left";
  public static PANTS_DOWN = "pants_down";
  public static PANTS_RIGHT = "pants_right";
  public static PANTS_WALK_UP = "pants_walk_up";
  public static PANTS_WALK_LEFT = "pants_walk_left";
  public static PANTS_WALK_DOWN = "pants_walk_down";
  public static PANTS_WALK_RIGHT = "pants_walk_right";

  public static BODY = "body";
  public static BODY_UP = "body_up";
  public static BODY_LEFT = "body_left";
  public static BODY_DOWN = "body_down";
  public static BODY_RIGHT = "body_right";
  public static BODY_WALK_UP = "body_walk_up";
  public static BODY_WALK_LEFT = "body_walk_left";
  public static BODY_WALK_DOWN = "body_walk_down";
  public static BODY_WALK_RIGHT = "body_walk_right";
  
  public static HAIR = "hair";
  public static HAIR_UP = "hair_up";
  public static HAIR_LEFT = "hair_left";
  public static HAIR_DOWN = "hair_down";
  public static HAIR_RIGHT = "hair_right";
  public static HAIR_WALK_UP = "hair_walk_up";
  public static HAIR_WALK_LEFT = "hair_walk_left";
  public static HAIR_WALK_DOWN = "hair_walk_down";
  public static HAIR_WALK_RIGHT = "hair_walk_right";

  public static LONG_SLEEVE = "long_sleeve";
  public static LONG_SLEEVE_UP = "long_sleeve_up";
  public static LONG_SLEEVE_LEFT = "long_sleeve_left";
  public static LONG_SLEEVE_DOWN = "long_sleeve_down";
  public static LONG_SLEEVE_RIGHT = "long_sleeve_right";
  public static LONG_SLEEVE_WALK_UP = "long_sleeve_walk_up";
  public static LONG_SLEEVE_WALK_LEFT = "long_sleeve_walk_left";
  public static LONG_SLEEVE_WALK_DOWN = "long_sleeve_walk_down";
  public static LONG_SLEEVE_WALK_RIGHT = "long_sleeve_walk_right";

  public static SHOES = "shoes";
  public static SHOES_UP = "shoes_up";
  public static SHOES_LEFT = "shoes_left";
  public static SHOES_DOWN = "shoes_down";
  public static SHOES_RIGHT = "shoes_right";
  public static SHOES_WALK_UP = "shoes_walk_up";
  public static SHOES_WALK_LEFT = "shoes_walk_left";
  public static SHOES_WALK_DOWN = "shoes_walk_down";
  public static SHOES_WALK_RIGHT = "shoes_walk_right";

  public static FRAME_WIDTH = 64;
  public static FRAME_HEIGHT = 64;

  public static preload(scene: Phaser.Scene)
  {
    const option = { frameWidth: AnimationFactory.FRAME_WIDTH, frameHeight: AnimationFactory.FRAME_HEIGHT };
    scene.load.spritesheet(AnimationFactory.BODY, "assets/player/body.png", option);
    scene.load.spritesheet(AnimationFactory.HAIR, "assets/player/hair.png", option);
    scene.load.spritesheet(AnimationFactory.PANTS, "assets/player/pants.png", option);
    scene.load.spritesheet(AnimationFactory.LONG_SLEEVE, "assets/player/long_sleeve.png", option);
    scene.load.spritesheet(AnimationFactory.SHOES, "assets/player/shoes.png", option);
  }
  
  public static create(scene: Phaser.Scene)
  {

    const numCol = 13;
    const rowUp = 8;
    const rowLeft = 9;
    const rowDown = 10;
    const rowRight = 11;

    /**
     * pants animation
     */

    // static
    scene.anims.create({
      key: AnimationFactory.PANTS_UP,
      frames: [{ key: AnimationFactory.PANTS, frame: numCol * rowUp }]
    });
    scene.anims.create({
      key: AnimationFactory.PANTS_LEFT,
      frames: [{ key: AnimationFactory.PANTS, frame: numCol * rowLeft }]
    });
    scene.anims.create({
      key: AnimationFactory.PANTS_DOWN,
      frames: [{ key: AnimationFactory.PANTS, frame: numCol * rowDown }]
    });
    scene.anims.create({
      key: AnimationFactory.PANTS_RIGHT,
      frames: [{ key: AnimationFactory.PANTS, frame: numCol * rowRight }]
    });

    // dynamic
    scene.anims.create({
      key: AnimationFactory.PANTS_WALK_UP,
      frames: scene.anims.generateFrameNumbers(AnimationFactory.PANTS, { start: numCol * rowUp + 1, end: numCol * rowUp + 8 }),
      frameRate: 12,
      repeat: -1
    });
    scene.anims.create({
      key: AnimationFactory.PANTS_WALK_LEFT,
      frames: scene.anims.generateFrameNumbers(AnimationFactory.PANTS, { start: numCol * rowLeft + 1, end: numCol * rowLeft + 8 }),
      frameRate: 12,
      repeat: -1
    });
    scene.anims.create({
      key: AnimationFactory.PANTS_WALK_DOWN,
      frames: scene.anims.generateFrameNumbers(AnimationFactory.PANTS, { start: numCol * rowDown + 1, end: numCol * rowDown + 8 }),
      frameRate: 12,
      repeat: -1
    });
    scene.anims.create({
      key: AnimationFactory.PANTS_WALK_RIGHT,
      frames: scene.anims.generateFrameNumbers(AnimationFactory.PANTS, { start: numCol * rowRight + 1, end: numCol * rowRight + 8 }),
      frameRate: 12,
      repeat: -1
    });

    /**
     * hair animation
     */
    
    // static
    scene.anims.create({
      key: AnimationFactory.HAIR_UP,
      frames: [{ key: AnimationFactory.HAIR, frame: numCol * rowUp }]
    });
    scene.anims.create({
      key: AnimationFactory.HAIR_LEFT,
      frames: [{ key: AnimationFactory.HAIR, frame: numCol * rowLeft }]
    });
    scene.anims.create({
      key: AnimationFactory.HAIR_DOWN,
      frames: [{ key: AnimationFactory.HAIR, frame: numCol * rowDown }]
    });
    scene.anims.create({
      key: AnimationFactory.HAIR_RIGHT,
      frames: [{ key: AnimationFactory.HAIR, frame: numCol * rowRight }]
    });

    // dynamic
    scene.anims.create({
      key: AnimationFactory.HAIR_WALK_UP,
      frames: scene.anims.generateFrameNumbers(AnimationFactory.HAIR, { start: numCol * rowUp + 1, end: numCol * rowUp + 8 }),
      frameRate: 12,
      repeat: -1
    });
    scene.anims.create({
      key: AnimationFactory.HAIR_WALK_LEFT,
      frames: scene.anims.generateFrameNumbers(AnimationFactory.HAIR, { start: numCol * rowLeft + 1, end: numCol * rowLeft + 8 }),
      frameRate: 12,
      repeat: -1
    });
    scene.anims.create({
      key: AnimationFactory.HAIR_WALK_DOWN,
      frames: scene.anims.generateFrameNumbers(AnimationFactory.HAIR, { start: numCol * rowDown + 1, end: numCol * rowDown + 8 }),
      frameRate: 12,
      repeat: -1
    });
    scene.anims.create({
      key: AnimationFactory.HAIR_WALK_RIGHT,
      frames: scene.anims.generateFrameNumbers(AnimationFactory.HAIR, { start: numCol * rowRight + 1, end: numCol * rowRight + 8 }),
      frameRate: 12,
      repeat: -1
    });

    /**
     * body animation
     */

    // static
    scene.anims.create({
      key: AnimationFactory.BODY_UP,
      frames: [{ key: AnimationFactory.BODY, frame: numCol * rowUp }]
    });
    scene.anims.create({
      key: AnimationFactory.BODY_LEFT,
      frames: [{ key: AnimationFactory.BODY, frame: numCol * rowLeft }]
    });
    scene.anims.create({
      key: AnimationFactory.BODY_DOWN,
      frames: [{ key: AnimationFactory.BODY, frame: numCol * rowDown }]
    });
    scene.anims.create({
      key: AnimationFactory.BODY_RIGHT,
      frames: [{ key: AnimationFactory.BODY, frame: numCol * rowRight }]
    });

    // dynamic
    scene.anims.create({
      key: AnimationFactory.BODY_WALK_UP,
      frames: scene.anims.generateFrameNumbers(AnimationFactory.BODY, { start: numCol * rowUp + 1, end: numCol * rowUp + 8 }),
      frameRate: 12,
      repeat: -1
    });
    scene.anims.create({
      key: AnimationFactory.BODY_WALK_LEFT,
      frames: scene.anims.generateFrameNumbers(AnimationFactory.BODY, { start: numCol * rowLeft + 1, end: numCol * rowLeft + 8 }),
      frameRate: 12,
      repeat: -1
    });
    scene.anims.create({
      key: AnimationFactory.BODY_WALK_DOWN,
      frames: scene.anims.generateFrameNumbers(AnimationFactory.BODY, { start: numCol * rowDown + 1, end: numCol * rowDown + 8 }),
      frameRate: 12,
      repeat: -1
    });
    scene.anims.create({
      key: AnimationFactory.BODY_WALK_RIGHT,
      frames: scene.anims.generateFrameNumbers(AnimationFactory.BODY, { start: numCol * rowRight + 1, end: numCol * rowRight + 8 }),
      frameRate: 12,
      repeat: -1
    });

    /**
     * long sleeve animation
     */

    // static
    scene.anims.create({
      key: AnimationFactory.LONG_SLEEVE_UP,
      frames: [{ key: AnimationFactory.LONG_SLEEVE, frame: numCol * rowUp }]
    });
    scene.anims.create({
      key: AnimationFactory.LONG_SLEEVE_LEFT,
      frames: [{ key: AnimationFactory.LONG_SLEEVE, frame: numCol * rowLeft }]
    });
    scene.anims.create({
      key: AnimationFactory.LONG_SLEEVE_DOWN,
      frames: [{ key: AnimationFactory.LONG_SLEEVE, frame: numCol * rowDown }]
    });
    scene.anims.create({
      key: AnimationFactory.LONG_SLEEVE_RIGHT,
      frames: [{ key: AnimationFactory.LONG_SLEEVE, frame: numCol * rowRight }]
    });

    // dynamic
    scene.anims.create({
      key: AnimationFactory.LONG_SLEEVE_WALK_UP,
      frames: scene.anims.generateFrameNumbers(AnimationFactory.LONG_SLEEVE, { start: numCol * rowUp + 1, end: numCol * rowUp + 8 }),
      frameRate: 12,
      repeat: -1
    });
    scene.anims.create({
      key: AnimationFactory.LONG_SLEEVE_WALK_LEFT,
      frames: scene.anims.generateFrameNumbers(AnimationFactory.LONG_SLEEVE, { start: numCol * rowLeft + 1, end: numCol * rowLeft + 8 }),
      frameRate: 12,
      repeat: -1
    });
    scene.anims.create({
      key: AnimationFactory.LONG_SLEEVE_WALK_DOWN,
      frames: scene.anims.generateFrameNumbers(AnimationFactory.LONG_SLEEVE, { start: numCol * rowDown + 1, end: numCol * rowDown + 8 }),
      frameRate: 12,
      repeat: -1
    });
    scene.anims.create({
      key: AnimationFactory.LONG_SLEEVE_WALK_RIGHT,
      frames: scene.anims.generateFrameNumbers(AnimationFactory.LONG_SLEEVE, { start: numCol * rowRight + 1, end: numCol * rowRight + 8 }),
      frameRate: 12,
      repeat: -1
    });

    /**
     * shoes animation
     */

    // static
    scene.anims.create({
      key: AnimationFactory.SHOES_UP,
      frames: [{ key: AnimationFactory.SHOES, frame: numCol * rowUp }]
    });
    scene.anims.create({
      key: AnimationFactory.SHOES_LEFT,
      frames: [{ key: AnimationFactory.SHOES, frame: numCol * rowLeft }]
    });
    scene.anims.create({
      key: AnimationFactory.SHOES_DOWN,
      frames: [{ key: AnimationFactory.SHOES, frame: numCol * rowDown }]
    });
    scene.anims.create({
      key: AnimationFactory.SHOES_RIGHT,
      frames: [{ key: AnimationFactory.SHOES, frame: numCol * rowRight }]
    });

    // dynamic
    scene.anims.create({
      key: AnimationFactory.SHOES_WALK_UP,
      frames: scene.anims.generateFrameNumbers(AnimationFactory.SHOES, { start: numCol * rowUp + 1, end: numCol * rowUp + 8 }),
      frameRate: 12,
      repeat: -1
    });
    scene.anims.create({
      key: AnimationFactory.SHOES_WALK_LEFT,
      frames: scene.anims.generateFrameNumbers(AnimationFactory.SHOES, { start: numCol * rowLeft + 1, end: numCol * rowLeft + 8 }),
      frameRate: 12,
      repeat: -1
    });
    scene.anims.create({
      key: AnimationFactory.SHOES_WALK_DOWN,
      frames: scene.anims.generateFrameNumbers(AnimationFactory.SHOES, { start: numCol * rowDown + 1, end: numCol * rowDown + 8 }),
      frameRate: 12,
      repeat: -1
    });
    scene.anims.create({
      key: AnimationFactory.SHOES_WALK_RIGHT,
      frames: scene.anims.generateFrameNumbers(AnimationFactory.SHOES, { start: numCol * rowRight + 1, end: numCol * rowRight + 8 }),
      frameRate: 12,
      repeat: -1
    });
    
  }

}

export default AnimationFactory;