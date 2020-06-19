# Grayscaled Sprite with Phaser 3

Here's pipeline for grayscaling your sprite. All you need to do is to register the pipeline and call `sprite.setPipeline(GrayscalePipeline.KEY)`.

Here's the source code for `GrayscalePipeline`.

```typescript
/**
 * A pipeline for drawing a grayscaled image.
 * @class 
 * @classdesc
 * Modification of {@link Phaser.Renderer.WebGL.Pipelines.TextureTintPipeline}.
 * 
 * @see {@link https://github.com/photonstorm/phaser/blob/v3.22.0/src/renderer/webgl/shaders/TextureTint-frag.js}
 * @see {@link https://www.dynetisgames.com/2018/12/09/shaders-phaser-3/}
 */
class GrayscalePipeline extends Phaser.Renderer.WebGL.Pipelines.TextureTintPipeline
{

  // the unique id of this pipeline
  public static readonly KEY = 'Grayscale';

  /**
   * @param {Phaser.Game} game - the controller of the game instance
   */
  constructor(game: Phaser.Game)
  {
    super({
      game: game,
      renderer: game.renderer,
      fragShader: `
        precision mediump float;

        uniform sampler2D uMainSampler;

        varying vec2 outTexCoord;
        varying float outTintEffect;
        varying vec4 outTint;
        
        void main(void) 
        {
          vec4 texture = texture2D(uMainSampler, outTexCoord);
          vec4 texel = vec4(outTint.rgb * outTint.a, outTint.a);
          vec4 color = texture;
          
          if (outTintEffect == 0.0)
          {
            color = texture * texel;
          }
          else if (outTintEffect == 1.0)
          {
            color.rgb = mix(texture.rgb, outTint.rgb * outTint.a, texture.a);
            color.a = texture.a * texel.a;
          }
          else if (outTintEffect == 2.0)
          {
            color = texel;
          }

          float gray = dot(color.rgb, vec3(0.299, 0.587, 0.114));

          gl_FragColor = vec4(vec3(gray), color.a);
        }
      `
    });
  }
}
```