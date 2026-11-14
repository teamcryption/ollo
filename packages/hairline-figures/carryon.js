/**
 * Cabin bag sizer: the gate's open frame, a tray with a back and a side wall
 * and two posts carrying the top rails, and a cabin suitcase above it. The
 * pointer over the sizer lowers the bag right in, under the rails, and then
 * its handle runs up. At rest the bag stands half in, bright, handle down.
 * The slider is the handle's wait behind the bag.
 *
 * The pattern: one part, two poses (cloches); the hit is the sizer's fixed
 * screen box, which never moves.
 */
const {
  Cam, clamp, facing, fit, prism, proj, rings, seg, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const X1 = 26, Y1 = 16, ZT = 40, BH = 34, UP = 20, IN = 2.5, HUP = 16, HDN = 1.5;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let wait = value;
  const C = Cam(45, 0.5, 4.1);
  fit(C, [[0, 0, 0], [X1, Y1, 0], [X1, 0, 0], [0, Y1, 0], [4, 4, UP + BH + 2], [20, 10, UP + BH + 3]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const box = (x0, y0, x1, y1, z0, z1, r, b, parent) => { const [o, i] = rings(x0, y0, x1, y1, r, b); const s = solid(parent || g); put(s, prism(P, front, o, i, z0, z1)); return s; };

  // the far half of the sizer: tray, back wall, side wall
  box(-1, -1, X1 + 1, Y1 + 1, 0, 2.2, 2.5, 1);
  box(-1, -1, X1 + 1, 0.6, 2.2, ZT, 1.2, 0.5);
  box(-1, 0.6, 0.6, Y1 + 1, 2.2, ZT, 0.8, 0.4);

  // the bag: body, zip line on its near face, handle rods and grip
  const bg = mk("g", {}, g), body = solid(bg), zip = mk("path", { class: "nf lo" }, bg);
  const rods = [solid(bg), solid(bg)], grip = solid(bg);
  const bz = tween(UP), hz = tween(HDN);
  let last = "";
  function draw(z, h) {
    const key = z.toFixed(2) + h.toFixed(2);
    if (key === last) return;
    last = key;
    const [o, i] = rings(2, 2, X1 - 2, Y1 - 2, 4, 1.2), top = z + BH;
    put(body, prism(P, front, o, i, z, top));
    zip.setAttribute("d", seg(P(5, Y1 - 2, z + 4), P(5, Y1 - 2, top - 4)) + seg(P(5, Y1 - 2, top - 4), P(X1 - 5, Y1 - 2, top - 4)));
    [9, X1 - 9].forEach((x, k) => {
      const [ro, ri] = rings(x - 0.7, 7.3, x + 0.7, 8.7, 0.7, 0.3);
      put(rods[k], prism(P, front, ro, ri, top, top + h));
    });
    const [go, gi] = rings(8, 6.8, X1 - 8, 9.2, 1.2, 0.4);
    put(grip, prism(P, front, go, gi, top + h, top + h + 1.8));
  }

  // the near half: posts and top rails, painted over the bag
  box(X1 - 0.6, -1, X1 + 1, 0.6, 2.2, ZT, 0.8, 0.3);
  box(-1, Y1 - 0.6, 0.6, Y1 + 1, 2.2, ZT, 0.8, 0.3);
  box(X1 - 0.6, -1, X1 + 1, Y1 + 1, ZT - 1.6, ZT, 0.8, 0.3);
  box(-1, Y1 - 0.6, X1 + 1, Y1 + 1, ZT - 1.6, ZT, 0.8, 0.3);
  box(X1 - 0.6, Y1 - 0.6, X1 + 1, Y1 + 1, 2.2, ZT, 0.8, 0.3);

  const B = register(stage, (_dt, now) => {
    draw(tval(bz, now), tval(hz, now));
    return !tdone(bz, now) || !tdone(hz, now);
  });
  bag.add(B.unregister);

  // the hit: the sizer's own screen box at rest; nothing in it moves
  const pts = [[-1, -1, 0], [X1 + 1, Y1 + 1, 0], [X1 + 1, -1, 0], [-1, Y1 + 1, 0], [-1, -1, ZT], [X1 + 1, Y1 + 1, ZT], [X1 + 1, -1, ZT], [-1, Y1 + 1, ZT]].map((p) => P(...p));
  const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]);
  const hb = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
  const hit = ([sx, sy]) => sx > hb[0] && sx < hb[1] && sy > hb[2] && sy < hb[3];

  let act = null;
  function setActive(a) {
    if (a === act) return;
    act = a;
    const now = performance.now();
    tset(bz, a ? IN : UP, now, a ? 0 : wait);
    tset(hz, a ? HUP : HDN, now, a ? wait : 0);
    body.sil.classList.toggle("hi", true);
    read.textContent = a ? "fits" : "rest";
    B.wake();
  }
  setActive(false);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { wait = clamp(v, 0, 400); }, destroy: bag.dispose };
}

hairline({
  name: "carryon",
  means: "A cabin bag sizer at the gate: over the frame the suitcase lowers right in under the rails, then its handle runs up.",
  rules: [1, 3, 5, 6],
  range: [0, 200, 400],
  tour: [[200, 189], [214, 155], [186, 94], null],
  mount,
});
