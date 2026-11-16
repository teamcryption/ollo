/**
 * Cow bell: a flared iron bell on a leather strap, hung from a timber frame,
 * its clapper showing under the mouth. The pointer swings it: the bell
 * leans toward the side the pointer stands on, the clapper trailing with it.
 * At rest it hangs a little swung, its body bright. The slider is how far
 * it may swing.
 *
 * The pattern: a continuous aim on one pivot (a spring on an angle); the hit
 * is the pointer's screen x, which never moves with the bell.
 */
const { Cam, fit, hull, poly, proj, clamp, rad, spring, stepS, disposer, mk, pointer, register } = HL;

const HZ = 50, REST = 14;
const box = (x0, y0, z0, x1, y1, z1) => [[x0, y0, z0], [x1, y0, z0], [x0, y1, z0], [x1, y1, z0], [x0, y0, z1], [x1, y0, z1], [x0, y1, z1], [x1, y1, z1]];
const ring = (hx, hy, z, n = 16) => { const o = []; for (let i = 0; i < n; i++) { const t = (i / n) * Math.PI * 2, c = Math.cos(t), s = Math.sin(t); o.push([hx * Math.sign(c) * Math.abs(c) ** 0.4, hy * Math.sign(s) * Math.abs(s) ** 0.4, z]); } return o; };
// the bell in its pivot's frame, hanging down from z 0
const STRAP = box(-1.6, -3, -9, 1.6, 3, 1.5);
const BODY = [...ring(7, 5, -8), ...ring(9.5, 7, -24), ...ring(12, 9, -36)];
const CLAP = [...ring(1, 1, -12, 8), ...ring(3.2, 3.2, -40, 10), ...ring(2.4, 2.4, -44, 10)];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.7);
  fit(C, [[-30, -22, 0], [30, 22, 0], [-26, 0, HZ - 30], [26, 0, HZ - 30], [0, -22, HZ + 4], [0, 22, HZ + 4]], 200, 160);
  const P = proj(C);
  const g = mk("g", {}, svg);
  const solid0 = (pts, cls) => mk("path", { d: poly(hull(pts.map((p) => P(...p)))), class: cls }, g);
  mk("path", { d: poly([P(-24, -22, 0), P(24, -22, 0), P(24, 22, 0), P(-24, 22, 0)]), class: "nf dash" }, g);
  solid0(box(-6, -24, 0, 6, -17, 2.4), "");
  solid0(box(-2.4, -22, 2.4, 2.4, -18, HZ - 2), "sil");
  solid0(box(-3, -23, HZ - 2, 3, 23, HZ + 3), "sil");
  const bell = mk("g", {}, g);
  const clap = mk("path", { class: "sil" }, bell), body = mk("path", { class: "sil" }, bell), strap = mk("path", { class: "sil" }, bell);
  solid0(box(-6, 17, 0, 6, 24, 2.4), "");
  solid0(box(-2.4, 18, 2.4, 2.4, 22, HZ - 2), "sil");
  const sp = spring(rad(REST), { k: 70, c: 9 }), cp = spring(rad(REST), { k: 50, c: 7 });
  let last = NaN, lastc = NaN;
  const T = (pts, a) => { const c = Math.cos(a), s = Math.sin(a); return poly(hull(pts.map(([x, y, z]) => P(x * c + z * s, y, HZ - 3 - x * s + z * c)))); };
  const B = register(stage, (dt) => {
    const m = stepS(sp, dt) | stepS(cp, dt);
    if (sp.x !== last) { last = sp.x; body.setAttribute("d", T(BODY, last)); strap.setAttribute("d", T(STRAP, last)); }
    if (cp.x !== lastc) { lastc = cp.x; clap.setAttribute("d", T(CLAP, lastc)); }
    return !!m;
  });
  bag.add(B.unregister);
  function aim(deg, on) {
    sp.t = rad(deg); cp.t = rad(deg * 0.7);
    body.classList.toggle("hi", true);
    read.textContent = on ? Math.round(deg) + "\u00b0" : "rest";
    B.wake();
  }
  aim(REST, false);
  bag.add(pointer(stage, {
    move: ([sx]) => aim(-clamp((sx - 200) / 110, -1, 1) * (16 + 22 * reach), true),
    leave: () => aim(REST, false),
  }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; }, destroy: bag.dispose };
}

hairline({
  name: "cowbell",
  means: "A cow bell hung from a timber frame: it swings toward the side the pointer stands on, its clapper trailing.",
  rules: [1, 3, 5, 8],
  range: [0, 0.6, 1],
  tour: [[284, 135], [120, 170], [200, 190], null],
  mount,
});
