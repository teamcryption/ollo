/**
 * Ratchet straps: a crate lashed to a flatbed with three straps, each with a
 * ratchet on the crate's near face. The pointer picks a strap by where it is
 * along the crate: that strap ratchets down tight against the crate, the
 * others throw slack, staggered from it. At rest the straps hang unevenly
 * slack, one bright. The slider is the stagger.
 *
 * The pattern: one of many in a single row; nearest rest centre by screen x.
 */
const {
  Cam, clamp, facing, fit, open, poly, prism, proj, rings, ringAt, run, unproj, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid, seg,
} = HL;

const L = 60, D = 30, H = 26, SX = [12, 30, 48], SW = 4.5, MAX = 14, N = 24;
const REST = [7, 2, 11], FAV = 1;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.8);
  fit(C, [[-6, -6, -4], [L + 6, D + 6, -4], [-6, D + 6, -4], [L + 6, -6, -4], [0, D / 2, H + MAX], [L, D / 2, H + MAX], [L, D + MAX * 0.6, 12]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  // the flatbed, then the crate with its plank seams on the near faces
  let [r, i] = rings(-6, -6, L + 6, D + 6, 2, 1);
  put(solid(g), prism(P, front, r, i, -4, 0));
  [r, i] = rings(0, 0, L, D, 2.4, 1.2);
  const crate = solid(g);
  put(crate, prism(P, front, r, i, 0, H));
  mk("path", { class: "nf lo", d: open(ringAt(P, run(r, front), H / 3)) + open(ringAt(P, run(r, front), (2 * H) / 3)) }, crate.g);

  // a strap: over the top, down the near face, bulging out by its slack
  function path(x, s) {
    const pts = [];
    for (let k = 0; k <= N; k++) { const t = k / N; pts.push([x, t * D, H + s * Math.sin(Math.PI * t)]); }
    for (let k = 1; k <= N; k++) { const t = k / N; pts.push([x, D + s * 0.6 * Math.sin(Math.PI * t), H - t * (H - 1)]); }
    return pts;
  }
  const straps = SX.map((x) => {
    const grp = mk("g", {}, g);
    return { x, sil: mk("path", { class: "sil" }, grp), rat: solid(grp), s: tween(REST[SX.indexOf(x)]), last: NaN };
  });
  function draw(st, s) {
    if (s === st.last) return;
    st.last = s;
    const a = path(st.x - SW / 2, s).map((p) => P(...p)), b = path(st.x + SW / 2, s).map((p) => P(...p)).reverse();
    st.sil.setAttribute("d", poly(a.concat(b)));
    const yf = D + s * 0.6 * Math.sin(Math.PI * ((H - 12) / (H - 1)));
    const [rr, ri] = rings(st.x - 3.5, yf, st.x + 3.5, yf + 3, 1, 0.5);
    put(st.rat, prism(P, front, rr, ri, 8, 15));
    st.rat.cr.setAttribute("d", st.rat.cr.getAttribute("d") + seg(P(st.x, yf + 3, 15), P(st.x, yf + 3 + 3 + s * 0.4, 18 + s * 0.3)));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    straps.forEach((st) => { draw(st, tval(st.s, now)); if (!tdone(st.s, now)) moving = true; });
    return moving;
  });
  bag.add(B.unregister);

  function hit([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, H);
    if (x < -8 || x > L + 8 || y < -12 || y > D + 24) return -1;
    let best = -1, bd = 1e9;
    SX.forEach((xs, k) => { const d = Math.abs(P(xs, D / 2, H)[0] - sx); if (d < bd) { bd = d; best = k; } });
    return best;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    straps.forEach((st, k) => {
      tset(st.s, a < 0 ? REST[k] : k === a ? 0 : MAX, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      st.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "strap " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = clamp(v, 0, 90); }, destroy: bag.dispose };
}

hairline({
  name: "strapping",
  means: "Ratchet straps over a crate: the strap under the pointer ratchets down tight, the others throw slack after it.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[164, 115], [200, 133], [236, 151], null],
  mount,
});
