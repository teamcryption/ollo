/**
 * Score dial: a round tabletop counter with a ring of twelve score notches
 * and a long arm turning on a centre knob. The pointer picks a notch by its
 * direction from the centre and the arm swings round to it; at rest the arm
 * points at three, bright. The slider is how far out the arm reaches.
 */
const {
  Cam, circ, fit, facing, hull, poly, prism, proj, seg, tdone, tset, tval, tween, unproj,
  disposer, mk, pointer, put, register, solid,
} = HL;

const R = 50, H = 10, N = 12, REST = 3;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let len = value;
  const C = Cam(45, 0.5, 2.5);
  fit(C, [[-R, -R, 0], [R, R, 0], [R, -R, 0], [-R, R, 0], [0, 0, H + 11]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  put(solid(g), prism(P, front, circ(R, 72), circ(R - 2, 72), 0, H));
  mk("path", { d: poly(circ(R - 14, 64).map((q) => P(q.u, q.v, H))), class: "nf lo" }, g);
  const ang = (k) => (k / N) * Math.PI * 2 - Math.PI / 2;
  let d = "";
  for (let k = 0; k < N; k++) { const a = ang(k), l = k % 3 === 0 ? 9 : 5; d += seg(P((R - 4) * Math.cos(a), (R - 4) * Math.sin(a), H), P((R - 4 - l) * Math.cos(a), (R - 4 - l) * Math.sin(a), H)); }
  mk("path", { d, class: "nf lo" }, g);
  const arm = mk("path", { class: "sil hi" }, g), armT = mk("path", { class: "nf lo" }, g);
  const knob = solid(g);
  put(knob, prism(P, front, circ(6, 24), circ(4.5, 24), H, H + 9));
  const tw = tween(ang(REST));
  let last = NaN;

  function draw(a) {
    if (a === last) return;
    last = a;
    const L = (R - 6) * len, c = Math.cos(a), s = Math.sin(a), q = (u, v, z = H + 2) => P(u * c - v * s, u * s + v * c, z);
    const sh = [[-16, -7], [L - 12, -6], [L, 0], [L - 12, 6], [-16, 7]];
    arm.setAttribute("d", poly(hull(sh.map(([u, v]) => q(u, v)).concat(sh.map(([u, v]) => q(u, v, H + 5))))));
    armT.setAttribute("d", poly(sh.map(([u, v]) => q(u * 0.86, v * 0.6, H + 5))));
  }

  const B = register(stage, (_dt, now) => { draw(tval(tw, now)); return !tdone(tw, now); });
  bag.add(B.unregister);
  let act = -2;
  function setActive(k) {
    if (k === act) return;
    act = k;
    let target = ang(k < 0 ? REST : k), now = performance.now(), from = tval(tw, now);
    while (target - from > Math.PI) target -= Math.PI * 2;
    while (from - target > Math.PI) target += Math.PI * 2;
    tset(tw, target, now, 0);
    read.textContent = k < 0 ? "rest" : String(k === 0 ? N : k).padStart(2, "0");
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, {
    move: ([sx, sy]) => {
      const [x, y] = unproj(C, sx, sy, H), r = Math.hypot(x, y);
      if (r > R + 6 || r < 4) return setActive(-1);
      setActive(((Math.round((Math.atan2(y, x) + Math.PI / 2) / (Math.PI * 2 / N)) % N) + N) % N);
    },
    leave: () => setActive(-1),
  }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { len = v; last = NaN; B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "scoreboardpeg",
  means: "A round score dial: the pointer picks a notch around the face and the long arm swings round to point at it.",
  rules: [1, 4, 5, 8],
  range: [0.6, 1, 1],
  tour: [[156, 105], [252, 186], [150, 182], null],
  mount,
});
