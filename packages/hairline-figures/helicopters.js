/**
 * Helicopters: two helicopters on a helipad of two round pads, each with a
 * rounded body, a tail boom and fin, two skids on struts and a three-blade
 * main rotor on a mast. The rotors always turn slowly while the figure is in
 * view; the helicopter nearer the pointer spins up on a spring and lifts a
 * little off its pad, and is bright. At rest the far one hovers, bright. The
 * slider is the reach.
 *
 * The pattern: a rate put on two items (slow); the hit is read against the
 * pads, which never move.
 */
const {
  Cam, clamp, facing, fit, hull, poly, prism, proj, reducedMotion, seg, spring, stepS,
  circ, rings, disposer, mk, pointer, put, register, solid,
} = HL;

const PADS = [[0, -34], [0, 34]], PR = 24, RR = 22, W0 = 0.9, WMAX = 13, LIFT = 9, REST_Z = [4, 0];
// the body's profile along its axis: [s, radius, centre height]
const PROF = [[-4, 3, 7], [0, 5, 8], [6, 6, 8.5], [11, 5.2, 8], [14, 3.2, 7]];
const BLADE = [[2.5, -1.2], [RR, -0.7], [RR + 0.6, 0], [RR, 0.7], [2.5, 1.2]];
const disc = (x, y, r, n = 48) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value, over = null;
  const C = Cam(45, 0.5, 2.0);
  fit(C, [[-30, -62, 0], [30, 62, 0], [30, -62, 0], [-30, 62, 0], [0, -34, 20 + LIFT + 4], [0, 34, 20 + LIFT + 4]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  { const [r, i] = rings(-30, -64, 30, 64, 8, 2); put(solid(g), prism(P, front, r, i, -3, 0)); }
  for (const [x, y] of PADS) put(solid(g), prism(P, front, disc(x, y, PR), disc(x, y, PR - 3), 0, 1));

  const vring = (cx, cy, s, r, z) => Array.from({ length: 16 }, (_, i) => { const t = (i / 16) * Math.PI * 2; return P(cx + s, cy + r * Math.cos(t), z + r * Math.sin(t)); });
  const helis = PADS.map(([x, y], k) => {
    const grp = mk("g", {}, g);
    const legs = mk("path", { class: "nf sil" }, grp), boom = mk("path", { class: "sil" }, grp), fin = mk("path", { class: "sil" }, grp);
    const body = mk("path", { class: "sil" }, grp), win = mk("path", { class: "nf lo" }, grp), mast = mk("path", { class: "nf sil" }, grp);
    const blades = [0, 1, 2].map(() => mk("path", { class: "sil" }, grp));
    return { k, x, y, scr: P(x, y, 0), legs, boom, fin, body, win, mast, blades, th: k * 1.3 + 0.4, w: spring(W0, { eps: 0.01 }), z: spring(REST_Z[k], { eps: 0.01 }), dz: NaN, dth: NaN };
  });

  function draw(h) {
    const z = h.z.x, x = h.x, y = h.y;
    if (z !== h.dz) {
      h.dz = z;
      let l = "";
      for (const sy of [-5, 5]) { l += seg(P(x - 8, y + sy, z + 0.4), P(x + 13, y + sy, z + 0.4)); l += seg(P(x - 2, y + sy, z + 0.4), P(x - 1, y + sy * 0.6, z + 4)) + seg(P(x + 8, y + sy, z + 0.4), P(x + 8, y + sy * 0.6, z + 4)); }
      h.legs.setAttribute("d", l);
      h.boom.setAttribute("d", poly(hull(vring(x, y, -3, 2, z + 8.5).concat(vring(x, y, -26, 1, z + 9.5)))));
      h.fin.setAttribute("d", poly([P(x - 23, y, z + 9.5), P(x - 27, y, z + 16), P(x - 29, y, z + 16), P(x - 27.5, y, z + 9)]));
      h.body.setAttribute("d", poly(hull(PROF.flatMap(([s, r, c]) => vring(x, y, s, r, z + c)))));
      h.win.setAttribute("d", seg(P(x + 9, y + 5.6, z + 10), P(x + 12.5, y + 3.4, z + 8.5)) + seg(P(x + 3, y + 5.9, z + 11), P(x + 9, y + 5.6, z + 10)));
      h.mast.setAttribute("d", seg(P(x + 5, y, z + 14), P(x + 5, y, z + 17)));
      h.dth = NaN;
    }
    if (h.th === h.dth) return;
    h.dth = h.th;
    h.blades.forEach((el, i) => {
      const a = h.th + (i * Math.PI * 2) / 3, e = [Math.cos(a), Math.sin(a)], n = [-e[1], e[0]];
      el.setAttribute("d", poly(BLADE.map(([r, w]) => P(x + 5 + r * e[0] + w * n[0], y + r * e[1] + w * n[1], z + 17))));
    });
  }

  const still = reducedMotion();
  const B = register(stage, (dt) => {
    let m = false;
    for (const h of helis) {
      if (stepS(h.w, dt)) m = true;
      if (stepS(h.z, dt)) m = true;
      if (!still) { h.th = (h.th + h.w.x * dt) % (Math.PI * 2); m = true; }
      draw(h);
    }
    return m;
  });
  bag.add(B.unregister);

  const dist = (h) => Math.hypot(h.scr[0] - over[0], (h.scr[1] - 20 - over[1]) * 0.8);
  function retarget() {
    let mark = helis[0];
    const on = over && Math.min(...helis.map(dist)) < 110;
    if (on) mark = helis.reduce((a, b) => (dist(b) < dist(a) ? b : a));
    for (const h of helis) {
      const f = on ? clamp(1 - dist(h) / reach, 0.08, 1) : 0, near = on && h === mark;
      h.w.t = on ? W0 + (WMAX - W0) * (near ? Math.max(f, 0.6) : f * 0.4) : W0;
      h.z.t = on ? (near ? LIFT : 0) : REST_Z[h.k];
      h.body.classList.toggle("hi", h === mark);
      h.blades.forEach((el) => el.classList.toggle("hi", h === mark));
    }
    read.textContent = on ? "heli " + (mark.k + 1) : "rest";
    B.wake();
  }
  bag.add(pointer(stage, { move: (p) => { over = p; retarget(); }, leave: () => { over = null; retarget(); } }));
  bag.add(() => svg.replaceChildren());
  retarget();
  return { set: (v) => { reach = v; if (over) retarget(); }, destroy: bag.dispose };
}

hairline({
  name: "helicopters",
  means: "Two helicopters on a helipad: rotors turn while in view; the one nearer the pointer spins up and lifts off its pad.",
  rules: [1, 3, 5, 7],
  range: [80, 140, 200],
  tour: [[245, 130], [152, 181], [200, 160], null],
  mount,
});
