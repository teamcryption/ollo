// Hand-maintained defaults merged into meta.json on import: titles, categories, tags,
// Figma node ids and motion specs. Once meta.json exists, edit it directly instead.

const SYM = [0.5, 0, 0.5, 1];
const BACK = [0.45, 1.45, 0.8, 1]; // ease-out-back used across the Figma motion
const D = 3000;

// "Pop outline + draw inner lines" - the shared icon motion from the Figma board.
const popAndDraw = (detailPaths) => ({
  duration: D,
  loop: true,
  tracks: [
    { target: 0, property: 'scale', origin: [50, 50], times: [0, 0.1667, 1], values: [0.6, 1, 1], ease: [BACK, 'linear'] },
    { target: 0, property: 'opacity', times: [0, 0.1333, 0.8, 0.9333, 1], values: [0, 1, 1, 0, 0], ease: ['easeOut', SYM, 'easeIn', 'linear'] },
    ...detailPaths.map((i) => ({
      target: i,
      property: 'draw',
      times: [0, 0.133, 0.333, 0.8, 0.933, 1],
      values: [0, 0, 1, 1, 0, 0],
      ease: ['linear', 'easeInOut', SYM, 'easeIn', 'linear'],
    })),
  ],
});

export const ICON_DEFAULTS = {
  home: {
    title: 'Home', category: 'navigation', nodeId: '12:43',
    tags: ['house', 'main', 'start', 'dashboard'],
    animation: { ...popAndDraw([1]), source: 'figma' },
  },
  user: { title: 'User', category: 'people', nodeId: '12:74', tags: ['person', 'profile', 'account', 'avatar'] },
  bell: {
    title: 'Bell', category: 'notifications', nodeId: '12:116',
    tags: ['notification', 'alert', 'alarm', 'reminder'],
    animation: {
      duration: D, loop: true, source: 'figma',
      tracks: [
        { target: 'root', property: 'rotate', origin: [50, 50], times: [0, 0.0667, 0.1333, 0.2, 0.2667, 0.3333, 0.4, 1], values: [0, 0, -18, 15, -10, 6, 0, 0], ease: ['linear', 'easeOut', 'easeInOut', 'easeInOut', 'easeInOut', 'easeOut', 'linear'] },
        { target: 1, property: 'translateX', times: [0, 0.0667, 0.1333, 0.2, 0.2667, 0.3333, 0.4, 1], values: [0, 0, -1.5, 1.5, -1, 0.6, 0, 0], ease: ['linear', 'easeOut', SYM, SYM, SYM, SYM, 'linear'] },
      ],
    },
  },
  search: {
    title: 'Search', category: 'actions', nodeId: '12:159',
    tags: ['find', 'magnifier', 'lookup', 'zoom'],
    animation: {
      duration: D, loop: true, source: 'figma',
      tracks: [
        { target: 'root', property: 'translateX', times: [0, 0.0667, 0.2333, 0.4, 0.5333, 1], values: [0, 0, -3, 3, 0, 0], ease: ['linear', 'easeInOut', 'easeInOut', 'easeInOut', 'linear'] },
        { target: 'root', property: 'translateY', times: [0, 0.0667, 0.2333, 0.4, 0.5333, 1], values: [0, 0, -2, -2, 0, 0], ease: ['linear', 'easeInOut', 'easeInOut', 'easeInOut', 'linear'] },
      ],
    },
  },
  heart: {
    title: 'Heart', category: 'social', nodeId: '12:191',
    tags: ['like', 'love', 'favourite', 'favorite'],
    animation: {
      duration: D, loop: true, source: 'figma',
      tracks: [
        { target: 'root', property: 'scale', origin: [50, 50], times: [0, 0.0667, 0.15, 0.2333, 0.3167, 0.4333, 1], values: [1, 1, 1.25, 1, 1.15, 1, 1], ease: ['linear', 'easeOut', 'easeIn', 'easeOut', 'easeInOut', 'linear'] },
      ],
    },
  },
  mail: {
    title: 'Mail', category: 'communication', nodeId: '12:223',
    tags: ['email', 'envelope', 'inbox', 'message'],
    animation: { ...popAndDraw([1]), source: 'approximated' },
  },
  lock: {
    title: 'Lock', category: 'security', nodeId: '12:269',
    tags: ['padlock', 'secure', 'private', 'password'],
    notes: 'Figma shape is the open (unlocked) padlock - confirm whether the base icon should be closed.',
    animation: {
      duration: D, loop: true, source: 'figma',
      tracks: [
        { target: 'root', property: 'translateX', times: [0, 0.6, 0.6267, 0.6533, 0.68, 0.7067, 1], values: [0, 0, -1.2, 1.2, -0.8, 0, 0], ease: ['linear', SYM, SYM, SYM, SYM, 'linear'] },
        { target: 1, property: 'translateY', times: [0, 0.1, 0.2333, 0.5, 0.6, 1], values: [0, 0, -2.5, -2.5, 0, 0], ease: ['linear', BACK, SYM, 'easeIn', 'linear'] },
      ],
    },
  },
  folder: {
    title: 'Folder', category: 'files', nodeId: '12:301',
    tags: ['directory', 'files', 'documents', 'archive'],
    animation: { ...popAndDraw([1]), source: 'approximated' },
  },
  calendar: { title: 'Calendar', category: 'time', nodeId: '12:372', tags: ['date', 'schedule', 'event', 'planner'] },
  chat: {
    title: 'Chat', category: 'communication', nodeId: '12:415',
    tags: ['message', 'comment', 'conversation', 'bubble'],
    animation: { ...popAndDraw([1, 2]), source: 'approximated' },
  },
};

