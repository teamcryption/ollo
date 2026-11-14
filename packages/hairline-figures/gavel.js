/**
 * Gavel: a round sound block with a gavel held above it, a barrel head on a
 * long handle. The pointer near the block raises the gavel, higher the
 * closer it comes, ready to strike; leaving lowers it to hover just over
 * the block. The head is the one bright mark. The slider is the reach.
 *
 * The pattern: one part answering the pointer's distance (spring).
 */
const {
  Cam, circ, clamp, fit, facing, hull, poly, prism, proj, rings, ringAt, spring, stepS, unproj,
  disposer, mk, pointer, put, register, solid,
} = HL;

const BR = 18, BZ = 7, HR = 6, HL2 = 12, ARM = 40, REST = 4, TOP = 30;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 4);
  fit(C, [[-BR, -BR, 0], [BR, BR, 0], [ARM, 0, BZ + HR + TOP + 2], [0, -HL2, BZ + 2 * HR + TOP], [0, HL2, BZ]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  put(solid(g), prism(P, front, circ(BR, 40), circ(BR - 2.5, 40), 0, BZ));
  const head = mk("path", { class: "sil hi" }, g), cap = mk("path", { class: "nf lo" }, g), handle = mk("path", { class: "sil" }, g);
  const sp = spring(REST);
  let last = NaN;

  const discX = (x, y, z, r, n = 24) => { const o = []; for (let i = 0; i < n; i++) { const t = (i / n) * 2 * Math.PI; o.push(P(x + r * Math.cos(t), y, z + r * Math.sin(t))); } return o; };
  const discY = (x, y, z, r, n = 16) => { const o = []; for (let i = 0; i < n; i++) { const t = (i / n) * 2 * Math.PI; o.push(P(x, y + r * Math.cos(t), z + r * Math.sin(t))); } return o; };
  function draw(lift) {
    if (lift === last) return;
    last = lift;
    const hz = BZ + HR + 0.6 + lift;
    head.setAttribute("d", poly(hull(discX(0, -HL2, hz, HR).concat(discX(0, HL2, hz, HR)))));
    cap.setAttribute("d", poly(discX(0, HL2 - 1.6, hz, HR - 1)));
    handle.setAttribute("d", poly(hull(discY(HR - 0.5, 0, hz, 1.8).concat(discY(ARM, 0, hz + lift * 0.15, 2.2)))));
  }

  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(sp.x); return m; });
  bag.add(B.unregister);

  function move([sx, sy]) {
    const [u, v] = unproj(C, sx, sy, 0), d = Math.hypot(u - 8, v);
    const near = clamp(1 - d / (40 + reach), 0, 1);
    sp.t = REST + (TOP - REST) * near;
    read.textContent = near > 0 ? "up " + Math.round(near * 100) : "rest";
    B.wake();
  }
  function leave() { sp.t = REST; read.textContent = "rest"; B.wake(); }
  read.textContent = "rest";
  draw(REST);
  bag.add(pointer(stage, { move, leave }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = clamp(v, 0, 60); }, destroy: bag.dispose };
}

hairline({
  name: "gavel",
  means: "A gavel over its sound block: the closer the pointer comes to the block, the higher the gavel rises, ready to strike.",
  rules: [3, 4, 5, 8],
  range: [0, 30, 60],
  tour: [[260, 200], [180, 205], [160, 210], null],
  mount,
});
