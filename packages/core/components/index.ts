// @ts-ignore Icon.astro is untyped unless loaded by language tools
import IconComponent from "./Icon.astro";
import { getIconSVG, getIconURL } from "./utils.js";

export { getIconSVG, getIconURL };

/**
 * The Icon component with additional helpers for retrieving icon data
 * programmatically in Astro frontmatter.
 *
 * - `Icon.svg(name)` – returns the raw SVG markup string
 * - `Icon.url(name)` – returns a CSS `url("data:image/svg+xml,…")` data-URL
 *
 * @example
 * ```astro
 * ---
 * import { Icon } from "astro-icon/components";
 *
 * // Use as a component
 * // <Icon name="mdi:arrow-right" />
 *
 * // Get the CSS url() directly — ready for mask-image / background-image
 * const arrowUrl = Icon.url("mdi:arrow-right");
 * ---
 *
 * <a href="https://google.com" class="external-link">google.com</a>
 *
 * <style define:vars={{ arrowUrl }}>
 * .external-link::after {
 *   content: "";
 *   display: inline-block;
 *   width: 1em;
 *   height: 1em;
 *   mask-image: var(--arrowUrl);
 *   background-color: currentColor;
 * }
 * </style>
 * ```
 */
const Icon = Object.assign(IconComponent, { svg: getIconSVG, url: getIconURL });
export { Icon };
