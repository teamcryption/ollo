/**
 * X-ray lightbox: a wall lightbox, a shallow rounded case, with four film
 * sheets clipped along its face. The pointer picks a film by where it is
 * along the box: that film slides up out of its clip and the panel behind it
 * shows, bright, while its neighbours slide a little after it. At rest the
 * films hang at uneven heights, one panel showing, bright. The slider is the
 * stagger.
 *
 * The pattern: one of many in a single row (riffle); the hit is each film's
 * rest centre on screen, which never moves.
 */
const {
  Cam, facing, fillet, fit, poly, prism, proj, rings, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 4, W = 22, GAP = 6, X0 = 7, D = 6, ZB = 4, ZT = 66, FZ = 13, FH = 44, LIFT = 26, BUMP = 6;
const X1 = X0 + N * W + (N - 1) * GAP + 7;
const REST = [3, 0, 9, 1], FAV = 2;
const fx = (k) => X0 + k * (W + GAP);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.15);
  fit(C, [[0, 0, ZB], [X1, 0, ZB], [0, D + 3, ZB], [X1, D + 3, ZB], [0, 0, FZ + FH + LIFT], [X1, D + 3, FZ + FH + LIFT]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  // a flat rounded rectangle on a face of constant y
  const face = (y, x0, z0, x1, z1, r) => poly(fillet([[x0, z0], [x1, z0], [x1, z1], [x0, z1]], [r, r, r, r], 4).map(([x, z]) => P(x, y, z)));

  // the case, its glass panel's edge, and the cells the films cover
  const [r0, i0] = rings(0, 0, X1, D, 4, 1.4);
  put(solid(g), prism(P, front, r0, i0, ZB, ZT));
  mk("path", { class: "nf lo", d: face(D, 3, ZB + 4, X1 - 3, ZT - 4, 2.5) }, g);
  const films = [];
  for (let k = 0; k < N; k++) {
    const cell = mk("path", { class: "nf lo", d: face(D, fx(k) - 1.2, FZ - 1.5, fx(k) + W + 1.2, ZT - 6, 1.5) }, g);
    films.push({ k, x: fx(k), cell, z: tween(REST[k]), last: NaN });
  }
  for (const f of films) {
    f.s = solid(g);
    f.img = mk("path", { class: "nf lo" }, f.s.g);
  }
  // the clips that hold each film along the top
  for (const f of films) {
    const [rc, ic] = rings(f.x + W / 2 - 4, D + 1.3, f.x + W / 2 + 4, D + 3.4, 0.9, 0.4);
    put(solid(g), prism(P, front, rc, ic, ZT - 11, ZT - 6));
  }

  function draw(f, lift) {
    if (lift === f.last) return;
    f.last = lift;
    const z0 = FZ + lift, z1 = z0 + FH;
    const [rf, inf] = rings(f.x, D + 0.3, f.x + W, D + 1.3, 1.2, 0.3);
    put(f.s, prism(P, front, rf, inf, z0, z1));
    f.img.setAttribute("d", face(D + 1.3, f.x + 3, z0 + 4, f.x + W - 3, z1 - 9, 3));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    films.forEach((f) => { draw(f, tval(f.z, now)); if (!tdone(f.z, now)) moving = true; });
    return moving;
  });
  bag.add(B.unregister);

  // the hit: each film's rest centre on screen; the nearest along x, inside the case's height
  const cx = films.map((f) => P(f.x + W / 2, D, (FZ + ZT) / 2));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    films.forEach((f, k) => {
      const top = P(f.x + W / 2, D, ZT + 6)[1], bot = P(f.x + W / 2, D, ZB - 4)[1], d = Math.abs(sx - cx[k][0]);
      if (sy > top && sy < bot && d < bd) { bd = d; best = k; }
    });
    return bd < 30 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    films.forEach((f, k) => {
      const z = a < 0 ? REST[k] : k === a ? LIFT : Math.max(1, BUMP - 2 * Math.abs(k - a));
      tset(f.z, z, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      const on = k === (a < 0 ? FAV : a);
      f.s.sil.classList.toggle("hi", on);
      f.cell.setAttribute("class", on ? "nf hi" : "nf lo");
    });
    read.textContent = a < 0 ? "rest" : "film " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "xraybox",
  means: "An X-ray lightbox: the film under the pointer slides up out of its clip and its panel lights, the others slide a little after.",
  rules: [1, 2, 4, 5],
  range: [0, 45, 90],
  tour: [[132, 142], [175, 164], [218, 185], null],
  mount,
});
