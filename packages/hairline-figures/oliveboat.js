/**
 * Olive dish: a long boat-shaped dish holding olives under a domed lid. The
 * pointer over the figure lifts the lid and tips it back, showing the
 * olives. At rest the lid is bright. The slider is how high it lifts.
 */
const { Cam, fit, hull, poly, proj, tset, tval, tdone, tween, disposer, mk, pointer, register } = HL;

const RX = 62, RY = 26;
const ring = (sx, sy, z, n = 40) => { const a = []; for (let i = 0; i < n; i++) { const t = (i / n) * 2 * Math.PI; a.push([RX * sx * Math.cos(t), RY * sy * Math.sin(t), z]); } return a; };
const ball = (cx, cy, cz, r, n = 14) => { const a = []; for (let i = 0; i < n; i++) { const t = (i / n) * 2 * Math.PI; a.push([cx + r * Math.cos(t), cy + r * Math.sin(t), cz], [cx + r * Math.cos(t), cy, cz + r * Math.sin(t)], [cx, cy + r * Math.cos(t), cz + r * Math.sin(t)]); } return a; };
const OL = [[-30, -4], [-12, 6], [6, -6], [24, 4], [40, -2]];
function dome(lift, tilt) {
  const pts = [...ring(1, 1, 0), ...ring(0.8, 0.78, 12), ...ring(0.45, 0.45, 20), ...ball(0, 0, 25, 5, 10)];
  const c = Math.cos(tilt), s = Math.sin(tilt), hx = -RX;
  return pts.map(([x, y, z]) => { const dx = x - hx; return [hx + dx * c - z * s, y, 18 + lift + dx * s + z * c]; });
}

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amt = value;
  const C = Cam(45, 0.5, 2.3);
  fit(C, [...ring(1.1, 1.15, 0), ...dome(0, 0), ...dome(40, 0.4)], 200, 160);
  const P = proj(C), pp = (pts) => pts.map((p) => P(...p));
  const g = mk("g", {}, svg);
  mk("path", { class: "sil", d: poly(hull(pp([...ring(0.7, 0.7, 0), ...ring(1.12, 1.15, 16)]))) }, g);
  mk("path", { class: "nf lo", d: poly(pp(ring(1.02, 1.02, 16))) }, g);
  const ol = OL.map(([x, y]) => mk("path", { class: "sil", d: poly(hull(pp(ball(x, y, 14, 7)))) }, g));
  mk("path", { class: "nf lo", d: poly(pp(ring(1.12, 1.15, 16).filter((p) => p[1] > 0))) }, g).setAttribute("d", "M" + pp(ring(1.12, 1.15, 16).filter((p) => p[1] > 0).sort((a, b) => b[0] - a[0])).map((p) => p.join(",")).join("L"));
  const lid = mk("path", { class: "sil hi" }, g), crease = mk("path", { class: "nf lo" }, g);
  const tw = tween(0);
  let last = NaN;
  function draw(t) {
    if (t === last) return;
    last = t;
    const d = dome(t * amt, t * 0.5 * (amt / 50));
    lid.setAttribute("d", poly(hull(pp(d))));
    crease.setAttribute("d", poly(pp(d.slice(40, 80))));
  }
  const B = register(stage, (_dt, now) => { draw(tval(tw, now)); return !tdone(tw, now); });
  bag.add(B.unregister);
  const rest = pp([...ring(1.12, 1.15, 0), ...dome(0, 0)]), xs = rest.map((p) => p[0]), ys = rest.map((p) => p[1]);
  const bx = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
  let on = null;
  function set(a) {
    if (a === on) return;
    on = a;
    tset(tw, a ? 1 : 0, performance.now(), 0);
    read.textContent = a ? "open" : "rest";
    B.wake();
  }
  set(false);
  bag.add(pointer(stage, { move: ([x, y]) => set(x > bx[0] && x < bx[1] && y > bx[2] && y < bx[3]), leave: () => set(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amt = v; last = NaN; B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "oliveboat",
  means: "An olive dish: the pointer lifts the domed lid and tips it back, showing the olives in the boat-shaped dish.",
  rules: [1, 3, 5, 6],
  range: [20, 32, 40],
  tour: [[200, 167], [150, 190], [250, 200], null],
  mount,
});
