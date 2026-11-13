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
  'ai-airplane': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square'] }, // vbc
  'ai-bag': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square'] }, // vbc
  'ai-book': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'ai-briefcase': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square'] }, // vbc
  'ai-browser': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'ai-bug': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square'] }, // vbc
  'ai-building': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'ai-calculator': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'ai-car': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square'] }, // vbc
  'ai-cart': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['square'] }, // vbc
  'ai-chart': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square'] }, // vbc
  'ai-clipboard': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'ai-code': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'ai-contract': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'ai-cube': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square'] }, // vbc
  'ai-dashboard': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'ai-database': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'ai-document': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'ai-fine-tune': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'ai-flask': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square'] }, // vbc
  'ai-folder': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'ai-form': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'ai-gift': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square'] }, // vbc
  'ai-graduation': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'ai-graph': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square'] }, // vbc
  'ai-home': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square'] }, // vbc
  'ai-id': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'ai-idea': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'ai-image': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'ai-inbox': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'ai-laptop': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['square'] }, // vbc
  'ai-mail': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'ai-map': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'ai-model': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square'] }, // vbc
  'ai-news': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'ai-notes': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'ai-package': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'ai-palette': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square'] }, // vbc
  'ai-pen': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square'] }, // vbc
  'ai-phone': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'ai-plant': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'ai-presentation': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'ai-receipt': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'ai-scan': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square'] }, // vbc
  'ai-server': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'ai-sheet': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'ai-summary': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'ai-support': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'ai-target': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square'] }, // vbc
  'ai-terminal': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'ai-translate': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square'] }, // vbc
  'ai-video': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'ai-vision': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'ai-voice': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square'] }, // vbc
  'ai-wallet': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square'] }, // vbc
  'ai-write': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'air-conditioner': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'airplane-landing': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['square'] }, // vbc
  'airplane-takeoff': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['square'] }, // vbc
  'airship': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'alarm-snooze': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square'] }, // vbc
  'align-object-left': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'ambulance': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'anchor': { badges: ['add', 'check', 'close', 'remove'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'anchor-point': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'ant': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'antenna': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'anvil': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'aperture': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'api': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'apple': { badges: ['add', 'check', 'close', 'remove'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'apron': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'arcade': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'arch': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'area': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'armchair': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'aspect-ratio': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'asteroid': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'astronaut': { badges: ['add', 'check', 'close', 'remove'], containers: ['circle'] }, // vbc
  'at-sign': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'atlas': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'atom': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'atv': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'automation': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'avatar-group': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'avocado': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'awareness-ribbon': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square'] }, // vbc
  'axe': { badges: ['add', 'check', 'close', 'remove'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'baby': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'baby-bottle': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'baby-monitor': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'bacon': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'hexagon'] }, // vbc
  'bacteria': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'bagel': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'baggage-claim': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'baguette': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'balloon': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'bamboo': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'banana': { badges: ['add', 'check', 'close', 'remove'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'bandage': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'banknotes': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'bao': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'bar-stool': { badges: ['add', 'check', 'close', 'remove'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'barbell': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'barber-pole': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'barcode-scanner': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'barn': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'baseball': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'baseball-bat': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'basketball': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'basketball-hoop': { badges: ['add', 'check', 'close', 'remove'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'bass-clef': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'bat': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'bathroom-scale': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'bathtub': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'battery': { badges: ['add', 'check', 'close', 'remove'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'battery-aa': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'bauble': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'bbq-grill': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'beach-ball': { badges: ['add', 'check', 'close', 'remove'], containers: ['circle', 'square'] }, // vbc
  'beach-umbrella': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['square'] }, // vbc
  'beaker': { badges: ['add', 'check', 'close', 'remove'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'beanie': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['hexagon'] }, // vbc
  'bedtime': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square'] }, // vbc
  'bee': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'beehive': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'beer-mug': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'bell-pepper': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'belt': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'bench': { badges: ['add', 'check', 'close', 'remove'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'bento': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'beta': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'bezier-curve': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'bib': { badges: ['add', 'check', 'close', 'remove'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'bicycle': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'bike-helmet': { badges: ['add', 'check', 'close', 'remove'], containers: ['circle', 'square'] }, // vbc
  'bike-rack': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'billboard': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'binary': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'binary-tree': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'binder-clip': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'binoculars': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'biofuel': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'bird': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'bird-bath': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'bird-feeder': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'birdcage': { badges: ['add', 'check', 'close', 'remove'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'birdhouse': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'blend': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'blood-bag': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'blood-drop': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'blueprint': { badges: ['add', 'check', 'close', 'remove'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'bolt': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'bomb': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'bone': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'bongo': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'bonsai': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'book-open': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'bookend': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'bookshelf': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'boomerang': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'boot': { badges: ['add', 'check', 'close', 'remove'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'bottle': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'bottle-cap': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'bottle-opener': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'bow-arrow': { badges: ['add', 'check', 'close', 'remove'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'bow-tie': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'bowl': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'bowling': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'box-plot': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'hexagon'] }, // vbc
  'boxing-glove': { badges: ['add', 'check', 'close', 'remove'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'boxing-ring': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['hexagon'] }, // vbc
  'braces': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'brackets': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'brain': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'branch': { badges: ['add', 'check', 'close', 'remove'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'bread': { badges: ['add', 'check', 'close', 'remove'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'breadboard': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'breadcrumb': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'breakpoint': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'brick-wall': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'bricks': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'bridge': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'bring-to-front': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'broccoli': { badges: ['add', 'check', 'close', 'remove'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'broom': { badges: ['add', 'check', 'close', 'remove'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'brush': { badges: ['add', 'check', 'close', 'remove'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'bubble-tea': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'bubble-wrap': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'bucket': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'bucket-hat': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'bucket-spade': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'building': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'bull': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'bulldozer': { badges: ['add', 'check', 'close', 'remove'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'bunk-bed': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square'] }, // vbc
  'bunsen-burner': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'bunting': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'buoy': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'burger': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'bus': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'bus-shelter': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square'] }, // vbc
  'bus-stop': { badges: ['add', 'check', 'close', 'remove'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'butter': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'butterfly': { badges: ['add', 'check', 'close', 'remove'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'button': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'c-clamp': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'cable': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'cable-car': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'cactus': { badges: ['add', 'check', 'close', 'remove'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'cairn': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
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
  'candy': { badges: ['add', 'check', 'close', 'remove'], containers: ['circle', 'square'] }, // vbc
  'candy-cane': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'cannon': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'cap': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'capacitor': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'captain-hat': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'car': { badges: ['add', 'check', 'close', 'remove'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'car-door': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'car-seat': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'car-wash': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'carabiner': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'caravan': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'carousel': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'carrot': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'cashback': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'cassette': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'castle': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'cat': { badges: ['add', 'check', 'close', 'remove'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'caterpillar': { badges: ['add', 'check', 'close', 'remove'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'cauldron': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'caution-tape': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['hexagon'] }, // vbc
  'cave': { badges: ['add', 'check', 'close', 'remove'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'ceiling-fan': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'cell': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'cement-bag': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'cement-mixer': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'center-object': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'chair': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'chalkboard': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'champagne': { badges: ['add', 'check', 'close', 'remove'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'chandelier': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'chapel': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'chart-area': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'chart-area-stacked': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'chart-bar-horizontal': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'chart-bubble': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'chart-candles': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'chart-coin': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'chart-decline': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'chart-dumbbell': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'chart-forecast': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'chart-gantt': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'chart-grouped': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'chart-growth': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'chart-histogram': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'chart-line-multi': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'chart-lollipop': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'chart-mixed': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'chart-points': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'chart-polar': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'chart-pyramid': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'chart-radar': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['hexagon'] }, // vbc
  'chart-range': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'chart-sankey': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'chart-scatter': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'chart-slope': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square'] }, // vbc
  'chart-spline': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'chart-stacked': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'chart-step': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'chart-sunburst': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'chart-treemap': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'chart-waterfall': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'check-circle': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'checkbox': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'cheers': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'cheese': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'chef-hat': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'cherries': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'cherry': { badges: ['add', 'check', 'close', 'remove'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'chess-bishop': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'chess-king': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'chess-knight': { badges: ['add', 'check', 'close', 'remove'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'chess-pawn': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'chess-queen': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'chess-rook': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'chili': { badges: ['add', 'check', 'close', 'remove'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'chip': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'chisel': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'chocolate-bar': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['hexagon'] }, // vbc
  'chopsticks': { badges: ['add', 'check', 'close', 'remove'], containers: ['circle', 'square'] }, // vbc
  'christmas-tree': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'church': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'cigarette': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'circle-dashed': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'circuit-board': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'circus-tent': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'citrus': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'city': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'claw-machine': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'clipboard-list': { badges: ['add', 'check', 'close', 'remove'], containers: ['hexagon'] }, // vbc
  'cloche': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square'] }, // vbc
  'clock-fast': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'clock-tower': { badges: ['add', 'check', 'close', 'remove'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'close-circle': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'clothes-rack': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'clothesline': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'clothespin': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'cloud-sync': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'clover': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'coal': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'coat-hook': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'coat-rack': { badges: ['add', 'check', 'close', 'remove'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'cocktail': { badges: ['add', 'check', 'close', 'remove'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'cocoon': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'code': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'code-window': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'coffee': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'coffee-bean': { badges: ['add', 'check', 'close', 'remove'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'coffee-grinder': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'coffee-machine': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'coffee-to-go': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'coffin': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'colander': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'color-input': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'color-picker': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'columns': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'comb': { badges: ['add', 'check', 'close', 'remove'], containers: ['circle', 'hexagon'] }, // vbc
  'command': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'command-palette': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'compass-rose': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'compost': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'compost-bin': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'confetti': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'constellation': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'contact-lens': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'container-ship': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'context-menu': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'convertible': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'conveyor': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'conveyor-belt': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'cookie': { badges: ['add', 'check', 'close', 'remove'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'cookie-jar': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'cooking-pot': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'cooling-tower': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'coral': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'corkscrew': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['square', 'hexagon'] }, // vbc
  'corn': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'corner-radius': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'corrosive': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'cottage': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'hexagon'] }, // vbc
  'cow': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'cowboy-hat': { badges: ['add', 'check', 'close', 'remove'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'crab': { badges: ['add', 'check', 'close', 'remove'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'cradle': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'crane': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'crane-hook': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'crayon': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'crib': { badges: ['add', 'check', 'close', 'remove'], containers: ['circle', 'square'] }, // vbc
  'crib-mobile': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'cricket-bat': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'croissant': { badges: ['add', 'check', 'close', 'remove'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'crop': { badges: ['add', 'check', 'close', 'remove'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'crossroads': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'crown': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'crutch': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'crystal': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'crystal-ball': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'cupcake': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'curling-stone': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'cursor-click': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'cursor-col-resize': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'cursor-zoom': { badges: ['check', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'curtains': { badges: ['add', 'check', 'close', 'remove'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'cutting-board': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'dagger': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'dam': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'dandelion': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'dart': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'dashboard-gauge': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'dead-end': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'deep-fryer': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'deep-water': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'defibrillator': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'desert': { badges: ['add', 'check', 'close', 'remove'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'desk-globe': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'desk-phone': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'diamond': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'dice': { badges: ['add', 'check', 'close', 'remove'], containers: ['circle', 'square'] }, // vbc
  'dice-d20': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'diff': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'dining-table': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['hexagon'] }, // vbc
  'diode': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'directions-sign': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'disc': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'disco-ball': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'dish-rack': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'dishwasher': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'distance': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'distribute-horizontal': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'diving-mask': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'diya': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'djembe': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'dock': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'dog': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'dog-bowl': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'doghouse': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'dollar-circle': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'dollar-sign': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle'] }, // vbc
  'domino': { badges: ['add', 'check', 'close', 'remove'], containers: ['hexagon'] }, // vbc
  'donut': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'door': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'download': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'drafting-compass': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'drag-drop': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'dragonfly': { badges: ['add', 'check', 'close', 'remove'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'drawing-compass': { badges: ['add', 'check', 'close', 'remove'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'dreamcatcher': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'dress': { badges: ['add', 'check', 'close', 'remove'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'dresser': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'drill': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'drone': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'dropdown': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'dropdown-menu': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square'] }, // vbc
  'drum': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'drumstick': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['hexagon'] }, // vbc
  'duck': { badges: ['add', 'check', 'close', 'remove'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'dumbbell': { badges: ['add', 'check', 'close', 'remove'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'dumpling': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'dustpan': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'earbuds': { badges: ['add', 'check', 'close', 'remove'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'earring': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'earthquake': { badges: ['add', 'check', 'close', 'remove'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'easel': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'easter-egg': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'egg-cracked': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'egg-fried': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square'] }, // vbc
  'eggplant': { badges: ['add', 'check', 'close', 'remove'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'eject': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'elderly': { badges: ['add', 'check', 'close', 'remove'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'environment-hazard': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'equalizer': { badges: ['add', 'check', 'close', 'remove'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'eraser': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'escalator': { badges: ['add', 'check', 'close', 'remove'], containers: ['circle', 'square'] }, // vbc
  'ethernet': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'euro-circle': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'excavator': { badges: ['add', 'check', 'close', 'remove'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'exchange': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'exclude': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'explosive': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'external-link': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square'] }, // vbc
  'eye-chart': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'eye-drops': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'face-cream': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'face-mask': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'fast-forward': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'faucet': { badges: ['add', 'check', 'close', 'remove'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'feather': { badges: ['add', 'check', 'close', 'remove'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'fence': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'fern': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'ferris-wheel': { badges: ['add', 'check', 'close', 'remove'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'ferry': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'file-audio': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'file-chart': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'file-diff': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'file-dollar': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'file-font': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'file-input': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'file-json': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'file-link': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'file-log': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'file-pen': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'file-signature': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'file-sync': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'file-terminal': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'file-video': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['hexagon'] }, // vbc
  'filing-cabinet': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'fill-stroke': { badges: ['add', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'film-reel': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'film-roll': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'film-strip': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'fire-hydrant': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'firecracker': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'fireplace': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'fireworks': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'fish': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'fish-hook': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'fishbowl': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'fishing-boat': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'fishing-float': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'fishing-rod': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'fitness-tracker': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'flammable': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'flat-sign': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'flip-flops': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'flip-horizontal': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'flipchart': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'flood': { badges: ['add', 'check', 'close', 'remove'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'flood-zone': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'flower': { badges: ['add', 'check', 'close', 'remove'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'folder-chart': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'folder-code': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'folder-dollar': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'folder-globe': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'folder-link': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'folder-mail': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'folder-open': { badges: ['add', 'check', 'close', 'remove'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'folder-sync': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'folder-terminal': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'folder-tree': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'folder-video': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'food-processor': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'football-helmet': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'forest': { badges: ['add', 'check', 'close', 'remove'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'forklift': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'fossil': { badges: ['add', 'check', 'close', 'remove'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'fountain': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'fountain-pen': { badges: ['add', 'check', 'close', 'remove'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'fox': { badges: ['add', 'check', 'close', 'remove'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'fragile': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'frame': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'french-press': { badges: ['add', 'check', 'close', 'remove'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'fries': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'frisbee': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'frog': { badges: ['add', 'check', 'close', 'remove'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'frying-pan': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'fuel-gauge': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'funicular': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'funnel-chart': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'fuse': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'galaxy': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'game-cartridge': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'gamepad': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'garlic': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'gas-cylinder': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'gas-flame': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'gate': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'gavel': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'gazebo': { badges: ['add', 'check', 'close', 'remove'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'gear-shift': { badges: ['add', 'check', 'close', 'remove'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'gender-female': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'gender-male': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'gender-neutral': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'generator': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'geofence': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'gift-bow': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'gingerbread': { badges: ['add', 'check', 'close', 'remove'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'git-compare': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square'] }, // vbc
  'git-fork': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'glass-water': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'glasses': { badges: ['add', 'check', 'close', 'remove'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'glove': { badges: ['add', 'check', 'close', 'remove'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'glucose-meter': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'glue': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'glue-gun': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'glue-stick': { badges: ['add', 'check', 'close', 'remove'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'go-kart': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'goal-net': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'goblet': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'goggles': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'gold-bars': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'gold-pan': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'golf': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'golf-cart': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'golf-tee': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'gong': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'grade': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'graduated-cylinder': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'grapes': { badges: ['add', 'check', 'close', 'remove'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'grass': { badges: ['add', 'check', 'close', 'remove'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'grater': { badges: ['add', 'check', 'close', 'remove'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'gravy-boat': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'greek-column': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['square', 'hexagon'] }, // vbc
  'green-energy': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'greenhouse': { badges: ['add', 'check', 'close', 'remove'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'grid-dots': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'grip-vertical': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'group-objects': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'guitar': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'gumball-machine': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square'] }, // vbc
  'gym-bag': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'gym-rings': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'hammer': { badges: ['add', 'check', 'close', 'remove'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'hammock': { badges: ['add', 'check', 'close', 'remove'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'hand-blender': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'hand-grab': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'hand-mixer': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'hand-raised': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'hand-wave': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'handbag': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'handheld-console': { badges: ['add', 'close'] }, // vb
  'hang-glider': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'hanger': { badges: ['add', 'check', 'close', 'remove'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'harmonica': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'harp': { badges: ['add', 'check', 'close', 'remove'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'hay-bale': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'hdmi-cable': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'health-hazard': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'heatmap': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'hedgehog': { badges: ['add', 'check', 'close', 'remove'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'helicopter': { badges: ['add', 'check', 'close', 'remove'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'herb': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'high-chair': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'high-heel': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'high-voltage': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'hiking-boot': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'hills': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'hinge': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square'] }, // vbc
  'hockey-puck': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'hockey-stick': { badges: ['add', 'check', 'close', 'remove'], containers: ['circle', 'square'] }, // vbc
  'home-smart': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'hexagon'] }, // vbc
  'honey-dipper': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'honey-jar': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'honeycomb': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'hoodie': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'horseshoe': { badges: ['add', 'check', 'close', 'remove'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'hospital-ahead': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'hot-air-balloon': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'hot-chocolate': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'hot-sauce': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'hot-spring': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'hot-water-bottle': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'hotdog': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'hourglass': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'hurdle': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'hut': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'hydro-power': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'i-beam': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'ice-axe': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'ice-cream': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'ice-cube': { badges: ['add', 'check', 'close', 'remove'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'ice-pack': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square'] }, // vbc
  'ice-skate': { badges: ['add', 'check', 'close', 'remove'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'ice-tray': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'iceberg': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square'] }, // vbc
  'igloo': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'incognito': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'info': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'inhaler': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'inkwell': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'interest-rate': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'intersect': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'ironing-board': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'island': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'iv-drip': { badges: ['add', 'check', 'close', 'remove'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'jack-in-box': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'jack-o-lantern': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'jacket': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'jackhammer': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'jam-jar': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'jellyfish': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'jerrycan': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'jet-ski': { badges: ['add', 'check', 'close', 'remove'], containers: ['circle', 'square'] }, // vbc
  'joystick': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'juice-box': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'juicer': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'jump-rope': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'kayak': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'kayak-paddle': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'kebab': { badges: ['add', 'check', 'close', 'remove'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'keep-dry': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'kettlebell': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'key-capslock': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'key-option': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'key-ring': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'key-space': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'keyhole': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'keypad': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square'] }, // vbc
  'kick-scooter': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'kidney': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'kitchen-scale': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'kite': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'kiwi': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'knife': { badges: ['add', 'check', 'close', 'remove'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'knight-helmet': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['hexagon'] }, // vbc
  'knob': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'lab-coat': { badges: ['add', 'check', 'close', 'remove'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'label-maker': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'ladder': { badges: ['add', 'check', 'close', 'remove'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'ladle': { badges: ['add', 'check', 'close', 'remove'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'ladybug': { badges: ['add', 'check', 'close', 'remove'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'lamp': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'lamp-post': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'lantern': { badges: ['add', 'check', 'close', 'remove'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'lanyard': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'laser-hazard': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'lasso': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'laundry-basket': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'laundry-detergent': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'lavender': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'lawn-mower': { badges: ['add', 'check', 'close', 'remove'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'layout-cards': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'layout-carousel': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'layout-centered': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'layout-columns-3': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'layout-feed': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'layout-gallery': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'layout-hero': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'layout-rows-2': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'layout-rows-3': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'leaf': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'lectern': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'led': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'lemon': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'lens': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'letter-block': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'letter-tray': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'level-up': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'life-jacket': { badges: ['add', 'check', 'close', 'remove'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'life-ring': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'lifeboat': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'lightbulb-eco': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'lighthouse': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'lipstick': { badges: ['add', 'check', 'close', 'remove'], containers: ['circle', 'square'] }, // vbc
  'list-tree': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'loader': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square'] }, // vbc
  'locker': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'log-cabin': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'log-pile': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'logic-gate': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'lollipop': { badges: ['add', 'check', 'close', 'remove'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'lotus': { badges: ['add', 'check', 'close', 'remove'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'low-clearance': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'lunar-lander': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'lunch-tray': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'magnet': { badges: ['add', 'check', 'close', 'remove'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'mail-forward': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square'] }, // vbc
  'makeup-brush': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'mallet': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'manhole': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'map-marked': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'maracas': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'marbles': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'marker': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'market-stall': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'mars-rover': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'mason-jar': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'masquerade-mask': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'match': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'maximize': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'measuring-cup': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'measuring-wheel': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'meat-thermometer': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'medical-cross': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'medicine-cup': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'meeting-table': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['hexagon'] }, // vbc
  'mega-menu': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'menu': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'menu-right': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'message-bottle': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'message-dots': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'message-image': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'message-quote': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'mic': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'mic-stand': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'microscope': { badges: ['add', 'check', 'close', 'remove'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'milk': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'milk-can': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'milk-carton': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'minimize': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'mirror': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'mitten': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'mixer-board': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'modal': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'moka-pot': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'molecule': { badges: ['add', 'check', 'close', 'remove'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'mop': { badges: ['add', 'check', 'close', 'remove'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'more-horizontal': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'more-vertical': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'mortar-pestle': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'mosque': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'motorcycle': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'mountain': { badges: ['add', 'check', 'close', 'remove'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'mouth': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'mri': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['hexagon'] }, // vbc
  'mug': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'multimeter': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'mushroom': { badges: ['add', 'check', 'close', 'remove'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'music-stand': { badges: ['add', 'check', 'close', 'remove'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'nachos': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'nail': { badges: ['add', 'check', 'close', 'remove'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'nail-polish': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'natural-sign': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'necklace': { badges: ['add', 'check', 'close', 'remove'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'necktie': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'needle-thread': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'network-graph': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'neural-network': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square'] }, // vbc
  'nightstand': { badges: ['add', 'check', 'close', 'remove'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'noodles': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'north-arrow': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'notification-dot': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'number-input': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'numpad': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square'] }, // vbc
  'oar': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'oars': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'observatory': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'octopus': { badges: ['add', 'check', 'close', 'remove'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'oil-barrel': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'oil-can': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'olive': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'onigiri': { badges: ['add', 'check', 'close', 'remove'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'onion': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'orbit': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'org-chart': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'ornament': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'oscilloscope': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'otoscope': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'otp': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'oven-mitt': { badges: ['add', 'check', 'close', 'remove'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'owl': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'oxidizer': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'oxygen-tank': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'pacifier': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'pager': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'pagination': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'pagoda': { badges: ['add', 'check', 'close', 'remove'], containers: ['hexagon'] }, // vbc
  'paint-roller': { badges: ['add', 'check', 'close', 'remove'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'paint-scraper': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'pallet-jack': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'palm-tree': { badges: ['add', 'check', 'close', 'remove'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'pancakes': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'paper-lantern': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'paper-shredder': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'paper-towel': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'paperclip': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'parachute': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'paraglider': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['hexagon'] }, // vbc
  'parcel-scale': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'parking-ahead': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'parking-meter': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'party-hat': { badges: ['add', 'check', 'close', 'remove'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'party-popper': { badges: ['add', 'check', 'close', 'remove'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'paw': { badges: ['add', 'check', 'close', 'remove'], containers: ['circle', 'square'] }, // vbc
  'peach': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'peanut': { badges: ['add', 'check', 'close', 'remove'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'pear': { badges: ['add', 'check', 'close', 'remove'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'peas': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'peeler': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'pen-holder': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'penalty-cards': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'pencil-case': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'pendulum': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'penguin': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'pennant': { badges: ['add', 'check', 'close', 'remove'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'percent-circle': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'perfume': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'periodic-table': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square'] }, // vbc
  'periscope': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'pet-carrier': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'petri-dish': { badges: ['add', 'check', 'close', 'remove'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'phi': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'phishing': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'phone-booth': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'phone-call': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'phone-incoming': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square'] }, // vbc
  'piano-keys': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'pickaxe': { badges: ['add', 'check', 'close', 'remove'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'picnic-basket': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'picnic-table': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'picture-frame': { badges: ['add', 'check', 'close', 'remove'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'picture-in-picture': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'pie': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'pier': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'pig': { badges: ['add', 'check', 'close', 'remove'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'pillow': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'pine-cone': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'pine-tree': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'pineapple': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'pinwheel': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'pipe-elbow': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'pipette': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'piston': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'pitcher': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'pitchfork': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'pizza': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'pizza-cutter': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'planet': { badges: ['add', 'check', 'close', 'remove'], containers: ['circle', 'square'] }, // vbc
  'plant-pot': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'play': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'playback-speed': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'playing-cards': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'pliers': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'plumb-bob': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'plunger': { badges: ['add', 'check', 'close', 'remove'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'podium': { badges: ['add', 'check', 'close', 'remove'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'poker-chip': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'polaroid': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'police-badge': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'police-car': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'pool': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'pool-ladder': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'popcorn': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'popover': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'popsicle': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'postmark': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'potion': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'potted-plant': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'pound-circle': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'power': { badges: ['add', 'check', 'close', 'remove'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'power-plant': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'power-socket': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'power-strip': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'printer-3d': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'priority-matrix': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'prism': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'progress-bar': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'progress-ring': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'projector-screen': { badges: ['add', 'check', 'close', 'remove'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'prompt': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'protractor': { badges: ['add', 'check', 'close', 'remove'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'pudding': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'pulley': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'pulse': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'pumpkin': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'punching-bag': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'putty-knife': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'pylon': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'pyramid': { badges: ['add', 'check', 'close', 'remove'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'rabbit': { badges: ['add', 'check', 'close', 'remove'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'rabbit-hat': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'radar': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'radiation': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'radiator': { badges: ['add', 'check', 'close', 'remove'], containers: ['circle', 'square'] }, // vbc
  'radio-button': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'rain-gauge': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'rake': { badges: ['add', 'check', 'close', 'remove'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'ramen': { badges: ['add', 'check', 'close', 'remove'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'razor': { badges: ['add', 'check', 'close', 'remove'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'receipt-tax': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'record': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'recycle': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'red-envelope': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'remove-circle': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'repeat-one': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'restaurant': { badges: ['add', 'check', 'close', 'remove'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'rice-bowl': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'ring': { badges: ['add', 'check', 'close', 'remove'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'road-barrier': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'road-merge': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'road-narrows': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'robot-arm': { badges: ['add', 'check', 'close', 'remove'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'rock': { badges: ['add', 'check', 'close', 'remove'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'rocket': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'rocking-chair': { badges: ['add', 'check', 'close', 'remove'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'rocking-horse': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'roller-coaster': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'roller-skate': { badges: ['add', 'check', 'close', 'remove'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'rose': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'rosette': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'rotary-phone': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'round-bottom-flask': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'rowboat': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'rug': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square'] }, // vbc
  'rugby-ball': { badges: ['add', 'check', 'close', 'remove'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'rupee-circle': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'sailboat': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'salad': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'sale-sign': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'salt-shaker': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'sandal': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'sandcastle': { badges: ['add', 'check', 'close', 'remove'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'sandwich': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'sanitizer': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'santa-hat': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'satellite': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'satellite-phone': { badges: ['add', 'check', 'close', 'remove'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'saturn': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'saucepan': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'saw': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'sawhorse': { badges: ['add', 'check', 'close', 'remove'], containers: ['hexagon'] }, // vbc
  'scaffold': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square'] }, // vbc
  'scaffolding': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square'] }, // vbc
  'scale': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'scale-bar': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'scalpel': { badges: ['add', 'check', 'close', 'remove'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'scan-barcode': { badges: ['add', 'close', 'remove', 'alert'] }, // vb
  'scan-text': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'scarecrow': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'scarf': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'school': { badges: ['add', 'check', 'close', 'remove'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'scissor-lift': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'scoreboard': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'screw': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'screwdriver': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'scroll': { badges: ['add', 'check', 'close', 'remove'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'scrollbar': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'sd-card': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'seagull': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'search-bar': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'seashell': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'seed-packet': { badges: ['add', 'check', 'close', 'remove'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'seedling': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'seesaw': { badges: ['add', 'check', 'close', 'remove'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'segmented-control': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'serum-bottle': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'set-square': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'sewing-machine': { badges: ['add', 'check', 'close', 'remove'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'shampoo': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'share': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'shark-fin': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'sharp-sign': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['hexagon'] }, // vbc
  'sheep': { badges: ['add', 'check', 'close', 'remove'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'ship': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'ship-wheel': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'shorts': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'shovel': { badges: ['add', 'check', 'close', 'remove'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'shuttlecock': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'sidebar-collapse': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'sieve': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'signal-ahead': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'silo': { badges: ['add', 'check', 'close', 'remove'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'sink': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'sippy-cup': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'skateboard': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'skeleton': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'skeleton-loader': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'ski-boot': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'ski-lift': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'skip-forward': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'skirt': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'skis': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square'] }, // vbc
  'skyscraper': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'sled': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'sledgehammer': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'sleep-mask': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'sleigh': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'slide': { badges: ['add', 'check', 'close', 'remove'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'slider-vertical': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'sliders': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'slingshot': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['hexagon'] }, // vbc
  'slot-machine': { badges: ['add', 'check', 'close', 'remove'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'slow-motion': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'snail': { badges: ['add', 'check', 'close', 'remove'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'snake': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'sneaker': { badges: ['add', 'check', 'close', 'remove'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'snorkel': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'snowboard': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'snowman': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'snowmobile': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'snowplow': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'soap': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'soap-dispenser': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'soccer-ball': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'sock': { badges: ['add', 'check', 'close', 'remove'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'soda-can': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'soda-cup': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'sofa': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'soldering-iron': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'sort-ascending': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'sound-wave': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'soup': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'spark-plug': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'sparkle': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'spatula': { badges: ['add', 'check', 'close', 'remove'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'speed-bump': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'spell-book': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'spice-jar': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'spider': { badges: ['add', 'check', 'close', 'remove'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'spider-web': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'spinner': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square'] }, // vbc
  'spinning-top': { badges: ['add', 'check', 'close', 'remove'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'spirit-level': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'split-button': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'split-view': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'sponge': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'spool': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'spoon': { badges: ['add', 'check', 'close', 'remove'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'sports-bottle': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'spray-bottle': { badges: ['add', 'check', 'close', 'remove'], containers: ['circle', 'square'] }, // vbc
  'spring': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['square'] }, // vbc
  'sprout': { badges: ['add', 'check', 'close', 'remove'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'spyglass': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'squeegee': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'stadium': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'stage-curtain': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'stairs': { badges: ['add', 'check', 'close', 'remove'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'stand-mixer': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'stapler': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'starfish': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'steak': { badges: ['add', 'check', 'close', 'remove'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'steamer': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'steering-wheel': { badges: ['add', 'check', 'close', 'remove'], containers: ['hexagon'] }, // vbc
  'stepper': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'stethoscope': { badges: ['add', 'check', 'close', 'remove'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'stocking': { badges: ['add', 'check', 'close', 'remove'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'stomach': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'stop': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'stopwatch': { badges: ['add', 'check', 'close', 'remove'], containers: ['circle', 'square'] }, // vbc
  'strategy': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'strawberry': { badges: ['add', 'check', 'close', 'remove'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'stretcher': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'stroller': { badges: ['add', 'check', 'close', 'remove'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'submarine': { badges: ['add', 'check', 'close', 'remove'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'succulent': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'suit-club': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'suit-diamond': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'suit-spade': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'summit': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'sun-hat': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'sun-lounger': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'sundae': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'sundial': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'sunflower': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'sunglasses': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'sunscreen': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'surfboard': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'sushi': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'swimming': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'swimsuit': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'swing': { badges: ['add', 'check', 'close', 'remove'], containers: ['square'] }, // vbc
  'swivel-chair': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'sword': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  't-shirt': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'table-tennis': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'tablet-landscape': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'tablet-pen': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'tabs': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'taco': { badges: ['add', 'check', 'close', 'remove'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'takeout-box': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'tambourine': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'tank-top': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'tape-dispenser': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'tape-roll': { badges: ['check', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'target': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'tea-bag': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'tea-cup': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'teapot': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'telegraph': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'telescope': { badges: ['add', 'check', 'close', 'remove'], containers: ['circle', 'square'] }, // vbc
  'tennis-ball': { badges: ['add', 'check', 'close', 'remove'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'tennis-racket': { badges: ['add', 'check', 'close', 'remove'], containers: ['circle', 'square'] }, // vbc
  'terrain': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'terrarium': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'test-tube': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'test-tube-rack': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'text-input': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'textarea': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'theater-masks': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'therefore': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'thermos': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'thermostat': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'theta': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'thimble': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'this-side-up': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'thread-spool': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'throne': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'tiara': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'tic-tac-toe': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'timeline': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'tipi': { badges: ['add', 'check', 'close', 'remove'], containers: ['hexagon'] }, // vbc
  'tissue-box': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['hexagon'] }, // vbc
  'toast': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'toggle-group': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['hexagon'] }, // vbc
  'toggle-on': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'toilet': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'toilet-paper': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'tomato': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'toolbox': { badges: ['add', 'check', 'close', 'remove'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'tooltip': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'toothbrush': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'toothpaste': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'top-hat': { badges: ['add', 'check', 'close', 'remove'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'torch': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'towel': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'toxic': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'toy-brick': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'trackball': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'tractor': { badges: ['add', 'check', 'close', 'remove'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'trailer': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'train': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'train-front': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'tram': { badges: ['add', 'check', 'close', 'remove'], containers: ['circle', 'square'] }, // vbc
  'trash': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'travel-pillow': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'treadmill': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'treasure-chest': { badges: ['add', 'check', 'close', 'remove'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'treasure-map': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'tree': { badges: ['add', 'check', 'close', 'remove'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'tree-stump': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'triangle-instrument': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'tripod': { badges: ['add', 'check', 'close', 'remove'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'trousers': { badges: ['add', 'check', 'close', 'remove'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'trowel': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'trumpet': { badges: ['add', 'check', 'close', 'remove'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'tsunami': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'tulip': { badges: ['add', 'check', 'close', 'remove'], containers: ['circle', 'hexagon'] }, // vbc
  'tuning-fork': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'tunnel': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'tunnel-ahead': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'turnstile': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'turtle': { badges: ['add', 'check', 'close', 'remove'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'tweezers': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'two-factor': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'two-way-traffic': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'ufo': { badges: ['add', 'check', 'close', 'remove'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'umbrella-stand': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'unicycle': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['square', 'hexagon'] }, // vbc
  'university': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'upload': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'urn': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'usb-c-port': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'usb-hub': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'user-edit': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'user-headset': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'user-voice': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'utility-knife': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'utility-pole': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'van': { badges: ['add', 'check', 'close', 'remove'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'vase': { badges: ['add', 'check', 'close', 'remove'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'vest': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'vial': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'vise': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'volcano': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'volleyball': { badges: ['add', 'check', 'close', 'remove'], containers: ['hexagon'] }, // vbc
  'volume': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'volume-low': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'vr-headset': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'waffle': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'walker': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'walking': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'wall-shelf': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'wardrobe': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'warning': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'watch': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'watchtower': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'water-cooler': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square'] }, // vbc
  'water-tower': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'slider': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square'] }, // vbc
  'subset': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['hexagon'] }, // vbc
  'water-valve': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'water-well': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'watering-can': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'watermelon': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'waveform': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square'] }, // vbc
  'waves': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'weather-balloon': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'wedding-cake': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'weight': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'well': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'whale': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'whale-tail': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'wheat': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'wheelbarrow': { badges: ['add', 'check', 'close', 'remove'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'whisk': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'whistle': { badges: ['add', 'check', 'close', 'remove'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'wifi': { badges: ['add', 'check', 'close', 'remove'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'wildfire': { badges: ['add', 'check', 'close', 'remove'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'wind-turbine': { badges: ['add', 'check', 'close', 'remove'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'windchime': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'windmill': { badges: ['add', 'check', 'close', 'remove'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'window-blinds': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'window-maximize': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'window-restore': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'wine-barrel': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'wine-bottle': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'wine-glass': { badges: ['add', 'check', 'close', 'remove'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'witch-hat': { badges: ['add', 'check', 'close', 'remove'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'won-circle': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'won-sign': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle'] }, // vbc
  'wood-log': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'workbench': { badges: ['add', 'check', 'close', 'remove'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'wrench': { badges: ['add', 'check', 'close', 'remove'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'xylophone': { badges: ['add', 'check', 'close', 'remove'] }, // vb
  'y-junction': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'yacht': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'yarn': { badges: ['add', 'check', 'close', 'remove'], containers: ['circle', 'square'] }, // vbc
  'yarn-ball': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'yen-circle': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'yield-ahead': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'yoga-mat': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'yurt': { badges: ['add', 'check', 'close', 'remove', 'alert'], containers: ['circle', 'square', 'hexagon'] }, // vbc
  'zoom-in': { badges: ['add', 'check', 'close', 'remove', 'alert'] }, // vb
  'alert-octagon': { containers: ['circle', 'square'] }, // vc
  'arrow-arc-right': { containers: ['circle', 'square'] }, // vc
  'arrow-bar-right': { containers: ['circle', 'square'] }, // vc
  'arrow-big-right': { containers: ['circle', 'square'] }, // vc
  'arrow-dashed-right': { containers: ['circle', 'square'] }, // vc
  'arrow-from-bar-right': { containers: ['circle', 'square'] }, // vc
  'arrow-from-dot-right': { containers: ['circle', 'square'] }, // vc
  'arrow-loop': { containers: ['circle', 'square'] }, // vc
  'arrow-right': { containers: ['circle', 'square'] }, // vc
  'arrow-step-right': { containers: ['circle', 'square'] }, // vc
  'arrow-to-dot-right': { containers: ['circle', 'square'] }, // vc
  'arrow-turn-right': { containers: ['circle', 'square'] }, // vc
  'arrow-up-right': { containers: ['circle', 'square'] }, // vc
  'arrow-uturn-left': { containers: ['circle', 'square'] }, // vc
  'arrow-zigzag-right': { containers: ['circle', 'square'] }, // vc
  'arrows-converge': { containers: ['circle'] }, // vc
  'arrows-diagonal': { containers: ['circle', 'square'] }, // vc
  'arrows-diverge': { containers: ['square'] }, // vc
  'arrows-double-right': { containers: ['circle', 'square'] }, // vc
  'arrows-left-right': { containers: ['circle', 'square'] }, // vc
  'arrows-merge': { containers: ['circle', 'square'] }, // vc
  'arrows-split-right': { containers: ['circle', 'square'] }, // vc
  'backspace': { containers: ['circle', 'square'] }, // vc
  'barrier': { containers: ['circle', 'square'] }, // vc
  'bold': { containers: ['circle', 'square'] }, // vc
  'caret-right': { containers: ['circle', 'square'] }, // vc
  'caret-up-down': { containers: ['circle'] }, // vc
  'chevron-right': { containers: ['circle', 'square'] }, // vc
  'chevrons-right': { containers: ['circle', 'square'] }, // vc
  'chevrons-up-down': { containers: ['circle', 'square'] }, // vc
  'clear-format': { containers: ['circle', 'square'] }, // vc
  'clipboard': { containers: ['circle', 'square'] }, // vc
  'comment-mention': { containers: ['circle', 'square'] }, // vc
  'comment-smile': { containers: ['circle', 'square'] }, // vc
  'corner-down-right': { containers: ['circle', 'square'] }, // vc
  'crosswalk': { containers: ['square'] }, // vc
  'cursor-wait': { containers: ['circle', 'square'] }, // vc
  'drop-cap': { containers: ['circle', 'square'] }, // vc
  'elevation': { containers: ['circle', 'square'] }, // vc
  'event-reminder': { containers: ['circle', 'square'] }, // vc
  'expand': { containers: ['circle', 'square'] }, // vc
  'file': { containers: ['circle', 'square'] }, // vc
  'file-text': { containers: ['circle', 'square'] }, // vc
  'find-replace': { containers: ['circle', 'square'] }, // vc
  'fit-screen': { containers: ['circle', 'square'] }, // vc
  'flag-finish': { containers: ['circle', 'square'] }, // vc
  'folder-plain': { containers: ['circle', 'square'] }, // vc
  'font': { containers: ['circle', 'square'] }, // vc
  'hashtag': { containers: ['circle', 'square'] }, // vc
  'heart-crack': { containers: ['circle', 'square'] }, // vc
  'highlight-text': { containers: ['circle', 'square'] }, // vc
  'inbox-badge': { containers: ['circle', 'square'] }, // vc
  'indent': { containers: ['circle', 'square'] }, // vc
  'infinity': { containers: ['circle', 'square'] }, // vc
  'letter-spacing': { containers: ['circle', 'square'] }, // vc
  'line-height': { containers: ['circle', 'square'] }, // vc
  'list': { containers: ['circle', 'square'] }, // vc
  'list-numbered': { containers: ['circle', 'square'] }, // vc
  'location-radius': { containers: ['circle', 'square'] }, // vc
  'lock': { containers: ['circle', 'square'] }, // vc
  'logout': { containers: ['circle', 'square'] }, // vc
  'magic-wand': { containers: ['circle', 'square'] }, // vc
  'mail-open': { containers: ['circle', 'square'] }, // vc
  'map': { containers: ['circle', 'square'] }, // vc
  'note': { containers: ['circle', 'square'] }, // vc
  'paragraph': { containers: ['circle', 'square'] }, // vc
  'pilcrow': { containers: ['circle', 'square'] }, // vc
  'push-notification': { containers: ['circle', 'square'] }, // vc
  'quote': { containers: ['circle', 'square'] }, // vc
  'railway-crossing': { containers: ['circle', 'square'] }, // vc
  'reorder': { containers: ['circle', 'square'] }, // vc
  'repeat': { containers: ['circle', 'square'] }, // vc
  'reply': { containers: ['circle', 'square'] }, // vc
  'repost': { containers: ['circle', 'square'] }, // vc
  'resize-corner': { containers: ['circle', 'square'] }, // vc
  'road': { containers: ['circle', 'square'] }, // vc
  'rotate-cw': { containers: ['circle', 'square'] }, // vc
  'roundabout': { containers: ['circle', 'square'] }, // vc
  'scissors': { containers: ['circle', 'square'] }, // vc
  'select-all': { containers: ['circle', 'square'] }, // vc
  'select-area': { containers: ['circle', 'square'] }, // vc
  'sentence-case': { containers: ['circle', 'square'] }, // vc
  'settings': { containers: ['circle', 'square'] }, // vc
  'shield': { containers: ['circle', 'square'] }, // vc
  'shuffle': { containers: ['circle', 'square'] }, // vc
  'signpost': { containers: ['circle', 'square'] }, // vc
  'snackbar': { containers: ['circle', 'square'] }, // vc
  'stop-sign': { containers: ['circle', 'square'] }, // vc
  'superscript': { containers: ['circle', 'square'] }, // vc
  'swap-horizontal': { containers: ['circle', 'square'] }, // vc
  'swipe': { containers: ['circle', 'square'] }, // vc
  'text-align-left': { containers: ['circle', 'square'] }, // vc
  'text-box': { containers: ['circle', 'square'] }, // vc
  'text-color': { containers: ['circle', 'square'] }, // vc
  'text-rtl': { containers: ['circle', 'square'] }, // vc
  'text-size': { containers: ['circle', 'square'] }, // vc
  'text-wrap': { containers: ['circle', 'square'] }, // vc
  'toll-booth': { containers: ['circle', 'square'] }, // vc
  'traffic-cone': { containers: ['circle', 'square'] }, // vc
  'translate': { containers: ['circle', 'square'] }, // vc
  'trend-up': { containers: ['circle', 'square'] }, // vc
  'underline': { containers: ['circle', 'square'] }, // vc
  'undo': { containers: ['circle', 'square'] }, // vc
  'uppercase': { containers: ['circle', 'square'] }, // vc
  'verified': { containers: ['circle', 'square'] }, // vc
  'window': { containers: ['circle', 'square'] }, // vc
  'yield-sign': { containers: ['circle', 'square'] }, // vc
  'accessibility': { containers: ['circle', 'square'] }, // vc
  'anemometer': { containers: ['circle', 'square', 'hexagon'] }, // vc
  'angle': { containers: ['circle', 'square', 'hexagon'] }, // vc
  'aquarius': { containers: ['hexagon'] }, // vc
  'arrow-wave-right': { containers: ['hexagon'] }, // vc
  'aurora': { containers: ['circle', 'square', 'hexagon'] }, // vc
  'avalanche': { containers: ['circle', 'square', 'hexagon'] }, // vc
  'box-open': { containers: ['circle', 'square', 'hexagon'] }, // vc
  'braille': { containers: ['circle', 'square', 'hexagon'] }, // vc
  'calendar-plain': { containers: ['circle', 'square', 'hexagon'] }, // vc
  'celsius': { containers: ['circle', 'square', 'hexagon'] }, // vc
  'clock': { containers: ['circle', 'square', 'hexagon'] }, // vc
  'closed-captions': { containers: ['circle', 'square', 'hexagon'] }, // vc
  'cloudy': { containers: ['circle', 'square', 'hexagon'] }, // vc
  'comet': { containers: ['circle', 'square', 'hexagon'] }, // vc
  'contrast': { containers: ['hexagon'] }, // vc
  'crosshair': { containers: ['hexagon'] }, // vc
  'cursor-help': { containers: ['hexagon'] }, // vc
  'database-backup': { containers: ['circle', 'square', 'hexagon'] }, // vc
  'dice-six': { containers: ['circle', 'square', 'hexagon'] }, // vc
  'drought': { containers: ['circle', 'square', 'hexagon'] }, // vc
  'dust-storm': { containers: ['circle', 'square', 'hexagon'] }, // vc
  'eclipse': { containers: ['hexagon'] }, // vc
  'element-of': { containers: ['circle', 'square', 'hexagon'] }, // vc
  'exists': { containers: ['circle', 'square', 'hexagon'] }, // vc
  'eye': { containers: ['hexagon'] }, // vc
  'fahrenheit': { containers: ['circle', 'square', 'hexagon'] }, // vc
  'focus-ring': { containers: ['circle', 'square', 'hexagon'] }, // vc
  'for-all': { containers: ['circle', 'square', 'hexagon'] }, // vc
  'function': { containers: ['circle', 'square', 'hexagon'] }, // vc
  'gradient': { containers: ['circle', 'square', 'hexagon'] }, // vc
  'haze': { containers: ['circle', 'square', 'hexagon'] }, // vc
  'heading': { containers: ['hexagon'] }, // vc
  'hearing-loop': { containers: ['circle', 'square', 'hexagon'] }, // vc
  'icicle': { containers: ['hexagon'] }, // vc
  'icicles': { containers: ['circle', 'square'] }, // vc
  'integral': { containers: ['circle', 'square', 'hexagon'] }, // vc
  'letter-b': { containers: ['hexagon'] }, // vc
  'letter-o': { containers: ['hexagon'] }, // vc
  'lightning': { containers: ['circle', 'square', 'hexagon'] }, // vc
  'math': { containers: ['circle', 'square', 'hexagon'] }, // vc
  'moon': { containers: ['circle', 'square', 'hexagon'] }, // vc
  'moon-phase': { containers: ['circle', 'square', 'hexagon'] }, // vc
  'moon-stars': { containers: ['circle', 'square'] }, // vc
  'move': { containers: ['hexagon'] }, // vc
  'opacity': { containers: ['circle', 'square', 'hexagon'] }, // vc
  'palette': { containers: ['circle', 'square', 'hexagon'] }, // vc
  'parallel': { containers: ['circle', 'square', 'hexagon'] }, // vc
  'pattern': { containers: ['circle', 'square', 'hexagon'] }, // vc
  'pencil-ruler': { containers: ['circle', 'square', 'hexagon'] }, // vc
  'perpendicular': { containers: ['circle', 'square', 'hexagon'] }, // vc
  'perspective': { containers: ['circle', 'square', 'hexagon'] }, // vc
  'quill': { containers: ['circle', 'square', 'hexagon'] }, // vc
  'regex': { containers: ['circle', 'square', 'hexagon'] }, // vc
  'registered': { containers: ['hexagon'] }, // vc
  'resistor': { containers: ['circle', 'square', 'hexagon'] }, // vc
  'ruler': { containers: ['circle', 'square', 'hexagon'] }, // vc
  'selection': { containers: ['circle', 'square'] }, // vc
  'shadow': { containers: ['circle', 'square', 'hexagon'] }, // vc
  'shapes': { containers: ['circle', 'square', 'hexagon'] }, // vc
  'sitemap': { containers: ['circle', 'square', 'hexagon'] }, // vc
  'snow': { containers: ['circle', 'square', 'hexagon'] }, // vc
  'snow-globe': { containers: ['circle', 'square', 'hexagon'] }, // vc
  'snowflake': { containers: ['hexagon'] }, // vc
  'spacing': { containers: ['circle', 'square', 'hexagon'] }, // vc
  'spiral': { containers: ['circle', 'square', 'hexagon'] }, // vc
  'step-over': { containers: ['circle', 'square', 'hexagon'] }, // vc
  'strikethrough': { containers: ['hexagon'] }, // vc
  'subtract': { containers: ['circle', 'square', 'hexagon'] }, // vc
  'suitcase': { containers: ['circle', 'square', 'hexagon'] }, // vc
  'sun-dim': { containers: ['circle', 'square', 'hexagon'] }, // vc
  'sunrise': { containers: ['circle', 'square', 'hexagon'] }, // vc
  'swatch-book': { containers: ['circle', 'square', 'hexagon'] }, // vc
  'tape-measure': { containers: ['circle', 'square', 'hexagon'] }, // vc
  'tide': { containers: ['circle', 'square', 'hexagon'] }, // vc
  'tombstone': { containers: ['circle', 'square', 'hexagon'] }, // vc
  'tornado': { containers: ['circle', 'square', 'hexagon'] }, // vc
  'union': { containers: ['circle', 'square', 'hexagon'] }, // vc
  'user-tie': { containers: ['circle', 'square', 'hexagon'] }, // vc
  'variable': { containers: ['circle', 'square', 'hexagon'] }, // vc
  'wheelchair': { containers: ['circle', 'square', 'hexagon'] }, // vc
  'white-cane': { containers: ['circle', 'square', 'hexagon'] }, // vc
  'wind': { containers: ['circle', 'square', 'hexagon'] }, // vc
  'windsock': { containers: ['circle', 'square', 'hexagon'] }, // vc
  'windvane': { containers: ['circle', 'square', 'hexagon'] }, // vc
};

export { OBJ, FULL };
