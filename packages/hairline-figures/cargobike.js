/**
 * Cargo bike: a long-john bike with a deep box slung low between the rider
 * and a small front wheel, its lid hinged along the box's back edge. Near the
 * pointer the lid swings up and back toward the saddle. At rest it sits a
 * crack open, bright. The slider is how far it opens.
 *
 * The pattern: one lid opening on a hinge (open).
 */
const { Cam, fit, proj, rings, prism, facing, tween, tset, tval, tdone, poly, open, seg, fillet, rad, disposer, mk, pointer, put, register, solid, flatDot, place } = HL;

const RR = 14, FR = 10, FXW = 84, B0 = 32, B1 = 72, W = 13, ZB = 14, ZT = 36, L = B1 - B0;
function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 2.65);
  fit(C, [[-RR - 4, -W - 4, 0], [FXW + FR + 4, W + 4, 0], [-RR - 4, 0, 52], [FXW + FR + 4, 0, 52], [B0, 0, ZT + L + 2]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const wheel = (cx, rr, n) => {
    const o = [], i = [], s = [];
    for (let k = 0; k < 40; k++) { const t = (k / 40) * Math.PI * 2; o.push(P(cx + rr * Math.cos(t), 0, rr + rr * Math.sin(t))); i.push(P(cx + (rr - 2.4) * Math.cos(t), 0, rr + (rr - 2.4) * Math.sin(t))); }
    for (let k = 0; k < n; k++) { const t = 0.3 + (k / n) * Math.PI * 2; s.push(seg(P(cx, 0, rr), P(cx + (rr - 2.4) * Math.cos(t), 0, rr + (rr - 2.4) * Math.sin(t)))); }
    mk("path", { class: "sil", d: poly(o) + poly(i) }, g);
    mk("path", { class: "nf lo", d: s.join("") }, g);
  };
  wheel(0, RR, 8);
  mk("path", { class: "nf sil", d: open([P(0, 0, RR), P(14, 0, 22), P(B0 - 2, 0, ZB + 2)]) + seg(P(14, 0, 22), P(10, 0, 44)) + seg(P(0, 0, RR), P(10, 0, 40)) + seg(P(14, 0, 22), P(B0 - 2, 0, 40)) }, g);
  mk("path", { class: "sil", d: poly(fillet([P(2, -4, 45), P(16, -3, 45), P(16, 3, 45), P(2, 4, 45)], [1.5, 1.5, 1.5, 1.5])) }, g);
  const [br, bi] = rings(B0, -W, B1, W, 3, 1.4);
  put(solid(g), prism(P, front, br, bi, ZB, ZT));
  const lid = mk("path", { class: "sil" }, g);
  const lidT = mk("path", { class: "nf lo" }, g);
  mk("path", { class: "nf sil", d: seg(P(B1, 0, ZB + 3), P(FXW, 0, FR)) + seg(P(B1 + 3, 0, ZT), P(B1 + 6, 0, 50)) + seg(P(B1 + 6, -12, 50), P(B1 + 6, 12, 50)) + seg(P(B1 + 3, 0, ZT), P(FXW, 0, FR)) }, g);
  wheel(FXW, FR, 6);
  const dot = flatDot(g, C, 2, "dot off");
  place(dot, P((B0 + B1) / 2, W + 6, 0));
  const tw = tween(10);
  let drawn = NaN, reach = value, on = false;
  function draw(a) {
    if (Math.abs(a - drawn) < 1e-3) return;
    drawn = a;
    const c = Math.cos(rad(a)), s = Math.sin(rad(a));
    const q = (y, d) => P(B0 + L * c - d * s, y, ZT + L * s + d * c);
    const h = (y, d) => P(B0 - d * s, y, ZT + d * c);
    lid.setAttribute("d", poly(fillet([h(-W - 1, 1.6), q(-W - 1, 1.6), q(W + 1, 1.6), h(W + 1, 1.6)], [1, 2.5, 2.5, 1])));
    lidT.setAttribute("d", open([h(W + 1, 0), q(W + 1, 0), q(-W - 1, 0)]));
  }
  const B = register(stage, (_dt, now) => { draw(tval(tw, now)); return !tdone(tw, now); });
  bag.add(B.unregister);
  const lo = P(-RR - 4, 0, 0), hi = P(FXW + FR, 0, 0), top = P(B0, 0, 52);
  function set(o) {
    on = o;
    tset(tw, on ? 40 + 75 * reach : 10, performance.now(), 0);
    lid.classList.add("hi");
    read.textContent = on ? "open" : "rest";
    B.wake();
  }
  bag.add(pointer(stage, {
    move: (p) => set(p[0] > lo[0] - 10 && p[0] < hi[0] + 30 && p[1] > top[1] - 30 && p[1] < hi[1] + 30),
    leave: () => set(false),
  }));
  bag.add(() => svg.replaceChildren());
  set(false); draw(10);
  return { set: (v) => { reach = v; if (on) { on = false; set(true); } }, destroy: bag.dispose };
}

hairline({
  name: "cargobike",
  means: "A long-john cargo bike: near the pointer the lid of its front box swings up and back toward the saddle.",
  rules: [1, 3, 5, 8],
  range: [0, 1, 1],
  tour: [[222, 153], [255, 195], [130, 165], null],
  mount,
});
