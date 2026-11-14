/**
 * Bread basket: a long low basket holding five rolls lying side by side.
 * The pointer picks a roll by where it stands: it lifts out of the basket,
 * and the rolls beside it rise a little, staggered from it. At rest one roll
 * sits raised, bright. The slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, fit, facing, poly, prism, proj, rings, ringAt, run, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 5, STEP = 20, RW = 16, RL = 40, BZ = 14, LIFT = 26, FAV = 3;
const X1 = N * STEP + 8, Y1 = RL + 10;
const LEN = [38, 34, 40, 36, 32];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 1.95);
  fit(C, [[0, 0, 0], [X1, Y1, 0], [X1, 0, 0], [0, Y1, 0], [X1 / 2, Y1 / 2, BZ + LIFT + 12]], 200, 172);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  // the basket's back wall and floor first, rolls inside, then the front rim over them
  const [br, bi] = rings(0, 0, X1, Y1, 14, 2.5);
  put(solid(g), prism(P, front, br, bi, 0, BZ));
  const rolls = [];
  for (let k = 0; k < N; k++) {
    const x = 4 + k * STEP + 2, y = (Y1 - LEN[k]) / 2, grp = mk("g", {}, g);
    const s = solid(grp), score = mk("path", { class: "nf lo" }, grp);
    rolls.push({ k, x, y, L: LEN[k], s, score, z: tween(k === FAV ? 0.5 : 0), last: NaN });
  }

  // the front wall, painted over the rolls' bottoms
  const fw = run(br, front);
  mk("path", { d: poly(ringAt(P, fw, BZ).concat(ringAt(P, fw, 0).reverse())), class: "sil" }, g);
  mk("path", { d: "M" + ringAt(P, run(bi, front), BZ).map((p) => p.join(",")).join("L"), class: "nf lo" }, g);

  function draw(r, t) {
    if (t === r.last) return;
    r.last = t;
    const z0 = BZ - 8 + LIFT * t, [a, b] = rings(r.x, r.y, r.x + RW, r.y + r.L, 8, 1.6);
    put(r.s, prism(P, front, a, b, z0, z0 + 11));
    let d = "";
    for (const f of [0.3, 0.5, 0.7]) {
      const p = P(r.x + 4, r.y + r.L * f - 3, z0 + 11), q = P(r.x + RW - 4, r.y + r.L * f + 3, z0 + 11);
      d += "M" + p.join(",") + "L" + q.join(",");
    }
    r.score.setAttribute("d", d);
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const r of rolls) { draw(r, tval(r.z, now)); if (!tdone(r.z, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = rolls.map((r) => P(r.x + RW / 2, r.y + r.L / 2, BZ));
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
    rolls.forEach((r, k) => {
      const dd = Math.abs(k - a), z = a < 0 ? (k === FAV ? 0.5 : 0) : dd === 0 ? 1 : dd === 1 ? 0.22 : 0;
      tset(r.z, z, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      r.s.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "roll " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "baguettebasket",
  means: "A bread basket of five rolls: the roll under the pointer lifts out, and its neighbours rise a little after it.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[145, 137], [200, 165], [255, 193], null],
  mount,
});
