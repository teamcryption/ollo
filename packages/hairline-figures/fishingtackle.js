/**
 * Tackle box: a stack of four trays under a lid with a carrying handle.
 * The pointer picks a tray by its height on the box: it slides out toward
 * the reader, the trays above and below it ease out a little, staggered
 * from it. At rest one tray stands half open, bright. The slider is the
 * stagger.
 *
 * The pattern: one of many in a single column (riffle).
 */
const {
  Cam, fit, facing, open, prism, proj, rings, seg, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 4, W = 70, D = 44, H = 13, OUT = 30, FAV = 1, LZ = N * H;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.35);
  fit(C, [[0, 0, 0], [W, 0, 0], [0, D + OUT, 0], [W, D + OUT, 0], [0, 0, LZ + 22], [W, D, LZ + 22]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  const items = [];
  for (let k = 0; k < N; k++) {
    const s = solid(g), mark = mk("path", { class: "nf" }, s.g);
    items.push({ k, s, mark, y: tween(k === FAV ? OUT * 0.55 : 0), last: NaN });
  }
  const lid = solid(g);
  const [lr, li] = rings(-1.5, -1.5, W + 1.5, D + 1.5, 6, 2);
  put(lid, prism(P, front, lr, li, LZ, LZ + 4));
  const arc = [];
  for (let i = 0; i <= 12; i++) { const t = (i / 12) * Math.PI; arc.push(P(W / 2 - 16 * Math.cos(t), D / 2, LZ + 4 + 14 * Math.sin(t))); }
  mk("path", { d: open(arc), class: "nf sil" }, lid.g);

  function draw(it, out) {
    if (out === it.last) return;
    it.last = out;
    const z0 = it.k * H + 0.6, z1 = (it.k + 1) * H - 0.6;
    const [r, i] = rings(0, out, W, D + out, 5, 1.6);
    put(it.s, prism(P, front, r, i, z0, z1));
    const zm = (z0 + z1) / 2, yf = D + out;
    it.mark.setAttribute("d", seg(P(W / 2 - 9, yf, zm), P(W / 2 + 9, yf, zm)) + seg(P(W / 2 - 9, yf, zm - 2), P(W / 2 + 9, yf, zm - 2)));
  }

  let order = "";
  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.y, now)); if (!tdone(it.y, now)) moving = true; }
    const sorted = items.slice().sort((a, b) => (Math.round(a.last) - Math.round(b.last)) || (a.k - b.k));
    const key = sorted.map((it) => it.k).join("");
    if (key !== order) { order = key; sorted.forEach((it) => g.insertBefore(it.s.g, lid.g)); }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(W / 2, D, it.k * H + H / 2));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[1] - sy); if (dd < bd) { bd = dd; best = k; } });
    return bd < 16 && Math.abs(mids[best][0] - sx) < 90 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), y = a < 0 ? (k === FAV ? OUT * 0.55 : 0) : dd === 0 ? OUT : dd === 1 ? 6 : 0;
      tset(it.y, y, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.s.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "tray " + (N - a);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "fishingtackle",
  means: "A tackle box of four stacked trays: the tray under the pointer slides out toward you, the trays beside it ease out a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[188, 235], [188, 182], [188, 156], null],
  mount,
});
