// @ts-ignore Icon.astro is untyped unless loaded by language tools
import IconComponent from "./Icon.astro";
import { getIconSVG } from "./utils.js";

export { getIconSVG };

/**
 * The Icon component with an additional `svg()` helper that returns the raw SVG
 * markup string for a given icon name. This is useful for retrieving icon SVGs
 * in Astro frontmatter so they can be passed as CSS variables.
 *
 * @example
 * ```astro
 * ---
 * import { Icon } from "astro-icon/components";
 * const svg = Icon.svg("mdi:arrow-right");
 * const maskImage = `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
 * ---
 * <!-- Use as a component -->
 * <Icon name="mdi:arrow-right" />
 *
 * <!-- Use as a CSS variable -->
 * <style define:vars={{ maskImage }}>
 * .link::after { mask-image: var(--maskImage); }
 * </style>
 * ```
 */
const Icon = Object.assign(IconComponent, { svg: getIconSVG });
export { Icon };
