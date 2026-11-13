/**
 * Pen cup: a round desk cup holding seven pens and pencils of different
 * lengths, each leaning out from the rim, beside a ruled notepad. The pointer
 * picks a pen by its resting shaft: it rises out of the cup and tilts
 * further, and the pens beside it round the rim rise a little, staggered
 * from it. At rest the pens stand at uneven heights, one raised and bright.
 * The slider is the stagger.
 *
 * The pattern: one of many round a ring (riffle); each pen pivots on its own
 * point inside the rim, so it never passes through the wall.
 */
const {
  Cam, circ, fit, facing, hull, poly, prism, proj, rings, ringAt, run, seg, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const R = 13, CH = 26, RQ = 9.5, N = 7, LIFT = 22, TILT = 18, FAV = 4;
// [angle round the rim, length, pencil?, rest lean, rest lift]
const PENS = [[205, 46, 1, 9, 0], [250, 52, 0, 6, 3], [295, 42, 1, 11, 1], [340, 49, 0, 5, 0], [25, 54, 1, 8, 8], [75, 44, 0, 12, 2], [130, 48, 0, 7, 0]];
const disc = (x, y, r, n = 40) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const S = 2.75, C = Cam(45, 0.5, S);
  fit(C, [[-R, -R, 0], [54, 22, 0], [54, -16, 0], [-R, R, 0], [-8, -8, 68], [8, 8, 76]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  // the notepad, flat on the desk to the right, with its binding and ruled lines
  const [nr, ni] = rings(22, -16, 54, 22, 2, 1);
  const pad = solid(g);
  put(pad, prism(P, front, nr, ni, 0, 3));
  let rule = seg(P(22.5, -11, 3), P(53.5, -11, 3));
  for (let y = -5; y < 20; y += 4.5) rule += seg(P(26, y, 3), P(50, y, 3));
  mk("path", { class: "nf lo", d: rule }, pad.g);

  // the cup's back: its whole silhouette and the rim, under the pens
  const outer = disc(0, 0, R), inner = disc(0, 0, R - 1.6);
  const cup = solid(g);
  put(cup, prism(P, front, outer, inner, 0, CH));
  mk("path", { class: "nf lo", d: poly(ringAt(P, inner, CH)) }, cup.g);

  // pens, far to near: a capsule in screen space; pencils end in a cone, pens carry a cap band
  const rr = 1.5 * S;
  const pens = PENS.map(([deg, len, pencil, lean, lift], k) => {
    const a = (deg * Math.PI) / 180, q = [RQ * Math.cos(a), RQ * Math.sin(a), CH];
    return { k, a, q, len, pencil, lean, lift, grp: null, sil: null, band: null, z: tween(lift), t: tween(lean), last: "" };
  });
  for (const p of pens.slice().sort((m, n) => m.q[0] + m.q[1] - (n.q[0] + n.q[1]))) {
    p.grp = mk("g", {}, g);
    p.sil = mk("path", { class: "sil" }, p.grp);
    p.band = mk("path", { class: "nf lo" }, p.grp);
  }
  const fr = run(outer, front);
  mk("path", { class: "sil", d: poly(ringAt(P, fr, CH).concat(ringAt(P, fr, 0).reverse())) }, g);

  // the pen's axis: through its pivot inside the rim, leaning out by t degrees, slid up by z
  function axis(p, z, t) {
    const tr = (t * Math.PI) / 180, d = [Math.sin(tr) * Math.cos(p.a), Math.sin(tr) * Math.sin(p.a), Math.cos(tr)];
    const below = (CH - 3) / d[2] - z;
    return (s) => P(p.q[0] + d[0] * (s - below), p.q[1] + d[1] * (s - below), p.q[2] + d[2] * (s - below));
  }
  const capsule = (a, b, ra, rb) => {
    const pts = [];
    for (let i = 0; i < 12; i++) { const w = (i / 12) * Math.PI * 2, c = Math.cos(w), s = Math.sin(w); pts.push([a[0] + ra * c, a[1] + ra * s], [b[0] + rb * c, b[1] + rb * s]); }
    return poly(hull(pts));
  };
  function draw(p, z, t) {
    const key = z.toFixed(2) + "," + t.toFixed(2);
    if (key === p.last) return;
    p.last = key;
    const at = axis(p, z, t), L = p.len;
    if (p.pencil) {
      p.sil.setAttribute("d", poly(hull([...hullPts(at(0), rr), ...hullPts(at(L - 6), rr), ...hullPts(at(L), rr * 0.25)])));
      p.band.setAttribute("d", bandAt(at, L - 6));
    } else {
      p.sil.setAttribute("d", capsule(at(0), at(L), rr, rr));
      p.band.setAttribute("d", bandAt(at, L - 14));
    }
  }
  const hullPts = (c, r) => { const o = []; for (let i = 0; i < 12; i++) { const w = (i / 12) * Math.PI * 2; o.push([c[0] + r * Math.cos(w), c[1] + r * Math.sin(w)]); } return o; };
  function bandAt(at, s) {
    const a = at(s), b = at(s + 1), dx = b[0] - a[0], dy = b[1] - a[1], m = Math.hypot(dx, dy) || 1, nx = (-dy / m) * rr * 0.85, ny = (dx / m) * rr * 0.85;
    return seg([a[0] - nx, a[1] - ny], [a[0] + nx, a[1] + ny]);
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const p of pens) { draw(p, tval(p.z, now), tval(p.t, now)); if (!tdone(p.z, now) || !tdone(p.t, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  // the hit: nearest resting shaft above the rim, in screen space
  const shafts = pens.map((p) => { const at = axis(p, p.lift, p.lean); return [at((CH - 3) / Math.cos((p.lean * Math.PI) / 180) - p.lift + 2), at(p.len)]; });
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    shafts.forEach(([a, b], k) => {
      const vx = b[0] - a[0], vy = b[1] - a[1], u = Math.max(0, Math.min(1, ((sx - a[0]) * vx + (sy - a[1]) * vy) / (vx * vx + vy * vy)));
      const dd = Math.hypot(sx - a[0] - u * vx, sy - a[1] - u * vy);
      if (dd < bd) { bd = dd; best = k; }
    });
    return bd < 12 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    pens.forEach((p, k) => {
      const d = a < 0 ? -1 : Math.min(Math.abs(k - a), N - Math.abs(k - a));
      const z = d < 0 ? p.lift : d === 0 ? LIFT : d === 1 ? 7 : d === 2 ? 3 : 0, t = d < 0 ? p.lean : d === 0 ? p.lean + TILT : d === 1 ? p.lean + 5 : p.lean;
      const delay = from < 0 ? 0 : Math.min(Math.abs(k - from), N - Math.abs(k - from)) * stag;
      tset(p.z, z, now, delay); tset(p.t, t, now, delay);
      p.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "pen " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "pencup",
  means: "A desk pen cup of seven pens and pencils: the one under the pointer rises out and tilts, and those beside it rise a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[123, 105], [165, 83], [186, 106], null],
  mount,
});
