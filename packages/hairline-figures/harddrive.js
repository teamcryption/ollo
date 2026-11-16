/**
 * Hard drive: an open drive case with four platters stacked on one spindle.
 * The pointer picks a platter by its height on the stack: it slides out of
 * the case to the right, its neighbours follow a little, staggered from it.
 * At rest the platters sit slightly fanned, the top one bright.
 * The slider is the stagger.
 */
const { Cam, clamp, facing, fit, prism, proj, rings, rrect, tdone, tset, tval, tween, disposer, mk, pointer, put, register, solid } = HL;

const N = 4, R = 20, CX = 24, CY = 24, Z0 = 7, GAP = 7, TH = 2.2, OUT = 34;
const REST = [0, 3, 1, 5], FAV = 3;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 3.15);
  fit(C, [[-2, -2, 0], [52, 50, 0], [CX + R + OUT, CY + R, Z0 + 3 * GAP], [CX - R, CY - R, Z0 + 3 * GAP + TH], [CX + R + OUT, CY - R, Z0]], 200, 160);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  const base = solid(g);
  const [bo, bi] = rings(-2, -2, 52, 50, 6, 1.4);
  put(base, prism(P, front, bo, bi, 0, 5));
  const spindle = solid(g);
  const [so, si] = rings(CX - 3, CY - 3, CX + 3, CY + 3, 3, 0.8);
  put(spindle, prism(P, front, so, si, 5, Z0 + 3 * GAP + TH + 2));

  const disc = [], dinner = [];
  for (let k = 0; k < N; k++) {
    const s = solid(g);
    disc.push({ k, s, z: Z0 + k * GAP, x: tween(REST[k]), last: NaN });
  }
  const ring0 = rrect(-R, -R, R, R, R, 14), ring1 = rrect(-R + 1.6, -R + 1.6, R - 1.6, R - 1.6, R - 1.6, 14);
  const at = (rg, dx) => rg.map((p) => ({ ...p, u: p.u + CX + dx, v: p.v + CY }));

  function draw(d, dx) {
    if (dx === d.last) return;
    d.last = dx;
    put(d.s, prism(P, front, at(ring0, dx), at(ring1, dx), d.z, d.z + TH));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    disc.forEach((d) => { draw(d, tval(d.x, now)); if (!tdone(d.x, now)) moving = true; });
    return moving;
  });
  bag.add(B.unregister);

  function hit([sx, sy]) {
    const [cxs] = P(CX, CY, 0);
    if (Math.abs(sx - cxs) > R * 3.15 * 1.3) return -1;
    let best = -1, bd = 1e9;
    disc.forEach((d, k) => { const dy = Math.abs(sy - P(CX, CY, d.z + TH)[1]); if (dy < bd) { bd = dy; best = k; } });
    return bd < GAP * 3.15 * 1.6 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    disc.forEach((d, k) => {
      const x = a < 0 ? REST[k] : k === a ? OUT : clamp(10 - 4 * Math.abs(k - a), 0, 10);
      tset(d.x, x, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      d.s.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "disc " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "harddrive",
  means: "A hard drive's platter stack: the platter under the pointer slides out of the case, its neighbours follow a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[118, 131], [118, 112], [118, 150], null],
  mount,
});
