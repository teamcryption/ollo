/**
 * Ship loader: a slewing boom conveyor on a pedestal at the quay edge, its
 * spout hanging from the tip over a barge's hold. The boom swings round its
 * pedestal toward the pointer, carrying the spout along the hatches. At
 * rest it stands angled over the barge, the boom bright. The slider is how
 * far the boom may slew.
 *
 * The pattern: a part turning to face the pointer (spring).
 */
const {
  Cam, circ, clamp, fit, facing, hull, poly, prism, proj, rings, ringAt, run, open,
  disposer, mk, pointer, put, register, solid, spring, stepS, unproj, rad,
} = HL;

const QZ = 6, PX = 40, PY = 58, PZ = 46, L = 86, CW = 20, BW = 5, REST = 12;
const disc = (x, y, r, n = 28) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let H = value;
  const C = Cam(45, 0.5, 1.65);
  const fp = [[0, 0, 0], [72, 0, 0], [72, 120, 0], [0, 120, 0], [146, 2, 0], [146, 118, 0]];
  for (let a = -90; a <= 90; a += 15) fp.push([PX + L * Math.cos(rad(a)), PY + L * Math.sin(rad(a)), PZ + 8]);
  fit(C, fp, 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [qr, qi] = rings(0, 0, 72, 120, 6, 2);
  put(solid(g), prism(P, front, qr, qi, 0, QZ));
  put(solid(g), prism(P, front, disc(PX, PY, 13), disc(PX, PY, 11), QZ, QZ + 3));
  put(solid(g), prism(P, front, disc(PX, PY, 8), disc(PX, PY, 6.5), QZ + 3, PZ));
  const [sr, si] = rings(82, 4, 146, 116, 22, 2.5);
  put(solid(g), prism(P, front, sr, si, 0, 12));
  for (const y0 of [22, 50, 78]) { const [hr] = rings(98, y0, 130, y0 + 20, 2, 1); mk("path", { d: poly(ringAt(P, hr, 12)), class: "nf lo" }, g); }

  const spout = solid(g), boom = solid(g), belt = mk("path", { class: "nf lo" }, g);
  const th = spring(REST);
  let last = NaN;
  function draw() {
    const a = rad(th.x);
    if (Math.abs(a - last) < 1e-4) return;
    last = a;
    const c = Math.cos(a), s = Math.sin(a);
    const at = (u, v, z) => P(PX + u * c - v * s, PY + u * s + v * c, z + u * -0.06);
    const box = [];
    for (const u of [-CW, L]) for (const v of [-BW, BW]) for (const z of [PZ, PZ + 6]) box.push(at(u, v, z));
    const ins = [[-CW + 2, -BW + 1.4], [L - 2, -BW + 1.4], [L - 2, BW - 1.4], [-CW + 2, BW - 1.4]].map(([u, v]) => at(u, v, PZ + 6));
    put(boom, { sil: poly(hull(box)), crease: poly(ins) });
    belt.setAttribute("d", open([at(4, 0, PZ + 6), at(L - 6, 0, PZ + 6)]));
    const tx = PX + (L - 4) * c, ty = PY + (L - 4) * s;
    put(spout, prism(P, front, disc(tx, ty, 3.4, 18), disc(tx, ty, 2.4, 18), 18, PZ - 2));
  }
  draw();
  boom.sil.classList.add("hi");

  const B = register(stage, (dt) => { const m = stepS(th, dt); draw(); return m; });
  bag.add(B.unregister);

  function aim(p) {
    let d = null;
    if (p) {
      const [x, y] = unproj(C, p[0], p[1], 0);
      if (x > -20 && x < 170 && y > -30 && y < 150 && Math.hypot(x - PX, y - PY) > 12) d = Math.atan2(y - PY, x - PX) * 180 / Math.PI;
    }
    th.t = d === null ? REST : clamp(d, -H, H);
    read.textContent = d === null ? "rest" : "slew " + Math.round(th.t) + "°";
    B.wake();
  }
  aim(null);
  bag.add(pointer(stage, { move: aim, leave: () => aim(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { H = v; }, destroy: bag.dispose };
}

hairline({
  name: "shiploader",
  means: "A ship loader at the quay: its boom conveyor slews round the pedestal toward the pointer, carrying the spout over the hatches.",
  rules: [1, 3, 4, 5],
  range: [30, 60, 80],
  tour: [[326, 182], [240, 236], [151, 258], null],
  mount,
});
