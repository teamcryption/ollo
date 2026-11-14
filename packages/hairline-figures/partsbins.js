/**
 * Parts bins: five open-fronted workshop bins standing side by side on a
 * shelf, each with a low scooped front and a label holder. The pointer picks
 * a bin by where it is along the shelf: that bin slides out toward the
 * reader, its neighbours ease out a little, staggered from it. At rest the
 * bins sit unevenly, one pulled half out, bright. The slider is the stagger.
 *
 * The pattern: one of many in a single row; the hit is on a fixed plane
 * through the bins' resting tops; paint order follows the nearest bin.
 */
const {
  Cam, clamp, facing, fit, hull, open, poly, prism, proj, rings, ringAt, rrect, run, seg, unproj, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 5, STEP = 12, W = 5, D = 18, HB = 12, HF = 6, OUT = 14;
const L = (N - 1) * STEP + W;
const REST = [1, 3, 8, 2, 0.5], FAV = 2;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 3.4);
  fit(C, [[-W - 3, -3, -4], [L + 3, -3, -4], [L + 3, D + OUT, 0], [-W - 3, D + OUT, 0], [0, 0, HB + 2], [L, 0, HB + 2]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  // the shelf, with a back rail behind the bins
  const [sr, si] = rings(-W - 3, -3, L + 3, D + 3, 3, 1);
  put(solid(g), prism(P, front, sr, si, -4, 0));
  const [rr, ri] = rings(-W - 3, -4, L + 3, -2, 1, 0.5);
  put(solid(g), prism(P, front, rr, ri, 0, HB + 3));

  const layer = mk("g", {}, g);
  const bins = [];
  for (let k = 0; k < N; k++) {
    const grp = mk("g", {}, layer);
    bins.push({ k, x: k * STEP, grp, sil: mk("path", { class: "sil" }, grp), cr: mk("path", { class: "nf lo" }, grp), y: tween(REST[k]), last: NaN });
  }

  function draw(b, s) {
    if (s === b.last) return;
    b.last = s;
    const x = b.x, foot = rrect(x - W, s, x + W, s + D, 2.2, 6), back = rrect(x - W, s, x + W, s + D * 0.55, 2.2, 6);
    const pts = ringAt(P, foot, 0).concat(ringAt(P, foot, HF), ringAt(P, back, HB));
    b.sil.setAttribute("d", poly(hull(pts)));
    const lip = rrect(x - W + 1, s + 1, x + W - 1, s + D - 1, 1.4, 6);
    const scoop = [P(x - W + 1, s + D * 0.55 - 1, HB - 1), P(x - W + 1, s + D - 1, HF - 0.6)];
    const holder = [P(x - 2.6, s + D, 1.4), P(x + 2.6, s + D, 1.4), P(x + 2.6, s + D, 4), P(x - 2.6, s + D, 4)];
    b.cr.setAttribute("d", open(ringAt(P, run(lip, front), HF - 0.6).filter((_, i) => i > 0)) + open(scoop) + poly(holder) + seg(P(x - W + 1, s + 1, HB - 1), P(x + W - 1, s + 1, HB - 1)));
  }

  let order = "";
  const B = register(stage, (_dt, now) => {
    let moving = false;
    bins.forEach((b) => { draw(b, tval(b.y, now)); if (!tdone(b.y, now)) moving = true; });
    const sorted = bins.slice().sort((a, b) => (a.x + a.last) - (b.x + b.last));
    const key = sorted.map((b) => b.k).join("");
    if (key !== order) { order = key; sorted.forEach((b) => layer.appendChild(b.grp)); }
    return moving;
  });
  bag.add(B.unregister);

  function hit([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, HF);
    if (x < -W - 4 || x > L + 4 || y < -4 || y > D + 8) return -1;
    return clamp(Math.round(x / STEP), 0, N - 1);
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    bins.forEach((b, k) => {
      const y = a < 0 ? REST[k] : k === a ? OUT : Math.max(0, 4 - 1.6 * Math.abs(k - a));
      tset(b.y, y, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      b.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "bin " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "partsbins",
  means: "Five parts bins on a workshop shelf: the bin under the pointer slides out toward you, its neighbours ease out a little after it.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[158, 126], [216, 155], [273, 183], null],
  mount,
});
