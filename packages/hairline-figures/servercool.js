/**
 * Rack fans: a 2U rack chassis with a row of four cooling fans behind a
 * front tray door, hinged along its foot. The pointer is the hand on the
 * door: it swings down and out toward the pointer, opening on the fans, and
 * goes bright. At rest the door stands just ajar with its latch lit. The
 * slider is how stiff the hinge is.
 *
 * The pattern: a continuous swing on one spring; the hit is the floor's
 * plane, which never moves.
 */
const {
  Cam, facing, fit, hull, poly, prism, proj, rings, rrect, spring, stepS, unproj,
  disposer, mk, place, pointer, put, register, solid, clamp, rad,
} = HL;

const X = 48, Y0 = -34, Y1 = 8, ZH = 30, T = 2.4, A1 = 84, REST = 9;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 2.15);
  const at = (a, u, w, d) => [u, Y1 + w * Math.sin(rad(a)) + d * Math.cos(rad(a)), w * Math.cos(rad(a)) - d * Math.sin(rad(a))];
  fit(C, [[-X, Y0, 0], [X, Y1, ZH], at(A1, -X, ZH - 2, T), at(A1, X, ZH - 2, T)], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  const [cR, cI] = rings(-X - 4, Y0, X + 4, Y1, 3, 1.4);
  put(solid(g), prism(P, front, cR, cI, 0, ZH + 2));
  // four fans on the chassis front, each a ring and a hub
  for (let i = 0; i < 4; i++) {
    const cx = -36 + i * 24, d = [];
    for (const r of [10, 3]) {
      const ring = [];
      for (let k = 0; k < 28; k++) { const t = (k / 28) * Math.PI * 2; ring.push(P(cx + r * Math.cos(t), Y1, 15 + r * Math.sin(t))); }
      d.push(poly(ring));
    }
    for (let k = 0; k < 5; k++) { const t = (k / 5) * Math.PI * 2 + i; d.push("M" + P(cx + 3 * Math.cos(t), Y1, 15 + 3 * Math.sin(t)) + "L" + P(cx + 9 * Math.cos(t + 0.5), Y1, 15 + 9 * Math.sin(t + 0.5))); }
    mk("path", { class: "nf lo", d: d.join("") }, g);
  }
  const door = solid(g);
  const grille = mk("path", { class: "nf lo" }, door.g);
  const latch = mk("circle", { class: "dot", r: 1.6 }, door.g);
  const outer = rrect(-X, 0, X, ZH - 2, 3, 4);

  const sp = spring(REST, { k: 100 * value, c: 18 * Math.sqrt(value) });
  let drawn = NaN, over = false;
  function draw() {
    const a = sp.x;
    if (Math.abs(a - drawn) < 1e-3) return;
    drawn = a;
    const pts = outer.map((q) => P(...at(a, q.u, q.v, 0))).concat(outer.map((q) => P(...at(a, q.u, q.v, T))));
    door.sil.setAttribute("d", poly(hull(pts)));
    door.cr.setAttribute("d", poly(outer.map((q) => P(...at(a, q.u * 0.97, 0.8 + q.v * 0.94, T)))));
    let d = "";
    for (let k = 1; k < 8; k++) { const u = -X + k * 12; d += "M" + P(...at(a, u, 5, T)) + "L" + P(...at(a, u, ZH - 7, T)); }
    grille.setAttribute("d", d);
    place(latch, P(...at(a, 0, ZH - 4.5, T)));
  }

  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(); return m; });
  bag.add(B.unregister);

  function show() {
    door.sil.classList.toggle("hi", over);
    latch.setAttribute("class", over ? "dot m" : "dot");
    read.textContent = over ? Math.round(sp.t) + "°" : "rest";
    B.wake();
  }
  bag.add(pointer(stage, {
    move: (p) => {
      const [x, y] = unproj(C, p[0], p[1], 0);
      if (Math.abs(x) > X + 20 || y < Y0 || y > Y1 + 60) { over = false; sp.t = REST; show(); return; }
      over = true; sp.t = clamp(((y - Y1 + 6) / 38) * A1, 0, A1); show();
    },
    leave: () => { over = false; sp.t = REST; show(); },
  }));
  bag.add(() => svg.replaceChildren());
  draw(); show();
  return {
    set: (v) => { sp.k = 100 * v; sp.c = 18 * Math.sqrt(v); },
    destroy: bag.dispose,
  };
}

hairline({
  name: "servercool",
  means: "A rack chassis with four cooling fans behind a tray door: the door swings down toward the pointer, opening on the fans.",
  rules: [1, 3, 5, 8],
  range: [0.5, 1, 1.6],
  tour: [[173, 151], [241, 208], [173, 196], null],
  mount,
});
