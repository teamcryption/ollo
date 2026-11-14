/**
 * Drive bays: a storage chassis with six drive caddies in a row in its face.
 * The pointer picks a caddy by where it stands: that caddy slides out of its
 * bay on its rails, its latch swinging open, and the caddies beside it ease
 * out a little, staggered from it. At rest one caddy stands half out, bright.
 * The slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle), sliding.
 */
const {
  Cam, fit, facing, open, poly, prism, proj, rings, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 6, STEP = 19, CW = 15, X0 = 5, W = X0 * 2 + (N - 1) * STEP + CW, DEP = 46, FY = DEP, H = 30;
const Z0 = 4, Z1 = 26, OUT = 30, FAV = 2;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.05);
  fit(C, [[0, 0, 0], [W, 0, 0], [0, FY + OUT + 2, 0], [W, FY + OUT + 2, 0], [0, 0, H], [W, FY + OUT, Z1]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [cr, ci] = rings(0, 0, W, DEP, 3, 1.6);
  put(solid(g), prism(P, front, cr, ci, 0, H));
  // empty bays: a dim slot in the face behind each caddy
  let slots = "";
  for (let k = 0; k < N; k++) { const x = X0 + k * STEP; slots += poly([P(x, FY, Z0), P(x + CW, FY, Z0), P(x + CW, FY, Z1), P(x, FY, Z1)]); }
  mk("path", { d: slots, class: "lo" }, g);

  const items = [];
  for (let k = 0; k < N; k++) {
    const x = X0 + k * STEP, grp = mk("g", {}, g), s = solid(grp);
    const latch = mk("path", { class: "nf lo" }, grp), led = mk("path", { class: "nf" }, grp);
    items.push({ k, x, s, latch, led, o: tween(k === FAV ? OUT * 0.55 : 0), last: NaN });
  }

  function draw(it, o) {
    if (o === it.last) return;
    it.last = o;
    const y1 = FY + 2 + o, [r, i] = rings(it.x + 0.4, FY, it.x + CW - 0.4, y1, 1.6, 0.7);
    put(it.s, prism(P, front, r, i, Z0 + 0.4, Z1 - 0.4));
    // the latch swings out from the caddy's face as it slides
    const a = Math.min(1, o / OUT) * 1.1, lx = it.x + 3, lz = Z0 + 3;
    it.latch.setAttribute("d", open([P(lx, y1, lz), P(lx + Math.sin(a) * 0, y1 + Math.sin(a) * 9, lz + Math.cos(a) * 14)]));
    it.led.setAttribute("d", poly([P(it.x + CW - 4, y1, Z1 - 5), P(it.x + CW - 2.5, y1, Z1 - 5), P(it.x + CW - 2.5, y1, Z1 - 3.5), P(it.x + CW - 4, y1, Z1 - 3.5)]));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.o, now)); if (!tdone(it.o, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.x + CW / 2, FY, (Z0 + Z1) / 2));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 22 && Math.abs(mids[best][1] - sy) < 70 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), o = a < 0 ? (k === FAV ? OUT * 0.55 : 0) : dd === 0 ? OUT : dd === 1 ? 7 : 0;
      tset(it.o, o, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.s.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "bay " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "ssdbay",
  means: "A storage chassis with six drive caddies: the caddy under the pointer slides out on its rails and its neighbours ease out a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[110, 131], [248, 200], [277, 215], null],
  mount,
});
