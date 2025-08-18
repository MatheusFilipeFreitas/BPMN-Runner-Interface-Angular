import { Styles, AnimationRule, CssPropertyValue } from "./animation.rule";

/** Timing constants */
const TIMING_MULTIPLIER = 1.55;
export const ANIM_TIMESTEP = 10;

const FIRST_WAVE_METEORS = 0.05;
const SECOND_WAVE_METEORS = 0.15;
const THIRD_WAVE_METEORS = 0.25;

/** Helper functions for timing */
const at = (time: number) => time * TIMING_MULTIPLIER;
const timeframe = (from: number, to: number): [number, number] => [
  from * TIMING_MULTIPLIER,
  to * TIMING_MULTIPLIER,
];

/** Layer selectors */
const LAYERS = {
  logo: {
    base: 'logo',
    shield: 'logo >> .shield',
    shieldMiddle: 'logo >> .shield-middle',
    letters: {
      B: 'logo >> .capt-b-letter',
      P: 'logo >> .capt-p-letter',
      M: 'logo >> .capt-m-letter',
      N: 'logo >> .capt-n-letter',
      R: 'logo >> .capt-r-letter',
      U: 'logo >> .u-letter',
      N1: 'logo >> .n1-letter',
      N2: 'logo >> .n2-letter',
      E: 'logo >> .e-letter',
      R2: 'logo >> .r-letter',
    },
    logo: 'logo >> .logo',
  },
  worksAtAnyScale: 'works-at-any-scale',
  meteorField: {
    base: 'meteor-field',
    field: 'meteor-field >> .field',
    meteor: 'meteor-field >> .meteor',
    id: (id: number) => `meteor-field >> .mt-${id}`,
  },
  useItAnywhere: 'use-it-anywhere',
  buildForEveryone: {
    base: 'build-for-everyone',
    title: 'build-for-everyone >> .title',
  },
} as const;

/** Animation helpers */
function hideLetter(selector: string, startTime: number): AnimationRule<Styles> {
  return {
    selector,
    timeframe: timeframe(startTime, startTime + 1),
    from: { opacity: '1' },
    to: { opacity: '0' },
  };
}

function showMeteor(selector: string, startTime: number): AnimationRule<Styles> {
  const randomizedStart = startTime + Math.random();
  return {
    selector,
    timeframe: timeframe(randomizedStart, randomizedStart + 1),
    from: { opacity: '0', transform: 'translate(200%, 200%) scale(0.3)' },
    to: { opacity: '1', transform: 'translate(0, 0) scale(1)' },
  };
}

function meteorShower(
  startTime: number,
  size: number,
  total: number,
  usedIds: Set<number>
): [AnimationRule<Styles>[], Set<number>] {
  const availableIds = Array.from({ length: total }, (_, i) => i + 1)
    .filter(id => !usedIds.has(id));
  const selectedIds = availableIds.sort(() => Math.random() - 0.5).slice(0, Math.floor(size));
  const newUsedIds = new Set([...usedIds, ...selectedIds]);
  const animations = selectedIds.map(id => showMeteor(LAYERS.meteorField.id(id), startTime));
  return [animations, newUsedIds];
}

/** Generate home animation definition */
export function generateHomeAnimationDefinition(meteorCount: number): AnimationRule<Styles>[] {
  let usedMeteorIds = new Set<number>();

  const [firstWave, usedAfterFirst] = meteorShower(8, meteorCount * FIRST_WAVE_METEORS, meteorCount, usedMeteorIds);
  const [secondWave, usedAfterSecond] = meteorShower(10, meteorCount * SECOND_WAVE_METEORS, meteorCount, usedAfterFirst);
  const [thirdWave, usedAfterThird] = meteorShower(12, meteorCount * THIRD_WAVE_METEORS, meteorCount, usedAfterSecond);

  const lastWaveStart = 16;
  const lastWave = Array.from({ length: meteorCount }, (_, i) => i + 1)
    .filter(id => !usedAfterThird.has(id))
    .map(id => showMeteor(LAYERS.meteorField.id(id), lastWaveStart));

  return [
    ...generateLogoAnimations(),
    ...generateShieldAnimations(),
    ...generateWorksAtAnyScaleAnimations(),
    ...[
      {
        selector: LAYERS.meteorField.field,
        at: at(7),
        styles: { display: 'flex' } as Styles,
      },
      {
        selector: LAYERS.meteorField.field,
        timeframe: timeframe(8, 18),
        from: { transform: 'scale(1.42)' } as Styles,
        to: { transform: 'scale(1)' } as Styles,
      },
      ...firstWave,
      ...secondWave,
      ...thirdWave,
      ...lastWave,
      {
        selector: LAYERS.meteorField.meteor,
        timeframe: timeframe(19.5, 21),
        from: { transform: 'translate(0,0) scale(1)' },
        to: { transform: 'translate(-200%, -200%) scale(0.3)' },
      },
      {
        selector: LAYERS.meteorField.field,
        timeframe: timeframe(19.5, 21),
        from: { opacity: '1' },
        to: { opacity: '0' },
      },
      {
        selector: LAYERS.meteorField.field,
        at: at(22),
        styles: { display: 'none' } as Styles,
      },
    ],
    ...generateUseItAnywhereAnimations(),
    ...generateBuildForEveryoneAnimations(),
  ];
}

