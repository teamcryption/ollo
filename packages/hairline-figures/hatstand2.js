/**
 * Caps rack: four caps on posts of different heights along a shop plinth,
 * each brim swung its own way. The pointer picks a cap by where it stands:
 * it lifts off its post and turns its brim to face the viewer, and the caps
 * beside it turn a little, staggered from it. At rest one cap is bright.
 * The slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, circ, fit, facing, hull, open, poly, prism, proj, rad, rings, ringAt, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 4, STEP = 36, R = 12, BZ = 5, FAV = 2, LIFT = 9;
const HS = [30, 40, 34, 44], REST = [-15, 100, 20, 115];
const X1 = (N - 1) * STEP + 2 * R;
const disc = (x, y, r, n = 28) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 1.9);
  fit(C, [[-6, -6, 0], [X1 + 6, 2 * R + 6, 0], [X1 + 6, -6, 0], [-6, 2 * R + 6, 0], [R, R, BZ + 44 + LIFT + 14], [X1 - R, R, BZ + 44 + LIFT + 14]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [pr, pi] = rings(-6, -6, X1 + 6, 2 * R + 6, 6, 2);
  put(solid(g), prism(P, front, pr, pi, 0, BZ));

  const items = [];
  for (let k = 0; k < N; k++) {
    const x = R + k * STEP, y = R, grp = mk("g", {}, g);
    const [r0, r1] = [disc(x, y, 2.2, 12), disc(x, y, 1.4, 12)];
    put(solid(grp), prism(P, front, r0, r1, BZ, BZ + HS[k]));
    const sil = mk("path", { class: "sil" }, grp), crown = mk("path", { class: "nf lo" }, grp);
    const btn = mk("path", { class: "nf" }, grp);
    items.push({ k, x, y, h: BZ + HS[k], sil, crown, btn, z: tween(0), a: tween(REST[k]), last: "" });
  }

  function draw(it, lift, ang) {
    const key = lift.toFixed(2) + "|" + ang.toFixed(2);
    if (key === it.last) return;
    it.last = key;
    const z = it.h + lift, th = rad(ang), dome = [], brim = [];
    for (let i = 0; i <= 6; i++) { const t = (i / 6) * (Math.PI / 2); dome.push(...ringAt(P, disc(it.x, it.y, R * Math.cos(t)), z + R * 0.85 * Math.sin(t))); }
    for (let i = 0; i < 48; i++) {
      const ph = (i / 48) * 2 * Math.PI, c = Math.cos(ph - th), r = R + 0.8 + 10 * Math.pow(Math.max(0, c), 1.6);
      brim.push(P(it.x + r * Math.cos(ph), it.y + r * Math.sin(ph), z + 0.6 * Math.max(0, c)));
    }
    it.sil.setAttribute("d", poly(hull(dome.concat(brim))));
    it.crown.setAttribute("d", poly(hull(dome)));
    const top = z + R * 0.85;
    it.btn.setAttribute("d", poly(hull(ringAt(P, disc(it.x, it.y, 1.8, 12), top).concat(ringAt(P, disc(it.x, it.y, 1.8, 12), top + 1.6)))));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.z, now), tval(it.a, now)); if (!tdone(it.z, now) || !tdone(it.a, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.x, it.y, it.h));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 32 && Math.abs(mids[best][1] - sy) < 80 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), d = from < 0 ? 0 : Math.abs(k - from) * stag;
      tset(it.z, a >= 0 && dd === 0 ? LIFT : 0, now, d);
      tset(it.a, a < 0 ? REST[k] : dd === 0 ? 45 : dd === 1 ? (REST[k] + 45) / 2 : REST[k], now, d);
      it.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "cap " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "hatstand2",
  means: "Four caps on posts along a shop plinth: the cap under the pointer lifts and turns its brim to face you; its neighbours half-turn.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[127, 111], [224, 150], [273, 151], null],
  mount,
});
