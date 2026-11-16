/**
 * Pneumatic tube: a bank's receiving station with a carrier capsule standing in its mouth. Over the station the carrier shoots up out of the tube, bright.
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

const REST = 0.25, H = 44, TOP = 30;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amt = value / 100;
  const C = Cam(45, 0.5, 2);
  fit(C, [[-4, -4, 0], [54, 54, 0], [25, 25, TOP + H + 50], [54, -4, 0], [-4, 54, 0]], 200, 165);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  mk("path", { class: "dash", d: "M" + P(11, 39, TOP + 10) + "L" + P(11, 39, TOP + 100) + "M" + P(39, 11, TOP + 10) + "L" + P(39, 11, TOP + 100) }, g);
  box(P, front, g, 0, 0, 50, 50, 0, TOP, 4, 2);
  box(P, front, g, 50, 12, 54, 38, 6, 22, 1.5, 0.6);
  mk("path", { class: "nf lo", d: poly(ringAt(P, disc(25, 25, 15), TOP)) }, g);
  const cap = mk("g", {}, g);
  const sp = spring(REST);
  let last = NaN;
  function draw(t) {
    if (t === last) return;
    last = t;
    cap.replaceChildren();
    const z1 = TOP + 6 + t * (H + 40), z0 = Math.max(TOP, z1 - H);
    cyl(P, front, cap, 25, 25, 12, z0, z1, "sil hi");
    cyl(P, front, cap, 25, 25, 13, Math.max(TOP, z1 - 10), Math.max(TOP + 0.5, z1 - 6));
    if (z1 - H + 6 > TOP) cyl(P, front, cap, 25, 25, 13, z1 - H + 6, z1 - H + 10);
  }
  draw(REST);
  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(sp.x); return m; });
  bag.add(B.unregister);
  function hit([sx, sy]) { const [x, y] = unproj(C, sx, sy, 0); return x > -30 && x < 80 && y > -30 && y < 80; }
  let on = null;
  function setOn(v) {
    if (v === on) return;
    on = v;
    sp.t = v ? amt : REST;
    read.textContent = v ? "send" : "rest";
    B.wake();
  }
  setOn(false);
  bag.add(pointer(stage, { move: (p) => setOn(hit(p)), leave: () => setOn(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amt = v / 100; if (on) { sp.t = amt; B.wake(); } }, destroy: bag.dispose };
}

hairline({
  name: "pneumatictube",
  means: "A bank's pneumatic tube station: the pointer sends the carrier capsule sliding up out of the receiver's mouth.",
  rules: [1, 3, 5, 8],
  range: [50, 100, 100],
  tour: [[200,183],[200,240],[205,150],null],
  mount,
});
