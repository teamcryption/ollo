/**
 * Manure spreader: a trailer box on two wheels with two upright beaters at
 * the back behind a hinged rear gate. The pointer over the trailer swings the
 * gate up and turns the beaters; the slider is how far the gate opens and the
 * beaters turn. At rest the gate hangs just ajar and is the bright mark.
 */
const {
  Cam, fit, proj, facing, rings, prism, put, solid, mk, hull, poly, unproj,
  tween, tset, tval, tdone, register, pointer, disposer, rad,
} = HL;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amt = value, on = false, lastKey = "";
  const C = Cam(45, 0.5, 1.75);
  fit(C, [[-92, -30, 0], [64, 30, 0], [-92, 30, 30], [64, -26, 50], [96, -26, 72], [96, 26, 72], [-10, 34, 0]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const box = (x0, y0, x1, y1, z0, z1, r = 2, b = 1) => {
    const [a, i] = rings(x0, y0, x1, y1, r, b), s = solid(g);
    put(s, prism(P, front, a, i, z0, z1)); return s;
  };
  const disc = (cx, cy, cz, R, n = 28) => Array.from({ length: n }, (_, k) => {
    const t = (k / n) * 2 * Math.PI; return P(cx + R * Math.cos(t), cy, cz + R * Math.sin(t));
  });
  const wheel = (y, w) => {
    mk("path", { class: "sil", d: poly(hull(disc(-12, y, 15, 15).concat(disc(-12, y + w, 15, 15)))) }, g);
    mk("path", { class: "lo", d: poly(disc(-12, y + (w > 0 ? w : 0), 15, 7)) }, g);
  };
  wheel(-30, 6);
  box(-92, -3, -60, 3, 13, 18, 1.5, 0.6);
  box(-60, -22, 34, 22, 14, 44, 3, 1.4);
  box(34, -25, 62, -22, 40, 49, 1.2, 0.5);
  // beaters: two upright drums, each with four blades that turn
  const beaters = [-11, 11].map((cy) => {
    const grp = mk("g", {}, g), drum = solid(grp);
    const [a, i] = rings(46 - 6, cy - 6, 46 + 6, cy + 6, 6, 1.2);
    put(drum, prism(P, front, a, i, 15, 46));
    const blades = [0, 1, 2, 3].map(() => mk("path", { class: "sil" }, grp));
    return { cy, grp, drum, blades };
  });
  box(34, 22, 62, 25, 40, 49, 1.2, 0.5);
  const gate = mk("path", { class: "sil hi" }, g), face = mk("path", { class: "lo nf" }, g);
  wheel(24, 6);
  const tw = tween(0);

  function draw(now) {
    const t = tval(tw, now), key = t.toFixed(4) + "," + amt;
    if (key === lastKey) return;
    lastKey = key;
    const a = rad(8 + t * 105 * amt), th = rad(20 + t * 200 * amt), L = 34, Y = 24;
    for (const b of beaters) {
      const back = [], fr = [];
      b.blades.forEach((el, k) => {
        const q = th + (k * Math.PI) / 2 + (b.cy > 0 ? Math.PI / 4 : 0), c = Math.cos(q), s = Math.sin(q);
        const pts = [[5, 16], [11, 16], [11, 45], [5, 45]].map(([r, z]) => P(46 + r * c, b.cy + r * s, z));
        el.setAttribute("d", poly(hull(pts)));
        (c + s < 0 ? back : fr).push(el);
      });
      b.grp.append(...back, b.drum.g, ...fr);
    }
    const dx = Math.sin(a), dz = -Math.cos(a), nx = Math.cos(a), nz = Math.sin(a);
    const pt = (s, y, o) => P(62 + s * dx + o * nx, y, 48 + s * dz + o * nz);
    const pts = [];
    for (const s of [0, L]) for (const y of [-Y, Y]) for (const o of [0, 2]) pts.push(pt(s, y, o));
    gate.setAttribute("d", poly(hull(pts)));
    face.setAttribute("d", poly([pt(1.5, -Y + 1.5, 2), pt(1.5, Y - 1.5, 2), pt(L - 1.5, Y - 1.5, 2), pt(L - 1.5, -Y + 1.5, 2)]));
  }

  const B = register(stage, (dt, now) => { draw(now); return !tdone(tw, now); });
  bag.add(B.unregister);

  function retarget() {
    const now = performance.now();
    tset(tw, on ? 1 : 0, now, 0);
    gate.classList.toggle("hi", !on);
    for (const b of beaters) b.drum.sil.classList.toggle("hi", on);
    read.textContent = on ? `gate ${Math.round(8 + 105 * amt)}°` : "rest";
    B.wake();
  }

  bag.add(pointer(stage, {
    move: (p) => {
      const [x, y] = unproj(C, p[0], p[1], 44);
      on = x > -66 && x < 70 && Math.abs(y) < 30;
      retarget();
    },
    leave: () => { on = false; retarget(); },
  }));
  bag.add(() => svg.replaceChildren());
  retarget();
  return {
    set: (v) => { amt = v; lastKey = ""; retarget(); },
    destroy: bag.dispose,
  };
}

hairline({
  name: "manurespreader",
  means: "A manure spreader: the pointer swings its rear gate up and turns the two upright beaters behind it.",
  rules: [1, 3, 5, 8],
  range: [0.3, 1, 1],
  tour: [[200, 112], [294, 140], [245, 165], null],
  mount,
});
