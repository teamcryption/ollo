/**
 * Coil spring toy: a coil of wire rings standing on the top step of a short
 * stair. The pointer over the stair sends the coil walking: its top rings
 * arch over and land on the lower step while the bottom rings stay put. At
 * rest it stands compact, its top ring bright. The slider is how far it
 * reaches down the stair.
 *
 * The pattern: one part arching toward the pointer (spring).
 */
const { Cam, clamp, fit, facing, lerp, poly, prism, proj, rings, spring, stepS, disposer, mk, pointer, put, register, solid } = HL;

const N = 16, R = 12, CX = 20, CY = 20, TOP = 30, LOW = 12, GAP = 1.5;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = 45 + 40 * value;
  const C = Cam(45, 0.5, 2.05);
  fit(C, [[0, 0, 0], [118, 42, 0], [0, 42, 0], [118, 0, 0], [0, 0, TOP], [62, CY, 72]], 200, 160);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [ua, ub] = rings(0, 0, 40, 42, 3, 1.5);
  put(solid(g), prism(P, front, ua, ub, 0, TOP));
  const [la, lb] = rings(40, 0, 118, 42, 3, 1.5);
  put(solid(g), prism(P, front, la, lb, 0, LOW));
  const coil = [];
  for (let i = 0; i < N; i++) coil.push(mk("path", { class: "nf" + (i === N - 1 ? " hi" : "") }, g));
  const prog = spring(0, { k: 70, c: 14 });
  let last = "";

  function draw() {
    const key = prog.x.toFixed(4) + "," + reach;
    if (key === last) return;
    last = key;
    const p = clamp(prog.x, -0.1, 1.1), H = 22 + reach * 0.3;
    for (let i = 0; i < N; i++) {
      const th = Math.PI * i / (N - 1), m = (1 - Math.cos(th)) / 2;
      const ax = CX + reach * m, az = lerp(TOP, LOW, m) + H * Math.sin(th) + GAP;
      let tx = reach / 2 * Math.sin(th), tz = (LOW - TOP) / 2 * Math.sin(th) + H * Math.cos(th);
      const tl = Math.hypot(tx, tz) || 1;
      const cx = lerp(CX, ax, p), cz = lerp(TOP + GAP + i * GAP, az, p);
      let nx = lerp(0, tx / tl, p), nz = lerp(1, tz / tl, p);
      const nl = Math.hypot(nx, nz) || 1; nx /= nl; nz /= nl;
      const pts = [];
      for (let k = 0; k < 28; k++) {
        const f = (k / 28) * Math.PI * 2, c = Math.cos(f) * R, s = Math.sin(f) * R;
        pts.push(P(cx + c * nz, CY + s, cz - c * nx));
      }
      coil[i].setAttribute("d", poly(pts));
    }
  }

  const B = register(stage, (dt) => { const m = stepS(prog, dt); draw(); return m; });
  bag.add(B.unregister);
  draw();

  const box = [[0, 0, 0], [118, 42, 0], [0, 42, 0], [118, 0, 0], [0, 0, TOP + N * GAP + 14], [40, 42, TOP + N * GAP + 14]].map((q) => P(...q));
  const bx0 = Math.min(...box.map((q) => q[0])) - 10, bx1 = Math.max(...box.map((q) => q[0])) + 10;
  const by0 = Math.min(...box.map((q) => q[1])) - 10, by1 = Math.max(...box.map((q) => q[1])) + 10;
  function onMove([sx, sy]) {
    if (sx < bx0 || sx > bx1 || sy < by0 || sy > by1) return onLeave();
    prog.t = 1;
    coil[N - 1].classList.add("hi");
    read.textContent = "step " + Math.round(reach);
    B.wake();
  }
  function onLeave() { prog.t = 0; read.textContent = "rest"; B.wake(); }
  read.textContent = "rest";
  bag.add(pointer(stage, { move: onMove, leave: onLeave }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = 45 + 40 * v; last = ""; draw(); }, destroy: bag.dispose };
}

hairline({
  name: "slinky",
  means: "A coil spring toy on a stair: the pointer sends its top rings arching over to land on the lower step.",
  rules: [1, 3, 5, 8],
  range: [0, 0.7, 1],
  tour: [[128, 78], [206, 150], [255, 230], null],
  mount,
});
