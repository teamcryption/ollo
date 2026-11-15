/**
 * Airlock: a thick airlock door set in a bulkhead, with a locking wheel on
 * its face. The pointer turns the wheel and swings the door open on its
 * hinge, further the further right it goes. At rest the door is shut and
 * the wheel is bright.
 *
 * The pattern: one part swings on a hinge (swing).
 */
const { Cam, fit, hull, poly, proj, tdone, tset, tval, tween, disposer, mk, pointer, register } = HL;

const HX = -16, DW = 32, DH = 44, Z0 = 6, TH = 4, WR = 9;
function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let spin = value;
  const C = Cam(45, 0.5, 3.2);
  fit(C, [[-30, 0, 0], [30, 6, 0], [-30, 0, 58], [30, 6, 58], [-16, -34, 50], [-16, -34, 0]], 200, 168);
  const P = proj(C);
  const g = mk("g", {}, svg);
  const H = (list) => poly(hull(list.map((q) => P(q[0], q[1], q[2]))));
  const box = (x0, y0, z0, x1, y1, z1) => { const o = []; for (const x of [x0, x1]) for (const y of [y0, y1]) for (const z of [z0, z1]) o.push([x, y, z]); return o; };
  mk("path", { class: "sil", d: H(box(-30, 0, 0, 30, 6, 58)) }, g);
  mk("path", { class: "nf", d: H(box(-20, -1, Z0 - 2, 20, -1, Z0 + DH + 2)) }, g);
  mk("path", { class: "nf lo", d: H(box(-17, -1.2, Z0, 17, -1.2, Z0 + DH)) }, g);
  const door = mk("path", { class: "sil" }, g), face = mk("path", { class: "nf lo" }, g);
  const rim = mk("path", { class: "nf hi" }, g), spokes = mk("path", { class: "nf hi" }, g), hub = mk("path", { class: "nf hi" }, g);
  const ang = tween(0), wh = tween(0);
  let last = "";
  function draw(a, w) {
    const key = a.toFixed(4) + w.toFixed(4);
    if (key === last) return; last = key;
    const c = Math.cos(a), s = Math.sin(a);
    const W = (u, t, z) => [HX + u * c - t * s, -1.5 + u * s + t * c, z];
    const dp = []; for (const u of [0, DW]) for (const t of [0, -TH]) for (const z of [Z0, Z0 + DH]) dp.push(W(u, t, z));
    door.setAttribute("d", H(dp));
    face.setAttribute("d", poly([W(3, -TH - 0.1, Z0 + 3), W(DW - 3, -TH - 0.1, Z0 + 3), W(DW - 3, -TH - 0.1, Z0 + DH - 3), W(3, -TH - 0.1, Z0 + DH - 3)].map((q) => P(q[0], q[1], q[2]))) + "Z");
    const ring = (r) => { const o = []; for (let i = 0; i <= 32; i++) { const t = (i / 32) * Math.PI * 2; const q = W(DW / 2 + r * Math.cos(t), -TH - 3, Z0 + DH / 2 + r * Math.sin(t)); o.push(P(q[0], q[1], q[2])); } return o; };
    rim.setAttribute("d", poly(ring(WR)));
    hub.setAttribute("d", poly(ring(2)));
    let d = "";
    for (let k = 0; k < 3; k++) {
      const t = w + (k * Math.PI) / 3, A = W(DW / 2 + WR * Math.cos(t), -TH - 3, Z0 + DH / 2 + WR * Math.sin(t)), Bq = W(DW / 2 - WR * Math.cos(t), -TH - 3, Z0 + DH / 2 - WR * Math.sin(t));
      const pa = P(A[0], A[1], A[2]), pb = P(Bq[0], Bq[1], Bq[2]);
      d += "M" + pa[0].toFixed(1) + " " + pa[1].toFixed(1) + "L" + pb[0].toFixed(1) + " " + pb[1].toFixed(1);
    }
    spokes.setAttribute("d", d);
  }
  const B = register(stage, (_dt, now) => { draw(tval(ang, now), tval(wh, now)); return !(tdone(ang, now) && tdone(wh, now)); });
  bag.add(B.unregister);
  const L = P(-30, 0, 30)[0], R = P(30, 0, 30)[0];
  function act(p) {
    const now = performance.now();
    const f = p ? Math.max(0, Math.min(1, (p[0] - L) / (R - L))) : 0;
    tset(wh, f * Math.PI * (1 + spin), now, 0);
    tset(ang, -f * 1.9, now, f > 0 ? 250 : 0);
    read.textContent = p ? Math.round(f * 100) + "%" : "rest";
    B.wake();
  }
  act(null);
  bag.add(pointer(stage, { move: act, leave: () => act(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { spin = v; }, destroy: bag.dispose };
}

hairline({
  name: "spacesuit2",
  means: "An airlock door in a bulkhead: the pointer spins its locking wheel and swings the heavy door open on its hinge.",
  rules: [1, 2, 5, 6],
  range: [0, 1, 2],
  tour: [[139, 128], [207, 162], [275, 196], null],
  mount,
});
