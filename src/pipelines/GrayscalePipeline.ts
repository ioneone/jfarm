import Phaser from 'phaser';

/**
 * @see {@link https://www.dynetisgames.com/2018/12/09/shaders-phaser-3/}
 */
class GrayscalePipeline extends Phaser.Renderer.WebGL.Pipelines.TextureTintPipeline
{
  constructor(game: Phaser.Game)
  {
    super({
      game: game,
      renderer: game.renderer,
      fragShader: `
        precision mediump float;
        uniform sampler2D uMainSampler;
        varying vec2 outTexCoord;
        void main(void) {
          vec4 color = texture2D(uMainSampler, outTexCoord);
          float gray = dot(color.rgb, vec3(0.299, 0.587, 0.114));
          gl_FragColor = vec4(vec3(gray), color.a);
        }
      `
    });
  }
}

export default GrayscalePipeline;