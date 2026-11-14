/**
 * Sawbench: a table saw, a cabinet under a broad top with a rip fence along
 * its back and a toothed blade standing in the throat. The pointer's
 * nearness raises the blade through the slot; it sinks back when the hand
 * leaves. At rest the blade stands a little proud, bright. The slider is
 * the farthest rise.
 *
 * The pattern: one part rising to the pointer's nearness (spring).
 */
const {
  Cam, fit, facing, open, poly, prism, proj, rings, seg, spring, stepS, clamp,
  disposer, mk, pointer, put, register, solid,
} = HL;

const TOP = 30, BR = 24, REST = 4, TEETH = 28;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let maxH = value;
  const C = Cam(45, 0.5, 2.05);
  fit(C, [[-44, -34, 0], [44, 34, 0], [44, -34, 0], [-44, 34, 0], [0, 0, TOP + 31]], 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [kr, ki] = rings(-32, -24, 32, 24, 4, 1.5);
  put(solid(g), prism(P, front, kr, ki, 0, TOP - 4));
  const [tr, ti] = rings(-44, -34, 44, 34, 4, 1.8);
  put(solid(g), prism(P, front, tr, ti, TOP - 4, TOP));
  // the throat plate and its slot
  mk("path", { d: poly([P(-30, -6, TOP), P(30, -6, TOP), P(30, 6, TOP), P(-30, 6, TOP)]), class: "nf lo" }, g);
  mk("path", { d: seg(P(-BR, 0, TOP), P(BR, 0, TOP)), class: "nf lo" }, g);
  // the rip fence along the back
  const [fr, fi] = rings(-44, -28, 44, -22, 2, 1);
  put(solid(g), prism(P, front, fr, fi, TOP, TOP + 7));
  const blade = mk("path", { class: "sil hi" }, g), hub = mk("path", { class: "nf lo" }, g);
  // the miter gauge in the near groove
  const [mr, mi] = rings(-30, 16, -14, 22, 2, 1);
  put(solid(g), prism(P, front, mr, mi, TOP, TOP + 4));

  const sp = spring(REST);
  let last = NaN;
  function draw(h) {
    if (h === last) return;
    last = h;
    const cz = TOP - BR + h, pts = [];
    for (let i = 0; i < TEETH * 2; i++) {
      const t = -Math.PI / 2 + (i / (TEETH * 2)) * Math.PI * 2, r = i % 2 ? BR - 2.6 : BR;
      pts.push([r * Math.cos(t), cz + r * Math.sin(t)]);
    }
    const out = [];
    for (let i = 0; i < pts.length; i++) {
      const [ax, az] = pts[i], [bx, bz] = pts[(i + 1) % pts.length];
      if (az >= TOP) out.push(P(ax, 0, az));
      if ((az - TOP) * (bz - TOP) < 0) { const f = (TOP - az) / (bz - az); out.push(P(ax + f * (bx - ax), 0, TOP)); }
    }
    blade.setAttribute("d", out.length > 2 ? poly(out) : "");
    const hp = [];
    for (let i = 0; i <= 24; i++) { const t = (i / 24) * Math.PI * 2, z = cz + 5 * Math.sin(t); if (z >= TOP + 0.5) hp.push(P(5 * Math.cos(t), 0, z)); }
    hub.setAttribute("d", hp.length > 2 ? open(hp) : "");
    read.textContent = "+" + Math.round(h);
  }
  draw(sp.x);
  read.textContent = "rest";

  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(sp.x); return m; });
  bag.add(B.unregister);
  const c = P(0, 0, TOP);
  let here = false, near = 0;
  function aim([sx, sy]) { here = true; near = clamp(1 - Math.hypot(sx - c[0], (sy - c[1]) * 1.6) / 170, 0, 1); sp.t = REST + (maxH - REST) * near; B.wake(); }
  function leave() { here = false; sp.t = REST; B.wake(); }
  bag.add(pointer(stage, { move: aim, leave }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { maxH = v; if (here) { sp.t = REST + (maxH - REST) * near; B.wake(); } }, destroy: bag.dispose };
}

hairline({
  name: "sawbench",
  means: "A table saw with a toothed blade in its throat: the nearer the pointer, the higher the blade rises through the slot.",
  rules: [3, 5, 8, 9],
  range: [14, 28, 30],
  tour: [[120, 150], [200, 170], [280, 200], null],
  mount,
});
