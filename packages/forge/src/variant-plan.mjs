// Which derived variants each drawn icon gets, kept in one place so the whole library can be
// audited at a glance (`node src/audit.mjs`). Merged into the def by name; badges are added
// to any the def already lists.
//
//   badges      status disc: add / remove / check / close / alert
//   off         `<name>-off` with the slash in front (things that can be switched off)
//   containers  the glyph inside a circle and/or rounded square
//
// Rule of thumb: an object people collect or manage gets badges, a thing that can be
// switched off gets `off`, a bare glyph used as a button gets a container.
const OBJ = ['add', 'check', 'close'];
const FULL = ['add', 'remove', 'check', 'close', 'alert'];

export default {
  // interface
  'layout-sidebar': { mirror: { name: 'layout-sidebar-right', title: 'Sidebar Right', tags: ['layout', 'panel', 'right', 'inspector'] } },
  filter: { off: true },
  copy: { badges: ['check'] },
  edit: { off: true },
  flag: { badges: ['add', 'check', 'close'] },
  link: { off: true },
  star: { badges: ['add', 'remove', 'check'], off: true },
  // actions
  plus: { containers: ['square'] },
  minus: { containers: ['square'] },
  check: { containers: ['square'] },
  close: { containers: ['square'] },
  lightbulb: { off: true },
  print: { badges: ['check', 'close'] },
  save: { badges: ['check'] },
  pushpin: { off: true },
  // communication
  broadcast: { off: true },
  'contact-card': { badges: OBJ },
  megaphone: { off: true },
  messages: { badges: ['add', 'check'] },
  message: { off: true },
  'video-call': { off: true },
  // commerce
  bag: { badges: ['close', 'remove'] },
  package: { badges: OBJ },
  receipt: { badges: ['add', 'check', 'close'] },
  store: { badges: OBJ },
  tag: { badges: OBJ },
  truck: { badges: ['check', 'close'] },
  gift: { badges: ['add', 'check'] },
  // data
  table: { badges: OBJ },
  // development
  terminal: { badges: ['check', 'close', 'alert'] },
  bug: { off: true, badges: ['check'] },
  flask: { badges: ['check', 'close'] },
  puzzle: { badges: OBJ },
  'package-code': { badges: ['add', 'check'] },
  // devices
  laptop: { badges: ['check', 'close'], off: true },
  tablet: { badges: ['check', 'close'], off: true },
  'server-rack': { badges: ['check', 'close', 'alert'] },
  'hard-drive': { badges: ['check', 'alert'] },
  bluetooth: { off: true },
  router: { off: true },
  // files
  archive: { badges: ['add', 'check'] },
  files: { badges: ['close'] },
  // finance
  'piggy-bank': { badges: ['add', 'remove'] },
  // media
  camera: { off: true },
  headphones: { off: true },
  music: { off: true, badges: ['add', 'check'] },
  pause: { containers: ['circle'] },
  playlist: { badges: ['add', 'check'] },
  // navigation
  pin: { off: true, badges: ['close', 'alert'] },
  layers: { badges: ['add', 'check'] },
  navigation: { off: true },
  // people
  'user-group': { badges: ['add', 'check'] },
  'id-badge': { badges: ['check'] },
  // security
  key: { badges: ['add', 'check'] },
  fingerprint: { badges: ['check', 'close'], off: true },
  // emoji
  'face-smile': { badges: ['add'] },
  // time
  alarm: { off: true, badges: ['add', 'check'] },
  timer: { off: true },
  history: { mirror: { name: 'time-forward', title: 'Time Forward', tags: ['future', 'forward', 'later', 'fast forward time'] } },
  // devices (batch 8)
  webcam: { off: true },
  monitor: { badges: ['check', 'close'], off: true },
  tv: { off: true },
  'usb-drive': { badges: ['check', 'close'] },
  // people / security (batch 17)
  // interface (batch 15)
  'layout-top': { mirror: { name: 'layout-bottom', title: 'Footer Layout', tags: ['layout', 'footer', 'bottom bar', 'page'], axis: 'y' } },
  // travel / transport (batch 11)
  airplane: { off: true, badges: ['check'] },
  luggage: { badges: ['check', 'close'] },
  // actions / design / text / business (batch 10)
  type: { off: true },
  briefcase: { badges: ['add', 'check'] },
  'qr-code': { badges: ['check'] },
  // finance / data / navigation (batch 9)
  'credit-card': { off: true, badges: ['add', 'check', 'close'] },
  banknote: { off: true },
  'money-bag': { badges: ['add'] },
  // development (batch 8)
  'git-branch': { badges: ['add'] },
  // household and devices that can be switched off (batch 96)
  'desk-lamp': { off: true },
  flashlight: { off: true },
  doorbell: { off: true },
  speaker: { off: true },
  sprinkler: { off: true },
  'ring-light': { off: true },
  // review and office (batch 97)
  resume: { badges: ['add', 'check'] },
  // batch 98
  'git-merge': { badges: ['alert'] },
  'split-bill': { badges: ['check'] },
  // batch 99
  'load-balancer': { badges: ['check', 'alert'] },
  // batch 100
  flashcards: { badges: ['add', 'check'] },
  'cold-chain': { badges: ['alert'] },
  antivirus: { badges: ['check', 'alert'] },
  'drone-delivery': { badges: ['check'] },
  // batch 101
  'network-switch': { badges: ['check', 'alert'] },
  // batch 103: status variants on existing objects
  coupon: { badges: ['add', 'check'] },
  'sticky-note': { badges: ['add', 'check'] },
  report: { badges: ['check', 'alert'] },
  ticket: { badges: ['add', 'close'] },
  keyboard: { off: true },
  mouse: { off: true },
  radio: { off: true },
  globe: { off: true },
  plug: { off: true },
  cpu: { badges: ['alert'] },
  coins: { badges: ['add'] },
  wallet: { badges: ['close'] },
  kanban: { badges: ['check'] },
  contract: { badges: ['add'] },
  invoice: { badges: ['add'] },
  podcast: { off: true, badges: ['add', 'check'] },
  // batch 104: off and status variants
  'projector': { off: true },
  'headset': { off: true },
  'smart-speaker': { off: true },
  'dashcam': { off: true },
  'robot-vacuum': { off: true },
  'cooling-fan': { off: true },
  'floor-lamp': { off: true },
  'pendant-lamp': { off: true },
  'stove': { off: true },
  'microwave': { off: true },
  'kettle': { off: true },
  'air-purifier': { off: true },
  'cast': { off: true },
  'subtitles': { off: true },
  firewall: { badges: ['check', 'alert'] },
  'smart-lock': { badges: ['check', 'alert'] },
  'file-zip': { badges: ['check'] },
  scanner: { badges: ['check'] },
  'power-bank': { badges: ['alert'] },
  toaster: { off: true },
  'washing-machine': { off: true },
  'range-hood': { off: true },
  'air-fryer': { off: true },
  // batch 105
  'desk-fan': { off: true },
  'light-switch': { off: true },
  'extension-cord': { off: true },
  'heat-pump': { off: true },
  'synthesizer': { off: true },
  'boombox': { off: true },
  'turntable': { off: true },
  'file-image': { badges: ['check'] },
  'file-code': { badges: ['check'] },
  'file-spreadsheet': { badges: ['check'] },
  'file-presentation': { badges: ['check'] },
  'folder-image': { badges: ['check'] },
  'cash-register': { badges: ['check'] },
  'pos-terminal': { badges: ['check'] },
  'shopping-list': { badges: ['check'] },
  'boarding-pass': { badges: ['check'] },
  'passport': { badges: ['check'] },
  'luggage-cart': { badges: ['check'] },
  // batch 118
  'certificate': { badges: ['check'] },
  // batch 114
  'remote-control': { off: true },
  'bed': { badges: ['check', 'close'] },
  'apartment': { badges: ['add', 'check'] },
  'warehouse': { badges: ['check'] },
  'sim-card': { badges: ['check', 'alert'] },
  'receipt-printer': { badges: ['alert'] },
  'hospital': { badges: ['check'] },
  // batch 113
  'vending-machine': { off: true },
  'parking': { off: true },
  'contact-book': { badges: ['add'] },
  'hospital-bed': { badges: ['check'] },
  'lungs': { badges: ['alert'] },
  'virus': { badges: ['alert'] },
  'thermometer': { badges: ['alert'] },
  'smoke-detector': { badges: ['alert'] },
  'cctv': { badges: ['check'] },
  'motion-sensor': { badges: ['alert'] },
  // batch 112
  'postcard': { badges: ['add'] },
  'cheque': { badges: ['check', 'close'] },
  'donate': { badges: ['check'] },
  'graduation-cap': { badges: ['check'] },
  'blister-pack': { badges: ['check'] },
  'bank': { badges: ['check'] },
  'xray': { badges: ['check'] },
  // batch 111
  'notepad': { badges: ['add'] },
  'secure-chat': { badges: ['check'] },
  'parcel-tracking': { badges: ['check'] },
  'parcel-return': { badges: ['check'] },
  'timesheet': { badges: ['check'] },
  'code-comment': { badges: ['check'] },
  'wireframe': { badges: ['check'] },
  'news-feed': { badges: ['add'] },
  'comment-thread': { badges: ['add'] },
  // batch 110
  'siren': { off: true },
  'text-to-speech': { off: true },
  'audio-description': { off: true },
  'git-pull-request': { badges: ['check', 'close'] },
  'pipeline': { badges: ['check', 'close', 'alert'] },
  'webhook': { badges: ['alert'] },
  'cloud-code': { badges: ['check'] },
  'poll': { badges: ['add', 'check'] },
  'sticker': { badges: ['add'] },
  'story': { badges: ['add'] },
  'scan': { badges: ['check'] },
  'share-arrow': { badges: ['check'] },
  'clipboard-paste': { badges: ['check'] },
  'ev-charger': { badges: ['check', 'alert'] },
  'solar-panel': { badges: ['alert'] },
  'energy-meter': { badges: ['alert'] },
  'kpi': { badges: ['alert'] },
  // batch 109
  'watch-smart': { off: true },
  'e-reader': { off: true },
  'flip-phone': { off: true },
  'inbox': { badges: ['add'] },
  'calendar-week': { badges: ['add', 'check'] },
  // batch 108
  'atm': { off: true },
  'hot-tub': { off: true },
  'album': { badges: ['add', 'check'] },
  'video-lesson': { badges: ['check'] },
  'sheet-music': { badges: ['add'] },
  'mailbox': { badges: ['check'] },
  'letter': { badges: ['check'] },
  'outbox': { badges: ['alert'] },
  'mortgage': { badges: ['check'] },
  'tip-jar': { badges: ['add'] },
  'coin-purse': { badges: ['add'] },
  'credit-score': { badges: ['check'] },
  'tent': { badges: ['check'] },
  'camper-van': { badges: ['check'] },
  'garage': { badges: ['check'] },
  'factory': { badges: ['alert'] },
  'first-aid': { badges: ['add'] },
  'tooth': { badges: ['check'] },
  'dna': { badges: ['check'] },
  'taxi': { badges: ['check'] },
  'car-key': { badges: ['check'] },
  // batch 107
  'mic-studio': { off: true },
  'livestream': { off: true },
  'screen-record': { off: true },
  'vacuum': { off: true },
  'iron': { off: true },
  'rice-cooker': { off: true },
  'fridge': { off: true },
  'shower': { off: true },
  'headlight': { off: true },
  'fire-extinguisher': { badges: ['check'] },
  'fuse-box': { badges: ['alert'] },
  'storage-box': { badges: ['add', 'check'] },
  'password': { badges: ['check'] },
  'passkey': { badges: ['check'] },
  'safe': { badges: ['alert'] },
  'face-scan': { badges: ['check', 'close'] },
  'qr-scan': { badges: ['check'] },
  'fuel': { badges: ['alert'] },
  'car-battery': { badges: ['alert'] },
  'license-plate': { badges: ['check'] },
  'syringe': { badges: ['check'] },
  'pill-bottle': { badges: ['add'] },
  'blood-pressure': { badges: ['alert'] },
  'heart-monitor': { badges: ['alert'] },
  'backpack': { badges: ['check'] },
  // batch 106
  'tv-retro': { off: true },
  'doorbell-camera': { off: true },
  'trackpad': { off: true },
  'computer-tower': { off: true },
  'dual-monitor': { off: true },
  'intercom': { off: true },
  'satellite-dish': { off: true },
  'walkie-talkie': { off: true },
  'gift-card': { badges: ['add', 'check'] },
  'loyalty-card': { badges: ['add'] },
  'product-return': { badges: ['check'] },
  'key-card': { badges: ['check'] },
  'medical-chart': { badges: ['add'] },
  'tax': { badges: ['check'] },
  'ledger': { badges: ['add'] },
  'report-card': { badges: ['check'] },
  'newsletter': { badges: ['add', 'check'] },
  'vault': { badges: ['alert'] },
  'nas': { badges: ['alert'] },
  'memory': { badges: ['alert'] },
  'ssd': { badges: ['alert'] },
  'graphics-card': { badges: ['alert'] },
  'parcel-locker': { badges: ['check'] },
  'shipping-label': { badges: ['check'] },
  'shipping-container': { badges: ['check'] },
  'books': { badges: ['add'] },
  'diploma': { badges: ['check'] },
  // batch 132: containers for math and currency glyphs
  'equals': { containers: ['circle', 'square'] },
  'not-equal': { containers: ['circle', 'square'] },
  'plus-minus': { containers: ['circle', 'square'] },
  'asterisk': { containers: ['circle', 'square'] },
  'approximately': { containers: ['circle', 'square'] },
  'less-equal': { containers: ['circle', 'square'] },
  'greater-equal': { containers: ['circle', 'square'] },
  'pi': { containers: ['circle', 'square'] },
  'sigma': { containers: ['circle', 'square'] },
  'percent': { containers: ['square'] },
  'euro-sign': { containers: ['square'] },
  'pound-sign': { containers: ['square'] },
  'yen-sign': { containers: ['square'] },
  'rupee-sign': { containers: ['square'] },
  'ruble-sign': { containers: ['square'] },
  'naira-sign': { containers: ['square'] },
  'franc-sign': { containers: ['square'] },
  'peso-sign': { containers: ['square'] },
  'cent-sign': { containers: ['square'] },
  // batch 134: containers for greek letters
  'alpha': { containers: ['circle', 'square'] },
  'mu': { containers: ['circle', 'square'] },
  'psi': { containers: ['circle', 'square'] },
  'lambda': { containers: ['circle', 'square'] },
  'omega': { containers: ['circle', 'square'] },
  'epsilon': { containers: ['circle', 'square'] },
  // batch 134: zodiac squares
  'aries': { containers: ['square'] },
  'taurus': { containers: ['square'] },
  'gemini': { containers: ['square'] },
  'leo': { containers: ['square'] },
  'libra': { containers: ['square'] },
  'sagittarius': { containers: ['square'] },
  'pisces': { containers: ['square'] },
  'scorpio': { containers: ['square'] },
  'virgo': { containers: ['square'] },
  // batch 138: switch-off variants
  'cloud': { off: true },
  'vibrate': { off: true },
  'oven': { off: true },
  'smartphone': { off: true },
  'blender': { off: true },
  'hairdryer': { off: true },
  'fire': { off: true },
  'eye-scan': { off: true },
  'pill': { badges: ['add', 'check'] },
  'route': { badges: ['add', 'check'] },
  'dashboard': { badges: ['add'] },
  'chart-bar': { badges: ['add'] },
  'cell-tower': { off: true },
  'traffic-light': { off: true },
  'hearing-aid': { off: true },
  'metronome': { off: true },
  'newspaper': { badges: ['add', 'check'] },
  'audiobook': { badges: ['add', 'check'] },
  'images': { badges: ['add', 'check'] },
  'freezer': { off: true },
  'hard-hat': { badges: ['check', 'alert'] },
  'curve-ahead': { mirror: { name: 'curve-ahead-left', title: 'Curve Ahead Left' } },
  'side-road': { mirror: { name: 'side-road-left', title: 'Side Road Left' } },
  'hairpin-curve': { mirror: { name: 'hairpin-curve-left', title: 'Hairpin Curve Left' } },
  'lane-ends': { mirror: { name: 'lane-ends-left', title: 'Lane Ends Left' } },
  'steep-grade': { mirror: { name: 'steep-descent', title: 'Steep Descent' } },
  'layout-drawer': { mirror: { name: 'layout-drawer-left', title: 'Left Drawer' } },
  'layout-two-thirds': { mirror: { name: 'layout-two-thirds-left', title: 'Two Thirds Left' } },
  'layout-header-sidebar': { mirror: { name: 'layout-header-sidebar-right', title: 'Header and Right Sidebar' } },
  'cursor': { badges: ['add', 'close', 'check', 'remove', 'alert'] },
  'form': { badges: ['add', 'check', 'close', 'alert'] },
  'layout-timeline': { mirror: { name: 'layout-timeline-right', title: 'Timeline Right' } },
  'layout-header-split': { mirror: { name: 'layout-footer-split', title: 'Footer and Split', axis: 'y' } },
  'presentation': { badges: ['add', 'check'] },
  'meeting': { badges: ['add', 'check'] },
  'student': { badges: ['add', 'check'] },
  'planner': { badges: ['add', 'check'] },
  'signature': { badges: ['check'] },
  'stamp': { badges: ['check'] },
  'milestone': { badges: ['check'] },
  'roadmap': { badges: ['check'] },
  'vote': { badges: ['check'] },
  'chart-pie': { badges: ['add'] },
  'chart-line': { badges: ['add'] },
  'film': { badges: ['add', 'check'] },
  'teacher': { badges: ['add', 'check'] },
  'family': { badges: ['add', 'check'] },
  'workflow': { badges: ['check'] },
  'git-commit': { badges: ['check'] },
  'boxes': { badges: ['check'] },
  'pallet': { badges: ['check'] },
  'discount': { badges: ['check'] },
  'binder': { badges: ['add', 'check'] },
  'calendar-days': { badges: ['add', 'check'] },
  'calendar-range': { badges: ['add'] },
  'clapperboard': { badges: ['check'] },
  'send': { badges: ['check'] },
  'fax': { badges: ['check'] },
  'voicemail': { badges: ['check'] },
  'desk': { badges: ['add', 'check'] },
  'whiteboard': { badges: ['add'] },
  'bulletin-board': { badges: ['add'] },
  'time-clock': { badges: ['check', 'alert'] },
  'card-swipe': { badges: ['check', 'close'] },
  'loan': { badges: ['check', 'alert'] },
  'investment': { badges: ['add', 'check'] },
  'hand-coins': { badges: ['check'] },
  'send-money': { badges: ['check'] },
  'shelves': { badges: ['add'] },
  'shipping-crate': { badges: ['check', 'alert'] },
  'barcode': { badges: ['check', 'close'] },
  'book-stack': { badges: ['add'] },
  'index-card': { badges: ['add'] },
  'test-strip': { badges: ['check', 'alert'] },
  'arrow-curve-right': { dir: 'right', turns: { left: 180, up: -90, down: 90 } },
  'abacus': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'accordion': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'acorn': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'add-circle': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'ai-agent': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'ai-airplane': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'ai-bag': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'ai-book': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'ai-briefcase': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'ai-browser': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'ai-bug': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'ai-building': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'ai-calculator': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'ai-car': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'ai-cart': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'ai-chart': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'ai-clipboard': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'ai-code': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'ai-contract': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'ai-cube': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'ai-dashboard': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'ai-database': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'ai-document': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'ai-fine-tune': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'ai-flask': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'ai-folder': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'ai-form': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'ai-gift': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'ai-graduation': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'ai-graph': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'ai-home': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'ai-id': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'ai-idea': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'ai-image': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'ai-inbox': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'ai-laptop': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'ai-mail': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'ai-map': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'ai-model': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'ai-news': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'ai-notes': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'ai-package': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'ai-palette': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'ai-pen': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'ai-phone': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'ai-plant': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'ai-presentation': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'ai-receipt': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'ai-scan': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'ai-server': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'ai-sheet': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'ai-summary': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'ai-support': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'ai-target': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'ai-terminal': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'ai-translate': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'ai-video': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'ai-vision': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'ai-voice': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'ai-wallet': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'ai-write': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'air-conditioner': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'airplane-landing': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'airplane-takeoff': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'airship': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'alarm-snooze': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'align-object-left': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'ambulance': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'anchor': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'anchor-point': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'angle': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'ant': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'antenna': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'anvil': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'aperture': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'api': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'apple': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'apron': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'arcade': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'arch': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'area': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'armchair': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'aspect-ratio': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'asteroid': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'astronaut': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'at-sign': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'atlas': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'atom': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'atv': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'automation': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'avatar-group': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'avocado': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'awareness-ribbon': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'axe': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'baby': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'baby-bottle': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'baby-monitor': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'bacon': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'bacteria': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'bagel': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'baggage-claim': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'baguette': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'balloon': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'bamboo': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'banana': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'bandage': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'banknotes': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'bao': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'bar-stool': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'barbell': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'barber-pole': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'barcode-scanner': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'barn': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'baseball': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'baseball-bat': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'basketball': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'basketball-hoop': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'bass-clef': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'bat': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'bathroom-scale': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'bathtub': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'battery': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'battery-aa': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'bauble': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'bbq-grill': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'beach-ball': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'beach-umbrella': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'beaker': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'beanie': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'bedtime': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'bee': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'beehive': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'beer-mug': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'bell-pepper': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'belt': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'bench': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'bento': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'beta': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'bezier-curve': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'bib': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'bicycle': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'bike-helmet': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'bike-rack': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'billboard': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'binary': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'binary-tree': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'binder-clip': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'binoculars': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'biofuel': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'bird': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'bird-bath': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'bird-feeder': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'birdcage': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'birdhouse': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'blend': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'blood-bag': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'blood-drop': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'blueprint': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'bolt': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'bomb': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'bone': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'bongo': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'bonsai': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'book-open': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'bookend': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'bookshelf': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'boomerang': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'boot': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'bottle': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'bottle-cap': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'bottle-opener': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'bow-arrow': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'bow-tie': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'bowl': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'bowling': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'box-plot': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'boxing-glove': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'boxing-ring': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'braces': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'brackets': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'brain': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'branch': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'bread': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'breadboard': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'breadcrumb': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'breakpoint': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'brick-wall': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'bricks': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'bridge': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'bring-to-front': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'broccoli': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'broom': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'brush': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'bubble-tea': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'bubble-wrap': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'bucket': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'bucket-hat': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'bucket-spade': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'building': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'bull': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'bulldozer': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'bunk-bed': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'bunsen-burner': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'bunting': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'buoy': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'burger': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'bus': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'bus-shelter': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'bus-stop': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'butter': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'butterfly': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'button': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'c-clamp': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'cable': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'cable-car': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'cactus': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'cairn': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'cake': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'cake-slice': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'calculator': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'calendar-note': { badges: ['close', 'remove', 'alert'] }, // vb
  'calendar-repeat': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'campfire': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'camping-stove': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'candelabra': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'candle': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'candle-holder': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'candy': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'candy-cane': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'cannon': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'cap': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'capacitor': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'captain-hat': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'car': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'car-door': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'car-seat': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'car-wash': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'carabiner': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'caravan': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'carousel': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'carrot': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'cashback': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'cassette': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'castle': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'cat': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'caterpillar': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'cauldron': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'caution-tape': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'cave': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'ceiling-fan': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'cell': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'cement-bag': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'cement-mixer': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'center-object': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'chair': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'chalkboard': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'champagne': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'chandelier': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'chapel': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'chart-area': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'chart-area-stacked': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'chart-bar-horizontal': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'chart-bubble': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'chart-candles': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'chart-coin': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'chart-decline': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'chart-dumbbell': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'chart-forecast': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'chart-gantt': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'chart-grouped': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'chart-growth': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'chart-histogram': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'chart-line-multi': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'chart-lollipop': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'chart-mixed': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'chart-points': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'chart-polar': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'chart-pyramid': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'chart-radar': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'chart-range': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'chart-sankey': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'chart-scatter': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'chart-slope': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'chart-spline': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'chart-stacked': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'chart-step': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'chart-sunburst': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'chart-treemap': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'chart-waterfall': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'check-circle': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'checkbox': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'cheers': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'cheese': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'chef-hat': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'cherries': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'cherry': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'chess-bishop': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'chess-king': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'chess-knight': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'chess-pawn': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'chess-queen': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'chess-rook': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'chili': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'chip': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'chisel': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'chocolate-bar': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'chopsticks': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'christmas-tree': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'church': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'cigarette': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'circle-dashed': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'circuit-board': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'circus-tent': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'citrus': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'city': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'claw-machine': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'clipboard-list': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'cloche': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'clock-fast': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'clock-tower': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'close-circle': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'clothes-rack': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'clothesline': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'clothespin': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'cloud-sync': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'clover': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'coal': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'coat-hook': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'coat-rack': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'cocktail': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'cocoon': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'code': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'code-window': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'coffee': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'coffee-bean': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'coffee-grinder': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'coffee-machine': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'coffee-to-go': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'coffin': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'colander': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'color-input': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'color-picker': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'columns': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'comb': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'command': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'command-palette': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'compass-rose': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'compost': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'compost-bin': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'confetti': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'constellation': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'contact-lens': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'container-ship': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'context-menu': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'convertible': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'conveyor': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'conveyor-belt': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'cookie': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'cookie-jar': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'cooking-pot': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'cooling-tower': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'coral': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'corkscrew': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'corn': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'corner-radius': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'corrosive': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'cottage': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'cow': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'cowboy-hat': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'crab': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'cradle': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'crane': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'crane-hook': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'crayon': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'crib': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'crib-mobile': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'cricket-bat': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'croissant': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'crop': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'crossroads': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'crown': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'crutch': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'crystal': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'crystal-ball': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'cupcake': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'curling-stone': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'cursor-click': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'cursor-col-resize': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'cursor-zoom': { badges: ['check', 'remove', 'alert'] }, // vb
  'curtains': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'cutting-board': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'dagger': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'dam': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'dandelion': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'dart': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'dashboard-gauge': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'dead-end': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'deep-fryer': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'deep-water': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'defibrillator': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'desert': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'desk-globe': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'desk-phone': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'diamond': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'dice': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'dice-d20': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'diff': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'dining-table': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'diode': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'directions-sign': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'disc': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'disco-ball': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'dish-rack': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'dishwasher': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'distance': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'distribute-horizontal': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'divide': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'diving-mask': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'diya': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'djembe': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'dock': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'dog': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'dog-bowl': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'doghouse': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'dollar-circle': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'dollar-sign': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'domino': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'donut': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'door': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'download': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'drafting-compass': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'drag-drop': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'dragonfly': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'drawing-compass': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'dreamcatcher': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'dress': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'dresser': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'drill': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'drone': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'dropdown': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'dropdown-menu': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'drum': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'drumstick': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'duck': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'dumbbell': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'dumpling': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'dustpan': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'earbuds': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'earring': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'earthquake': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'easel': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'easter-egg': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'egg-cracked': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'egg-fried': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'eggplant': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'eject': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'elderly': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'element-of': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'environment-hazard': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'equalizer': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'eraser': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'escalator': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'ethernet': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'euro-circle': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'excavator': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'exchange': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'exclude': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'exists': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'explosive': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'external-link': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'eye-chart': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'eye-drops': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'face-cream': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'face-mask': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'fast-forward': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'faucet': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'feather': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'fence': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'fern': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'ferris-wheel': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'ferry': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'file-audio': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'file-chart': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'file-diff': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'file-dollar': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'file-font': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'file-input': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'file-json': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'file-link': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'file-log': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'file-pen': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'file-signature': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'file-sync': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'file-terminal': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'file-video': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'filing-cabinet': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'fill-stroke': { badges: ['add', 'close', 'remove', 'alert'] }, // vb
  'film-reel': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'film-roll': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'film-strip': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'fire-hydrant': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'firecracker': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'fireplace': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'fireworks': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'fish': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'fish-hook': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'fishbowl': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'fishing-boat': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'fishing-float': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'fishing-rod': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'fitness-tracker': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'flammable': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'flat-sign': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'flip-flops': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'flip-horizontal': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'flipchart': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'flood': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'flood-zone': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'flower': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'folder-chart': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'folder-code': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'folder-dollar': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'folder-globe': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'folder-link': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'folder-mail': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'folder-open': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'folder-sync': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'folder-terminal': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'folder-tree': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'folder-video': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'food-processor': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'football-helmet': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'for-all': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'forest': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'forklift': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'fossil': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'fountain': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'fountain-pen': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'fox': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'fragile': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'frame': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'french-press': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'fries': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'frisbee': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'frog': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'frying-pan': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'fuel-gauge': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'function': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'funicular': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'funnel-chart': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'fuse': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'galaxy': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'game-cartridge': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'gamepad': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'garlic': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'gas-cylinder': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'gas-flame': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'gate': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'gavel': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'gazebo': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'gear-shift': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'gender-female': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'gender-male': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'gender-neutral': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'generator': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'geofence': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'gift-bow': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'gingerbread': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'git-compare': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'git-fork': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'glass-water': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'glasses': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'glove': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'glucose-meter': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'glue': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'glue-gun': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'glue-stick': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'go-kart': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'goal-net': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'goblet': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'goggles': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'gold-bars': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'gold-pan': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'golf': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'golf-cart': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'golf-tee': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'gong': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'grade': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'graduated-cylinder': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'grapes': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'grass': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'grater': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'gravy-boat': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'greek-column': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'green-energy': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'greenhouse': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'grid-dots': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'grip-vertical': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'group-objects': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'guitar': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'gumball-machine': { badges: ['add', 'check', 'close'] }, // vb
  'gym-bag': { badges: ['add', 'check', 'close'] }, // vb
  'gym-rings': { badges: ['add', 'check', 'close'] }, // vb
  'hammer': { badges: ['add', 'check', 'close'] }, // vb
  'hammock': { badges: ['add', 'check', 'close'] }, // vb
  'hand-blender': { badges: ['add', 'check', 'close'] }, // vb
  'hand-grab': { badges: ['add', 'check', 'close'] }, // vb
  'hand-mixer': { badges: ['add', 'check', 'close'] }, // vb
  'hand-raised': { badges: ['add', 'check', 'close'] }, // vb
  'hand-wave': { badges: ['add', 'check', 'close'] }, // vb
  'handbag': { badges: ['add', 'check', 'close'] }, // vb
  'handheld-console': { badges: ['add', 'close'] }, // vb
  'hang-glider': { badges: ['add', 'check', 'close'] }, // vb
  'hanger': { badges: ['add', 'check', 'close'] }, // vb
  'harmonica': { badges: ['add', 'check', 'close'] }, // vb
  'harp': { badges: ['add', 'check', 'close'] }, // vb
  'hay-bale': { badges: ['add', 'check', 'close'] }, // vb
  'hdmi-cable': { badges: ['add', 'check', 'close'] }, // vb
  'health-hazard': { badges: ['add', 'check', 'close'] }, // vb
  'heatmap': { badges: ['add', 'check', 'close'] }, // vb
  'hedgehog': { badges: ['add', 'check', 'close'] }, // vb
  'helicopter': { badges: ['add', 'check', 'close'] }, // vb
  'help': { badges: ['add', 'check', 'close'] }, // vb
  'herb': { badges: ['add', 'check', 'close'] }, // vb
  'high-chair': { badges: ['add', 'check', 'close'] }, // vb
  'high-heel': { badges: ['add', 'check', 'close'] }, // vb
  'high-voltage': { badges: ['add', 'check', 'close'] }, // vb
  'hiking-boot': { badges: ['add', 'check', 'close'] }, // vb
  'hills': { badges: ['add', 'check', 'close'] }, // vb
  'hinge': { badges: ['add', 'check', 'close'] }, // vb
  'hockey-puck': { badges: ['add', 'check', 'close'] }, // vb
  'hockey-stick': { badges: ['add', 'check', 'close'] }, // vb
  'home-smart': { badges: ['add', 'check', 'close'] }, // vb
  'honey-dipper': { badges: ['add', 'check', 'close'] }, // vb
  'honey-jar': { badges: ['add', 'check', 'close'] }, // vb
  'honeycomb': { badges: ['add', 'check', 'close'] }, // vb
  'hoodie': { badges: ['add', 'check', 'close'] }, // vb
  'horseshoe': { badges: ['add', 'check', 'close'] }, // vb
  'hospital-ahead': { badges: ['add', 'check', 'close'] }, // vb
  'hot-air-balloon': { badges: ['add', 'check', 'close'] }, // vb
  'hot-chocolate': { badges: ['add', 'check', 'close'] }, // vb
  'hot-sauce': { badges: ['add', 'check', 'close'] }, // vb
  'hot-spring': { badges: ['add', 'check', 'close'] }, // vb
  'hot-surface': { badges: ['add', 'check', 'close'] }, // vb
  'hot-water-bottle': { badges: ['add', 'check', 'close'] }, // vb
  'hotdog': { badges: ['add', 'check', 'close'] }, // vb
  'hourglass': { badges: ['add', 'check', 'close'] }, // vb
  'hurdle': { badges: ['add', 'check', 'close'] }, // vb
  'hut': { badges: ['add', 'check', 'close'] }, // vb
  'hydro-power': { badges: ['add', 'check', 'close'] }, // vb
  'i-beam': { badges: ['add', 'check', 'close'] }, // vb
  'ice-axe': { badges: ['add', 'check', 'close'] }, // vb
  'ice-cream': { badges: ['add', 'check', 'close'] }, // vb
  'ice-cube': { badges: ['add', 'check', 'close'] }, // vb
  'ice-pack': { badges: ['add', 'check', 'close'] }, // vb
  'ice-skate': { badges: ['add', 'check', 'close'] }, // vb
  'ice-tray': { badges: ['add', 'check', 'close'] }, // vb
  'iceberg': { badges: ['add', 'check', 'close'] }, // vb
  'igloo': { badges: ['add', 'check', 'close'] }, // vb
  'incognito': { badges: ['add', 'check', 'close'] }, // vb
  'infinity': { badges: ['add', 'check', 'close'] }, // vb
  'info': { badges: ['add', 'check', 'close'] }, // vb
  'inhaler': { badges: ['add', 'check', 'close'] }, // vb
  'inkwell': { badges: ['add', 'check', 'close'] }, // vb
  'integral': { badges: ['add', 'check', 'close'] }, // vb
  'interest-rate': { badges: ['add', 'check', 'close'] }, // vb
  'intersect': { badges: ['add', 'check', 'close'] }, // vb
  'ironing-board': { badges: ['add', 'check', 'close'] }, // vb
  'island': { badges: ['add', 'check', 'close'] }, // vb
  'iv-drip': { badges: ['add', 'check', 'close'] }, // vb
  'jack-in-box': { badges: ['add', 'check', 'close'] }, // vb
  'jack-o-lantern': { badges: ['add', 'check', 'close'] }, // vb
  'jacket': { badges: ['add', 'check', 'close'] }, // vb
  'jackhammer': { badges: ['add', 'check', 'close'] }, // vb
  'jam-jar': { badges: ['add', 'check', 'close'] }, // vb
  'jellyfish': { badges: ['add', 'check', 'close'] }, // vb
  'jerrycan': { badges: ['add', 'check', 'close'] }, // vb
  'jet-ski': { badges: ['add', 'check', 'close'] }, // vb
  'joystick': { badges: ['add', 'check', 'close'] }, // vb
  'juice-box': { badges: ['add', 'check', 'close'] }, // vb
  'juicer': { badges: ['add', 'check', 'close'] }, // vb
  'jump-rope': { badges: ['add', 'check', 'close'] }, // vb
  'kayak': { badges: ['add', 'check', 'close'] }, // vb
  'kayak-paddle': { badges: ['add', 'check', 'close'] }, // vb
  'kebab': { badges: ['add', 'check', 'close'] }, // vb
  'keep-dry': { badges: ['add', 'check', 'close'] }, // vb
  'kelp': { badges: ['add', 'check', 'close'] }, // vb
  'kettlebell': { badges: ['add', 'check', 'close'] }, // vb
  'key-capslock': { badges: ['add', 'check', 'close'] }, // vb
  'key-option': { badges: ['add', 'check', 'close'] }, // vb
  'key-ring': { badges: ['add', 'check', 'close'] }, // vb
  'key-space': { badges: ['add', 'check', 'close'] }, // vb
  'keyhole': { badges: ['add', 'check', 'close'] }, // vb
  'keypad': { badges: ['add', 'check', 'close'] }, // vb
  'kick-scooter': { badges: ['add', 'check', 'close'] }, // vb
  'kidney': { badges: ['add', 'check', 'close'] }, // vb
  'kitchen-scale': { badges: ['add', 'check', 'close'] }, // vb
  'kite': { badges: ['add', 'check', 'close'] }, // vb
  'kiwi': { badges: ['add', 'check', 'close'] }, // vb
  'knife': { badges: ['add', 'check', 'close'] }, // vb
  'knight-helmet': { badges: ['add', 'check', 'close'] }, // vb
  'knob': { badges: ['add', 'check', 'close'] }, // vb
  'lab-coat': { badges: ['add', 'check', 'close'] }, // vb
  'label-maker': { badges: ['add', 'check', 'close'] }, // vb
  'ladder': { badges: ['add', 'check', 'close'] }, // vb
  'ladle': { badges: ['add', 'check', 'close'] }, // vb
  'ladybug': { badges: ['add', 'check', 'close'] }, // vb
  'lamp': { badges: ['add', 'check', 'close'] }, // vb
  'lamp-post': { badges: ['add', 'check', 'close'] }, // vb
  'lantern': { badges: ['add', 'check', 'close'] }, // vb
  'lanyard': { badges: ['add', 'check', 'close'] }, // vb
  'laser-hazard': { badges: ['add', 'check', 'close'] }, // vb
  'lasso': { badges: ['add', 'check', 'close'] }, // vb
  'laundry-basket': { badges: ['add', 'check', 'close'] }, // vb
  'laundry-detergent': { badges: ['add', 'check', 'close'] }, // vb
  'lavender': { badges: ['add', 'check', 'close'] }, // vb
  'lawn-mower': { badges: ['add', 'check', 'close'] }, // vb
  'layout-cards': { badges: ['add', 'check', 'close'] }, // vb
  'layout-carousel': { badges: ['add', 'check', 'close'] }, // vb
  'layout-centered': { badges: ['add', 'check', 'close'] }, // vb
  'layout-columns-3': { badges: ['add', 'check', 'close'] }, // vb
  'layout-feed': { badges: ['add', 'check', 'close'] }, // vb
  'layout-gallery': { badges: ['add', 'check', 'close'] }, // vb
  'layout-hero': { badges: ['add', 'check', 'close'] }, // vb
  'layout-rows-2': { badges: ['add', 'check', 'close'] }, // vb
  'layout-rows-3': { badges: ['add', 'check', 'close'] }, // vb
  'leaf': { badges: ['add', 'check', 'close'] }, // vb
  'lectern': { badges: ['add', 'check', 'close'] }, // vb
  'led': { badges: ['add', 'check', 'close'] }, // vb
  'lemon': { badges: ['add', 'check', 'close'] }, // vb
  'lens': { badges: ['add', 'check', 'close'] }, // vb
  'letter-block': { badges: ['add', 'check', 'close'] }, // vb
  'letter-tray': { badges: ['add', 'check', 'close'] }, // vb
  'level-up': { badges: ['add', 'check', 'close'] }, // vb
  'life-jacket': { badges: ['add', 'check', 'close'] }, // vb
  'life-ring': { badges: ['add', 'check', 'close'] }, // vb
  'lifeboat': { badges: ['add', 'check', 'close'] }, // vb
  'lightbulb-eco': { badges: ['add', 'check', 'close'] }, // vb
  'lighthouse': { badges: ['add', 'check', 'close'] }, // vb
  'lipstick': { badges: ['add', 'check', 'close'] }, // vb
  'list-tree': { badges: ['add', 'check', 'close'] }, // vb
  'loader': { badges: ['add', 'check', 'close'] }, // vb
  'locker': { badges: ['add', 'check', 'close'] }, // vb
  'log-cabin': { badges: ['add', 'check', 'close'] }, // vb
  'log-pile': { badges: ['add', 'check', 'close'] }, // vb
  'logic-gate': { badges: ['add', 'check', 'close'] }, // vb
  'lollipop': { badges: ['add', 'check', 'close'] }, // vb
  'lotus': { badges: ['add', 'check', 'close'] }, // vb
  'low-clearance': { badges: ['add', 'check', 'close'] }, // vb
  'lunar-lander': { badges: ['add', 'check', 'close'] }, // vb
  'lunch-tray': { badges: ['add', 'check', 'close'] }, // vb
  'magnet': { badges: ['add', 'check', 'close'] }, // vb
  'mail-forward': { badges: ['add', 'check', 'close'] }, // vb
  'makeup-brush': { badges: ['add', 'check', 'close'] }, // vb
  'mallet': { badges: ['add', 'check', 'close'] }, // vb
  'manhole': { badges: ['add', 'check', 'close'] }, // vb
  'map-marked': { badges: ['add', 'check', 'close'] }, // vb
  'maracas': { badges: ['add', 'check', 'close'] }, // vb
  'marbles': { badges: ['add', 'check', 'close'] }, // vb
  'marker': { badges: ['add', 'check', 'close'] }, // vb
  'market-stall': { badges: ['add', 'check', 'close'] }, // vb
  'mars-rover': { badges: ['add', 'check', 'close'] }, // vb
  'mason-jar': { badges: ['add', 'check', 'close'] }, // vb
  'masquerade-mask': { badges: ['add', 'check', 'close'] }, // vb
  'match': { badges: ['add', 'check', 'close'] }, // vb
  'math': { badges: ['add', 'check', 'close'] }, // vb
  'maximize': { badges: ['add', 'check', 'close'] }, // vb
  'measuring-cup': { badges: ['add', 'check', 'close'] }, // vb
  'measuring-wheel': { badges: ['add', 'check', 'close'] }, // vb
  'meat-thermometer': { badges: ['add', 'check', 'close'] }, // vb
  'medical-cross': { badges: ['add', 'check', 'close'] }, // vb
  'medicine-cup': { badges: ['add', 'check', 'close'] }, // vb
  'meeting-table': { badges: ['add', 'check', 'close'] }, // vb
  'mega-menu': { badges: ['add', 'check', 'close'] }, // vb
  'menu': { badges: ['add', 'check', 'close'] }, // vb
  'menu-right': { badges: ['add', 'check', 'close'] }, // vb
  'message-bottle': { badges: ['add', 'check', 'close'] }, // vb
  'message-dots': { badges: ['add', 'check', 'close'] }, // vb
  'message-image': { badges: ['add', 'check', 'close'] }, // vb
  'message-quote': { badges: ['add', 'check', 'close'] }, // vb
  'mic': { badges: ['add', 'check', 'close'] }, // vb
  'mic-stand': { badges: ['add', 'check', 'close'] }, // vb
  'microscope': { badges: ['add', 'check', 'close'] }, // vb
  'milk': { badges: ['add', 'check', 'close'] }, // vb
  'milk-can': { badges: ['add', 'check', 'close'] }, // vb
  'milk-carton': { badges: ['add', 'check', 'close'] }, // vb
  'minimize': { badges: ['add', 'check', 'close'] }, // vb
  'mirror': { badges: ['add', 'check', 'close'] }, // vb
  'mitten': { badges: ['add', 'check', 'close'] }, // vb
  'mixer-board': { badges: ['add', 'check', 'close'] }, // vb
  'modal': { badges: ['add', 'check', 'close'] }, // vb
  'moka-pot': { badges: ['add', 'check', 'close'] }, // vb
  'molecule': { badges: ['add', 'check', 'close'] }, // vb
  'mop': { badges: ['add', 'check', 'close'] }, // vb
  'more-horizontal': { badges: ['add', 'check', 'close'] }, // vb
  'more-vertical': { badges: ['add', 'check', 'close'] }, // vb
  'mortar-pestle': { badges: ['add', 'check', 'close'] }, // vb
  'mosque': { badges: ['add', 'check', 'close'] }, // vb
  'motorcycle': { badges: ['add', 'check', 'close'] }, // vb
  'mountain': { badges: ['add', 'check', 'close'] }, // vb
  'mouth': { badges: ['add', 'check', 'close'] }, // vb
  'mri': { badges: ['add', 'check', 'close'] }, // vb
  'mug': { badges: ['add', 'check', 'close'] }, // vb
  'multimeter': { badges: ['add', 'check', 'close'] }, // vb
  'mushroom': { badges: ['add', 'check', 'close'] }, // vb
  'music-stand': { badges: ['add', 'check', 'close'] }, // vb
  'nachos': { badges: ['add', 'check', 'close'] }, // vb
  'nail': { badges: ['add', 'check', 'close'] }, // vb
  'nail-polish': { badges: ['add', 'check', 'close'] }, // vb
  'natural-sign': { badges: ['add', 'check', 'close'] }, // vb
  'necklace': { badges: ['add', 'check', 'close'] }, // vb
  'necktie': { badges: ['add', 'check', 'close'] }, // vb
  'needle-thread': { badges: ['add', 'check', 'close'] }, // vb
  'network-graph': { badges: ['add', 'check', 'close'] }, // vb
  'neural-network': { badges: ['add', 'check', 'close'] }, // vb
  'nightstand': { badges: ['add', 'check', 'close'] }, // vb
  'no-alcohol': { badges: ['add', 'check', 'close'] }, // vb
  'no-bags': { badges: ['add', 'check', 'close'] }, // vb
  'no-ball-games': { badges: ['add', 'check', 'close'] }, // vb
  'no-caffeine': { badges: ['add', 'check', 'close'] }, // vb
  'no-camping': { badges: ['add', 'check', 'close'] }, // vb
  'no-cards': { badges: ['add', 'check', 'close'] }, // vb
  'no-cars': { badges: ['add', 'check', 'close'] }, // vb
  'no-cash': { badges: ['add', 'check', 'close'] }, // vb
  'no-cooking': { badges: ['add', 'check', 'close'] }, // vb
  'no-cycling': { badges: ['add', 'check', 'close'] }, // vb
  'no-dairy': { badges: ['add', 'check', 'close'] }, // vb
  'no-drones': { badges: ['add', 'check', 'close'] }, // vb
  'no-fires': { badges: ['add', 'check', 'close'] }, // vb
  'no-fish': { badges: ['add', 'check', 'close'] }, // vb
  'no-fishing': { badges: ['add', 'check', 'close'] }, // vb
  'no-flash': { badges: ['add', 'check', 'close'] }, // vb
  'no-food': { badges: ['add', 'check', 'close'] }, // vb
  'no-gluten': { badges: ['add', 'check', 'close'] }, // vb
  'no-headphones': { badges: ['add', 'check', 'close'] }, // vb
  'no-horn': { badges: ['add', 'check', 'close'] }, // vb
  'no-laptops': { badges: ['add', 'check', 'close'] }, // vb
  'noodles': { badges: ['add', 'check', 'close'] }, // vb
  'north-arrow': { badges: ['add', 'check', 'close'] }, // vb
  'notification-dot': { badges: ['add', 'check', 'close'] }, // vb
  'number-input': { badges: ['add', 'check', 'close'] }, // vb
  'numpad': { badges: ['add', 'check', 'close'] }, // vb
  'oar': { badges: ['add', 'check', 'close'] }, // vb
  'oars': { badges: ['add', 'check', 'close'] }, // vb
  'observatory': { badges: ['add', 'check', 'close'] }, // vb
  'octopus': { badges: ['add', 'check', 'close'] }, // vb
  'oil-barrel': { badges: ['add', 'check', 'close'] }, // vb
  'oil-can': { badges: ['add', 'check', 'close'] }, // vb
  'olive': { badges: ['add', 'check', 'close'] }, // vb
  'onigiri': { badges: ['add', 'check', 'close'] }, // vb
  'onion': { badges: ['add', 'check', 'close'] }, // vb
  'orbit': { badges: ['add', 'check', 'close'] }, // vb
  'org-chart': { badges: ['add', 'check', 'close'] }, // vb
  'ornament': { badges: ['add', 'check', 'close'] }, // vb
  'oscilloscope': { badges: ['add', 'check', 'close'] }, // vb
  'otoscope': { badges: ['add', 'check', 'close'] }, // vb
  'otp': { badges: ['add', 'check', 'close'] }, // vb
  'oven-mitt': { badges: ['add', 'check', 'close'] }, // vb
  'owl': { badges: ['add', 'check', 'close'] }, // vb
  'oxidizer': { badges: ['add', 'check', 'close'] }, // vb
  'oxygen-tank': { badges: ['add', 'check', 'close'] }, // vb
  'pacifier': { badges: ['add', 'check', 'close'] }, // vb
  'pager': { badges: ['add', 'check', 'close'] }, // vb
  'pagination': { badges: ['add', 'check', 'close'] }, // vb
  'pagoda': { badges: ['add', 'check', 'close'] }, // vb
  'paint-roller': { badges: ['add', 'check', 'close'] }, // vb
  'paint-scraper': { badges: ['add', 'check', 'close'] }, // vb
  'pallet-jack': { badges: ['add', 'check', 'close'] }, // vb
  'palm-tree': { badges: ['add', 'check', 'close'] }, // vb
  'pancakes': { badges: ['add', 'check', 'close'] }, // vb
  'paper-lantern': { badges: ['add', 'check', 'close'] }, // vb
  'paper-shredder': { badges: ['add', 'check', 'close'] }, // vb
  'paper-towel': { badges: ['add', 'check', 'close'] }, // vb
  'paperclip': { badges: ['add', 'check', 'close'] }, // vb
  'parachute': { badges: ['add', 'check', 'close'] }, // vb
  'paraglider': { badges: ['add', 'check', 'close'] }, // vb
  'parallel': { badges: ['add', 'check', 'close'] }, // vb
  'parcel-scale': { badges: ['add', 'check', 'close'] }, // vb
  'parking-ahead': { badges: ['add', 'check', 'close'] }, // vb
  'parking-meter': { badges: ['add', 'check', 'close'] }, // vb
  'party-hat': { badges: ['add', 'check', 'close'] }, // vb
  'party-popper': { badges: ['add', 'check', 'close'] }, // vb
  'paw': { badges: ['add', 'check', 'close'] }, // vb
  'peach': { badges: ['add', 'check', 'close'] }, // vb
  'peanut': { badges: ['add', 'check', 'close'] }, // vb
  'pear': { badges: ['add', 'check', 'close'] }, // vb
  'peas': { badges: ['add', 'check', 'close'] }, // vb
  'peeler': { badges: ['add', 'check', 'close'] }, // vb
  'pen-holder': { badges: ['add', 'check', 'close'] }, // vb
  'penalty-cards': { badges: ['add', 'check', 'close'] }, // vb
  'pencil-case': { badges: ['add', 'check', 'close'] }, // vb
  'pendulum': { badges: ['add', 'check', 'close'] }, // vb
  'penguin': { badges: ['add', 'check', 'close'] }, // vb
  'pennant': { badges: ['add', 'check', 'close'] }, // vb
  'percent-circle': { badges: ['add', 'check', 'close'] }, // vb
  'perfume': { badges: ['add', 'check', 'close'] }, // vb
  'periodic-table': { badges: ['add', 'check', 'close'] }, // vb
  'periscope': { badges: ['add', 'check', 'close'] }, // vb
  'perpendicular': { badges: ['add', 'check', 'close'] }, // vb
  'pet-carrier': { badges: ['add', 'check', 'close'] }, // vb
  'petri-dish': { badges: ['add', 'check', 'close'] }, // vb
  'phi': { badges: ['add', 'check', 'close'] }, // vb
  'phishing': { badges: ['add', 'check', 'close'] }, // vb
  'phone-booth': { badges: ['add', 'check', 'close'] }, // vb
  'phone-call': { badges: ['add', 'check', 'close'] }, // vb
  'phone-incoming': { badges: ['add', 'check', 'close'] }, // vb
  'piano-keys': { badges: ['add', 'check', 'close'] }, // vb
  'pickaxe': { badges: ['add', 'check', 'close'] }, // vb
  'picnic-basket': { badges: ['add', 'check', 'close'] }, // vb
  'picnic-table': { badges: ['add', 'check', 'close'] }, // vb
  'picture-frame': { badges: ['add', 'check', 'close'] }, // vb
  'picture-in-picture': { badges: ['add', 'check', 'close'] }, // vb
  'pie': { badges: ['add', 'check', 'close'] }, // vb
  'pier': { badges: ['add', 'check', 'close'] }, // vb
  'pig': { badges: ['add', 'check', 'close'] }, // vb
  'pillow': { badges: ['add', 'check', 'close'] }, // vb
  'pine-cone': { badges: ['add', 'check', 'close'] }, // vb
  'pine-tree': { badges: ['add', 'check', 'close'] }, // vb
  'pineapple': { badges: ['add', 'check', 'close'] }, // vb
  'pinwheel': { badges: ['add', 'check', 'close'] }, // vb
  'pipe-elbow': { badges: ['add', 'check', 'close'] }, // vb
  'pipette': { badges: ['add', 'check', 'close'] }, // vb
  'piston': { badges: ['add', 'check', 'close'] }, // vb
  'pitcher': { badges: ['add', 'check', 'close'] }, // vb
  'pitchfork': { badges: ['add', 'check', 'close'] }, // vb
  'pizza': { badges: ['add', 'check', 'close'] }, // vb
  'pizza-cutter': { badges: ['add', 'check', 'close'] }, // vb
  'planet': { badges: ['add', 'check', 'close'] }, // vb
  'plant-pot': { badges: ['add', 'check', 'close'] }, // vb
  'play': { badges: ['add', 'check', 'close'] }, // vb
  'playback-speed': { badges: ['add', 'check', 'close'] }, // vb
  'playing-cards': { badges: ['add', 'check', 'close'] }, // vb
  'pliers': { badges: ['add', 'check', 'close'] }, // vb
  'plumb-bob': { badges: ['add', 'check', 'close'] }, // vb
  'plunger': { badges: ['add', 'check', 'close'] }, // vb
  'podium': { badges: ['add', 'check', 'close'] }, // vb
  'poker-chip': { badges: ['add', 'check', 'close'] }, // vb
  'polaroid': { badges: ['add', 'check', 'close'] }, // vb
  'police-badge': { badges: ['add', 'check', 'close'] }, // vb
  'police-car': { badges: ['add', 'check', 'close'] }, // vb
  'pool': { badges: ['add', 'check', 'close'] }, // vb
  'pool-ladder': { badges: ['add', 'check', 'close'] }, // vb
  'popcorn': { badges: ['add', 'check', 'close'] }, // vb
  'popover': { badges: ['add', 'check', 'close'] }, // vb
  'popsicle': { badges: ['add', 'check', 'close'] }, // vb
  'postmark': { badges: ['add', 'check', 'close'] }, // vb
  'potion': { badges: ['add', 'check', 'close'] }, // vb
  'potted-plant': { badges: ['add', 'check', 'close'] }, // vb
  'pound-circle': { badges: ['add', 'check', 'close'] }, // vb
  'power': { badges: ['add', 'check', 'close'] }, // vb
  'power-plant': { badges: ['add', 'check', 'close'] }, // vb
  'power-socket': { badges: ['add', 'check', 'close'] }, // vb
  'power-strip': { badges: ['add', 'check', 'close'] }, // vb
  'printer-3d': { badges: ['add', 'check', 'close'] }, // vb
  'priority-matrix': { badges: ['add', 'check', 'close'] }, // vb
  'prism': { badges: ['add', 'check', 'close'] }, // vb
  'progress-bar': { badges: ['add', 'check', 'close'] }, // vb
  'progress-ring': { badges: ['add', 'check', 'close'] }, // vb
  'projector-screen': { badges: ['add', 'check', 'close'] }, // vb
  'prompt': { badges: ['add', 'check', 'close'] }, // vb
  'protractor': { badges: ['add', 'check', 'close'] }, // vb
  'pudding': { badges: ['add', 'check', 'close'] }, // vb
  'pulley': { badges: ['add', 'check', 'close'] }, // vb
  'pulse': { badges: ['add', 'check', 'close'] }, // vb
  'pumpkin': { badges: ['add', 'check', 'close'] }, // vb
  'punching-bag': { badges: ['add', 'check', 'close'] }, // vb
  'putty-knife': { badges: ['add', 'check', 'close'] }, // vb
  'pylon': { badges: ['add', 'check', 'close'] }, // vb
  'pyramid': { badges: ['add', 'check', 'close'] }, // vb
  'rabbit': { badges: ['add', 'check', 'close'] }, // vb
  'rabbit-hat': { badges: ['add', 'check', 'close'] }, // vb
  'radar': { badges: ['add', 'check', 'close'] }, // vb
  'radiation': { badges: ['add', 'check', 'close'] }, // vb
  'radiator': { badges: ['add', 'check', 'close'] }, // vb
  'radio-button': { badges: ['add', 'check', 'close'] }, // vb
  'rain-gauge': { badges: ['add', 'check', 'close'] }, // vb
  'rake': { badges: ['add', 'check', 'close'] }, // vb
  'ramen': { badges: ['add', 'check', 'close'] }, // vb
  'razor': { badges: ['add', 'check', 'close'] }, // vb
  'receipt-tax': { badges: ['add', 'check', 'close'] }, // vb
  'record': { badges: ['add', 'check', 'close'] }, // vb
  'recycle': { badges: ['add', 'check', 'close'] }, // vb
  'red-envelope': { badges: ['add', 'check', 'close'] }, // vb
  'remove-circle': { badges: ['add', 'check', 'close'] }, // vb
  'repeat-one': { badges: ['add', 'check', 'close'] }, // vb
  'restaurant': { badges: ['add', 'check', 'close'] }, // vb
  'rice-bowl': { badges: ['add', 'check', 'close'] }, // vb
  'ring': { badges: ['add', 'check', 'close'] }, // vb
  'river': { badges: ['add', 'check', 'close'] }, // vb
  'road-barrier': { badges: ['add', 'check', 'close'] }, // vb
  'road-merge': { badges: ['add', 'check', 'close'] }, // vb
  'road-narrows': { badges: ['add', 'check', 'close'] }, // vb
  'robot-arm': { badges: ['add', 'check', 'close'] }, // vb
  'rock': { badges: ['add', 'check', 'close'] }, // vb
  'rocket': { badges: ['add', 'check', 'close'] }, // vb
  'rocking-chair': { badges: ['add', 'check', 'close'] }, // vb
  'rocking-horse': { badges: ['add', 'check', 'close'] }, // vb
  'roller-coaster': { badges: ['add', 'check', 'close'] }, // vb
  'roller-skate': { badges: ['add', 'check', 'close'] }, // vb
  'rose': { badges: ['add', 'check', 'close'] }, // vb
  'rosette': { badges: ['add', 'check', 'close'] }, // vb
  'rotary-phone': { badges: ['add', 'check', 'close'] }, // vb
  'round-bottom-flask': { badges: ['add', 'check', 'close'] }, // vb
  'rowboat': { badges: ['add', 'check', 'close'] }, // vb
  'rug': { badges: ['add', 'check', 'close'] }, // vb
  'rugby-ball': { badges: ['add', 'check', 'close'] }, // vb
  'rupee-circle': { badges: ['add', 'check', 'close'] }, // vb
  'sailboat': { badges: ['add', 'check', 'close'] }, // vb
  'salad': { badges: ['add', 'check', 'close'] }, // vb
  'sale-sign': { badges: ['add', 'check', 'close'] }, // vb
  'salt-shaker': { badges: ['add', 'check', 'close'] }, // vb
  'sandal': { badges: ['add', 'check', 'close'] }, // vb
  'sandcastle': { badges: ['add', 'check', 'close'] }, // vb
  'sandwich': { badges: ['add', 'check', 'close'] }, // vb
  'sanitizer': { badges: ['add', 'check', 'close'] }, // vb
  'santa-hat': { badges: ['add', 'check', 'close'] }, // vb
  'satellite': { badges: ['add', 'check', 'close'] }, // vb
  'satellite-phone': { badges: ['add', 'check', 'close'] }, // vb
  'saturn': { badges: ['add', 'check', 'close'] }, // vb
  'saucepan': { badges: ['add', 'check', 'close'] }, // vb
  'saw': { badges: ['add', 'check', 'close'] }, // vb
  'sawhorse': { badges: ['add', 'check', 'close'] }, // vb
  'scaffold': { badges: ['add', 'check', 'close'] }, // vb
  'scaffolding': { badges: ['add', 'check', 'close'] }, // vb
  'scale': { badges: ['add', 'check', 'close'] }, // vb
  'scale-bar': { badges: ['add', 'check', 'close'] }, // vb
  'scalpel': { badges: ['add', 'check', 'close'] }, // vb
  'scan-barcode': { badges: ['add', 'close'] }, // vb
  'scan-text': { badges: ['add', 'check', 'close'] }, // vb
  'scarecrow': { badges: ['add', 'check', 'close'] }, // vb
  'scarf': { badges: ['add', 'check', 'close'] }, // vb
  'school': { badges: ['add', 'check', 'close'] }, // vb
  'scissor-lift': { badges: ['add', 'check', 'close'] }, // vb
  'scoreboard': { badges: ['add', 'check', 'close'] }, // vb
  'screw': { badges: ['add', 'check', 'close'] }, // vb
  'screwdriver': { badges: ['add', 'check', 'close'] }, // vb
  'scroll': { badges: ['add', 'check', 'close'] }, // vb
  'scrollbar': { badges: ['add', 'check', 'close'] }, // vb
  'sd-card': { badges: ['add', 'check', 'close'] }, // vb
  'seagull': { badges: ['add', 'check', 'close'] }, // vb
  'search-bar': { badges: ['add', 'check', 'close'] }, // vb
  'seashell': { badges: ['add', 'check', 'close'] }, // vb
  'seed-packet': { badges: ['add', 'check', 'close'] }, // vb
  'seedling': { badges: ['add', 'check', 'close'] }, // vb
  'seesaw': { badges: ['add', 'check', 'close'] }, // vb
  'segmented-control': { badges: ['add', 'check', 'close'] }, // vb
  'serum-bottle': { badges: ['add', 'check', 'close'] }, // vb
  'set-square': { badges: ['add', 'check', 'close'] }, // vb
  'sewing-machine': { badges: ['add', 'check', 'close'] }, // vb
  'shampoo': { badges: ['add', 'check', 'close'] }, // vb
  'share': { badges: ['add', 'check', 'close'] }, // vb
  'shark-fin': { badges: ['add', 'check', 'close'] }, // vb
  'sharp-sign': { badges: ['add', 'check', 'close'] }, // vb
  'sheep': { badges: ['add', 'check', 'close'] }, // vb
  'ship': { badges: ['add', 'check', 'close'] }, // vb
  'ship-wheel': { badges: ['add', 'check', 'close'] }, // vb
  'shorts': { badges: ['add', 'check', 'close'] }, // vb
  'shovel': { badges: ['add', 'check', 'close'] }, // vb
  'shuttlecock': { badges: ['add', 'check', 'close'] }, // vb
  'sidebar-collapse': { badges: ['add', 'check', 'close'] }, // vb
  'sieve': { badges: ['add', 'check', 'close'] }, // vb
  'signal-ahead': { badges: ['add', 'check', 'close'] }, // vb
  'silo': { badges: ['add', 'check', 'close'] }, // vb
  'sink': { badges: ['add', 'check', 'close'] }, // vb
  'sippy-cup': { badges: ['add', 'check', 'close'] }, // vb
  'skateboard': { badges: ['add', 'check', 'close'] }, // vb
  'skeleton': { badges: ['add', 'check', 'close'] }, // vb
  'skeleton-loader': { badges: ['add', 'check', 'close'] }, // vb
  'ski-boot': { badges: ['add', 'check', 'close'] }, // vb
  'ski-lift': { badges: ['add', 'check', 'close'] }, // vb
  'skip-forward': { badges: ['add', 'check', 'close'] }, // vb
  'skirt': { badges: ['add', 'check', 'close'] }, // vb
  'skis': { badges: ['add', 'check', 'close'] }, // vb
  'skyscraper': { badges: ['add', 'check', 'close'] }, // vb
  'sled': { badges: ['add', 'check', 'close'] }, // vb
  'sledgehammer': { badges: ['add', 'check', 'close'] }, // vb
  'sleep-mask': { badges: ['add', 'check', 'close'] }, // vb
  'sleigh': { badges: ['add', 'check', 'close'] }, // vb
  'slide': { badges: ['add', 'check', 'close'] }, // vb
  'slider-vertical': { badges: ['add', 'check', 'close'] }, // vb
  'sliders': { badges: ['add', 'check', 'close'] }, // vb
  'slingshot': { badges: ['add', 'check', 'close'] }, // vb
  'slot-machine': { badges: ['add', 'check', 'close'] }, // vb
  'slow-motion': { badges: ['add', 'check', 'close'] }, // vb
  'snail': { badges: ['add', 'check', 'close'] }, // vb
  'snake': { badges: ['add', 'check', 'close'] }, // vb
  'sneaker': { badges: ['add', 'check', 'close'] }, // vb
  'snorkel': { badges: ['add', 'check', 'close'] }, // vb
  'snowboard': { badges: ['add', 'check', 'close'] }, // vb
  'snowman': { badges: ['add', 'check', 'close'] }, // vb
  'snowmobile': { badges: ['add', 'check', 'close'] }, // vb
  'snowplow': { badges: ['add', 'check', 'close'] }, // vb
  'soap': { badges: ['add', 'check', 'close'] }, // vb
  'soap-dispenser': { badges: ['add', 'check', 'close'] }, // vb
  'soccer-ball': { badges: ['add', 'check', 'close'] }, // vb
  'sock': { badges: ['add', 'check', 'close'] }, // vb
  'soda-can': { badges: ['add', 'check', 'close'] }, // vb
  'soda-cup': { badges: ['add', 'check', 'close'] }, // vb
  'sofa': { badges: ['add', 'check', 'close'] }, // vb
  'soldering-iron': { badges: ['add', 'check', 'close'] }, // vb
  'sort-ascending': { badges: ['add', 'check', 'close'] }, // vb
  'sound-wave': { badges: ['add', 'check', 'close'] }, // vb
  'soup': { badges: ['add', 'check', 'close'] }, // vb
  'spark-plug': { badges: ['add', 'check', 'close'] }, // vb
  'sparkle': { badges: ['add', 'check', 'close'] }, // vb
  'spatula': { badges: ['add', 'check', 'close'] }, // vb
  'speed-bump': { badges: ['add', 'check', 'close'] }, // vb
  'spell-book': { badges: ['add', 'check', 'close'] }, // vb
  'spice-jar': { badges: ['add', 'check', 'close'] }, // vb
  'spider': { badges: ['add', 'check', 'close'] }, // vb
  'spider-web': { badges: ['add', 'check', 'close'] }, // vb
  'spinner': { badges: ['add', 'check', 'close'] }, // vb
  'spinning-top': { badges: ['add', 'check', 'close'] }, // vb
  'spirit-level': { badges: ['add', 'check', 'close'] }, // vb
  'split-button': { badges: ['add', 'check', 'close'] }, // vb
  'split-view': { badges: ['add', 'check', 'close'] }, // vb
  'sponge': { badges: ['add', 'check', 'close'] }, // vb
  'spool': { badges: ['add', 'check', 'close'] }, // vb
  'spoon': { badges: ['add', 'check', 'close'] }, // vb
  'sports-bottle': { badges: ['add', 'check', 'close'] }, // vb
  'spray-bottle': { badges: ['add', 'check', 'close'] }, // vb
  'spring': { badges: ['add', 'check', 'close'] }, // vb
  'sprout': { badges: ['add', 'check', 'close'] }, // vb
  'spyglass': { badges: ['add', 'check', 'close'] }, // vb
  'squeegee': { badges: ['add', 'check', 'close'] }, // vb
  'stadium': { badges: ['add', 'check', 'close'] }, // vb
  'stage-curtain': { badges: ['add', 'check', 'close'] }, // vb
  'stairs': { badges: ['add', 'check', 'close'] }, // vb
  'stand-mixer': { badges: ['add', 'check', 'close'] }, // vb
  'stapler': { badges: ['add', 'check', 'close'] }, // vb
  'starfish': { badges: ['add', 'check', 'close'] }, // vb
  'steak': { badges: ['add', 'check', 'close'] }, // vb
  'steamer': { badges: ['add', 'check', 'close'] }, // vb
  'steering-wheel': { badges: ['add', 'check', 'close'] }, // vb
  'stepper': { badges: ['add', 'check', 'close'] }, // vb
  'stethoscope': { badges: ['add', 'check', 'close'] }, // vb
  'stocking': { badges: ['add', 'check', 'close'] }, // vb
  'stomach': { badges: ['add', 'check', 'close'] }, // vb
  'stop': { badges: ['add', 'check', 'close'] }, // vb
  'stopwatch': { badges: ['add', 'check', 'close'] }, // vb
  'strategy': { badges: ['add', 'check', 'close'] }, // vb
  'strawberry': { badges: ['add', 'check', 'close'] }, // vb
  'stretcher': { badges: ['add', 'check', 'close'] }, // vb
  'stroller': { badges: ['add', 'check', 'close'] }, // vb
  'submarine': { badges: ['add', 'check', 'close'] }, // vb
  'succulent': { badges: ['add', 'check', 'close'] }, // vb
  'suit-club': { badges: ['add', 'check', 'close'] }, // vb
  'suit-diamond': { badges: ['add', 'check', 'close'] }, // vb
  'suit-spade': { badges: ['add', 'check', 'close'] }, // vb
  'summit': { badges: ['add', 'check', 'close'] }, // vb
  'sun-hat': { badges: ['add', 'check', 'close'] }, // vb
  'sun-lounger': { badges: ['add', 'check', 'close'] }, // vb
  'sundae': { badges: ['add', 'check', 'close'] }, // vb
  'sundial': { badges: ['add', 'check', 'close'] }, // vb
  'sunflower': { badges: ['add', 'check', 'close'] }, // vb
  'sunglasses': { badges: ['add', 'check', 'close'] }, // vb
  'sunscreen': { badges: ['add', 'check', 'close'] }, // vb
  'surfboard': { badges: ['add', 'check', 'close'] }, // vb
  'sushi': { badges: ['add', 'check', 'close'] }, // vb
  'swimming': { badges: ['add', 'check', 'close'] }, // vb
  'swimsuit': { badges: ['add', 'check', 'close'] }, // vb
  'swing': { badges: ['add', 'check', 'close'] }, // vb
  'swivel-chair': { badges: ['add', 'check', 'close'] }, // vb
  'sword': { badges: ['add', 'check', 'close'] }, // vb
  't-shirt': { badges: ['add', 'check', 'close'] }, // vb
  'table-tennis': { badges: ['add', 'check', 'close'] }, // vb
  'tablet-landscape': { badges: ['add', 'check', 'close'] }, // vb
  'tablet-pen': { badges: ['add', 'check', 'close'] }, // vb
  'tabs': { badges: ['add', 'check', 'close'] }, // vb
  'taco': { badges: ['add', 'check', 'close'] }, // vb
  'takeout-box': { badges: ['add', 'check', 'close'] }, // vb
  'tambourine': { badges: ['add', 'check', 'close'] }, // vb
  'tank-top': { badges: ['add', 'check', 'close'] }, // vb
  'tape-dispenser': { badges: ['add', 'check', 'close'] }, // vb
  'tape-roll': { badges: ['check'] }, // vb
  'target': { badges: ['add', 'check', 'close'] }, // vb
  'tea-bag': { badges: ['add', 'check', 'close'] }, // vb
  'tea-cup': { badges: ['add', 'check', 'close'] }, // vb
  'teapot': { badges: ['add', 'check', 'close'] }, // vb
  'telegraph': { badges: ['add', 'check', 'close'] }, // vb
  'telescope': { badges: ['add', 'check', 'close'] }, // vb
  'tennis-ball': { badges: ['add', 'check', 'close'] }, // vb
  'tennis-racket': { badges: ['add', 'check', 'close'] }, // vb
  'terrain': { badges: ['add', 'check', 'close'] }, // vb
  'terrarium': { badges: ['add', 'check', 'close'] }, // vb
  'test-tube': { badges: ['add', 'check', 'close'] }, // vb
  'test-tube-rack': { badges: ['add', 'check', 'close'] }, // vb
  'text-input': { badges: ['add', 'check', 'close'] }, // vb
  'textarea': { badges: ['add', 'check', 'close'] }, // vb
  'theater-masks': { badges: ['add', 'check', 'close'] }, // vb
  'therefore': { badges: ['add', 'check', 'close'] }, // vb
  'thermos': { badges: ['add', 'check', 'close'] }, // vb
  'thermostat': { badges: ['add', 'check', 'close'] }, // vb
  'theta': { badges: ['add', 'check', 'close'] }, // vb
  'thimble': { badges: ['add', 'check', 'close'] }, // vb
  'this-side-up': { badges: ['add', 'check', 'close'] }, // vb
  'thread-spool': { badges: ['add', 'check', 'close'] }, // vb
  'throne': { badges: ['add', 'check', 'close'] }, // vb
  'tiara': { badges: ['add', 'check', 'close'] }, // vb
  'tic-tac-toe': { badges: ['add', 'check', 'close'] }, // vb
  'timeline': { badges: ['add', 'check', 'close'] }, // vb
  'tipi': { badges: ['add', 'check', 'close'] }, // vb
  'tissue-box': { badges: ['add', 'check', 'close'] }, // vb
  'toast': { badges: ['add', 'check', 'close'] }, // vb
  'toggle-group': { badges: ['add', 'check', 'close'] }, // vb
  'toggle-on': { badges: ['add', 'check', 'close'] }, // vb
  'toilet': { badges: ['add', 'check', 'close'] }, // vb
  'toilet-paper': { badges: ['add', 'check', 'close'] }, // vb
  'tomato': { badges: ['add', 'check', 'close'] }, // vb
  'tombstone': { badges: ['add', 'check', 'close'] }, // vb
  'toolbox': { badges: ['add', 'check', 'close'] }, // vb
  'tooltip': { badges: ['add', 'check', 'close'] }, // vb
  'toothbrush': { badges: ['add', 'check', 'close'] }, // vb
  'toothpaste': { badges: ['add', 'check', 'close'] }, // vb
  'top-hat': { badges: ['add', 'check', 'close'] }, // vb
  'torch': { badges: ['add', 'check', 'close'] }, // vb
  'towel': { badges: ['add', 'check', 'close'] }, // vb
  'toxic': { badges: ['add', 'check', 'close'] }, // vb
  'toy-brick': { badges: ['add', 'check', 'close'] }, // vb
  'trackball': { badges: ['add', 'check', 'close'] }, // vb
  'tractor': { badges: ['add', 'check', 'close'] }, // vb
  'trailer': { badges: ['add', 'check', 'close'] }, // vb
  'train': { badges: ['add', 'check', 'close'] }, // vb
  'train-front': { badges: ['add', 'check', 'close'] }, // vb
  'tram': { badges: ['add', 'check', 'close'] }, // vb
  'trash': { badges: ['add', 'check', 'close'] }, // vb
  'travel-pillow': { badges: ['add', 'check', 'close'] }, // vb
  'treadmill': { badges: ['add', 'check', 'close'] }, // vb
  'treasure-chest': { badges: ['add', 'check', 'close'] }, // vb
  'treasure-map': { badges: ['add', 'check', 'close'] }, // vb
  'tree': { badges: ['add', 'check', 'close'] }, // vb
  'tree-stump': { badges: ['add', 'check', 'close'] }, // vb
  'triangle-instrument': { badges: ['add', 'check', 'close'] }, // vb
  'tripod': { badges: ['add', 'check', 'close'] }, // vb
  'trousers': { badges: ['add', 'check', 'close'] }, // vb
  'trowel': { badges: ['add', 'check', 'close'] }, // vb
  'trumpet': { badges: ['add', 'check', 'close'] }, // vb
  'tsunami': { badges: ['add', 'check', 'close'] }, // vb
  'tulip': { badges: ['add', 'check', 'close'] }, // vb
  'tuning-fork': { badges: ['add', 'check', 'close'] }, // vb
  'tunnel': { badges: ['add', 'check', 'close'] }, // vb
  'tunnel-ahead': { badges: ['add', 'check', 'close'] }, // vb
  'turnstile': { badges: ['add', 'check', 'close'] }, // vb
  'turtle': { badges: ['add', 'check', 'close'] }, // vb
  'tweezers': { badges: ['add', 'check', 'close'] }, // vb
  'two-factor': { badges: ['add', 'check', 'close'] }, // vb
  'two-way-traffic': { badges: ['add', 'check', 'close'] }, // vb
  'ufo': { badges: ['add', 'check', 'close'] }, // vb
  'umbrella-stand': { badges: ['add', 'check', 'close'] }, // vb
  'unicycle': { badges: ['add', 'check', 'close'] }, // vb
  'university': { badges: ['add', 'check', 'close'] }, // vb
  'upload': { badges: ['add', 'check', 'close'] }, // vb
  'urn': { badges: ['add', 'check', 'close'] }, // vb
  'usb-c-port': { badges: ['add', 'check', 'close'] }, // vb
  'usb-hub': { badges: ['add', 'check', 'close'] }, // vb
  'user-edit': { badges: ['add', 'check', 'close'] }, // vb
  'user-headset': { badges: ['add', 'check', 'close'] }, // vb
  'user-voice': { badges: ['add', 'check', 'close'] }, // vb
  'utility-knife': { badges: ['add', 'check', 'close'] }, // vb
  'utility-pole': { badges: ['add', 'check', 'close'] }, // vb
  'van': { badges: ['add', 'check', 'close'] }, // vb
  'vase': { badges: ['add', 'check', 'close'] }, // vb
  'vest': { badges: ['add', 'check', 'close'] }, // vb
  'vial': { badges: ['add', 'check', 'close'] }, // vb
  'vise': { badges: ['add', 'check', 'close'] }, // vb
  'volcano': { badges: ['add', 'check', 'close'] }, // vb
  'volleyball': { badges: ['add', 'check', 'close'] }, // vb
  'volume': { badges: ['add', 'check', 'close'] }, // vb
  'volume-low': { badges: ['add', 'check', 'close'] }, // vb
  'vr-headset': { badges: ['add', 'check', 'close'] }, // vb
  'waffle': { badges: ['add', 'check', 'close'] }, // vb
  'walker': { badges: ['add', 'check', 'close'] }, // vb
  'walking': { badges: ['add', 'check', 'close'] }, // vb
  'wall-shelf': { badges: ['add', 'check', 'close'] }, // vb
  'wardrobe': { badges: ['add', 'check', 'close'] }, // vb
  'warning': { badges: ['add', 'check', 'close'] }, // vb
  'watch': { badges: ['add', 'check', 'close'] }, // vb
  'watchtower': { badges: ['add', 'check', 'close'] }, // vb
  'water-cooler': { badges: ['add', 'check', 'close'] }, // vb
  'water-tower': { badges: ['add', 'check', 'close'] }, // vb
  'slider': { badges: ['add', 'check', 'close'] }, // vb
  'square-root': { badges: ['add', 'check', 'close'] }, // vb
  'subset': { badges: ['add', 'check', 'close'] }, // vb
  'water-valve': { badges: ['add', 'check', 'close'] }, // vb
  'water-well': { badges: ['add', 'check', 'close'] }, // vb
  'watering-can': { badges: ['add', 'check', 'close'] }, // vb
  'watermelon': { badges: ['add', 'check', 'close'] }, // vb
  'waveform': { badges: ['add', 'check', 'close'] }, // vb
  'waves': { badges: ['add', 'check', 'close'] }, // vb
  'weather-balloon': { badges: ['add', 'check', 'close'] }, // vb
  'wedding-cake': { badges: ['add', 'check', 'close'] }, // vb
  'weight': { badges: ['add', 'check', 'close'] }, // vb
  'well': { badges: ['add', 'check', 'close'] }, // vb
  'whale': { badges: ['add', 'check', 'close'] }, // vb
  'whale-tail': { badges: ['add', 'check', 'close'] }, // vb
  'wheat': { badges: ['add', 'check', 'close'] }, // vb
  'wheelbarrow': { badges: ['add', 'check', 'close'] }, // vb
  'whisk': { badges: ['add', 'check', 'close'] }, // vb
  'whistle': { badges: ['add', 'check', 'close'] }, // vb
  'wifi': { badges: ['add', 'check', 'close'] }, // vb
  'wildfire': { badges: ['add', 'check', 'close'] }, // vb
  'wind-turbine': { badges: ['add', 'check', 'close'] }, // vb
  'windchime': { badges: ['add', 'check', 'close'] }, // vb
  'windmill': { badges: ['add', 'check', 'close'] }, // vb
  'window-blinds': { badges: ['add', 'check', 'close'] }, // vb
  'window-maximize': { badges: ['add', 'check', 'close'] }, // vb
  'window-restore': { badges: ['add', 'check', 'close'] }, // vb
  'wine-barrel': { badges: ['add', 'check', 'close'] }, // vb
  'wine-bottle': { badges: ['add', 'check', 'close'] }, // vb
  'wine-glass': { badges: ['add', 'check', 'close'] }, // vb
  'witch-hat': { badges: ['add', 'check', 'close'] }, // vb
  'won-circle': { badges: ['add', 'check', 'close'] }, // vb
  'won-sign': { badges: ['add', 'check', 'close'] }, // vb
  'wood-log': { badges: ['add', 'check', 'close'] }, // vb
  'workbench': { badges: ['add', 'check', 'close'] }, // vb
  'wrench': { badges: ['add', 'check', 'close'] }, // vb
  'xylophone': { badges: ['add', 'check', 'close'] }, // vb
  'y-junction': { badges: ['add', 'check', 'close'] }, // vb
  'yacht': { badges: ['add', 'check', 'close'] }, // vb
  'yarn': { badges: ['add', 'check', 'close'] }, // vb
  'yarn-ball': { badges: ['add', 'check', 'close'] }, // vb
  'yen-circle': { badges: ['add', 'check', 'close'] }, // vb
  'yield-ahead': { badges: ['add', 'check', 'close'] }, // vb
  'yoga-mat': { badges: ['add', 'check', 'close'] }, // vb
  'yurt': { badges: ['add', 'check', 'close'] }, // vb
  'zoom-in': { badges: ['add', 'check', 'close'] }, // vb
};

export { OBJ, FULL };
