/**
 * Bowling pinsetter: ten pins racked on the lane's end, the sweep bar raised
 * on the bowler's side and the setting deck held high above them. The
 * pointer on the machine runs a cycle: the sweep bar drops in front of the
 * rack and the deck comes down over the pins. At rest the deck is high and
 * bright. The slider is how far the deck comes down.
 *
 * The pattern: one part answering the pointer (a single moving part).
 */
const {
  Cam, circ, facing, fit, hull, poly, prism, proj, rings, ringAt, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const LZ = 4, TOP = 74;
const disc = (x, y, r, n = 16) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));
const PINS = [];
for (let r = 0; r < 4; r++) for (let i = 0; i <= r; i++) PINS.push([72 - r * 15, 45 + (i - r / 2) * 17]);
PINS.sort((a, b) => a[0] + a[1] - b[0] - b[1]);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let drop = value;
  const C = Cam(45, 0.5, 1.72);
  fit(C, [[0, 0, 0], [92, 92, 0], [92, 0, 0], [0, 92, 0], [8, 8, TOP + 6], [82, 82, TOP + 6], [88, 2, 54], [88, 88, 54]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [lr, li] = rings(0, 0, 92, 92, 5, 2);
  put(solid(g), prism(P, front, lr, li, 0, LZ));
  for (const [x, y] of PINS) {
    const pts = [];
    for (const [r, z] of [[2.6, 0], [4.4, 7], [3.4, 13], [1.8, 17], [2.6, 21], [1.8, 24]]) pts.push(...ringAt(P, disc(x, y, r), LZ + z));
    const s = solid(g);
    s.sil.setAttribute("d", poly(hull(pts)));
    s.cr.setAttribute("d", poly(ringAt(P, disc(x, y, 1.9), LZ + 17)));
  }
  // the deck: a thick plate with a socket over every pin
  const arms = mk("path", { class: "nf lo" }, g);
  const deck = solid(g), holes = mk("path", { class: "nf lo" }, g);
  const [dr, di] = rings(8, 8, 84, 84, 14, 2);
  // the sweep bar, on the bowler's side
  const sweep = solid(g);
  const [sr, si] = rings(86, 2, 89, 90, 1.5, 0.7);

  const d = tween(0);
  let last = NaN;
  function draw(t) {
    if (t === last) return;
    last = t;
    const z = TOP - t, sz = 48 - (48 - LZ - 2) * Math.min(1, t / Math.max(drop, 1));
    put(deck, prism(P, front, dr, di, z - 5, z));
    holes.setAttribute("d", PINS.map(([x, y]) => poly(ringAt(P, disc(x, y, 3.2), z))).join(""));
    put(sweep, prism(P, front, sr, si, sz, sz + 11));
    arms.setAttribute("d", [2.5, 89.5].map((y) => poly([P(87.5, y, sz + 11), P(87.5, y, 60)])).join(""));
  }

  const B = register(stage, (_dt, now) => { draw(tval(d, now)); return !tdone(d, now); });
  bag.add(B.unregister);

  const box = [[0, 0, 0], [92, 92, 0], [92, 0, 0], [0, 92, 0], [8, 8, TOP], [84, 84, TOP], [84, 8, TOP], [8, 84, TOP]].map((q) => P(q[0], q[1], q[2]));
  const xs = box.map((q) => q[0]), ys = box.map((q) => q[1]);
  const hit = ([sx, sy]) => sx > Math.min(...xs) && sx < Math.max(...xs) && sy > Math.min(...ys) && sy < Math.max(...ys);

  let act = null;
  function setActive(a) {
    if (a === act) return;
    act = a;
    tset(d, a ? drop : 0, performance.now(), 0);
    deck.sil.classList.toggle("hi", true);
    read.textContent = a ? "set" : "rest";
    B.wake();
  }
  setActive(false);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { drop = v; if (act) { tset(d, v, performance.now(), 0); B.wake(); } }, destroy: bag.dispose };
}

hairline({
  name: "pinsetter",
  means: "A bowling pinsetter over a rack of ten pins: under the pointer the sweep bar drops and the deck comes down over the pins.",
  rules: [1, 3, 5, 8],
  range: [16, 44, 46],
  tour: [[200, 161], [117, 215], [280, 230], null],
  mount,
});
