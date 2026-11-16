/**
 * Letter scale: a desk letter scale, a base with a round dial on its front,
 * a post, and a tray with a letter on it. The pointer over the scale weighs
 * the letter: the tray tilts and sinks, the needle swings round the dial.
 * At rest the letter lies on the tray, bright. The slider is the weight.
 *
 * The pattern: one sprung part (tilt and sink); the hit is a fixed plane through the scale.
 */
const { Cam, fit, hull, open, poly, proj, unproj, tdone, tset, tval, tween, disposer, mk, pointer, register } = HL;

// a box as its eight corners (x outer, y, z inner), and a turn about an x-parallel axis through (y, z)
function box(a, b) { const o = []; for (const x of [a[0], b[0]]) for (const y of [a[1], b[1]]) for (const z of [a[2], b[2]]) o.push([x, y, z]); return o; }
const rx = (c, a) => ([x, y, z]) => { const s = Math.sin(a), k = Math.cos(a), dy = y - c[0], dz = z - c[1]; return [x, c[0] + dy * k - dz * s, c[1] + dy * s + dz * k]; };
const TOP = [1, 3, 7, 5], FRONT = [2, 3, 7, 6];
function part(g, cls) { const grp = mk("g", {}, g); return { sil: mk("path", { class: "sil" + (cls ? " " + cls : "") }, grp), det: mk("path", { class: "nf lo" }, grp) }; }
function show(P, p, pts, faces, extra) { p.sil.setAttribute("d", poly(hull(pts.map((q) => P(...q))))); p.det.setAttribute("d", faces.map((f) => poly(f.map((i) => P(...pts[i])))).join("") + (extra || "")); }

const L = 44, WORD = "weigh";
const EXT = [[-6, -6, 0], [L + 6, -6, 0], [-6, 40, 0], [L + 6, 40, 0], [-6, -6, 34], [L + 6, 40, 34]];
const HIT = [-8, L + 8, -8, 42, 20];
const tray = box([-6, -4, 26], [L + 6, 38, 28]), letter = box([4, 4, 28], [L - 4, 28, 29]);
const ring = (r, a0, n) => { const o = []; for (let i = 0; i <= n; i++) { const a = a0 + (i / n) * Math.PI * 2; o.push([L / 2 + r * Math.cos(a), 34, 10 + r * Math.sin(a)]); } return o; };

function build(g, P) {
  const post = part(g), base = part(g), tr = part(g), let_ = part(g, "hi"), needle = mk("path", { class: "nf hi" }, g);
  show(P, post, box([L / 2 - 3, 14, 12], [L / 2 + 3, 20, 27]), [FRONT]);
  show(P, base, box([0, 0, 0], [L, 34, 14]), [TOP], open(ring(8, 0, 24).map((p) => P(...p))));
  return (w) => {
    const sink = w * 0.12, f = (p) => rx([17, 27], w * 0.004)([p[0], p[1], p[2] - sink]);
    show(P, tr, tray.map(f), [TOP]);
    show(P, let_, letter.map(f), [TOP], seg2(P, letter.map(f)));
    const a = Math.PI / 2 - w * 0.05;
    needle.setAttribute("d", open([[L / 2, 34, 10], [L / 2 + 7 * Math.cos(a), 34, 10 + 7 * Math.sin(a)]].map((p) => P(...p))));
  };
}
const seg2 = (P, b) => open([b[1], [(b[3][0] + b[7][0]) / 2, (b[3][1] + b[7][1]) / 2 - 10, b[3][2]], b[5]].map((p) => P(...p)));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amt = value, last = NaN;
  const C = Cam(45, 0.5, 3.6);
  fit(C, EXT, 200, 168);
  const P = proj(C), g = mk("g", {}, svg);
  const draw = build(g, P);
  const t = tween(0);
  const B = register(stage, (_dt, now) => {
    const v = tval(t, now) * amt;
    if (v !== last) { last = v; draw(v); }
    return !tdone(t, now);
  });
  bag.add(B.unregister);
  function hit([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, HIT[4]);
    return x > HIT[0] && x < HIT[1] && y > HIT[2] && y < HIT[3] ? 1 : 0;
  }
  let act = -1;
  function setActive(a) {
    if (a === act) return;
    act = a;
    tset(t, a, performance.now(), 0);
    read.textContent = a ? WORD : "rest";
    B.wake();
  }
  setActive(0);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(0) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amt = v; last = NaN; B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "letterscale",
  means: "A desk letter scale: the pointer weighs the letter, the tray tilts and sinks and the needle swings round its dial.",
  rules: [1, 3, 5],
  range: [20, 50, 60],
  tour: [[203, 129], [220, 150], [185, 110], null],
  mount,
});
