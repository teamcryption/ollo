/**
 * Hay baler: a square baler on two wheels, a pickup in front and a hitch bar,
 * with a bale chute hinged at its rear. The pointer is how far back the hand
 * is: the chute tips down and the bale slides out along it, on one spring.
 * At rest the bale sits just out of the chamber, the chute's lip bright.
 *
 * The pattern: a continuous reach (one spring) read from the ground plane,
 * which never moves.
 */
const {
  Cam, facing, fillet, fit, hull, poly, open, prism, proj, rings, seg, unproj, spring, stepS, clamp, rad,
  disposer, mk, pointer, put, register, solid,
} = HL;

const lerpA = (p, q, f) => p + (q - p) * f;
const HX = 12, HZ = 15, CL = 46, CW = 13, BL = 17, BH = 12;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 2.55);
  fit(C, [[-62, -16, 0], [-62, 16, 0], [HX + CL, -16, 0], [HX + CL, 16, 0], [-30, -16, 32], [HX, 16, 32]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const shape = (pts, r = 1.4) => { const h = hull(pts.map((q) => P(...q))); return poly(fillet(h, h.map(() => r), 3)); };
  const wheel = (parent, y0, y1) => {
    const ring = (y) => Array.from({ length: 28 }, (_, i) => { const a = (i / 28) * Math.PI * 2; return [-4 + 9 * Math.cos(a), y, 9 + 9 * Math.sin(a)]; });
    const s = solid(parent);
    s.sil.setAttribute("d", poly(hull(ring(y0).concat(ring(y1)).map((q) => P(...q)))));
    s.cr.setAttribute("d", poly(ring(y1).map((q) => P(...q))));
    const hubR = (y) => Array.from({ length: 16 }, (_, i) => { const a = (i / 16) * Math.PI * 2; return [-4 + 3 * Math.cos(a), y, 9 + 3 * Math.sin(a)]; });
    mk("path", { class: "nf lo", d: poly(hubR(y1).map((q) => P(...q))) }, s.g);
  };

  // far side first: far wheel, hitch, pickup, body, near wheel
  wheel(g, -18, -14);
  put(solid(g), prism(P, front, ...rings(-62, -8, -30, -4, 1.2, 0.6), 15, 18));
  put(solid(g), prism(P, front, ...rings(-42, -15, -30, 15, 3, 1.2), 2, 9));
  mk("path", { class: "nf lo", d: [0, 1, 2, 3, 4].map((i) => seg(P(-42, -12 + i * 6, 5), P(-45, -12 + i * 6, 3))).join("") }, g);
  put(solid(g), prism(P, front, ...rings(-30, -13, HX, 13, 3, 1.4), 7, 30));
  wheel(g, 14, 18);

  const chute = solid(g);
  const lip = mk("path", { class: "nf" }, chute.g);
  const bale = solid(g);
  const twine = mk("path", { class: "nf lo" }, bale.g);
  const sp = spring(0, { k: 100 * value, c: 18 * Math.sqrt(value) });
  let drawn = NaN;

  function draw() {
    const t = clamp(sp.x, 0, 1);
    if (Math.abs(t - drawn) < 1e-4) return;
    drawn = t;
    const th = rad(10 + t * 26), c = Math.cos(th), s = Math.sin(th);
    // a point on the chute: along it by a, across by y, above its deck by h
    const at = (a, y, h) => [HX + a * c + h * s, y, HZ - a * s + h * c];
    const deck = [];
    for (const a of [0, CL]) for (const y of [-CW, CW]) for (const h of [0, -2]) deck.push(at(a, y, h));
    chute.sil.setAttribute("d", shape(deck, 1.6));
    chute.cr.setAttribute("d", open([at(CL - 1.5, -CW + 1, 0), at(CL - 1.5, CW - 1, 0)].map((q) => P(...q))));
    lip.setAttribute("d", seg(P(...at(CL, -CW, 0)), P(...at(CL, -CW, 2.5))) + seg(P(...at(CL, CW, 0)), P(...at(CL, CW, 2.5))) + open([at(CL, -CW, 2.5), at(CL, CW, 2.5)].map((q) => P(...q))));
    const a0 = 1 + t * (CL - BL - 2), a1 = a0 + BL, w = CW - 2, box = [];
    for (const a of [a0, a1]) for (const y of [-w, w]) for (const h of [0.3, BH]) box.push(at(a, y, h));
    bale.sil.setAttribute("d", shape(box, 1.6));
    bale.cr.setAttribute("d", open([at(a0 + 1, w - 1, BH), at(a1 - 1, w - 1, BH), at(a1 - 1, -w + 1, BH)].map((q) => P(...q))));
    let d = "";
    for (const f of [0.3, 0.7]) {
      const a = lerpA(a0, a1, f);
      d += open([at(a, -w, BH), at(a, w, BH), at(a, w, 0.3)].map((q) => P(...q)));
    }
    twine.setAttribute("d", d);
  }

  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(); return m; });
  bag.add(B.unregister);

  function mark(on) {
    lip.classList.toggle("hi", !on);
    bale.sil.classList.toggle("hi", on);
  }
  bag.add(pointer(stage, {
    move: (p) => {
      const [x, y] = unproj(C, p[0], p[1], 0);
      if (x < -70 || x > HX + CL + 26 || Math.abs(y) > 46) { sp.t = 0; mark(false); read.textContent = "rest"; B.wake(); return; }
      sp.t = clamp((x + 20) / (CL + 26), 0, 1);
      mark(true);
      read.textContent = "out " + Math.round(sp.t * 100);
      B.wake();
    },
    leave: () => { sp.t = 0; mark(false); read.textContent = "rest"; B.wake(); },
  }));
  bag.add(() => svg.replaceChildren());
  draw();
  mark(false);
  read.textContent = "rest";
  return {
    set: (v) => { sp.k = 100 * v; sp.c = 18 * Math.sqrt(v); },
    destroy: bag.dispose,
  };
}

hairline({
  name: "tractor2",
  means: "A hay baler: the closer the pointer to its rear, the further the chute tips and the bale slides out.",
  rules: [1, 3, 5, 8],
  range: [0.5, 1, 1.6],
  tour: [[186, 180], [222, 234], [312, 243], null],
  mount,
});
