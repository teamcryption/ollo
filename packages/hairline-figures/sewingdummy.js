/**
 * Mannequin bust: a dress form on a pole and round foot, hips, waist, bust
 * and broad shoulders, with princess seams down its front. The pointer
 * turns it: move across and the bust swings round on its pole to face that
 * way, its seams sliding round the body and out of sight. At rest it stands
 * a quarter turned, its neck cap bright. The slider is how far it turns.
 *
 * The pattern: one part turning to face the pointer (turn).
 */
const {
  Cam, circ, fit, facing, hull, poly, open, prism, proj, ringAt, run, clamp, rad,
  spring, stepS, disposer, mk, pointer, put, register, solid,
} = HL;

const LOW = [[56, 22, 16], [62, 24, 17], [74, 18, 13]];
const UP = [[74, 18, 13], [92, 25, 18], [104, 30, 15], [110, 24, 12]];
const REST = 35;
function ell(a, b, th, n = 32) {
  const c = Math.cos(th), s = Math.sin(th), out = [];
  for (let i = 0; i < n; i++) {
    const t = (i / n) * Math.PI * 2, u = a * Math.cos(t), v = b * Math.sin(t), nu = b * Math.cos(t), nv = a * Math.sin(t), l = Math.hypot(nu, nv);
    out.push({ u: u * c - v * s, v: u * s + v * c, nu: (nu * c - nv * s) / l, nv: (nu * s + nv * c) / l });
  }
  return out;
}

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.15);
  fit(C, [[-34, -34, 0], [34, 34, 0], [-34, 34, 0], [34, -34, 0], [-30, 30, 106], [30, -30, 106], [0, 0, 126]], 200, 162);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  put(solid(g), prism(P, front, circ(32, 48), circ(29.5, 48), 0, 5));
  put(solid(g), prism(P, front, circ(3, 16), circ(2, 16), 5, 57));
  const lower = mk("path", { class: "sil" }, g), upper = mk("path", { class: "sil" }, g), seams = mk("path", { class: "nf lo" }, g);
  const neck = solid(g), cap = solid(g);
  put(neck, prism(P, front, circ(7, 24), circ(5.5, 24), 108, 121));
  put(cap, prism(P, front, circ(9, 24), circ(7.5, 24), 121, 124));
  const s = spring(REST);
  let last = NaN;

  const body = (secs, th) => poly(hull([].concat(...secs.map(([z, a, b]) => ringAt(P, ell(a, b, th), z)))));
  function draw(deg) {
    if (deg === last) return;
    last = deg;
    const th = rad(deg), c = Math.cos(th), sn = Math.sin(th);
    lower.setAttribute("d", body(LOW, th));
    upper.setAttribute("d", body(UP, th));
    let d = "";
    for (const f of [-0.45, 0.45]) {
      const pts = [];
      for (const [z, a, b] of LOW.slice(1).concat(UP.slice(1, 3))) {
        const u = f * a, v = b * Math.sqrt(1 - f * f) * 0.98, nu = f, nv = 1;
        if (front({ u: 0, v: 0, nu: nu * c - nv * sn, nv: nu * sn + nv * c })) pts.push(P(u * c - v * sn, u * sn + v * c, z));
      }
      if (pts.length > 1) d += open(pts) + " ";
    }
    seams.setAttribute("d", d);
  }

  const B = register(stage, (dt) => { const m = stepS(s, dt); draw(s.x); return m; });
  bag.add(B.unregister);

  const cx = P(0, 0, 0)[0];
  let act = null;
  function setA(a) {
    s.t = a === null ? REST : a;
    read.textContent = a === null ? "rest" : Math.round(a) + "°";
    const on = a !== null;
    if (on !== act) { act = on; upper.classList.toggle("hi", on); cap.sil.classList.toggle("hi", !on); }
    B.wake();
  }
  function hit([sx, sy]) {
    if (sy < 20 || sy > 300 || Math.abs(sx - cx) > 150) return null;
    return clamp((sx - cx) / 110, -1, 1) * reach;
  }
  setA(null);
  bag.add(pointer(stage, { move: (p) => setA(hit(p)), leave: () => setA(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; }, destroy: bag.dispose };
}

hairline({
  name: "sewingdummy",
  means: "A dress form on its pole: move across it and the bust turns to face that way, its front seams swinging round.",
  rules: [1, 3, 5, 8],
  range: [60, 110, 160],
  tour: [[200, 142], [322, 142], [78, 142], null],
  mount,
});
