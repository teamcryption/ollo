/**
 * Sluice gate: a gate panel standing between two posts in a channel, a beam
 * across the posts and a hand wheel on top. Over the gate, the wheel turns
 * and the panel slides up out of the channel. At rest the gate sits a little
 * open, its panel bright. The slider is how far it rises.
 */
const { Cam, clamp, facing, fit, hull, poly, prism, proj, rings, seg, spring, stepS, disposer, mk, pointer, put, register, solid } = HL;

const PH = 30, ZB = 52, REST = 3;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 3.0);
  fit(C, [[-8, -12, 0], [52, 20, 0], [52, -12, 0], [-8, 20, 0], [23, 4, ZB + 8], [23, 4, PH + 40]], 200, 165);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  function box(s, x0, y0, x1, y1, z0, z1, r) { const [a, b] = rings(x0, y0, x1, y1, r || 1.2, 0.6); put(s, prism(P, front, a, b, z0, z1)); }

  const base = solid(g); box(base, -8, -12, 52, 20, 0, 3, 3);
  mk("path", { class: "nf lo dash", d: [6, 10, 14].map((y) => seg(P(-6, y, 3), P(50, y, 3))).join("") }, base.g);
  const post0 = solid(g); box(post0, 0, -2, 6, 10, 3, ZB);
  const gate = solid(g), stem = mk("path", { class: "nf lo" }, g);
  const post1 = solid(g); box(post1, 40, -2, 46, 10, 3, ZB);
  const beam = solid(g); box(beam, -1, -1, 47, 9, ZB, ZB + 4);
  const wheel = mk("g", {}, g), wsil = mk("path", { class: "sil" }, wheel), wsp = mk("path", { class: "nf lo" }, wheel);

  const lift = spring(REST, { k: 90, c: 16 });
  let last = NaN;
  function draw(z) {
    if (z === last) return; last = z;
    box(gate, 6, 2, 40, 6, 3 + z, 3 + z + PH, 0.8);
    stem.setAttribute("d", seg(P(23, 4, 3 + z + PH), P(23, 4, ZB + 7)));
    const ring = [], a0 = z * 0.25;
    for (let i = 0; i < 32; i++) { const a = (i / 32) * Math.PI * 2; ring.push(P(23 + 11 * Math.cos(a), 4 + 11 * Math.sin(a), ZB + 7)); }
    wsil.setAttribute("d", poly(ring));
    let d = "";
    for (let k = 0; k < 4; k++) { const a = a0 + (k * Math.PI) / 2; d += seg(P(23, 4, ZB + 7), P(23 + 11 * Math.cos(a), 4 + 11 * Math.sin(a), ZB + 7)); }
    wsp.setAttribute("d", d);
  }
  const B = register(stage, (dt) => { const m = stepS(lift, dt); draw(lift.x); return m; });
  bag.add(B.unregister);

  const box0 = hull([[0, -2, 3], [46, -2, 3], [46, 10, 3], [0, 10, 3], [0, -2, ZB + 8], [46, 10, ZB + 8], [46, -2, ZB + 8], [0, 10, ZB + 8]].map((p) => P(...p)));
  const xs = box0.map((p) => p[0]), ys = box0.map((p) => p[1]);
  const L = Math.min(...xs), R = Math.max(...xs), T = Math.min(...ys), Bt = Math.max(...ys);
  let on = null;
  function set(o) {
    if (o === on) return; on = o;
    lift.t = o ? clamp(REST + 30 * reach, REST, 33) : REST;
    gate.sil.classList.toggle("hi", true);
    read.textContent = o ? "open" : "rest";
    B.wake();
  }
  set(false); draw(REST);
  bag.add(pointer(stage, { move: ([sx, sy]) => set(sx > L && sx < R && sy > T && sy < Bt), leave: () => set(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; if (on) { lift.t = REST + 30 * v; B.wake(); } }, destroy: bag.dispose };
}

hairline({
  name: "damgate",
  means: "A sluice gate: over it the hand wheel turns and the gate panel slides up out of the channel.",
  rules: [1, 3, 5, 6],
  range: [0.3, 1, 1],
  tour: [[202, 154], [196, 140], [212, 170], null],
  mount,
});
