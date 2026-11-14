/**
 * Smart lock: a lock body on a door slab, a lever below it and a keypad of
 * twelve raised keys on its face. The pointer picks the key nearest its rest
 * centre and presses it into the face. At rest one key sits pressed, bright.
 * The slider is how deep a key travels.
 *
 * The pattern: one of many on a face plane (depositboxes).
 */
const {
  Cam, fillet, fit, facing, hull, poly, prism, proj, rings, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const FX = 10, COLS = [9, 20, 31], ROWS = [74, 62, 50, 38], K = 4.2, OUT = 2.6, FAV = 4;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let depth = value;
  const C = Cam(45, 0.5, 2.25);
  fit(C, [[-6, -16, 0], [0, 56, 0], [-6, -16, 100], [0, 56, 100], [26, 40, 0], [26, 0, 90]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  const [dr, di] = rings(-6, -16, 0, 56, 2, 1);
  put(solid(g), prism(P, front, dr, di, 0, 100));
  const [lr, li] = rings(0, 0, FX, 40, 5, 1.6);
  put(solid(g), prism(P, front, lr, li, 6, 88));
  const [hr, hi] = rings(FX, 7, FX + 14, 14, 3, 1);
  put(solid(g), prism(P, front, hr, hi, 14, 20));

  const keys = [];
  ROWS.forEach((z, r) => COLS.forEach((y, c) => {
    const s = solid(g), i = keys.length;
    keys.push({ i, y, z, s, d: tween(i === FAV ? 0.5 : OUT), last: NaN, mid: P(FX + OUT, y, z) });
  }));

  const quad = (x, y, z) => fillet([P(x, y - K, z + K), P(x, y + K, z + K), P(x, y + K, z - K), P(x, y - K, z - K)], [1.4, 1.4, 1.4, 1.4]);
  function draw(k, d) {
    if (d === k.last) return;
    k.last = d;
    const top = quad(FX + d, k.y, k.z);
    k.s.sil.setAttribute("d", poly(hull(top.concat(quad(FX, k.y, k.z)))));
    k.s.cr.setAttribute("d", poly(top));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const k of keys) { draw(k, tval(k.d, now)); if (!tdone(k.d, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    keys.forEach((k) => { const dd = Math.hypot(k.mid[0] - sx, k.mid[1] - sy); if (dd < bd) { bd = dd; best = k.i; } });
    return bd < 16 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now();
    act = a;
    const on = a < 0 ? FAV : a;
    keys.forEach((k) => {
      tset(k.d, k.i === on ? OUT * (1 - depth) + 0.3 : OUT, now, 0);
      k.s.sil.classList.toggle("hi", k.i === on);
    });
    read.textContent = a < 0 ? "rest" : "key " + (Math.floor(a / 3) + 1) + "·" + ((a % 3) + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { depth = v; const a = act; act = -3; setActive(a); }, destroy: bag.dispose };
}

hairline({
  name: "smartlocks",
  means: "A smart lock on a door: the key under the pointer presses into the keypad, the rest stay raised.",
  rules: [1, 4, 5, 6],
  range: [0, 0.8, 1],
  tour: [[230, 119], [195, 183], [195, 207], null],
  mount,
});
