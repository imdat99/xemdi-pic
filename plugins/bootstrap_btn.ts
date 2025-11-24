import { type Preset, symbols } from 'unocss';
function compressCSS(css: string, isDev = false) {
  if (isDev)
    return css.trim();
  return css.trim().replace(/\s+/g, " ").replace(/\/\*[\s\S]*?\*\//g, "");
}
function get<T>(obj: Record<string, T> | undefined = {}, key: string): T {
  // key = "key" or "key.subkey"
  const keys = key.split('.');
  let result: any = obj;

  for (const k of keys) {
    if (result == null || typeof result !== 'object') return undefined as any;
    result = result[k];
  }

  return result;
}
type ColorRecordType = string | Record<string, string>;
class ColorRecord {
  // [key: string]: string | ColorRecord;
  _colors: Record<string, ColorRecordType> = {};
  constructor(obj?: Record<string, string | Record<string, string>>) {
    if (obj) {
      this._add(obj);
    }
  }
  _add(obj: Record<string, string | Record<string, string>>) {
    this._colors = { ...this._colors, ...obj };
  }
  get colors() {
    return this._colors;
  }
  get(key: string): ColorRecord | string | undefined {
    const color = get(this._colors, key);
    if (color !== undefined) {
      return typeof color === 'string' ? color : new ColorRecord(color);
    }
    return undefined;
  }
}
function extractColors(theme: {colors: Record<string, string | Record<string, string>>}): ColorRecord {
  const colors: any = {};
  Object.entries(theme.colors).forEach(([key, value]) => {
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      colors[key] = value as any
    }
  });
  return new ColorRecord(colors);
}

const colorsMap = new Map<string, Record<string, string>>();
export const presetBootstrapBtn = (): Preset => ({
  name: 'preset-bootstrap-btn',
  preflights: [
    {
      layer: 'base',
      getCSS: (ctx) => {
        const colors = (ctx.generator.config.theme as { colors: Record<string, Record<string, string>> }).colors || {}
        Object.entries(colors).forEach(([key, value]) => {
          colorsMap.set(key, value)
        })
        return ""
      }
    }
  ],
  rules: [
    // Base .btn style
    [
      /^btn$/,
      () => ({
        'display': 'inline-flex',
        'font-weight': '500',
        'line-height': '1.5',
        'text-align': 'center',
        'text-decoration': 'none',
        'vertical-align': 'middle',
        'user-select': 'none',
        'align-items': 'center',
        'border': '1px solid transparent',
        'padding': '0.375rem 0.75rem',
        'font-size': '1rem',
        'border-radius': '0.375rem',
        'transition': 'color .15s ease-in-out, background-color .15s ease-in-out, border-color .15s ease-in-out, box-shadow .15s ease-in-out',
        'cursor': 'pointer',
        'gap': '.375rem',
    // "cursor": "pointer",
    // "border": "1px solid #0000",
    // "border-radius": ".375rem",
    // "outline": "none",
    // "align-items": "center",
    // "gap": ".375rem",
    // "height": "2.5rem",
    // "padding-inline": "1rem",
    // "font-size": ".8125rem",
    // "font-weight": 500,
    // "line-height": 1,
    // "display": "inline-flex"
      }),
    ],

    // Variants
    [/^btn-(primary|secondary|success|danger|warning|info|light|dark)$/, ([, c], {theme}) => {
      const color = extractColors(theme as any).get(`${c}.DEFAULT`)
      const colorLight = extractColors(theme as any).get(`${c}.light`) ?? `color-mix(in srgb, ${color} 85%, black)`;
      const text = ['light', 'warning'].includes(c) ? '#000' : '#fff'

      return [{
        'color': text,
        'background-color': color,
        'border-color': color,
        'transition': 'all 0.15s ease-in-out',
      },
      {
        [symbols.selector]: selector => `${selector}:hover`,
        // background: `color-mix(in srgb, ${color} 90%, black)`,
        // "border-color": `color-mix(in srgb, ${color} 85%, black)`,
        "box-shadow": `.25rem .25rem 0 ${colorLight}`,
        'transform': 'translate(-0.125rem, -0.125rem)',
      },
      {
        [symbols.selector]: selector => `${selector}:focus`,
        outline: `0`,
      },
      {
        [symbols.selector]: selector => `${selector}:disabled`,
        opacity: `.65`,
        "pointer-events": `none`,
      },
      // Active
      {
        [symbols.selector]: selector => `${selector}.active`,
        background: `color-mix(in srgb, ${color} 80%, black)`,
        "border-color": `color-mix(in srgb, ${color} 75%, black)`,
        "box-shadow": `inset 0 .15rem .3rem rgba(0,0,0,.15)`,
      }
    ]
    }],

    // Outline variants
    [/^btn-outline-(primary|secondary|success|danger|warning|info|light|dark)$/, ([, c], {theme}) => {
      const color = extractColors(theme as any).get(`${c}.DEFAULT`)
      const colorLight = extractColors(theme as any).get(`${c}.light`)

      return [{
        'color': color,
        'border-color': color,
        'background-color': 'transparent',
        'transition': 'all 0.15s ease-in-out',
      },
      {
        [symbols.selector]: selector => `${selector}:hover`,
        // color: '#fff',
        // "background-color": color,
        // "border-color": color,
        'box-shadow': `0.25rem .25rem 0 ${colorLight}`,
        'transform': 'translate(-0.125rem, -0.125rem)',
      },
    ]
    }],
    // Size variants
    [/^btn-(lg|sm)$/, ([, size], {theme}) => {
      const padding = size === 'lg' ? '0.5rem 1rem' : '0.25rem 0.5rem';
      const fontSize = size === 'lg' ? '1.125rem' : '0.875rem';
      const borderRadius = size === 'lg' ? '0.5rem' : '0.25rem';
      return [{
        'padding': padding,
        'font-size': fontSize,
        'border-radius': borderRadius,
      },
    ]
    }],
    // Button group
  ],
  shortcuts: [
    // ==== Button Group ====
    [
      'btn-group',
      [
        'inline-flex items-stretch align-middle',
        '[&>.btn]:rounded-none',
        '[&>.btn:first-child]:rounded-l-md',
        '[&>.btn:last-child]:rounded-r-md',
        '[&>.btn:not(:last-child)]:border-r-0',
      ].join(' '),
    ],

    [
      'btn-group-vertical',
      [
        'inline-flex flex-col items-stretch align-middle',
        '[&>.btn]:rounded-none',
        '[&>.btn:first-child]:rounded-t-md',
        '[&>.btn:last-child]:rounded-b-md',
        '[&>.btn:not(:last-child)]:border-b-0',
      ].join(' '),
    ],
  ]
})
