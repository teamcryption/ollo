/**
 * Pasta pot: a tall stockpot on a hob plate with a perforated strainer insert
 * standing in it. Over the pot, the insert rises out and tips to drain. At
 * rest it sits a little proud of the rim, bright. The slider is how far it lifts.
 *
 * The pattern: one part answering on a 700ms tween (open / closed).
 */
const {
  Cam, circ, fit, facing, hull, open, poly, prism, proj, rings, ringAt, run, tdone, tset, tval, tween, unproj,
  disposer, mk, pointer, put, register, solid,
} = HL;

const R = 34, H = 52, Z0 = 4, IR = 30, LIFT = 48, TILT = 0.3;
const disc = (x, y, r, n = 40) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amt = value;
  const C = Cam(45, 0.5, 1.85);
  fit(C, [[-50, -50, 0], [50, 50, 0], [-30, 0, Z0 + 8 + LIFT + H + 8], [30, 0, Z0 + 8 + LIFT + H + 8]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [pr, pi] = rings(-48, -48, 48, 48, 10, 2);
  put(solid(g), prism(P, front, pr, pi, 0, Z0));
  const box = (x0, y0, x1, y1, z0, z1) => { const [a, b] = rings(x0, y0, x1, y1, 2, 1); put(solid(g), prism(P, front, a, b, z0, z1)); };
  box(-R - 9, -6, -R + 2, 6, Z0 + H - 12, Z0 + H - 7);
  const outer = disc(0, 0, R), inner = disc(0, 0, R - 2);
  put(solid(g), prism(P, front, outer, inner, Z0, Z0 + H));
  const ins = mk("path", { class: "sil" }, g), band = mk("path", { class: "nf lo" }, g), lip = mk("path", { class: "nf lo" }, g);
  const holes = mk("path", { class: "nf lo" }, g);
  const fr = run(outer, front);
  mk("path", { d: poly(ringAt(P, fr, Z0 + H).concat(ringAt(P, fr, Z0).reverse())), class: "sil" }, g);
  box(R - 2, -6, R + 9, 6, Z0 + H - 12, Z0 + H - 7);

  const ring = disc(0, 0, IR, 36), ringIn = disc(0, 0, IR - 2, 36);
  const xf = (q, z, s) => { const a = TILT * s, l = LIFT * amt * s, x = q.u, zz = z + l; const c = Math.cos(a), sn = Math.sin(a), dx = x + IR, dz = zz - (Z0 + 8 + l);
    return P(-IR + dx * c - dz * sn, q.v, Z0 + 8 + l + dx * sn + dz * c); };
  const tw = tween(0.12);
  let last = NaN;
  function draw(s) {
    if (s === last) return;
    last = s;
    const zb = Z0 + 8, zt = zb + H + 6;
    const pts = ring.map((q) => xf(q, zb, s)).concat(ring.map((q) => xf(q, zt, s)));
    ins.setAttribute("d", poly(hull(pts)));
    lip.setAttribute("d", poly(ringIn.map((q) => xf(q, zt, s))));
    band.setAttribute("d", open(run(ring, front).map((q) => xf(q, zt - 8, s))));
    let d = "";
    for (const zz of [zt - 16, zt - 24, zt - 32]) for (const q of run(ring, front)) if (q === run(ring, front)[0] || ring.indexOf(q) % 3) continue; else { const [x, y] = xf(q, zz, s); d += "M" + (x - 0.8).toFixed(2) + " " + y.toFixed(2) + "h1.6"; }
    holes.setAttribute("d", d);
  }
  const B = register(stage, (_dt, now) => { draw(tval(tw, now)); return !tdone(tw, now); });
  bag.add(B.unregister);

  let on = null;
  function setOn(v) {
    if (v === on) return;
    on = v;
    tset(tw, v ? 1 : 0.12, performance.now(), 0);
    ins.classList.add("hi");
    read.textContent = v ? "drain" : "rest";
    B.wake();
  }
  setOn(false);
  const bb = ringAt(P, outer, 0).concat(ringAt(P, outer, Z0 + H + 20));
  const X0 = Math.min(...bb.map((q) => q[0])), X1 = Math.max(...bb.map((q) => q[0])), Y0 = Math.min(...bb.map((q) => q[1])), Y1 = Math.max(...bb.map((q) => q[1]));
  const hit = ([sx, sy]) => sx > X0 - 4 && sx < X1 + 4 && sy > Y0 - 4 && sy < Y1 + 4;
  bag.add(pointer(stage, { move: (p) => setOn(hit(p)), leave: () => setOn(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amt = v; last = NaN; B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "noodlepot",
  means: "A stockpot with a strainer insert: over the pot, the insert lifts out and tips to drain.",
  rules: [1, 4, 5, 6],
  range: [0.5, 1, 1],
  tour: [[161, 109], [200, 150], [239, 165], null],
  mount,
});
