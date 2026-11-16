/**
 * Ship wheel: an eight-spoked helm on its pedestal. The pointer's side turns
 * the wheel on a spring; at rest it sits a little off true, its king spoke
 * bright. The slider is how far one sweep turns it.
 */
const { Cam, fit, proj, facing, prism, rings, poly, open, seg, clamp, spring, stepS, disposer, mk, solid, put, register, pointer } = HL;

const R = 30, RI = 26, H = 40, Z0 = 58, N = 8, REST = 0.22;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 2.75);
  fit(C, [[-H, 0, Z0 - H], [H, 0, Z0 + H], [0, 0, 0], [-12, -12, 0], [12, 12, 0]], 200, 160);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const W = (r, a, y = 0) => P(r * Math.cos(a), y, Z0 + r * Math.sin(a));
  const ringP = (r, y) => { const o = []; for (let i = 0; i < 64; i++) o.push(W(r, (i / 64) * Math.PI * 2, y)); return o; };
  const [b0, b1] = rings(-9, -14, 9, -4, 3, 1);
  put(solid(g), prism(P, front, b0, b1, 0, 3));
  const [c0, c1] = rings(-4, -11, 4, -6, 2, 0.8);
  put(solid(g), prism(P, front, c0, c1, 3, Z0 - 2));
  put(solid(g), prism(P, front, rings(-3, -6, 3, 0, 1.5, 0.6)[0], null, Z0 - 3, Z0 + 3));
  const back = mk("path", { class: "nf sil", d: poly(ringP(R, -1.5)) }, g);
  const rim = solid(g);
  rim.sil.setAttribute("fill-rule", "evenodd");
  const spokes = mk("path", { class: "nf sil", d: "" }, g);
  const king = mk("path", { class: "nf sil", d: "" }, g);
  const hub = solid(g);
  hub.sil.setAttribute("d", poly(ringP(5, 1)));
  hub.cr.setAttribute("d", poly(ringP(2.2, 1)));
  const sp = spring(REST, { k: 90, c: 14 });
  let drawn = NaN;
  function draw() {
    const a0 = sp.x;
    if (Math.abs(a0 - drawn) < 1e-4) return;
    drawn = a0;
    rim.sil.setAttribute("d", poly(ringP(R, 0)) + poly(ringP(RI, 0)));
    let d = "", k = "";
    for (let i = 0; i < N; i++) {
      const a = a0 + (i / N) * Math.PI * 2 + Math.PI / 2, s = seg(W(5, a), W(RI, a)) + seg(W(R, a, 0), W(H - 4, a, 0));
      const hd = poly([W(R + 1, a + 0.05), W(H, a + 0.04), W(H + 1.5, a), W(H, a - 0.04), W(R + 1, a - 0.05)]);
      if (i === 0) k = s + hd; else d += s + hd;
    }
    spokes.setAttribute("d", d);
    king.setAttribute("d", k);
  }
  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(); return m; });
  bag.add(B.unregister);
  const cx = P(0, 0, Z0)[0];
  function set(on, x) {
    sp.t = on ? REST - clamp((x - cx) / 70, -1, 1) * 2.4 * value : REST;
    king.classList.toggle("hi", !on);
    rim.sil.classList.toggle("hi", on);
    read.textContent = on ? (sp.t < REST ? "port" : "starb'd") : "rest";
    B.wake();
  }
  bag.add(pointer(stage, { move: (p) => set(true, p[0]), leave: () => set(false) }));
  bag.add(() => svg.replaceChildren());
  set(false);
  return { set: (v) => { value = v; }, destroy: bag.dispose };
}

hairline({
  name: "shipwheel",
  means: "A ship's helm on its pedestal: the pointer's side turns the wheel, and the rim lights as it turns.",
  rules: [1, 3, 5],
  range: [0.4, 1, 1.5],
  tour: [[258, 137], [140, 120], [278, 146], null],
  mount,
});
