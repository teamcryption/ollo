/**
 * Cherry pitter: a stand with two posts and a crossbar guide, a cup holding a
 * cherry, and a plunger with a broad cap through the guide. The pointer over
 * the stand presses the plunger down into the cherry; at rest the cap is
 * bright. The hit is a fixed screen box, so it never moves with the drawing.
 */
const {
  Cam, circ, fit, facing, hull, poly, prism, proj, rings, ringAt, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const disc = (x, y, r, n = 36) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));
const id = (x, y, z) => [x, y, z];
const corners = (P, c, f) => { const o = []; for (const x of [c[0], c[1]]) for (const y of [c[2], c[3]]) for (const z of [c[4], c[5]]) { const w = f(x, y, z); o.push(P(w[0], w[1], w[2])); } return o; };
const box = (P, c, f = id) => poly(hull(corners(P, c, f)));
const lid = (P, c, f = id) => poly([[c[0], c[2]], [c[1], c[2]], [c[1], c[3]], [c[0], c[3]]].map(([x, y]) => { const w = f(x, y, c[5]); return P(w[0], w[1], w[2]); }));
const ball = (P, x, y, z, r) => { const o = []; for (let i = -5; i <= 5; i++) { const a = (i / 5) * (Math.PI / 2); o.push(...ringAt(P, disc(x, y, r * Math.cos(a), 24), z + r * Math.sin(a))); } return poly(hull(o)); };
function slab(g, P, c) { mk("path", { class: "sil", d: box(P, c) }, g); mk("path", { class: "nf lo", d: lid(P, c) }, g); }

const REST = 6, PUSH = 20;
function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amt = value;
  const C = Cam(45, 0.5, 2.7);
  fit(C, [[-18, -20, 0], [18, 20, 0], [-18, 20, 0], [18, -20, 0], [0, 0, 84 + REST], [-14, -14, 80 + REST]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [fr, fi] = rings(-18, -20, 18, 20, 6, 2);
  put(solid(g), prism(P, front, fr, fi, 0, 4));
  slab(g, P, [-3, 3, -18, -13, 4, 64]);
  put(solid(g), prism(P, front, disc(0, 0, 13), disc(0, 0, 9), 4, 18));
  mk("path", { class: "nf", d: ball(P, 0, 0, 23, 7) }, g);
  const rod = solid(g);
  slab(g, P, [-3, 3, 13, 18, 4, 64]);
  slab(g, P, [-5, 5, -18, 18, 64, 69]);
  const cap = solid(g), knob = solid(g);
  cap.sil.classList.add("hi");
  const t = tween(0);
  let last = NaN;
  function draw(v) {
    if (v === last) return;
    last = v;
    const d = REST - v * PUSH * amt;
    put(rod, prism(P, front, disc(0, 0, 2, 16), null, 34 + d, 76 + d));
    put(cap, prism(P, front, disc(0, 0, 14), disc(0, 0, 12), 76 + d, 80 + d));
    put(knob, prism(P, front, disc(0, 0, 5, 24), null, 80 + d, 84 + d));
  }
  const B = register(stage, (_dt, now) => { draw(tval(t, now)); return !tdone(t, now); });
  bag.add(B.unregister);
  let on = null;
  function setOn(a) {
    if (a === on) return;
    on = a;
    tset(t, a ? 1 : 0, performance.now(), 0);
    read.textContent = a ? "press" : "rest";
    B.wake();
  }
  setOn(false);
  bag.add(pointer(stage, { move: ([sx, sy]) => setOn(Math.abs(sx - 200) < 125 && Math.abs(sy - 165) < 140), leave: () => setOn(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amt = v; last = NaN; B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "cherrypitter",
  means: "A cherry pitter on its stand: the pointer pushes the plunger down through the guide into the cherry in the cup.",
  rules: [1, 3, 5, 6],
  range: [0.5, 1, 1],
  tour: [[200, 70], [127, 264], [200, 61], null],
  mount,
});
