import { ColorValue, CssPropertyValue, NumericValue, TransformValue } from './animation.rule';

const SUPPORTED_FUNCS = [
  'translate',
  'rotate',
  'scale',
  'skew',
  'translateX',
  'translateY',
  'translateZ',
  'scaleX',
  'scaleY',
  'scaleZ',
  'skewX',
  'skewY',
];

type CharType =
  | 'letter'
  | 'digit'
  | 'point'
  | 'comma'
  | 'hyphen'
  | 'hash'
  | 'percent'
  | 'space'
  | 'bracket'
  | 'unknown';

type BufferType = 'text' | 'color' | 'number' | null;

const END_SYMBOLS: CharType[] = ['space', 'bracket', 'comma'];

interface ParserHandler {
  (tokens: (string | number)[]): CssPropertyValue | null;
}

function getCharType(char: string): CharType {
  if (char === '.') {
    return 'point';
  }
  if (char === '-') {
    return 'hyphen';
  }
  if (char === ',') {
    return 'comma';
  }
  if (char === '%') {
    return 'percent';
  }
  if (char === '#') {
    return 'hash';
  }
  if (char === ' ') {
    return 'space';
  }
  if (char === '(' || char === ')') {
    return 'bracket';
  }

  const code = char.charCodeAt(0);

  if (48 <= code && code <= 57) {
    return 'digit';
  }
  if ((65 <= code && code <= 90) || (97 <= code && code <= 122)) {
    return 'letter';
  }
  return 'unknown';
}

function getBufferType(type: CharType, currentBuffer: BufferType): BufferType {
  const colorSymbols: CharType[] = ['hash'];
  if (colorSymbols.includes(type) || currentBuffer === 'color') {
    return 'color';
  }

  const textSymbols: CharType[] = ['letter', 'percent'];
  if (textSymbols.includes(type)) {
    return 'text';
  }

  const numberSymbols: CharType[] = ['digit', 'point', 'hyphen'];
  if (numberSymbols.includes(type)) {
    return 'number';
  }

  return null;
}

function cssValueLexer(value: string): (string | number)[] {
  const tokens: (string | number)[] = [];
  let buffer = '';
  let bufferType: BufferType | null = null;

  const addToken = () => tokens.push(bufferType === 'number' ? parseFloat(buffer) : buffer);

  for (const char of value) {
    const charType = getCharType(char);
    const newBufferType = getBufferType(charType, bufferType);

    if (END_SYMBOLS.includes(charType) && buffer) {
      addToken();
      buffer = '';
      bufferType = null;
    } else if (newBufferType !== null) {
      if (newBufferType !== bufferType && bufferType !== null) {
        addToken();
        buffer = char;
        bufferType = newBufferType;
      } else if (newBufferType === bufferType || bufferType === null) {
        buffer += char;
        bufferType = newBufferType;
      }
    }
  }

  if (buffer) {
    addToken();
  }

  return tokens;
}

const colorValuesHandler: ParserHandler = (tokens) => {
  const token = tokens[0];
  if (typeof token === 'string') {
    if (token.startsWith('#')) {
      const channels = [];

      if (token.length === 7) {
        let channelBuffer = '';
        for (let i = 1; i < token.length; i++) {
          channelBuffer += token[i];
          if (channelBuffer.length === 2) {
            const dec = parseInt(channelBuffer, 16);
            channels.push(dec);
            channelBuffer = '';
          }
        }
      } else if (token.length === 4) {
        for (let i = 1; i < token.length; i++) {
          const channel = token[i];
          const hex = channel + channel;
          const dec = parseInt(hex, 16);
          channels.push(dec);
        }
      }

      if (channels.length === 3) {
        return {
          type: 'color',
          value: ['rgb', ...channels],
        } as ColorValue;
      }
    }
    if ((token === 'rgb' && tokens.length === 4) || (token === 'rgba' && tokens.length === 5)) {
      return {
        type: 'color',
        value: tokens,
      } as ColorValue;
    }
  }
  return null;
};

const numericValueHandler: ParserHandler = (tokens) => {
  if (typeof tokens[0] === 'number') {
    const value: NumericValue = {
      type: 'numeric',
      values: [],
    };
    let buffer = [];

    for (const token of tokens) {
      if (typeof token === 'number') {
        if (buffer.length) {
          value.values.push((buffer.length === 1 ? [buffer[0], ''] : buffer) as [number, string]);
          buffer = [];
        }

        buffer.push(token);
      } else if (buffer.length === 1) {
        buffer.push(token);
      } else {
        return null;
      }
    }

    if (buffer.length) {
      value.values.push((buffer.length === 1 ? [buffer[0], ''] : buffer) as [number, string]);
    }

    return value;
  }

  return null;
};

const transformValueHandler: ParserHandler = (tokens) => {
  if (tokens.length > 1 && typeof tokens[0] === 'string') {
    const value: TransformValue = {
      type: 'transform',
      values: new Map(),
    };
    let functionName = '';
    let paramPairs: [number, string][] = [];
    let paramBuffer: unknown[] = [];
    let isValid = true;

    const isBufferNumOnly = () => !paramBuffer.find((v) => typeof v === 'string');

    for (const token of tokens) {
      if (typeof token === 'string' && SUPPORTED_FUNCS.includes(token)) {
        if (paramPairs.length || paramBuffer.length) {
          if (paramBuffer.length) {
            if (!isBufferNumOnly()) {
              isValid = false;
              break;
            }

            const pairs = paramBuffer.map((v) => [v, ''] as [number, string]);
            paramPairs = paramPairs.concat(pairs);
          }

          value.values.set(functionName, paramPairs);
          paramPairs = [];
          paramBuffer = [];
        }

        functionName = token;
      } else if (functionName) {
        paramBuffer.push(token);

        if (
          paramBuffer.length === 2 &&
          typeof paramBuffer[0] === 'number' &&
          typeof paramBuffer[1] === 'string'
        ) {
          paramPairs.push(paramBuffer as [number, string]);
          paramBuffer = [];
        }
      }
    }

    if (functionName && (paramPairs.length || paramBuffer.length)) {
      if (paramBuffer.length && isBufferNumOnly()) {
        const pairs = paramBuffer.map((v) => [v, ''] as [number, string]);
        paramPairs = paramPairs.concat(pairs);
      }

      if (paramPairs.length) {
        value.values.set(functionName, paramPairs);
      }
    }

    if (isValid && value.values.size) {
      return value;
    }
  }
  return null;
};

const parserHandlers = [colorValuesHandler, numericValueHandler, transformValueHandler];

export function cssValueParser(value: string): CssPropertyValue {
  const tokens = cssValueLexer(value);

  for (const handler of parserHandlers) {
    const value = handler(tokens);
    if (value) {
      return value;
    }
  }

  return {
    type: 'static',
    value,
  };
}

export function stringifyParsedValue(value: CssPropertyValue): string {
  switch (value.type) {
    case 'numeric':
      return value.values.map(([num, unit]) => num + unit).join(' ');
    case 'transform':
      return Array.from(value.values)
        .map(
          ([fnName, numData]) =>
            `${fnName}(${numData.map(([num, unit]) => num + unit).join(', ')})`,
        )
        .join(' ');
    case 'color':
      const v = value.value;
      let color = v[0] + '(';
      for (let i = 1; i < v.length; i++) {
        color += v[i] + (i < v.length - 1 ? ', ' : '');
      }
      return color + ')';
    case 'static':
      return value.value;
  }
}
