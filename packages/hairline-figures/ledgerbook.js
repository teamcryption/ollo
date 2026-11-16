/**
 * Ledger: a thick bound account book lying shut but for a cover held ajar. Over the book the front cover swings open on its spine, bright, to show the ruled page.
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

const REST = 0.18, W = 70, D = 96, T = 14;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amt = value / 100;
  const C = Cam(45, 0.5, 1.8);
  fit(C, [[-W - 4, 0, 0], [W, D, 0], [W, 0, 0], [0, D, 0], [0, 0, W * 0.7], [0, D, W * 0.7]], 200, 165);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  box(P, front, g, 0, 0, W, D, 0, 3, 2, 1);
  box(P, front, g, 2, 2, W - 3, D - 2, 3, T, 2, 1);
  let rule = "";
  for (let k = 1; k < 8; k++) rule += "M" + P(8, 8 + k * 10.5, T) + "L" + P(W - 9, 8 + k * 10.5, T);
  for (const x of [22, 48]) rule += "M" + P(x, 10, T) + "L" + P(x, D - 10, T);
  mk("path", { class: "nf lo", d: rule }, g);
  const sil = mk("path", { class: "sil hi" }, g), face = mk("path", { class: "nf lo" }, g);
  const sp = spring(REST);
  let last = NaN;
  function draw(t) {
    if (t === last) return;
    last = t;
    const a = -rad(170) * t, c = corners(0, 0, W, D, T, T + 2.5).map((p) => rotY(p, 0, T, a)).map((p) => P(...p));
    sil.setAttribute("d", poly(hull(c)));
    face.setAttribute("d", poly(c.slice(4)));
  }
  draw(REST);
  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(sp.x); return m; });
  bag.add(B.unregister);
  function hit([sx, sy]) { const [x, y] = unproj(C, sx, sy, 0); return x > -20 && x < 90 && y > -20 && y < 116; }
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
  name: "ledgerbook",
  means: "A bound ledger on a desk: the pointer swings its cover open on the spine to show the ruled columns inside.",
  rules: [1, 3, 5, 8],
  range: [50, 100, 100],
  tour: [[200,179],[182,240],[220,170],null],
  mount,
});
