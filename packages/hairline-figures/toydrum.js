/**
 * Toy drum: a round drum with hoops and zigzag cords, a strap looped over it
 * from its lugs, and two sticks resting on its head. The pointer over the
 * drum raises both sticks high for a beat, staggered, and the strap swings
 * forward. At rest one stick is lifted a little, bright. The slider is how
 * high the sticks rise.
 *
 * The pattern: one object answering as a whole; the hit is on the ground plane.
 */
const {
  Cam, circ, clamp, fit, facing, hull, open, poly, prism, proj, unproj, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const R = 32, L = 58, BZ = 46, S = 2.45;
const SQ = Math.SQRT1_2;
const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
function ring3(c, a, r, n = 16) {
  const h = Math.abs(a[2]) < 0.9 ? [0, 0, 1] : [1, 0, 0];
  let u = [a[1] * h[2] - a[2] * h[1], a[2] * h[0] - a[0] * h[2], a[0] * h[1] - a[1] * h[0]];
  const lu = Math.hypot(...u); u = u.map((q) => q / lu);
  const v = [a[1] * u[2] - a[2] * u[1], a[2] * u[0] - a[0] * u[2], a[0] * u[1] - a[1] * u[0]];
  return Array.from({ length: n }, (_, i) => { const t = (i / n) * Math.PI * 2, c1 = Math.cos(t) * r, s1 = Math.sin(t) * r; return [0, 1, 2].map((j) => c[j] + u[j] * c1 + v[j] * s1); });
}
const cyl = (a, b, r0, r1) => { const d = sub(b, a), l = Math.hypot(...d), ax = d.map((q) => q / l); return ring3(a, ax, r0).concat(ring3(b, ax, r1)); };
const ball = (c, r) => { let o = []; for (let i = -4; i <= 4; i++) { const z = (i / 4) * r; o = o.concat(ring3([c[0], c[1], c[2] + z], [0, 0, 1], Math.sqrt(Math.max(0, r * r - z * z)) + 0.01, 16)); } return o; };
// the two butts, in front of the drum, and the sticks' rest drop onto the head
const ANG = [Math.PI / 4 - 0.62, Math.PI / 4 + 0.62];
const BUTT = ANG.map((a) => [Math.cos(a) * (R + 24), Math.sin(a) * (R + 24), BZ]);
const DROP = Math.asin((BZ - 39) / L);
const REST = [0.18, 0], FAV = 0;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amp = value;
  const C = Cam(45, 0.5, S);
  fit(C, [[-R - 6, -R - 6, 0], [R + 30, R + 30, 0], [R + 6, -R - 6, 0], [-R - 6, R + 6, 0], [0, 0, BZ + L * 0.95], [-R, -R, 60]], 200, 166);
  const P = proj(C), front = facing(C);
  const pp = (pts) => pts.map((q) => P(...q));
  const g = mk("g", {}, svg);
  const strap = mk("path", {}, g);
  const drum = mk("g", {}, g);
  put(solid(drum), prism(P, front, circ(R, 48), circ(R - 1.5, 48), 5, 30));
  // zigzag cords between the hoops, on the side facing us
  const zz = [];
  for (let i = 0; i <= 12; i++) { const a = Math.PI / 4 - Math.PI / 2 + (i / 12) * Math.PI; zz.push(P(Math.cos(a) * R, Math.sin(a) * R, i % 2 ? 29 : 7)); }
  mk("path", { d: open(zz), class: "nf lo" }, drum);
  put(solid(drum), prism(P, front, circ(R + 1.5, 48), circ(R, 48), 0, 7));
  put(solid(drum), prism(P, front, circ(R + 1.5, 48), circ(R - 2, 48), 29, 36));
  for (const s of [1, -1]) {
    const c = [s * SQ * (R + 1), -s * SQ * (R + 1), 18];
    mk("path", { d: poly(hull(pp(ball(c, 3)))), class: "sil" }, drum);
  }
  const sticks = BUTT.map((b, k) => {
    const grp = mk("g", {}, g);
    return { k, b, grp, body: mk("path", { class: "sil" }, grp), tip: mk("path", { class: "sil" }, grp), up: tween(REST[k]) };
  });
  const sw = tween(-0.9);
  let last = "";

  function draw(now) {
    const a = sticks.map((s) => tval(s.up, now)), f = tval(sw, now), key = a.join() + f + amp;
    if (key === last) return;
    last = key;
    // strap: a band looped from lug to lug, swung about the lug axis by f
    const ax = [SQ, -SQ, 0], n = [SQ, SQ, 0], o = [], i2 = [];
    for (let i = 0; i <= 24; i++) {
      const t = (i / 24) * Math.PI, w = [0, 0, 1].map((u, j) => Math.cos(f) * u + Math.sin(f) * n[j]);
      const pt = (r) => P(...[0, 1, 2].map((j) => ax[j] * Math.cos(t) * (R + 1) + w[j] * Math.sin(t) * r + (j === 2 ? 18 : 0)));
      o.push(pt(R + 22)); i2.unshift(pt(R + 17));
    }
    strap.setAttribute("d", poly(o.concat(i2)));
    if (f > 0) g.insertBefore(drum, strap); else g.insertBefore(strap, drum);
    sticks.forEach((s, k) => {
      const e = -DROP + a[k] * amp * 1.35, d = [-Math.cos(ANG[k]) * Math.cos(e), -Math.sin(ANG[k]) * Math.cos(e), Math.sin(e)];
      const tip = [0, 1, 2].map((j) => s.b[j] + d[j] * L);
      s.body.setAttribute("d", poly(hull(pp(cyl(s.b, tip, 2.2, 1.5)))));
      s.tip.setAttribute("d", poly(hull(pp(ball(tip, 3.4)))));
    });
  }

  const B = register(stage, (_dt, now) => { draw(now); return !(sticks.every((s) => tdone(s.up, now)) && tdone(sw, now)); });
  bag.add(B.unregister);

  let act = -2;
  function setActive(on, side) {
    const id = on ? side : -1;
    if (id === act) return;
    act = id;
    const now = performance.now();
    sticks.forEach((s, k) => {
      tset(s.up, on ? 1 : REST[k], now, on ? Math.abs(k - side) * 60 : 0);
      s.body.classList.toggle("hi", k === (on ? side : FAV));
      s.tip.classList.toggle("hi", k === (on ? side : FAV));
    });
    tset(sw, on ? 0.15 : -0.9, now, 0);
    read.textContent = on ? (side ? "R " : "L ") + Math.round(amp * 77) + "°" : "rest";
    B.wake();
  }
  setActive(false, 0);
  const mid = P(0, 0, 0)[0];
  bag.add(pointer(stage, {
    move: (p) => { const [x, y] = unproj(C, p[0], p[1], 0); setActive(Math.hypot(x - 8, y - 8) < R + 30, p[0] < mid ? 1 : 0); },
    leave: () => setActive(false, 0),
  }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amp = clamp(v, 0.2, 1); last = ""; if (act >= 0) read.textContent = (act ? "R " : "L ") + Math.round(amp * 77) + "°"; B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "toydrum",
  means: "A toy drum with a strap and two sticks: the pointer over it raises both sticks high to strike and swings the strap forward.",
  rules: [1, 2, 4, 5],
  range: [0.3, 0.75, 1],
  tour: [[230, 170], [170, 165], [200, 200], null],
  mount,
});