// Illustration motion is not exportable from Figma yet via MCP for groups, so these are
// written from the brief ("floats/bobs, drop in with bounce, lines typing on, padlock
// snapping shut, ~3.2s loop") and flagged as approximated.
const IL = 3200;
const drop = (target, start, dy = -24) => ({
  target, property: 'translateY',
  times: [0, start, start + 0.12, start + 0.17, 0.85, 0.93, 1],
  values: [dy, dy, 0, 0, 0, dy, dy],
  ease: ['linear', BACK, 'linear', 'linear', 'easeIn', 'linear'],
});
const fadeIn = (target, start) => ({
  target, property: 'opacity',
  times: [0, start, start + 0.08, 0.85, 0.93, 1],
  values: [0, 0, 1, 1, 0, 0],
  ease: ['linear', 'easeOut', 'linear', 'easeIn', 'linear'],
});
const bob = (target, amp = 3) => ({
  target, property: 'translateY', times: [0, 0.5, 1], values: [0, -amp, 0], ease: ['easeInOut', 'easeInOut'],
});
const draw = (target, start) => ({
  target, property: 'draw',
  times: [0, start, start + 0.2, 0.85, 0.93, 1],
  values: [0, 0, 1, 1, 0, 0],
  ease: ['linear', 'easeInOut', 'linear', 'easeIn', 'linear'],
});

export const ILLUSTRATION_DEFAULTS = {
  'server-stack': {
    category: 'technology', tags: ['server', 'hosting', 'database', 'cloud', 'infrastructure'],
    nodeIds: { stroke: '8:10', fill: '8:126', duotone: '12:593' },
    animation: { duration: IL, loop: true, source: 'approximated', tracks: [
      drop('server-1', 0.0), fadeIn('server-1', 0.0),
      drop('server-2', 0.1), fadeIn('server-2', 0.1),
      drop('server-3', 0.2), fadeIn('server-3', 0.2),
      draw('signal', 0.35),
    ] },
  },
  analytics: {
    category: 'business', tags: ['chart', 'statistics', 'graph', 'report', 'growth'],
    nodeIds: { stroke: '8:39', fill: '8:155', duotone: '12:622' },
    animation: { duration: IL, loop: true, source: 'approximated', tracks: [
      drop('bar-1', 0.0, -16), fadeIn('bar-1', 0.0),
      drop('bar-2', 0.08, -16), fadeIn('bar-2', 0.08),
      drop('bar-3', 0.16, -16), fadeIn('bar-3', 0.16),
      bob('card', 4),
    ] },
  },
  'mobile-app': {
    category: 'technology', tags: ['phone', 'mobile', 'app', 'smartphone', 'chat'],
    nodeIds: { stroke: '8:61', fill: '8:177', duotone: '12:644' },
    animation: { duration: IL, loop: true, source: 'approximated', tracks: [
      bob('phone', 3), bob('screen-lines', 3),
      draw('screen-lines', 0.1),
      { target: 'bubble', property: 'scale', origin: [50, 100], times: [0, 0.35, 0.47, 0.85, 0.93, 1], values: [0, 0, 1, 1, 0, 0], ease: ['linear', BACK, 'linear', 'easeIn', 'linear'] },
    ] },
  },
  'secure-vault': {
    category: 'security', tags: ['vault', 'safe', 'lock', 'security', 'protection'],
    nodeIds: { stroke: '8:82', fill: '8:198', duotone: '12:665' },
    animation: { duration: IL, loop: true, source: 'approximated', tracks: [
      drop('padlock', 0.0, -20), fadeIn('padlock', 0.0),
      { target: 'shackle', property: 'translateY', times: [0, 0.25, 0.35, 0.85, 0.93, 1], values: [-8, -8, 0, 0, -8, -8], ease: ['linear', BACK, 'linear', 'easeIn', 'linear'] },
      fadeIn('shackle', 0.0),
    ] },
  },
  delivery: {
    category: 'commerce', tags: ['parcel', 'box', 'shipping', 'package', 'logistics'],
    nodeIds: { stroke: '8:103', fill: '8:219', duotone: '12:686' },
    animation: { duration: IL, loop: true, source: 'approximated', tracks: [
      drop('parcel-a', 0.0), fadeIn('parcel-a', 0.0),
      drop('parcel-b', 0.1), fadeIn('parcel-b', 0.1),
      drop('parcel-c', 0.22, -32), fadeIn('parcel-c', 0.22),
    ] },
  },
};
