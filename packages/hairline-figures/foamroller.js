/**
 * Squat rack: two uprights on feet with J-hooks, and a loaded barbell racked
 * on the hooks. The pointer is how high the bar is lifted: it slides up and
 * down the uprights on a spring, its plates bright. At rest it sits on the
 * hooks.
 */
const { Cam, fit, prism, proj, rings, facing, spring, stepS, disposer, mk, pointer, put, register, solid } = HL;

const REST = 50, LO = 20, HI = 76, BX = 7;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 2.0);
  fit(C, [[-18, -56, 0], [18, 56, 0], [-18, 56, 0], [18, -56, 0], [0, -32, 86], [0, 32, 86], [BX, -56, HI + 18], [BX, 56, HI + 18]], 200, 160);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const box = (s, x0, y0, x1, y1, z0, z1, r = 1.5) => {
    const [a, b] = rings(x0, y0, x1, y1, r, Math.min(1, Math.min(x1 - x0, y1 - y0) / 4));
    put(s, prism(P, front, a, b, z0, z1));
  };
  const path = (cls) => mk("path", { class: cls, d: "" }, g);
  const lsl = path("nf sil"), lpl = [path("sil"), path("sil"), path("sil"), path("sil")];
  for (const y of [-30, 30]) {
    box(solid(g), -18, y - 4, 18, y + 4, 0, 3, 2);
    box(solid(g), -3, y - 3, 3, y + 3, 3, 86, 1);
    box(solid(g), 3, y - 2, BX + 3, y + 2, REST - 5, REST - 2, 0.8);
  }
  const bar = path("nf sil"), rpl = [path("sil"), path("sil"), path("sil"), path("sil")], rsl = path("nf sil");
  for (const q of [...lpl, ...rpl]) q.classList.add("hi");
  const sp = spring(REST, { k: 100 * value, c: 18 * Math.sqrt(value) });
  let drawn = NaN;
  const disc = (y, z, r) => {
    const pts = [];
    for (let k = 0; k < 44; k++) { const b = (k / 44) * Math.PI * 2; pts.push(P(BX + r * Math.cos(b), y, z + r * Math.sin(b))); }
    return "M" + pts.join("L") + "Z";
  };
  const rod = (y0, y1, z) => "M" + P(BX, y0, z + 1.2) + "L" + P(BX, y1, z + 1.2) + "M" + P(BX, y0, z - 1.2) + "L" + P(BX, y1, z - 1.2);
  function draw() {
    const z = sp.x;
    if (Math.abs(z - drawn) < 1e-3) return;
    drawn = z;
    lsl.setAttribute("d", rod(-56, -46, z));
    [-46, -43, -40, -37].forEach((y, i) => lpl[i].setAttribute("d", disc(y, z, i < 2 ? 17 : 14)));
    bar.setAttribute("d", rod(-37, 37, z));
    [37, 40, 43, 46].forEach((y, i) => rpl[i].setAttribute("d", disc(y, z, i < 2 ? 14 : 17)));
    rsl.setAttribute("d", rod(46, 56, z));
  }
  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(); return m; });
  bag.add(B.unregister);
  const y0 = P(BX, 0, 0)[1], dz = y0 - P(BX, 0, 1)[1];
  const say = () => { read.textContent = Math.round(sp.t) + "cm"; };
  bag.add(pointer(stage, {
    move: (p) => { sp.t = Math.max(LO, Math.min(HI, (y0 - p[1]) / dz)); say(); B.wake(); },
    leave: () => { sp.t = REST; read.textContent = "rest"; B.wake(); },
  }));
  bag.add(() => svg.replaceChildren());
  read.textContent = "rest"; draw();
  return { set: (v) => { sp.k = 100 * v; sp.c = 18 * Math.sqrt(v); }, destroy: bag.dispose };
}

hairline({
  name: "foamroller",
  means: "A squat rack with a loaded barbell on its J-hooks: the bar slides up and down the uprights with the pointer.",
  rules: [1, 3, 5, 8],
  range: [0.5, 1, 1.6],
  tour: [[210, 106], [210, 203], [210, 150], null],
  mount,
});
