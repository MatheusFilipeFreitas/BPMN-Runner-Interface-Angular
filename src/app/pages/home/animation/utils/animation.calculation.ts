import {
  ColorValue,
  CssPropertyValue,
  copyParsedValue,
  NumericValue,
  TransformValue,
} from './animation.rule';

export function calculateNextCssValue<T extends CssPropertyValue = CssPropertyValue>(
  srcValue: T,
  targetValue: T,
  changeRate: number,
): T {
  switch (targetValue.type) {
    case 'numeric':
      return calculateNextNumericValue(srcValue as NumericValue, targetValue, changeRate) as T;
    case 'transform':
      return calculateNextTransformValue(srcValue as TransformValue, targetValue, changeRate) as T;
    case 'color':
      return calculateNextColorValue(srcValue as ColorValue, targetValue, changeRate) as T;
  }

  return copyParsedValue(targetValue);
}

function calculateNextNumericValue(
  srcValue: NumericValue,
  targetValue: NumericValue,
  changeRate: number,
): NumericValue {
  const nextValue: NumericValue = {
    type: 'numeric',
    values: [],
  };

  for (let i = 0; i < targetValue.values.length; i++) {
    const src = srcValue.values[i];
    const target = targetValue.values[i];
    const numDelta = calculateValueDelta(src[0], target[0], changeRate);
    const unit = target[1] || src[1];
    nextValue.values.push([src[0] + numDelta, unit]);
  }

  return nextValue;
}

function calculateNextTransformValue(
  srcValue: TransformValue,
  targetValue: TransformValue,
  changeRate: number,
): TransformValue {
  const nextValue: TransformValue = {
    type: 'transform',
    values: new Map(),
  };

  for (const [func, numData] of targetValue.values) {
    const srcNumData = srcValue.values.get(func)!;
    const newNumData: [number, string][] = [];

    for (let i = 0; i < numData.length; i++) {
      const target = numData[i];
      const src = srcNumData[i];
      const numDelta = calculateValueDelta(src[0], target[0], changeRate);
      const unit = target[1] || src[1];
      newNumData.push([src[0] + numDelta, unit]);
    }

    nextValue.values.set(func, newNumData);
  }

  return nextValue;
}

function calculateNextColorValue(
  srcValue: ColorValue,
  targetValue: ColorValue,
  changeRate: number,
): ColorValue {
  const nextColor: (string | number)[] = [srcValue.value[0]];

  for (let i = 1; i < targetValue.value.length; i++) {
    const srcChannel = srcValue.value[i] as number;
    const targetChannel = targetValue.value[i] as number;
    const delta = calculateValueDelta(srcChannel, targetChannel, changeRate);
    nextColor.push(Math.round(srcChannel + delta));
  }

  return {
    type: 'color',
    value: nextColor as typeof srcValue.value,
  };
}

function calculateValueDelta(srcValue: number, targetValue: number, changeRate: number): number {
  const valueSpan = targetValue - srcValue;
  return valueSpan * changeRate;
}
