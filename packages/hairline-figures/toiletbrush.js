/**
 * Toilet brush: a round holder with the brush standing in it, its lid
 * riding on the handle. The pointer near the holder draws the brush up and
 * out, leaning, the bristle head clear of the rim. At rest the handle sits
 * home, bright. The slider is how far it lifts.
 *
 * The pattern: one part lifting from its sleeve.
 */
const { Cam, circ, fit, facing, hull, poly, prism, proj, rings, ringAt, tdone, tset, tval, tween, disposer, mk, pointer, put, register, solid } = HL;

const HR = 21, HH = 36, LIFT = 38, CZ = 4;
const disc = (x, y, r, n = 36) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.35);
  fit(C, [[-HR - 6, -HR - 6, 0], [HR + 6, HR + 6, 0], [HR + 6, -HR - 6, 0], [-HR - 6, HR + 6, 0], [0, 0, 128], [20, 0, 128]], 200, 160);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(-HR - 6, -HR - 6, HR + 6, HR + 6, 6, 2);
  put(solid(g), prism(P, front, br, bi, 0, CZ));
  const bg = mk("g", {}, g);
  const head = mk("path", { class: "sil" }, bg), stem = mk("path", { class: "sil hi" }, bg), lid = mk("path", { class: "sil" }, bg), lidr = mk("path", { class: "nf lo" }, bg), knob = mk("path", { class: "nf" }, bg);
  const hg = mk("g", {}, g);
  put(solid(hg), prism(P, front, disc(0, 0, HR), disc(0, 0, HR - 2), CZ, CZ + HH));
  const z = tween(0);
  let last = NaN;

  function cyl(x0, z0, x1, z1, r, n = 20) { return hull(ringAt(P, disc(x0, 0, r, n), z0).concat(ringAt(P, disc(x1, 0, r, n), z1))); }
  function draw(f) {
    if (f === last) return;
    last = f;
    const up = f * LIFT, lean = f * 14, base = CZ + 6 + up, top = base + HH + 26;
    const at = (zz) => ((zz - base) / (top - base)) * lean;
    const hp = [];
    for (const [r, dz] of [[9, 0], [11, 6], [10.5, 12], [7, 16]]) hp.push(...ringAt(P, disc(at(base + dz), 0, r, 24), base + dz));
    head.setAttribute("d", poly(hull(hp)));
    stem.setAttribute("d", poly(cyl(at(base + 16), base + 16, lean, top, 2.4)));
    const lz = CZ + HH + 1 + up, lx = at(lz);
    lid.setAttribute("d", poly(hull(ringAt(P, disc(lx, 0, HR + 1.5, 40), lz).concat(ringAt(P, disc(lx, 0, HR - 3, 40), lz + 5)))));
    lidr.setAttribute("d", poly(ringAt(P, disc(lx, 0, HR + 1.5, 40), lz)));
    knob.setAttribute("d", poly(hull(ringAt(P, disc(lean, 0, 4, 16), top).concat(ringAt(P, disc(lean, 0, 4, 16), top + 4)))));
    // holder drawn last only while the brush is home
    if (f < 0.35) g.appendChild(hg); else g.insertBefore(hg, bg);
  }

  const B = register(stage, (_dt, now) => { draw(tval(z, now)); return !tdone(z, now); });
  bag.add(B.unregister);

  const c = P(0, 0, CZ + HH / 2);
  let act = null;
  function setActive(a) {
    if (a === act) return;
    act = a;
    tset(z, a ? reach : 0, performance.now(), 0);
    read.textContent = a ? "out" : "rest";
    B.wake();
  }
  setActive(false);
  bag.add(pointer(stage, { move: ([sx, sy]) => setActive(Math.hypot(sx - c[0], (sy - c[1]) * 0.6) < 90), leave: () => setActive(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; if (act) { act = null; setActive(true); } }, destroy: bag.dispose };
}

hairline({
  name: "toiletbrush",
  means: "A brush standing in its round holder: near the pointer it lifts out and leans, its lid riding up the handle.",
  rules: [1, 3, 5, 6],
  range: [0.5, 1, 1.2],
  tour: [[200, 146], [200, 196], [150, 230], null],
  mount,
});
