// @ts-ignore virtual module
import icons from "virtual:astro-icon";
import { getIconData, iconToSVG } from "@iconify/utils";
import type { IconCollection } from "../typings/integration.js";

/** The resolved render data for a single icon. */
export interface IconRenderData {
  /** Attributes for the `<svg>` element (e.g. `viewBox`, `width`, `height`). */
  attributes: Record<string, string>;
  /** Inner SVG markup (the body of the icon). */
  body: string;
  /** Unique id used for sprite `<symbol>` / `<use>` references. */
  id: string;
  /** Resolved icon set name (e.g. `"mdi"` or `"local"`). */
  setName: string;
  /** Resolved icon name within the set (e.g. `"arrow-right"`). */
  iconName: string;
  /** The Iconify collection the icon was loaded from. */
  collection: IconCollection;
}

/**
 * Resolves an icon name to its render data (attributes, body, id, …).
 *
 * This is the shared core used by `getIconSVG`, `getIconURL`, and the
 * `<Icon />` component so that the icon-lookup logic lives in one place.
 *
 * Throws a plain `Error` on failure; callers may re-wrap the error with
 * richer context (e.g. `AstroIconError` with a `hint`).
 */
export function resolveIconRenderData(name: string): IconRenderData {
  let [setName, iconName] = name.split(":");

  if (!setName && iconName) {
    throw new Error(
      `Invalid icon name "${name}". Did you forget the icon set prefix (e.g. "mdi:${iconName}")?`,
    );
  }

  // No iconName → treat as a local icon reference
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

  const collection: IconCollection = icons[setName];

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
  const id = `ai:${collection.prefix}:${iconName}`;

  return { attributes, body, id, setName, iconName, collection };
}

/**
 * Returns the SVG markup string for the given icon name.
 *
 * The icon name follows the same format as the `<Icon name="..." />` component:
 * - Iconify icon: `"set:icon-name"` (e.g. `"mdi:arrow-right"`)
 * - Local icon:   `"icon-name"` (e.g. `"my-logo"`)
 *
 * @example
 * ```astro
 * ---
 * import { Icon } from "astro-icon/components";
 * const svg = Icon.svg("mdi:arrow-right");
 * ---
 * ```
 */
export function getIconSVG(name: string): string {
  const { attributes, body } = resolveIconRenderData(name);
  const attrString = Object.entries(attributes)
    .map(([k, v]) => `${k}="${v}"`)
    .join(" ");
  return `<svg xmlns="http://www.w3.org/2000/svg" ${attrString}>${body}</svg>`;
}

/**
 * Returns a CSS `url()` data-URL for the given icon, ready to use as a
 * `mask-image` or `background-image` value.
 *
 * The icon name follows the same format as the `<Icon name="..." />` component:
 * - Iconify icon: `"set:icon-name"` (e.g. `"mdi:arrow-right"`)
 * - Local icon:   `"icon-name"` (e.g. `"my-logo"`)
 *
 * @example
 * ```astro
 * ---
 * import { Icon } from "astro-icon/components";
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
export function getIconURL(name: string): string {
  return `url("data:image/svg+xml,${encodeURIComponent(getIconSVG(name))}")`;
}
