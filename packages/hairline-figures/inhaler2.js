/**
 * Spacer inhaler: a clear spacer tube with a mouthpiece at its far end and
 * the inhaler, boot and canister, plugged into its near end. The pointer over
 * the spacer draws the inhaler out of the tube along its axis. At rest it
 * sits just seated, bright. The slider is how far it comes out.
 */
const {
  Cam, fit, facing, hull, poly, open, prism, proj, rings, circ, tdone, tset, tval, tween, unproj,
  disposer, mk, pointer, put, register, solid,
} = HL;

const TL = 74, TR = 15, ZC = 16, REST = 2, OUT = 40;
const ring = (x, r, n = 32) => circ(r, n).map((q) => [x, q.u, ZC + q.v]);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.5);
  fit(C, [[-14, -TR, 0], [-14, TR, 0], [TL + 18 + OUT, -TR, 0], [TL + 18 + OUT, TR, 0], [-14, 0, ZC + TR], [TL + 10 + OUT, 0, 66], [TL, 0, 66]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const tube = (x0, x1, r, cls) => mk("path", { d: poly(hull(ring(x0, r).concat(ring(x1, r)).map((p) => P(...p)))), class: cls }, g);
  // mouthpiece, then the tube with its seams and its near rim
  tube(-14, 0, 8, "");
  tube(0, TL, TR, "");
  for (const x of [6, TL - 6]) mk("path", { d: open(ring(x, TR - 0.4, 48).filter((p) => p[2] < ZC + 0.5 || p[1] > -1).map((p) => P(...p))), class: "nf lo" }, g);
  mk("path", { d: poly(ring(TL, TR - 2.5).map((p) => P(...p))), class: "nf lo" }, g);

  const inG = mk("g", {}, g);
  const neck = mk("path", { class: "" }, inG);
  const boot = solid(inG), can = solid(inG), cap = mk("path", { class: "nf lo" }, inG);
  boot.sil.classList.add("hi");
  const dx = tween(REST);
  let last = NaN;
  function draw(d) {
    if (d === last) return;
    last = d;
    const x = TL + d;
    neck.setAttribute("d", poly(hull(ring(x - 8, 8).concat(ring(x + 4, 8)).map((p) => P(...p)))));
    const [br, bi] = rings(x + 2, -10, x + 18, 10, 6, 1.6);
    put(boot, prism(P, front, br, bi, 3, 44));
    const cr = circ(6.5, 24).map((q) => ({ ...q, u: q.u + x + 10 })), ci = circ(5, 24).map((q) => ({ ...q, u: q.u + x + 10 }));
    put(can, prism(P, front, cr, ci, 44, 64));
    cap.setAttribute("d", poly(circ(3, 16).map((q) => P(q.u + x + 10, q.v, 64))));
  }
  const B = register(stage, (_dt, now) => { draw(tval(dx, now)); return !tdone(dx, now); });
  bag.add(B.unregister);

  let act = null;
  function aim() { tset(dx, act ? 12 + (OUT - 12) * reach : REST, performance.now(), 0); B.wake(); }
  function setActive(a) {
    if (a === act) return;
    act = a;
    read.textContent = a ? "out" : "rest";
    aim();
  }
  const hit = ([sx, sy]) => { const [x, y] = unproj(C, sx, sy, ZC); return x > -16 && x < TL + 22 && Math.abs(y) < TR + 8; };
  setActive(false);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; aim(); }, destroy: bag.dispose };
}

hairline({
  name: "inhaler2",
  means: "A spacer inhaler: the pointer over the spacer tube draws the inhaler, boot and canister, out of its near end.",
  rules: [1, 4, 5, 6],
  range: [0.3, 1, 1],
  tour: [[166, 109], [112, 98], [204, 128], null],
  mount,
});
