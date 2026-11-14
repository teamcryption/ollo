/**
 * Guitar stand: three guitars resting on a rack, their necks leaned back on a
 * padded rail. The guitar under the pointer stands up off the rail and turns
 * to face the reader; its neighbours swing a little out of its way, the
 * motion spreading from it. At rest they lean at slightly different angles,
 * the middle one bright.
 *
 * The pattern: a discrete choice (a tween per guitar, staggered by distance);
 * the hit is each guitar's rest centre on screen, which never moves.
 */
const {
  Cam, facing, fit, fillet, poly, prism, proj, rings, seg, tween, tset, tval, tdone, rad,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 3, GAP = 34, LEAN = [17, 21, 15], TURN = [-8, 4, 12], FAV = 1, YB = 6, RAIL = -24;
const half = (w) => {
  if (w < 43) { const a = 169 - (w - 13) ** 2, b = 100 - (w - 33) ** 2; return Math.max(Math.sqrt(Math.max(a, 0)), Math.sqrt(Math.max(b, 0)), 0.8); }
  return w < 80 ? 1.7 : 3.2;
};
const PROF = (() => {
  const ws = [];
  for (let w = 0; w <= 43; w += 1.5) ws.push(w);
  ws.push(43.01, 80, 80.01, 90);
  const r = ws.map((w) => [half(w), w]), l = ws.slice().reverse().map((w) => [-half(w), w]);
  return r.concat(l);
})();

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 2.0);
  const ext = [[-20, YB + 16, 0], [GAP * (N - 1) + 20, YB + 16, 0], [-20, RAIL - 4, 0], [GAP * (N - 1) + 20, RAIL - 4, 92], [-14, YB, 94], [GAP * (N - 1) + 14, YB, 94]];
  fit(C, ext, 200, 172);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const X1 = GAP * (N - 1);
  // the rack: two uprights, the back rail, the base bar the guitars stand in
  for (const x of [-16, X1 + 16]) put(solid(g), prism(P, front, rings(x - 2, RAIL - 2, x + 2, RAIL + 2, 1, 0.6)[0], null, 0, 72));
  put(solid(g), prism(P, front, rings(-18, RAIL - 3, X1 + 18, RAIL + 3, 2.5, 1)[0], rings(-18, RAIL - 3, X1 + 18, RAIL + 3, 2.5, 1)[1], 70, 75));
  for (const x of [-16, X1 + 16]) put(solid(g), prism(P, front, rings(x - 3, RAIL - 2, x + 3, YB + 12, 1.5, 0.8)[0], null, 0, 2.5));
  const [br, bi] = rings(-18, YB - 6, X1 + 18, YB + 8, 3, 1.2);
  put(solid(g), prism(P, front, br, bi, 2.5, 7));

  const gs = [];
  for (let i = 0; i < N; i++) {
    const grp = mk("g", {}, g);
    gs.push({ i, x: i * GAP, back: mk("path", { class: "lo", d: "" }, grp), body: solid(grp), hole: mk("path", { class: "lo nf", d: "" }, grp), str: mk("path", { class: "lo nf", d: "" }, grp), th: tween(rad(LEAN[i])), tp: tween(rad(TURN[i])), drawn: "" });
  }
  function draw(gt, now) {
    const th = tval(gt.th, now), ph = tval(gt.tp, now), key = th.toFixed(4) + ph.toFixed(4);
    if (key === gt.drawn) return;
    gt.drawn = key;
    const U = [Math.cos(ph), Math.sin(ph), 0], n = [-Math.sin(ph), Math.cos(ph), 0];
    const Wd = [-n[0] * Math.sin(th), -n[1] * Math.sin(th), Math.cos(th)];
    const at = (u, w, o) => P(gt.x + U[0] * u + Wd[0] * w + n[0] * o, YB + U[1] * u + Wd[1] * w + n[1] * o, 5 + Wd[2] * w);
    const sm = (pts) => poly(fillet(pts, pts.map(() => 0.7), 2));
    gt.back.setAttribute("d", sm(PROF.map(([u, w]) => at(u, w, -2.2))));
    gt.body.sil.setAttribute("d", sm(PROF.map(([u, w]) => at(u, w, 2.2))));
    const hole = [];
    for (let k = 0; k < 20; k++) { const a = (k / 20) * Math.PI * 2; hole.push(at(4.2 * Math.cos(a), 26 + 4.2 * Math.sin(a), 2.2)); }
    gt.hole.setAttribute("d", poly(hole));
    gt.str.setAttribute("d", seg(at(-1, 8, 2.4), at(-1, 85, 2.4)) + seg(at(1, 8, 2.4), at(1, 85, 2.4)) + seg(at(-4, 8, 2.2), at(4, 8, 2.2)));
  }

  let amp = value;
  const B = register(stage, (dt, now) => {
    let m = false;
    for (const gt of gs) { draw(gt, now); if (!tdone(gt.th, now) || !tdone(gt.tp, now)) m = true; }
    return m;
  });
  bag.add(B.unregister);
  const cx = gs.map((gt) => P(gt.x, YB - 14, 40)[0]);

  function choose(a) {
    const now = performance.now();
    for (const gt of gs) {
      const d = a < 0 ? 0 : Math.abs(gt.i - a), delay = d * 45;
      if (a < 0) { tset(gt.th, rad(LEAN[gt.i]), now, 0); tset(gt.tp, rad(TURN[gt.i]), now, 0); }
      else if (gt.i === a) { tset(gt.th, rad(1), now, 0); tset(gt.tp, rad(-40 * amp), now, 0); }
      else { tset(gt.th, rad(LEAN[gt.i] + 5), now, delay); tset(gt.tp, rad(TURN[gt.i] + (gt.i < a ? -16 : 16)), now, delay); }
      gt.body.sil.classList.toggle("hi", a < 0 ? gt.i === FAV : gt.i === a);
    }
    read.textContent = a < 0 ? "rest" : "guitar " + (a + 1);
    B.wake();
  }
  bag.add(pointer(stage, {
    move: (p) => {
      let a = -1, bd = 26;
      cx.forEach((x, i) => { const d = Math.abs(p[0] - x); if (d < bd) { bd = d; a = i; } });
      if (p[1] < 20 || p[1] > 300) a = -1;
      choose(a);
    },
    leave: () => choose(-1),
  }));
  bag.add(() => svg.replaceChildren());
  choose(-1);
  return { set: (v) => { amp = v; }, destroy: bag.dispose };
}

hairline({
  name: "tapestand",
  means: "Three guitars on a stand: the one under the pointer stands up and turns to face you, its neighbours swinging aside.",
  rules: [1, 2, 4, 5],
  range: [0.5, 1, 1.4],
  tour: [[162, 141], [210, 165], [258, 189], null],
  mount,
});
