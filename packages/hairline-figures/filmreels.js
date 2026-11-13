/**
 * Film reels: an editing bench with three reels on spindles and a strip of
 * film running between them along their front rims. Each reel is a flat disc
 * with a hub and three windows. The pointer picks a reel by where it stands:
 * it lifts on its spindle and turns, the strips on either side of it pull
 * tight, and its neighbours turn a little, staggered from it. At rest the
 * strips hang slack, unevenly, and reel 2 is bright. The slider is the
 * stagger.
 *
 * The pattern: one of many in a single row (bookshelf); the pick is the reel
 * whose resting centre is nearest the pointer's x on screen.
 */
const {
  Cam, circ, fit, poly, prism, proj, facing, rings, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const RX = [22, 76, 130], RR = [18, 13, 17], CY = 26, Z0 = 11, T = 3, FAV = 1;
const REST_A = [0.3, 1.1, 2.0], SLACK = [3.5, 2];
const disc = (x, y, r, n = 48) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.0);
  fit(C, [[-2, 2, 0], [152, 52, 0], [152, 2, 0], [-2, 52, 0], [0, 0, Z0 + 14], [150, 0, Z0 + 14]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(-2, 2, 152, 52, 4, 1.4);
  put(solid(g), prism(P, front, br, bi, 0, 6));

  const reels = RX.map((cx, k) => {
    put(solid(g), prism(P, front, disc(cx, CY, 2, 20), null, 6, Z0 + 6));
    const el = solid(g), hub = mk("path", { class: "nf lo" }, el.g);
    return { k, cx, R: RR[k], el, hub, z: tween(k === FAV ? 2 : 0), a: tween(REST_A[k]), last: "" };
  });
  const strips = [0, 1].map((j) => ({ j, el: mk("path", { class: "lo" }, g), s: tween(SLACK[j]), last: "" }));

  function drawReel(r, z, a) {
    const key = z.toFixed(2) + "," + a.toFixed(3);
    if (key === r.last) return;
    r.last = key;
    put(r.el, prism(P, front, disc(r.cx, CY, r.R), disc(r.cx, CY, r.R - 1.2), Z0 + z, Z0 + z + T));
    const top = Z0 + z + T, w = (rad, x, y, n = 18) => poly(circ(rad, n).map((q) => P(x + q.u, y + q.v, top)));
    let d = w(3, r.cx, CY);
    for (let i = 0; i < 3; i++) {
      const b = a + (i * Math.PI * 2) / 3, m = r.R * 0.56;
      d += w(r.R * 0.24, r.cx + m * Math.cos(b), CY + m * Math.sin(b));
    }
    r.hub.setAttribute("d", d);
  }
  function drawStrip(st, now) {
    const A = reels[st.j], Bq = reels[st.j + 1];
    const za = tval(A.z, now), zb = tval(Bq.z, now), s = tval(st.s, now);
    const key = [za, zb, s].map((v) => v.toFixed(2)).join();
    if (key === st.last) return;
    st.last = key;
    const up = [], dn = [];
    for (let i = 0; i <= 10; i++) {
      const t = i / 10, x = A.cx + (Bq.cx - A.cx) * t, y = CY + A.R + (Bq.R - A.R) * t + 0.2;
      const z = Z0 + za + (zb - za) * t - s * 4 * t * (1 - t) + 0.2;
      up.push(P(x, y, z + T - 0.4)); dn.unshift(P(x, y, z));
    }
    st.el.setAttribute("d", poly(up.concat(dn)));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const r of reels) { drawReel(r, tval(r.z, now), tval(r.a, now)); if (!tdone(r.z, now) || !tdone(r.a, now)) moving = true; }
    for (const st of strips) { drawStrip(st, now); if (!tdone(st.s, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = reels.map((r) => P(r.cx, CY, Z0 + T));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const d = Math.abs(m[0] - sx); if (d < bd) { bd = d; best = k; } });
    return bd < 42 && Math.abs(mids[best][1] - sy) < 70 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    reels.forEach((r, k) => {
      const d = Math.abs(k - a), delay = from < 0 ? 0 : Math.abs(k - from) * stag;
      tset(r.z, a < 0 ? (k === FAV ? 2 : 0) : d === 0 ? 9 : 1.5, now, delay);
      tset(r.a, REST_A[k] + (a < 0 ? 0 : d === 0 ? 2.4 : 0.6), now, delay);
      r.el.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    strips.forEach((st) => tset(st.s, a < 0 ? SLACK[st.j] : st.j === a || st.j + 1 === a ? 0 : 1.5, now, 0));
    read.textContent = a < 0 ? "rest" : "reel " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "filmreels",
  means: "Three film reels on a bench: the reel under the pointer lifts and turns, the film pulls tight, and its neighbours turn a little.",
  rules: [1, 2, 5, 8],
  range: [0, 45, 90],
  tour: [[150, 170], [200, 180], [250, 190], null],
  mount,
});
