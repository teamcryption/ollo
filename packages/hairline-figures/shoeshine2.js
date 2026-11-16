/**
 * Shoe polish: a round tin of polish on a cloth. The pointer over the tin
 * tilts its lid open on the far hinge to show the wax; leaving lets it settle
 * back ajar. At rest the lid stands a little open, bright. The slider is how
 * far the lid opens.
 */
const {
  Cam, circ, fit, facing, hull, poly, prism, proj, ringAt, tdone, tset, tval, tween, unproj,
  disposer, mk, pointer, put, register, solid,
} = HL;

const R = 30, H = 11, LH = 6, REST = 0.18;
const disc = (r, n = 48) => circ(r, n);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amax = value;
  const C = Cam(45, 0.5, 2.85);
  fit(C, [[-R - 4, -R - 4, 0], [R + 4, R + 4, 0], [R + 4, -R - 4, 0], [-R - 4, R + 4, 0], [0, R + 8, H + 2 * R + 8], [0, -R - 8, H + 2 * R + 8]], 200, 160);
  const P = proj(C), front = facing(C);
  // hinge on the far side (the side higher on screen)
  const s = P(0, R, 0)[1] < P(0, -R, 0)[1] ? 1 : -1, yh = s * R;
  const g = mk("g", {}, svg);
  put(solid(g), prism(P, front, disc(R + 10, 6).map((q) => ({ u: q.u * 1.25, v: q.v * 0.9 })), disc(R + 7, 6).map((q) => ({ u: q.u * 1.25, v: q.v * 0.9 })), 0, 0.8));
  put(solid(g), prism(P, front, disc(R), disc(R - 2.5), 0.8, H));
  mk("path", { d: poly(ringAt(P, disc(R - 3), H - 0.5)), class: "nf lo" }, g);
  mk("path", { d: poly(ringAt(P, disc(R - 13, 32).map((q) => ({ u: q.u + 4, v: q.v - 3 })), H - 0.5)), class: "nf lo" }, g);
  const lid = mk("path", { class: "sil" }, g), band = mk("path", { class: "nf" }, g), boss = mk("path", { class: "nf lo" }, g), boss2 = mk("path", { class: "nf lo" }, g);
  const t = tween(REST);
  let last = NaN;

  function rot(A, x, y, dz) {
    const dy = y - yh, c = Math.cos(A), sn = Math.sin(A);
    return P(x, yh + dy * c + s * dz * sn, H + 0.2 + -s * dy * sn + dz * c);
  }
  const ring = (A, r, dz) => disc(r).map((q) => rot(A, q.u, q.v, dz));
  function draw(k) {
    if (k === last) return;
    last = k;
    const A = (k * amax * Math.PI) / 180;
    lid.setAttribute("d", poly(hull(ring(A, R + 1, 0).concat(ring(A, R + 1, LH)))));
    band.setAttribute("d", poly(ring(A, R + 1, LH)));
    boss.setAttribute("d", poly(ring(A, R - 7, LH)));
    boss2.setAttribute("d", poly(ring(A, R - 15, LH)));
  }
  const B = register(stage, (_dt, now) => { draw(tval(t, now)); return !tdone(t, now); });
  bag.add(B.unregister);

  let on = null;
  function setOn(a) {
    if (a === on) return;
    on = a;
    tset(t, a ? 1 : REST, performance.now(), 0);
    lid.classList.add("hi");
    read.textContent = a ? "open" : "rest";
    B.wake();
  }
  setOn(false);
  bag.add(pointer(stage, {
    move: ([sx, sy]) => { const [x, y] = unproj(C, sx, sy, H / 2); setOn(Math.hypot(x, y) < R + 12); },
    leave: () => setOn(false),
  }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amax = v; last = NaN; B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "shoeshine2",
  means: "A round tin of shoe polish: the pointer over the tin tilts its lid open on the far hinge to show the wax inside.",
  rules: [1, 3, 4, 5, 6],
  range: [50, 80, 110],
  tour: [[200, 215], [140, 212], [260, 231], null],
  mount,
});
