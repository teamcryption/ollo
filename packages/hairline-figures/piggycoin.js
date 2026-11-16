/**
 * Savings tin: a round money tin with a slotted lid hinged at the back and
 * its little key lying beside it. The pointer over the tin tilts the lid
 * open, bright. At rest the lid sits just ajar.
 * The slider is how far it opens.
 */
const { Cam, circ, fit, facing, hull, poly, prism, proj, rings, ringAt, tween, tset, tval, tdone, mk, solid, put, register, pointer, disposer, rad } = HL;
const R = 30, H = 34;
const disc = (x, y, r, n = 40) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amp = value;
  const C = Cam(45, 0.5, 2.5);
  fit(C, [[-R, -R, 0], [R, R, 0], [-R, R, 0], [R + 36, R, 0], [-R, -R, H + 2 * R], [R, -R, H + 2 * R]], 200, 155);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  put(solid(g), prism(P, front, disc(0, 0, R), disc(0, 0, R - 2), 0, H));
  const band = mk("path", { class: "nf lo" }, g);
  band.setAttribute("d", poly(ringAt(P, disc(0, 0, R, 40), H - 6)).replace(/Z$/, ""));
  const lid = mk("path", { class: "sil" }, g), top = mk("path", { class: "nf" }, g), slot = mk("path", { class: "nf" }, g);
  put(solid(g), prism(P, front, disc(R + 12, 18, 6, 24), disc(R + 12, 18, 3.4, 24), 0, 2));
  const [kr, ki] = rings(R + 17, 16.5, R + 36, 19.5, 1, 0.5);
  put(solid(g), prism(P, front, kr, ki, 0, 2));
  const [tr, ti] = rings(R + 30, 19.5, R + 33, 24, 0.8, 0.4);
  put(solid(g), prism(P, front, tr, ti, 0, 2));
  const ang = tween(10);
  let last = NaN;
  const lr = disc(0, 0, R + 1, 40);
  function draw(a) {
    if (a === last) return;
    last = a;
    const c = Math.cos(rad(a)), s = Math.sin(rad(a));
    const tf = (x, y, w) => { const v = y + R + 1; return P(x, -R - 1 + v * c - w * s, H + v * s + w * c); };
    const pts = [];
    for (const q of lr) { pts.push(tf(q.u, q.v, 0)); pts.push(tf(q.u, q.v, 5)); }
    lid.setAttribute("d", poly(hull(pts)));
    top.setAttribute("d", poly(lr.map((q) => tf(q.u, q.v, 5))));
    const a1 = tf(-12, 0, 5), a2 = tf(12, 0, 5), b1 = tf(-12, 3, 5), b2 = tf(12, 3, 5);
    slot.setAttribute("d", poly([a1, a2, b2, b1]));
  }
  const B = register(stage, (_dt, now) => { draw(tval(ang, now)); return !tdone(ang, now); });
  bag.add(B.unregister);
  lid.classList.add("hi");
  const ctr = P(0, 0, H / 2);
  let act = -1;
  function setActive(a) {
    if (a === act) return;
    act = a;
    tset(ang, a ? amp : 10, performance.now(), 0);
    read.textContent = a ? "open" : "rest";
    B.wake();
  }
  setActive(0);
  bag.add(pointer(stage, { move: ([sx, sy]) => setActive(Math.abs(sx - ctr[0]) < 90 && Math.abs(sy - ctr[1]) < 85 ? 1 : 0), leave: () => setActive(0) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amp = v; if (act) { tset(ang, amp, performance.now(), 0); B.wake(); } }, destroy: bag.dispose };
}

hairline({
  name: "piggycoin",
  means: "A round savings tin with its key beside it: the pointer over the tin tilts the slotted lid open on its hinge.",
  rules: [1, 3, 4, 5],
  range: [40, 65, 75],
  tour: [[200, 167], [200, 132], [200, 167], null],
  mount,
});
