/**
 * Toboggan: a long slatted sled whose front curls up and back. The pointer pulls the curl tighter over the deck; the curl is bright.
 */
const { Cam, fit, proj, rrect, hull, poly, tween, tset, tval, tdone, disposer, mk, pointer, register } = HL;

const box = (x0, y0, z0, x1, y1, z1, r = 1.5) => {
  const ring = rrect(x0, y0, x1, y1, Math.min(r, (x1 - x0) / 2.2, (y1 - y0) / 2.2), 4);
  return ring.map((q) => [q.u, q.v, z0]).concat(ring.map((q) => [q.u, q.v, z1]));
};
const N = 8, L = 9.5, W = 17, TH = 3;
const TOTAL = (t, a) => 1.9 + t * Math.min(2.4, 1.75 * a);
// the curl as a chain of short slats bending up from the deck's front end
function curl(t, a) {
  const step = TOTAL(t, a) / N, segs = [];
  let x = 26, z = 0, f = 0;
  for (let i = 0; i < N; i++) {
    const f1 = f + step, x1 = x + L * Math.cos(f + step / 2), z1 = z + L * Math.sin(f + step / 2);
    const pts = [];
    for (const [px, pz, ang] of [[x, z, f], [x1, z1, f1]])
      for (const d of [0, TH]) for (const y of [-W, W]) pts.push([px - Math.sin(ang) * d, y, pz + Math.cos(ang) * d]);
    segs.push(pts);
    x = x1; z = z1; f = f1;
  }
  return segs;
}
const STATIC = [
  box(-64, -W, 0, 28, W, TH, 3),
  box(-60, -W - 1, TH, 20, -W + 2, TH + 4, 1.5),
  box(-60, W - 2, TH, 20, W + 1, TH + 4, 1.5),
  box(-40, -W + 2, TH, -6, W - 2, TH + 5, 4),
];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amp = value;
  const C = Cam(45, 0.5, 2.55);
  const all = [];
  for (const s of STATIC) all.push(...s);
  for (const t of [0, 1]) for (const s of curl(t, 1.3)) all.push(...s);
  fit(C, all, 200, 170);
  const P = proj(C), g = mk("g", {}, svg);
  for (const [i, s] of STATIC.entries()) mk("path", { class: "sil", d: poly(hull(s.map((p) => P(p[0], p[1], p[2])))) }, g);
  const segEls = Array.from({ length: N }, () => mk("path", { class: "sil hi" }, g));
  const rest = [];
  for (const s of STATIC.concat(curl(0, 1))) for (const p of s) rest.push(P(p[0], p[1], p[2]));
  const bx0 = Math.min(...rest.map((q) => q[0])) - 8, bx1 = Math.max(...rest.map((q) => q[0])) + 8;
  const by0 = Math.min(...rest.map((q) => q[1])) - 8, by1 = Math.max(...rest.map((q) => q[1])) + 8;
  const tw = tween(0);
  let last = NaN;
  function draw(t) {
    if (t === last) return;
    last = t;
    curl(t, amp).forEach((s, i) => segEls[i].setAttribute("d", poly(hull(s.map((p) => P(p[0], p[1], p[2]))))));
  }
  const B = register(stage, (_dt, now) => { draw(tval(tw, now)); return !tdone(tw, now); });
  bag.add(B.unregister);
  let act = -1;
  function setActive(a) {
    if (a === act) return;
    act = a;
    tset(tw, a, performance.now(), 0);
    read.textContent = a ? "curl" : "rest";
    B.wake();
  }
  setActive(0);
  bag.add(pointer(stage, {
    move: (p) => setActive(p[0] > bx0 && p[0] < bx1 && p[1] > by0 && p[1] < by1 ? 1 : 0),
    leave: () => setActive(0),
  }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amp = v; last = NaN; B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "toboggan",
  means: "A long slatted toboggan with a curled front: the pointer pulls the curl tighter, rolling it up and back over the deck.",
  rules: [1, 4, 5, 8],
  range: [0.5, 1, 1.3],
  tour: [[269,182],[255,195],[280,170],null],
  mount,
});
