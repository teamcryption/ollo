/**
 * Book cradle: an old volume lying open on two foam wedges on a board, the
 * reading-room way of keeping a spine from cracking. Over the cradle the book
 * opens flatter and the wedges sink with it; at rest it sits half open in a
 * deep V, bright. The slider is how far it opens.
 */
const {
  Cam, facing, fit, hull, poly, prism, proj, rad, rings, rrect, seg, unproj, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const W = 54, Y = 76, T = 9, Z0 = 6, REST = 36;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amt = value;
  const C = Cam(45, 0.5, 1.72);
  fit(C, [[-W - 6, -6, 0], [W + 6, Y + 6, 0], [W + 6, -6, 0], [-W - 6, Y + 6, 0], [-W, 0, Z0 + W * 0.6 + 8], [W, Y, Z0 + W * 0.6 + 8]], 200, 160);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  const [br, bi] = rings(-W - 6, -6, W + 6, Y + 6, 4, 1.4);
  put(solid(g), prism(P, front, br, bi, 0, Z0));

  const ring = rrect(0, 0, W, Y, 3, 4), inner = rrect(1.6, 1.6, W - 1.6, Y - 1.6, 2, 4);
  const sides = [-1, 1].map((s) => {
    const wedge = mk("path", {}, g), wl = mk("path", { class: "nf lo" }, g);
    const half = solid(g), pages = mk("path", { class: "nf lo" }, half.g);
    return { s, wedge, wl, half, pages };
  });
  const ang = tween(REST);
  let last = NaN;

  function draw(deg) {
    if (deg === last) return;
    last = deg;
    const a = rad(deg), c = Math.cos(a), n = Math.sin(a);
    for (const { s, wedge, wl, half, pages } of sides) {
      const B = (d, y, t) => P(s * (d * c - t * n), y, Z0 + d * n + t * c);
      // the foam wedge under this half, its slope under the book
      const d1 = W - 3, ys = [3, Y - 3];
      const wp = [];
      for (const y of ys) wp.push(P(s * 6 * c, y, Z0), P(s * d1 * c, y, Z0), P(s * d1 * c, y, Z0 + d1 * n - 0.4));
      wedge.setAttribute("d", poly(hull(wp)));
      wl.setAttribute("d", seg(P(s * d1 * c, Y - 3, Z0), P(s * d1 * c, Y - 3, Z0 + d1 * n - 0.4)) + seg(P(s * 6 * c, Y - 3, Z0), P(s * d1 * c, Y - 3, Z0 + d1 * n - 0.4)));
      // the half of the book: cover and text block in one slab
      half.sil.setAttribute("d", poly(hull(ring.map((q) => B(q.u, q.v, 0)).concat(ring.map((q) => B(q.u, q.v, T))))));
      half.cr.setAttribute("d", poly(inner.map((q) => B(q.u, q.v, T))));
      half.cr.setAttribute("class", "nf lo");
      let pd = "";
      for (const t of [2.4, 4.6, 6.8]) {
        pd += seg(B(3, Y, t), B(W - 1, Y, t));
        if (s > 0) pd += seg(B(W, 3, t), B(W, Y - 1, t));
      }
      pages.setAttribute("d", pd);
    }
  }

  const L = register(stage, (_dt, now) => {
    draw(tval(ang, now));
    return !tdone(ang, now);
  });
  bag.add(L.unregister);
  sides.forEach((h) => h.half.sil.classList.add("hi"));

  function hit([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, Z0 + 14);
    return x > -W - 14 && x < W + 14 && y > -14 && y < Y + 14;
  }
  let act = null;
  function setActive(a, force) {
    if (a === act && !force) return;
    act = a;
    tset(ang, a ? REST - amt : REST, performance.now(), 0);
    read.textContent = a ? Math.round(180 - 2 * (REST - amt)) + "°" : "rest";
    L.wake();
  }
  setActive(false);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amt = v; setActive(act, true); }, destroy: bag.dispose };
}

hairline({
  name: "bookcradle",
  means: "A book open on a foam cradle: over it the book opens flatter and the wedges sink with it; the slider sets how far it opens.",
  rules: [1, 4, 5, 6],
  range: [10, 24, 30],
  tour: [[200, 161], [222, 186], [180, 176], null],
  mount,
});
