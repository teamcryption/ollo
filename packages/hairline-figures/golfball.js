/**
 * Ball retriever: a telescoping pole resting on a grip stand, a cup cage holding a golf ball at its tip. The pointer over it slides the inner pole out and tilts the cup up. At rest the inner pole is a little out, bright. The slider is how far.
 */
const { Cam, fit, hull, poly, proj, tdone, tset, tval, tween, disposer, mk, pointer, register } = HL;

const box = (x, y, z, a, b, c) => [[x, y, z], [x + a, y, z], [x, y + b, z], [x + a, y + b, z], [x, y, z + c], [x + a, y, z + c], [x, y + b, z + c], [x + a, y + b, z + c]];
const cyl = (x, y, z, r, h, n = 24) => { const o = []; for (let i = 0; i < n; i++) { const a = (i / n) * 2 * Math.PI; o.push([x + r * Math.cos(a), y + r * Math.sin(a), z], [x + r * Math.cos(a), y + r * Math.sin(a), z + h]); } return o; };
const ball = (x, y, z, r) => { const o = []; for (let j = -3; j <= 3; j++) { const s = Math.sqrt(1 - (j / 3.2) ** 2); o.push(...cyl(x, y, z + (r * j) / 3.2, r * s, 0, 16)); } return o; };
// rotate points about the axis through c along "x", "y" or "z"
const rot = (ps, c, ax, an) => { const co = Math.cos(an), si = Math.sin(an); return ps.map(([x, y, z]) => { const p = [x - c[0], y - c[1], z - c[2]]; const [i, j] = ax === "x" ? [1, 2] : ax === "y" ? [2, 0] : [0, 1]; const a = p[i], b = p[j]; p[i] = a * co - b * si; p[j] = a * si + b * co; return [p[0] + c[0], p[1] + c[1], p[2] + c[2]]; }); };
const mov = (ps, d) => ps.map(([x, y, z]) => [x + d[0], y + d[1], z + d[2]]);

const E = (t) => 20 + 60 * t;
const cup = (t) => rot(cyl(0, 0, 8, 11, 12, 20).concat(ball(0, 0, 18, 7)), [0, 0, 8], "y", 0.9 * t).map(([x, y, z]) => [x + 60 + E(t) + 12, y, z]);
const PARTS = [
  { f: () => box(-6, -10, 0, 22, 20, 8) },
  { f: () => cyl(-40, 0, 6, 0.1, 0, 4).concat(box(-40, -4, 4, 104, 8, 8)) },
  { f: (t) => box(60, -2.5, 5.5, E(t) + 6, 5, 5) },
  { f: cup },
];
const HI = 2, REST = 0.15;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amt = value;
  const C = Cam(45, 0.5, 2.3);
  const ext = [];
  for (const t of [0, 0.5, 1]) for (const p of PARTS) ext.push(...p.f(t));
  fit(C, ext, 200, 160);
  const P = proj(C), g = mk("g", {}, svg);
  const els = PARTS.map((p) => mk("path", { class: p.line ? "nf" : "sil" }, g));
  const bright = els[HI];
  const rest = PARTS.flatMap((p) => p.f(REST).map((q) => P(...q)));
  const xs = rest.map((q) => q[0]), ys = rest.map((q) => q[1]);
  const bb = [Math.min(...xs) - 8, Math.min(...ys) - 8, Math.max(...xs) + 8, Math.max(...ys) + 8];
  const tw = tween(REST);
  let last = NaN;
  function draw(t) {
    if (t === last) return;
    last = t;
    PARTS.forEach((p, i) => { const q = p.f(t).map((v) => P(...v)); els[i].setAttribute("d", p.line ? "M" + q.map((v) => v[0].toFixed(1) + " " + v[1].toFixed(1)).join("L") : poly(hull(q))); });
  }
  const B = register(stage, (_dt, now) => { draw(tval(tw, now)); return !tdone(tw, now); });
  bag.add(B.unregister);
  bright.classList.add("hi");
  let act = null;
  function setActive(a) {
    if (a === act) return;
    act = a;
    tset(tw, a ? amt : REST, performance.now(), 0);
    read.textContent = a ? "reach" : "rest";
    B.wake();
  }
  setActive(false);
  const inside = ([sx, sy]) => sx > bb[0] && sx < bb[2] && sy > bb[1] && sy < bb[3];
  bag.add(pointer(stage, { move: (p) => setActive(inside(p)), leave: () => setActive(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amt = v; if (act) { tset(tw, amt, performance.now(), 0); B.wake(); } }, destroy: bag.dispose };
}

hairline({
  name: "golfball",
  means: "A golf ball retriever: the pointer slides the bright inner pole out and tilts the cup holding the ball.",
  rules: [1, 4, 5, 6],
  range: [0.4, 1, 1],
  tour: [[224, 167], [29, 67], [338, 206], null],
  mount,
});
