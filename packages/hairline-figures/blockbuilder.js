/**
 * Building bricks: four studded toy bricks in a row on a baseplate, at
 * staggered depths. The pointer picks a brick by where it stands: the brick
 * lifts clear of the plate, and the bricks beside it rise a little,
 * staggered from it. At rest one brick is half lifted, bright. The slider is
 * the stagger.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, circ, fit, facing, prism, proj, rings, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 4, STEP = 22, BX = 16, BY = 32, H = 12, SR = 3, SH = 3, LIFT = 26, FAV = 2;
const DY = [6, 0, 10, 3];
const disc = (x, y, r, n = 16) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.45);
  const X1 = (N - 1) * STEP + BX;
  fit(C, [[-8, -8, 0], [X1 + 8, BY + 18, 0], [X1 + 8, -8, 0], [-8, BY + 18, 0], [0, 0, H + SH + LIFT], [X1, 0, H + SH + LIFT]], 200, 170);
  const P = proj(C), front = facing(C);
  const zs = P(0, 0, 0)[1] - P(0, 0, 1)[1];
  const g = mk("g", {}, svg);
  const [pr, pi] = rings(-8, -8, X1 + 8, BY + 18, 4, 1.6);
  put(solid(g), prism(P, front, pr, pi, -4, 0));

  const items = [];
  for (let k = 0; k < N; k++) {
    const x0 = k * STEP, y0 = DY[k], grp = mk("g", {}, g);
    const [r, i] = rings(x0, y0, x0 + BX, y0 + BY, 1.6, 1.2);
    const body = solid(grp);
    put(body, prism(P, front, r, i, 0, H));
    for (let a = 0; a < 4; a++) for (let b = 0; b < 2; b++) {
      const cx = x0 + 4 + b * 8, cy = y0 + 4 + a * 8;
      put(solid(grp), prism(P, front, disc(cx, cy, SR), disc(cx, cy, SR - 0.8), H, H + SH));
    }
    items.push({ k, grp, body, mid: P(x0 + BX / 2, y0 + BY / 2, H / 2), z: tween(k === FAV ? LIFT * 0.55 : 0), last: NaN });
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) {
      const z = tval(it.z, now);
      if (z !== it.last) { it.last = z; it.grp.setAttribute("transform", "translate(0 " + (-z * zs).toFixed(2) + ")"); }
      if (!tdone(it.z, now)) moving = true;
    }
    return moving;
  });
  bag.add(B.unregister);

  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    items.forEach((it, k) => { const dd = Math.abs(it.mid[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 30 && Math.abs(items[best].mid[1] - sy) < 70 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), z = a < 0 ? (k === FAV ? LIFT * 0.55 : 0) : dd === 0 ? LIFT : dd === 1 ? 6 : 0;
      tset(it.z, z, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.body.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "brick " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "blockbuilder",
  means: "Four studded toy bricks on a baseplate: the brick under the pointer lifts off the plate, and its neighbours rise a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[141, 166], [210, 208], [250, 226], null],
  mount,
});
