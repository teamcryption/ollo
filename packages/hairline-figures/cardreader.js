/**
 * Card skimmer guard: an ATM fascia with a card slot under a guard hood. Over the slot the bank card slides out of the guard, bright.
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

const REST = 0.2, PW = 70, PZ = 64;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amt = value / 100;
  const C = Cam(45, 0.5, 2.6);
  fit(C, [[0, 0, 0], [8, PW, 0], [80, 10, 40], [80, PW - 10, 40], [0, 0, PZ], [8, PW, PZ]], 200, 165);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  box(P, front, g, 0, 0, 8, PW, 0, PZ, 2, 1);
  box(P, front, g, 8, 10, 12, PW - 10, 8, 26, 1.5, 0.6);
  box(P, front, g, 8, 14, 22, PW - 14, 36, 50, 3, 1.2);
  mk("path", { class: "nf lo", d: poly([P(22, 18, 44), P(22, PW - 18, 44), P(22, PW - 18, 41), P(22, 18, 41)]) }, g);
  const card = mk("g", {}, g);
  const sp = spring(REST);
  let last = NaN;
  function draw(t) {
    if (t === last) return;
    last = t;
    card.replaceChildren();
    const out = 4 + t * 54;
    box(P, front, card, 22, 20, 22 + out, PW - 20, 42, 43.5, 2, 0.6).sil.setAttribute("class", "sil hi");
    if (out > 20) mk("path", { class: "nf lo", d: poly([P(22 + out - 16, 24, 43.5), P(22 + out - 6, 24, 43.5), P(22 + out - 6, 32, 43.5), P(22 + out - 16, 32, 43.5)]) }, card);
  }
  draw(REST);
  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(sp.x); return m; });
  bag.add(B.unregister);
  function hit([sx, sy]) { const [x, y] = unproj(C, sx, sy, 0); return x > -60 && x < 150 && y > -60 && y < 130; }
  let on = null;
  function setOn(v) {
    if (v === on) return;
    on = v;
    sp.t = v ? amt : REST;
    read.textContent = v ? "card out" : "rest";
    B.wake();
  }
  setOn(false);
  bag.add(pointer(stage, { move: (p) => setOn(hit(p)), leave: () => setOn(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amt = v / 100; if (on) { sp.t = amt; B.wake(); } }, destroy: bag.dispose };
}

hairline({
  name: "cardreader",
  means: "An ATM card slot under its skimmer guard: the pointer slides the bank card out of the slot toward you.",
  rules: [1, 3, 5, 8],
  range: [50, 100, 100],
  tour: [[183,162],[160,190],[200,175],null],
  mount,
});
