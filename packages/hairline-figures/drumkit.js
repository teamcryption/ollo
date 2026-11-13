/**
 * Drum kit: a bass drum on its side with two toms mounted over it, a snare on
 * a tripod stand, a floor tom on three legs and a crash cymbal on a tall
 * stand. The pointer is a stick: the drums near it bounce down on their own
 * springs, the one under it deepest and bright. At rest the snare sits a
 * little low, bright, and the others settle unevenly. The slider is the reach.
 *
 * The pattern: a continuous field (terrain) over parts at different heights;
 * the hit is on each drum's own resting top, which never moves.
 */
const {
  Cam, circ, clamp, facing, fit, hull, poly, prism, proj, seg, unproj, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const Q = Math.SQRT1_2;
// a runs across the screen, b toward the viewer
const W = (a, b, z) => [(a + b) * Q, (b - a) * Q, z];
const KR = 17, KL = 8;
const DRUMS = [
  { name: "crash", a: -48, b: -16, r: 13, z0: 62, z1: 63.4, dmax: 5, rest: 2.2, cym: true },
  { name: "kick", a: 0, b: 0, r: KR, z0: 0, z1: 2 * KR, dmax: 1.6, rest: 0, kick: true },
  { name: "tom 1", a: -10, b: -4, r: 8, z0: 40, z1: 49, dmax: 4, rest: 1.4 },
  { name: "tom 2", a: 10, b: -4, r: 8.5, z0: 41, z1: 51, dmax: 4, rest: 0 },
  { name: "snare", a: -36, b: 6, r: 10, z0: 25, z1: 31, dmax: 4, rest: 2.8 },
  { name: "floor", a: 36, b: 8, r: 12, z0: 8, z1: 28, dmax: 4, rest: 0.8 },
];
const FAV = "snare";
const falloff = (u) => (u <= 0 ? 1 : u <= 0.45 ? 1 - (u / 0.45) * 0.62 : u <= 1 ? 0.38 - ((u - 0.45) / 0.55) * 0.38 : 0);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let RAD = value, over = null;
  const C = Cam(45, 0.5, 2.25);
  fit(C, [W(-62, -30, 0), W(50, -30, 0), W(-62, 22, 0), W(50, 22, 0), W(-62, -30, 66), W(50, -30, 66), W(-62, 22, 66)], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const disc = (d, r, n = 40) => { const [x, y] = W(d.a, d.b, 0); return circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y })); };
  const lines = (parts) => mk("path", { class: "nf sil", d: parts.join("") }, g);
  const tripod = (d, top, foot, spread, phase) => {
    const out = [seg(P(...W(d.a, d.b, 0.5)), P(...W(d.a, d.b, top)))];
    for (let i = 0; i < 3; i++) {
      const t = phase + (i / 3) * Math.PI * 2;
      out.push(seg(P(...W(d.a, d.b, foot)), P(...W(d.a + spread * Math.cos(t), d.b + spread * Math.sin(t), 0))));
    }
    return out;
  };

  for (const d of DRUMS) {
    d.sp = spring(d.rest, { eps: 0.02 });
    d.drawn = NaN;
    if (d.cym) { lines(tripod(d, d.z0, 12, 9, 0.6)); d.el = solid(g); d.bell = solid(g); }
    else if (d.kick) d.el = solid(g);
    else if (d.name === "snare") { lines(tripod(d, d.z0, 9, 8, -0.4)); d.el = solid(g); }
    else if (d.name === "floor") {
      const legs = [];
      for (const t of [Math.PI * 0.95, Math.PI * 1.5, Math.PI * 0.05]) {
        const c = Math.cos(t), s = Math.sin(t);
        legs.push(seg(P(...W(d.a + (d.r + 1.2) * c, d.b + (d.r + 1.2) * s, d.z0 + 12)), P(...W(d.a + (d.r + 5) * c, d.b + (d.r + 5) * s, 0))));
      }
      lines(legs); d.el = solid(g);
    } else d.el = solid(g);
    if (d.kick) {
      // the tom mounts rise from the bass drum's shell, and two spurs hold it
      const ms = [-10, 10].map((a) => seg(P(...W(a, -4, KR + Math.sqrt(KR * KR - a * a))), P(...W(a, -4, 40))));
      d.mounts = lines(ms);
    }
  }
  const kick = DRUMS[1];
  kick.spurs = lines([-1, 1].map((s) => seg(P(...W(s * (KR - 2.5), 5, 6)), P(...W(s * (KR + 5), 12, 0)))));

  function draw(d) {
    const z = clamp(d.sp.x, 0, d.dmax);
    if (z === d.drawn) return;
    d.drawn = z;
    if (d.kick) {
      const ring = (s, r) => circ(r, 48).map((q) => P(...W(d.a + q.u, d.b + s, KR - z + q.v)));
      put(d.el, { sil: poly(hull(ring(-KL, KR).concat(ring(KL, KR)))), crease: poly(ring(KL, KR - 1.6)) });
    } else if (d.cym) {
      put(d.el, prism(P, front, disc(d, d.r, 48), disc(d, d.r - 1.2, 48), d.z0 - z, d.z1 - z));
      put(d.bell, prism(P, front, disc(d, 3.2, 24), null, d.z1 - z, d.z1 + 1.8 - z));
    } else put(d.el, prism(P, front, disc(d, d.r), disc(d, d.r - 1.2), d.z0 - z, d.z1 - z));
  }
  const B = register(stage, (dt) => {
    let m = false;
    for (const d of DRUMS) { if (stepS(d.sp, dt)) m = true; draw(d); }
    return m;
  });
  bag.add(B.unregister);

  // each drum is tested on the plane of its own resting top; the bass drum on its axis
  const zones = DRUMS.map((d) => (d.kick ? { z: KR, a: 0, b: 4, ra: KR, rb: 33 } : { z: d.z1, a: d.a, b: d.b, ra: d.r * 1.15, rb: d.r * 1.15 }));
  function under(sx, sy) {
    let best = null, bd = 1.25;
    DRUMS.forEach((d, i) => {
      const zn = zones[i], [x, y] = unproj(C, sx, sy, zn.z), a = (x - y) * Q, b = (x + y) * Q;
      const s = Math.hypot((a - zn.a) / zn.ra, (b - zn.b) / zn.rb);
      if (s < bd) { bd = s; best = d; }
    });
    return best;
  }

  function retarget() {
    for (const d of DRUMS) {
      if (!over) d.sp.t = d.rest;
      else d.sp.t = d === over ? d.dmax : d.dmax * 0.8 * falloff(Math.hypot(d.a - over.a, d.b - over.b) / RAD);
      d.el.sil.classList.toggle("hi", over ? d === over : d.name === FAV);
    }
    read.textContent = over ? over.name : "rest";
    B.wake();
  }

  bag.add(pointer(stage, {
    move: (p) => { const h = under(p[0], p[1]); if (h !== over) { over = h; retarget(); } },
    leave: () => { over = null; retarget(); },
  }));
  bag.add(() => svg.replaceChildren());
  retarget();
  return { set: (v) => { RAD = v; if (over) retarget(); }, destroy: bag.dispose };
}

hairline({
  name: "drumkit",
  means: "A drum kit with a cymbal: the drums near the pointer bounce down on springs, the one under it deepest and bright.",
  rules: [1, 3, 5, 9],
  range: [18, 34, 60],
  tour: [[133, 181], [105, 94], [294, 189], null],
  mount,
});
