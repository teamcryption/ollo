/**
 * Operating table: a long padded top on a single column over a wide base.
 * The pointer's place along the table tilts the top on its pivot, the end
 * under the pointer dipping down. At rest the top lies with a slight head-up
 * tilt and its outline is bright. The slider is how far the top will tilt.
 */
const { Cam, clamp, fit, facing, hull, lerp, poly, prism, proj, rad, rings, rrect, spring, stepS, unproj, disposer, mk, pointer, put, register, solid } = HL;

const L = 50, W = 14, T = 5, ZP = 40, REST = 6, MAX = 24;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.6);
  const s = Math.sin(rad(MAX)) * L;
  fit(C, [[-L, -W, ZP + s + T], [L, W, ZP + s + T], [-L, W, ZP - s], [L, -W, ZP - s], [-24, 16, 0], [24, -16, 0]], 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(-26, -16, 26, 16, 7, 2);
  put(solid(g), prism(P, front, br, bi, 0, 4));
  const [cr, ci] = rings(-7, -7, 7, 7, 4, 1.2);
  put(solid(g), prism(P, front, cr, ci, 4, ZP - 3));
  const [hr, hi] = rings(-10, -8, 10, 8, 3, 1.2);
  put(solid(g), prism(P, front, hr, hi, ZP - 4, ZP));
  const top = solid(g);
  top.sil.classList.add("hi");
  const pad = mk("path", { class: "lo nf" }, g);
  const tO = rrect(-L, -W, L, W, 5, 4), tI = rrect(-L + 2, -W + 2, L - 2, W - 2, 3.4, 4);
  const at = (ring, a, t) => ring.map((q) => P(q.u * Math.cos(a) - t * Math.sin(a), q.v, ZP + q.u * Math.sin(a) + t * Math.cos(a)));

  const ang = spring(REST);
  let last = NaN;
  function draw() {
    const a = Math.round(ang.x * 10) / 10;
    if (a === last) return;
    last = a;
    const r = rad(a);
    top.sil.setAttribute("d", poly(hull(at(tO, r, 0).concat(at(tO, r, T)))));
    top.cr.setAttribute("d", poly(at(tI, r, T)));
    // the joint between head section and body: one dim line across the pad
    pad.setAttribute("d", poly([at([{ u: -L + 22, v: -W + 2 }], r, T)[0], at([{ u: -L + 22, v: W - 2 }], r, T)[0]]));
  }
  const B = register(stage, (dt) => { const m = stepS(ang, dt); draw(); return m; });
  bag.add(B.unregister);

  const sx0 = P(-L, 0, ZP)[0], sx1 = P(L, 0, ZP)[0];
  function move([sx, sy]) {
    const [wx, wy] = unproj(C, sx, sy, ZP);
    if (wx < -L - 20 || wx > L + 20 || wy < -W - 30 || wy > W + 30) return leave();
    const t = clamp((sx - sx0) / (sx1 - sx0), 0, 1);
    ang.t = lerp(-MAX, MAX, t) * reach;
    read.textContent = Math.round(ang.t) + "°";
    B.wake();
  }
  function leave() { ang.t = REST; read.textContent = "rest"; B.wake(); }
  leave();
  draw();
  bag.add(pointer(stage, { move, leave }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = clamp(v, 0, 1); }, destroy: bag.dispose };
}

hairline({
  name: "operatingtable",
  means: "An operating table on its column: the pointer's place along the top tilts it on its pivot, that end dipping down.",
  rules: [1, 3, 5, 8],
  range: [0.3, 1, 1],
  tour: [[281, 208], [119, 139], [200, 172], null],
  mount,
});
