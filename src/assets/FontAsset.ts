/**
 * Collection of the absolute or relative URLs to load the font image file from.
 * If you name your asset `foo`, then you must have the font texture at 
 * `{@link FontAssetData#FilePathPrefix}/foo/foo.png` and the font data at 
 * `{@link FontAssetData#FilePathPrefix}/foo/foo.fnt`.
 * @readonly
 * @enum {string}
 */
export enum FontAsset
{
  PressStart2P = "PressStart2P"
}

/**
 * Collection of the data common to all {@link FontAsset}
 * @readonly
 * @enum {string}
 */
export enum FontAssetData
{
  FilePathPrefix = "assets/fonts"
}