/**
 * Proofing basket: a round banneton, its coiled cane ridges round the wall,
 * a risen dough dome in it. The pointer tips the basket over on its rim to
 * turn the dough out. At rest it leans a touch, the rim bright. The slider is
 * the reach.
 */
const { Cam, fit, hull, poly, open, proj, clamp, lerp, spring, stepS, mk, pointer, register, disposer } = HL;

const R0 = 24, R1 = 34, H = 24, REST = 0.12, PX = R1;
const rotY = ([x, y, z], a) => { const c = Math.cos(a), s = Math.sin(a), dx = x - PX; return [PX + dx * c + z * s, y, -dx * s + z * c]; };
const ring = (r, z, f, n = 40) => { const o = []; for (let i = 0; i < n; i++) { const q = (i / n) * 2 * Math.PI; o.push(f([r * Math.cos(q), r * Math.sin(q), z])); } return o; };

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 3.15);
  fit(C, [[-R1, -R1, 0], [R1, R1, 0], [-R1, -R1, H + 14], [R1 + 30, R1, 50], [R1, -R1, 0]], 200, 160);
  const P = proj(C);
  const g = mk("g", {}, svg);
  const wall = mk("path", { class: "sil hi" }, g), ridges = mk("path", { class: "nf lo" }, g), mouth = mk("path", { class: "nf" }, g), dough = mk("path", { class: "sil" }, g), score = mk("path", { class: "nf lo" }, g);

  let last = NaN;
  function draw(t) {
    if (t === last) return;
    last = t;
    const a = -t * 1.1, f = (p) => P(...rotY(p, a));
    wall.setAttribute("d", poly(hull(ring(R0, 0, f).concat(ring(R1, H, f)))));
    const rd = [];
    for (let k = 1; k < 5; k++) { const z = (k / 5) * H, pts = ring(lerp(R0, R1, k / 5) + 0.3, z, f); const lo = pts.filter((_, i) => { const q = (i / 40) * 2 * Math.PI; return Math.cos(q - 0.785) > 0.05; }); rd.push(open(lo)); }
    ridges.setAttribute("d", rd.join(""));
    mouth.setAttribute("d", poly(ring(R1 - 1.5, H, f)));
    const dm = [];
    for (let i = 0; i <= 5; i++) { const q = (i / 5) * (Math.PI / 2); dm.push(...ring((R1 - 3) * Math.cos(q), H - 2 + 11 * Math.sin(q) + t * 10, f, 28)); }
    dough.setAttribute("d", poly(hull(dm)));
    score.setAttribute("d", open([f([-12, -8, H + 9 + t * 10]), f([2, 2, H + 10.5 + t * 10]), f([12, 10, H + 8 + t * 10])]));
  }
  const sp = spring(REST);
  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(sp.x); return m; });
  bag.add(B.unregister);
  draw(REST);
  read.textContent = "rest";
  bag.add(pointer(stage, {
    move: ([sx]) => { const t = reach * lerp(0.6, 1, clamp((sx - 120) / 160, 0, 1)); sp.t = t; read.textContent = Math.round(t * 63) + "°"; B.wake(); },
    leave: () => { sp.t = REST; read.textContent = "rest"; B.wake(); },
  }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; }, destroy: bag.dispose };
}

hairline({
  name: "proofbasket",
  means: "A round banneton with a risen dough: the pointer tips the basket over on its rim to turn the dough out.",
  rules: [3, 5, 6, 8],
  range: [0.5, 0.75, 1],
  tour: [[124, 119], [220, 150], [90, 180], null],
  mount,
});
