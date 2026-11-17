/**
 * Street clock: a round two-faced clock head on a slim post, standing on a
 * plinth. The pointer is a passer-by: the head turns on its collar to face
 * them, and its hands sweep round as it turns. At rest it faces a little
 * left, its minute hand bright. The slider is how far the head turns.
 */
const {
  Cam, circ, clamp, fit, facing, hull, open, poly, prism, proj, rings, seg, unproj, spring, stepS, rad,
  disposer, mk, pointer, put, register, solid,
} = HL;

const R = 30, T = 9, PZ = 64, HZ = PZ + R + 2, REST = 20;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.2);
  fit(C, [[-12, -12, 0], [12, 12, 0], [-R, R, HZ], [R, -R, HZ], [0, 0, HZ + R], [R * 0.7, R * 0.7, HZ - R]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [pr, pi] = rings(-11, -11, 11, 11, 7, 2);
  put(solid(g), prism(P, front, pr, pi, 0, 6));
  put(solid(g), prism(P, front, circ(5, 24), circ(3.5, 24), 6, 12));
  put(solid(g), prism(P, front, circ(2.6, 20), circ(1.6, 20), 12, PZ));
  put(solid(g), prism(P, front, circ(4.5, 24), circ(3, 24), PZ - 2, PZ + 3));
  const head = solid(g);
  const face = mk("path", { class: "nf lo" }, g), ticks = mk("path", { class: "nf lo" }, g);
  const hour = mk("path", { class: "nf" }, g), minute = mk("path", { class: "nf hi" }, g);
  const yaw = spring(REST);
  let last = NaN;

  function draw(a) {
    if (a === last) return;
    last = a;
    const c = Math.cos(rad(a)), s = Math.sin(rad(a));
    const side = c + s >= 0 ? 1 : -1;
    const at = (off, r, th) => P(-s * r * Math.cos(th) + c * off, c * r * Math.cos(th) + s * off, HZ + r * Math.sin(th));
    const rim = (off, r, n = 40) => Array.from({ length: n }, (_, i) => at(off, r, (i / n) * Math.PI * 2));
    head.sil.setAttribute("d", poly(hull(rim(T / 2, R).concat(rim(-T / 2, R)))));
    head.cr.setAttribute("d", "");
    const fo = side * T / 2;
    face.setAttribute("d", poly(rim(fo, R - 2.5)));
    let d = "";
    for (let i = 0; i < 12; i++) { const th = (i / 12) * Math.PI * 2; d += seg(at(fo, R - 7, th), at(fo, R - (i % 3 ? 5 : 3.5), th)); }
    ticks.setAttribute("d", d);
    const turn = (a - REST) * 6;
    const mth = rad(90 - turn * side), hth = rad(90 - (300 + turn / 12) * side);
    minute.setAttribute("d", open([at(fo, 0, 0), at(fo, R - 8, mth)]));
    hour.setAttribute("d", open([at(fo, 0, 0), at(fo, R - 14, hth)]));
  }

  const B = register(stage, (dt) => {
    const m = stepS(yaw, dt);
    draw(yaw.x);
    return m;
  });
  bag.add(B.unregister);

  function aim(p) {
    if (!p) { yaw.t = REST; read.textContent = "rest"; B.wake(); return; }
    const [x, y] = unproj(C, p[0], p[1], 0);
    if (Math.hypot(x, y) > 140) return aim(null);
    const ang = Math.atan2(y, x) * 180 / Math.PI;
    const off = clamp(((ang - 45 + 540) % 360) - 180, -80, 80);
    yaw.t = 45 + off * reach;
    const mins = Math.round(((yaw.t - REST) * 6 / 360) * 60 + 600) % 720;
    read.textContent = (Math.floor(mins / 60) || 12) + ":" + String(mins % 60).padStart(2, "0");
    B.wake();
  }
  aim(null);
  draw(REST);
  bag.add(pointer(stage, { move: (p) => aim(p), leave: () => aim(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; }, destroy: bag.dispose };
}

hairline({
  name: "clockpost",
  means: "A street clock on a post: its round head turns on its collar to face the pointer, and the hands sweep round as it turns.",
  rules: [1, 3, 5, 8],
  range: [0.35, 0.7, 1],
  tour: [[254, 290], [161, 304], [146, 296], null],
  mount,
});
