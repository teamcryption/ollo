/**
 * Bellows camera: a field camera on its rail, rear standard fixed, front
 * standard and lens on a sliding carriage, pleated bellows between them. The
 * pointer racks the front standard out and the bellows stretch. At rest the
 * bellows are half drawn, the front standard bright. The slider is the reach.
 */
const { Cam, fit, hull, poly, open, proj, rings, prism, facing, put, solid, clamp, lerp, spring, stepS, mk, pointer, register, disposer } = HL;

const RAIL = 112, W = 34, REST = 0.25, YC = W / 2, ZC = 30;
const frame = (x, h) => [[x, YC - h, ZC - h], [x, YC + h, ZC - h], [x, YC + h, ZC + h], [x, YC - h, ZC + h]];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.0);
  fit(C, [[0, 0, 0], [RAIL, W, 0], [0, 0, 52], [RAIL + 16, W, 52], [RAIL, 0, 0], [0, W, 0]], 200, 160);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [r0, i0] = rings(0, 0, RAIL, W, 4, 1.5);
  put(solid(g), prism(P, front, r0, i0, 0, 5));
  const [r1, i1] = rings(2, 0, 18, W, 3, 1.5);
  put(solid(g), prism(P, front, r1, i1, 5, 52));
  const bel = mk("path", { class: "sil" }, g), pleats = mk("path", { class: "nf lo" }, g);
  const std = solid(g); std.sil.classList.add("hi");
  const lens = mk("path", { class: "sil" }, g), glass = mk("path", { class: "nf lo" }, g);

  let last = NaN;
  function draw(t) {
    if (t === last) return;
    last = t;
    const F = lerp(36, RAIL - 12, t), n = 7, pts = [], lines = [];
    for (let k = 0; k <= n; k++) { const x = lerp(18, F, k / n), h = (k % 2 ? 13.5 : 15) - (k / n) * 3; const fr = frame(x, h).map((p) => P(...p)); pts.push(...fr); if (k > 0 && k < n) lines.push(open([fr[3], fr[2], fr[1]])); }
    bel.setAttribute("d", poly(hull(pts)));
    pleats.setAttribute("d", lines.join(""));
    const [rs, is] = rings(F, 4, F + 6, W - 4, 2, 1);
    put(std, prism(P, front, rs, is, 5, 48));
    const ring = (x, r) => { const o = []; for (let k = 0; k < 28; k++) { const a = (k / 28) * 2 * Math.PI; o.push(P(x, YC + r * Math.cos(a), ZC + 2 + r * Math.sin(a))); } return o; };
    lens.setAttribute("d", poly(hull(ring(F + 6, 9).concat(ring(F + 17, 8)))));
    glass.setAttribute("d", poly(ring(F + 17, 6)));
  }
  const sp = spring(REST);
  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(sp.x); return m; });
  bag.add(B.unregister);
  draw(REST);
  read.textContent = "rest";
  bag.add(pointer(stage, {
    move: ([sx]) => { const t = reach * lerp(0.6, 1, clamp((sx - 120) / 160, 0, 1)); sp.t = t; read.textContent = Math.round(lerp(90, 240, t)) + "mm"; B.wake(); },
    leave: () => { sp.t = REST; read.textContent = "rest"; B.wake(); },
  }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; }, destroy: bag.dispose };
}

hairline({
  name: "cablerelease",
  means: "A bellows field camera on its rail: the pointer racks the front standard out and the pleated bellows stretch.",
  rules: [3, 5, 6, 8],
  range: [0.5, 0.75, 1],
  tour: [[192, 118], [260, 170], [150, 150], null],
  mount,
});
