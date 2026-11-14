/**
 * Rulers: three flat rulers laid side by side, ticks along their near edges.
 * The pointer picks a ruler by where it lies on the desk and slides it out
 * along its length; its neighbours slide a little, staggered from it. At
 * rest the middle one is half out, bright. The slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, fit, facing, open, prism, proj, rings, unproj, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 3, LEN = 130, WD = 14, GAP = 20, TH = 3, OUT = 30, FAV = 1;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 1.9);
  fit(C, [[0, 0, 0], [LEN + OUT, 0, 0], [LEN + OUT, (N - 1) * GAP + WD, 0], [0, (N - 1) * GAP + WD, 0], [0, 0, TH]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const items = [];
  for (let k = 0; k < N; k++) {
    const y = k * GAP, s = solid(g), ticks = mk("path", { class: "nf lo" }, s.g);
    items.push({ k, y, s, ticks, x: tween(k === FAV ? OUT / 2 : 0), last: NaN });
  }
  function draw(it, x) {
    if (x === it.last) return;
    it.last = x;
    const [a, i] = rings(x, it.y, x + LEN, it.y + WD, 2, 1);
    put(it.s, prism(P, front, a, i, 0, TH));
    let d = "";
    for (let t = 6; t <= LEN - 6; t += 5) d += open([P(x + t, it.y + WD - 1.5, TH), P(x + t, it.y + WD - (t % 10 === 6 % 10 ? 6 : 3.5), TH)]);
    it.ticks.setAttribute("d", d);
  }
  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.x, now)); if (!tdone(it.x, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  // hit: the desk plane, where the rulers rest; bands by y, rest x span
  function hit([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, 0);
    if (x < -6 || x > LEN + OUT) return -1;
    const k = Math.round((y - WD / 2) / GAP);
    return k >= 0 && k < N && Math.abs(y - (k * GAP + WD / 2)) < GAP / 2 + 2 ? k : -1;
  }
  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), x = a < 0 ? (k === FAV ? OUT / 2 : 0) : dd === 0 ? OUT : dd === 1 ? 6 : 0;
      tset(it.x, x, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.s.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "rule " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "rulers",
  means: "Three rulers side by side: the one under the pointer slides out along its length, its neighbours a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[200, 160], [150, 150], [250, 180], null],
  mount,
});
