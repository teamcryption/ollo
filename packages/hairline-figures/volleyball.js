/**
 * Volleyball net: a beach court with a net strung between two posts and a
 * ball hanging over it. The pointer picks a panel of the net by where it
 * stands: the ball floats over that panel, and the net bows back from it,
 * the bow spreading outward, staggered. At rest the ball hangs over the
 * second panel, bright, and the net sags unevenly. The slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, circ, fit, facing, hull, poly, prism, proj, rings, ringAt, spring, stepS, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid, open, seg,
} = HL;

const N = 5, X0 = 6, X1 = 114, W = (X1 - X0) / N, NZ0 = 16, NZ1 = 34, R = 6, FAV = 1;
const REST = [0, 1.5, 3, 2, 1, 0];
const disc = (x, y, r, n = 28) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.3);
  fit(C, [[-4, -34, 0], [124, 34, 0], [124, -34, 0], [-4, 34, 0], [X0, 0, 62], [X1, 0, 62], [X0, 0, 40], [X1, 0, 40]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [cr, ci] = rings(-4, -34, 124, 34, 4, 2);
  put(solid(g), prism(P, front, cr, ci, 0, 3));
  // the court line under the net
  mk("path", { d: open([P(-2, 0, 3), P(122, 0, 3)]), class: "dash" }, g);
  const shadow = mk("ellipse", { class: "dot off", rx: 6, ry: 3 }, g);
  for (const x of [X0 - 2, X1 + 2]) {
    const [pr, pi] = rings(x - 1.6, -1.6, x + 1.6, 1.6, 0.6, 0.5);
    put(solid(g), prism(P, front, pr, pi, 3, NZ1 + 3));
  }
  const panels = [];
  for (let k = 0; k < N; k++) {
    const plate = mk("path", {}, g), mesh = mk("path", { class: "nf lo" }, g), tape = mk("path", { class: "nf sil" }, g);
    panels.push({ plate, mesh, tape });
  }
  const bow = REST.map((d) => tween(d));
  const ball = mk("path", { class: "sil" }, g), seams = mk("path", { class: "nf lo" }, g);
  const bx = spring(X0 + W * (FAV + 0.5)), bz = spring(48);
  let lastKey = "";

  function draw(now) {
    const d = bow.map((t) => tval(t, now));
    const key = d.map((v) => v.toFixed(2)).join() + bx.x.toFixed(2) + bz.x.toFixed(2);
    if (key === lastKey) return;
    lastKey = key;
    panels.forEach((p, k) => {
      const xa = X0 + k * W, xb = xa + W, ya = d[k], yb = d[k + 1];
      p.plate.setAttribute("d", poly([P(xa, ya, NZ0), P(xb, yb, NZ0), P(xb, yb, NZ1), P(xa, ya, NZ1)]));
      let m = "";
      for (let i = 1; i < 4; i++) { const t = i / 4, x = xa + W * t, y = ya + (yb - ya) * t; m += seg(P(x, y, NZ0), P(x, y, NZ1 - 3)); }
      for (let j = 1; j < 3; j++) { const z = NZ0 + (NZ1 - 3 - NZ0) * j / 3; m += seg(P(xa, ya, z), P(xb, yb, z)); }
      p.mesh.setAttribute("d", m);
      p.tape.setAttribute("d", poly([P(xa, ya, NZ1 - 3), P(xb, yb, NZ1 - 3), P(xb, yb, NZ1), P(xa, ya, NZ1)]));
    });
    const pts = [];
    for (let i = -3; i <= 3; i++) { const t = (i / 3) * (Math.PI / 2); pts.push(...ringAt(P, disc(bx.x, 0, R * Math.cos(t) + 0.01), bz.x + R * Math.sin(t))); }
    ball.setAttribute("d", poly(hull(pts)));
    seams.setAttribute("d", open(ringAt(P, disc(bx.x, 0, R * 0.98, 20), bz.x).slice(0, 11)) + seg(P(bx.x, 0, bz.x - R * 0.9), P(bx.x, 0, bz.x + R * 0.9)));
    const s = P(bx.x, 0, 3);
    shadow.setAttribute("cx", s[0]); shadow.setAttribute("cy", s[1]);
  }

  const B = register(stage, (dt, now) => {
    const m1 = stepS(bx, dt), m2 = stepS(bz, dt);
    draw(now);
    return m1 || m2 || bow.some((t) => !tdone(t, now));
  });
  bag.add(B.unregister);

  const mids = panels.map((_, k) => P(X0 + W * (k + 0.5), 0, (NZ0 + NZ1) / 2));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 32 && Math.abs(mids[best][1] - sy) < 70 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    bow.forEach((t, j) => {
      const dd = Math.abs(j - (a + 0.5)), v = a < 0 ? REST[j] : j === 0 || j === N ? 0 : Math.max(1, 7 - dd * 3.5);
      tset(t, v, now, from < 0 ? 0 : Math.abs(j - (from + 0.5)) * stag);
    });
    bx.t = X0 + W * ((a < 0 ? FAV : a) + 0.5);
    bz.t = a < 0 ? 48 : 54;
    ball.classList.toggle("hi", a < 0);
    panels.forEach((p, k) => p.tape.classList.toggle("hi", k === a));
    read.textContent = a < 0 ? "rest" : "panel " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "volleyball",
  means: "A beach volleyball net between two posts: the ball floats over the panel under the pointer, and the net bows back from it.",
  rules: [1, 2, 5, 6],
  range: [0, 40, 80],
  tour: [[235, 180], [130, 127], [270, 197], null],
  mount,
});
