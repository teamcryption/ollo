/**
 * Mini PC: a small square computer, a low rounded body with vent slots and a
 * power light on its front, a fan and a memory stick inside, and a lid hinged
 * at the back. The pointer over the box swings the lid open to show the inside;
 * at rest the lid sits ajar, bright. The slider is how far the lid opens.
 */
const {
  Cam, circ, fit, flatDot, hull, place, poly, prism, proj, rings, rrect, seg, unproj, tdone, tset, tval, tween, facing,
  disposer, mk, pointer, put, register, solid,
} = HL;

const W = 64, D = 64, H = 14, T = 3, REST = 14;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let maxA = value;
  const C = Cam(45, 0.5, 2.64);
  fit(C, [[0, 0, 0], [W, D, 0], [W, 0, 0], [0, D, 0], [0, 11, H + 63], [W, 11, H + 63]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [r0, i0] = rings(0, 0, W, D, 8, 1.6);
  const body = solid(g);
  put(body, prism(P, front, r0, i0, 0, H));
  let vents = "";
  for (let k = 0; k < 5; k++) vents += seg(P(8 + k * 7, D, 5), P(8 + k * 7, D, 10));
  mk("path", { class: "nf lo", d: vents }, body.g);
  place(flatDot(body.g, C, 1.6, "dot m"), P(W - 10, D, 7));
  // inside: a fan and a memory stick on the board
  const fan = circ(11, 24).map((q) => P(20 + q.u, 22 + q.v, H));
  const hub = circ(3, 12).map((q) => P(20 + q.u, 22 + q.v, H));
  const ram = rrect(38, 10, 46, 54, 1.5, 3).map((q) => P(q.u, q.v, H));
  mk("path", { class: "nf lo", d: poly(fan) + poly(hub) + poly(ram) + seg(P(10, 44, H), P(30, 44, H)) + seg(P(10, 50, H), P(30, 50, H)) }, g);

  const lid = solid(g);
  const [lr, li] = [rrect(0, 0, W, D, 8, 6), rrect(1.6, 1.6, W - 1.6, D - 1.6, 6.4, 6)];
  const ang = tween(REST);
  let last = NaN;
  function draw(a) {
    if (a === last) return;
    last = a;
    const c = Math.cos((a * Math.PI) / 180), s = Math.sin((a * Math.PI) / 180);
    const xf = (u, v, w) => [u, v * c - w * s, H + v * s + w * c];
    const pts = [];
    for (const q of lr) pts.push(P(...xf(q.u, q.v, 0)), P(...xf(q.u, q.v, T)));
    const top = -0.57 * s + 0.5 * c > 0 ? T : 0;
    lid.sil.setAttribute("d", poly(hull(pts)));
    lid.cr.setAttribute("d", poly(li.map((q) => P(...xf(q.u, q.v, top)))));
  }
  lid.cr.setAttribute("class", "nf lo");
  lid.sil.classList.add("hi");

  const B = register(stage, (_dt, now) => { draw(tval(ang, now)); return !tdone(ang, now); });
  bag.add(B.unregister);

  function hit([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, H);
    return x > -6 && x < W + 6 && y > -6 && y < D + 6 ? 1 : -1;
  }
  let act = -2;
  function setActive(a) {
    if (a === act) return;
    act = a;
    tset(ang, a < 0 ? REST : maxA, performance.now(), 0);
    read.textContent = a < 0 ? "rest" : "open";
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { maxA = v; if (act >= 0) { act = -2; setActive(1); } }, destroy: bag.dispose };
}

hairline({
  name: "thinclient",
  means: "A mini PC: the pointer over the box swings its lid open on the back hinge to show the fan and memory inside.",
  rules: [1, 5, 6, 8],
  range: [45, 70, 80],
  tour: [[200, 217], [168, 200], [234, 236], null],
  mount,
});
