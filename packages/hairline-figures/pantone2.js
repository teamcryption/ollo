/**
 * Drawing tablet: a slim pen tablet with its active area marked, and a
 * stylus held over it. The pointer on the tablet moves the pen there; the
 * pen slides over, leaning more toward the far side, and leaves its stroke
 * from where it rested. At rest the pen stands near the middle, bright.
 */
const { Cam, clamp, fit, hull, open, poly, proj, seg, unproj, tdone, tset, tval, tween, disposer, mk, pointer, register } = HL;

const W = 52, D = 38, T = 2.5, IN = 6, PL = 58, PR = 2.6, RX = 22, RY = 20;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let lean = value;
  const C = Cam(45, 0.5, 3.0);
  fit(C, [[0, 0, 0], [W, D, 0], [0, D, 0], [W, 0, 0], [IN + 22, IN - 14, PL], [W - IN + 26, D - IN - 14, PL], [IN + 10, D - IN - 14, PL]], 200, 160);
  const P = proj(C);
  const g = mk("g", {}, svg);
  const c = [];
  for (const x of [0, W]) for (const y of [0, D]) for (const z of [0, T]) c.push(P(x, y, z));
  mk("path", { class: "sil", d: poly(hull(c)) }, g);
  mk("path", { class: "nf lo", d: seg(c[7], c[3]) + seg(c[7], c[5]) + seg(c[7], c[6]) }, g);
  const corner = (x, y, dx, dy) => open([P(x + dx, y, T), P(x, y, T), P(x, y + dy, T)]);
  mk("path", { class: "nf lo", d: corner(IN, IN, 5, 5) + corner(W - IN, IN, -5, 5) + corner(W - IN, D - IN, -5, -5) + corner(IN, D - IN, 5, -5) }, g);

  const stroke = mk("path", { class: "nf" }, g);
  const pg = mk("g", {}, g);
  const pen = mk("path", { class: "sil" }, pg), pcr = mk("path", { class: "nf lo" }, pg);
  const tx = tween(RX), ty = tween(RY);
  const trail = [];
  let lx = NaN, ly = NaN;
  function axis(x, y) {
    const k = 0.25 + 0.3 * (x / W) * (0.5 + lean);
    const d = [k, -0.45, 1], n = Math.hypot(...d);
    return d.map((v) => v / n);
  }
  function ring(o, d, r) {
    const u = [d[2], 0, -d[0]], un = Math.hypot(...u), uu = u.map((v) => v / un);
    const v = [d[1] * uu[2] - d[2] * uu[1], d[2] * uu[0] - d[0] * uu[2], d[0] * uu[1] - d[1] * uu[0]];
    const pts = [];
    for (let i = 0; i < 16; i++) { const t = (i / 16) * Math.PI * 2, cs = Math.cos(t) * r, sn = Math.sin(t) * r; pts.push(P(o[0] + uu[0] * cs + v[0] * sn, o[1] + uu[1] * cs + v[1] * sn, o[2] + uu[2] * cs + v[2] * sn)); }
    return pts;
  }
  function draw(x, y) {
    if (x === lx && y === ly) return;
    lx = x; ly = y;
    const d = axis(x, y), at = (s) => [x + d[0] * s, y + d[1] * s, T + d[2] * s];
    const pts = [P(x, y, T)].concat(ring(at(6), d, PR * 0.7), ring(at(12), d, PR), ring(at(PL), d, PR));
    pen.setAttribute("d", poly(hull(pts)));
    const gr = ring(at(22), d, PR), gr2 = ring(at(12), d, PR);
    pcr.setAttribute("d", open(gr.slice(0, 9)) + open(gr2.slice(0, 9)) + seg(P(...at(26)), P(...at(PL - 4))));
    trail.push(P(x, y, T));
    if (Math.hypot(x - RX, y - RY) < 0.01) trail.length = 0;
    stroke.setAttribute("d", trail.length > 1 ? open(trail) : "");
  }
  const B = register(stage, (_dt, now) => { draw(tval(tx, now), tval(ty, now)); return !tdone(tx, now) || !tdone(ty, now); });
  bag.add(B.unregister);

  function hit([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, T);
    if (x < -4 || x > W + 4 || y < -4 || y > D + 4) return null;
    return [clamp(Math.round(x), IN, W - IN), clamp(Math.round(y), IN, D - IN)];
  }
  let cur = "";
  function setP(p) {
    const key = p ? p.join(",") : "rest";
    if (key === cur) return;
    cur = key;
    const now = performance.now();
    tset(tx, p ? p[0] : RX, now, 0); tset(ty, p ? p[1] : RY, now, 0);
    pen.classList.add("hi");
    read.textContent = p ? p[0] + "·" + p[1] : "rest";
    B.wake();
  }
  setP(null);
  bag.add(pointer(stage, { move: (p) => setP(hit(p)), leave: () => setP(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { lean = v; }, destroy: bag.dispose };
}

hairline({
  name: "pantone2",
  means: "A pen tablet and stylus: the pen slides to the pointer over the tablet, leaning further toward the far side, drawing its stroke.",
  rules: [1, 3, 5, 6],
  range: [0, 0.5, 1],
  tour: [[183, 187], [208, 251], [259, 226], null],
  mount,
});
