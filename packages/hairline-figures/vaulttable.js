/**
 * Vault box: a tapered vaulting box of five stacked sections with a padded
 * top. The pointer picks a section by its height: it slides out of the
 * stack toward the viewer, and the sections beside it slide a little,
 * staggered from it. At rest one section stands out, bright. The slider is
 * the stagger.
 */
const { Cam, fit, facing, proj, prism, rings, tdone, tset, tval, tween, disposer, mk, pointer, put, register, solid } = HL;

const N = 5, H = 14, W = 110, D = 46, OUT = 24, FAV = 2;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 1.95);
  fit(C, [[0, 0, 0], [W, 0, 0], [0, D + OUT, 0], [W, D + OUT, 0], [0, 0, N * H], [W, D + OUT, N * H]], 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const items = [];
  for (let k = 0; k < N; k++) {
    const s = solid(g), top = k === N - 1;
    items.push({ k, s, top, x0: 5 * k, x1: W - 5 * k, y0: 2 * k, y1: D - 2 * k, z: tween(k === FAV ? 10 : 0), last: NaN });
  }
  function draw(it, o) {
    if (o === it.last) return;
    it.last = o;
    const r = it.top ? 10 : 4;
    const [ring, inner] = rings(it.x0, it.y0 + o, it.x1, it.y1 + o, r, it.top ? 2.4 : 1.4);
    put(it.s, prism(P, front, ring, inner, it.k * H, (it.k + 1) * H - (it.top ? 0 : 0.6)));
  }
  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.z, now)); if (!tdone(it.z, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P((it.x0 + it.x1) / 2, (it.y0 + it.y1) / 2, it.k * H + H / 2));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[1] - sy); if (dd < bd) { bd = dd; best = k; } });
    return bd < 16 && Math.abs(mids[best][0] - sx) < 110 ? best : -1;
  }
  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), o = a < 0 ? (k === FAV ? 10 : 0) : dd === 0 ? OUT : dd === 1 ? 9 : 3;
      tset(it.z, o, now, from < 0 ? 0 : Math.abs(k - from) * stag);
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
  name: "vaulttable",
  means: "A tapered vaulting box of five sections: the section under the pointer slides out of the stack, its neighbours a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[200, 135], [200, 170], [228, 230], null],
  mount,
});
