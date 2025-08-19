export type NumericValue = {
  type: 'numeric';
  values: [number, string][];
};

export type StaticValue = {
  type: 'static';
  value: string;
};

export type ColorValue = {
  type: 'color';
  value: ['rgb', number, number, number] | ['rgba', number, number, number, number];
};

export type TransformValue = {
  type: 'transform';
  values: Map<string, [number, string][]>;
};

export type Styles = {[key: string]: string};

export type CssPropertyValue = NumericValue | StaticValue | ColorValue | TransformValue;

export function copyParsedValue<T = CssPropertyValue>(value: T): T {
  return structuredClone(value);
}

export type ParsedStyles = {[key: string]: CssPropertyValue};

interface AnimationRuleBase {
  selector: string;
}

/** Animation definition */
export interface DynamicAnimationRule<T extends Styles | ParsedStyles> extends AnimationRuleBase {
  at?: never;

  /** In seconds. Marks the time frame between which the styles are applied (`[START, END]`). */
  timeframe: [number, number];
  /** Start styles.  */
  from: T;
  /** End styles. */
  to: T;
}

export interface StaticAnimationRule<T extends Styles | ParsedStyles> extends AnimationRuleBase {
  timeframe?: never;

  /** In seconds. Time at which the styles are applied. */
  at: number;
  /** Styles to be applied. */
  styles: T;
}

export type AnimationRule<T extends Styles | ParsedStyles> =
  | DynamicAnimationRule<T>
  | StaticAnimationRule<T>;