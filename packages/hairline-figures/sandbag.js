/**
 * Slam ball: a heavy rubber ball over a floor mat, with the ring it has worn
 * into the mat. The pointer above the ball lifts it, higher the higher the
 * pointer, and leaving lets it drop back toward the mat. At rest it hangs just
 * off the mat and the worn ring is bright. The slider is the highest lift.
 *
 * The pattern: a continuous aim (one spring on the height); the hit is a
 * fixed column over the ball's rest place.
 */
const {
  Cam, circ, clamp, fit, facing, hull, open, poly, prism, proj, rings, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const BR = 26, MZ = 3, REST = 8;
const disc = (r, z, n = 40) => circ(r, n).map((q) => [q.u, q.v, z]);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let MAX = value;
  const C = Cam(45, 0.5, 2.5);
  fit(C, [[-44, -44, 0], [44, 44, 0], [44, -44, 0], [-44, 44, 0], [0, 0, MZ + 2 * BR + 50]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [mr, mi] = rings(-44, -44, 44, 44, 8, 2);
  put(solid(g), prism(P, front, mr, mi, 0, MZ));
  const wear = mk("path", { d: poly(disc(BR * 0.7, MZ).map((p) => P(...p))), class: "nf sil" }, g);
  const drop = mk("path", { class: "dash" }, g);
  const ball = mk("path", { class: "sil" }, g), seam = mk("path", { class: "nf lo" }, g), seam2 = mk("path", { class: "nf lo" }, g);
  const h = spring(REST);
  let last = NaN;
  function draw() {
    const z0 = MZ + h.x;
    if (z0 === last) return;
    last = z0;
    const pts = [];
    for (let i = -6; i <= 6; i++) { const t = (i / 6) * (Math.PI / 2); pts.push(...disc(BR * Math.cos(t), z0 + BR + BR * Math.sin(t), 32).map((p) => P(...p))); }
    ball.setAttribute("d", poly(hull(pts)));
    const eq = disc(BR - 0.6, z0 + BR, 48).map((p) => P(...p));
    seam.setAttribute("d", open(eq.slice(0, 25)));
    const mer = [];
    for (let i = 0; i <= 24; i++) { const t = (i / 24) * Math.PI - Math.PI / 2; mer.push(P(BR * 0.97 * Math.cos(t) * 0.7071, -BR * 0.97 * Math.cos(t) * 0.7071, z0 + BR + BR * 0.97 * Math.sin(t))); }
    seam2.setAttribute("d", open(mer));
    drop.setAttribute("d", h.x > 2 ? open([P(0, 0, MZ), P(0, 0, z0)]) : "");
  }
  const B = register(stage, (dt) => { const m = stepS(h, dt); draw(); return m; });
  bag.add(B.unregister);

  const base = P(0, 0, MZ + BR), half = BR * 2.5 + 10;
  function aim(p) {
    const on = !!p && Math.abs(p[0] - base[0]) < half && p[1] < base[1] + half && p[1] > 0;
    h.t = on ? clamp((base[1] - p[1]) / 2.5 + 20, 0, MAX) : REST;
    ball.classList.toggle("hi", on);
    wear.classList.toggle("hi", !on);
    read.textContent = on ? "lift " + Math.round(h.t) : "rest";
    B.wake();
  }
  aim(null);
  bag.add(pointer(stage, { move: aim, leave: () => aim(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { MAX = v; }, destroy: bag.dispose };
}

hairline({
  name: "sandbag",
  means: "A slam ball over a floor mat: the pointer above it lifts the ball, higher the higher it is, and leaving drops it.",
  rules: [1, 3, 5, 8],
  range: [20, 40, 50],
  tour: [[200, 176], [200, 111], [200, 24], null],
  mount,
});
