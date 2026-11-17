/**
 * Gas hob: a steel plate with four burners and a row of knobs along the
 * front. At rest one burner burns low, bright. The pointer picks a burner by
 * where it stands on the plate: its knob turns and its flame ring leaps up,
 * while the rest go out. The slider is how tall the flame burns.
 */
const { Cam, circ, fit, facing, poly, prism, proj, rings, tset, tval, tdone, tween, unproj, disposer, mk, pointer, put, register, solid } = HL;

const X = 76, Y = 70, PZ = 4, FAV = 1, LOW = 5, NT = 12;
const BUR = [[20, 18, 10], [56, 16, 8], [20, 44, 8], [56, 42, 10]];
const disc = (x, y, r, n = 36) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let tall = value;
  const C = Cam(45, 0.5, 2.75);
  fit(C, [[0, 0, 0], [X, Y, 0], [X, 0, 0], [0, Y, 0], [20, 18, 38], [56, 16, 38]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [pr, pi] = rings(0, 0, X, Y, 6, 2);
  put(solid(g), prism(P, front, pr, pi, 0, PZ));
  const order = BUR.map((b, k) => k).sort((a, b) => BUR[a][0] + BUR[a][1] - BUR[b][0] - BUR[b][1]);
  const bs = [];
  for (const k of order) {
    const [x, y, r] = BUR[k];
    put(solid(g), prism(P, front, disc(x, y, r + 2), disc(x, y, r), PZ, PZ + 1.5));
    const back = mk("g", {}, g), cap = solid(g), fr = mk("g", {}, g);
    put(cap, prism(P, front, disc(x, y, r * 0.65), disc(x, y, r * 0.65 - 1.2), PZ + 1.5, PZ + 4));
    const tongues = [];
    for (let i = 0; i < NT; i++) {
      const t = (i / NT) * 2 * Math.PI, isBack = Math.cos(t) + Math.sin(t) < 0;
      tongues.push({ t, el: mk("path", { class: "nf" }, isBack ? back : fr) });
    }
    bs[k] = { x, y, r, cap, tongues, h: tween(k === FAV ? LOW : 0), last: NaN };
  }
  // the knobs along the front edge
  const knobs = [0, 1, 2, 3].map((k) => {
    const x = 13 + k * 17, y = Y - 8, s = solid(g);
    put(s, prism(P, front, disc(x, y, 4.2, 28), disc(x, y, 3, 28), PZ, PZ + 3.5));
    const mark = mk("path", { class: "nf" }, g);
    return { x, y, mark, a: tween(k === FAV ? 0.6 : 0), last: NaN };
  });
  function draw(b, h) {
    if (h === b.last) return;
    b.last = h;
    const r0 = b.r * 0.65, z0 = PZ + 3;
    for (const tg of b.tongues) {
      if (h < 0.3) { tg.el.setAttribute("d", ""); continue; }
      const at = (rr, ang, z) => P(b.x + rr * Math.cos(ang), b.y + rr * Math.sin(ang), z);
      tg.el.setAttribute("d", poly([at(r0, tg.t - 0.2, z0), at(r0 + 1.2 + h * 0.18, tg.t - 0.08, z0 + h * 0.55), at(r0 + 1 + h * 0.3, tg.t, z0 + h), at(r0 + 1.2 + h * 0.18, tg.t + 0.08, z0 + h * 0.55), at(r0, tg.t + 0.2, z0)]));
    }
  }
  function drawKnob(kn, a) {
    if (a === kn.last) return;
    kn.last = a;
    const ang = -2.4 + a * 2.2, z = PZ + 3.5;
    kn.mark.setAttribute("d", `M${P(kn.x, kn.y, z)}L${P(kn.x + 3.2 * Math.cos(ang), kn.y + 3.2 * Math.sin(ang), z)}`);
  }
  const B = register(stage, (_dt, now) => {
    let m = false;
    bs.forEach((b) => { draw(b, tval(b.h, now)); if (!tdone(b.h, now)) m = true; });
    knobs.forEach((kn) => { drawKnob(kn, tval(kn.a, now)); if (!tdone(kn.a, now)) m = true; });
    return m;
  });
  bag.add(B.unregister);
  function hit([sx, sy]) {
    const [wx, wy] = unproj(C, sx, sy, PZ);
    let best = -1, bd = 22;
    BUR.forEach(([x, y], k) => { const d = Math.hypot(wx - x, wy - y); if (d < bd) { bd = d; best = k; } });
    return best;
  }
  let act = -2;
  function setActive(a) {
    if (a === act) return;
    act = a;
    const now = performance.now(), sel = a < 0 ? FAV : a;
    bs.forEach((b, k) => {
      tset(b.h, k !== sel ? 0 : a < 0 ? LOW : tall, now, 0);
      b.cap.sil.classList.toggle("hi", k === sel);
      b.tongues.forEach((tg) => tg.el.classList.toggle("hi", k === sel));
    });
    knobs.forEach((kn, k) => tset(kn.a, k === sel ? (a < 0 ? 0.6 : 0.6 + tall / 30) : 0, now, 0));
    read.textContent = a < 0 ? "rest" : "burner " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { tall = v; if (act >= 0) { const a = act; act = -2; setActive(a); } }, destroy: bag.dispose };
}

hairline({
  name: "stovetop",
  means: "A gas hob: the burner under the pointer lights, its knob turns and its ring of flame leaps up while the others go out.",
  rules: [1, 3, 4, 5],
  range: [10, 20, 28],
  tour: [[147, 174], [272, 182], [221, 208], null],
  mount,
});
