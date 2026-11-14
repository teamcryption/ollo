/**
 * Desk drawers: a drawer pedestal on a low plinth, four drawers of rising
 * depth stacked on its front face, each with a pull. The pointer picks a
 * drawer by where it stands on the face at rest: that drawer slides out,
 * and the drawers beside it open a crack, staggered from it. At rest the
 * second drawer stands half open, bright. The slider is the stagger.
 *
 * The pattern: one of many in a single column, picked on a fixed plane.
 */
const {
  Cam, fit, facing, open, prism, proj, rings, clamp, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const D = 34, W = 40, H = 86, F = D, OUT = 26, FAV = 1, LIP = 1.6;
const HS = [13, 17, 21, 24];
const ZS = [];
{ let z = H - 2; for (const h of HS) { ZS.push([z - h, z]); z -= h + 1; } }

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.5);
  fit(C, [[0, 0, 0], [D, W, 0], [0, W, 0], [D, 0, H], [0, 0, H], [F + LIP + OUT, W, 0], [F + LIP + OUT, 0, H]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [pr, pi] = rings(3, 3, D - 3, W - 3, 2, 1);
  put(solid(g), prism(P, front, pr, pi, 0, 4));
  const [br, bi] = rings(0, 0, D, W, 3, 1.4);
  put(solid(g), prism(P, front, br, bi, 4, H));

  const items = [];
  for (let k = HS.length - 1; k >= 0; k--) {
    const grp = mk("g", {}, g), s = solid(grp);
    const pull = mk("path", { class: "nf" }, grp);
    items[k] = { k, grp, s, pull, z: ZS[k], d: tween(k === FAV ? OUT * 0.5 : 0), last: NaN };
  }

  function draw(it, d) {
    if (d === it.last) return;
    it.last = d;
    const [z0, z1] = it.z, x1 = F + LIP + d;
    const [r, i] = rings(F - 0.5, 2.5, x1, W - 2.5, 1.5, 1);
    put(it.s, prism(P, front, r, i, z0, z1));
    const zh = z1 - Math.min(5, (z1 - z0) / 2);
    it.pull.setAttribute("d", open([P(x1, W / 2 - 7, zh), P(x1 + 0.6, W / 2 - 7, zh), P(x1 + 0.6, W / 2 + 7, zh), P(x1, W / 2 + 7, zh)]));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.d, now)); if (!tdone(it.d, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  // the pointer, read on the face plane x = F at rest: sliding along x never changes the height it reads
  const o = P(F, 0, 0), ey = P(F, 1, 0)[0] - o[0];
  function hit([sx, sy]) {
    const y = (sx - o[0]) / ey;
    if (y < -OUT - 4 || y > W + 2) return -1;
    const b = P(F, y, 0), z = (b[1] - sy) / (b[1] - P(F, y, 1)[1]);
    for (let k = 0; k < HS.length; k++) if (z >= ZS[k][0] - 0.5 && z <= ZS[k][1] + 0.5) return k;
    return -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), d = a < 0 ? (k === FAV ? OUT * 0.5 : 0) : dd === 0 ? OUT : dd === 1 ? 5 : 0;
      tset(it.d, clamp(d, 0, OUT), now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.s.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "drawer " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "deskdrawers",
  means: "A drawer pedestal: the drawer under the pointer slides out and the drawers beside it open a crack.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[206, 108], [206, 177], [206, 225], null],
  mount,
});
