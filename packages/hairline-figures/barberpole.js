/**
 * Barber pole: a striped pole on a base under a cap. The pointer spins the stripes.
 */
const {
  Cam, circ, rrect, fit, facing, hull, poly, open, prism, proj, ringAt, clamp, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const tr = (ring, a, px, py, dx, dy) => {
  const c = Math.cos(a), s = Math.sin(a);
  return ring.map((q) => ({ u: (q.u - px) * c - (q.v - py) * s + px + dx, v: (q.u - px) * s + (q.v - py) * c + py + dy, nu: q.nu * c - q.nv * s, nv: q.nu * s + q.nv * c }));
};
const disc = (x, y, r, n = 36) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));
const box = (x0, y0, x1, y1, r) => rrect(x0, y0, x1, y1, r, 6);

const S = 3.2, REST = 0, ON = "spin", OFF = "rest", HW = 120, HH = 240, CTR = [0, 0, 44];
const BOX = [[-21, -21, 0], [21, 21, 0], [21, -21, 0], [-21, 21, 0], [0, 0, 92]];
const ball = [];
for (let i = 0; i <= 6; i++) { const t = (i / 6) * Math.PI; ball.push([disc(0, 0, 6 * Math.sin(t) + 0.01, 20), 80 + 6 - 6 * Math.cos(t)]); }
const PARTS = [
  { ring: disc(0, 0, 21), inner: disc(0, 0, 17), z0: 0, z1: 8 },
  { ring: disc(0, 0, 13), inner: disc(0, 0, 12.9), z0: 8, z1: 74 },
  { ring: disc(0, 0, 18), inner: disc(0, 0, 14), z0: 74, z1: 80 },
  { layers: ball, hi: 1 },
];
const pose = () => ({ a: 0, px: 0, py: 0, dx: 0, dy: 0, dz: 0 });
let stripes = null;
function deco(P, front, g, t) {
  if (!stripes) stripes = mk("path", { class: "nf" }, g);
  const ph = t * Math.PI / 3, segs = [];
  for (let k = 0; k < 6; k++) {
    const b = Math.floor(k / 2) * (2 * Math.PI / 3) + (k % 2) * 0.55 + ph;
    let run = [];
    for (let z = 9; z <= 73; z += 1.5) {
      const th = b + z * 0.1, c = Math.cos(th), s = Math.sin(th);
      if (front({ u: 13 * c, v: 13 * s, nu: c, nv: s })) run.push(P(13 * c, 13 * s, z));
      else { if (run.length > 1) segs.push(open(run)); run = []; }
    }
    if (run.length > 1) segs.push(open(run));
  }
  stripes.setAttribute("d", segs.join(" "));
}

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amp = value / 100;
  const C = Cam(45, 0.5, S);
  fit(C, BOX, 200, 162);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const parts = PARTS.map((p) => ({ ...p, s: solid(g) }));
  const sp = spring(REST, { k: 90, c: 16 });
  let last = NaN;
  function draw(t) {
    if (t === last) return;
    last = t;
    const q = pose(t * amp);
    for (const p of parts) {
      const m = p.mv ? q : { a: 0, px: 0, py: 0, dx: 0, dy: 0, dz: 0, sh: 0 };
      const T = (r, z) => tr(r, m.a, m.px, m.py, m.dx + (m.sh || 0) * (z - (m.pz || 0)), m.dy);
      if (p.layers) {
        const pts = [];
        for (const [r, z] of p.layers) pts.push(...ringAt(P, T(r, z), z + m.dz));
        p.s.sil.setAttribute("d", poly(hull(pts)));
        p.s.cr.setAttribute("d", p.lip ? poly(ringAt(P, T(p.lip[0], p.lip[1]), p.lip[1] + m.dz)) : "");
      } else put(p.s, prism(P, front, T(p.ring, p.z0), T(p.inner, p.z0), p.z0 + m.dz, p.z1 + m.dz));
      p.s.sil.classList.toggle("hi", !!p.hi);
    }
    if (typeof deco === "function") deco(P, front, g, t * amp);
  }
  const B = register(stage, (dt) => { const mv = stepS(sp, dt); draw(sp.x); return mv; });
  bag.add(B.unregister);
  const ctr = P(...CTR);
  let act = null;
  function setActive(a) {
    if (a === act) return;
    act = a;
    sp.t = a ? 1 : REST;
    read.textContent = a ? ON : OFF;
    B.wake();
  }
  draw(REST);
  setActive(false);
  const hit = ([sx, sy]) => Math.abs(sx - ctr[0]) < HW && Math.abs(sy - ctr[1]) < HH;
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amp = v / 100; last = NaN; draw(sp.x); }, destroy: bag.dispose };
}

hairline({
  name: "barberpole",
  means: "A barber pole on its base: point at it and the stripes spin up the pole.",
  rules: [1, 4, 5, 6],
  range: [30, 90, 100],
  tour: [[205,160],[200,100],[195,220],null],
  mount,
});
