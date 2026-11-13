/**
 * Desk fan: a round base with a power dot, a stem, and a head that is a round
 * grille cage over three blades, a motor housing behind it. The pointer is
 * what the fan aims at: the head turns on a spring to face it, and the blades
 * spin while it turns, faster the nearer the pointer is, then coast to a
 * stop. At rest the fan looks a little aside and the power dot is bright. The
 * slider is how quickly the head follows (a stiffer or softer spring).
 *
 * The pattern: a continuous aim (officechairs); the hit is on the floor's
 * plane, which never moves.
 */
const {
  Cam, circ, clamp, facing, fit, hull, open, poly, prism, proj, rad, unproj, spring, stepS,
  disposer, flatDot, mk, place, pointer, put, register, solid,
} = HL;

const H = 46, R = 21, FWD = rad(45), REST = rad(45 - 22), SPAN = rad(62);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 3.45);
  const ext = [[-17, -17, 0], [17, 17, 0], [17, -17, 0], [-17, 17, 0]];
  for (let k = -1; k <= 1; k++) {
    const a = FWD + k * SPAN, ux = -Math.sin(a), uy = Math.cos(a);
    ext.push([ux * R, uy * R, H + R], [-ux * R, -uy * R, H - R], [Math.cos(a) * 8, Math.sin(a) * 8, H + R]);
  }
  fit(C, ext, 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  const base = solid(g);
  put(base, prism(P, front, circ(17, 48), circ(15.6, 48), 0, 4));
  const knob = flatDot(base.g, C, 1.7, "dot");
  place(knob, P(8, 8, 4));
  put(solid(g), prism(P, front, circ(2.2, 20), null, 4, H - 4));
  const motor = solid(g), cage = solid(g);
  const blades = mk("path", { class: "nf lo" }, cage.g);

  const aim = spring(REST, { k: 100 * value, c: 18 * Math.sqrt(value) }), spin = spring(0);
  let phase = 0.4, drawn = "";
  // a point in the head's frame: f along the aim, p across it, q up
  const at = (a, f, p, q) => {
    const c = Math.cos(a), s = Math.sin(a);
    return P(c * (f + 3) - s * p, s * (f + 3) + c * p, H + q);
  };
  const ring = (a, f, r, n = 40) => {
    const out = [];
    for (let i = 0; i < n; i++) { const t = (i / n) * Math.PI * 2; out.push(at(a, f, r * Math.cos(t), r * Math.sin(t))); }
    return out;
  };
  function draw() {
    const a = aim.x, key = a.toFixed(4) + "," + phase.toFixed(3);
    if (key === drawn) return;
    drawn = key;
    motor.sil.setAttribute("d", poly(hull(ring(a, -3, 8, 24).concat(ring(a, -12, 6.5, 24)))));
    cage.sil.setAttribute("d", poly(hull(ring(a, 5, R).concat(ring(a, -4, R)))));
    cage.cr.setAttribute("d", poly(ring(a, 5, R - 1.4)) + poly(ring(a, 5, 3, 16)));
    let d = "";
    for (let b = 0; b < 3; b++) {
      const b0 = phase + (b / 3) * Math.PI * 2, side = [], back = [];
      for (let i = 0; i <= 8; i++) {
        const u = i / 8, r = 3 + 14.5 * u, w = Math.sin(Math.PI * u);
        side.push(at(a, 3, r * Math.cos(b0 + 0.5 * w), r * Math.sin(b0 + 0.5 * w)));
        back.unshift(at(a, 3, r * Math.cos(b0 - 0.2 * w), r * Math.sin(b0 - 0.2 * w)));
      }
      d += poly(side.concat(back));
    }
    blades.setAttribute("d", d);
  }

  const B = register(stage, (dt) => {
    const turning = stepS(aim, dt);
    if (!turning) spin.t = 0;
    const spinning = stepS(spin, dt);
    phase = (phase + spin.x * dt) % (Math.PI * 2);
    draw();
    return turning || spinning;
  });
  bag.add(B.unregister);

  let on = false;
  function retarget(target, near) {
    aim.t = target;
    if (on) spin.t = 5 + 20 * near;
    cage.sil.classList.toggle("hi", on);
    knob.setAttribute("class", on ? "dot off" : "dot");
    read.textContent = on ? "aim " + Math.round((target - FWD) * 36 / Math.PI) * 5 + "°" : "rest";
    B.wake();
  }

  bag.add(pointer(stage, {
    move: ([sx, sy]) => {
      const [x, y] = unproj(C, sx, sy, 0), r = Math.hypot(x, y);
      on = r > 8 && r < 120;
      if (!on) return retarget(REST, 0);
      const off = Math.atan2(y, x) - FWD, w = off - Math.PI * 2 * Math.round(off / (Math.PI * 2));
      retarget(FWD + clamp(w, -SPAN, SPAN), clamp(1 - (r - 20) / 70, 0, 1));
    },
    leave: () => { on = false; retarget(REST, 0); },
  }));
  bag.add(() => svg.replaceChildren());
  retarget(REST, 0);
  return { set: (v) => { aim.k = 100 * v; aim.c = 18 * Math.sqrt(v); }, destroy: bag.dispose };
}

hairline({
  name: "deskfan",
  means: "An oscillating desk fan: the head turns to face the pointer, and the blades spin while it turns, faster when the pointer is near.",
  rules: [1, 3, 5, 8],
  range: [0.5, 1, 1.6],
  tour: [[150, 230], [210, 270], [270, 220], null],
  mount,
});
