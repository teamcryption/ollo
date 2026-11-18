/**
 * Slot car: one straight piece of racing track with a guide slot down its
 * middle, and a little car riding the slot on its guide blade. The pointer is
 * where the car should be on the lane: it slides along the slot on a spring
 * to stand there. At rest it waits near the start, its body bright. The
 * slider is how far along the lane the car may run.
 *
 * The pattern: a continuous aim on the ground plane, which never moves.
 */
const {
  Cam, clamp, fit, facing, hull, poly, prism, proj, rings, seg, unproj, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const TL = 92, TW = 22, TZ = 4, REST = -48;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 1.75);
  fit(C, [[-TL, -TW, 0], [TL, TW, 0], [TL, -TW, 0], [-TL, TW, 0], [0, 0, 26]], 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [tr, ti] = rings(-TL, -TW, TL, TW, 6, 2);
  put(solid(g), prism(P, front, tr, ti, 0, TZ));
  // the slot and the two contact rails beside it
  mk("path", { d: seg(P(-TL + 4, 0, TZ), P(TL - 4, 0, TZ)), class: "nf" }, g);
  mk("path", { d: seg(P(-TL + 4, -3, TZ), P(TL - 4, -3, TZ)) + seg(P(-TL + 4, 3, TZ), P(TL - 4, 3, TZ)), class: "nf lo" }, g);
  const car = mk("g", {}, g);
  const wheel = (x, y) => {
    const pts = [];
    for (let k = 0; k < 16; k++) { const t = (k / 16) * Math.PI * 2; for (const dy of [-2.5, 2.5]) pts.push(P(x + 5 * Math.cos(t), y + dy, TZ + 5 + 5 * Math.sin(t))); }
    return poly(hull(pts));
  };
  const els = { wf: mk("path", { class: "sil" }, car), body: solid(car), cab: solid(car), spoil: solid(car), wn: mk("path", { class: "sil" }, car) };
  els.body.sil.classList.add("hi");
  const sx = spring(REST);
  let last = NaN, over = null;

  function draw() {
    const x = sx.x;
    if (Math.abs(x - last) < 0.01) return;
    last = x;
    els.wf.setAttribute("d", wheel(x - 14, -12) + wheel(x + 14, -12));
    const [br, bi] = rings(x - 26, -11, x + 26, 11, 9, 2);
    put(els.body, prism(P, front, br, bi, TZ + 3, TZ + 10));
    const [cr, ci] = rings(x - 10, -8, x + 8, 8, 6, 1.6);
    put(els.cab, prism(P, front, cr, ci, TZ + 10, TZ + 17));
    const [sr, si] = rings(x - 26, -11, x - 21, 11, 2, 0.8);
    put(els.spoil, prism(P, front, sr, si, TZ + 14, TZ + 16));
    els.wn.setAttribute("d", wheel(x - 14, 12) + wheel(x + 14, 12));
  }

  const B = register(stage, (dt) => { const m = stepS(sx, dt); draw(); return m; });
  bag.add(B.unregister);

  function retarget() {
    const lim = 18 + 46 * reach;
    sx.t = over === null ? REST : clamp(over, -lim, lim);
    read.textContent = over === null ? "rest" : "lane " + Math.round(sx.t + TL);
    B.wake();
  }
  bag.add(pointer(stage, {
    move: (p) => {
      const [x, y] = unproj(C, p[0], p[1], 0);
      over = Math.abs(y) > TW + 40 || Math.abs(x) > TL + 30 ? null : x;
      retarget();
    },
    leave: () => { over = null; retarget(); },
  }));
  bag.add(() => svg.replaceChildren());
  retarget();
  return { set: (v) => { reach = v; retarget(); }, destroy: bag.dispose };
}

hairline({
  name: "slotcar",
  means: "A slot car on a piece of track: it slides along the guide slot to stand under the pointer.",
  rules: [1, 3, 5, 8],
  range: [0, 1, 1],
  tour: [[262, 195], [59, 127], [341, 213], null],
  mount,
});
