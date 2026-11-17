/**
 * Flippers: a dive flag buoy, a round float with a staff, and the diver-down
 * flag with its diagonal stripe flying from the staff. The pointer turns the
 * flag round its staff to stream toward it. At rest it flies toward the
 * viewer, bright. The slider is how far round the flag may swing.
 */
const { Cam, clamp, facing, fillet, fit, poly, prism, proj, rings, rad, seg, spring, stepS, disposer, mk, pointer, put, register, solid } = HL;

const ZT = 118, W = 62, H = 40, REST = 12;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.25);
  const fl = (a, s, z) => [Math.cos(rad(a)) * s, Math.sin(rad(a)) * s, z];
  fit(C, [[-24, -24, 0], [24, 24, 0], fl(-45, W + 2, ZT), fl(135, W + 2, ZT), fl(45, W, ZT - H), [0, 0, ZT + 5]], 200, 160);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const float = solid(g), [br, bi] = rings(-24, -24, 24, 24, 24, 2);
  put(float, prism(P, front, br, bi, 0, 16));
  const staff = solid(g), [sr, si] = rings(-1.8, -1.8, 1.8, 1.8, 1.8, 0.5);
  put(staff, prism(P, front, sr, si, 16, ZT + 5));
  const flag = solid(g);
  flag.sil.classList.add("hi");
  let last = NaN;
  function draw(a) {
    if (a === last) return;
    last = a;
    const corners = [[1.5, ZT], [W, ZT], [W, ZT - H], [1.5, ZT - H]];
    const pts = fillet(corners, [0.5, 2, 2, 0.5], 3).map(([s, z]) => P(...fl(a, s, z)));
    flag.sil.setAttribute("d", poly(pts));
    const k = 7;
    flag.cr.setAttribute("d", seg(P(...fl(a, 1.5, ZT - k)), P(...fl(a, W - k * 1.5, ZT - H))) + seg(P(...fl(a, 1.5 + k * 1.5, ZT)), P(...fl(a, W, ZT - H + k))));
    read.textContent = String(Math.round((a + 405) % 360)).padStart(3, "0") + "°";
  }
  const sp = spring(REST);
  let resting = true;
  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(sp.x); if (!m && resting) read.textContent = "rest"; return m; });
  bag.add(B.unregister);
  function aim(p) {
    resting = !p;
    sp.t = p ? -45 + (1 - clamp((p[0] - 200) / 90, -1, 1)) * reach : REST;
    B.wake();
  }
  draw(REST);
  read.textContent = "rest";
  bag.add(pointer(stage, { move: aim, leave: () => aim(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; }, destroy: bag.dispose };
}

hairline({
  name: "flippers",
  means: "A dive flag buoy: the striped diver-down flag turns round its staff to stream toward the pointer.",
  rules: [1, 3, 5, 8],
  range: [40, 90, 90],
  tour: [[340, 66], [60, 66], [260, 80], null],
  mount,
});
