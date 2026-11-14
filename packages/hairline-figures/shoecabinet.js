/**
 * Shoe cabinet: a slim hallway cabinet with three tip-out flaps stacked on
 * its front, each with a pull, a dim slot behind it. The pointer picks a
 * flap by height: it tips open on its bottom hinge, the flaps beside it
 * crack open a little, staggered from it. At rest the middle flap stands
 * ajar, bright. The slider is the stagger.
 *
 * The pattern: one of many in a single column (riffle).
 */
const {
  Cam, fit, facing, fillet, poly, prism, proj, rings, seg, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 3, Y1 = 28, H = 24, OPEN = 42, FAV = 1;
const Z0 = (k) => 6 + (N - 1 - k) * 26; // k 0 is the top flap

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 1.95);
  fit(C, [[0, 0, 0], [80, Y1 + 18, 0], [80, 0, 88], [0, Y1 + 18, 0], [0, 0, 88]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(0, 0, 80, Y1, 3, 1.5);
  put(solid(g), prism(P, front, br, bi, 2, 84));
  const [fr, fi] = rings(0, 0, 80, Y1, 3, 1.2);
  put(solid(g), prism(P, front, fr, fi, 84, 88));
  for (const fx of [5, 75]) { const [r, i] = rings(fx - 2, Y1 - 6, fx + 2, Y1 - 2, 1.5, 0.6); put(solid(g), prism(P, front, r, i, 0, 2)); }

  const flaps = [];
  for (let k = N - 1; k >= 0; k--) {
    const z0 = Z0(k), grp = mk("g", {}, g);
    mk("path", { d: poly(fillet([P(5, Y1, z0 + 1), P(75, Y1, z0 + 1), P(75, Y1, z0 + H - 1), P(5, Y1, z0 + H - 1)], [2, 2, 2, 2])), class: "nf lo" }, grp);
    flaps[k] = { k, z0, plate: mk("path", { class: "sil" }, grp), pull: mk("path", { class: "nf lo" }, grp), a: tween(k === FAV ? 16 : 0), last: NaN };
  }
  function draw(f, deg) {
    if (deg === f.last) return;
    f.last = deg;
    const t = (deg * Math.PI) / 180, F = (x, s) => P(x, Y1 + 0.5 + s * Math.sin(t), f.z0 + s * Math.cos(t));
    f.plate.setAttribute("d", poly(fillet([F(4, 0), F(76, 0), F(76, H), F(4, H)], [2, 2, 2.5, 2.5])));
    f.pull.setAttribute("d", seg(F(32, H - 4), F(48, H - 4)));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const f of flaps) { draw(f, tval(f.a, now)); if (!tdone(f.a, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = flaps.map((f) => P(40, Y1, f.z0 + H / 2));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[1] - sy); if (dd < bd) { bd = dd; best = k; } });
    return bd < 30 && Math.abs(mids[best][0] - sx) < 75 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    flaps.forEach((f, k) => {
      const dd = Math.abs(k - a), deg = a < 0 ? (k === FAV ? 16 : 0) : dd === 0 ? OPEN : dd === 1 ? 7 : 0;
      tset(f.a, deg, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      f.plate.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "flap " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "shoecabinet",
  means: "A shoe cabinet with three tip-out flaps: the flap under the pointer tips open, the ones beside it crack open a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[193, 126], [193, 169], [193, 213], null],
  mount,
});
