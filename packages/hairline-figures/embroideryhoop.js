/**
 * Embroidery hoop: a round hoop with its fabric drawn taut, a little flower
 * stitched in the middle, and the brass screw clamp on its rim. The pointer
 * picks the hoop up: it tilts on a spring about its far edge, clamp rising,
 * and the rim takes the bright. At rest it lies almost flat, screw bright.
 * The slider is how far it tilts.
 *
 * The pattern: a tilt on one spring; the hit is on the ground plane.
 */
const {
  Cam, circ, fit, flatDot, hull, place, poly, proj, rings, unproj, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const R = 42, H = 6, REST = 0.62, MAX = 0.98;
const STITCH = [[0, 0, "dot m"], [7, 0, "dot off"], [-7, 0, "dot off"], [0, 7, "dot off"], [0, -7, "dot off"], [-12, 12, "dot off"]];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 2.4);
  const ext = [];
  for (let k = 0; k < 12; k++) { const t = (k / 12) * Math.PI * 2; ext.push([R * Math.cos(t), R * Math.sin(t), 0]); }
  const xm = 2 * R + 12;
  ext.push([R - xm * Math.cos(MAX * 1.4), 0, xm * Math.sin(MAX * 1.4) + 8], [R - xm * Math.cos(REST), 0, xm * Math.sin(REST) + 8]);
  fit(C, ext, 200, 166);
  const P = proj(C);
  const g = mk("g", {}, svg);
  const ts = (s, ring, inner, z0, z1, T) => {
    const pts = (r, z) => r.map((q) => P(...T([q.u, q.v, z])));
    put(s, { sil: poly(hull(pts(ring, z0).concat(pts(ring, z1)))), crease: inner ? poly(pts(inner, z1)) : "" });
  };
  const hoop = solid(g), cloth = mk("path", { class: "nf lo" }, g);
  const dots = STITCH.map(([, , cls]) => flatDot(g, C, 1.6, cls));
  const lugs = [solid(g), solid(g)], screw = solid(g), head = solid(g);
  const [lr, li] = rings(-4, -2.4, 4, 2.4, 1, 0.5);
  const sp = spring(REST);
  let drawn = NaN, on = false;

  function draw() {
    if (Math.abs(sp.x - drawn) < 1e-4) return;
    drawn = sp.x;
    const c = Math.cos(sp.x), s = Math.sin(sp.x);
    const W = ([x, y, z]) => [R + (x - R) * c + z * s, y, -(x - R) * s + z * c];
    ts(hoop, circ(R, 64), circ(R - 2, 64), 0, H, ([u, v, w]) => W([u, v, w]));
    cloth.setAttribute("d", poly(circ(R - 3.5, 64).map((q) => P(...W([q.u, q.v, H - 2])))));
    STITCH.forEach(([x, y], k) => place(dots[k], P(...W([x, y, H - 2]))));
    [-4, 4].forEach((y, k) => ts(lugs[k], lr, li, 0, 9, ([u, v, w]) => W([-R - 4 + u, y + v, w])));
    ts(screw, circ(1.8, 16), null, -9, 7, ([u, v, w]) => W([-R - 5 + u, w, 5 + v]));
    ts(head, circ(3.6, 20), circ(2.6, 20), 7, 10, ([u, v, w]) => W([-R - 5 + u, w, 5 + v]));
  }
  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(); return m; });
  bag.add(B.unregister);

  function retarget() {
    sp.t = on ? MAX * value : REST;
    head.sil.classList.toggle("hi", !on);
    hoop.sil.classList.toggle("hi", on);
    read.textContent = on ? "lift" : "rest";
    B.wake();
  }
  bag.add(pointer(stage, {
    move: (p) => { const [x, y] = unproj(C, p[0], p[1], 0); on = Math.hypot(x, y) < R + 30; retarget(); },
    leave: () => { on = false; retarget(); },
  }));
  bag.add(() => svg.replaceChildren());
  retarget();
  return { set: (v) => { value = v; retarget(); }, destroy: bag.dispose };
}

hairline({
  name: "embroideryhoop",
  means: "An embroidery hoop with a stitched flower: the pointer tilts it up off the table, screw clamp rising, and the rim lights.",
  rules: [1, 3, 5, 8],
  range: [0.5, 1, 1.4],
  tour: [[200, 242], [140, 195], [265, 255], null],
  mount,
});
