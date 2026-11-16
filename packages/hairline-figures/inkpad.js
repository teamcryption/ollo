/**
 * Ink pad: a flat stamp pad tin, a shallow base holding the inked pad and a
 * lid hinged along the back. The pointer over the tin swings the lid open
 * on its hinge to show the pad. At rest the tin is shut, its lid bright. The
 * slider is how far the lid swings.
 *
 * The pattern: one hinged part (swing); the hit is a fixed plane through the tin.
 */
const { Cam, fit, hull, open, poly, proj, unproj, tdone, tset, tval, tween, disposer, mk, pointer, register } = HL;

// a box as its eight corners (x outer, y, z inner), and a turn about an x-parallel axis through (y, z)
function box(a, b) { const o = []; for (const x of [a[0], b[0]]) for (const y of [a[1], b[1]]) for (const z of [a[2], b[2]]) o.push([x, y, z]); return o; }
const rx = (c, a) => ([x, y, z]) => { const s = Math.sin(a), k = Math.cos(a), dy = y - c[0], dz = z - c[1]; return [x, c[0] + dy * k - dz * s, c[1] + dy * s + dz * k]; };
const TOP = [1, 3, 7, 5], FRONT = [2, 3, 7, 6];
function part(g, cls) { const grp = mk("g", {}, g); return { sil: mk("path", { class: "sil" + (cls ? " " + cls : "") }, grp), det: mk("path", { class: "nf lo" }, grp) }; }
function show(P, p, pts, faces, extra) { p.sil.setAttribute("d", poly(hull(pts.map((q) => P(...q))))); p.det.setAttribute("d", faces.map((f) => poly(f.map((i) => P(...pts[i])))).join("") + (extra || "")); }

const L = 56, D = 38, PIV = [0, 9], WORD = "open";
const EXT = [[0, 0, 0], [L, 0, 0], [0, D, 0], [L, D, 0], [0, -20, 46], [L, -20, 46]];
const HIT = [-4, L + 4, -8, D + 4, 8];
const lid = box([-1, 0, 7], [L + 1, D + 1, 11]);

function build(g, P) {
  const base = part(g), lidp = part(g, "hi");
  const pad = box([4, 4, 5], [L - 4, D - 4, 7]);
  show(P, base, box([0, 1, 0], [L, D, 7]), [TOP, FRONT], poly(TOP.map((i) => P(...pad[i]))));
  return (deg) => {
    const pts = lid.map(rx(PIV, deg * Math.PI / 180));
    show(P, lidp, pts, [TOP, FRONT]);
  };
}

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
  name: "inkpad",
  means: "A stamp pad tin: the pointer swings its lid open on the back hinge to show the inked pad inside.",
  rules: [1, 3, 5],
  range: [60, 100, 115],
  tour: [[172, 219], [190, 200], [150, 230], null],
  mount,
});
