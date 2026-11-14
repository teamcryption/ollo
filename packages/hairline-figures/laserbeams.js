/**
 * Laser grid: five emitter posts in a row on a plinth, a beam strung from
 * each emitter head to the next. The pointer picks a post by where it stands:
 * its head slides up the post, tilting the beams on either side, and the heads
 * beside it rise a little, staggered from it. At rest the heads stand at
 * uneven heights, one bright. The slider is the stagger.
 */
const {
  Cam, fit, facing, prism, proj, rings, seg, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 5, STEP = 34, PH = 58, HW = 5, HH = 7, LIFT = 50, FAV = 3;
const REST = [16, 28, 20, 34, 12];
const X1 = (N - 1) * STEP;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 1.75);
  fit(C, [[-12, -12, 0], [X1 + 12, 12, 0], [X1 + 12, -12, 0], [-12, 12, 0], [0, 0, PH + 2], [X1, 0, PH + 2]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [pr, pi] = rings(-12, -12, X1 + 12, 12, 6, 2);
  put(solid(g), prism(P, front, pr, pi, 0, 4));

  const items = [];
  for (let k = 0; k < N; k++) {
    const x = k * STEP, grp = mk("g", {}, g);
    const [r0, i0] = rings(x - 1.8, -1.8, x + 1.8, 1.8, 1.8, 0.6);
    put(solid(grp), prism(P, front, r0, i0, 4, PH));
    const [hr, hi] = rings(x - HW, -HW, x + HW, HW, 2.5, 1.2);
    const head = solid(grp);
    const beam = k < N - 1 ? mk("path", { class: "lo nf" }, g) : null;
    items.push({ k, x, grp, head, hr, hi, beam, z: tween(k === FAV ? LIFT * 0.7 : REST[k]), h: 0, last: NaN });
  }

  function draw(it, h) {
    it.h = h;
    if (h === it.last) return false;
    it.last = h;
    put(it.head, prism(P, front, it.hr, it.hi, h, h + HH));
    return true;
  }
  function beams() {
    for (let k = 0; k < N - 1; k++) {
      const a = items[k], b = items[k + 1];
      a.beam.setAttribute("d", seg(P(a.x + HW, 0, a.h + HH / 2), P(b.x - HW, 0, b.h + HH / 2)));
    }
  }

  const B = register(stage, (_dt, now) => {
    let moving = false, changed = false;
    for (const it of items) { if (draw(it, tval(it.z, now))) changed = true; if (!tdone(it.z, now)) moving = true; }
    if (changed) beams();
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.x, 0, PH / 2));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 26 && Math.abs(mids[best][1] - sy) < 70 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), z = a < 0 ? (k === FAV ? LIFT * 0.7 : REST[k]) : dd === 0 ? LIFT : REST[k] + (dd === 1 ? 12 : 0);
      tset(it.z, z, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.head.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "post " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "laserbeams",
  means: "Five laser posts on a plinth: the emitter under the pointer slides up its post, tilting the beams strung to its neighbours.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[158, 122], [242, 164], [284, 216], null],
  mount,
});
