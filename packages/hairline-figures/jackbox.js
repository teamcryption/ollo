/**
 * Jack in the box: a square box with a crank on its side and a hinged lid.
 * The pointer over the box turns the crank: the lid swings open on its back
 * hinge and the jack springs up on its coil, head first. At rest the lid sits
 * ajar on the jack's head, bright. The slider is how far the jack springs.
 *
 * The pattern: one part answering a continuous value (a spring per figure);
 * the hit is on the ground plane under the box, which never moves.
 */
const {
  Cam, fit, facing, poly, prism, proj, rings, seg, spring, stepS, clamp,
  disposer, mk, pointer, put, register, solid,
} = HL;

const W = 44, H = 30, HEAD = 18, REST = 0.22;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.79);
  fit(C, [[-4, -4, 0], [W + 14, W + 4, 0], [W, -4, 0], [-4, W, 0], [W / 2, W / 2, H + 1.3 * 46 + HEAD]], 200, 173);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(0, 0, W, W, 3, 1.6);
  put(solid(g), prism(P, front, br, bi, 0, H));
  // the crank: an axle out of the +y face, an arm that turns, a knob
  const crank = mk("path", { class: "nf sil" }, g);
  const lid = mk("path", { class: "sil" }, g);
  const coil = mk("path", { class: "nf lo" }, g);
  const head = solid(g);
  const sp = spring(REST, { k: 120, c: 16 });
  let last = NaN;

  function draw(t) {
    if (Math.abs(t - last) < 1e-4) return;
    last = t;
    const a = clamp(t, 0, 1) * 1.95, jz = t * 46 * reach, top = H + jz;
    const ca = Math.cos(a), sa = Math.sin(a);
    // the lid, hinged on the far edge x = 0, swinging up and back
    const L = (x, y) => P(-x * (1 - ca) * 0 + x * ca, y, H + x * sa);
    lid.setAttribute("d", poly([L(0, 0), L(W, 0), L(W, W), L(0, W)]));
    // the coil, a zigzag from the box floor to the head
    const pts = [], cx = W / 2, cy = W / 2;
    for (let i = 0; i <= 8; i++) { const z = H - 4 + ((top - H + 4) * i) / 8, s = i % 2 ? 6 : -6; pts.push(P(cx + s, cy - s, z)); }
    coil.setAttribute("d", pts.length && top > H + 1 ? "M" + pts.map((p) => p.join(",")).join("L") : "");
    const hz = Math.max(H - HEAD + 6, top - 2);
    const [hr, hi] = rings(cx - 10, cy - 10, cx + 10, cy + 10, 9, 2);
    put(head, prism(P, front, hr, hi, hz, hz + HEAD));
    // paint order: once the lid stands past upright it is behind the head
    if (a > 0.9) lid.before(coil); else head.g.after(lid);
    const k = t * Math.PI * 4, ax = W * 0.55, ay = W, az = H * 0.55;
    const arm = [ax + 9 * Math.cos(k), ay + 7, az + 9 * Math.sin(k)];
    crank.setAttribute("d", seg(P(ax, ay, az), P(ax, ay + 7, az)) + seg(P(ax, ay + 7, az), P(...arm)) + seg(P(...arm), P(arm[0], arm[1] + 5, arm[2])));
  }

  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(sp.x); return m; });
  bag.add(B.unregister);

  let act = null;
  function setActive(on) {
    if (on === act) return;
    act = on;
    sp.t = on ? 1 : REST;
    lid.classList.toggle("hi", !on);
    head.sil.classList.toggle("hi", on);
    read.textContent = on ? "pop" : "rest";
    B.wake();
  }
  setActive(false);
  function hit([sx, sy]) {
    const mid = P(W / 2, W / 2, H);
    return Math.abs(sx - mid[0]) < 70 && sy > P(W / 2, W / 2, H + 60 + HEAD)[1] - 10 && sy < P(W, W, 0)[1] + 10;
  }
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; last = NaN; B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "jackbox",
  means: "A jack in the box: the pointer over the box turns the crank, the lid swings open and the jack springs up on its coil.",
  rules: [1, 3, 5, 8],
  range: [0.6, 1, 1.3],
  tour: [[200, 137], [200, 243], [200, 93], null],
  mount,
});
