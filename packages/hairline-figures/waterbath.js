/**
 * Lab water bath: a rounded steel tank with a gabled lid hinged along its
 * back edge. Over the bath the lid swings up and back to show the water
 * line inside; leaving lowers it to rest, just ajar. The slider is how far
 * the lid opens.
 */
const {
  Cam, fit, facing, hull, poly, prism, proj, rings, rrect, ringAt, seg, tween, tset, tval, tdone, rad,
  disposer, mk, pointer, put, register, solid,
} = HL;

const W = 92, D = 58, H = 36, RH = 15, REST = 9;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let ang = value, on = false;
  const C = Cam(45, 0.5, 1.85);
  const hinge = (p, a) => { const dy = p[1], dz = p[2] - H, ca = Math.cos(a), sa = Math.sin(a); return [p[0], dy * ca - dz * sa, H + dy * sa + dz * ca]; };
  const eave = [], ridge = [[-2, D / 2, H + 3 + RH], [W + 2, D / 2, H + 3 + RH]];
  for (const x of [-2, W + 2]) for (const y of [-2, D + 2]) for (const z of [H, H + 3]) eave.push([x, y, z]);
  const lidPts = eave.concat(ridge);
  const ext = [[0, 0, 0], [W, D, 0], [W, 0, 0], [0, D, 0]].concat(lidPts.map((p) => hinge(p, rad(100))), lidPts.map((p) => hinge(p, rad(REST))));
  fit(C, ext, 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [tr, ti] = rings(0, 0, W, D, 7, 2);
  put(solid(g), prism(P, front, tr, ti, 0, H));
  mk("path", { d: poly(ringAt(P, rrect(4, 4, W - 4, D - 4, 5, 6), H - 7)), class: "nf lo" }, g);
  for (const x of [26, 46, 66]) mk("path", { d: poly(ringAt(P, rrect(x - 4, 22, x + 4, 30, 3, 4), H - 7)), class: "nf lo" }, g);
  const dial = mk("circle", { r: 2.6, class: "dot off" }, g);
  const dp = P(W, D * 0.32, H * 0.45); dial.setAttribute("cx", dp[0]); dial.setAttribute("cy", dp[1]);
  const lid = solid(g);
  const lt = tween(REST);
  let last = NaN;
  function draw(deg) {
    if (deg === last) return;
    last = deg;
    const a = rad(deg), q = (p) => P(...hinge(p, a));
    const r0 = q(ridge[0]), r1 = q(ridge[1]);
    const g0 = q([W + 2, -2, H + 3]), g1 = q([W + 2, D + 2, H + 3]);
    lid.sil.setAttribute("d", poly(hull(lidPts.map(q))));
    lid.cr.setAttribute("d", seg(r0, r1) + seg(g0, r1) + seg(g1, r1) + seg(q([-2, D + 2, H + 3]), g1));
  }
  lid.sil.classList.add("hi");
  const B = register(stage, (_dt, now) => { draw(tval(lt, now)); return !tdone(lt, now); });
  bag.add(B.unregister);

  const box = hull(ext.slice(0, 4).concat(lidPts.map((p) => hinge(p, rad(REST)))).map((p) => P(...p)));
  const xs = box.map((p) => p[0]), ys = box.map((p) => p[1]);
  const bx = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
  const hit = ([sx, sy]) => sx > bx[0] - 6 && sx < bx[1] + 6 && sy > bx[2] - 6 && sy < bx[3] + 6;
  function setOn(v) {
    on = v;
    tset(lt, on ? ang : REST, performance.now(), 0);
    read.textContent = on ? "lid " + Math.round(ang) + "°" : "rest";
    B.wake();
  }
  setOn(false);
  bag.add(pointer(stage, { move: (p) => { const h = hit(p); if (h !== on) setOn(h); }, leave: () => setOn(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { ang = v; if (on) setOn(true); }, destroy: bag.dispose };
}

hairline({
  name: "waterbath",
  means: "A lab water bath with a gabled lid: over the tank the lid swings up on its back hinge to show the water inside.",
  rules: [1, 3, 5, 6],
  range: [40, 80, 100],
  tour: [[186, 169], [250, 230], [150, 200], null],
  mount,
});
