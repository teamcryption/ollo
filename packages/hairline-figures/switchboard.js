/**
 * Switchboard: a fuse box laid open, a row of breakers on a rail tray, each
 * with a toggle riding in a slot on its top. The pointer picks a breaker by
 * where it stands: its toggle throws to the other end of the slot, and the
 * toggles beside it slide part way, staggered from it. At rest the toggles sit
 * in a broken pattern and one is bright. The slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, fit, facing, prism, proj, rings, ringAt, poly, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 6, W = 14, GAP = 3, D = 34, H = 24, BZ = 4, FAV = 2;
const X1 = N * W + (N - 1) * GAP;
const REST = [1, 0, 1, 1, 0, 1];
const KY0 = 4, KY1 = 21, KL = 9;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.05);
  fit(C, [[-8, -8, 0], [X1 + 8, D + 8, 0], [X1 + 8, -8, 0], [-8, D + 8, 0], [0, 0, H + 12], [X1, D, H + 12]], 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [tr, ti] = rings(-8, -8, X1 + 8, D + 8, 5, 2);
  put(solid(g), prism(P, front, tr, ti, 0, BZ));

  const items = [];
  for (let k = 0; k < N; k++) {
    const x = k * (W + GAP), grp = mk("g", {}, g);
    const [mr, mi] = rings(x, 0, x + W, D, 2.5, 1.2);
    put(solid(grp), prism(P, front, mr, mi, BZ, H));
    const [sr] = rings(x + 2.5, KY0 - 1.5, x + W - 2.5, KY1 + KL + 1.5, 2, 0.6);
    mk("path", { d: poly(ringAt(P, sr, H)), class: "nf lo" }, grp);
    const knob = solid(grp);
    knob.sil.classList.add("sil");
    items.push({ k, x, knob, y: tween(REST[k]), last: NaN });
  }

  function draw(it, t) {
    if (t === it.last) return;
    it.last = t;
    const y = KY0 + (KY1 - KY0) * t;
    const [kr, ki] = rings(it.x + 3.5, y, it.x + W - 3.5, y + KL, 2, 1);
    put(it.knob, prism(P, front, kr, ki, H, H + 12));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.y, now)); if (!tdone(it.y, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.x + W / 2, D / 2, H / 2));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 22 && Math.abs(mids[best][1] - sy) < 55 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), r = REST[k];
      const t = a < 0 || dd > 1 ? r : dd === 0 ? 1 - r : r + (r ? -0.7 : 0.7);
      tset(it.y, t, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.knob.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "way " + (a + 1) + (REST[a] ? " off" : " on");
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "switchboard",
  means: "A row of breakers in a fuse box: the toggle under the pointer throws to the other end, its neighbours slide part way.",
  rules: [1, 2, 5, 6],
  range: [0, 40, 80],
  tour: [[138, 125], [193, 152], [288, 199], null],
  mount,
});
