/**
 * Gold bars: a pyramid of ten ingots, four, three, two and one, on a vault
 * shelf, each bar a trapezoid, its top narrower than its foot. The pointer
 * picks a bar: it slides out of the stack toward the reader, lifts and tilts
 * up at its front, and the bars around it lift slightly, staggered from it.
 * At rest one bar sits half drawn, bright, the rest a little uneven. The
 * slider is the stagger.
 *
 * The pattern: stepped parts; the hit unprojects onto each bar's own rest
 * top, highest row first.
 */
const {
  Cam, facing, fit, hull, open, poly, prism, proj, rings, rrect, run, tdone, tset, tval, tween, unproj,
  disposer, mk, pointer, put, register, solid,
} = HL;

const BW = 12, BL = 28, BH = 6, GP = 1, IN = 1.6, OUT = 16, LIFT = 12, TILT = 0.22, FAV = 5;
const bars = [];
for (let r = 0; r < 4; r++) for (let i = 0; i < 4 - r; i++) bars.push({ r, x: r * (BW + GP) / 2 + i * (BW + GP), z: r * BH });
const REST = [0.6, -0.4, 1.2, 0, 1, 7, -0.6, 0.4, 1.4, 0.2];
const XW = 4 * BW + 3 * GP;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 3.45);
  fit(C, [[-6, -6, -4], [XW + 6, BL + 8, -4], [XW + 6, -6, -4], [-6, BL + 8, -4], [XW / 2, 0, 4 * BH], [0, BL + OUT, LIFT + BH + 6], [XW, BL + OUT, LIFT + BH + 6]], 200, 166);
  const P = proj(C), front = facing(C);

  const g = mk("g", {}, svg);
  const [sr, si] = rings(-6, -6, XW + 6, BL + 8, 2.4, 1.2);
  put(solid(g), prism(P, front, sr, si, -4, 0));
  const foot = rrect(-BW / 2, -BL / 2, BW / 2, BL / 2, 1.2, 3), top = rrect(-BW / 2 + IN, -BL / 2 + IN, BW / 2 - IN, BL / 2 - IN, 1, 3);
  const inner = rrect(-BW / 2 + IN + 0.7, -BL / 2 + IN + 0.7, BW / 2 - IN - 0.7, BL / 2 - IN - 0.7, 0.6, 3);
  const innerF = run(inner, front);
  bars.forEach((b, k) => { b.k = k; b.el = solid(g); b.y = tween(REST[k]); b.l = tween(k === FAV ? 2 : 0); b.last = ""; });

  function draw(b, y, l) {
    const key = y.toFixed(2) + "," + l.toFixed(2);
    if (key === b.last) return;
    b.last = key;
    const a = TILT * Math.max(0, (y - 2) / OUT) + 0.04 * l / LIFT, ca = Math.cos(a), sa = Math.sin(a);
    const cx = b.x + BW / 2, cy = BL / 2 + y, z0 = b.z + l;
    // tilt about the bar's back foot edge: the front comes up
    const W3 = (q, h) => { const v = q.v + BL / 2; return P(cx + q.u, cy - BL / 2 + v * ca - h * sa, z0 + v * sa + h * ca); };
    b.el.sil.setAttribute("d", poly(hull(foot.map((q) => W3(q, 0)).concat(top.map((q) => W3(q, BH))))));
    b.el.cr.setAttribute("d", open(innerF.map((q) => W3(q, BH))));
  }

  let painted = "";
  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const b of bars) { draw(b, tval(b.y, now), tval(b.l, now)); if (!tdone(b.y, now) || !tdone(b.l, now)) moving = true; }
    const order = bars.slice().sort((a, c) => (a.z + tval(a.l, now)) * 30 + a.x + tval(a.y, now) - ((c.z + tval(c.l, now)) * 30 + c.x + tval(c.y, now)));
    const k = order.map((b) => b.k).join();
    if (k !== painted) { painted = k; for (const b of order) g.appendChild(b.el.g); }
    return moving;
  });
  bag.add(B.unregister);

  /** Each bar's own rest top, highest row first: the first whose top holds the pointer. */
  const byHeight = bars.slice().sort((a, c) => c.z - a.z);
  function hit([sx, sy]) {
    for (const b of byHeight) {
      const [x, y] = unproj(C, sx, sy, b.z + BH), y0 = REST[b.k];
      if (x > b.x - 0.5 && x < b.x + BW + 0.5 && y > y0 - 1 && y < y0 + BL + 5) return b.k;
    }
    return -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    const dd = (p, q) => Math.hypot((bars[p].x - bars[q].x) / (BW + GP), bars[p].r - bars[q].r);
    bars.forEach((b, k) => {
      const d = a < 0 ? 0 : dd(k, a);
      const y = a < 0 ? REST[k] : d === 0 ? OUT : REST[k];
      const l = a < 0 ? (k === FAV ? 2 : 0) : d === 0 ? LIFT : d < 1.2 ? 2.4 : d < 2.2 ? 1 : 0;
      const delay = from < 0 ? 0 : dd(k, from) * stag;
      tset(b.y, y, now, delay); tset(b.l, l, now, delay);
      b.el.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "bar " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "goldbars",
  means: "A pyramid of ten gold bars on a vault shelf: the bar under the pointer slides out, lifts and tilts, the bars around it lift slightly.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[121, 136], [206, 101], [254, 178], null],
  mount,
});
