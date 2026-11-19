/**
 * Slide projector: a carousel projector, its body with a lens barrel out
 * front and a round slide tray on top. The pointer over the projector turns
 * the tray, its slide slots wheeling past the gate. At rest one slot stands
 * at the gate, bright. The slider is how far the tray turns.
 */
const { Cam, circ, fit, facing, poly, open, prism, proj, rings, ringAt, unproj, spring, stepS, rad, disposer, mk, pointer, put, register, solid } = HL;

const W = 70, D = 70, H = 22, TR = 31, TH = 10, N = 20;
const disc = (x, y, r, n = 48) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.45);
  fit(C, [[0, 0, 0], [W + 16, D, 0], [0, 0, H + TH], [W, D, H + TH], [0, 0, H + TH + 16]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(0, 0, W, D, 9, 2);
  put(solid(g), prism(P, front, br, bi, 0, H));
  const cx = W / 2, cy = D / 2;
  const lens = solid(g);
  const lr = circ(7, 24).map((q) => ({ u: 0, v: q.u + cy, nu: 0, nv: q.nu }));
  const bar = [];
  for (const x of [W - 2, W + 16]) for (let k = 0; k < 24; k++) { const a = (k / 24) * Math.PI * 2; bar.push(P(x, cy + 7 * Math.cos(a), 11 + 7 * Math.sin(a))); }
  mk("path", { d: poly(HL.hull(bar)), class: "sil" }, g);
  const tip = []; for (let k = 0; k <= 24; k++) { const a = (k / 24) * Math.PI * 2; tip.push(P(W + 16, cy + 5.4 * Math.cos(a), 11 + 5.4 * Math.sin(a))); }
  mk("path", { d: poly(tip), class: "lo" }, g);
  const tray = solid(g), hub = mk("path", { class: "lo" }, g), dot = mk("path", { class: "dot m" }, g);
  const slots = mk("path", { class: "lo nf" }, g);
  const gate = mk("path", { class: "sil hi nf" }, g);

  const REST = 0, ang = spring(REST);
  let last = null;
  function draw(a) {
    if (a === last) return;
    last = a;
    const z = H + TH + a * 0.06;
    put(tray, prism(P, front, disc(cx, cy, TR), disc(cx, cy, TR - 1.6), z - TH, z));
    hub.setAttribute("d", poly(ringAt(P, disc(cx, cy, 10, 32), z)));
    dot.setAttribute("d", poly(ringAt(P, disc(cx, cy, 3, 16), z)));
    let d = "", gd = "";
    for (let i = 0; i < N; i++) {
      const t = rad(a + (i * 360) / N + 45), c = Math.cos(t), s = Math.sin(t);
      const seg = open([P(cx + 12 * c, cy + 12 * s, z), P(cx + (TR - 3) * c, cy + (TR - 3) * s, z)]);
      if (i === 0) gd = seg; else d += seg;
    }
    slots.setAttribute("d", d);
    gate.setAttribute("d", gd);
  }
  draw(REST);
  const B = register(stage, (dt) => { const mv = stepS(ang, dt); draw(ang.x); return mv; });
  bag.add(B.unregister);

  let on = null;
  const tgt = () => 60 + 200 * reach;
  function setOn(v) {
    if (v === on) return;
    on = v;
    ang.t = v ? tgt() : REST;
    read.textContent = v ? "turn" : "rest";
    B.wake();
  }
  function hit([sx, sy]) {
    for (const z of [0, H + TH]) { const [x, y] = unproj(C, sx, sy, z); if (x > -4 && x < W + 18 && y > -4 && y < D + 4) return true; }
    return false;
  }
  setOn(false);
  bag.add(pointer(stage, { move: (p) => setOn(hit(p)), leave: () => setOn(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; if (on) { ang.t = tgt(); B.wake(); } }, destroy: bag.dispose };
}

hairline({
  name: "slideviewer",
  means: "A carousel slide projector: the pointer lifts and turns its slide tray, slots wheeling past the gate; the slider sets how far.",
  rules: [1, 3, 5, 8],
  range: [0.3, 0.75, 1],
  tour: [[186, 142], [170, 185], [214, 215], null],
  mount,
});
