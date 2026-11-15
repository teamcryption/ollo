/**
 * Mini bar fridge: a small cabinet whose front door hangs on its left edge,
 * with a rack of bottles standing on the inside of the door. At rest the door
 * is ajar, the middle bottle bright. The pointer over the fridge swings the
 * door open on its hinge and the bottles swing out with it.
 * The slider is how far the door opens.
 */
const {
  Cam, circ, fit, facing, hull, poly, prism, proj, rings, ringAt, unproj, tset, tval, tdone, tween, rad,
  disposer, mk, pointer, put, register, solid,
} = HL;

const W = 44, D = 40, H = 54, T = 3, REST = 14;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.75);
  fit(C, [[0, 0, 0], [W, D, 0], [W, 0, 0], [0, D + W + 4, 0], [0, 0, H], [W, D, H], [0, D + W, H]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(0, 0, W, D, 4, 1.4);
  put(solid(g), prism(P, front, br, bi, 0, H));
  mk("path", { d: poly([P(4, D, 4), P(W - 4, D, 4), P(W - 4, D, H - 4), P(4, D, H - 4)]), class: "nf lo" }, g);
  const door = mk("path", { class: "sil" }, g), dcr = mk("path", { class: "nf lo" }, g);
  const bottles = [];
  for (let r = 0; r < 2; r++) for (let c = 0; c < 3; c++) bottles.push({ u: 9 + c * 13, z: 6 + r * 22, el: mk("path", { class: "nf" }, g) });
  const ang = tween(REST);
  let last = NaN;

  const at = (th, u, n, z) => [u * Math.cos(th) + n * Math.sin(th), D + u * Math.sin(th) - n * Math.cos(th), z];
  function draw(a) {
    if (a === last) return;
    last = a;
    const th = rad(a), corners = [[0, 0], [W, 0], [W, T], [0, T]];
    const pts = [];
    for (const z of [0, H]) for (const [u, n] of corners) pts.push(P(...at(th, u, -n, z)));
    door.setAttribute("d", poly(hull(pts)));
    dcr.setAttribute("d", poly([P(...at(th, 4, 0.2, 4)), P(...at(th, W - 4, 0.2, 4)), P(...at(th, W - 4, 0.2, H - 4)), P(...at(th, 4, 0.2, H - 4))]));
    const order = bottles.slice().sort((p, q) => at(th, p.u, 0, 0)[0] + at(th, p.u, 0, 0)[1] - (at(th, q.u, 0, 0)[0] + at(th, q.u, 0, 0)[1]));
    for (const b of order) {
      const [x, y] = at(th, b.u, 5, 0), ring = circ(4, 16).map((q) => ({ ...q, u: q.u + x, v: q.v + y })), neck = circ(1.6, 12).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));
      b.el.setAttribute("d", poly(hull(ringAt(P, ring, b.z).concat(ringAt(P, ring, b.z + 12), ringAt(P, neck, b.z + 19)))));
      g.appendChild(b.el);
    }
  }
  const B = register(stage, (_dt, now) => { draw(tval(ang, now)); return !tdone(ang, now); });
  bag.add(B.unregister);

  let act = null;
  function setActive(a) {
    if (a === act) return;
    act = a;
    tset(ang, a ? 40 + 60 * reach : REST, performance.now(), 0);
    bottles.forEach((b, i) => b.el.classList.toggle("hi", a ? i === 4 || i === 1 : i === 1));
    read.textContent = a ? "open" : "rest";
    B.wake();
  }
  function hit([sx, sy]) {
    for (const z of [0, H / 2, H]) { const [x, y] = unproj(C, sx, sy, z); if (x > -4 && x < W + 4 && y > -4 && y < D + 8) return true; }
    return false;
  }
  setActive(false);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; if (act) { act = null; setActive(true); } }, destroy: bag.dispose };
}

hairline({
  name: "doorhanger2",
  means: "A mini bar fridge with bottles in its door rack: the pointer swings the door open and the bottles swing out with it.",
  rules: [1, 3, 5, 6],
  range: [0, 0.8, 1],
  tour: [[247, 100], [243, 59], [251, 269], null],
  mount,
});
