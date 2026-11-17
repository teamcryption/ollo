/**
 * Cooker hood: a wall chimney over a slim canopy, with a glass visor hinged
 * along the canopy's front edge. At rest the visor hangs tilted a little
 * forward, bright. Over the hood the visor swings up on its hinge, the way
 * it lifts to run the fan. The slider is how far the visor tilts.
 */
const { Cam, fit, facing, hull, poly, prism, proj, rings, rrect, tset, tval, tdone, tween, disposer, mk, pointer, put, register, solid } = HL;

const X = 66, D = 40, Z0 = 40, Z1 = 48, HY = D, HZ = 46, L = 26, T = 2.2, REST = 28;
const toR = (d) => (d * Math.PI) / 180;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.25);
  fit(C, [[0, 0, Z0], [X, D, Z0], [X, 0, Z0], [0, D, Z0], [22, 0, 96], [44, 18, 96], [0, D + L, HZ], [X, D + L, HZ + 4], [X, D, HZ - L]], 200, 160);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const box = (x0, y0, x1, y1, r, b, z0, z1) => { const [a, i] = rings(x0, y0, x1, y1, r, b); const s = solid(g); put(s, prism(P, front, a, i, z0, z1)); return s; };
  // the chimney, then the canopy in front of it
  box(22, 0, 44, 18, 2, 1, Z1, 96);
  box(0, 0, X, D, 4, 1.6, Z0, Z1);
  // the fan grille on the canopy top
  mk("path", { d: poly(rrect(6, 22, X - 6, D - 5, 2, 4).map((q) => P(q.u, q.v, Z1))), class: "nf lo" }, g);
  for (let x = 14; x < X - 8; x += 8) mk("path", { d: `M${P(x, 24, Z1)}L${P(x, D - 7, Z1)}`, class: "nf lo" }, g);
  // the visor, hinged along the front edge
  const vis = solid(g);
  vis.sil.classList.add("hi");
  const vr = rrect(2, 0, X - 2, L, 4, 6), vi = rrect(5, 3, X - 5, L - 6, 2.5, 6);
  const knobs = [mk("path", { class: "nf" }, g), mk("path", { class: "nf" }, g)];
  const ang = tween(REST);
  let last = NaN;
  function draw(a) {
    if (a === last) return;
    last = a;
    const c = Math.cos(toR(a)), s = Math.sin(toR(a));
    const Tf = (x, u, w) => P(x, HY + u * s + w * c, HZ - u * c + w * s);
    const pts = vr.map((q) => Tf(q.u, q.v, 0)).concat(vr.map((q) => Tf(q.u, q.v, T)));
    put(vis, { sil: poly(hull(pts)), crease: poly(vi.map((q) => Tf(q.u, q.v, T))) });
    [X - 18, X - 10].forEach((x, k) => {
      const kp = [];
      for (const dx of [-2.5, 2.5]) for (const du of [L - 4.5, L - 1.5]) for (const w of [T, T + 1.5]) kp.push(Tf(x + dx, du, w));
      knobs[k].setAttribute("d", poly(hull(kp)));
    });
  }
  const B = register(stage, (_dt, now) => { draw(tval(ang, now)); return !tdone(ang, now); });
  bag.add(B.unregister);
  const mid = P(X / 2, D / 2, 60);
  let on = false;
  function setOn(v) {
    on = v;
    tset(ang, on ? reach : REST, performance.now(), 0);
    read.textContent = on ? "visor up" : "rest";
    B.wake();
  }
  setOn(false);
  bag.add(pointer(stage, {
    move: ([x, y]) => { const v = Math.abs(x - mid[0]) < 140 && Math.abs(y - mid[1]) < 120; if (v !== on) setOn(v); },
    leave: () => setOn(false),
  }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; if (on) setOn(true); }, destroy: bag.dispose };
}

hairline({
  name: "rangehood",
  means: "A cooker hood: over it, the glass visor on the canopy's front edge tilts up on its hinge to open the extractor.",
  rules: [1, 3, 5, 8],
  range: [60, 90, 110],
  tour: [[205, 175], [200, 140], [241, 216], null],
  mount,
});
