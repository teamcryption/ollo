/**
 * Card terminal: a handheld payment terminal lying on the counter, a card
 * standing in the slot at its head, a screen and a twelve-key pad. The
 * pointer presses the key under it: the key sinks into the body and the
 * keys around it dip a little, staggered from it. At rest the confirm key
 * is half pressed, bright. The slider is the stagger.
 *
 * The pattern: a field of keys pressing (pianokeys), on a face plane.
 */
const {
  Cam, fit, facing, poly, prism, proj, rings, ringAt, rrect, unproj, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const BZ = 10, KH = 5, DIP = 4.2, COLS = 3, ROWS = 4, KX = 14, KY = 10.5, X0 = 10, Y0 = 43, KW = 11, KD = 7.6, FAV = 11;
const NAMES = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "clr", "0", "ok"];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.4);
  fit(C, [[0, -24, 0], [62, 92, 0], [62, -24, 0], [0, 92, 0], [12, -24, 30], [50, -24, 30]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  // the card, standing up out of the slot at the far end
  const [cr, ci] = rings(14, -3, 48, -1.6, 0.6, 0.4);
  put(solid(g), prism(P, front, cr, ci, 4, 30));
  const [br, bi] = rings(0, 0, 62, 92, 9, 2);
  put(solid(g), prism(P, front, br, bi, 0, BZ));
  mk("path", { d: poly(ringAt(P, rrect(18, 3, 44, 5, 1, 4), BZ)), class: "lo" }, g);
  mk("path", { d: poly(ringAt(P, rrect(9, 10, 53, 35, 3, 4), BZ)), class: "lo" }, g);

  const keys = [];
  for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
    const i = r * COLS + c, x = X0 + c * KX + KW / 2 + 1, y = Y0 + r * KY + KD / 2;
    keys.push({ i, r, c, x, y, s: null, d: tween(i === FAV ? DIP * 0.6 : 0), last: NaN });
  }
  // paint back to front, by ascending x + y
  keys.slice().sort((a, b) => a.x + a.y - (b.x + b.y)).forEach((k) => { k.s = solid(g); });

  function draw(k, dip) {
    if (dip === k.last) return;
    k.last = dip;
    const [kr, ki] = rings(k.x - KW / 2, k.y - KD / 2, k.x + KW / 2, k.y + KD / 2, 2, 0.9);
    put(k.s, prism(P, front, kr, ki, BZ, BZ + KH - dip));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const k of keys) { draw(k, tval(k.d, now)); if (!tdone(k.d, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  function hit([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, BZ + KH);
    for (const k of keys) if (Math.abs(x - k.x) < KX / 2 && Math.abs(y - k.y) < KY / 2) return k.i;
    return -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    const fr = from >= 0 ? keys[from] : null, ak = a >= 0 ? keys[a] : null;
    keys.forEach((k) => {
      const dd = ak ? Math.max(Math.abs(k.r - ak.r), Math.abs(k.c - ak.c)) : 9;
      const d = !ak ? (k.i === FAV ? DIP * 0.6 : 0) : dd === 0 ? DIP : dd === 1 ? 1.2 : 0;
      tset(k.d, d, now, fr ? Math.hypot(k.r - fr.r, k.c - fr.c) * stag : 0);
      k.s.sil.classList.toggle("hi", k.i === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "key " + NAMES[a];
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "cardterminal",
  means: "A card terminal with a card in its slot: the key under the pointer presses into the body and the keys around it dip.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[152, 159], [159, 180], [147, 209], null],
  mount,
});
