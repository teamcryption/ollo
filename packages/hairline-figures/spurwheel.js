/**
 * Butter press: a square mould on a board, a post at one end carrying a long
 * lever, and a plunger hung from the lever over the mould. The pointer over
 * the figure swings the lever down and the plunger presses into the mould.
 * At rest the lever is raised and bright. The slider is how far it swings.
 */
const { Cam, fit, hull, poly, proj, tset, tval, tdone, tween, disposer, mk, pointer, register } = HL;

const rbox = (x0, y0, z0, x1, y1, z1, r) => { const a = []; for (const [cx, cy, s] of [[x1 - r, y1 - r, 0], [x0 + r, y1 - r, 1], [x0 + r, y0 + r, 2], [x1 - r, y0 + r, 3]]) for (let i = 0; i <= 4; i++) { const t = (s + i / 4) * Math.PI / 2; for (const z of [z0, z1]) a.push([cx + r * Math.cos(t), cy + r * Math.sin(t), z]); } return a; };
const top = (pts) => pts.filter((_, i) => i % 2 === 1);
const HX = 9, HZ = 58, LL = 92, MX = 42;
function lever(psi) { const c = Math.cos(psi), s = Math.sin(psi); return rbox(-4, 16, -3, LL, 24, 3, 2.5).map(([x, y, z]) => [HX + x * c - z * s, y, HZ + x * s + z * c]); }
const lz = (psi) => HZ + (MX - HX) * Math.sin(psi);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amt = value;
  const C = Cam(45, 0.5, 2.05);
  const S0 = (30 * Math.PI) / 180;
  fit(C, [...rbox(0, 0, 0, 84, 40, 6, 6), ...lever(S0), ...lever(-0.05)], 200, 165);
  const P = proj(C), pp = (pts) => pts.map((p) => P(...p)), sol = (pts, cls = "sil") => mk("path", { class: cls, d: poly(hull(pp(pts))) }, g);
  const g = mk("g", {}, svg);
  sol(rbox(0, 0, 0, 84, 40, 6, 6));
  mk("path", { class: "nf lo", d: poly(pp(top(rbox(2, 2, 6, 82, 38, 6, 5)))) }, g);
  sol(rbox(4, 15, 6, 14, 25, HZ + 4, 3));
  sol(rbox(26, 4, 6, 58, 36, 24, 3));
  mk("path", { class: "nf lo", d: poly(pp(top(rbox(29, 7, 24, 55, 33, 24, 2)))) }, g);
  const plate = mk("path", { class: "sil" }, g), stem = mk("path", { class: "sil" }, g), arm = mk("path", { class: "sil hi" }, g);
  const tw = tween(0);
  let last = NaN;
  function draw(t) {
    if (t === last) return;
    last = t;
    const psi = S0 - (t * amt * Math.PI) / 180, zs = lz(psi), zp = zs - 32;
    plate.setAttribute("d", poly(hull(pp(rbox(30, 8, zp, 54, 32, zp + 4, 2)))));
    stem.setAttribute("d", poly(hull(pp(rbox(MX - 3, 17, zp + 4, MX + 3, 23, zs, 1.5)))));
    arm.setAttribute("d", poly(hull(pp(lever(psi)))));
  }
  const B = register(stage, (_dt, now) => { draw(tval(tw, now)); return !tdone(tw, now); });
  bag.add(B.unregister);
  const rest = pp([...rbox(0, 0, 0, 84, 40, 6, 6), ...lever(S0)]), xs = rest.map((p) => p[0]), ys = rest.map((p) => p[1]);
  const bx = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
  let on = null;
  function set(a) {
    if (a === on) return;
    on = a;
    tset(tw, a ? 1 : 0, performance.now(), 0);
    read.textContent = a ? "press" : "rest";
    B.wake();
  }
  set(false);
  bag.add(pointer(stage, { move: ([x, y]) => set(x > bx[0] && x < bx[1] && y > bx[2] && y < bx[3]), leave: () => set(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amt = v; last = NaN; B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "spurwheel",
  means: "A butter press on its board: the pointer swings the long lever down and the plunger presses into the square mould.",
  rules: [1, 3, 5, 6],
  range: [15, 28, 32],
  tour: [[198, 181], [175, 160], [225, 170], null],
  mount,
});
