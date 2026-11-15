/**
 * Knife switch: a three-pole knife switch on a slate base, each copper blade
 * hinged on its post and closing into its jaw, the three joined by a cross bar
 * with a handle. The pointer picks a pole and the blades swing open, nearest
 * first. At rest the switch stands a little open, the middle blade bright.
 */
const { Cam, facing, fit, prism, proj, rings, unproj, hull, poly, seg, tween, tset, tval, tdone, disposer, mk, pointer, put, register, solid } = HL;

const YS = [-18, 0, 18], HX = -30, HZ = 12, L = 58, REST = [14, 18, 22];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 2.55);
  fit(C, [[-44, -32, 0], [44, 32, 0], [HX, 0, HZ + L], [44, 32, 6]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const R = rings(-44, -32, 44, 32, 4, 1.6);
  put(solid(g), prism(P, front, R[0], R[1], 0, 5));
  const at = (a, l, y, dz) => { const c = Math.cos(a), s = Math.sin(a); return P(HX + l * c - dz * s, y, HZ + l * s + dz * c); };
  const box = (a, l0, l1, y0, y1, d0, d1) => {
    const pts = [];
    for (const l of [l0, l1]) for (const y of [y0, y1]) for (const d of [d0, d1]) pts.push(at(a, l, y, d));
    return pts;
  };
  const poles = YS.map((y, i) => {
    const gg = mk("g", {}, g);
    const pr = rings(HX - 3, y - 4, HX + 3, y + 4, 1.5, 0.8), jr = rings(28, y - 4, 34, y + 4, 1.5, 0.8);
    put(solid(gg), prism(P, front, pr[0], pr[1], 5, HZ + 2));
    put(solid(gg), prism(P, front, jr[0], jr[1], 5, HZ + 3));
    const blade = solid(gg);
    return { i, y, blade, tw: tween(REST[i]), drawn: NaN };
  });
  const bar = solid(g), knob = solid(g);
  let last = NaN;
  function draw(now) {
    let m = false;
    for (const p of poles) {
      const a = tval(p.tw, now) * Math.PI / 180;
      if (!tdone(p.tw, now)) m = true;
      if (a !== p.drawn) {
        p.drawn = a;
        const pts = box(a, -2, L, p.y - 1.4, p.y + 1.4, -2.2, 2.2);
        p.blade.sil.setAttribute("d", poly(hull(pts)));
        p.blade.cr.setAttribute("d", seg(at(a, 0, p.y, 2.2), at(a, L - 2, p.y, 2.2)));
      }
    }
    const a = poles[1].drawn;
    if (a !== last) {
      last = a;
      bar.sil.setAttribute("d", poly(hull(box(a, L - 8, L - 3, -22, 22, 2, 5))));
      knob.sil.setAttribute("d", poly(hull(box(a, L - 7.5, L - 3.5, -3, 3, 5, 16))));
      knob.cr.setAttribute("d", seg(at(a, L - 5.5, 0, 6), at(a, L - 5.5, 0, 15)));
    }
    return m;
  }
  const B = register(stage, (dt, now) => draw(now));
  bag.add(B.unregister);
  let open = 70 * value, pick = null;
  function retarget() {
    const now = performance.now();
    for (const p of poles) {
      const to = pick === null ? REST[p.i] : open;
      tset(p.tw, to, now, pick === null ? 0 : Math.abs(p.i - pick) * 45);
      p.blade.sil.classList.toggle("hi", pick === null ? p.i === 1 : p.i === pick);
    }
    read.textContent = pick === null ? "rest" : "pole " + (pick + 1);
    B.wake();
  }
  bag.add(pointer(stage, {
    move: (q) => {
      const [x, y] = unproj(C, q[0], q[1], 0);
      if (Math.abs(x) > 50 || Math.abs(y) > 38) pick = null;
      else { let b = 0; YS.forEach((v, i) => { if (Math.abs(y - v) < Math.abs(y - YS[b])) b = i; }); pick = b; }
      retarget();
    },
    leave: () => { pick = null; retarget(); },
  }));
  bag.add(() => svg.replaceChildren());
  retarget();
  return { set: (v) => { open = 70 * v; retarget(); }, destroy: bag.dispose };
}

hairline({
  name: "switchgear",
  means: "A three-pole knife switch: the pointer picks a pole and the blades swing open from their jaws, nearest first.",
  rules: [1, 2, 4, 8],
  range: [0.6, 1, 1.25],
  tour: [[249, 195], [216, 212], [184, 228], null],
  mount,
});
