/**
 * Laptop stand: a riser plate hinged at its front lip on a low base, held up
 * by a pair of struts, a closed laptop resting on it. The pointer over the
 * stand tilts the plate up on its hinge; the struts follow. At rest the plate
 * sits at a shallow working angle and its lip is bright. The slider is how
 * steeply it tilts.
 */
const { Cam, facing, fit, prism, proj, rings, rrect, hull, poly, seg, unproj, spring, stepS, disposer, mk, pointer, put, register, solid } = HL;

const X = 30, Y = 22, Z0 = 4, REST = 10, UP = 40;
const rad = (d) => (d * Math.PI) / 180;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 3.3);
  fit(C, [[-X, -Y, 0], [X, Y, 0], [-X, -Y, Z0 + 2 * Y * Math.sin(rad(UP * 1.2)) + 6], [X, -Y, Z0 + 2 * Y * Math.sin(rad(UP * 1.2)) + 6]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  let amp = value;

  const BASE = rings(-X, -Y, X, Y, 6, 1.6);
  put(solid(g), prism(P, front, BASE[0], BASE[1], 0, Z0));
  const struts = mk("path", { class: "nf sil" }, g);
  const plate = solid(g), lap = solid(g), lip = mk("path", { class: "nf sil" }, g);
  const PL = rrect(-X, -Y, X, Y, 6, 4), PLI = rrect(-X + 2, -Y + 2, X - 2, Y - 2, 4, 4);
  const LP = rrect(-X + 4, -Y + 3, X - 4, Y - 6, 3, 4), LPI = rrect(-X + 6, -Y + 5, X - 6, Y - 8, 2, 4);
  const at = (u, v, a, t) => {
    const d = Y - v, c = Math.cos(a), s = Math.sin(a);
    return P(u, Y - d * c + t * s, Z0 + d * s + t * c);
  };
  const sp = spring(REST);
  let drawn = NaN;

  function slab(sd, ring, inner, a, t0, t1) {
    const pts = ring.map((q) => at(q.u, q.v, a, t0)).concat(ring.map((q) => at(q.u, q.v, a, t1)));
    sd.sil.setAttribute("d", poly(hull(pts)));
    sd.cr.setAttribute("d", poly(inner.map((q) => at(q.u, q.v, a, t1))));
  }

  function draw() {
    if (sp.x === drawn) return;
    drawn = sp.x;
    const a = rad(sp.x);
    slab(plate, PL, PLI, a, 0, 2);
    slab(lap, LP, LPI, a, 2, 6);
    // the lip that stops the laptop sliding, on the plate's front edge
    lip.setAttribute("d", seg(at(-X + 6, Y - 1, a, 2), at(X - 6, Y - 1, a, 2)) + seg(at(-X + 6, Y - 1, a, 5), at(X - 6, Y - 1, a, 5)));
    // two struts from the base's back to the plate's underside
    let d = "";
    for (const u of [-X + 8, X - 8]) d += seg(P(u, -Y + 10, Z0), at(u, -Y + 4, a, 0));
    struts.setAttribute("d", d);
  }

  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(); return m; });
  bag.add(B.unregister);

  let on = false;
  function apply() {
    sp.t = on ? UP * amp : REST;
    plate.sil.classList.toggle("hi", on);
    lip.classList.toggle("hi", !on);
    read.textContent = on ? Math.round(UP * amp) + "°" : "rest";
    B.wake();
  }

  bag.add(pointer(stage, {
    move: (p) => {
      const [x, y] = unproj(C, p[0], p[1], 0);
      const n = Math.abs(x) < X + 14 && y > -Y - 70 && y < Y + 14;
      if (n !== on) { on = n; apply(); }
    },
    leave: () => { on = false; apply(); },
  }));
  bag.add(() => svg.replaceChildren());
  apply();
  draw();
  return { set: (v) => { amp = v; apply(); }, destroy: bag.dispose };
}

hairline({
  name: "vrheadset2",
  means: "A laptop stand: the pointer tilts the riser plate up on its front hinge, struts following, the laptop riding on it.",
  rules: [1, 4, 5, 8],
  range: [0.5, 1, 1.2],
  tour: [[149, 198], [137, 117], [160, 268], null],
  mount,
});
