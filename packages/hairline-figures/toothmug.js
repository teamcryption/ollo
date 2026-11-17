/**
 * Toothbrush cup: a round cup holding three brushes that lean out over its
 * back rim. At rest they fan to one side, the middle brush bright. The
 * pointer over the cup swings them across to the other side, the middle one
 * first. The slider is the stagger.
 */
const {
  Cam, circ, fit, facing, hull, poly, prism, proj, ringAt, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid, unproj,
} = HL;

const CX = 30, CY = 30, R = 18, CH = 40, L = 76, LEAN = 0.42;
const disc = (x, y, r, n = 40) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));
const BR = [{ o: [-6, 4], s: 0.75 }, { o: [0, -2], s: 0.2 }, { o: [6, 2], s: 1.1 }];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.68);
  fit(C, [[CX - R, CY - R, 0], [CX + R, CY + R, 0], [CX - 40, CY - 10, L + 4], [CX - 10, CY - 40, L + 4], [CX + R, CY + R, CH]], 200, 160);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const items = BR.map((b, k) => {
    const grp = mk("g", {}, g);
    return { ...b, k, rod: mk("path", { class: "nf" }, grp), head: mk("path", { class: "sil" }, grp), a: tween(b.s), last: NaN };
  });
  put(solid(g), prism(P, front, disc(CX, CY, R), disc(CX, CY, R - 2), 0, CH));
  function draw(it, s) {
    if (s === it.last) return;
    it.last = s;
    const side = [1, -1], back = [-0.71, -0.71];
    const dx = back[0] * 0.8 + side[0] * s, dy = back[1] * 0.8 + side[1] * s, n = Math.hypot(dx, dy);
    const ux = (dx / n) * Math.sin(LEAN), uy = (dy / n) * Math.sin(LEAN), uz = Math.cos(LEAN);
    const bx = CX + it.o[0], by = CY + it.o[1], at = (t) => [bx + ux * t, by + uy * t, 4 + uz * t];
    const p0 = at(10), p1 = at(L - 14), p2 = at(L - 13), p3 = at(L);
    it.rod.setAttribute("d", poly(hull(ringAt(P, disc(p0[0], p0[1], 1.6, 10), p0[2]).concat(ringAt(P, disc(p1[0], p1[1], 1.6, 10), p1[2])))));
    it.head.setAttribute("d", poly(hull(ringAt(P, disc(p2[0], p2[1], 3, 12), p2[2]).concat(ringAt(P, disc(p3[0], p3[1], 3, 12), p3[2])))));
  }
  const B = register(stage, (_dt, now) => {
    let m = false;
    for (const it of items) { draw(it, tval(it.a, now)); if (!tdone(it.a, now)) m = true; }
    return m;
  });
  bag.add(B.unregister);
  let on = null;
  function set(a) {
    if (a === on) return;
    on = a;
    const now = performance.now();
    items.forEach((it) => tset(it.a, a ? -it.s - 0.3 : it.s, now, Math.abs(it.k - 1) * stag));
    read.textContent = a ? "swing" : "rest";
    B.wake();
  }
  items[1].head.classList.add("hi");
  set(false);
  bag.add(pointer(stage, {
    move: ([sx, sy]) => { const [x, y] = unproj(C, sx, sy, 0), [u, v] = unproj(C, sx, sy, CH); set(Math.hypot(x - CX, y - CY) < R + 20 || Math.hypot(u - CX, v - CY) < R + 30); },
    leave: () => set(false),
  }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "toothmug",
  means: "A toothbrush cup: the three brushes leaning out of it swing across to the other side when the pointer comes near.",
  rules: [1, 2, 5, 6],
  range: [0, 50, 100],
  tour: [[200, 167], [166, 277], [234, 277], null],
  mount,
});
