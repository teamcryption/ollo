/**
 * Scaffolding: a three-level scaffold, four standards on base plates, ledgers
 * and braces along the back and sides, a plank laid at every level. The plank
 * on the level nearest the pointer slides out toward the reader and lifts,
 * and the planks beside it ease out a little, staggered. At rest the middle
 * plank sits half out, bright. The slider is the stagger.
 *
 * The pattern: stepped parts at different heights; the hit unprojects onto
 * each plank's own rest top and takes the one nearest its middle.
 */
const { Cam, circ, facing, fit, prism, proj, rings, seg, unproj, tdone, tset, tval, tween, disposer, flatDot, mk, place, pointer, put, register, solid } = HL;

const X = 60, Y = 24, H = 26, L = 3, OUT = 16, FAV = 1;
const post = (x, y) => circ(1.4, 12).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.55);
  fit(C, [[0, 0, 0], [X, 0, 0], [0, Y + OUT, H], [X, Y + OUT, 0], [0, 0, H * L + 8], [X, Y, H * L + 8]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const TOP = H * L + 8;
  for (const [x, y] of [[0, 0], [X, 0], [0, Y], [X, Y]]) place(flatDot(g, C, 1.4, "dot off"), P(x, y, 0));
  let back = "";
  for (let l = 0; l <= L; l++) { const z = l * H + (l === L ? 8 : 2); back += seg(P(0, 0, z), P(X, 0, z)) + seg(P(0, 0, z), P(0, Y, z)) + seg(P(X, 0, z), P(X, Y, z)); }
  for (let l = 0; l < L; l++) { const z0 = l * H + 2, z1 = (l + 1) * H; back += l % 2 ? seg(P(0, 0, z0), P(X, 0, z1)) : seg(P(X, 0, z0), P(0, 0, z1)); }
  const stand = (x, y) => put(solid(g), prism(P, front, post(x, y), null, 0, TOP));
  stand(0, 0); stand(X, 0);
  mk("path", { class: "nf lo", d: back }, g);
  stand(0, Y);
  const planks = [];
  for (let l = 0; l < L; l++) {
    const el = solid(g), z = (l + 1) * H;
    planks.push({ l, z, el, y: tween(l === FAV ? 6 : 0), last: "" });
  }
  stand(X, Y);
  mk("path", { class: "nf lo", d: [1, 2, 3].map((l) => seg(P(X, Y, l * H + 6), P(0, Y, l * H + 6))).join("") }, g);

  function draw(p, y) {
    const key = y.toFixed(2);
    if (key === p.last) return;
    p.last = key;
    const [r, i] = rings(3, 2 + y, X - 3, Y - 2 + y, 1.2, 0.8);
    put(p.el, prism(P, front, r, i, p.z, p.z + 2.4));
  }
  const B = register(stage, (_dt, now) => {
    let m = false;
    for (const p of planks) { draw(p, tval(p.y, now)); if (!tdone(p.y, now)) m = true; }
    return m;
  });
  bag.add(B.unregister);

  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    for (const p of planks) { const [x, y] = unproj(C, sx, sy, p.z); const d = Math.hypot(x - X / 2, (y - Y / 2) * 1.6); if (d < bd) { bd = d; best = p.l; } }
    return bd < 48 ? best : -1;
  }
  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    for (const p of planks) {
      const d = Math.abs(p.l - a), y = a < 0 ? (p.l === FAV ? 6 : 0) : d === 0 ? OUT : d === 1 ? 3 : 0;
      tset(p.y, y, now, from < 0 ? 0 : Math.abs(p.l - from) * stag);
      p.el.sil.classList.toggle("hi", p.l === (a < 0 ? FAV : a));
    }
    read.textContent = a < 0 ? "rest" : "level " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "scaffolding",
  means: "A three-level scaffold: the plank on the level nearest the pointer slides out toward you, its neighbours ease out in turn.",
  rules: [1, 2, 5, 8],
  range: [0, 40, 80],
  tour: [[214, 196], [214, 139], [214, 81], null],
  mount,
});
