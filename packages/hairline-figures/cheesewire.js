/**
 * Cheese wire: a board with a wedge of cheese and a hinged arm whose wire
 * cuts through it. The pointer over the figure swings the arm down; at rest
 * the arm is raised and bright. The slider is how far it swings.
 */
const { Cam, fit, hull, poly, open, proj, tset, tval, tdone, tween, disposer, mk, pointer, register } = HL;

const rbox = (x0, y0, z0, x1, y1, z1, r) => { const a = []; for (const [cx, cy, s] of [[x1 - r, y1 - r, 0], [x0 + r, y1 - r, 1], [x0 + r, y0 + r, 2], [x1 - r, y0 + r, 3]]) for (let i = 0; i <= 4; i++) { const t = (s + i / 4) * Math.PI / 2; for (const z of [z0, z1]) a.push([cx + r * Math.cos(t), cy + r * Math.sin(t), z]); } return a; };
const ball = (cx, cy, cz, r, n = 16) => { const a = []; for (let i = 0; i < n; i++) { const t = (i / n) * 2 * Math.PI; a.push([cx + r * Math.cos(t), cy + r * Math.sin(t), cz], [cx + r * Math.cos(t), cy, cz + r * Math.sin(t)], [cx, cy + r * Math.cos(t), cz + r * Math.sin(t)]); } return a; };
const top = (pts) => pts.filter((_, i) => i % 2 === 1);
const PX = 6, PZ = 12, L = 104, YA = 52;
const tip = (a) => [PX + L * Math.cos(a), PZ + L * Math.sin(a)];
function arm(a) { const [x, z] = tip(a), o = []; for (let i = 0; i <= 8; i++) { const t = i / 8; o.push(...ball(PX + (x - PX) * t, YA, PZ + (z - PZ) * t, 3.4, 8)); } return o; }

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amt = value;
  const A0 = (52 * Math.PI) / 180;
  const C = Cam(45, 0.5, 2.05);
  fit(C, [...rbox(0, 0, 0, 110, 62, 6, 6), ...arm(A0), ...ball(tip(A0)[0], YA, tip(A0)[1], 8)], 200, 160);
  const P = proj(C), pp = (pts) => pts.map((p) => P(...p)), sol = (pts, cls = "sil") => mk("path", { class: cls, d: poly(hull(pp(pts))) }, g);
  const g = mk("g", {}, svg);
  sol(rbox(0, 0, 0, 110, 62, 6, 6));
  mk("path", { class: "nf lo", d: poly(pp(top(rbox(2, 2, 6, 108, 60, 6, 5)))) }, g);
  mk("path", { class: "lo", d: open(pp([[14, YA - 3, 6.1], [104, YA - 3, 6.1]])) }, g);
  sol([...rbox(40, 10, 6, 84, 44, 30, 4)]);
  mk("path", { class: "nf lo", d: poly(pp(top(rbox(42, 12, 30, 82, 42, 30, 3)))) }, g);
  sol(rbox(0, YA - 7, 6, 12, YA + 7, 18, 3));
  const wire = mk("path", { class: "lo nf" }, g), rod = mk("path", { class: "sil hi" }, g), knob = mk("path", { class: "sil hi" }, g);
  const tw = tween(0);
  let last = NaN;
  function draw(t) {
    if (t === last) return;
    last = t;
    const a = A0 - (t * amt * Math.PI) / 180, [x, z] = tip(a);
    wire.setAttribute("d", open(pp([[PX, YA - 3, PZ], [x, YA - 3, z]])));
    rod.setAttribute("d", poly(hull(pp(arm(a)))));
    knob.setAttribute("d", poly(hull(pp(ball(x, YA, z, 7)))));
  }
  const B = register(stage, (_dt, now) => { draw(tval(tw, now)); return !tdone(tw, now); });
  bag.add(B.unregister);
  const rest = pp([...rbox(0, 0, 0, 110, 62, 6, 6), ...arm(A0)]), xs = rest.map((p) => p[0]), ys = rest.map((p) => p[1]);
  const bx = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
  let on = null;
  function set(a) {
    if (a === on) return;
    on = a;
    tset(tw, a ? 1 : 0, performance.now(), 0);
    read.textContent = a ? "cut" : "rest";
    B.wake();
  }
  set(false);
  bag.add(pointer(stage, { move: ([x, y]) => set(x > bx[0] && x < bx[1] && y > bx[2] && y < bx[3]), leave: () => set(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amt = v; last = NaN; B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "cheesewire",
  means: "A cheese wire board: the pointer swings the hinged arm down and its wire cuts through the block of cheese.",
  rules: [1, 3, 5, 6],
  range: [20, 45, 52],
  tour: [[177, 120], [160, 150], [215, 175], null],
  mount,
});
