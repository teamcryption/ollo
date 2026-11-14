/**
 * Key safe: a lockbox fixed to a house wall, six push buttons in two
 * columns on its face and a pull bar under them. The pointer picks the
 * nearest button by its rest position on the face: it presses in, and the
 * buttons beside it give a little, staggered from it. At rest one button is
 * pressed, bright. The slider is the stagger.
 *
 * The pattern: a grid on a face plane (depositboxes).
 */
const {
  Cam, fit, facing, hull, poly, prism, proj, rings, rrect, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const BX = 64, BY = 30, BZ = 96, OUT = 9, IN = 1, FAV = 2;
const COLS = [20, 44], ROWS = [76, 58, 40];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 1.6);
  fit(C, [[-26, -8, 0], [BX + 26, 0, 0], [-26, -8, 124], [BX + 26, 0, 124], [BX, BY + OUT, 0], [0, BY + OUT, 0]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  // the wall, then the box standing out from it
  { const [a, b] = rings(-26, -8, BX + 26, 0, 3, 1.2); put(solid(g), prism(P, front, a, b, 0, 124)); }
  { const [a, b] = rings(0, 0, BX, BY, 6, 2); put(solid(g), prism(P, front, a, b, 8, BZ + 8)); }

  // a plate standing out of the face y = BY, as a hull of two rounded rings in x,z
  const face = (u0, v0, u1, v1, r, y) => rrect(u0, v0, u1, v1, r, 4).map((q) => P(q.u, y, q.v));
  function plate(s, u0, v0, u1, v1, d) {
    s.sil.setAttribute("d", poly(hull(face(u0, v0, u1, v1, 3, BY).concat(face(u0, v0, u1, v1, 3, BY + d)))));
    s.cr.setAttribute("d", poly(face(u0 + 1.2, v0 + 1.2, u1 - 1.2, v1 - 1.2, 2, BY + d)));
  }
  const items = [];
  ROWS.forEach((z, r) => COLS.forEach((x, c) => {
    const k = items.length, s = solid(g);
    s.cr.setAttribute("class", "nf lo");
    items.push({ k, r, c, x, z, s, d: tween(k === FAV ? IN : OUT), last: NaN });
  }));
  // the pull bar, fixed
  { const s = solid(g); s.cr.setAttribute("class", "nf lo"); plate(s, 14, 18, 50, 24, 5); }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) {
      const d = tval(it.d, now);
      if (d !== it.last) { it.last = d; plate(it.s, it.x - 9, it.z - 6, it.x + 9, it.z + 6, d); }
      if (!tdone(it.d, now)) moving = true;
    }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.x, BY + OUT, it.z));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.hypot(m[0] - sx, m[1] - sy); if (dd < bd) { bd = dd; best = k; } });
    return bd < 26 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const o = items[a] || it, dd = a < 0 ? 9 : Math.abs(it.r - o.r) + Math.abs(it.c - o.c);
      const d = a < 0 ? (k === FAV ? IN : OUT) : dd === 0 ? IN : dd === 1 ? OUT - 4 : OUT;
      const f = items[from];
      tset(it.d, d, now, f ? (Math.abs(it.r - f.r) + Math.abs(it.c - f.c)) * stag : 0);
      it.s.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "key " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "keysafe",
  means: "A key safe on a house wall: the button under the pointer presses in, and the buttons beside it give a little.",
  rules: [1, 2, 5, 6],
  range: [0, 40, 80],
  tour: [[150, 160], [177, 199], [177, 224], null],
  mount,
});
