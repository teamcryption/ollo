/**
 * Returns desk: a long counter with four returned parcels of different sizes
 * waiting on it. The pointer picks the parcel under it by screen x: that one
 * slides forward to the counter's front edge, turning square to the customer,
 * and the others slide back, spreading out from it. At rest the parcels sit
 * askew at mixed depths, one bright. The slider is how far the parcel comes.
 *
 * The pattern: a discrete choice (tween per parcel, staggered by distance);
 * the hit is each parcel's rest centre on screen, which never moves.
 */
const { Cam, fit, proj, facing, rings, prism, rrect, clamp, rad, tween, tset, tval, tdone, disposer, mk, pointer, put, register, solid } = HL;

const L = 56, D = 16, H = 26;
const BOX = [[14, 12, 10], [10, 10, 14], [18, 13, 8], [12, 11, 11]];
const XS = [-38, -13, 13, 38], RY = [-4, 2, -6, 0], RA = [-14, 9, 5, -10], FAV = 1;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 2.6);
  fit(C, [[-L, -D, 0], [L, D, 0], [-L, -D, H + 16], [L, D, H + 16]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [cr, ci] = rings(-L, -D, L, D, 3, 1.4);
  put(solid(g), prism(P, front, cr, ci, 0, H));
  const [tr, ti] = rings(-L - 2, -D - 2, L + 2, D + 2, 3, 1.2);
  put(solid(g), prism(P, front, tr, ti, H, H + 1.5));
  let amt = value;

  const parcels = BOX.map(([w, d, h], i) => {
    const s = solid(g);
    const base = rrect(-w / 2, -d / 2, w / 2, d / 2, 1.2, 4), inner = rrect(-w / 2 + 1, -d / 2 + 1, w / 2 - 1, d / 2 - 1, 0.6, 4);
    return { i, h, s, base, inner, tw: tween(0), drawn: NaN, sx: P(XS[i], RY[i], H + h / 2)[0] };
  });
  const turn = (ring, a, cx, cy) => {
    const c = Math.cos(a), s = Math.sin(a);
    return ring.map((q) => ({ u: cx + q.u * c - q.v * s, v: cy + q.u * s + q.v * c, nu: q.nu * c - q.nv * s, nv: q.nu * s + q.nv * c }));
  };
  function draw(p, f) {
    if (Math.abs(f - p.drawn) < 1e-4) return;
    p.drawn = f;
    const y = f >= 0 ? RY[p.i] + (D - 7 - RY[p.i]) * f : RY[p.i] + (RY[p.i] + D - 7) * f * 0.5;
    const a = rad(RA[p.i] * (1 - clamp(f, 0, 1)));
    put(p.s, prism(P, front, turn(p.base, a, XS[p.i], y), turn(p.inner, a, XS[p.i], y), H + 1.5, H + 1.5 + p.h));
  }

  const B = register(stage, (dt, now) => {
    let m = false;
    for (const p of parcels) { draw(p, tval(p.tw, now)); if (!tdone(p.tw, now)) m = true; }
    return m;
  });
  bag.add(B.unregister);

  let sel = null;
  function retarget() {
    const now = performance.now();
    for (const p of parcels) {
      const to = sel === null ? 0 : p.i === sel ? clamp(amt, 0.3, 1) : -0.6;
      tset(p.tw, to, now, sel === null ? 0 : Math.abs(p.i - sel) * 45);
      p.s.sil.classList.toggle("hi", sel === null ? p.i === FAV : p.i === sel);
    }
    read.textContent = sel === null ? "rest" : "rtn " + (sel + 1);
    B.wake();
  }

  bag.add(pointer(stage, {
    move: (q) => {
      let best = null, bd = Infinity;
      for (const p of parcels) { const d = Math.abs(q[0] - p.sx); if (d < bd) { bd = d; best = p.i; } }
      const next = bd > 50 || q[1] < 40 || q[1] > 290 ? null : best;
      if (next !== sel) { sel = next; retarget(); }
    },
    leave: () => { sel = null; retarget(); },
  }));
  bag.add(() => svg.replaceChildren());
  retarget();
  return { set: (v) => { amt = v; retarget(); }, destroy: bag.dispose };
}

hairline({
  name: "returnsbin",
  means: "A returns counter with four parcels: the one under the pointer slides forward squared up, the others slide back.",
  rules: [1, 2, 5, 8],
  range: [0.3, 1, 1],
  tour: [[137, 103], [235, 148], [270, 176], null],
  mount,
});
