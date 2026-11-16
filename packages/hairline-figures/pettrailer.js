/**
 * Pet gate: a barred gate between two posts on a sill. The pointer over it
 * swings the gate open on its hinge; at rest it stands a little ajar, bright.
 * The slider is how far it swings.
 */
const { Cam, fit, facing, hull, poly, prism, proj, rings, seg, spring, stepS, rad, mk, solid, put, register, pointer, disposer } = HL;
const W = 60, H = 50, T = 3, PW = 6;
function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let max = value;
  const C = Cam(45, 0.5, 2.9);
  fit(C, [[-PW, -PW, 0], [W + PW, PW, H + 6], [0, W, H], [-PW, W, 0], [W + PW, -PW, 0]], 200, 160);
  const P = proj(C), front = facing(C), g = mk("g", {}, svg);
  const post = (x) => { const [r, i] = rings(x - PW / 2, -PW / 2, x + PW / 2, PW / 2, 1.5, 0.8); put(solid(g), prism(P, front, r, i, 0, H + 6)); };
  const [sr, si] = rings(-PW, -2, W + PW, 2, 1, 0.6);
  put(solid(g), prism(P, front, sr, si, 0, 2));
  post(W + PW / 2);
  post(-PW / 2);
  const sil = mk("path", { class: "sil" }, g), bars = mk("path", { class: "nf" }, g);
  const REST = 18, a = spring(REST);
  function draw(deg) {
    const c = Math.cos(rad(deg)), s = Math.sin(rad(deg));
    const at = (u, z, d = 0) => P(u * c - d * s, u * s + d * c, z);
    const pts = [];
    for (const u of [0, W]) for (const z of [3, H]) for (const d of [-T / 2, T / 2]) pts.push(at(u, z, d));
    sil.setAttribute("d", poly(hull(pts)));
    let d = "";
    for (let k = 1; k < 8; k++) d += seg(at((k * W) / 8, 8, T / 2), at((k * W) / 8, H - 5, T / 2));
    d += seg(at(2, 8, T / 2), at(W - 2, 8, T / 2)) + seg(at(2, H - 5, T / 2), at(W - 2, H - 5, T / 2));
    bars.setAttribute("d", d);
  }
  draw(REST);
  const B = register(stage, (dt) => { const m = stepS(a, dt); draw(a.x); return m; });
  bag.add(B.unregister);
  const lo = P(0, 0, 0), hi = P(W, W, H);
  const box = [Math.min(lo[0], hi[0]) - 20, Math.max(lo[0], P(W, 0, 0)[0]) + 20];
  let on = null;
  function set(v) {
    if (v === on) return; on = v;
    a.t = v ? max : REST;
    sil.classList.toggle("hi", true);
    read.textContent = v ? "open" : "rest";
    B.wake();
  }
  set(false);
  bag.add(pointer(stage, { move: ([x, y]) => set(x > box[0] && x < box[1] && y > 40 && y < 290), leave: () => set(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { max = v; if (on) { a.t = v; B.wake(); } }, destroy: bag.dispose };
}
hairline({
  name: "pettrailer",
  means: "A barred pet gate between two posts: the pointer swings it open on its hinge, and it rests a little ajar.",
  rules: [1, 3, 4, 5],
  range: [40, 75, 100],
  tour: [[239, 76], [200, 150], [300, 110], null],
  mount,
});
