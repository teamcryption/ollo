/**
 * Smart speakers: four speakers of different shapes on a shelf, a cylinder,
 * a cube, a dome and an oval, each with a light ring on its top. The pointer
 * picks a speaker by where it is along the shelf: it lifts and its top ring
 * widens, its neighbours lift a little, staggered from it. At rest they sit
 * on the shelf, the cube's ring a little open and bright. The slider is the
 * stagger.
 *
 * The pattern: one of many in a single row (toaster); the hit is the nearest
 * rest centre along the screen's x.
 */
const {
  Cam, circ, clamp, facing, fit, hull, poly, prism, proj, rings, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const Q = -Math.PI / 4, cQ = Math.cos(Q), sQ = Math.sin(Q);
const W = (u, v) => [u * cQ - v * sQ, u * sQ + v * cQ];
const turn = (ring, cx, cy, sx = 1, sy = 1) => ring.map((q) => {
  const u = q.u * sx, v = q.v * sy;
  return { u: cx + u * cQ - v * sQ, v: cy + u * sQ + v * cQ, nu: q.nu * cQ - q.nv * sQ, nv: q.nu * sQ + q.nv * cQ };
});
const N = 4, STEP = 27, U0 = -40, SH = 3, LIFT = 13, BUMP = 5, FAV = 1;
const ROPEN = [0.1, 0.45, 0, 0.2];
const dome = [];
for (let i = 0; i <= 6; i++) { const a = (i / 6) * (Math.PI / 2); dome.push([Math.max(10 * Math.cos(a), 1), 13 * Math.sin(a)]); }
// each shape: its levels [ring maker, z], and its top ring [radius at 0 and 1, z at radius]
const SHAPES = [
  { lv: [[() => circ(8, 32), 0], [() => circ(8, 32), 22]], ring: [3.5, 6.6], rz: () => 22 },
  { lv: [[() => rings(-8, -8, 8, 8, 3, 1)[0], 0], [() => rings(-8, -8, 8, 8, 3, 1)[0], 16]], ring: [3, 6], rz: () => 16 },
  { lv: dome.map(([r, z]) => [() => circ(r, 32), z]), ring: [3, 7], rz: (r) => 13 * Math.sqrt(1 - (r / 10) ** 2) },
  { lv: [[() => circ(9, 32), 0], [() => circ(9, 32), 15], [() => circ(7.4, 32), 18.4], [() => circ(4.6, 32), 20]], ring: [2.6, 5], rz: () => 20, sx: 1.25, sy: 0.75 },
];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 3.0);
  const ext = [];
  for (const u of [-56, 56]) ext.push([...W(u, -12), SH], [...W(u, 12), SH], [...W(u, 12), -14], [...W(u, 0), SH + 22 + LIFT]);
  fit(C, ext, 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  // the shelf: two brackets under a long plank
  for (const u of [-38, 38]) {
    const [r, i] = rings(u - 1, -10, u + 1, 10, 0.8, 0.4);
    put(solid(g), prism(P, front, turn(r, 0, 0), turn(i, 0, 0), -14, 0));
  }
  const [sr, si] = rings(-56, -12, 56, 12, 3, 1.2);
  put(solid(g), prism(P, front, turn(sr, 0, 0), turn(si, 0, 0), 0, SH));

  const sp = SHAPES.map((s, k) => {
    const u = U0 + k * STEP, [cx, cy] = W(u, 0), grp = mk("g", {}, g);
    const lv = s.lv.map(([f, z]) => [turn(f(), cx, cy, s.sx, s.sy), z]);
    return { k, s, cx, cy, lv, sil: mk("path", { class: "sil" }, grp), cr: mk("path", { class: "nf lo" }, grp), z: tween(0), o: tween(ROPEN[k]), last: "" };
  });

  function draw(p, lift, open) {
    const key = lift.toFixed(3) + open.toFixed(3);
    if (key === p.last) return;
    p.last = key;
    const z0 = SH + lift, pts = [];
    for (const [r, z] of p.lv) for (const q of r) pts.push(P(q.u, q.v, z0 + z));
    p.sil.setAttribute("d", poly(hull(pts)));
    const rr = p.s.ring[0] + (p.s.ring[1] - p.s.ring[0]) * open;
    p.cr.setAttribute("d", poly(turn(circ(rr, 32), p.cx, p.cy, p.s.sx, p.s.sy).map((q) => P(q.u, q.v, z0 + p.s.rz(rr)))));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    sp.forEach((p) => { draw(p, tval(p.z, now), tval(p.o, now)); if (!tdone(p.z, now) || !tdone(p.o, now)) moving = true; });
    return moving;
  });
  bag.add(B.unregister);

  // the hit: the rest centres along the screen's x, inside the shelf's band
  const cx = sp.map((p) => P(p.cx, p.cy, SH + 10)[0]);
  const yTop = P(...W(0, -12), SH + 22 + LIFT)[1] - 6, yBot = P(...W(0, 12), 0)[1] + 6, half = (cx[1] - cx[0]) / 2 + 4;
  function hit([sx, sy]) {
    if (sy < yTop || sy > yBot) return -1;
    let best = -1, bd = Infinity;
    cx.forEach((x, k) => { const d = Math.abs(sx - x); if (d < bd) { bd = d; best = k; } });
    return bd < half ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    sp.forEach((p, k) => {
      const d = from < 0 ? 0 : Math.abs(k - from) * stag;
      tset(p.z, a < 0 ? 0 : k === a ? LIFT : clamp(BUMP - 2 * Math.abs(k - a), 0, BUMP), now, d);
      tset(p.o, a < 0 ? ROPEN[k] : k === a ? 1 : ROPEN[k], now, d);
      p.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "speaker " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "smartspeakers",
  means: "Four smart speakers on a shelf: the one under the pointer lifts and its top ring widens, its neighbours lift a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[81, 143], [162, 143], [243, 143], null],
  mount,
});
