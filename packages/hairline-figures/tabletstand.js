/**
 * Tablet stand: a tablet resting on a desk stand, its foot in a front lip,
 * leaning back on a hinged strut. The pointer is the tablet's top edge: the
 * tablet tilts on its hinge until its top sits under the pointer, from nearly
 * upright to laid far back. At rest it leans a little past upright and the
 * camera dot is bright. The slider is how stiff the hinge is.
 *
 * The pattern: a continuous tilt on one spring; the hit is a table of rest
 * poses (angle -> screen height of the top edge), which never moves.
 */
const {
  Cam, facing, fit, hull, poly, prism, proj, rings, rrect, seg, spring, stepS,
  disposer, mk, place, pointer, put, register, solid, clamp, rad,
} = HL;

const W = 46, H = 66, T = 2.4, HY = 20, HZ = 3.5, A0 = 8, A1 = 68, REST = 22;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 1.95);
  // a tablet point: u across, w up the face, d into its back
  const at = (a, u, w, d) => {
    const s = Math.sin(rad(a)), c = Math.cos(rad(a));
    return [u, HY - w * s - d * c, HZ + w * c - d * s];
  };
  const ext = [[-44, -36, 0], [44, 30, 0]];
  for (const a of [A0, A1]) for (const u of [-W, W]) for (const w of [0, H]) ext.push(at(a, u, w, 0));
  fit(C, ext, 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  // base plate, strut guide, tablet, then the lip in front of its foot
  const [bR, bI] = rings(-40, -32, 40, 26, 6, 1.6);
  put(solid(g), prism(P, front, bR, bI, 0, HZ));
  const strut = mk("path", { class: "nf sil" }, g);
  const tab = solid(g);
  const screen = mk("path", { class: "nf lo" }, tab.g);
  const cam = mk("circle", { class: "dot", r: 1.6 }, tab.g);
  const [lR, lI] = rings(-36, HY + 1, 36, HY + 6, 2, 0.8);
  put(solid(g), prism(P, front, lR, lI, HZ, HZ + 5));

  const outer = rrect(-W, 0, W, H, 5, 6), inner = rrect(-W + 4, 5, W - 4, H - 5, 2.5, 4);
  const table = [];
  for (let a = A0; a <= A1; a += 0.5) table.push([a, P(...at(a, 0, H, 0))[1]]);

  const sp = spring(REST, { k: 100 * value, c: 18 * Math.sqrt(value) });
  let drawn = NaN, over = false;
  function draw() {
    const a = sp.x;
    if (Math.abs(a - drawn) < 1e-3) return;
    drawn = a;
    const pts = outer.map((q) => P(...at(a, q.u, q.v, 0))).concat(outer.map((q) => P(...at(a, q.u, q.v, T))));
    tab.sil.setAttribute("d", poly(hull(pts)));
    tab.cr.setAttribute("d", poly(outer.map((q) => P(...at(a, q.u * 0.97, 1.5 + q.v * 0.955, 0)))));
    screen.setAttribute("d", poly(inner.map((q) => P(...at(a, q.u, q.v, 0)))));
    place(cam, P(...at(a, 0, H - 2.6, 0)));
    // the strut runs from the back of the base up to the tablet's back
    let d = "";
    for (const u of [-22, 22]) d += seg(P(u, -28, HZ), P(...at(a, u, H * 0.55, T)));
    strut.setAttribute("d", d);
  }

  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(); return m; });
  bag.add(B.unregister);

  function show() {
    tab.sil.classList.toggle("hi", over);
    cam.setAttribute("class", over ? "dot m" : "dot");
    read.textContent = over ? Math.round(sp.t) + "°" : "rest";
    B.wake();
  }
  bag.add(pointer(stage, {
    move: (p) => {
      if (p[0] < 60 || p[0] > 340) { over = false; sp.t = REST; show(); return; }
      let best = REST, bd = Infinity;
      for (const [a, y] of table) { const d = Math.abs(y - p[1]); if (d < bd) { bd = d; best = a; } }
      over = true; sp.t = clamp(best, A0, A1); show();
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
  name: "tabletstand",
  means: "A tablet on a hinged desk stand: it tilts back on its hinge until its top edge sits under the pointer.",
  rules: [1, 3, 5, 8],
  range: [0.5, 1, 1.6],
  tour: [[185, 109], [130, 183], [213, 252], null],
  mount,
});
