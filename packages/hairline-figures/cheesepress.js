/**
 * Cheese press: a cheese hoop on a board between two posts, a screw coming
 * down through the crossbar onto the follower. The pointer over the figure
 * turns the long handle and the screw drives the follower down into the
 * hoop. At rest the handle is bright. The slider is how far it turns.
 */
const { Cam, fit, hull, poly, proj, tset, tval, tdone, tween, disposer, mk, pointer, register } = HL;

const rbox = (x0, y0, z0, x1, y1, z1, r) => { const a = []; for (const [cx, cy, s] of [[x1 - r, y1 - r, 0], [x0 + r, y1 - r, 1], [x0 + r, y0 + r, 2], [x1 - r, y0 + r, 3]]) for (let i = 0; i <= 4; i++) { const t = (s + i / 4) * Math.PI / 2; for (const z of [z0, z1]) a.push([cx + r * Math.cos(t), cy + r * Math.sin(t), z]); } return a; };
const cyl = (cx, cy, r, z0, z1, n = 28) => { const a = []; for (let i = 0; i < n; i++) { const t = (i / n) * 2 * Math.PI; a.push([cx + r * Math.cos(t), cy + r * Math.sin(t), z0], [cx + r * Math.cos(t), cy + r * Math.sin(t), z1]); } return a; };
const top = (pts) => pts.filter((_, i) => i % 2 === 1);
const CX = 40, CY = 25, ZB = 82;
function bar(b, z) { const c = Math.cos(b) * 34, s = Math.sin(b) * 34; return [...cyl(CX + c, CY + s, 3, z, z + 5, 12), ...cyl(CX - c, CY - s, 3, z, z + 5, 12)]; }

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amt = value;
  const C = Cam(45, 0.5, 2.0);
  const B0 = (15 * Math.PI) / 180, F0 = 40, F1 = 30;
  fit(C, [...rbox(0, 0, 0, 80, 50, 6, 6), ...bar(B0, F0 + 64), ...bar(B0 + 1.6, F0 + 64), ...bar(B0 + 0.8, F0 + 64)], 200, 160);
  const P = proj(C), pp = (pts) => pts.map((p) => P(...p)), sol = (pts, cls = "sil") => mk("path", { class: cls, d: poly(hull(pp(pts))) }, g);
  const g = mk("g", {}, svg);
  sol(rbox(0, 0, 0, 80, 50, 6, 6));
  mk("path", { class: "nf lo", d: poly(pp(top(rbox(2, 2, 6, 78, 48, 6, 5)))) }, g);
  sol(rbox(4, 20, 6, 13, 30, ZB, 3));
  sol(cyl(CX, CY, 20, 6, 30));
  mk("path", { class: "nf lo", d: poly(pp(top(cyl(CX, CY, 18, 30, 30)))) }, g);
  const plate = mk("path", { class: "sil" }, g), screw = mk("path", { class: "sil" }, g);
  sol(rbox(0, 19, ZB - 8, 80, 31, ZB, 4));
  sol(rbox(67, 20, 6, 76, 30, ZB - 8, 3));
  const stub = mk("path", { class: "sil" }, g), hub = mk("path", { class: "sil" }, g), handle = mk("path", { class: "sil hi" }, g);
  const tw = tween(0);
  let last = NaN;
  function draw(t) {
    if (t === last) return;
    last = t;
    const zf = F0 + (F1 - F0) * t, b = B0 + (t * amt * Math.PI) / 180, zt = zf + 64;
    plate.setAttribute("d", poly(hull(pp(cyl(CX, CY, 16, zf, zf + 3)))));
    screw.setAttribute("d", poly(hull(pp(cyl(CX, CY, 2.6, zf + 3, ZB - 8, 12)))));
    stub.setAttribute("d", poly(hull(pp(cyl(CX, CY, 2.6, ZB, zt, 12)))));
    hub.setAttribute("d", poly(hull(pp(cyl(CX, CY, 5, zt - 2, zt + 6, 16)))));
    handle.setAttribute("d", poly(hull(pp(bar(b, zt)))));
  }
  const B = register(stage, (_dt, now) => { draw(tval(tw, now)); return !tdone(tw, now); });
  bag.add(B.unregister);
  const rest = pp([...rbox(0, 0, 0, 80, 50, 6, 6), ...bar(B0, F0 + 64)]), xs = rest.map((p) => p[0]), ys = rest.map((p) => p[1]);
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
  name: "cheesepress",
  means: "A cheese press between two posts: the pointer turns the long handle and the screw drives the follower down into the hoop.",
  rules: [1, 3, 5, 6],
  range: [45, 90, 120],
  tour: [[200, 108], [175, 120], [225, 130], null],
  mount,
});
