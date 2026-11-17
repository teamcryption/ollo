/**
 * Paper mould: the papermaker's wire mould, a wooden frame strung with laid
 * wires, and the loose deckle frame that sits on it. The pointer rocks the
 * mould on its long axis, the shake that settles the pulp, and the deckle
 * lifts clear as it tips. At rest it lies near flat, the deckle bright.
 *
 * The pattern: one part tilting on a spring that follows the pointer.
 */
const {
  Cam, clamp, fit, hull, poly, proj, rad, rrect, seg, spring, stepS, unproj,
  disposer, mk, pointer, register, solid,
} = HL;

const W = 30, D = 21, TH = 3, REST = 5, MAX = 30, LIFT = 9;
function rot([x, y, z], a, up) {
  const c = Math.cos(a), s = Math.sin(a), zz = z + up;
  return [x * c - zz * s, y, x * s + zz * c + 14];
}

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 3.75);
  const ext = [];
  [-MAX, MAX].forEach((d) => [[-W, -D], [W, -D], [W, D], [-W, D]].forEach(([x, y]) => ext.push(rot([x, y, TH * 2], rad(d), LIFT))));
  fit(C, ext, 200, 160);
  const P = proj(C);
  const g = mk("g", {}, svg);
  const mould = solid(g), wires = mk("path", { class: "nf lo" }, mould.g), deckle = solid(g);
  const sp = spring(REST);
  let last = NaN;
  function frame(r0, r1, z0, z1, a, up) {
    const pts = r0.map((r) => P(...rot([r.u, r.v, z0], a, up))).concat(r0.map((r) => P(...rot([r.u, r.v, z1], a, up))));
    return { sil: poly(hull(pts)), cr: poly(r1.map((r) => P(...rot([r.u, r.v, z1], a, up)))) };
  }
  const mO = rrect(-W, -D, W, D, 3, 5), mI = rrect(-W + 4, -D + 4, W - 4, D - 4, 1.5, 4);
  const dO = rrect(-W + 1, -D + 1, W - 1, D - 1, 3, 5), dI = rrect(-W + 4, -D + 4, W - 4, D - 4, 1.5, 4);

  function draw(deg) {
    if (deg === last) return;
    last = deg;
    const a = rad(deg), up = LIFT * clamp((deg - REST) / (MAX - REST), 0, 1);
    const m = frame(mO, mI, 0, TH, a, 0);
    mould.sil.setAttribute("d", m.sil);
    mould.cr.setAttribute("d", m.cr);
    let w = "";
    for (let i = 1; i < 10; i++) { const x = -W + 4 + i * (2 * W - 8) / 10; w += seg(P(...rot([x, -D + 4, TH], a, 0)), P(...rot([x, D - 4, TH], a, 0))); }
    for (let j = 1; j < 3; j++) { const y = -D + 4 + j * (2 * D - 8) / 3; w += seg(P(...rot([-W + 4, y, TH], a, 0)), P(...rot([W - 4, y, TH], a, 0))); }
    wires.setAttribute("d", w);
    const k = frame(dO, dI, TH, TH + 2.4, a, up);
    deckle.sil.setAttribute("d", k.sil + k.cr);
    deckle.cr.setAttribute("d", "");
  }
  deckle.sil.classList.add("hi");
  deckle.sil.setAttribute("fill-rule", "evenodd");

  const R = register(stage, (dt) => {
    const m = stepS(sp, dt);
    draw(Math.round(sp.x * 100) / 100);
    return m;
  });
  bag.add(R.unregister);

  function move([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, 14);
    if (Math.abs(x) > W + 14 || Math.abs(y) > D + 14) return leave();
    sp.t = REST + (MAX - REST) * clamp((x + W) / (2 * W), 0, 1) * reach;
    read.textContent = Math.round(sp.t) + "°";
    R.wake();
  }
  function leave() { sp.t = REST; read.textContent = "rest"; R.wake(); }
  leave();
  bag.add(pointer(stage, { move, leave }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; }, destroy: bag.dispose };
}

hairline({
  name: "papermould",
  means: "A papermaker's mould and deckle: the wired mould rocks toward the pointer and the loose deckle frame lifts off it.",
  rules: [3, 5, 8],
  range: [0.4, 1, 1],
  tour: [[269, 262], [200, 228], [131, 193], null],
  mount,
});
