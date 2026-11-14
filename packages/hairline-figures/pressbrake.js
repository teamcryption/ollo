/**
 * Press brake: a long sheet laid across a die, the upper beam's blade over
 * its bend line. The pointer's distance from the bend line sets the stroke:
 * near it the beam comes down and the sheet's two wings fold up; far off
 * the beam rises and the sheet opens back to a shallow crease. At rest the
 * sheet holds a slight bend and the blade is bright.
 *
 * The pattern: one continuous value from the pointer (spring).
 */
const {
  Cam, clamp, fit, facing, poly, prism, proj, rings, rad, spring, stepS, unproj,
  disposer, mk, pointer, put, register, solid,
} = HL;

const L = 150, ZS = 16, HW = 30, TOP = 74, MAXA = 62, REST = 0.22;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 1.5);
  fit(C, [[0, -HW, 0], [L, HW, 0], [0, HW, 0], [L, -HW, 0], [0, 0, TOP], [L, 0, TOP], [0, -HW * 0.5, ZS + HW], [L, HW * 0.5, ZS + HW]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [dr, di] = rings(0, -12, L, 12, 4, 1.6);
  put(solid(g), prism(P, front, dr, di, 0, ZS));
  const far = mk("path", {}, g);
  const beam = solid(g);
  const near = mk("path", {}, g);
  const [br, bi] = rings(4, -4, L - 4, 4, 2, 1);
  const sp = spring(REST);
  let last = NaN;

  function wing(s, a) {
    const ye = s * HW * Math.cos(rad(a)), ze = ZS + HW * Math.sin(rad(a));
    return poly([P(0, 0, ZS), P(L, 0, ZS), P(L, ye, ze), P(0, ye, ze)]);
  }
  function draw(b) {
    if (b === last) return;
    last = b;
    const a = b * MAXA;
    far.setAttribute("d", wing(-1, a));
    near.setAttribute("d", wing(1, a));
    put(beam, prism(P, front, br, bi, ZS + 1 + 26 * (1 - b), TOP));
  }

  const B = register(stage, (dt) => {
    const moving = stepS(sp, dt);
    draw(sp.x);
    return moving;
  });
  bag.add(B.unregister);

  let on = null;
  function aim(t) {
    sp.t = t;
    const act = t > REST + 0.01;
    if (act !== on) {
      on = act;
      beam.sil.classList.toggle("hi", !act);
      far.classList.toggle("hi", act);
      near.classList.toggle("hi", act);
    }
    read.textContent = act ? Math.round(t * MAXA) + "°" : "rest";
    B.wake();
  }
  function move([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, ZS);
    if (x < -10 || x > L + 10 || Math.abs(y) > 60) return aim(REST);
    aim(clamp(1 - (Math.abs(y) / 60) * (1 - reach / 100), REST + 0.02, 1));
  }
  aim(REST);
  draw(REST);
  bag.add(pointer(stage, { move, leave: () => aim(REST) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; }, destroy: bag.dispose };
}

hairline({
  name: "pressbrake",
  means: "A press brake: near the bend line the beam comes down and the sheet's wings fold up; further off it opens.",
  rules: [1, 3, 5, 8],
  range: [0, 40, 80],
  tour: [[152, 140], [200, 185], [158, 207], null],
  mount,
});
