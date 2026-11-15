/**
 * Ceiling airer: five drying rods between two cast end frames, hung on cords
 * from pulleys in a ceiling plate, a towel over the middle rod. The pointer's
 * height sets how far the airer is let down; a spring follows it. At rest it
 * hangs part way down, its near end frame bright. The slider is the drop.
 *
 * The pattern: one assembly sliding on a line (slide).
 */
const {
  Cam, clamp, fit, facing, poly, prism, proj, rings, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const L = 120, YS = [0, 10, 20, 30, 40], TOP = 118, HI = 96, REST = 70, FX = [12, L - 12];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let low = value;
  const C = Cam(45, 0.5, 1.85);
  fit(C, [[0, -6, TOP + 4], [L, 46, TOP + 4], [0, -6, 0], [L, 46, 0]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [pr, pi] = rings(4, -6, L - 4, 46, 4, 1.6);
  put(solid(g), prism(P, front, pr, pi, TOP, TOP + 4));
  const cords = FX.map(() => mk("path", { class: "lo nf" }, g));
  const frame = (x) => {
    const el = mk("path", { class: x === FX[1] ? "sil" : "" }, g);
    return { x, el };
  };
  const far = frame(FX[0]);
  const rods = YS.map(() => mk("path", { class: "nf" }, g));
  const towel = mk("path", {}, g);
  const fold = mk("path", { class: "nf lo" }, g);
  const near = frame(FX[1]);
  near.el.classList.add("hi");
  const sp = spring(REST);
  let last = NaN;

  const at = (x, y, z) => P(x, y, z);
  function draw(z) {
    if (z === last) return;
    last = z;
    FX.forEach((x, i) => cords[i].setAttribute("d", "M" + at(x, 20, TOP).join(",") + "L" + at(x, 20, z + 10).join(",")));
    for (const f of [far, near]) {
      const x = f.x;
      f.el.setAttribute("d", poly([at(x, -5, z), at(x, 45, z), at(x, 45, z + 4), at(x, 26, z + 10), at(x, 14, z + 10), at(x, -5, z + 4)]));
    }
    YS.forEach((y, i) => {
      const a = at(4, y, z + 2), b = at(L - 4, y, z + 2);
      rods[i].setAttribute("d", "M" + a.join(",") + "L" + b.join(",") + "M" + at(4, y, z + 3.4).join(",") + "L" + at(L - 4, y, z + 3.4).join(","));
    });
    // the towel hangs over the middle rod, longer on the near side
    towel.setAttribute("d", poly([at(40, 16, z + 3), at(80, 16, z + 3), at(80, 18, z - 14), at(80, 22, z - 28), at(40, 22, z - 28), at(40, 18, z - 14)]));
    fold.setAttribute("d", "M" + at(40, 20, z + 3).join(",") + "L" + at(80, 20, z + 3).join(","));
  }

  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(sp.x); return m; });
  bag.add(B.unregister);

  const yTop = P(L / 2, 20, TOP)[1], yBot = P(L / 2, 20, 0)[1];
  function move(p) {
    const f = clamp((p[1] - yTop) / (yBot - yTop), 0, 1);
    sp.t = HI - f * (HI - (HI - low));
    read.textContent = Math.round((f * low) / 10) * 10 + " cm";
    B.wake();
  }
  function leave() { sp.t = REST; read.textContent = "rest"; B.wake(); }
  read.textContent = "rest";
  draw(REST);
  bag.add(pointer(stage, { move, leave }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { low = v; }, destroy: bag.dispose };
}

hairline({
  name: "ceilingrack",
  means: "A ceiling clothes airer on pulley cords: move the pointer down and the rack of rods and its towel is let down towards you.",
  rules: [1, 3, 5, 8],
  range: [40, 66, 66],
  tour: [[200, 87], [200, 168], [200, 232], null],
  mount,
});
