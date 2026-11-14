/**
 * Crash cart: a rolling emergency cabinet on four casters, a lipped tray on
 * top and a stack of five drawers on its front. The pointer picks a drawer by
 * where it lands on the front face: that drawer slides right out, the others
 * ease out a little after it, staggered from it. At rest the drawers sit
 * unevenly ajar, the top one bright. The slider is the stagger.
 *
 * The pattern: one of many in a stack; the hit is on the fixed front plane.
 */
const {
  Cam, clamp, facing, fit, prism, proj, rings, seg, tdone, tset, tval, tween,
  disposer, flatDot, mk, place, pointer, put, register, solid,
} = HL;

const N = 5, X0 = 0, X1 = 30, Y0 = 0, Y1 = 22, ZB = 7, DH = 8.6, ZT = ZB + N * DH + 1, OUT = 15, BUMP = 4;
const REST = [2.5, 0.5, 1.5, 0, 1], FAV = 4;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 4.0);
  fit(C, [[X0 - 2, Y0 - 2, 0], [X1 + 2, Y1 + OUT, 0], [X1 + 2, Y0, ZT + 4], [X0, Y1 + OUT, ZT + 4], [X1 + 2, Y1 + 2, 0], [X0 - 2, Y1 + OUT, ZB]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  // casters: a dot under each corner, posts up to the body
  const posts = [];
  const casters = [[X0 + 3, Y0 + 3], [X1 - 3, Y0 + 3], [X0 + 3, Y1 - 3], [X1 - 3, Y1 - 3]];
  casters.forEach(([x, y]) => { posts.push(seg(P(x, y, 1.5), P(x, y, ZB))); });
  mk("path", { class: "nf lo", d: posts.join("") }, g);
  casters.forEach(([x, y]) => place(flatDot(g, C, 1.6, "dot off"), P(x, y, 0)));

  // the body and its tray on top
  const body = solid(g);
  { const [r, i] = rings(X0, Y0, X1, Y1, 3, 1.2); put(body, prism(P, front, r, i, ZB, ZT)); }
  const tray = solid(g);
  { const [r, i] = rings(X0 - 2, Y0 - 2, X1 + 2, Y1 + 2, 4, 1.6); put(tray, prism(P, front, r, i, ZT, ZT + 3)); }
  // side handle on the +x end
  mk("path", { class: "nf lo", d: seg(P(X1 + 0.5, Y0 + 5, ZT - 6), P(X1 + 0.5, Y1 - 5, ZT - 6)) }, g);

  // drawers, painted bottom to top so a pulled upper drawer covers the one below
  const drawers = [];
  for (let k = 0; k < N; k++) {
    const s = solid(g), z0 = ZB + 1 + k * DH, z1 = z0 + DH - 1.4;
    const pull = mk("path", { class: "nf lo" }, s.g);
    drawers.push({ k, s, pull, z0, z1, o: tween(REST[k]), last: NaN });
  }
  function draw(d, o) {
    if (o === d.last) return;
    d.last = o;
    const [r, i] = rings(X0 + 2, Y1 - 4, X1 - 2, Y1 + 1.2 + o, 1.6, 0.7);
    put(d.s, prism(P, front, r, i, d.z0, d.z1));
    const zm = (d.z0 + d.z1) / 2, yf = Y1 + 1.2 + o;
    d.pull.setAttribute("d", seg(P(X1 / 2 - 6, yf, zm), P(X1 / 2 + 6, yf, zm)));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    drawers.forEach((d) => { draw(d, tval(d.o, now)); if (!tdone(d.o, now)) moving = true; });
    return moving;
  });
  bag.add(B.unregister);

  // the hit: the pointer on the fixed front plane y = Y1, solved for (x, z)
  const o0 = P(0, Y1, 0), ex = P(1, Y1, 0), ez = P(0, Y1, 1);
  const ax = ex[0] - o0[0], ay = ex[1] - o0[1], bx = ez[0] - o0[0], by = ez[1] - o0[1], det = ax * by - ay * bx;
  function hit([sx, sy]) {
    const dx = sx - o0[0], dy = sy - o0[1];
    const x = (dx * by - dy * bx) / det, z = (ax * dy - ay * dx) / det;
    if (x < X0 - 2 || x > X1 + 2 || z < ZB - 2 || z > ZT + 2) return -1;
    return clamp(Math.floor((z - ZB - 1) / DH), 0, N - 1);
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    drawers.forEach((d) => {
      const o = a < 0 ? REST[d.k] : d.k === a ? OUT : Math.max(0, BUMP - 1.5 * Math.abs(d.k - a));
      tset(d.o, o, now, from < 0 ? 0 : Math.abs(d.k - from) * stag);
      d.s.sil.classList.toggle("hi", d.k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "drawer " + (N - a);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "crashcart",
  means: "A crash cart: the drawer under the pointer slides right out, the others ease out a little after it.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[190, 86], [190, 145], [190, 204], null],
  mount,
});
