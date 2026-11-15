/**
 * Screen print press: a base board with a sheet on it, a hinge clamp at the
 * back and the mesh frame held up in it, a squeegee resting on the frame. The
 * pointer over the press swings the frame down onto the sheet and draws the
 * squeegee across the mesh. At rest the frame is raised and the squeegee is
 * bright. The slider is how high the frame rests.
 */
const { Cam, facing, fit, hull, poly, prism, proj, rrect, seg, unproj, tdone, tset, tval, tween, disposer, mk, pointer, put, register, solid } = HL;
const D = Math.PI / 180;
function rx(p, cy, cz, a) {
  const dy = p[1] - cy, dz = p[2] - cz, c = Math.cos(a), s = Math.sin(a);
  return [p[0], cy + dy * c - dz * s, cz + dy * s + dz * c];
}
function box(x0, y0, z0, x1, y1, z1) {
  return [[x0, y0, z0], [x1, y0, z0], [x1, y1, z0], [x0, y1, z0], [x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]];
}
function plate(parent) { const g = mk("g", {}, parent); return { g, sil: mk("path", { class: "sil" }, g), ln: mk("path", { class: "nf lo" }, g) }; }

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let lift = value;
  const C = Cam(45, 0.5, 3.7);
  const up = box(6, 4, 2, 44, 34, 12).map((p) => rx(p, 4, 4, 60 * D));
  fit(C, [[0, 0, 0], [50, 0, 0], [50, 40, 0], [0, 40, 0]].concat(up), 200, 165);
  const P = proj(C), front = facing(C), pp = (p) => P(...p);
  const g = mk("g", {}, svg);
  const base = solid(g);
  put(base, prism(P, front, rrect(0, 0, 50, 40, 2, 4), rrect(1, 1, 49, 39, 1, 4), 0, 2));
  mk("path", { class: "nf lo", d: poly([[12, 10, 2], [38, 10, 2], [38, 30, 2], [12, 30, 2]].map(pp)) }, base.g);
  const clampS = solid(g);
  put(clampS, prism(P, front, rrect(14, 0, 36, 4, 1, 3), rrect(15, 1, 35, 3, 0.5, 3), 2, 8));
  const frame = plate(g), sq = plate(g);
  const o = tween(1), s = tween(0);
  let last = "";
  function draw(v, sv) {
    const key = v.toFixed(4) + "," + sv.toFixed(4) + "," + lift;
    if (key === last) return;
    last = key;
    const a = v * lift * D;
    const T = (p) => rx(p, 4, 4, a);
    const pts = box(6, 4, 2, 44, 34, 5).map(T);
    frame.sil.setAttribute("d", poly(hull(pts.map(pp))));
    frame.ln.setAttribute("d", poly([[10, 8, 5], [40, 8, 5], [40, 30, 5], [10, 30, 5]].map(T).map(pp)));
    const y = 10 + sv * 16;
    const q = box(9, y, 5, 41, y + 2, 9).map(T).concat(box(23, y + 0.2, 9, 27, y + 1.8, 13).map(T));
    sq.sil.setAttribute("d", poly(hull(q.map(pp))));
    sq.ln.setAttribute("d", seg(pp(T([9, y + 2, 9])), pp(T([41, y + 2, 9]))));
  }
  const B = register(stage, (_dt, now) => { draw(tval(o, now), tval(s, now)); return !tdone(o, now) || !tdone(s, now); });
  bag.add(B.unregister);
  function hit([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, 4);
    return x > -4 && x < 54 && y > -10 && y < 44;
  }
  let act = null;
  function setActive(on) {
    if (on === act) return;
    act = on;
    const now = performance.now();
    tset(o, on ? 0 : 1, now, 0);
    tset(s, on ? 1 : 0, now, on ? 260 : 0);
    sq.sil.classList.toggle("hi", true);
    read.textContent = on ? "pull" : "rest";
    B.wake();
  }
  setActive(false);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { lift = v; last = ""; B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "inkjar",
  means: "A screen print press: the pointer swings the mesh frame down onto the sheet and the squeegee is drawn across it.",
  rules: [1, 3, 5, 6],
  range: [25, 45, 60],
  tour: [[200, 176], [187, 149], [213, 244], null],
  mount,
});
