/**
 * Shooting stick: a walking stick with a spike and a ground disc at its
 * foot, and at its head a handle of two leaves. The pointer over the stick
 * opens the leaves out flat into a seat, staggered one after the other. At
 * rest they hang slightly apart, the near leaf bright. The slider is the stagger.
 */
const {
  Cam, circ, fillet, fit, facing, hull, poly, prism, proj, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const TOP = 92, W = 20, D = 30, REST = 0.5, OPEN = Math.PI / 2;
const disc = (r, z, n = 32) => circ(r, n);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.95);
  fit(C, [[-D - 2, -W, TOP + 3], [D + 2, W, TOP + 3], [0, 0, 0], [-D, 0, TOP - D], [14, 14, 0], [-14, -14, 0]], 200, 164);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  put(solid(g), prism(P, front, circ(12, 40), circ(10.5, 40), 10, 12));
  mk("path", { class: "nf", d: poly(hull([P(-1.2, 0, 10), P(1.2, 0, 10), P(0, 0, 0)])) }, g);
  const far = mk("path", { class: "sil" }, g);
  put(solid(g), prism(P, front, circ(2.4, 20), null, 12, TOP));
  put(solid(g), prism(P, front, circ(3.6, 20), circ(2.4, 20), TOP - 4, TOP));
  const near = mk("path", { class: "sil" }, g);
  const leaves = [{ s: -1, el: far, t: tween(REST), last: NaN }, { s: 1, el: near, t: tween(REST), last: NaN }];
  const shape = fillet([[0, -W / 2], [D, -W], [D, W], [0, W / 2]], [2, 9, 9, 2], 4);
  function draw(L, f) {
    if (f === L.last) return;
    L.last = f;
    const pts = [];
    for (const off of [0, 2.2]) for (const [d, w] of shape) pts.push(P(L.s * (d * Math.sin(f) + off * Math.cos(f)), w, TOP - d * Math.cos(f) + off * Math.sin(f)));
    L.el.setAttribute("d", poly(hull(pts)));
  }
  const B = register(stage, (_dt, now) => { let m = false; for (const L of leaves) { draw(L, tval(L.t, now)); if (!tdone(L.t, now)) m = true; } return m; });
  bag.add(B.unregister);

  const a = P(0, 0, TOP + 4), b = P(0, 0, 0);
  const hit = ([sx, sy]) => Math.abs(sx - a[0]) < 60 && sy > a[1] - 30 && sy < b[1] + 10;
  let on = null;
  function set(o) {
    if (o === on) return;
    on = o;
    const now = performance.now();
    leaves.forEach((L, i) => tset(L.t, o ? OPEN : REST, now, (o ? i : 1 - i) * stag));
    near.classList.add("hi");
    read.textContent = o ? "seat" : "rest";
    B.wake();
  }
  set(false);
  bag.add(pointer(stage, { move: (p) => set(hit(p)), leave: () => set(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "walkingstick",
  means: "A shooting stick: the pointer over it opens the two leaves of its handle out flat into a seat, one after the other.",
  rules: [1, 2, 5, 8],
  range: [0, 60, 120],
  tour: [[219, 247], [219, 145], [219, 95], null],
  mount,
});
