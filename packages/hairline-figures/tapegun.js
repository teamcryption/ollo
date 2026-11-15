/**
 * Tape dispenser gun: a pistol grip under a frame that carries the tape roll
 * and a toothed nose, the tape running from the roll to the blade. The gun
 * tilts toward the pointer about its grip and the roll turns with it. At rest
 * it leans back a little and the blade is bright. The slider is the reach.
 */
const { Cam, clamp, fit, hull, open, poly, proj, rrect, disposer, mk, pointer, register, solid, spring, stepS } = HL;
const RC = [6, 46], R = 16, REST = -0.14;
function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let gain = value;
  const C = Cam(45, 0.5, 3.4);
  fit(C, [[-34, -8, 0], [52, 8, 0], [-34, 8, 66], [52, -8, 66]], 200, 170);
  const P = proj(C), g = mk("g", {}, svg);
  const handle = solid(g), bar = solid(g), roll = solid(g), nose = solid(g), strip = mk("path", { class: "nf lo" }, g);
  const tilt = spring(REST);
  let last = NaN;
  function draw(a) {
    if (a === last) return;
    last = a;
    const c = Math.cos(a), s = Math.sin(a), T = (x, y, z) => P(x * c + z * s, y, -x * s + z * c);
    const blk = (sd, x0, x1, y0, y1, z0, z1, r) => {
      const ring = rrect(x0, y0, x1, y1, r, 4), inn = rrect(x0 + 1, y0 + 1, x1 - 1, y1 - 1, r - 1, 4);
      sd.sil.setAttribute("d", poly(hull(ring.map((q) => T(q.u, q.v, z0)).concat(ring.map((q) => T(q.u, q.v, z1))))));
      sd.cr.setAttribute("d", poly(inn.map((q) => T(q.u, q.v, z1))));
    };
    blk(handle, -10, 2, -4, 4, 0, 30, 3);
    blk(bar, -12, 36, -5, 5, 28, 34, 3);
    const circ = (rr, y) => Array.from({ length: 28 }, (_, i) => { const t = (i / 28) * Math.PI * 2; return T(RC[0] + rr * Math.cos(t), y, RC[1] + rr * Math.sin(t)); });
    roll.sil.setAttribute("d", poly(hull(circ(R, -8).concat(circ(R, 8)))));
    const sp = [0, 1, 2].map((i) => { const t = a * 4 + (i * Math.PI * 2) / 3; return open([T(RC[0] + 2.5 * Math.cos(t), 8, RC[1] + 2.5 * Math.sin(t)), T(RC[0] + 6 * Math.cos(t), 8, RC[1] + 6 * Math.sin(t))]); });
    roll.cr.setAttribute("d", poly(circ(R - 1.6, 8)) + poly(circ(6, 8)) + sp.join(""));
    blk(nose, 30, 44, -8, 8, 30, 37, 2);
    const teeth = [];
    for (let i = 0; i <= 8; i++) teeth.push(T(45 + (i % 2) * 2, -8 + i * 2, 33.5));
    strip.setAttribute("d", open(teeth) + open([T(RC[0] + R * 0.85, 8, RC[1] - R * 0.5), T(31, 8, 37)]) + open([T(RC[0] + R * 0.85, -8, RC[1] - R * 0.5), T(31, -8, 37)]));
  }
  draw(REST);
  const B = register(stage, (dt) => { const m = stepS(tilt, dt); draw(tilt.x); return m; });
  bag.add(B.unregister);
  function set(p) {
    const act = !!p && p[0] > 40 && p[0] < 360 && p[1] > 20 && p[1] < 300;
    tilt.t = act ? 0.5 * clamp((p[0] - 200) / 110, -1, 1) * gain : REST;
    roll.sil.classList.toggle("hi", act);
    nose.sil.classList.toggle("hi", !act);
    const d = Math.round((tilt.t * 180) / Math.PI);
    read.textContent = act ? (d > 0 ? "+" : "") + d + "°" : "rest";
    B.wake();
  }
  set(null);
  bag.add(pointer(stage, { move: (p) => set(p), leave: () => set(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { gain = v; }, destroy: bag.dispose };
}

hairline({
  name: "tapegun",
  means: "A packing tape gun: the gun tilts toward the pointer about its grip, the tape roll turning as it goes.",
  rules: [1, 3, 5, 8],
  range: [0.2, 1, 1],
  tour: [[320, 120], [70, 150], [330, 150], null],
  mount,
});
