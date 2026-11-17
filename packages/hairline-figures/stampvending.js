/**
 * Stamp roll: a coil of stamps lying in a round dispenser on a low base, its
 * strip standing on edge and fed out along the front. The pointer pulls the
 * strip: it slides out stamp by stamp and the coil turns as it pays out. At
 * rest a short strip shows, bright. The slider is how far it pulls.
 *
 * The pattern: one part sliding on the discrete clock; hit on the ground.
 */
const {
  Cam, circ, clamp, fit, facing, poly, prism, proj, rings, ringAt, seg, tdone, tset, tval, tween, unproj,
  disposer, mk, pointer, put, register, solid,
} = HL;

const CX = 24, CY = 22, R = 22, Z0 = 5, H = 18, SY = CY + R, X0 = CX, REST = 36, MAXL = 84, SQ = 14;
const disc = (x, y, r, n = 44) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.7);
  fit(C, [[-4, -4, 0], [X0 + REST + MAXL, SY + 6, 0], [-4, SY + 6, 0], [X0 + REST + MAXL, SY, Z0 + H], [CX, CY, Z0 + H + 6]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(-4, -4, 66, SY + 6, 6, 2);
  put(solid(g), prism(P, front, br, bi, 0, Z0));
  // the cup and the coil inside it
  put(solid(g), prism(P, front, disc(CX, CY, R + 3), disc(CX, CY, R + 1.5), Z0, Z0 + 8));
  put(solid(g), prism(P, front, disc(CX, CY, R), disc(CX, CY, R - 2), Z0, Z0 + H));
  for (const r of [R - 7, R - 12]) mk("path", { d: poly(ringAt(P, disc(CX, CY, r), Z0 + H)), class: "nf lo" }, g);
  put(solid(g), prism(P, front, disc(CX, CY, 4.5, 20), disc(CX, CY, 3, 20), Z0 + H, Z0 + H + 6));
  const seam = mk("path", { class: "nf lo" }, g);
  const strip = mk("path", { class: "sil hi" }, g), perf = mk("path", { class: "nf lo" }, g);
  const L = tween(REST);
  let last = NaN;

  function draw(l) {
    if (l === last) return;
    last = l;
    const x1 = X0 + l;
    strip.setAttribute("d", poly([P(X0, SY, Z0 + 0.5), P(x1, SY, Z0 + 0.5), P(x1, SY, Z0 + H), P(X0, SY, Z0 + H)]));
    let d = "";
    for (let x = x1 - SQ; x > X0 + 2; x -= SQ) d += seg(P(x, SY, Z0 + 2), P(x, SY, Z0 + H - 1.5));
    perf.setAttribute("d", d || "M0 0");
    const a = -l / R + 0.6;
    seam.setAttribute("d", seg(P(CX + 4.5 * Math.cos(a), CY + 4.5 * Math.sin(a), Z0 + H), P(CX + (R - 2) * Math.cos(a), CY + (R - 2) * Math.sin(a), Z0 + H)));
  }

  const B = register(stage, (_dt, now) => { draw(tval(L, now)); return !tdone(L, now); });
  bag.add(B.unregister);

  let on = null;
  function setOn(v) {
    const k = v ? 1 : 0;
    if (k === on) return;
    on = k;
    const l = k ? REST + MAXL * clamp(reach, 0, 1) : REST;
    tset(L, l, performance.now(), 0);
    read.textContent = k ? "pull " + Math.floor(l / SQ) : "rest";
    B.wake();
  }
  setOn(false);
  bag.add(pointer(stage, {
    move: (p) => { const [x, y] = unproj(C, p[0], p[1], 0); setOn(x > -14 && x < X0 + REST + MAXL + 10 && y > -14 && y < SY + 16); },
    leave: () => setOn(false),
  }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; if (on) { on = null; setOn(true); } }, destroy: bag.dispose };
}

hairline({
  name: "stampvending",
  means: "A coil of stamps in a round dispenser: the pointer pulls the strip out along the front and the coil turns as it pays out.",
  rules: [1, 3, 5, 8],
  range: [0.3, 1, 1],
  tour: [[129, 102], [200, 150], [250, 190], null],
  mount,
});
