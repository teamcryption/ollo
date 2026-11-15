/**
 * Vinyl cutter: a long plotter body with a vinyl roll behind it, a sheet fed
 * out in front, a hinged cover on top and the blade carriage on its front rail.
 * The pointer over the cutter swings the cover open, the carriage slides to the
 * pointer and the sheet feeds further out. At rest the cover is ajar and the
 * carriage is bright. The slider is how far the cover opens.
 */
const { Cam, clamp, facing, fit, hull, poly, prism, proj, rrect, seg, unproj, tdone, tset, tval, tween, disposer, mk, pointer, put, register, solid } = HL;

const X1 = 64, Y1 = 16, H = 14, T = 2, AMAX = 100;

function rx(p, cy, cz, a) {
  const dy = p[1] - cy, dz = p[2] - cz, c = Math.cos(a), s = Math.sin(a);
  return [p[0], cy + dy * c - dz * s, cz + dy * s + dz * c];
}
function box(x0, y0, z0, x1, y1, z1) {
  return [[x0, y0, z0], [x1, y0, z0], [x1, y1, z0], [x0, y1, z0], [x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]];
}

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amax = value;
  const C = Cam(45, 0.5, 3.6);
  const lidOpen = box(0, 0, H, X1, Y1, H + T).map((p) => rx(p, 0, H, -(AMAX * Math.PI) / 180));
  fit(C, [[0, -10, 0], [X1, Y1 + 30, 0], [X1, -10, 0], [0, Y1 + 30, 0]].concat(lidOpen.map((p) => [p[0], p[1], p[2]])), 200, 160);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const pp = (p) => P(...p);

  // the roll behind: a cylinder along x
  const circ = (x) => { const o = []; for (let i = 0; i < 20; i++) { const a = (i / 20) * Math.PI * 2; o.push([x, -6 + 4.5 * Math.cos(a), 5 + 4.5 * Math.sin(a)]); } return o; };
  mk("path", { class: "sil", d: poly(hull(circ(3).concat(circ(X1 - 3)).map(pp))) }, g);
  mk("path", { class: "nf lo", d: poly(circ(X1 - 3).map(pp)) }, g);

  // the sheet on the ground in front
  const sheet = mk("path", { class: "sil" }, g);
  // the body
  const body = solid(g);
  put(body, prism(P, front, rrect(0, 0, X1, Y1, 4, 8), rrect(1.2, 1.2, X1 - 1.2, Y1 - 1.2, 2.8, 8), 0, H));
  mk("path", { class: "nf lo", d: seg(P(4, Y1, 9), P(X1 - 4, Y1, 9)) + seg(P(4, Y1, 6), P(X1 - 4, Y1, 6)) }, body.g);
  // the cover
  const lid = { g: mk("g", {}, g) };
  lid.sil = mk("path", { class: "sil" }, lid.g);
  lid.ln = mk("path", { class: "nf lo" }, lid.g);
  // the carriage on the front rail
  const car = solid(g);

  const o = tween(0.14), cx = tween(20);
  let last = "";
  function draw(ov, x) {
    const key = ov.toFixed(4) + "," + x.toFixed(3) + "," + amax;
    if (key === last) return;
    last = key;
    const sl = 12 + ov * 16;
    sheet.setAttribute("d", poly([[6, Y1, 6], [X1 - 6, Y1, 6], [X1 - 6, Y1 + sl, 0.3], [6, Y1 + sl, 0.3]].map(pp)));
    const a = -(ov * amax * Math.PI) / 180;
    const pts = box(0.5, 0, H, X1 - 0.5, Y1, H + T).map((p) => rx(p, 0, H, a));
    lid.sil.setAttribute("d", poly(hull(pts.map(pp))));
    lid.ln.setAttribute("d", poly([pts[4], pts[5], pts[6], pts[7]].map(pp)));
    put(car, prism(P, front, rrect(x - 4, Y1 - 2, x + 4, Y1 + 4, 1.6, 4), rrect(x - 3.2, Y1 - 1.2, x + 3.2, Y1 + 3.2, 0.8, 4), 7, 15));
  }

  const B = register(stage, (_dt, now) => { draw(tval(o, now), tval(cx, now)); return !tdone(o, now) || !tdone(cx, now); });
  bag.add(B.unregister);

  function hit([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, H);
    if (x < -4 || x > X1 + 4 || y < -12 || y > Y1 + 14) return null;
    return clamp(x, 6, X1 - 6);
  }
  let act = null;
  function setActive(x) {
    if (x === act) return;
    const now = performance.now();
    act = x;
    tset(o, x === null ? 0.14 : 1, now, 0);
    tset(cx, x === null ? 20 : x, now, 0);
    car.sil.classList.toggle("hi", true);
    read.textContent = x === null ? "rest" : "x " + Math.round(x);
    B.wake();
  }
  setActive(null);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amax = v; last = ""; B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "cuttingplotter",
  means: "A vinyl cutter: the pointer swings its cover open, slides the blade carriage to it and feeds the sheet out.",
  rules: [1, 3, 5, 6],
  range: [40, 80, 100],
  tour: [[236, 138], [190, 125], [281, 137], null],
  mount,
});
