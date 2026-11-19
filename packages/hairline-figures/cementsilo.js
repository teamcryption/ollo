/**
 * Cement silo: a site silo on its own transport frame, the tall barrel
 * standing on short legs over a cone hopper with a valve at its foot. It is
 * hinged to the frame at the leg feet: the pointer raises it from its
 * travelling lean towards upright. At rest it leans low, the valve bright.
 * The slider is how far it stands up.
 */
const {
  Cam, fit, hull, poly, proj, rrect, rad, tset, tval, tdone, tween,
  disposer, mk, pointer, register, solid,
} = HL;

const FZ = 8, R = 18, REST = 42;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let maxA = value;
  const C = Cam(45, 0.5, 1.32);
  fit(C, [[-24, -26, 0], [160, 26, 0], [160, -26, 0], [-24, 26, 0], [0, 0, FZ + 160], [-20, 0, FZ + 160]], 200, 158);
  const P = proj(C);
  const g = mk("g", {}, svg);
  // a point on the silo: s along its axis, a across it (in the lean plane), b sideways
  let th = 0;
  const at = (s, a, b) => { const c = Math.cos(th), si = Math.sin(th); return P(s * c - a * si, b, FZ + s * si + a * c); };
  const disc = (s, r, a0 = 0, b0 = 0, n = 28) => Array.from({ length: n }, (_, i) => { const t = (i / n) * Math.PI * 2; return at(s, a0 + r * Math.cos(t), b0 + r * Math.sin(t)); });
  const tube = (s0, r0, s1, r1, a0 = 0, b0 = 0) => poly(hull(disc(s0, r0, a0, b0).concat(disc(s1, r1, a0, b0))));
  // the frame: two rails and a cross-beam, with the hinge block
  const frame = solid(g);
  const fr = rrect(-22, -24, 158, 24, 5, 4), fi = rrect(-20, -22, 156, 22, 4, 4);
  frame.sil.setAttribute("d", poly(hull(fr.map((q) => P(q.u, q.v, 0)).concat(fr.map((q) => P(q.u, q.v, FZ))))));
  frame.cr.setAttribute("d", poly(fi.map((q) => P(q.u, q.v, FZ))));
  frame.cr.setAttribute("class", "nf lo");
  const cradle = solid(g);
  const cr0 = rrect(120, -14, 132, 14, 3, 4);
  cradle.sil.setAttribute("d", poly(hull(cr0.map((q) => P(q.u, q.v, FZ)).concat(cr0.map((q) => P(q.u, q.v, FZ + 12))))));
  const sg = mk("g", {}, g);
  const legs = [[-12, -12], [-12, 12], [12, -12], [12, 12]].map(() => mk("path", { class: "sil" }, sg));
  const valve = mk("path", { class: "sil" }, sg);
  const cone = mk("path", { class: "sil" }, sg);
  const barrel = mk("path", { class: "sil" }, sg), rimL = mk("path", { class: "nf lo" }, sg), band = mk("path", { class: "nf lo" }, sg);
  const roof = mk("path", { class: "sil" }, sg);
  const LEGS = [[-12, -12], [-12, 12], [12, -12], [12, 12]];
  const up = tween(0);
  let last = NaN;
  function draw(k) {
    if (k === last) return;
    last = k;
    th = rad(REST + k * (maxA - REST));
    LEGS.forEach(([a, b], i) => legs[i].setAttribute("d", tube(0, 2, 30, 2, a, b)));
    valve.setAttribute("d", tube(14, 5, 22, 5));
    cone.setAttribute("d", tube(20, 5, 40, R));
    barrel.setAttribute("d", tube(40, R, 140, R));
    band.setAttribute("d", poly(disc(90, R)));
    rimL.setAttribute("d", poly(disc(138, R - 2)));
    roof.setAttribute("d", tube(140, R, 150, 5));
  }
  const B = register(stage, (_dt, now) => { draw(tval(up, now)); return !tdone(up, now); });
  bag.add(B.unregister);
  // hit: the rest pose's screen box (frame plus leaning silo)
  th = rad(REST);
  const rb = [...fr.map((q) => P(q.u, q.v, 0)), ...disc(140, R), ...disc(40, R), ...disc(0, 14)];
  const bx0 = Math.min(...rb.map((p) => p[0])), bx1 = Math.max(...rb.map((p) => p[0])), by0 = Math.min(...rb.map((p) => p[1])), by1 = Math.max(...rb.map((p) => p[1]));
  const hit = ([sx, sy]) => sx > bx0 && sx < bx1 && sy > by0 && sy < by1;
  let act = null;
  function setActive(on) {
    if (on === act) return;
    act = on;
    tset(up, on ? 1 : 0, performance.now(), 0);
    valve.classList.toggle("hi", !on);
    barrel.classList.toggle("hi", on);
    read.textContent = on ? "up " + Math.round(maxA) + "°" : "rest";
    B.wake();
  }
  setActive(false);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { maxA = v; last = NaN; B.wake(); if (act) read.textContent = "up " + Math.round(v) + "°"; }, destroy: bag.dispose };
}

hairline({
  name: "cementsilo",
  means: "A cement silo on its transport frame: the pointer raises it on its foot hinge from a low lean towards upright.",
  rules: [1, 3, 5, 6],
  range: [55, 75, 90],
  tour: [[160, 200], [221, 189], [262, 172], null],
  mount,
});
