/**
 * Luggage scale: a hand-held hanging scale, a grip on top, a small reading
 * window, and a strap down to a holdall hooked beneath it. The pointer on
 * the floor swings the bag toward it on the hook. At rest the bag hangs
 * with a slight lean, the reading window bright. The slider is the swing.
 *
 * The pattern: one part swinging from a pivot; the hit is on the ground
 * plane, which never moves.
 */
const { Cam, clamp, fit, hull, open, poly, proj, unproj, tdone, tset, tval, tween, disposer, mk, pointer, register } = HL;

const PZ = 60, BW = 30, BD = 14, BH = 18, SL = 12, REST = 0.08;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amp = value;
  const C = Cam(45, 0.5, 4.3);
  fit(C, [[-30, -10, 24], [30, 10, 24], [0, 0, PZ + 22], [-34, 0, PZ - 20], [34, 0, PZ - 20]], 200, 160);
  const P = proj(C);
  const box = (x0, y0, z0, x1, y1, z1) => { const o = []; for (const x of [x0, x1]) for (const y of [y0, y1]) for (const z of [z0, z1]) o.push([x, y, z]); return o; };
  const g = mk("g", {}, svg);
  const guide = mk("path", { class: "nf lo dash" }, g);
  const strap = mk("path", { class: "nf" }, g);
  const bagSil = mk("path", { class: "sil" }, g), bagD = mk("path", { class: "nf lo" }, g);
  const sg = mk("g", {}, g);
  const grip = mk("path", { class: "sil" }, sg), body = mk("path", { class: "sil" }, sg), win = mk("path", { class: "sil" }, sg);
  const Q = (p) => P(...p);
  grip.setAttribute("d", poly(hull(box(-9, -2, PZ + 14, 9, 2, PZ + 18).map(Q))));
  body.setAttribute("d", poly(hull(box(-4, -2.5, PZ, 4, 2.5, PZ + 14).map(Q))) + open([P(-9, 0, PZ + 16), P(-4, 0, PZ + 12)]) + open([P(9, 0, PZ + 16), P(4, 0, PZ + 12)]));
  win.setAttribute("d", poly([P(-2.5, 2.5, PZ + 9), P(2.5, 2.5, PZ + 9), P(2.5, 2.5, PZ + 5), P(-2.5, 2.5, PZ + 5)]));
  win.classList.add("hi");
  const ang = tween(REST);
  let last = NaN;
  function draw(t) {
    if (t === last) return;
    last = t;
    const c = Math.cos(t), s = Math.sin(t);
    const R = ([x, y, z]) => { const dz = z - PZ; return P(x * c - dz * s, y, PZ + x * s + dz * c); };
    const top = PZ - SL;
    strap.setAttribute("d", open([R([-BW / 3, 0, top]), R([0, 0, PZ - 1]), R([BW / 3, 0, top])]));
    bagSil.setAttribute("d", poly(hull(box(-BW / 2, -BD / 2, top - BH, BW / 2, BD / 2, top).map(R))));
    let d = open([R([-BW / 2 + 3, BD / 2, top - 4]), R([BW / 2 - 3, BD / 2, top - 4])]);
    d += open([R([-BW / 2, BD / 2, top]), R([BW / 2, BD / 2, top]), R([BW / 2, -BD / 2, top])]);
    bagD.setAttribute("d", d);
    const sx = (PZ - top + BH) * Math.sin(-t);
    guide.setAttribute("d", open([P(sx - 16, 0, 24), P(sx + 16, 0, 24)]));
  }
  const B = register(stage, (_dt, now) => { draw(tval(ang, now)); return !tdone(ang, now); });
  bag.add(B.unregister);

  function hit([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, 24);
    if (x < -40 || x > 40 || y < -25 || y > 25) return null;
    return clamp(x / 30, -1, 1);
  }
  let act = null;
  function setActive(a) {
    if (a === act) return;
    act = a;
    const t = a === null ? REST : -a * amp * Math.PI / 180;
    tset(ang, t, performance.now(), 0);
    read.textContent = a === null ? "rest" : Math.round(Math.abs(t) * 180 / Math.PI) + "°";
    B.wake();
  }
  setActive(null);
  bag.add(pointer(stage, { move: (p) => { const h = hit(p); setActive(h === null ? null : Math.round(h * 10) / 10); }, leave: () => setActive(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amp = v; }, destroy: bag.dispose };
}

hairline({
  name: "bagscale",
  means: "A hanging luggage scale: the pointer swings the bag on its hook toward it, the reading window above it.",
  rules: [1, 3, 5, 6],
  range: [10, 25, 35],
  tour: [[291, 283], [109, 192], [200, 238], null],
  mount,
});
