/**
 * Shop baskets: a stack of five tapered shop baskets nested one in another,
 * the top one with its handle up. The pointer picks a basket by height along
 * the stack: it and every basket above it lift off together, fanning a little
 * apart, staggered from the one picked. At rest the top basket sits a touch
 * proud of the stack, bright. The slider is the stagger.
 *
 * The pattern: a vertical stack; the hit is each basket's rest rim on screen.
 */
const {
  Cam, clamp, facing, fit, hull, lerp, open, poly, proj, rrect, ringAt, run, tdone, tset, tval, tween,
  disposer, mk, pointer, register, solid,
} = HL;

const N = 5, H = 16, DZ = 5, LIFT = 16, FAN = 3;
const FOOT = [3, 3, 29, 21], RIM = [-2, -2, 34, 26], CX = 16, CY = 12;
const REST = [0, 0, 0, 0, 3], FAV = N - 1;

function box(t) {
  return [lerp(FOOT[0], RIM[0], t), lerp(FOOT[1], RIM[1], t), lerp(FOOT[2], RIM[2], t), lerp(FOOT[3], RIM[3], t)];
}

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 3.6);
  const ZMAX = (N - 1) * DZ + H + LIFT + FAN * (N - 1) + 10;
  fit(C, [[RIM[0], RIM[1], 0], [RIM[2], RIM[3], 0], [RIM[2], RIM[1], 0], [RIM[0], RIM[3], 0], [RIM[2], RIM[1], ZMAX], [RIM[0], RIM[3], ZMAX], [RIM[0], RIM[1], ZMAX]], 200, 156);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  const bs = [];
  for (let k = 0; k < N; k++) {
    const s = solid(g);
    bs.push({ k, s, mouth: mk("path", { class: "nf lo" }, s.g), slots: mk("path", { class: "nf lo" }, s.g), handle: k === N - 1 ? mk("path", { class: "nf" }, s.g) : null, z: tween(REST[k]), last: NaN });
  }

  const base = (b, lift) => b.k * DZ + lift;
  function draw(b, lift, below) {
    const key = lift + "|" + below;
    if (key === b.last) return;
    b.last = key;
    const z0 = base(b, lift), z1 = z0 + H;
    const zv = clamp(below, z0, z1 - 2), tv = (zv - z0) / H;
    const bot = rrect(...box(tv), 4, 6), top = rrect(...RIM, 5, 6), inner = rrect(RIM[0] + 2, RIM[1] + 2, RIM[2] - 2, RIM[3] - 2, 3.5, 6);
    b.s.sil.setAttribute("d", poly(hull(ringAt(P, bot, zv).concat(ringAt(P, top, z1)))));
    b.s.cr.setAttribute("d", open(ringAt(P, run(rrect(RIM[0] + 0.8, RIM[1] + 0.8, RIM[2] - 0.8, RIM[3] - 0.8, 4.2, 6), front), z1 - 3)));
    b.mouth.setAttribute("d", poly(ringAt(P, inner, z1)));
    // the mesh slots on the near long face, only where it shows above the basket below
    let d = "";
    for (let i = 0; i < 4; i++) {
      const x = 6 + i * 6.5, za = Math.max(z0 + 4, zv + 1.5), zb = z1 - 5;
      if (zb - za < 1.5) continue;
      const ta = (za - z0) / H, tb = (zb - z0) / H;
      d += open([P(x, lerp(FOOT[3], RIM[3], ta), za), P(x, lerp(FOOT[3], RIM[3], tb), zb)]);
    }
    b.slots.setAttribute("d", d);
    if (b.handle) {
      const pts = [];
      for (let i = 0; i <= 16; i++) { const a = (i / 16) * Math.PI; pts.push(P(CX - 11 * Math.cos(a), CY, z1 + 9 * Math.sin(a))); }
      b.handle.setAttribute("d", open(pts));
    }
  }

  const B = register(stage, (_dt, now) => {
    let moving = false, below = -99;
    bs.forEach((b) => {
      const lift = tval(b.z, now);
      draw(b, lift, below);
      below = base(b, lift) + H;
      if (!tdone(b.z, now)) moving = true;
    });
    return moving;
  });
  bag.add(B.unregister);

  // the hit: nearest basket by its rest rim's screen height, within the stack's width
  const rimY = bs.map((b) => P(CX, CY, base(b, REST[b.k]) + H)[1]);
  const xl = P(RIM[0], RIM[3], 0)[0], xr = P(RIM[2], RIM[1], 0)[0], yb = P(RIM[2], RIM[3], 0)[1];
  function hit([sx, sy]) {
    if (sx < xl || sx > xr || sy > yb || sy < rimY[N - 1] - 30) return -1;
    let best = 0;
    rimY.forEach((y, k) => { if (Math.abs(sy - y) < Math.abs(sy - rimY[best])) best = k; });
    return best;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    bs.forEach((b, k) => {
      const z = a < 0 ? REST[k] : k >= a ? LIFT + FAN * (k - a) : 0;
      tset(b.z, z, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      b.s.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "basket " + (N - a);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "basketstack",
  means: "A stack of shop baskets: the basket under the pointer and all above it lift off the stack, fanning apart.",
  rules: [1, 2, 3, 5, 6],
  range: [0, 45, 90],
  tour: [[200, 159], [200, 206], [200, 221], null],
  mount,
});
