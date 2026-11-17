/**
 * Go bowl: a round wooden bowl of stones with a domed lid. The pointer over
 * the bowl lifts the lid clear and swings it aside, showing the stones; at
 * rest the lid sits ajar, bright. The slider is how far the lid lifts.
 */
const {
  Cam, circ, fit, facing, hull, poly, prism, proj, ringAt, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const R = 40, H = 30, LR = 42;
const disc = (x, y, r, n = 48) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.5);
  fit(C, [[-R, -R, 0], [R, R, 0], [R, -R, 0], [-R, R, 0], [-24, -40, H + 64], [0, 0, H + 20]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  // the bowl: a wide foot, a fuller belly, an open mouth
  const belly = [];
  for (const [r, z] of [[R * 0.72, 0], [R * 0.95, H * 0.35], [R, H * 0.6], [R * 0.9, H]]) belly.push(...ringAt(P, disc(0, 0, r), z));
  mk("path", { d: poly(hull(belly)), class: "sil" }, g);
  mk("path", { d: poly(ringAt(P, disc(0, 0, R * 0.9), H)), class: "lo" }, g);
  mk("path", { d: poly(ringAt(P, disc(0, 0, R * 0.78), H)), class: "nf lo" }, g);
  // the stones: a heap of small lenses inside the mouth
  for (const [x, y] of [[-14, -6], [-4, -16], [8, -10], [-10, 8], [4, 2], [16, 4], [-2, 14], [12, 16], [-20, -2]]) {
    const st = [];
    for (const [r, z] of [[5.5, 0], [4, 1.8]]) st.push(...ringAt(P, disc(x, y, r, 16), H - 3 + z));
    mk("path", { d: poly(hull(st)), class: "lo" }, g);
  }
  const lidG = mk("g", {}, g), lid = mk("path", { class: "sil" }, lidG), lidRim = mk("path", { class: "nf lo" }, lidG);
  const REST = 0.18, lift = tween(REST);
  let last = NaN;

  function draw(t) {
    if (t === last) return;
    last = t;
    const dx = -24 * t, dy = -40 * t, z0 = H + 2 + 34 * t, tilt = 0.35 * t, pts = [];
    const ring = (r, z) => disc(0, 0, r).map((q) => {
      const zz = z + q.v * Math.sin(tilt) * 0.6;
      return P(dx + q.u, dy + q.v * Math.cos(tilt), zz);
    });
    for (let i = 0; i <= 6; i++) { const a = (i / 6) * (Math.PI / 2); pts.push(...ring(LR * Math.cos(a), z0 + 11 * Math.sin(a))); }
    lid.setAttribute("d", poly(hull(pts)));
    lidRim.setAttribute("d", poly(ring(LR, z0 + 1.5)));
  }

  const B = register(stage, (_dt, now) => { draw(tval(lift, now)); return !tdone(lift, now); });
  bag.add(B.unregister);
  const mid = P(0, 0, H / 2);
  let act = null;
  function setActive(on) {
    if (on === act) return;
    act = on;
    tset(lift, on ? reach : REST, performance.now(), 0);
    lid.classList.toggle("hi", true);
    read.textContent = on ? "open" : "rest";
    B.wake();
  }
  setActive(false);
  bag.add(pointer(stage, {
    move: ([sx, sy]) => setActive(Math.hypot((sx - mid[0]) / 1.4, sy - mid[1]) < 90),
    leave: () => setActive(false),
  }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; if (act) { tset(lift, v, performance.now(), 0); B.wake(); } }, destroy: bag.dispose };
}

hairline({
  name: "gobowl",
  means: "A round Go bowl of stones: the pointer over it lifts the domed lid clear and swings it aside.",
  rules: [1, 4, 5, 8],
  range: [0.3, 0.8, 1],
  tour: [[200, 196], [176, 172], [228, 214], null],
  mount,
});
