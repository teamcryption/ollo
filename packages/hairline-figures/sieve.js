/**
 * Sieve: a stack of five round test sieves on a collecting pan, a lid on top.
 * The pointer picks a sieve by its rest height: it slides out of the stack
 * toward the viewer, and the sieves beside it shift a little, staggered from
 * it. At rest one sieve stands slightly out, bright. The slider is the stagger.
 */
const {
  Cam, circ, fit, facing, poly, prism, proj, ringAt, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 5, R = 24, H = 9, PAN = 7, OUT = 34, FAV = 2;
const disc = (x, y, r, n = 40) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));
const zOf = (k) => PAN + k * H;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 3.3);
  const top = zOf(N) + 6;
  fit(C, [[-R, -R, 0], [R + OUT, R + OUT, 0], [R + OUT, -R, 0], [-R, R, 0], [-R, -R, top], [R, R, top]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  // collecting pan
  put(solid(g), prism(P, front, disc(0, 0, R + 1), disc(0, 0, R - 1.5), 0, PAN));

  const items = [];
  for (let k = 0; k < N; k++) {
    const grp = mk("g", {}, g);
    const s = solid(grp);
    const mesh = mk("path", { class: "nf lo dash" }, grp);
    items.push({ k, grp, s, mesh, o: tween(k === FAV ? OUT * 0.3 : 0), last: NaN });
  }
  // lid with a low knob
  const lid = mk("g", {}, g);
  put(solid(lid), prism(P, front, disc(0, 0, R + 0.5), disc(0, 0, R - 2), zOf(N), zOf(N) + 3));
  put(solid(lid), prism(P, front, disc(0, 0, 5, 24), disc(0, 0, 3.5, 24), zOf(N) + 3, zOf(N) + 6));

  function draw(it, o) {
    if (o === it.last) return;
    it.last = o;
    const x = o, y = o * 0.15, z0 = zOf(it.k);
    put(it.s, prism(P, front, disc(x, y, R), disc(x, y, R - 2), z0, z0 + H));
    // the mesh: one line across the open top, seen past the rim
    const m = ringAt(P, disc(x, y, R - 6, 4), z0 + H - 3);
    it.mesh.setAttribute("d", "M" + m[0] + "L" + m[2] + "M" + m[1] + "L" + m[3]);
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.o, now)); if (!tdone(it.o, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  // hit against the rest stack: band of each sieve's screen height
  const mids = items.map((it) => P(0, 0, zOf(it.k) + H / 2));
  const cx = P(0, 0, 0)[0];
  function hit([sx, sy]) {
    if (Math.abs(sx - cx) > R * 3.3 * 1.3) return -1;
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const d = Math.abs(m[1] - sy); if (d < bd) { bd = d; best = k; } });
    return bd < H * 3.3 * 1.2 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const d = Math.abs(k - a), o = a < 0 ? (k === FAV ? OUT * 0.3 : 0) : d === 0 ? OUT : d === 1 ? 6 : 0;
      tset(it.o, o, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.s.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "tier " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "sieve",
  means: "A stack of test sieves on a pan: the sieve under the pointer slides out of the stack, its neighbours shift a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[160, 189], [160, 126], [160, 61], null],
  mount,
});
