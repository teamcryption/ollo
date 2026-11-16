/**
 * Server blade: a short rack chassis with five blades stacked in its front.
 * The pointer picks a blade by its height on the face: that blade slides out
 * on its rails, the ones around it ease out a little after it. At rest the
 * blades sit unevenly, one drawn half out and bright. The slider is the stagger.
 */
const { Cam, clamp, facing, fit, prism, proj, rings, seg, tdone, tset, tval, tween, disposer, mk, pointer, put, register, solid } = HL;

const N = 5, BH = 6, GAP = 1.8, Z0 = 4, X1 = 50, Y1 = 30, OUT = 20;
const H = Z0 + N * BH + (N - 1) * GAP + 4;
const REST = [0.5, 2, 0, 6, 1], FAV = 3;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 3.0);
  fit(C, [[0, 0, 0], [X1, 0, H], [X1, Y1 + OUT, 0], [0, Y1 + OUT, H], [0, 0, H], [X1, Y1 + OUT, H]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  const body = solid(g);
  const [br, bi] = rings(0, 0, X1, Y1, 4, 1.4);
  put(body, prism(P, front, br, bi, 0, H));
  // the rack ears on the front face
  mk("path", { class: "nf lo", d: seg(P(2, Y1, 3), P(2, Y1, H - 3)) + seg(P(X1 - 2, Y1, 3), P(X1 - 2, Y1, H - 3)) }, body.g);

  const blades = [];
  for (let k = 0; k < N; k++) {
    const s = solid(g);
    const h = mk("path", { class: "nf lo" }, s.g);
    blades.push({ k, z: Z0 + k * (BH + GAP), s, h, y: tween(REST[k]), last: NaN });
  }
  function draw(d, out) {
    if (out === d.last) return;
    d.last = out;
    const [r, i] = rings(4, Y1 - 8, X1 - 4, Y1 + 1 + out, 1.4, 0.8);
    put(d.s, prism(P, front, r, i, d.z, d.z + BH));
    const yf = Y1 + 1 + out, zm = d.z + BH / 2;
    d.h.setAttribute("d", seg(P(8, yf, zm), P(14, yf, zm)) + seg(P(X1 - 12, yf, zm), P(X1 - 10, yf, zm)));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    blades.forEach((d) => { draw(d, tval(d.y, now)); if (!tdone(d.y, now)) moving = true; });
    return moving;
  });
  bag.add(B.unregister);

  // the hit: on the front face at rest, nearest blade by screen height, along the face's slope
  const cy = blades.map((d) => P(X1 / 2, Y1, d.z + BH / 2));
  const dy = (P(X1, Y1, 0)[1] - P(0, Y1, 0)[1]) / (P(X1, Y1, 0)[0] - P(0, Y1, 0)[0]);
  const xl = P(0, Y1 + OUT, 0)[0] - 10, xr = P(X1, 0, 0)[0] + 10;
  function hit([sx, sy]) {
    if (sx < xl || sx > xr) return -1;
    const off = (d) => sy - (d[1] + (sx - d[0]) * dy);
    let best = 0;
    cy.forEach((c, k) => { if (Math.abs(off(c)) < Math.abs(off(cy[best]))) best = k; });
    return Math.abs(off(cy[best])) > 30 ? -1 : best;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    blades.forEach((d, k) => {
      const o = a < 0 ? REST[k] : k === a ? OUT : clamp(7 - 3 * Math.abs(k - a), 0.5, 7);
      tset(d.y, o, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      d.s.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "blade " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "serverblade",
  means: "A rack chassis of five blades: the blade under the pointer slides out on its rails, the ones beside it ease out after it.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[187, 140], [187, 182], [187, 213], null],
  mount,
});
