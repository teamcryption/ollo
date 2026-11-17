/**
 * Snow pusher: a wide curved-up blade on a long handle with a cross grip.
 * The pointer's y slides it forward along the ground and tips the handle
 * down as it pushes. At rest it stands back, its blade edge bright. The
 * slider is how far one push goes.
 *
 * The pattern: one part sliding with the pointer (spring).
 */
const { Cam, clamp, fit, hull, lerp, poly, proj, rrect, spring, stepS, disposer, mk, pointer, register, solid } = HL;

const RING = [];
for (let i = 0; i < 16; i++) { const t = (i / 16) * Math.PI * 2; RING.push([Math.cos(t), Math.sin(t)]); }
const BW = 46;

function mount({ stage, svg, read }, value) {
  let reach = value;
  const bag = disposer();
  const C = Cam(45, 0.5, 2.12);
  fit(C, [[-BW, -60, 0], [BW, -60, 0], [-BW, 70, 0], [BW, 70, 0], [0, -60, 80], [0, 40, 50]], 200, 165);
  const P = proj(C);
  const g = mk("g", {}, svg);
  const el = Object.fromEntries(["shaft", "grip"].map((k) => [k, mk("path", { class: "sil" }, g)]));
  const blade = solid(g);
  blade.sil.classList.add("hi");
  const rod = (A, Bp, r) => {
    const pts = [];
    for (const E of [A, Bp]) for (const [c, s] of RING) pts.push(P(E[0] + r * c, E[1] + r * s, E[2]), P(E[0] + r * c, E[1], E[2] + r * s), P(E[0], E[1] + r * c, E[2] + r * s));
    return poly(hull(pts));
  };
  const BR = rrect(-BW, 0, BW, 22, 4, 6), BI = rrect(-BW + 2, 2, BW - 2, 20, 3, 6);
  const sp = spring(0);
  let last = NaN;
  function draw() {
    if (sp.x === last) return;
    last = sp.x;
    const y0 = lerp(-40, -40 + reach, sp.x), tilt = lerp(0.95, 0.6, sp.x);
    const Bp = (u, v, w) => P(u, y0 + 8 - v * Math.cos(1.25) + w * Math.sin(1.25), v * Math.sin(1.25) + w * Math.cos(1.25));
    const hx = 0, hy = y0 - 70 * Math.cos(tilt), hz = 10 + 70 * Math.sin(tilt);
    el.shaft.setAttribute("d", rod([0, y0 + 2, 8], [hx, hy, hz], 2.2));
    el.grip.setAttribute("d", rod([-12, hy, hz], [12, hy, hz], 2.6));
    blade.sil.setAttribute("d", poly(hull(BR.map((q) => Bp(q.u, q.v, 0)).concat(BR.map((q) => Bp(q.u, q.v, 2.5))))));
    blade.cr.setAttribute("d", poly(BI.map((q) => Bp(q.u, q.v, 2.5))));
  }
  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(); return m; });
  bag.add(B.unregister);
  draw();
  function onMove([sx, sy]) {
    if (sx < 70 || sx > 330 || sy < 40 || sy > 290) return onLeave();
    const s = clamp((sy - 80) / 160, 0, 1);
    sp.t = 0.25 + 0.75 * s;
    read.textContent = "push " + Math.round(s * 9);
    B.wake();
  }
  function onLeave() { sp.t = 0; read.textContent = "rest"; B.wake(); }
  read.textContent = "rest";
  bag.add(pointer(stage, { move: onMove, leave: onLeave }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; last = NaN; B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "snowplow",
  means: "A snow pusher standing back: the pointer slides its wide blade forward along the ground and tips the handle down.",
  rules: [1, 3, 5, 8],
  range: [40, 80, 100],
  tour: [[178, 214], [207, 148], [207, 268], null],
  mount,
});
