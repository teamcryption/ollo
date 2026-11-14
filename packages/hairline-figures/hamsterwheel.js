/**
 * Hamster wheel: a running wheel on an A-frame stand, on a cage floor. The
 * pointer's place across the floor turns the wheel, on a spring, so the rungs
 * roll under it. One rung is bright, the one a hamster would be standing on.
 * The slider is how far the wheel turns across the floor.
 *
 * The pattern: one continuous value from the pointer (spring).
 */
const {
  Cam, fit, facing, hull, poly, prism, proj, rings, seg, spring, stepS, clamp,
  disposer, mk, pointer, put, register, solid,
} = HL;

const FZ = 3, R = 26, W = 16, CX = 30, CY = 22, CZ = FZ + R + 6, NR = 18, REST = 0.4;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.3);
  fit(C, [[-6, -6, 0], [66, -6, 0], [66, 50, 0], [-6, 50, 0], [CX, CY - W / 2, CZ + R + 2], [CX, CY + W / 2, CZ + R + 2]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [fr, fi] = rings(-6, -6, 66, 50, 6, 2);
  put(solid(g), prism(P, front, fr, fi, 0, FZ));
  const loop = (y, r) => { const o = []; for (let i = 0; i < 40; i++) { const a = (i / 40) * Math.PI * 2; o.push(P(CX + r * Math.cos(a), y, CZ + r * Math.sin(a))); } return o; };
  const legs = (y) => seg(P(CX - 16, y, FZ), P(CX, y, CZ)) + seg(P(CX + 16, y, FZ), P(CX, y, CZ));
  const yF = CY - W / 2 - 3, yN = CY + W / 2 + 3;
  mk("path", { d: legs(yF), class: "nf" }, g);
  const wheel = mk("path", { class: "sil" }, g);
  const rungs = mk("path", { class: "nf lo" }, g), mark = mk("path", { class: "nf" }, g);
  const rims = mk("path", { class: "nf" }, g);
  mk("path", { d: legs(yN) + seg(P(CX, yF, CZ), P(CX, yN, CZ)), class: "nf" }, g);
  wheel.setAttribute("d", poly(hull(loop(CY - W / 2, R).concat(loop(CY + W / 2, R)))));

  const sp = spring(REST);
  let last = NaN;
  function draw(t) {
    if (t === last) return;
    last = t;
    let d = "", m = "";
    for (let i = 0; i < NR; i++) {
      const a = t + (i / NR) * Math.PI * 2, c = Math.cos(a), s = Math.sin(a);
      const pa = P(CX + R * c, CY - W / 2, CZ + R * s), pb = P(CX + R * c, CY + W / 2, CZ + R * s);
      if (i === 0) m = seg(pa, pb); else d += seg(pa, pb);
    }
    rungs.setAttribute("d", d);
    mark.setAttribute("d", m);
    rims.setAttribute("d", poly(loop(CY + W / 2, R)) + poly(loop(CY + W / 2, R * 0.12)));
  }
  mark.classList.add("hi");

  const B = register(stage, (dt) => { const mv = stepS(sp, dt); draw(sp.x); return mv; });
  bag.add(B.unregister);

  function move([sx]) {
    const u = clamp((sx - 200) / 140, -1, 1);
    sp.t = REST + u * Math.PI * (0.5 + reach);
    read.textContent = "turn " + Math.round((u * (0.5 + reach) * 180)) + "°";
    B.wake();
  }
  bag.add(pointer(stage, { move, leave: () => { sp.t = REST; read.textContent = "rest"; B.wake(); } }));
  read.textContent = "rest";
  draw(REST);
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; }, destroy: bag.dispose };
}

hairline({
  name: "hamsterwheel",
  means: "A hamster wheel on its stand: the pointer's place across the cage floor turns the wheel, its rungs rolling on a spring.",
  rules: [3, 5, 8],
  range: [0, 0.5, 1],
  tour: [[120, 160], [280, 170], [200, 140], null],
  mount,
});
