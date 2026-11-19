/**
 * Diabolo: a spool of two cups joined at a narrow waist, sitting in the V of
 * its string between two hand sticks planted in a mat. The pointer near the
 * spool tosses it: it rises off the string, tilting on its axle, and the
 * string snaps straight between the stick tips. At rest it sits in the V,
 * tilted a little, its near cup bright. The slider is how high the toss goes.
 *
 * The pattern: one part answering where the pointer is (aim).
 */
const {
  Cam, circ, clamp, fit, facing, hull, poly, prism, proj, rings, seg, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const CZ = 4, Z0 = 30, TX = 44, TZ = 60, BX = 30, HL2 = 11, RM = 11;
const CUP = [[0, 1.8], [7, 6], [10, 10.5], [11, 11]];
const REST = 0.12;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let most = value;
  const C = Cam(45, 0.5, 2.45);
  fit(C, [[-48, -16, 0], [48, 16, 0], [-48, 16, 0], [48, -16, 0], [0, 0, Z0 + 70 + RM + 4], [0, 0, Z0 - RM]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [mr, mi] = rings(-48, -16, 48, 16, 8, 2);
  put(solid(g), prism(P, front, mr, mi, 0, CZ));
  const stick = (sx) => {
    const a = circ(1.6, 12).map((q) => P(sx * BX + q.u, q.v, CZ)), b = circ(2.2, 12).map((q) => P(sx * TX + q.u, q.v, TZ));
    mk("path", { d: poly(hull(a.concat(b))), class: "sil" }, g);
  };
  stick(-1);
  const str = mk("path", { class: "nf lo" }, g);
  const cups = [mk("path", { class: "" }, g), mk("path", { class: "sil hi" }, g)];
  stick(1);

  const s = spring(REST);
  let last = NaN, act = false;
  function draw() {
    const t = s.x;
    if (t === last) return;
    last = t;
    const cz = Z0 + t * most, th = t * 0.75, ca = Math.cos(th), sa = Math.sin(th);
    // axle across the view (x = -y), pitched up by th
    const h = Math.SQRT1_2, pt = (z, r, f) => { const c = r * Math.cos(f), w = r * Math.sin(f);
      return P(z * ca * h + c * h - w * sa * h, -z * ca * h + c * h + w * sa * h, cz + z * sa + w * ca); };
    [-1, 1].forEach((side, i) => {
      const pts = [];
      for (const [z, r] of CUP) for (let k = 0; k < 24; k++) pts.push(pt(side * z, r, (k / 24) * 2 * Math.PI));
      cups[i].setAttribute("d", poly(hull(pts)));
    });
    const L = P(-TX, 0, TZ), Rr = P(TX, 0, TZ);
    str.setAttribute("d", cz < TZ - 2 ? seg(L, P(0, 0, cz)) + seg(P(0, 0, cz), Rr) : seg(L, Rr));
    read.textContent = act ? "up " + Math.round(t * most) : "rest";
  }

  const B = register(stage, (dt) => { const m = stepS(s, dt); draw(); return m; });
  bag.add(B.unregister);
  const mid = P(0, 0, Z0);
  function aim(p) {
    const d = Math.hypot(p[0] - mid[0], p[1] - mid[1]);
    s.t = clamp(1.3 - d / 90, REST, 1); act = true; last = NaN; B.wake();
  }
  function leave() { s.t = REST; act = false; last = NaN; B.wake(); }
  draw();
  bag.add(pointer(stage, { move: aim, leave }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { most = v; }, destroy: bag.dispose };
}

hairline({
  name: "diabolo",
  means: "A diabolo in the V of its string between two sticks: the pointer near it tosses it up, tilting, and the string snaps straight.",
  rules: [1, 3, 5, 8],
  range: [24, 56, 70],
  tour: [[200, 173], [230, 140], [124, 95], null],
  mount,
});
