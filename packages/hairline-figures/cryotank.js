/**
 * Cryotank: a squat liquid-nitrogen dewar, a wide drum with a shoulder, a
 * narrow neck and a cap. The pointer over the dewar lifts the cap aside and
 * draws a canister of canes up out of the neck on its hooked handle. At rest
 * the cap sits ajar, bright. The slider is how far the canister rises.
 *
 * The pattern: one object, one moving part (cloches).
 */
const {
  Cam, circ, fit, facing, hull, open, poly, prism, proj, ringAt, run, seg, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const BR = 30, BH = 34, SH = 44, NR = 9, NT = 50, CR = 6.5, CLEN = 44;
const disc = (x, y, r, n = 40) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.8);
  fit(C, [[-BR, -BR, 0], [BR, BR, 0], [BR, -BR, 0], [-BR, BR, 0], [0, 0, NT + 44 + 13], [0, -40, NT + 26]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  // the drum, its shoulder and the neck
  put(solid(g), prism(P, front, disc(0, 0, BR + 1), disc(0, 0, BR - 0.6), 0, 3));
  put(solid(g), prism(P, front, disc(0, 0, BR), disc(0, 0, BR - 1.6), 3, BH));
  const foot = disc(0, 0, BR), top = disc(0, 0, NR + 2), inner = disc(0, 0, NR + 0.6);
  put(solid(g), { sil: poly(hull(ringAt(P, foot, BH).concat(ringAt(P, top, SH)))), crease: open(ringAt(P, run(inner, front), SH)) });
  put(solid(g), prism(P, front, disc(0, 0, NR), disc(0, 0, NR - 1.4), SH, NT));
  mk("path", { d: poly(ringAt(P, disc(0, 0, NR - 2), NT)), class: "nf lo" }, g);

  // the canister rises out of the neck; the cap swings aside
  const can = mk("g", {}, g);
  const cs = solid(can), canes = mk("path", { class: "nf lo" }, can), handle = mk("path", { class: "nf" }, can);
  const cap = mk("g", {}, g);
  const capS = solid(cap), knob = solid(cap);
  const tw = tween(0);
  let last = NaN;

  function draw(t) {
    const key = t * 1000 + reach;
    if (key === last) return;
    last = key;
    const lift = t * reach, ct = NT - 4 + lift;
    if (!(ct > NT + 0.6)) { for (const e of [cs.sil, cs.cr, canes, handle]) e.setAttribute("d", ""); }
    else {
      put(cs, prism(P, front, disc(0, 0, CR), disc(0, 0, CR - 1.2), NT, ct));
      let d = "";
      for (const a of [0.35, 0.785, 1.22]) {
        const x = Math.cos(a) * CR, y = Math.sin(a) * CR;
        if (ct - 3 > NT + 1) d += seg(P(x, y, NT + 0.5), P(x, y, ct - 3));
      }
      canes.setAttribute("d", d);
      handle.setAttribute("d", open([P(0, 0, ct), P(0, 0, ct + 12), P(2, -2, ct + 15), P(4.5, -2.5, ct + 14), P(5, -1, ct + 11.5)]));
    }
    const cy = -40 * t, cz = NT + 2.4 + 24 * Math.sin(t * Math.PI / 2) - (t > 0.6 ? 0 : 0);
    put(capS, prism(P, front, disc(1.5 * (1 - t), cy, NR + 2.5), disc(1.5 * (1 - t), cy, NR + 1), cz, cz + 4));
    put(knob, prism(P, front, disc(1.5 * (1 - t), cy, 3), disc(1.5 * (1 - t), cy, 2), cz + 4, cz + 7));
  }

  const B = register(stage, (_dt, now) => { draw(tval(tw, now)); return !tdone(tw, now); });
  bag.add(B.unregister);

  const mid = P(0, 0, BH / 2), topY = P(0, 0, NT + 30)[1];
  const hit = ([sx, sy]) => Math.abs(sx - mid[0]) < BR * 2.6 && sy > topY && sy < P(BR, BR, 0)[1] + 8;

  let on = null;
  function setActive(a) {
    if (a === on) return;
    on = a;
    tset(tw, a ? 1 : 0, performance.now(), 0);
    capS.sil.classList.toggle("hi", !a);
    cs.sil.classList.toggle("hi", a);
    read.textContent = a ? "can up" : "rest";
    B.wake();
  }
  setActive(false);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; last = NaN; B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "cryotank",
  means: "A liquid-nitrogen dewar: the pointer lifts the cap aside and draws a canister of canes up out of the neck.",
  rules: [1, 4, 5, 8],
  range: [24, 40, 44],
  tour: [[200, 218], [200, 150], [150, 250], null],
  mount,
});
