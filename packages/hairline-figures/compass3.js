/**
 * Map measurer: a folded map with a route on it and an opisometer standing on
 * the route, a round dial on edge with a needle, a small tracing wheel below
 * and a grip above. The pointer along the map rolls the measurer to that
 * point; its wheel and needle turn with the distance. At rest it stands a
 * third of the way along, its dial bright. The slider is the needle's gearing.
 *
 * The pattern: a continuous answer, a spring on the pointer's ground x.
 */
const { Cam, clamp, rings, prism, fit, hull, poly, open, seg, proj, unproj, facing, spring, stepS, disposer, mk, pointer, put, register, solid } = HL;

const MX = 120, MY = 26, R = 15, WR = 4.5, ZC = 2 + 2 * WR + R + 1, X0 = 34;
const disc = (x, z, r, y, n = 32) => { const o = []; for (let i = 0; i < n; i++) { const t = (i / n) * Math.PI * 2; o.push([x + r * Math.cos(t), y, z + r * Math.sin(t)]); } return o; };
const tube = (x, z0, z1, r, n = 14) => { const o = []; for (let i = 0; i < n; i++) { const t = (i / n) * Math.PI * 2; o.push([x + r * Math.cos(t), r * Math.sin(t), z0], [x + r * Math.cos(t), r * Math.sin(t), z1]); } return o; };

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let gear = value;
  const C = Cam(45, 0.5, 2.15);
  fit(C, [[-4, -MY, 0], [MX + 4, MY, 0], [MX + 4, -MY, 0], [-4, MY, 0], [8, 0, ZC + R + 26], [MX - 8, 0, ZC + R + 26]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [mr, mi] = rings(-4, -MY, MX + 4, MY, 3, 1.2);
  put(solid(g), prism(P, front, mr, mi, 0, 2));
  mk("path", { class: "nf lo", d: seg(P(MX / 2, -MY, 2), P(MX / 2, MY, 2)) + seg(P(MX / 4, -MY, 2), P(MX / 4, MY, 2)) + seg(P((3 * MX) / 4, -MY, 2), P((3 * MX) / 4, MY, 2)) }, g);
  const route = [];
  for (let x = 6; x <= MX - 6; x += 2) route.push(P(x, 0, 2));
  mk("path", { class: "nf dash", d: open(route) }, g);
  const wheel = solid(g), spokes = mk("path", { class: "nf lo" }, wheel.g);
  const grip = solid(g), dial = solid(g), needle = mk("path", { class: "nf" }, dial.g);
  dial.sil.classList.add("hi");
  const sp = spring(X0);
  let last = NaN;

  function draw(x) {
    if (x === last) return;
    last = x;
    const roll = -x / WR, turn = (x / 40) * gear;
    wheel.sil.setAttribute("d", poly(hull(disc(x, 2 + WR, WR, 1.2, 20).concat(disc(x, 2 + WR, WR, -1.2, 20)).map((p) => P(...p)))));
    spokes.setAttribute("d", [0, 1, 2].map((k) => { const a = roll + (k * Math.PI * 2) / 3; return seg(P(x, 1.3, 2 + WR), P(x + (WR - 1) * Math.cos(a), 1.3, 2 + WR + (WR - 1) * Math.sin(a))); }).join(""));
    grip.sil.setAttribute("d", poly(hull(tube(x, ZC + R - 2, ZC + R + 8, 2).concat(tube(x, ZC + R + 8, ZC + R + 24, 3.6)).map((p) => P(...p)))));
    dial.sil.setAttribute("d", poly(hull(disc(x, ZC, R, 2.2).concat(disc(x, ZC, R, -2.2)).map((p) => P(...p)))));
    dial.cr.setAttribute("d", poly(disc(x, ZC, R - 2, 2.3).map((p) => P(...p))));
    const a = Math.PI / 2 - turn;
    needle.setAttribute("d", seg(P(x, 2.4, ZC), P(x + (R - 4) * Math.cos(a), 2.4, ZC + (R - 4) * Math.sin(a))));
  }
  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(sp.x); return m; });
  bag.add(B.unregister);

  function move([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, 2);
    if (x < -4 || x > MX + 4 || Math.abs(y) > MY + 30) return leave();
    sp.t = clamp(x, 8, MX - 8);
    read.textContent = Math.round(sp.t / 4) + " km";
    B.wake();
  }
  function leave() { sp.t = X0; read.textContent = "rest"; B.wake(); }
  leave();
  bag.add(pointer(stage, { move, leave }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { gear = v; last = NaN; B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "compass3",
  means: "A map measurer on a route: it rolls to the point under the pointer, its wheel and dial needle turning with the distance.",
  rules: [1, 3, 5, 8],
  range: [0.5, 1, 2],
  tour: [[268, 247], [190, 210], [121, 174], null],
  mount,
});
