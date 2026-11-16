/**
 * Porthole: a round brass window set in a hull plate, its glass ring hung on
 * a hinge at the left. The pointer over the plate swings the glass open on a
 * spring; at rest it is shut, its latch bright. The slider is how far it opens.
 */
const { Cam, fit, proj, poly, seg, clamp, spring, stepS, disposer, mk, solid, register, pointer, unproj } = HL;

const R = 26, Z0 = 44, W = 46, NB = 8;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 2.6);
  fit(C, [[-W, 0, Z0 - W], [W, 0, Z0 + W], [-R, 2 * R + 4, Z0], [-R, 2 * R + 4, Z0 + R]], 200, 160);
  const P = proj(C);
  const g = mk("g", {}, svg);
  const circ = (cx, r, y = 0) => { const o = []; for (let i = 0; i < 56; i++) { const a = (i / 56) * Math.PI * 2; o.push(P(cx + r * Math.cos(a), y, Z0 + r * Math.sin(a))); } return o; };
  const sq = (h, y) => [P(-h, y, Z0 - h), P(h, y, Z0 - h), P(h, y, Z0 + h), P(-h, y, Z0 + h)];
  const back = solid(g);
  back.sil.setAttribute("d", poly(sq(W, -3)));
  const plate = solid(g);
  plate.sil.setAttribute("d", poly(sq(W, 0)));
  let rv = "";
  for (let i = 0; i < NB; i++) { const a = (i / NB) * Math.PI * 2 + 0.39; rv += poly([0, 1, 2, 3, 4, 5].map((j) => { const b = (j / 6) * Math.PI * 2; return P((R + 6) * Math.cos(a) + 1.6 * Math.cos(b), 0.5, Z0 + (R + 6) * Math.sin(a) + 1.6 * Math.sin(b)); })); }
  plate.cr.setAttribute("d", poly(circ(0, R + 9, 0)) + poly(circ(0, R - 2, 0)) + rv);
  const hole = mk("path", { class: "nf sil", d: poly(circ(0, R - 4, -3)) + seg(P(-R + 6, -3, Z0 + 6), P(-6, -3, Z0 + R - 6)) }, g);
  const hinge = solid(g);
  hinge.sil.setAttribute("d", poly([P(-R - 9, 1, Z0 - 5), P(-R - 3, 1, Z0 - 5), P(-R - 3, 1, Z0 + 5), P(-R - 9, 1, Z0 + 5)]));
  const glass = solid(g);
  const latch = mk("path", { class: "nf sil", d: "" }, g);
  const sp = spring(0.04, { k: 110, c: 16 });
  let drawn = NaN;
  function draw() {
    const th = sp.x;
    if (Math.abs(th - drawn) < 1e-4) return;
    drawn = th;
    const L = (u, w) => P(-R - 4 + u * Math.cos(th), 1 + u * Math.sin(th), Z0 + w);
    const ring = (r) => { const o = []; for (let i = 0; i < 56; i++) { const a = (i / 56) * Math.PI * 2; o.push(L(R + 4 + r * Math.cos(a), r * Math.sin(a))); } return o; };
    glass.sil.setAttribute("d", poly(ring(R + 3)));
    let cr = poly(ring(R - 3)) + seg(L(R - 6, -2), L(R + 2, 10)) + seg(L(R - 2, -8), L(R + 8, 6));
    for (let i = 0; i < 6; i++) { const a = (i / 6) * Math.PI * 2; cr += seg(L(R + 4 + (R - 1) * Math.cos(a), (R - 1) * Math.sin(a)), L(R + 4 + (R + 1.5) * Math.cos(a), (R + 1.5) * Math.sin(a))); }
    glass.cr.setAttribute("d", cr);
    latch.setAttribute("d", poly([L(2 * R + 5, -4), L(2 * R + 13, -4), L(2 * R + 13, 4), L(2 * R + 5, 4)]));
  }
  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(); return m; });
  bag.add(B.unregister);
  function set(on) {
    sp.t = on ? clamp(1.25 * value, 0.3, 1.9) : 0.04;
    latch.classList.toggle("hi", !on);
    glass.sil.classList.toggle("hi", on);
    read.textContent = on ? "open" : "rest";
    B.wake();
  }
  bag.add(pointer(stage, {
    move: (p) => { const [x] = unproj(C, p[0], p[1], 0); const s = P(0, 0, Z0); set(Math.abs(p[0] - s[0]) < 120 && Math.abs(p[1] - s[1]) < 120 && x > -999); },
    leave: () => set(false),
  }));
  bag.add(() => svg.replaceChildren());
  set(false);
  return { set: (v) => { value = v; }, destroy: bag.dispose };
}

hairline({
  name: "porthole",
  means: "A porthole in a hull plate: the pointer swings its glass ring open on the hinge, and the ring lights as it opens.",
  rules: [1, 3, 5],
  range: [0.4, 1, 1.5],
  tour: [[233, 160], [200, 130], [260, 180], null],
  mount,
});
