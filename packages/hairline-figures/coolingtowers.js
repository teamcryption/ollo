/**
 * Cooling towers: three hyperbolic towers in a row, each with a puff of
 * steam over its rim. The pointer picks a tower by where it stands: its
 * steam billows up and swells, and the towers beside it puff a little,
 * staggered from it. At rest the middle tower steams, bright. The slider is
 * the stagger.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, circ, fit, hull, poly, open, proj, ringAt, tdone, tset, tval, tween,
  disposer, mk, pointer, register,
} = HL;

const N = 3, STEP = 62, H = 58, R0 = 21, LIFT = 26, FAV = 1, REST = [5, LIFT * 0.6, 2];
const disc = (x, y, r, n = 32) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));
const rad = (t) => (t < 0.72 ? 12 + 9 * ((0.72 - t) / 0.72) ** 1.6 : 12 + 2.2 * ((t - 0.72) / 0.28) ** 2);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 1.62);
  const top = H + LIFT + 30;
  fit(C, [[-R0, -R0, 0], [(N - 1) * STEP + R0, R0, 0], [-R0, R0, 0], [(N - 1) * STEP + R0, -R0, 0], [0, 0, top], [(N - 1) * STEP, 0, top]], 200, 166);
  const P = proj(C);
  const g = mk("g", {}, svg);

  const items = [];
  for (let k = 0; k < N; k++) {
    const x = k * STEP, y = 0, grp = mk("g", {}, g);
    // shell: left edge up, right edge down, front base arc
    const L = [], Rt = [];
    for (let i = 0; i <= 16; i++) {
      const t = i / 16, pts = ringAt(P, disc(x, y, rad(t), 36), t * H);
      let lo = pts[0], hi = pts[0];
      for (const p of pts) { if (p[0] < lo[0]) lo = p; if (p[0] > hi[0]) hi = p; }
      L.push(lo); Rt.push(hi);
    }
    const base = ringAt(P, disc(x, y, R0, 48), 0).filter((p) => p[1] >= (L[0][1] + Rt[0][1]) / 2 - 0.01).sort((a, b) => b[0] - a[0]);
    mk("path", { d: poly(L.concat(Rt.slice().reverse(), base)), class: "sil" + (k === FAV ? "" : "") }, grp);
    const shell = grp.lastChild;
    const rimR = rad(1);
    mk("path", { d: poly(ringAt(P, disc(x, y, rimR, 40), H)), class: "lo" }, grp);
    mk("path", { d: open(ringAt(P, disc(x, y, rimR - 1.6, 40), H - 0.5).filter((_, i) => i > 20)), class: "nf lo" }, grp);
    // a band of struts at the foot
    const legs = [];
    for (let a = 0; a < 12; a++) {
      const th = (a / 12) * Math.PI * 2, c = Math.cos(th), s = Math.sin(th);
      if (c + s < -0.2) continue;
      legs.push("M" + P(x + c * R0, y + s * R0, 0).join(",") + "L" + P(x + c * (R0 - 0.6), y + s * (R0 - 0.6), 5).join(","));
    }
    mk("path", { d: legs.join(""), class: "nf lo" }, grp);
    const puff = mk("path", { class: "" }, grp), puff2 = mk("path", { class: "" }, grp);
    items.push({ k, x, y, shell, puff, puff2, z: tween(REST[k]), last: NaN });
  }

  function blob(cx, cy, cz, r) {
    const pts = [];
    for (const [dx, dy, dz, f] of [[0, 0, 0, 1], [r * 0.5, -r * 0.3, r * 0.35, 0.75], [-r * 0.45, r * 0.4, r * 0.25, 0.7]]) {
      for (let i = -3; i <= 3; i++) {
        const a = (i / 3) * (Math.PI / 2), rr = r * f;
        pts.push(...ringAt(P, disc(cx + dx, cy + dy, rr * Math.cos(a), 20), cz + dz + rr * 0.8 * Math.sin(a)));
      }
    }
    return poly(hull(pts));
  }

  function draw(it, lift) {
    if (lift === it.last) return;
    it.last = lift;
    const f = lift / LIFT;
    it.puff.setAttribute("d", blob(it.x, it.y, H + 4 + lift * 0.35, 8 + 4 * f));
    it.puff2.setAttribute("d", blob(it.x + 2, it.y - 2, H + 14 + lift, 5 + 9 * f));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.z, now)); if (!tdone(it.z, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.x, it.y, H / 2));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 40 && Math.abs(mids[best][1] - sy) < 90 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), z = a < 0 ? REST[k] : dd === 0 ? LIFT : dd === 1 ? 7 : 1;
      tset(it.z, z, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.shell.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "tower " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "coolingtowers",
  means: "Three cooling towers in a row: the one under the pointer billows a tall plume of steam, and its neighbours puff a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[129, 158], [200, 193], [271, 229], null],
  mount,
});
