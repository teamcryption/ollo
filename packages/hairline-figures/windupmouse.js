/**
 * Wind-up mouse: a clockwork mouse with round ears, a curled tail and a
 * winding key on its back. The pointer over it lets the spring go: the key
 * spins, the tail swings and the mouse scoots forward across the floor. At
 * rest it sits wound, its key bright. The slider is how far it scoots.
 *
 * The pattern: one part turning while the whole slides (spring).
 */
const { Cam, clamp, fit, hull, open, poly, proj, seg, spring, stepS, disposer, mk, pointer, register } = HL;

const BC = 15, KX = -8;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let far = 20 + 25 * value;
  const C = Cam(45, 0.5, 2.95);
  fit(C, [[-50, -16, 0], [73, 16, 0], [-50, 16, 0], [73, -16, 0], [-8, 0, 34], [37, 0, 34]], 200, 165);
  const P = proj(C);
  const g = mk("g", {}, svg);
  const track = mk("path", { class: "dash" }, g);
  const tail = mk("path", { class: "nf" }, g);
  const earF = mk("path", { class: "sil" }, g);
  const body = mk("path", { class: "sil" }, g);
  const spine = mk("path", { class: "nf lo" }, g);
  const shaft = mk("path", { class: "nf" }, g);
  const key = mk("path", { class: "sil hi" }, g);
  const earN = mk("path", { class: "sil" }, g);
  const nose = mk("path", {}, g);
  const go = spring(0, { k: 60, c: 13 });
  let last = "";

  function draw() {
    const key0 = go.x.toFixed(4);
    if (key0 === last) return;
    last = key0;
    const s = go.x, Q = (x, y, z) => P(x + s, y, z);
    const pts = [];
    for (const z of [0, 4, 8, 11, 13.5, BC]) {
      const r = Math.sqrt(Math.max(0, 1 - (z / BC) ** 2));
      for (let k = 0; k < 32; k++) { const f = (k / 32) * Math.PI * 2, c = Math.cos(f); pts.push(Q(c * (c > 0 ? 28 : 22) * r, Math.sin(f) * 14 * r, z)); }
    }
    body.setAttribute("d", poly(hull(pts)));
    spine.setAttribute("d", open([-20, -10, 0, 10, 20].map((x) => Q(x, 0, BC * Math.sqrt(1 - (x / (x > 0 ? 28 : 22)) ** 2)))));
    const ear = (y) => poly(Array.from({ length: 24 }, (_, k) => { const f = (k / 24) * Math.PI * 2; return Q(9 - Math.sin(f) * 1.5, y + Math.cos(f) * 6, 18 + Math.sin(f) * 6); }));
    earF.setAttribute("d", ear(-7));
    earN.setAttribute("d", ear(7));
    nose.setAttribute("d", poly(hull(Array.from({ length: 12 }, (_, k) => { const f = (k / 12) * Math.PI * 2; return Q(28 + Math.cos(f) * 1.6, Math.sin(f) * 2.2, 3 + Math.sin(f) * 2); }))));
    const sw = Math.sin(s * 0.35) * 0.9;
    tail.setAttribute("d", open(Array.from({ length: 14 }, (_, k) => { const t = k / 13; return Q(-21 - 24 * t, (14 * Math.sin(t * Math.PI * 1.3) + 4 * t) * (1 + sw) * 0.8, 3 + 2 * Math.sin(t * Math.PI)); })));
    const phi = -0.8 + s * 0.22, dx = Math.cos(phi), dy = Math.sin(phi), bow = [];
    for (const sg of [-1, 1]) for (let k = 0; k < 20; k++) { const f = (k / 20) * Math.PI * 2; bow.push(Q(KX + dx * (sg * 5 + Math.cos(f) * 4.5), dy * (sg * 5 + Math.cos(f) * 4.5), 28 + Math.sin(f) * 4.5)); }
    key.setAttribute("d", poly(hull(bow)));
    shaft.setAttribute("d", seg(Q(KX, 0, 14), Q(KX, 0, 24)));
    track.setAttribute("d", seg(P(30 + s, 0, 0), P(32 + far, 0, 0)));
  }

  const B = register(stage, (dt) => { const m = stepS(go, dt); draw(); return m; });
  bag.add(B.unregister);
  draw();

  const box = [[-50, -16, 0], [30, 16, 0], [-50, 16, 0], [30, -16, 0], [KX, 0, 34]].map((q) => P(...q));
  const bx0 = Math.min(...box.map((q) => q[0])) - 12, bx1 = Math.max(...box.map((q) => q[0])) + 12;
  const by0 = Math.min(...box.map((q) => q[1])) - 12, by1 = Math.max(...box.map((q) => q[1])) + 12;
  function onMove([sx, sy]) {
    if (sx < bx0 || sx > bx1 || sy < by0 || sy > by1) return onLeave();
    go.t = far;
    read.textContent = "run " + Math.round(far);
    B.wake();
  }
  function onLeave() { go.t = 0; read.textContent = "rest"; B.wake(); }
  read.textContent = "rest";
  bag.add(pointer(stage, { move: onMove, leave: onLeave }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { far = clamp(20 + 25 * v, 20, 45); if (go.t) go.t = far; last = ""; draw(); B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "windupmouse",
  means: "A wind-up mouse: the pointer lets its spring go, the key spins, the tail swings and the mouse scoots across the floor.",
  rules: [1, 3, 5, 8],
  range: [0, 0.7, 1],
  tour: [[159, 76], [130, 130], [197, 197], null],
  mount,
});
