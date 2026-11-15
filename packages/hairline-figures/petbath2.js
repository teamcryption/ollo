/**
 * Pet stairs: four carpeted steps set against the side of a sofa. The
 * pointer picks a step by where it stands on it, and the stair parts there:
 * that step and the ones below it slide out from the sofa, staggered from
 * the touched step, opening gaps a paw could fit. At rest the stair is
 * slightly loose with one step bright. The slider is the stagger.
 */
const {
  Cam, fit, facing, prism, proj, rings, unproj, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 4, SX = 42, STEP = 17, RISE = 11, Y0 = 22, Y1 = 70, FAV = 1, REST = [0, 3, 7, 12];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 1.75);
  fit(C, [[0, 0, 0], [SX + N * STEP + 46, 92, 0], [SX + N * STEP + 46, 0, 0], [0, 92, 0], [0, 0, 74]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const box = (parent, x0, y0, x1, y1, z0, z1, r = 4, b = 1.6) => { const [o, i] = rings(x0, y0, x1, y1, r, b); const s = solid(parent); put(s, prism(P, front, o, i, z0, z1)); return s; };
  box(g, 0, 0, 14, 92, 6, 74, 6, 2);
  box(g, 0, 0, 42, 12, 6, 58, 5, 2);
  box(g, 2, 2, 42, 90, 6, 42, 5, 2);
  box(g, 10, 10, 42, 82, 42, 48, 4, 1.6);
  box(g, 0, 80, 42, 92, 6, 58, 5, 2);
  for (const [x, y] of [[4, 4], [38, 4], [4, 88], [38, 88]]) box(g, x - 2, y - 2, x + 2, y + 2, 0, 6, 1.5, 0.6);

  const steps = [];
  for (let k = 0; k < N; k++) {
    const grp = mk("g", {}, g);
    steps.push({ k, grp, s: solid(grp), off: tween(REST[k]), last: NaN, h: (N - k) * RISE });
  }
  function draw(st, o) {
    if (o === st.last) return;
    st.last = o;
    const x0 = SX + st.k * STEP + o;
    const [r, i] = rings(x0, Y0, x0 + STEP, Y1, 3, 1.4);
    put(st.s, prism(P, front, r, i, 0, st.h));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const st of steps) { draw(st, tval(st.off, now)); if (!tdone(st.off, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    for (const st of steps) {
      const [wx, wy] = unproj(C, sx, sy, st.h), cx = SX + st.k * STEP + REST[st.k] + STEP / 2;
      const dd = Math.max(Math.abs(wx - cx) - STEP / 2, 0) + Math.max(Math.abs(wy - (Y0 + Y1) / 2) - (Y1 - Y0) / 2, 0);
      if (dd < bd || (dd === bd && st.k > best)) { bd = dd; best = st.k; }
    }
    return bd < 12 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : Math.max(act, 0);
    act = a;
    steps.forEach((st, k) => {
      const o = a < 0 ? REST[k] : k < a ? 0 : 14 + (k - a) * 10;
      tset(st.off, o, now, Math.abs(k - from) * stag);
      st.s.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "step " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "petbath2",
  means: "Pet stairs against a sofa: the stair parts at the step under the pointer, that step and those below sliding out.",
  rules: [1, 2, 5, 6, 8],
  range: [0, 45, 90],
  tour: [[176, 162], [198, 189], [240, 227], null],
  mount,
});
