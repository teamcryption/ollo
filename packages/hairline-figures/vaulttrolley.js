/**
 * Cash trolley: a cash-in-transit box on four casters with a push bar. Over the trolley its strongbox lid swings open, bright.
 *
 * The pattern: one part that answers the pointer as a whole.
 */
const {
  Cam, circ, fit, facing, hull, poly, prism, proj, rings, ringAt, rad, spring, stepS, unproj,
  disposer, mk, pointer, put, register, solid,
} = HL;

const box = (P, front, g, x0, y0, x1, y1, z0, z1, r = 2, b = 1) => { const s = solid(g); put(s, prism(P, front, ...rings(x0, y0, x1, y1, r, b), z0, z1)); return s; };
const disc = (x, y, R) => circ(R, 32).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));
const cyl = (P, front, g, x, y, R, z0, z1, cls) => { const s = solid(g); put(s, prism(P, front, disc(x, y, R), disc(x, y, R - 1.2), z0, z1)); if (cls) s.sil.setAttribute("class", cls); return s; };
const corners = (x0, y0, x1, y1, z0, z1) => [[x0, y0, z0], [x1, y0, z0], [x1, y1, z0], [x0, y1, z0], [x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]];
const rotX = ([x, y, z], yh, zh, a) => [x, yh + (y - yh) * Math.cos(a) - (z - zh) * Math.sin(a), zh + (y - yh) * Math.sin(a) + (z - zh) * Math.cos(a)];
const rotY = ([x, y, z], xh, zh, a) => [xh + (x - xh) * Math.cos(a) - (z - zh) * Math.sin(a), y, zh + (x - xh) * Math.sin(a) + (z - zh) * Math.cos(a)];

const REST = 0.12, W = 84, D = 46, Z0 = 12, Z1 = 52;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amt = value / 100;
  const C = Cam(45, 0.5, 2);
  fit(C, [[-12, -4, 0], [W + 4, D + 4, 0], [W + 4, -4, 0], [-12, D + 4, 0], [W / 2, -D * 0.4, Z1 + D], [-12, D / 2, 66]], 200, 165);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  for (const [x, y] of [[9, 9], [W - 9, 9], [9, D - 9]]) cyl(P, front, g, x, y, 5, 0, Z0);
  box(P, front, g, -10, 4, -6, 8, Z0, 66, 1, 0.5); box(P, front, g, -10, D - 8, -6, D - 4, Z0, 66, 1, 0.5);
  box(P, front, g, -11, 2, -5, D - 2, 62, 67, 1.5, 0.6);
  box(P, front, g, 0, 0, W, D, Z0, Z1, 3, 1.5);
  cyl(P, front, g, W - 9, D - 9, 5, 0, Z0 - 1);
  box(P, front, g, W, D / 2 - 6, W + 3, D / 2 + 6, Z1 - 16, Z1 - 4, 1, 0.5);
  const sil = mk("path", { class: "sil hi" }, g), face = mk("path", { class: "nf lo" }, g);
  const sp = spring(REST);
  let last = NaN;
  function draw(t) {
    if (t === last) return;
    last = t;
    const a = -rad(110) * t, c = corners(0, 0, W, D, Z1, Z1 + 4).map((p) => rotX(p, 0, Z1, a)).map((p) => P(...p));
    sil.setAttribute("d", poly(hull(c)));
    face.setAttribute("d", poly(c.slice(4)));
  }
  draw(REST);
  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(sp.x); return m; });
  bag.add(B.unregister);
  function hit([sx, sy]) { const [x, y] = unproj(C, sx, sy, 0); return x > -90 && x < 150 && y > -90 && y < 110; }
  let on = null;
  function setOn(v) {
    if (v === on) return;
    on = v;
    sp.t = v ? amt : REST;
    read.textContent = v ? "open" : "rest";
    B.wake();
  }
  setOn(false);
  bag.add(pointer(stage, { move: (p) => setOn(hit(p)), leave: () => setOn(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amt = v / 100; if (on) { sp.t = amt; B.wake(); } }, destroy: bag.dispose };
}

hairline({
  name: "vaulttrolley",
  means: "A cash in transit trolley on casters: the pointer swings its strongbox lid open on the back hinge.",
  rules: [1, 3, 5, 8],
  range: [50, 100, 100],
  tour: [[196,147],[233,240],[180,170],null],
  mount,
});
