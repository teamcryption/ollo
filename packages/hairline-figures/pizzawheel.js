/**
 * Pizza wheel: a cutter resting on the edge of a pizza on a round board.
 * The pointer drags it: the wheel rolls across the pizza after the pointer,
 * its spokes turning as it goes, and leaves the cut line behind it. At rest
 * it waits at the crust, its wheel bright. The slider is the wheel's grip.
 *
 * The pattern: one part sliding on one axis (roll).
 */
const {
  Cam, circ, clamp, fit, facing, hull, open, poly, prism, proj, rings, ringAt, seg, spring, stepS, unproj,
  disposer, mk, pointer, put, register, solid,
} = HL;

const PR = 30, TZ = 5, WR = 10, X0 = -24, X1 = 24;
const disc = (x, y, r, n = 48) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let grip = value;
  const C = Cam(45, 0.5, 2.65);
  fit(C, [[-36, -36, 0], [36, 36, 0], [36, -36, 0], [-36, 36, 0], [X0 - 30, 0, TZ + 34], [X1 - 30, 0, TZ + 34]], 200, 162);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(-36, -36, 36, 36, 36, 2);
  put(solid(g), prism(P, front, br, bi, 0, 3));
  put(solid(g), prism(P, front, disc(0, 0, PR), disc(0, 0, PR - 4), 3, TZ));
  let dots = "";
  for (const [x, y] of [[-12, 10], [8, 14], [14, -6], [-4, -16], [-16, -6], [2, 2]]) dots += poly(ringAt(P, disc(x, y, 3, 14), TZ));
  mk("path", { d: dots, class: "nf lo" }, g);
  const cut = mk("path", { class: "nf" }, g);

  const m = mk("g", {}, g);
  const zc = TZ + WR;
  const hp = [];
  for (const [x, z] of [[X0 - 3, zc + 3], [X0 - 28, zc + 22]]) for (let a = 0; a < 16; a++) { const t = (a / 16) * Math.PI * 2; hp.push(P(x, 2.8 * Math.cos(t), z + 2.8 * Math.sin(t))); }
  mk("path", { d: poly(hull(hp)), class: "sil" }, m);
  const wp = [];
  for (const y of [-1, 1]) for (let a = 0; a < 40; a++) { const t = (a / 40) * Math.PI * 2; wp.push(P(X0 + WR * Math.cos(t), y, zc + WR * Math.sin(t))); }
  const wheel = mk("path", { d: poly(hull(wp)), class: "sil" }, m);
  const spokes = mk("path", { class: "nf lo" }, m);
  const fk = [];
  for (let a = 0; a < 16; a++) { const t = (a / 16) * Math.PI * 2; fk.push(P(X0 + 2.6 * Math.cos(t), 1.4, zc + 2.6 * Math.sin(t))); }
  fk.push(P(X0 - 6, 1.4, zc + 7), P(X0 - 9, 1.4, zc + 4));
  mk("path", { d: poly(hull(fk)) }, m);
  const o = P(0, 0, 0), ux = P(1, 0, 0);
  const dxs = [ux[0] - o[0], ux[1] - o[1]];

  const sp = spring(0, { k: 70, c: 16 });
  let last = NaN;
  function draw(d) {
    if (d === last) return;
    last = d;
    m.setAttribute("transform", "translate(" + (d * dxs[0]).toFixed(2) + " " + (d * dxs[1]).toFixed(2) + ")");
    const ang = d / WR;
    let s = "";
    for (let k = 0; k < 3; k++) { const t = ang + (k * Math.PI) / 3; s += seg(P(X0 + 7 * Math.cos(t), 1.2, zc - 7 * Math.sin(t)), P(X0 - 7 * Math.cos(t), 1.2, zc + 7 * Math.sin(t))); }
    spokes.setAttribute("d", s);
    cut.setAttribute("d", d > 0.5 ? open([P(X0, 0, TZ), P(X0 + d, 0, TZ)]) : "");
  }
  const B = register(stage, (dt) => { const mv = stepS(sp, dt); draw(sp.x); return mv; });
  bag.add(B.unregister);

  function aim(x) {
    const d = x == null ? 0 : clamp(x - X0, 0, X1 - X0);
    sp.k = 40 + 60 * grip;
    sp.t = d;
    wheel.classList.toggle("hi", d === 0);
    read.textContent = d === 0 ? "rest" : Math.round((d / (X1 - X0)) * 100) + "% cut";
    B.wake();
  }
  aim(null);
  bag.add(pointer(stage, { move: ([sx, sy]) => aim(unproj(C, sx, sy, TZ)[0]), leave: () => aim(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { grip = v; }, destroy: bag.dispose };
}

hairline({
  name: "pizzawheel",
  means: "A pizza wheel at the crust: it rolls across the pizza after the pointer, spokes turning, leaving the cut line behind it.",
  rules: [1, 3, 5, 6],
  range: [0, 0.6, 1],
  tour: [[200, 187], [237, 206], [245, 209], null],
  mount,
});
