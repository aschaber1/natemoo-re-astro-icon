// @ts-ignore virtual module
import icons from "virtual:astro-icon";
import { getIconData, iconToSVG } from "@iconify/utils";

/**
 * Returns the SVG markup string for the given icon name.
 *
 * The icon name follows the same format as the `<Icon name="..." />` component:
 * - Iconify icon: `"set:icon-name"` (e.g. `"mdi:arrow-right"`)
 * - Local icon:   `"icon-name"` (e.g. `"my-logo"`)
 *
 * The returned string can be used directly as an inline SVG, or encoded into a
 * CSS `mask-image` / `background-image` data URL:
 *
 * @example
 * ```astro
 * ---
 * import { Icon } from "astro-icon/components";
 * const svg = Icon.svg("mdi:arrow-right");
 * const maskImage = `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
 * ---
 * <style define:vars={{ maskImage }}>
 * .external-link::after {
 *   mask-image: var(--maskImage);
 * }
 * </style>
 * ```
 */
export function getIconSVG(name: string): string {
  let [setName, iconName] = name.split(":");

  if (!setName && iconName) {
    throw new Error(
      `Invalid icon name "${name}". Did you forget the icon set prefix (e.g. "mdi:${iconName}")?`,
    );
  }

  // No iconName means it's a local icon reference
  if (!iconName) {
    iconName = setName;
    setName = "local";

    if (!icons[setName]) {
      throw new Error(
        'Unable to load the "local" icon set. Did you forget to create the icon directory?',
      );
    }

    if (!(iconName in icons[setName].icons)) {
      throw new Error(
        `Unable to locate "${name}" in your local icon directory. Is this a typo?`,
      );
    }
  }

  const collection = icons[setName];

  if (!collection) {
    throw new Error(
      `Unable to locate the "${setName}" icon set. Did you configure it in your astro.config?`,
    );
  }

  const iconData = getIconData(collection, iconName);

  if (!iconData) {
    throw new Error(
      `Unable to locate "${name}" icon in the "${setName}" set. Is this a typo?`,
    );
  }

  const { attributes, body } = iconToSVG(iconData);

  const attrString = Object.entries(attributes)
    .map(([k, v]) => `${k}="${v}"`)
    .join(" ");

  return `<svg xmlns="http://www.w3.org/2000/svg" ${attrString}>${body}</svg>`;
}
