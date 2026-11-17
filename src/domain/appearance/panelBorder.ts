export interface PanelBorder {
  readonly width: number;
  readonly radius: number;
  readonly color: string;
}

export const BORDER_WIDTH_RANGE = { min: 0, max: 10 } as const;
export const BORDER_RADIUS_RANGE = { min: 0, max: 40 } as const;

const SAFE_COLOR = /^(#[0-9a-f]{3,8}|(rgb|rgba|hsl|hsla)\([0-9.,%\s]+\)|[a-z]+)$/i;

const clamp = (value: number, { min, max }: { min: number; max: number }): number =>
  Math.min(max, Math.max(min, Math.round(Number.isFinite(value) ? value : min)));

export const isValidBorderColor = (color: string): boolean => SAFE_COLOR.test(color.trim());

export const buildPanelBorderStyle = ({ width, radius, color }: PanelBorder): string => {
  const declarations = [
    `border-width: ${clamp(width, BORDER_WIDTH_RANGE)}px;`,
    `border-radius: ${clamp(radius, BORDER_RADIUS_RANGE)}px;`,
  ];
  if (isValidBorderColor(color)) declarations.push(`border-color: ${color.trim()};`);
  return declarations.join(" ");
};
