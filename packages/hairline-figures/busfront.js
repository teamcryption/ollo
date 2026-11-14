/**
 * Bus: a city bus standing at the kerb, windows down its side, two doors.
 * The pointer picks a door by where it stands along the bus: that door
 * swings out open, the other swings back shut a beat later. At rest the
 * front door is half open, bright. The slider is how far a door swings.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, fit, facing, poly, prism, proj, rings, rrect, seg, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const L = 130, W = 40, Z0 = 8, Z1 = 56, DW = 18, FAV = 1;
const DOORS = [52, 104];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let swing = value;
  const C = Cam(45, 0.5, 1.75);
  fit(C, [[0, 0, 0], [L, W, 0], [L, 0, Z1], [0, W, Z1], [0, 0, Z1], [L, W + DW, 0]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(0, 0, L, W, 9, 1.6);
  put(solid(g), prism(P, front, br, bi, Z0, Z1));
  const lines = mk("path", { class: "nf lo" }, g);
  const sideRect = (x0, x1, z0, z1, r = 2) => poly(rrect(x0, z0, x1, z1, r, 3).map((q) => P(q.u, W, q.v)));
  let d = "";
  // side windows, skipping the door openings
  for (let x = 6; x + 16 <= L - 4; x += 20) if (!DOORS.some((dx) => x + 16 > dx - 2 && x < dx + DW + 2)) d += sideRect(x, x + 16, 34, 50);
  // windscreen and destination band on the front face
  const fr = (y0, y1, z0, z1) => poly(rrect(y0, z0, y1, z1, 2, 3).map((q) => P(L, q.u, q.v)));
  d += fr(5, W - 5, 30, 51) + fr(8, W - 8, 18, 24);
  // skirt line
  d += seg(P(6, W, 16), P(L - 6, W, 16));
  lines.setAttribute("d", d);
  // door openings: dim frames the doors close into
  const holes = mk("path", { class: "lo" }, g);
  holes.setAttribute("d", DOORS.map((x) => sideRect(x, x + DW, Z0 + 2, 52, 1)).join(""));
  // wheels: discs on the near side
  for (const wx of [24, L - 30]) {
    const pts = [], hub = [];
    for (let i = 0; i < 32; i++) { const t = (i / 32) * 2 * Math.PI; pts.push(P(wx + 9 * Math.cos(t), W + 0.6, 9 + 9 * Math.sin(t))); hub.push(P(wx + 3.5 * Math.cos(t), W + 0.8, 9 + 3.5 * Math.sin(t))); }
    mk("path", { d: poly(pts), class: "sil" }, g);
    mk("path", { d: poly(hub), class: "nf lo" }, g);
  }

  const items = DOORS.map((x, k) => {
    const el = mk("path", { class: "sil" }, g), pane = mk("path", { class: "nf lo" }, g);
    return { k, x, el, pane, a: tween(k === FAV ? 0.5 : 0), last: NaN };
  });

  function draw(it, t) {
    if (t === it.last) return;
    it.last = t;
    const a = (t * swing * Math.PI) / 180, ex = it.x + DW * Math.cos(a), ey = W + 0.4 + DW * Math.sin(a);
    const q = (u, z) => P(it.x + (ex - it.x) * u, W + 0.4 + (ey - W - 0.4) * u, z);
    it.el.setAttribute("d", poly([q(0, Z0 + 2), q(1, Z0 + 2), q(1, 52), q(0, 52)]));
    it.pane.setAttribute("d", poly([q(0.2, 26), q(0.8, 26), q(0.8, 48), q(0.2, 48)]));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.a, now)); if (!tdone(it.a, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = DOORS.map((x) => P(x + DW / 2, W, 30));
  function hit([sx, sy]) {
    const top = P(L / 2, W / 2, Z1)[1] - 10, bot = P(L / 2, W, 0)[1] + 30;
    if (sy < top || sy > bot) return -1;
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 70 ? best : -1;
  }

  let act = -2;
  function setActive(a, force) {
    if (a === act && !force) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      tset(it.a, a < 0 ? (k === FAV ? 0.5 : 0) : k === a ? 1 : 0, now, from < 0 ? 0 : Math.abs(k - from) * 60);
      it.el.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "door " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { swing = v; items.forEach((it) => { it.last = NaN; }); B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "busfront",
  means: "A city bus at the kerb with two doors: the door nearest the pointer swings open, and the other swings shut.",
  rules: [1, 2, 5, 8],
  range: [40, 70, 90],
  tour: [[235, 199], [170, 167], [107, 121], null],
  mount,
});
