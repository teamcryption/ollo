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
  'abacus': { badges: ['add', 'check', 'close'] }, // vb
  'accordion': { badges: ['add', 'check', 'close'] }, // vb
  'acorn': { badges: ['add', 'check', 'close'] }, // vb
  'add-circle': { badges: ['add', 'check', 'close'] }, // vb
  'ai-agent': { badges: ['add', 'check', 'close'] }, // vb
  'ai-airplane': { badges: ['add', 'check', 'close'] }, // vb
  'ai-bag': { badges: ['add', 'check', 'close'] }, // vb
  'ai-book': { badges: ['add', 'check', 'close'] }, // vb
  'ai-briefcase': { badges: ['add', 'check', 'close'] }, // vb
  'ai-browser': { badges: ['add', 'check', 'close'] }, // vb
  'ai-bug': { badges: ['add', 'check', 'close'] }, // vb
  'ai-building': { badges: ['add', 'check', 'close'] }, // vb
  'ai-calculator': { badges: ['add', 'check', 'close'] }, // vb
  'ai-car': { badges: ['add', 'check', 'close'] }, // vb
  'ai-cart': { badges: ['add', 'check', 'close'] }, // vb
  'ai-chart': { badges: ['add', 'check', 'close'] }, // vb
  'ai-clipboard': { badges: ['add', 'check', 'close'] }, // vb
  'ai-code': { badges: ['add', 'check', 'close'] }, // vb
  'ai-contract': { badges: ['add', 'check', 'close'] }, // vb
  'ai-cube': { badges: ['add', 'check', 'close'] }, // vb
  'ai-dashboard': { badges: ['add', 'check', 'close'] }, // vb
  'ai-database': { badges: ['add', 'check', 'close'] }, // vb
  'ai-document': { badges: ['add', 'check', 'close'] }, // vb
  'ai-fine-tune': { badges: ['add', 'check', 'close'] }, // vb
  'ai-flask': { badges: ['add', 'check', 'close'] }, // vb
  'ai-folder': { badges: ['add', 'check', 'close'] }, // vb
  'ai-form': { badges: ['add', 'check', 'close'] }, // vb
  'ai-gift': { badges: ['add', 'check', 'close'] }, // vb
  'ai-graduation': { badges: ['add', 'check', 'close'] }, // vb
  'ai-graph': { badges: ['add', 'check', 'close'] }, // vb
  'ai-home': { badges: ['add', 'check', 'close'] }, // vb
  'ai-id': { badges: ['add', 'check', 'close'] }, // vb
  'ai-idea': { badges: ['add', 'check', 'close'] }, // vb
  'ai-image': { badges: ['add', 'check', 'close'] }, // vb
  'ai-inbox': { badges: ['add', 'check', 'close'] }, // vb
  'ai-laptop': { badges: ['add', 'check', 'close'] }, // vb
  'ai-mail': { badges: ['add', 'check', 'close'] }, // vb
  'ai-map': { badges: ['add', 'check', 'close'] }, // vb
  'ai-model': { badges: ['add', 'check', 'close'] }, // vb
  'ai-news': { badges: ['add', 'check', 'close'] }, // vb
  'ai-notes': { badges: ['add', 'check', 'close'] }, // vb
  'ai-package': { badges: ['add', 'check', 'close'] }, // vb
  'ai-palette': { badges: ['add', 'check', 'close'] }, // vb
  'ai-pen': { badges: ['add', 'check', 'close'] }, // vb
  'ai-phone': { badges: ['add', 'check', 'close'] }, // vb
  'ai-plant': { badges: ['add', 'check', 'close'] }, // vb
  'ai-presentation': { badges: ['add', 'check', 'close'] }, // vb
  'ai-receipt': { badges: ['add', 'check', 'close'] }, // vb
  'ai-scan': { badges: ['add', 'check', 'close'] }, // vb
  'ai-server': { badges: ['add', 'check', 'close'] }, // vb
  'ai-sheet': { badges: ['add', 'check', 'close'] }, // vb
  'ai-summary': { badges: ['add', 'check', 'close'] }, // vb
  'ai-support': { badges: ['add', 'check', 'close'] }, // vb
  'ai-target': { badges: ['add', 'check', 'close'] }, // vb
  'ai-terminal': { badges: ['add', 'check', 'close'] }, // vb
  'ai-translate': { badges: ['add', 'check', 'close'] }, // vb
  'ai-video': { badges: ['add', 'check', 'close'] }, // vb
  'ai-vision': { badges: ['add', 'check', 'close'] }, // vb
  'ai-voice': { badges: ['add', 'check', 'close'] }, // vb
  'ai-wallet': { badges: ['add', 'check', 'close'] }, // vb
  'ai-write': { badges: ['add', 'check', 'close'] }, // vb
  'air-conditioner': { badges: ['add', 'check', 'close'] }, // vb
  'airplane-landing': { badges: ['add', 'check', 'close'] }, // vb
  'airplane-takeoff': { badges: ['add', 'check', 'close'] }, // vb
  'airship': { badges: ['add', 'check', 'close'] }, // vb
  'alarm-snooze': { badges: ['add', 'check', 'close'] }, // vb
  'align-object-left': { badges: ['add', 'check', 'close'] }, // vb
  'ambulance': { badges: ['add', 'check', 'close'] }, // vb
  'anchor': { badges: ['add', 'check', 'close'] }, // vb
  'anchor-point': { badges: ['add', 'check', 'close'] }, // vb
  'angle': { badges: ['add', 'check', 'close'] }, // vb
  'ant': { badges: ['add', 'check', 'close'] }, // vb
  'antenna': { badges: ['add', 'check', 'close'] }, // vb
  'anvil': { badges: ['add', 'check', 'close'] }, // vb
  'aperture': { badges: ['add', 'check', 'close'] }, // vb
  'api': { badges: ['add', 'check', 'close'] }, // vb
  'apple': { badges: ['add', 'check', 'close'] }, // vb
  'apron': { badges: ['add', 'check', 'close'] }, // vb
  'arcade': { badges: ['add', 'check', 'close'] }, // vb
  'arch': { badges: ['add', 'check', 'close'] }, // vb
  'area': { badges: ['add', 'check', 'close'] }, // vb
  'armchair': { badges: ['add', 'check', 'close'] }, // vb
  'aspect-ratio': { badges: ['add', 'check', 'close'] }, // vb
  'asteroid': { badges: ['add', 'check', 'close'] }, // vb
  'astronaut': { badges: ['add', 'check', 'close'] }, // vb
  'at-sign': { badges: ['add', 'check', 'close'] }, // vb
  'atlas': { badges: ['add', 'check', 'close'] }, // vb
  'atom': { badges: ['add', 'check', 'close'] }, // vb
  'atv': { badges: ['add', 'check', 'close'] }, // vb
  'automation': { badges: ['add', 'check', 'close'] }, // vb
  'avatar-group': { badges: ['add', 'check', 'close'] }, // vb
  'avocado': { badges: ['add', 'check', 'close'] }, // vb
  'awareness-ribbon': { badges: ['add', 'check', 'close'] }, // vb
  'axe': { badges: ['add', 'check', 'close'] }, // vb
  'baby': { badges: ['add', 'check', 'close'] }, // vb
  'baby-bottle': { badges: ['add', 'check', 'close'] }, // vb
  'baby-monitor': { badges: ['add', 'check', 'close'] }, // vb
  'bacon': { badges: ['add', 'check', 'close'] }, // vb
  'bacteria': { badges: ['add', 'check', 'close'] }, // vb
  'bagel': { badges: ['add', 'check', 'close'] }, // vb
  'baggage-claim': { badges: ['add', 'check', 'close'] }, // vb
  'baguette': { badges: ['add', 'check', 'close'] }, // vb
  'balloon': { badges: ['add', 'check', 'close'] }, // vb
  'bamboo': { badges: ['add', 'check', 'close'] }, // vb
  'banana': { badges: ['add', 'check', 'close'] }, // vb
  'bandage': { badges: ['add', 'check', 'close'] }, // vb
  'banknotes': { badges: ['add', 'check', 'close'] }, // vb
  'bao': { badges: ['add', 'check', 'close'] }, // vb
  'bar-stool': { badges: ['add', 'check', 'close'] }, // vb
  'barbell': { badges: ['add', 'check', 'close'] }, // vb
  'barber-pole': { badges: ['add', 'check', 'close'] }, // vb
  'barcode-scanner': { badges: ['add', 'check', 'close'] }, // vb
  'barn': { badges: ['add', 'check', 'close'] }, // vb
  'baseball': { badges: ['add', 'check', 'close'] }, // vb
  'baseball-bat': { badges: ['add', 'check', 'close'] }, // vb
  'basketball': { badges: ['add', 'check', 'close'] }, // vb
  'basketball-hoop': { badges: ['add', 'check', 'close'] }, // vb
  'bass-clef': { badges: ['add', 'check', 'close'] }, // vb
  'bat': { badges: ['add', 'check', 'close'] }, // vb
  'bathroom-scale': { badges: ['add', 'check', 'close'] }, // vb
  'bathtub': { badges: ['add', 'check', 'close'] }, // vb
  'battery': { badges: ['add', 'check', 'close'] }, // vb
  'battery-aa': { badges: ['add', 'check', 'close'] }, // vb
  'bauble': { badges: ['add', 'check', 'close'] }, // vb
  'bbq-grill': { badges: ['add', 'check', 'close'] }, // vb
  'beach-ball': { badges: ['add', 'check', 'close'] }, // vb
  'beach-umbrella': { badges: ['add', 'check', 'close'] }, // vb
  'beaker': { badges: ['add', 'check', 'close'] }, // vb
  'beanie': { badges: ['add', 'check', 'close'] }, // vb
  'bedtime': { badges: ['add', 'check', 'close'] }, // vb
  'bee': { badges: ['add', 'check', 'close'] }, // vb
  'beehive': { badges: ['add', 'check', 'close'] }, // vb
  'beer-mug': { badges: ['add', 'check', 'close'] }, // vb
  'bell-pepper': { badges: ['add', 'check', 'close'] }, // vb
  'belt': { badges: ['add', 'check', 'close'] }, // vb
  'bench': { badges: ['add', 'check', 'close'] }, // vb
  'bento': { badges: ['add', 'check', 'close'] }, // vb
  'beta': { badges: ['add', 'check', 'close'] }, // vb
  'bezier-curve': { badges: ['add', 'check', 'close'] }, // vb
  'bib': { badges: ['add', 'check', 'close'] }, // vb
  'bicycle': { badges: ['add', 'check', 'close'] }, // vb
  'bike-helmet': { badges: ['add', 'check', 'close'] }, // vb
  'bike-rack': { badges: ['add', 'check', 'close'] }, // vb
  'billboard': { badges: ['add', 'check', 'close'] }, // vb
  'binary': { badges: ['add', 'check', 'close'] }, // vb
  'binary-tree': { badges: ['add', 'check', 'close'] }, // vb
  'binder-clip': { badges: ['add', 'check', 'close'] }, // vb
  'binoculars': { badges: ['add', 'check', 'close'] }, // vb
  'biofuel': { badges: ['add', 'check', 'close'] }, // vb
  'bird': { badges: ['add', 'check', 'close'] }, // vb
  'bird-bath': { badges: ['add', 'check', 'close'] }, // vb
  'bird-feeder': { badges: ['add', 'check', 'close'] }, // vb
  'birdcage': { badges: ['add', 'check', 'close'] }, // vb
  'birdhouse': { badges: ['add', 'check', 'close'] }, // vb
  'blend': { badges: ['add', 'check', 'close'] }, // vb
  'blood-bag': { badges: ['add', 'check', 'close'] }, // vb
  'blood-drop': { badges: ['add', 'check', 'close'] }, // vb
  'blueprint': { badges: ['add', 'check', 'close'] }, // vb
  'bolt': { badges: ['add', 'check', 'close'] }, // vb
  'bomb': { badges: ['add', 'check', 'close'] }, // vb
  'bone': { badges: ['add', 'check', 'close'] }, // vb
  'bongo': { badges: ['add', 'check', 'close'] }, // vb
  'bonsai': { badges: ['add', 'check', 'close'] }, // vb
  'book-open': { badges: ['add', 'check', 'close'] }, // vb
  'bookend': { badges: ['add', 'check', 'close'] }, // vb
  'bookshelf': { badges: ['add', 'check', 'close'] }, // vb
  'boomerang': { badges: ['add', 'check', 'close'] }, // vb
  'boot': { badges: ['add', 'check', 'close'] }, // vb
  'bottle': { badges: ['add', 'check', 'close'] }, // vb
  'bottle-cap': { badges: ['add', 'check', 'close'] }, // vb
  'bottle-opener': { badges: ['add', 'check', 'close'] }, // vb
  'bow-arrow': { badges: ['add', 'check', 'close'] }, // vb
  'bow-tie': { badges: ['add', 'check', 'close'] }, // vb
  'bowl': { badges: ['add', 'check', 'close'] }, // vb
  'bowling': { badges: ['add', 'check', 'close'] }, // vb
  'box-plot': { badges: ['add', 'check', 'close'] }, // vb
  'boxing-glove': { badges: ['add', 'check', 'close'] }, // vb
  'boxing-ring': { badges: ['add', 'check', 'close'] }, // vb
  'braces': { badges: ['add', 'check', 'close'] }, // vb
  'brackets': { badges: ['add', 'check', 'close'] }, // vb
  'brain': { badges: ['add', 'check', 'close'] }, // vb
  'branch': { badges: ['add', 'check', 'close'] }, // vb
  'bread': { badges: ['add', 'check', 'close'] }, // vb
  'breadboard': { badges: ['add', 'check', 'close'] }, // vb
  'breadcrumb': { badges: ['add', 'check', 'close'] }, // vb
  'breakpoint': { badges: ['add', 'check', 'close'] }, // vb
  'brick-wall': { badges: ['add', 'check', 'close'] }, // vb
  'bricks': { badges: ['add', 'check', 'close'] }, // vb
  'bridge': { badges: ['add', 'check', 'close'] }, // vb
  'bring-to-front': { badges: ['add', 'check', 'close'] }, // vb
  'broccoli': { badges: ['add', 'check', 'close'] }, // vb
  'broom': { badges: ['add', 'check', 'close'] }, // vb
  'brush': { badges: ['add', 'check', 'close'] }, // vb
  'bubble-tea': { badges: ['add', 'check', 'close'] }, // vb
  'bubble-wrap': { badges: ['add', 'check', 'close'] }, // vb
  'bucket': { badges: ['add', 'check', 'close'] }, // vb
  'bucket-hat': { badges: ['add', 'check', 'close'] }, // vb
  'bucket-spade': { badges: ['add', 'check', 'close'] }, // vb
  'building': { badges: ['add', 'check', 'close'] }, // vb
  'bull': { badges: ['add', 'check', 'close'] }, // vb
  'bulldozer': { badges: ['add', 'check', 'close'] }, // vb
  'bunk-bed': { badges: ['add', 'check', 'close'] }, // vb
  'bunsen-burner': { badges: ['add', 'check', 'close'] }, // vb
  'bunting': { badges: ['add', 'check', 'close'] }, // vb
  'buoy': { badges: ['add', 'check', 'close'] }, // vb
  'burger': { badges: ['add', 'check', 'close'] }, // vb
  'bus': { badges: ['add', 'check', 'close'] }, // vb
  'bus-shelter': { badges: ['add', 'check', 'close'] }, // vb
  'bus-stop': { badges: ['add', 'check', 'close'] }, // vb
  'butter': { badges: ['add', 'check', 'close'] }, // vb
  'butterfly': { badges: ['add', 'check', 'close'] }, // vb
  'button': { badges: ['add', 'check', 'close'] }, // vb
  'c-clamp': { badges: ['add', 'check', 'close'] }, // vb
  'cable': { badges: ['add', 'check', 'close'] }, // vb
  'cable-car': { badges: ['add', 'check', 'close'] }, // vb
  'cactus': { badges: ['add', 'check', 'close'] }, // vb
  'cairn': { badges: ['add', 'check', 'close'] }, // vb
  'cake': { badges: ['add', 'check', 'close'] }, // vb
  'cake-slice': { badges: ['add', 'check', 'close'] }, // vb
  'calculator': { badges: ['add', 'check', 'close'] }, // vb
  'calendar-note': { badges: ['close'] }, // vb
  'calendar-repeat': { badges: ['add', 'check', 'close'] }, // vb
  'campfire': { badges: ['add', 'check', 'close'] }, // vb
  'camping-stove': { badges: ['add', 'check', 'close'] }, // vb
  'candelabra': { badges: ['add', 'check', 'close'] }, // vb
  'candle': { badges: ['add', 'check', 'close'] }, // vb
  'candle-holder': { badges: ['add', 'check', 'close'] }, // vb
  'candy': { badges: ['add', 'check', 'close'] }, // vb
  'candy-cane': { badges: ['add', 'check', 'close'] }, // vb
  'cannon': { badges: ['add', 'check', 'close'] }, // vb
  'cap': { badges: ['add', 'check', 'close'] }, // vb
  'capacitor': { badges: ['add', 'check', 'close'] }, // vb
  'captain-hat': { badges: ['add', 'check', 'close'] }, // vb
  'car': { badges: ['add', 'check', 'close'] }, // vb
  'car-door': { badges: ['add', 'check', 'close'] }, // vb
  'car-seat': { badges: ['add', 'check', 'close'] }, // vb
  'car-wash': { badges: ['add', 'check', 'close'] }, // vb
  'carabiner': { badges: ['add', 'check', 'close'] }, // vb
  'caravan': { badges: ['add', 'check', 'close'] }, // vb
  'carousel': { badges: ['add', 'check', 'close'] }, // vb
  'carrot': { badges: ['add', 'check', 'close'] }, // vb
  'cashback': { badges: ['add', 'check', 'close'] }, // vb
  'cassette': { badges: ['add', 'check', 'close'] }, // vb
  'castle': { badges: ['add', 'check', 'close'] }, // vb
  'cat': { badges: ['add', 'check', 'close'] }, // vb
  'caterpillar': { badges: ['add', 'check', 'close'] }, // vb
  'cauldron': { badges: ['add', 'check', 'close'] }, // vb
  'caution-tape': { badges: ['add', 'check', 'close'] }, // vb
  'cave': { badges: ['add', 'check', 'close'] }, // vb
  'ceiling-fan': { badges: ['add', 'check', 'close'] }, // vb
  'cell': { badges: ['add', 'check', 'close'] }, // vb
  'cement-bag': { badges: ['add', 'check', 'close'] }, // vb
  'cement-mixer': { badges: ['add', 'check', 'close'] }, // vb
  'center-object': { badges: ['add', 'check', 'close'] }, // vb
  'chair': { badges: ['add', 'check', 'close'] }, // vb
  'chalkboard': { badges: ['add', 'check', 'close'] }, // vb
  'champagne': { badges: ['add', 'check', 'close'] }, // vb
  'chandelier': { badges: ['add', 'check', 'close'] }, // vb
  'chapel': { badges: ['add', 'check', 'close'] }, // vb
  'chart-area': { badges: ['add', 'check', 'close'] }, // vb
  'chart-area-stacked': { badges: ['add', 'check', 'close'] }, // vb
  'chart-bar-horizontal': { badges: ['add', 'check', 'close'] }, // vb
  'chart-bubble': { badges: ['add', 'check', 'close'] }, // vb
  'chart-candles': { badges: ['add', 'check', 'close'] }, // vb
  'chart-coin': { badges: ['add', 'check', 'close'] }, // vb
  'chart-decline': { badges: ['add', 'check', 'close'] }, // vb
  'chart-dumbbell': { badges: ['add', 'check', 'close'] }, // vb
  'chart-forecast': { badges: ['add', 'check', 'close'] }, // vb
  'chart-gantt': { badges: ['add', 'check', 'close'] }, // vb
  'chart-grouped': { badges: ['add', 'check', 'close'] }, // vb
  'chart-growth': { badges: ['add', 'check', 'close'] }, // vb
  'chart-histogram': { badges: ['add', 'check', 'close'] }, // vb
  'chart-line-multi': { badges: ['add', 'check', 'close'] }, // vb
  'chart-lollipop': { badges: ['add', 'check', 'close'] }, // vb
  'chart-mixed': { badges: ['add', 'check', 'close'] }, // vb
  'chart-points': { badges: ['add', 'check', 'close'] }, // vb
  'chart-polar': { badges: ['add', 'check', 'close'] }, // vb
  'chart-pyramid': { badges: ['add', 'check', 'close'] }, // vb
  'chart-radar': { badges: ['add', 'check', 'close'] }, // vb
  'chart-range': { badges: ['add', 'check', 'close'] }, // vb
  'chart-sankey': { badges: ['add', 'check', 'close'] }, // vb
  'chart-scatter': { badges: ['add', 'check', 'close'] }, // vb
  'chart-slope': { badges: ['add', 'check', 'close'] }, // vb
  'chart-spline': { badges: ['add', 'check', 'close'] }, // vb
  'chart-stacked': { badges: ['add', 'check', 'close'] }, // vb
  'chart-step': { badges: ['add', 'check', 'close'] }, // vb
  'chart-sunburst': { badges: ['add', 'check', 'close'] }, // vb
  'chart-treemap': { badges: ['add', 'check', 'close'] }, // vb
  'chart-waterfall': { badges: ['add', 'check', 'close'] }, // vb
  'check-circle': { badges: ['add', 'check', 'close'] }, // vb
  'checkbox': { badges: ['add', 'check', 'close'] }, // vb
  'cheers': { badges: ['add', 'check', 'close'] }, // vb
  'cheese': { badges: ['add', 'check', 'close'] }, // vb
  'chef-hat': { badges: ['add', 'check', 'close'] }, // vb
  'cherries': { badges: ['add', 'check', 'close'] }, // vb
  'cherry': { badges: ['add', 'check', 'close'] }, // vb
  'chess-bishop': { badges: ['add', 'check', 'close'] }, // vb
  'chess-king': { badges: ['add', 'check', 'close'] }, // vb
  'chess-knight': { badges: ['add', 'check', 'close'] }, // vb
  'chess-pawn': { badges: ['add', 'check', 'close'] }, // vb
  'chess-queen': { badges: ['add', 'check', 'close'] }, // vb
  'chess-rook': { badges: ['add', 'check', 'close'] }, // vb
  'chili': { badges: ['add', 'check', 'close'] }, // vb
  'chip': { badges: ['add', 'check', 'close'] }, // vb
  'chisel': { badges: ['add', 'check', 'close'] }, // vb
  'chocolate-bar': { badges: ['add', 'check', 'close'] }, // vb
  'chopsticks': { badges: ['add', 'check', 'close'] }, // vb
  'christmas-tree': { badges: ['add', 'check', 'close'] }, // vb
  'church': { badges: ['add', 'check', 'close'] }, // vb
  'cigarette': { badges: ['add', 'check', 'close'] }, // vb
  'circle-dashed': { badges: ['add', 'check', 'close'] }, // vb
  'circuit-board': { badges: ['add', 'check', 'close'] }, // vb
  'circus-tent': { badges: ['add', 'check', 'close'] }, // vb
  'citrus': { badges: ['add', 'check', 'close'] }, // vb
  'city': { badges: ['add', 'check', 'close'] }, // vb
  'claw-machine': { badges: ['add', 'check', 'close'] }, // vb
  'clipboard-list': { badges: ['add', 'check', 'close'] }, // vb
  'cloche': { badges: ['add', 'check', 'close'] }, // vb
  'clock-fast': { badges: ['add', 'check', 'close'] }, // vb
  'clock-tower': { badges: ['add', 'check', 'close'] }, // vb
  'close-circle': { badges: ['add', 'check', 'close'] }, // vb
  'clothes-rack': { badges: ['add', 'check', 'close'] }, // vb
  'clothesline': { badges: ['add', 'check', 'close'] }, // vb
  'clothespin': { badges: ['add', 'check', 'close'] }, // vb
  'cloud-sync': { badges: ['add', 'check', 'close'] }, // vb
  'clover': { badges: ['add', 'check', 'close'] }, // vb
  'coal': { badges: ['add', 'check', 'close'] }, // vb
  'coat-hook': { badges: ['add', 'check', 'close'] }, // vb
  'coat-rack': { badges: ['add', 'check', 'close'] }, // vb
  'cocktail': { badges: ['add', 'check', 'close'] }, // vb
  'cocoon': { badges: ['add', 'check', 'close'] }, // vb
  'code': { badges: ['add', 'check', 'close'] }, // vb
  'code-window': { badges: ['add', 'check', 'close'] }, // vb
  'coffee': { badges: ['add', 'check', 'close'] }, // vb
  'coffee-bean': { badges: ['add', 'check', 'close'] }, // vb
  'coffee-grinder': { badges: ['add', 'check', 'close'] }, // vb
  'coffee-machine': { badges: ['add', 'check', 'close'] }, // vb
  'coffee-to-go': { badges: ['add', 'check', 'close'] }, // vb
  'coffin': { badges: ['add', 'check', 'close'] }, // vb
  'colander': { badges: ['add', 'check', 'close'] }, // vb
  'color-input': { badges: ['add', 'check', 'close'] }, // vb
  'color-picker': { badges: ['add', 'check', 'close'] }, // vb
  'columns': { badges: ['add', 'check', 'close'] }, // vb
  'comb': { badges: ['add', 'check', 'close'] }, // vb
  'command': { badges: ['add', 'check', 'close'] }, // vb
  'command-palette': { badges: ['add', 'check', 'close'] }, // vb
  'compass-rose': { badges: ['add', 'check', 'close'] }, // vb
  'compost': { badges: ['add', 'check', 'close'] }, // vb
  'compost-bin': { badges: ['add', 'check', 'close'] }, // vb
  'confetti': { badges: ['add', 'check', 'close'] }, // vb
  'constellation': { badges: ['add', 'check', 'close'] }, // vb
  'contact-lens': { badges: ['add', 'check', 'close'] }, // vb
  'container-ship': { badges: ['add', 'check', 'close'] }, // vb
  'context-menu': { badges: ['add', 'check', 'close'] }, // vb
  'convertible': { badges: ['add', 'check', 'close'] }, // vb
  'conveyor': { badges: ['add', 'check', 'close'] }, // vb
  'conveyor-belt': { badges: ['add', 'check', 'close'] }, // vb
  'cookie': { badges: ['add', 'check', 'close'] }, // vb
  'cookie-jar': { badges: ['add', 'check', 'close'] }, // vb
  'cooking-pot': { badges: ['add', 'check', 'close'] }, // vb
  'cooling-tower': { badges: ['add', 'check', 'close'] }, // vb
  'coral': { badges: ['add', 'check', 'close'] }, // vb
  'corkscrew': { badges: ['add', 'check', 'close'] }, // vb
  'corn': { badges: ['add', 'check', 'close'] }, // vb
  'corner-radius': { badges: ['add', 'check', 'close'] }, // vb
  'corrosive': { badges: ['add', 'check', 'close'] }, // vb
  'cottage': { badges: ['add', 'check', 'close'] }, // vb
  'cow': { badges: ['add', 'check', 'close'] }, // vb
  'cowboy-hat': { badges: ['add', 'check', 'close'] }, // vb
  'crab': { badges: ['add', 'check', 'close'] }, // vb
  'cradle': { badges: ['add', 'check', 'close'] }, // vb
  'crane': { badges: ['add', 'check', 'close'] }, // vb
  'crane-hook': { badges: ['add', 'check', 'close'] }, // vb
  'crayon': { badges: ['add', 'check', 'close'] }, // vb
  'crib': { badges: ['add', 'check', 'close'] }, // vb
  'crib-mobile': { badges: ['add', 'check', 'close'] }, // vb
  'cricket-bat': { badges: ['add', 'check', 'close'] }, // vb
  'croissant': { badges: ['add', 'check', 'close'] }, // vb
  'crop': { badges: ['add', 'check', 'close'] }, // vb
  'crossroads': { badges: ['add', 'check', 'close'] }, // vb
  'crown': { badges: ['add', 'check', 'close'] }, // vb
  'crutch': { badges: ['add', 'check', 'close'] }, // vb
  'crystal': { badges: ['add', 'check', 'close'] }, // vb
  'crystal-ball': { badges: ['add', 'check', 'close'] }, // vb
  'cupcake': { badges: ['add', 'check', 'close'] }, // vb
  'curling-stone': { badges: ['add', 'check', 'close'] }, // vb
  'cursor-click': { badges: ['add', 'check', 'close'] }, // vb
  'cursor-col-resize': { badges: ['add', 'check', 'close'] }, // vb
  'cursor-zoom': { badges: ['check'] }, // vb
  'curtains': { badges: ['add', 'check', 'close'] }, // vb
  'cutting-board': { badges: ['add', 'check', 'close'] }, // vb
  'dagger': { badges: ['add', 'check', 'close'] }, // vb
  'dam': { badges: ['add', 'check', 'close'] }, // vb
  'dandelion': { badges: ['add', 'check', 'close'] }, // vb
  'dart': { badges: ['add', 'check', 'close'] }, // vb
  'dashboard-gauge': { badges: ['add', 'check', 'close'] }, // vb
  'dead-end': { badges: ['add', 'check', 'close'] }, // vb
  'deep-fryer': { badges: ['add', 'check', 'close'] }, // vb
  'deep-water': { badges: ['add', 'check', 'close'] }, // vb
  'defibrillator': { badges: ['add', 'check', 'close'] }, // vb
  'desert': { badges: ['add', 'check', 'close'] }, // vb
  'desk-globe': { badges: ['add', 'check', 'close'] }, // vb
  'desk-phone': { badges: ['add', 'check', 'close'] }, // vb
  'diamond': { badges: ['add', 'check', 'close'] }, // vb
  'dice': { badges: ['add', 'check', 'close'] }, // vb
  'dice-d20': { badges: ['add', 'check', 'close'] }, // vb
  'diff': { badges: ['add', 'check', 'close'] }, // vb
  'dining-table': { badges: ['add', 'check', 'close'] }, // vb
  'diode': { badges: ['add', 'check', 'close'] }, // vb
  'directions-sign': { badges: ['add', 'check', 'close'] }, // vb
  'disc': { badges: ['add', 'check', 'close'] }, // vb
  'disco-ball': { badges: ['add', 'check', 'close'] }, // vb
  'dish-rack': { badges: ['add', 'check', 'close'] }, // vb
  'dishwasher': { badges: ['add', 'check', 'close'] }, // vb
  'distance': { badges: ['add', 'check', 'close'] }, // vb
  'distribute-horizontal': { badges: ['add', 'check', 'close'] }, // vb
  'divide': { badges: ['add', 'check', 'close'] }, // vb
  'diving-mask': { badges: ['add', 'check', 'close'] }, // vb
  'diya': { badges: ['add', 'check', 'close'] }, // vb
  'djembe': { badges: ['add', 'check', 'close'] }, // vb
  'dock': { badges: ['add', 'check', 'close'] }, // vb
  'dog': { badges: ['add', 'check', 'close'] }, // vb
  'dog-bowl': { badges: ['add', 'check', 'close'] }, // vb
  'doghouse': { badges: ['add', 'check', 'close'] }, // vb
  'dollar-circle': { badges: ['add', 'check', 'close'] }, // vb
  'dollar-sign': { badges: ['add', 'check', 'close'] }, // vb
  'domino': { badges: ['add', 'check', 'close'] }, // vb
  'donut': { badges: ['add', 'check', 'close'] }, // vb
  'door': { badges: ['add', 'check', 'close'] }, // vb
  'download': { badges: ['add', 'check', 'close'] }, // vb
  'drafting-compass': { badges: ['add', 'check', 'close'] }, // vb
  'drag-drop': { badges: ['add', 'check', 'close'] }, // vb
  'dragonfly': { badges: ['add', 'check', 'close'] }, // vb
  'drawing-compass': { badges: ['add', 'check', 'close'] }, // vb
  'dreamcatcher': { badges: ['add', 'check', 'close'] }, // vb
  'dress': { badges: ['add', 'check', 'close'] }, // vb
  'dresser': { badges: ['add', 'check', 'close'] }, // vb
  'drill': { badges: ['add', 'check', 'close'] }, // vb
  'drone': { badges: ['add', 'check', 'close'] }, // vb
  'dropdown': { badges: ['add', 'check', 'close'] }, // vb
  'dropdown-menu': { badges: ['add', 'check', 'close'] }, // vb
  'drum': { badges: ['add', 'check', 'close'] }, // vb
  'drumstick': { badges: ['add', 'check', 'close'] }, // vb
  'duck': { badges: ['add', 'check', 'close'] }, // vb
  'dumbbell': { badges: ['add', 'check', 'close'] }, // vb
  'dumpling': { badges: ['add', 'check', 'close'] }, // vb
  'dustpan': { badges: ['add', 'check', 'close'] }, // vb
  'earbuds': { badges: ['add', 'check', 'close'] }, // vb
  'earring': { badges: ['add', 'check', 'close'] }, // vb
  'earthquake': { badges: ['add', 'check', 'close'] }, // vb
  'easel': { badges: ['add', 'check', 'close'] }, // vb
  'easter-egg': { badges: ['add', 'check', 'close'] }, // vb
  'egg-cracked': { badges: ['add', 'check', 'close'] }, // vb
  'egg-fried': { badges: ['add', 'check', 'close'] }, // vb
  'eggplant': { badges: ['add', 'check', 'close'] }, // vb
  'eject': { badges: ['add', 'check', 'close'] }, // vb
  'elderly': { badges: ['add', 'check', 'close'] }, // vb
  'element-of': { badges: ['add', 'check', 'close'] }, // vb
  'environment-hazard': { badges: ['add', 'check', 'close'] }, // vb
  'equalizer': { badges: ['add', 'check', 'close'] }, // vb
  'eraser': { badges: ['add', 'check', 'close'] }, // vb
  'escalator': { badges: ['add', 'check', 'close'] }, // vb
  'ethernet': { badges: ['add', 'check', 'close'] }, // vb
  'euro-circle': { badges: ['add', 'check', 'close'] }, // vb
  'excavator': { badges: ['add', 'check', 'close'] }, // vb
  'exchange': { badges: ['add', 'check', 'close'] }, // vb
  'exclude': { badges: ['add', 'check', 'close'] }, // vb
  'exists': { badges: ['add', 'check', 'close'] }, // vb
  'explosive': { badges: ['add', 'check', 'close'] }, // vb
  'external-link': { badges: ['add', 'check', 'close'] }, // vb
  'eye-chart': { badges: ['add', 'check', 'close'] }, // vb
  'eye-drops': { badges: ['add', 'check', 'close'] }, // vb
  'face-cream': { badges: ['add', 'check', 'close'] }, // vb
  'face-mask': { badges: ['add', 'check', 'close'] }, // vb
  'fast-forward': { badges: ['add', 'check', 'close'] }, // vb
  'faucet': { badges: ['add', 'check', 'close'] }, // vb
  'feather': { badges: ['add', 'check', 'close'] }, // vb
  'fence': { badges: ['add', 'check', 'close'] }, // vb
  'fern': { badges: ['add', 'check', 'close'] }, // vb
  'ferris-wheel': { badges: ['add', 'check', 'close'] }, // vb
  'ferry': { badges: ['add', 'check', 'close'] }, // vb
  'file-audio': { badges: ['add', 'check', 'close'] }, // vb
  'file-chart': { badges: ['add', 'check', 'close'] }, // vb
  'file-diff': { badges: ['add', 'check', 'close'] }, // vb
  'file-dollar': { badges: ['add', 'check', 'close'] }, // vb
  'file-font': { badges: ['add', 'check', 'close'] }, // vb
  'file-input': { badges: ['add', 'check', 'close'] }, // vb
  'file-json': { badges: ['add', 'check', 'close'] }, // vb
  'file-link': { badges: ['add', 'check', 'close'] }, // vb
  'file-log': { badges: ['add', 'check', 'close'] }, // vb
  'file-pen': { badges: ['add', 'check', 'close'] }, // vb
  'file-signature': { badges: ['add', 'check', 'close'] }, // vb
  'file-sync': { badges: ['add', 'check', 'close'] }, // vb
  'file-terminal': { badges: ['add', 'check', 'close'] }, // vb
  'file-video': { badges: ['add', 'check', 'close'] }, // vb
  'filing-cabinet': { badges: ['add', 'check', 'close'] }, // vb
  'fill-stroke': { badges: ['add', 'close'] }, // vb
  'film-reel': { badges: ['add', 'check', 'close'] }, // vb
  'film-roll': { badges: ['add', 'check', 'close'] }, // vb
  'film-strip': { badges: ['add', 'check', 'close'] }, // vb
  'fire-hydrant': { badges: ['add', 'check', 'close'] }, // vb
  'firecracker': { badges: ['add', 'check', 'close'] }, // vb
  'fireplace': { badges: ['add', 'check', 'close'] }, // vb
  'fireworks': { badges: ['add', 'check', 'close'] }, // vb
  'fish': { badges: ['add', 'check', 'close'] }, // vb
  'fish-hook': { badges: ['add', 'check', 'close'] }, // vb
  'fishbowl': { badges: ['add', 'check', 'close'] }, // vb
  'fishing-boat': { badges: ['add', 'check', 'close'] }, // vb
  'fishing-float': { badges: ['add', 'check', 'close'] }, // vb
  'fishing-rod': { badges: ['add', 'check', 'close'] }, // vb
  'fitness-tracker': { badges: ['add', 'check', 'close'] }, // vb
  'flammable': { badges: ['add', 'check', 'close'] }, // vb
  'flat-sign': { badges: ['add', 'check', 'close'] }, // vb
  'flip-flops': { badges: ['add', 'check', 'close'] }, // vb
  'flip-horizontal': { badges: ['add', 'check', 'close'] }, // vb
  'flipchart': { badges: ['add', 'check', 'close'] }, // vb
  'flood': { badges: ['add', 'check', 'close'] }, // vb
  'flood-zone': { badges: ['add', 'check', 'close'] }, // vb
  'flower': { badges: ['add', 'check', 'close'] }, // vb
  'folder-chart': { badges: ['add', 'check', 'close'] }, // vb
  'folder-code': { badges: ['add', 'check', 'close'] }, // vb
  'folder-dollar': { badges: ['add', 'check', 'close'] }, // vb
  'folder-globe': { badges: ['add', 'check', 'close'] }, // vb
  'folder-link': { badges: ['add', 'check', 'close'] }, // vb
  'folder-mail': { badges: ['add', 'check', 'close'] }, // vb
  'folder-open': { badges: ['add', 'check', 'close'] }, // vb
  'folder-sync': { badges: ['add', 'check', 'close'] }, // vb
  'folder-terminal': { badges: ['add', 'check', 'close'] }, // vb
  'folder-tree': { badges: ['add', 'check', 'close'] }, // vb
  'folder-video': { badges: ['add', 'check', 'close'] }, // vb
  'food-processor': { badges: ['add', 'check', 'close'] }, // vb
  'football-helmet': { badges: ['add', 'check', 'close'] }, // vb
  'for-all': { badges: ['add', 'check', 'close'] }, // vb
  'forest': { badges: ['add', 'check', 'close'] }, // vb
  'forklift': { badges: ['add', 'check', 'close'] }, // vb
  'fossil': { badges: ['add', 'check', 'close'] }, // vb
  'fountain': { badges: ['add', 'check', 'close'] }, // vb
  'fountain-pen': { badges: ['add', 'check', 'close'] }, // vb
  'fox': { badges: ['add', 'check', 'close'] }, // vb
  'fragile': { badges: ['add', 'check', 'close'] }, // vb
  'frame': { badges: ['add', 'check', 'close'] }, // vb
  'french-press': { badges: ['add', 'check', 'close'] }, // vb
  'fries': { badges: ['add', 'check', 'close'] }, // vb
  'frisbee': { badges: ['add', 'check', 'close'] }, // vb
  'frog': { badges: ['add', 'check', 'close'] }, // vb
  'frying-pan': { badges: ['add', 'check', 'close'] }, // vb
  'fuel-gauge': { badges: ['add', 'check', 'close'] }, // vb
  'function': { badges: ['add', 'check', 'close'] }, // vb
  'funicular': { badges: ['add', 'check', 'close'] }, // vb
  'funnel-chart': { badges: ['add', 'check', 'close'] }, // vb
  'fuse': { badges: ['add', 'check', 'close'] }, // vb
  'galaxy': { badges: ['add', 'check', 'close'] }, // vb
  'game-cartridge': { badges: ['add', 'check', 'close'] }, // vb
  'gamepad': { badges: ['add', 'check', 'close'] }, // vb
  'garlic': { badges: ['add', 'check', 'close'] }, // vb
  'gas-cylinder': { badges: ['add', 'check', 'close'] }, // vb
  'gas-flame': { badges: ['add', 'check', 'close'] }, // vb
  'gate': { badges: ['add', 'check', 'close'] }, // vb
  'gavel': { badges: ['add', 'check', 'close'] }, // vb
  'gazebo': { badges: ['add', 'check', 'close'] }, // vb
  'gear-shift': { badges: ['add', 'check', 'close'] }, // vb
  'gender-female': { badges: ['add', 'check', 'close'] }, // vb
  'gender-male': { badges: ['add', 'check', 'close'] }, // vb
  'gender-neutral': { badges: ['add', 'check', 'close'] }, // vb
  'generator': { badges: ['add', 'check', 'close'] }, // vb
  'geofence': { badges: ['add', 'check', 'close'] }, // vb
  'gift-bow': { badges: ['add', 'check', 'close'] }, // vb
  'gingerbread': { badges: ['add', 'check', 'close'] }, // vb
  'git-compare': { badges: ['add', 'check', 'close'] }, // vb
  'git-fork': { badges: ['add', 'check', 'close'] }, // vb
  'glass-water': { badges: ['add', 'check', 'close'] }, // vb
  'glasses': { badges: ['add', 'check', 'close'] }, // vb
  'glove': { badges: ['add', 'check', 'close'] }, // vb
  'glucose-meter': { badges: ['add', 'check', 'close'] }, // vb
  'glue': { badges: ['add', 'check', 'close'] }, // vb
  'glue-gun': { badges: ['add', 'check', 'close'] }, // vb
  'glue-stick': { badges: ['add', 'check', 'close'] }, // vb
  'go-kart': { badges: ['add', 'check', 'close'] }, // vb
  'goal-net': { badges: ['add', 'check', 'close'] }, // vb
  'goblet': { badges: ['add', 'check', 'close'] }, // vb
  'goggles': { badges: ['add', 'check', 'close'] }, // vb
  'gold-bars': { badges: ['add', 'check', 'close'] }, // vb
  'gold-pan': { badges: ['add', 'check', 'close'] }, // vb
  'golf': { badges: ['add', 'check', 'close'] }, // vb
  'golf-cart': { badges: ['add', 'check', 'close'] }, // vb
  'golf-tee': { badges: ['add', 'check', 'close'] }, // vb
  'gong': { badges: ['add', 'check', 'close'] }, // vb
  'grade': { badges: ['add', 'check', 'close'] }, // vb
  'graduated-cylinder': { badges: ['add', 'check', 'close'] }, // vb
  'grapes': { badges: ['add', 'check', 'close'] }, // vb
  'grass': { badges: ['add', 'check', 'close'] }, // vb
  'grater': { badges: ['add', 'check', 'close'] }, // vb
  'gravy-boat': { badges: ['add', 'check', 'close'] }, // vb
  'greek-column': { badges: ['add', 'check', 'close'] }, // vb
  'green-energy': { badges: ['add', 'check', 'close'] }, // vb
  'greenhouse': { badges: ['add', 'check', 'close'] }, // vb
  'grid-dots': { badges: ['add', 'check', 'close'] }, // vb
  'grip-vertical': { badges: ['add', 'check', 'close'] }, // vb
  'group-objects': { badges: ['add', 'check', 'close'] }, // vb
  'guitar': { badges: ['add', 'check', 'close'] }, // vb
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
};

export { OBJ, FULL };
