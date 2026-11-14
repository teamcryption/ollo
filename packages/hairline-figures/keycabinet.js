/**
 * Key cabinet: a wall cabinet standing open, a row of five keys hanging on
 * pegs across its back, each key a tag with its blade below. The pointer
 * picks a key by where it is along the row: that key lifts off its peg, the
 * others settle onto theirs, staggered from it. At rest one key sits lifted
 * a little, bright. The slider is the stagger.
 *
 * The pattern: one of many in a single row; the hit is the nearest key's
 * rest centre by screen x.
 */
const {
  Cam, fit, facing, poly, prism, proj, rings, seg, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const W = 64, D = 12, H = 58, N = 5, X0 = 12, STEP = 10, ZT = 24, LIFT = 12;
const REST = [0, 1.5, 0, 5, 0.8], FAV = 3, PEG = 44;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 3.1);
  fit(C, [[0, 0, 0], [W, D + 3, 0], [W, 0, H], [0, D + 3, H], [0, D, 0]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  // the cabinet: one rounded solid, its open face framed by a dim inset
  const body = solid(g);
  put(body, prism(P, front, ...rings(0, 0, W, D, 3, 1.2), 0, H));
  const fr = [[4, 5], [W - 4, 5], [W - 4, H - 5], [4, H - 5]].map(([x, z]) => P(x, D, z));
  mk("path", { class: "nf lo", d: poly(fr) }, body.g);
  // the pegs, one per key, and a shelf line under the row
  let pegs = "";
  for (let k = 0; k < N; k++) { const x = X0 + k * STEP; pegs += seg(P(x, D, PEG), P(x, D + 3, PEG + 0.6)); }
  pegs += seg(P(6, D, 12), P(W - 6, D, 12));
  mk("path", { class: "nf lo", d: pegs }, body.g);

  const keys = [];
  for (let k = 0; k < N; k++) {
    const grp = mk("g", {}, g);
    keys.push({ x: X0 + k * STEP, blade: solid(grp), tag: solid(grp), hole: mk("path", { class: "nf lo" }, grp), z: tween(REST[k]), last: NaN });
  }

  function draw(kk, lift) {
    if (lift === kk.last) return;
    kk.last = lift;
    const x = kk.x, z = ZT + lift;
    put(kk.blade, prism(P, front, ...rings(x - 1.1, D + 0.4, x + 1.1, D + 1.6, 0.5, 0.3), z - 11, z + 1));
    put(kk.tag, prism(P, front, ...rings(x - 3.4, D + 0.2, x + 3.4, D + 2, 1.4, 0.5), z, z + 13));
    kk.hole.setAttribute("d", seg(P(x - 1, D + 2, z + 10.5), P(x + 1, D + 2, z + 10.5)) + seg(P(x + 1.6, D + 1, z - 8), P(x + 1.6, D + 1, z - 6)));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    keys.forEach((kk) => { draw(kk, tval(kk.z, now)); if (!tdone(kk.z, now)) moving = true; });
    return moving;
  });
  bag.add(B.unregister);

  // the hit: nearest key by its rest centre's screen x, within the cabinet's band
  const cx = keys.map((kk) => P(kk.x, D, ZT + 6)[0]);
  const top = P(0, D, H)[1] - 6, bot = P(W, D, 0)[1] + 4;
  function hit([sx, sy]) {
    if (sy < top || sy > bot || sx < cx[0] - 22 || sx > cx[N - 1] + 22) return -1;
    let best = 0;
    cx.forEach((c, k) => { if (Math.abs(sx - c) < Math.abs(sx - cx[best])) best = k; });
    return best;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    keys.forEach((kk, k) => {
      const z = a < 0 ? REST[k] : k === a ? LIFT : 0;
      tset(kk.z, z, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      const on = k === (a < 0 ? FAV : a);
      kk.tag.sil.classList.toggle("hi", on);
      kk.blade.sil.classList.toggle("hi", on);
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
  name: "keycabinet",
  means: "An open key cabinet: the key under the pointer lifts off its peg, the others settle back onto theirs after it.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[144, 139], [188, 161], [232, 183], null],
  mount,
});
