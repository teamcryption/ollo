/**
 * Tennis net crank: a net strung between two posts, a winder crank on the
 * near post. The pointer over the net turns the crank and the net draws taut,
 * the cord rising from the crank outward, staggered by distance. At rest the
 * net sags and the crank is bright. The slider is the stagger.
 */
const {
  Cam, circ, fit, facing, open, prism, proj, seg, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const L = 130, H = 34, M = 12, SAG = 14, TIGHT = 1, AR = 8;
const disc = (x, y, r, n = 20) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.05);
  fit(C, [[-4, -4, 0], [L + 12, 4, 0], [0, 0, H + 4], [L, 0, H + 4], [L + 6, 0, H + AR], [L + 6, 0, H - 2 * AR]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  put(solid(g), prism(P, front, disc(0, 0, 4, 24), disc(0, 0, 3, 24), 0, 1.5));
  put(solid(g), prism(P, front, disc(0, 0, 2, 16), null, 1.5, H + 2));
  const mesh = mk("path", { class: "nf lo" }, g), band = mk("path", { class: "nf sil" }, g);
  put(solid(g), prism(P, front, disc(L, 0, 4, 24), disc(L, 0, 3, 24), 0, 1.5));
  put(solid(g), prism(P, front, disc(L, 0, 2, 16), null, 1.5, H + 2));
  const drum = solid(g);
  put(drum, prism(P, front, disc(L + 3.5, 0, 3, 20), disc(L + 3.5, 0, 2, 20), H - 9, H - 3));
  const crank = mk("path", { class: "nf sil" }, g);
  const knob = mk("ellipse", { class: "dot m", rx: 2.2, ry: 1.6 }, g);

  const tw = [];
  for (let i = 0; i <= M; i++) tw.push(tween(SAG));
  let last = "";
  function top(i, s) { const f = (2 * i) / M - 1; return H - s * (1 - f * f); }
  function draw(now) {
    const s = tw.map((t) => tval(t, now)), key = s.map((v) => v.toFixed(2)).join();
    if (key === last) return;
    last = key;
    const xs = s.map((_, i) => (i * L) / M), hs = s.map((v, i) => top(i, v));
    let d = "";
    for (let i = 1; i < M; i++) d += seg(P(xs[i], 0, 2), P(xs[i], 0, hs[i]));
    for (const f of [0.06, 0.3, 0.55, 0.78]) d += open(xs.map((x, i) => P(x, 0, Math.max(2, f * hs[i]))));
    mesh.setAttribute("d", d);
    band.setAttribute("d", open(xs.map((x, i) => P(x, 0, hs[i]))) + open(xs.map((x, i) => P(x, 0, hs[i] - 2.5))));
    const a = ((SAG - s[M]) / (SAG - TIGHT)) * Math.PI * 2.4 + 0.6, cz = H - 6;
    const tip = [L + 8, AR * Math.cos(a), cz + AR * Math.sin(a)];
    crank.setAttribute("d", seg(P(L + 3.5, 0, cz), P(L + 8, 0, cz)) + seg(P(L + 8, 0, cz), P(...tip)) + seg(P(...tip), P(tip[0] + 5, tip[1], tip[2])));
    const k = P(tip[0] + 5, tip[1], tip[2]);
    knob.setAttribute("cx", k[0]); knob.setAttribute("cy", k[1]);
  }

  const B = register(stage, (_dt, now) => { draw(now); return tw.some((t) => !tdone(t, now)); });
  bag.add(B.unregister);

  const pts = [P(0, 0, 0), P(L, 0, 0), P(0, 0, H), P(L, 0, H)];
  const x0 = Math.min(...pts.map((p) => p[0])) - 8, x1 = Math.max(...pts.map((p) => p[0])) + 14;
  const y0 = Math.min(...pts.map((p) => p[1])) - 10, y1 = Math.max(...pts.map((p) => p[1])) + 8;
  let on = null;
  function set(v) {
    if (v === on) return;
    on = v;
    const now = performance.now();
    tw.forEach((t, i) => tset(t, v ? TIGHT : SAG, now, (M - i) * stag));
    crank.classList.toggle("hi", !v);
    band.classList.toggle("hi", v);
    read.textContent = v ? "taut" : "rest";
    B.wake();
  }
  set(false);
  bag.add(pointer(stage, {
    move: ([sx, sy]) => set(sx > x0 && sx < x1 && sy > y0 && sy < y1),
    leave: () => set(false),
  }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "tennisnet",
  means: "A tennis net between two posts: the pointer turns the winder crank and the sagging net draws taut, cord rising from the crank out.",
  rules: [1, 2, 5, 8],
  range: [0, 30, 60],
  tour: [[194, 141], [140, 116], [250, 186], null],
  mount,
});
