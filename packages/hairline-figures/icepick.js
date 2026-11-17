/**
 * Ice axe: a mountaineering axe planted spike-down in a block of snow, its
 * head a hooked pick on one side and a flat adze on the other. The pointer on
 * the axe swings it forward about its spike, head first, as if cutting a step;
 * leaving lets it lean back. At rest it leans back a little, its head bright.
 * The slider is how far the swing goes.
 *
 * The pattern: one part tilting about a pivot.
 */
const {
  Cam, fillet, fit, facing, poly, prism, proj, rings, rad, tdone, tset, tval, tween, open,
  disposer, mk, pointer, put, register, solid,
} = HL;

const L = 100, X0 = 26, Y0 = 22, Z0 = 18, REST = -12;
const HEAD = [[-20, L + 3], [-6, L + 5], [10, L + 5], [24, L + 3], [38, L - 2], [47, L - 11], [34, L - 6], [20, L - 5], [6, L - 6],
  [-6, L - 6], [-20, L - 7], [-31, L - 11], [-31, L - 1]];
const HR = [2, 2, 2, 2, 2, 0.6, 2, 2, 2, 2, 2, 0.8, 0.8];
const SHAFT = [[-3.2, 0], [3.2, 0], [3, L - 6], [-3, L - 6]];
const SPIKE = [[-3.2, 1], [3.2, 1], [0.6, -11], [-0.6, -11]];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let ang = value;
  const C = Cam(45, 0.5, 1.85);
  const wp = (t, s, a, y) => [X0 + s * Math.sin(rad(a)) + t * Math.cos(rad(a)), y, Z0 + s * Math.cos(rad(a)) - t * Math.sin(rad(a))];
  const ext = [[-4, -4, 0], [62, 46, 0]];
  for (const a of [REST, 40, 75]) for (const [t, s] of HEAD) ext.push(wp(t, s, a, Y0));
  fit(C, ext, 200, 160);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(0, 0, 58, 44, 10, 2);
  put(solid(g), prism(P, front, br, bi, 0, Z0));
  mk("path", { d: open([P(X0 - 9, Y0 - 4, Z0), P(X0 + 9, Y0 + 4, Z0)]), class: "lo" }, g);

  const headBack = mk("path", {}, g), spike = mk("path", { class: "sil" }, g), shaft = mk("path", { class: "sil" }, g);
  const grip = mk("path", { class: "nf lo" }, g), head = mk("path", { class: "sil hi" }, g), hole = mk("path", { class: "nf lo" }, g);
  const shape = (pts, a, y, r) => poly(fillet(pts.map(([t, s]) => P(...wp(t, s, a, y))), r));
  const sw = tween(REST);
  let last = NaN;
  function draw(a) {
    if (a === last) return;
    last = a;
    headBack.setAttribute("d", shape(HEAD, a, Y0 - 3.5, HR));
    spike.setAttribute("d", shape(SPIKE, a, Y0, [1, 1, 0.4, 0.4]));
    shaft.setAttribute("d", shape(SHAFT, a, Y0, [1.5, 1.5, 1.5, 1.5]));
    const q = (t, s) => P(...wp(t, s, a, Y0 + 0.5));
    grip.setAttribute("d", [10, 14, 18, 22].map((s) => "M" + q(-3, s).join(" ") + "L" + q(3, s).join(" ")).join(""));
    head.setAttribute("d", shape(HEAD, a, Y0 + 3.5, HR));
    hole.setAttribute("d", shape([[-2, L - 3], [8, L - 3], [8, L + 1], [-2, L + 1]], a, Y0 + 3.5, [1.5, 1.5, 1.5, 1.5]));
  }
  const B = register(stage, (_dt, now) => { draw(tval(sw, now)); return !tdone(sw, now); });
  bag.add(B.unregister);

  // hit: the rest pose's screen box, which never moves
  const rest = HEAD.concat(SHAFT, SPIKE).map(([t, s]) => P(...wp(t, s, REST, Y0)));
  const xs = rest.map((p) => p[0]), ys = rest.map((p) => p[1]);
  const x0 = Math.min(...xs) - 14, x1 = Math.max(...xs) + 14, y0 = Math.min(...ys) - 14, y1 = Math.max(...ys) + 8;
  const inside = ([sx, sy]) => sx > x0 && sx < x1 && sy > y0 && sy < y1;
  let act = null;
  const label = () => (act ? "swing " + Math.round(ang) + "°" : "rest");
  function setActive(on) {
    if (on === act) return;
    act = on;
    tset(sw, on ? ang : REST, performance.now(), 0);
    read.textContent = label();
    B.wake();
  }
  setActive(false);
  bag.add(pointer(stage, { move: (p) => setActive(inside(p)), leave: () => setActive(false) }));
  bag.add(() => svg.replaceChildren());
  return {
    set: (v) => { ang = v; if (act) { tset(sw, ang, performance.now(), 0); read.textContent = label(); B.wake(); } },
    destroy: bag.dispose,
  };
}

hairline({
  name: "icepick",
  means: "An ice axe planted in a snow block: the pointer swings it forward about its spike, pick first, as if cutting a step.",
  rules: [1, 4, 5, 6],
  range: [30, 55, 75],
  tour: [[143, 32], [133, 102], [150, 180], null],
  mount,
});
