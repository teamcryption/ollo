/**
 * Grooming table: a rubber-topped table on a round pedestal, with a tall
 * grooming arm, its post at one end and a boom with a hanging loop. The top
 * turns on its pedestal so the arm swings round to point at the pointer. At
 * rest the arm stands angled across the table, bright. The slider is how
 * quickly it follows.
 *
 * The pattern: a continuous aim (a spring on one angle); the hit is on the
 * floor's plane, which never moves.
 */
const {
  Cam, circ, facing, fit, prism, proj, rings, seg, unproj, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const TZ = 30, REST = 0.45;
const turn = (ring, a) => {
  const c = Math.cos(a), s = Math.sin(a);
  return ring.map((q) => ({ u: q.u * c - q.v * s, v: q.u * s + q.v * c, nu: q.nu * c - q.nv * s, nv: q.nu * s + q.nv * c }));
};
const wrap = (a) => a - Math.PI * 2 * Math.round(a / (Math.PI * 2));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 2.6);
  const ext = [];
  for (let k = 0; k < 8; k++) { const a = (k / 8) * Math.PI * 2; ext.push([40 * Math.cos(a), 40 * Math.sin(a), 0], [40 * Math.cos(a), 40 * Math.sin(a), 84]); }
  fit(C, ext, 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  put(solid(g), prism(P, front, circ(20, 48), circ(18.6, 48), 0, 2));
  put(solid(g), prism(P, front, circ(3.4, 24), null, 2, TZ));
  const TOP = rings(-36, -20, 36, 20, 6, 1.6), POST = rings(-33, -2, -29, 2, 1.6, 0.6), BOOM = rings(-33, -1.6, 2, 1.6, 1.2, 0.5);
  const top = solid(g), arm = mk("g", {}, g), post = solid(arm), boom = solid(arm);
  const loop = mk("path", { class: "nf lo" }, arm);
  const sp = spring(REST, { k: 100 * value, c: 18 * Math.sqrt(value) });
  let drawn = NaN;

  function draw() {
    const a = sp.x;
    if (Math.abs(a - drawn) < 1e-4) return;
    drawn = a;
    put(top, prism(P, front, turn(TOP[0], a), turn(TOP[1], a), TZ, TZ + 3));
    put(post, prism(P, front, turn(POST[0], a), turn(POST[1], a), TZ + 3, TZ + 52));
    put(boom, prism(P, front, turn(BOOM[0], a), turn(BOOM[1], a), TZ + 49, TZ + 52));
    const c = Math.cos(a), s = Math.sin(a), ex = c, ey = s;
    const lp = [];
    for (let i = 0; i <= 16; i++) { const t = (i / 16) * Math.PI * 2; lp[i] = P(ex + 5 * Math.sin(t) * c, ey + 5 * Math.sin(t) * s, TZ + 30 + 5 * Math.cos(t)); }
    loop.setAttribute("d", seg(P(ex, ey, TZ + 49), P(ex, ey, TZ + 35)) + "M" + lp.map((p) => p.join(",")).join("L"));
    // the post is painted after the boom when it stands nearer the viewer
    const postNear = -(c + s) > 0;
    if (postNear) boom.g.after(post.g); else post.g.after(boom.g);
  }

  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(); return m; });
  bag.add(B.unregister);
  top.sil.classList.add("hi");
  boom.sil.classList.add("hi");

  function aim(p) {
    if (!p) { sp.t = sp.t + wrap(REST - sp.t); read.textContent = "rest"; B.wake(); return; }
    const [x, y] = unproj(C, p[0], p[1], 0), r = Math.hypot(x, y);
    if (r > 70) return aim(null);
    if (r > 6) sp.t = sp.t + wrap(Math.atan2(y, x) + Math.PI - sp.t);
    read.textContent = Math.round(((sp.t * 180) / Math.PI + 720) % 360) + "°";
    B.wake();
  }
  bag.add(pointer(stage, { move: aim, leave: () => aim(null) }));
  bag.add(() => svg.replaceChildren());
  aim(null);
  return { set: (v) => { sp.k = 100 * v; sp.c = 18 * Math.sqrt(v); }, destroy: bag.dispose };
}

hairline({
  name: "groomtable",
  means: "A grooming table on a pedestal: the top turns so its tall arm swings round to point at the pointer.",
  rules: [1, 3, 5, 8],
  range: [0.5, 1, 1.6],
  tour: [[75, 261], [347, 261], [53, 261], null],
  mount,
});
