/**
 * Agility tire jump: a tyre hung on chains inside a frame of two posts
 * and a crossbar, on two feet. The pointer over the frame swings the
 * tyre on its chains toward the reader, as a dog brushing through would.
 * At rest the tyre hangs still, bright. The slider is the swing.
 */
const { Cam, fit, facing, hull, poly, prism, proj, rings, seg, tdone, tset, tval, tween, disposer, mk, pointer, put, register, solid } = HL;

const W = 96, HZ = 104, CX = W / 2, CZ = 56, RO = 26, RI = 15, T = 5;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amp = value;
  const C = Cam(45, 0.5, 2.05);
  fit(C, [[-8, -26, 0], [W + 8, 26, 0], [W + 8, -26, 0], [-8, 26, 0], [0, 0, HZ + 4], [W, 0, HZ + 4], [CX, 60, 70]], 200, 160);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  for (const x of [0, W]) { const [fr, fi] = rings(x - 7, -24, x + 7, 24, 5, 2); put(solid(g), prism(P, front, fr, fi, 0, 5)); }
  for (const x of [0, W]) { const [pr, pi] = rings(x - 3, -3, x + 3, 3, 2, 1); put(solid(g), prism(P, front, pr, pi, 5, HZ)); }
  const [br, bi] = rings(-4, -3, W + 4, 3, 2, 1);
  put(solid(g), prism(P, front, br, bi, HZ, HZ + 5));
  const chains = mk("path", { class: "nf lo" }, g), tyre = mk("path", { class: "sil" }, g), tread = mk("path", { class: "nf lo" }, g);
  const sw = tween(0);
  let last = NaN;
  const at = (x, y, z, th) => { const dz = z - HZ, dy = y; return P(x, dy * Math.cos(th) - dz * Math.sin(th), HZ + dy * Math.sin(th) + dz * Math.cos(th)); };
  const ring = (r, y, th, n = 36) => { const o = []; for (let i = 0; i < n; i++) { const a = (i / n) * 2 * Math.PI; o.push(at(CX + r * Math.cos(a), y, CZ + r * Math.sin(a), th)); } return o; };
  function draw(th) {
    if (th === last) return; last = th;
    tyre.setAttribute("d", poly(hull(ring(RO, -T, th).concat(ring(RO, T, th)))) + poly(ring(RI, 0, th).reverse()));
    tread.setAttribute("d", poly(ring((RO + RI) / 2, 0, th)));
    let d = "";
    for (const s of [-1, 1]) { const a = Math.PI / 2 + s * 0.55; d += seg(at(CX + s * 30, 0, HZ, th), at(CX + RO * Math.cos(a), 0, CZ + RO * Math.sin(a), th)); }
    chains.setAttribute("d", d);
  }
  const B = register(stage, (_dt, now) => { draw(tval(sw, now)); return !tdone(sw, now); });
  bag.add(B.unregister);
  const mid = P(CX, 0, CZ);
  let act = null;
  function setActive(a) {
    if (a === act) return; act = a;
    const now = performance.now();
    tset(sw, a ? -(0.25 + 0.5 * amp / 90) : 0, now, 0);
    tyre.classList.add("hi");
    read.textContent = a ? "swing" : "rest";
    B.wake();
  }
  setActive(false);
  bag.add(pointer(stage, { move: ([sx, sy]) => setActive(Math.abs(sx - mid[0]) < 140 && Math.abs(sy - mid[1]) < 150), leave: () => setActive(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amp = v; }, destroy: bag.dispose };
}

hairline({
  name: "agilityhoop",
  means: "An agility tire jump: a tyre hung on chains in a two-post frame swings toward you as the pointer passes through it.",
  rules: [1, 4, 5, 6],
  range: [0, 45, 90],
  tour: [[200, 98], [130, 209], [270, 278], null],
  mount,
});
