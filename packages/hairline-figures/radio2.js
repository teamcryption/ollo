/**
 * Transistor radio: an upright pocket radio with a slotted speaker grille and
 * a round tuning dial on its front, and a telescopic antenna on a swivel at
 * its top corner. At rest the antenna lies folded along the lid, bright. The
 * pointer over the radio swings it up and pulls its three sections out. The
 * slider is how far the antenna extends.
 *
 * The pattern: one part answering (a 700ms tween for the discrete on/off),
 * hit on the rest box at three heights, which never move.
 */
const {
  Cam, circ, clamp, facing, fit, hull, lerp, poly, prism, proj, rad, rings, seg, unproj,
  tween, tset, tval, tdone, disposer, mk, pointer, put, register, solid,
} = HL;

const W = 70, D = 20, H = 44, BX = W - 6, BY = 5, FOLD = 54;
const reach = (v) => FOLD + 34 * v;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let ext = reach(value);
  const C = Cam(45, 0.5, 2.78);
  const tip = (t, L) => {
    const th = rad(lerp(86, 42, t)), ph = rad(lerp(180, 150, t));
    return [BX + L * Math.sin(th) * Math.cos(ph), BY + L * Math.sin(th) * Math.sin(ph), H + 3 + L * Math.cos(th)];
  };
  fit(C, [[0, 0, 0], [W, D, 0], [W, 0, H], [0, D, H], [0, 0, H], tip(1, reach(1)), tip(0, FOLD)], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  const [bo, bi] = rings(0, 0, W, D, 5, 1.4);
  put(solid(g), prism(P, front, bo, bi, 0, H));
  // speaker slots and the tuning dial on the front face
  let slots = "";
  for (let i = 0; i < 7; i++) slots += seg(P(7, D, 7 + i * 3.4), P(36, D, 7 + i * 3.4));
  mk("path", { class: "nf lo", d: slots }, g);
  mk("path", { class: "nf lo", d: poly(circ(10, 36).map((q) => P(54 + q.u, D, 19 + q.v))) }, g);
  mk("path", { class: "nf sil", d: seg(P(54, D, 19), P(54 - 5, D, 19 + 7)) }, g);
  // the swivel at the top corner
  put(solid(g), prism(P, front, circ(3, 24).map((q) => ({ ...q, u: q.u + BX, v: q.v + BY })), null, H, H + 3));

  const ant = mk("g", {}, g);
  const secs = [mk("path", { class: "sil" }, ant), mk("path", { class: "sil" }, ant), mk("path", { class: "sil" }, ant), mk("path", { class: "sil" }, ant)];
  for (const s of secs) s.classList.add("hi");
  const ball = (c, r) => {
    const o = [];
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * Math.PI * 2, cs = Math.cos(a) * r, sn = Math.sin(a) * r;
      o.push(P(c[0] + cs, c[1] + sn, c[2]), P(c[0] + cs, c[1], c[2] + sn), P(c[0], c[1] + cs, c[2] + sn));
    }
    return o;
  };
  const rod = (a, b, r) => poly(hull(ball(a, r).concat(ball(b, r * 0.85))));

  const tw = tween(0);
  let last = NaN, lastE = NaN;
  function draw(t) {
    if (t === last && ext === lastE) return;
    last = t; lastE = ext;
    const L = lerp(FOLD, ext, t), base = [BX, BY, H + 3], pt = (f) => {
      const e = tip(t, L * f);
      return e;
    };
    const fr = lerp(0.36, 0.34, t);
    secs[2].setAttribute("d", rod(pt(0.62), pt(1), 0.8));
    secs[1].setAttribute("d", rod(pt(fr * 0.9), pt(0.66), 1.15));
    secs[0].setAttribute("d", rod(base, pt(fr), 1.6));
    secs[3].setAttribute("d", poly(hull(ball(pt(1), 1.9))));
  }
  const B = register(stage, (dt, now) => { draw(tval(tw, now)); return !tdone(tw, now); });
  bag.add(B.unregister);

  let on = null;
  const label = () => "ant " + Math.round(ext / 10);
  function setOn(v) {
    if (v === on) return;
    on = v;
    tset(tw, v ? 1 : 0, performance.now(), 0);
    read.textContent = v ? label() : "rest";
    B.wake();
  }
  function hit([sx, sy]) {
    for (const z of [0, H / 2, H]) {
      const [x, y] = unproj(C, sx, sy, z);
      if (x > -3 && x < W + 3 && y > -3 && y < D + 3) return true;
    }
    return false;
  }
  setOn(false);
  draw(0);
  bag.add(pointer(stage, { move: (p) => setOn(hit(p)), leave: () => setOn(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { ext = reach(clamp(v, 0, 1)); if (on) read.textContent = label(); last = NaN; draw(tval(tw, performance.now())); B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "radio2",
  means: "A transistor radio: over it, the folded telescopic antenna swings up and pulls its sections out.",
  rules: [1, 3, 5, 8],
  range: [0.3, 0.8, 1],
  tour: [[160, 140], [201, 172], [228, 236], null],
  mount,
});