/** Individual animation generators */
function generateLogoAnimations(): AnimationRule<Styles>[] {
  const letters = LAYERS.logo.letters;
  const sequence = [
    { selector: letters.R2, time: 1.0 },
    { selector: letters.E, time: 1.33 },
    { selector: letters.N2, time: 1.67 },
    { selector: letters.N1, time: 2.0 },
    { selector: letters.U, time: 2.33 },
    { selector: letters.R, time: 2.67 },
    { selector: letters.N, time: 3.0 },
    { selector: letters.M, time: 3.33 },
    { selector: letters.P, time: 3.67 },
    { selector: letters.B, time: 4.0 },
  ];

  return [
    {
      selector: LAYERS.logo.logo,
      timeframe: timeframe(0, 5),
      from: { transform: 'translateX(0)' },
      to: { transform: 'translateX(467px)' },
    },
    ...sequence.map(({ selector, time }) => hideLetter(selector, time)),
  ];
}

function generateShieldAnimations(): AnimationRule<Styles>[] {
  return [
    {
      selector: LAYERS.logo.shieldMiddle,
      timeframe: timeframe(5.5, 5.6),
      from: { transform: 'scale(1)' },
      to: { transform: 'scale(0)' },
    },
    {
      selector: LAYERS.logo.shield,
      timeframe: timeframe(5.5, 10),
      from: { transform: 'scale(1) rotate(0deg)' },
      to: { transform: 'scale(50) rotate(-360deg)' },
    },
  ];
}

function generateWorksAtAnyScaleAnimations(): AnimationRule<Styles>[] {
  return [
    {
      selector: LAYERS.worksAtAnyScale,
      timeframe: timeframe(5.7, 8),
      from: { transform: 'scale(0.1)', opacity: '0' },
      to: { transform: 'scale(1)', opacity: '1' },
    },
    {
      selector: LAYERS.worksAtAnyScale,
      timeframe: timeframe(11, 12.5),
      from: { transform: 'scale(1)', opacity: '1' },
      to: { transform: 'scale(1.5)', opacity: '0' },
    },
  ];
}

function generateUseItAnywhereAnimations(): AnimationRule<Styles>[] {
  return [
    {
      selector: LAYERS.useItAnywhere,
      timeframe: timeframe(14, 15.5),
      from: { transform: 'scale(0.75)', opacity: '0' },
      to: { transform: 'scale(1)', opacity: '1' },
    },
    {
      selector: LAYERS.useItAnywhere,
      timeframe: timeframe(19, 20.5),
      from: { transform: 'scale(1)', opacity: '1' },
      to: { transform: 'scale(1.5)', opacity: '0' },
    },
  ];
}

function generateBuildForEveryoneAnimations(): AnimationRule<Styles>[] {
  return [
    {
      selector: LAYERS.buildForEveryone.base,
      timeframe: timeframe(22, 25),
      from: { transform: 'scale(0.75)', opacity: '0' },
      to: { transform: 'scale(1)', opacity: '1' },
    },
    {
      selector: LAYERS.buildForEveryone.title,
      timeframe: timeframe(23, 25),
      from: { 'background-position-x': '100%' },
      to: { 'background-position-x': '0' },
    },
    {
      selector: LAYERS.buildForEveryone.base,
      timeframe: timeframe(29, 31.5),
      from: { opacity: '1' },
      to: { opacity: '0' },
    },
  ];
}

export type AnimationDefinition = AnimationRule<Styles>[];
