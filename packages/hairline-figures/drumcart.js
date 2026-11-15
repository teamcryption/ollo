/**
 * Drum trolley: a two-wheeled hand truck carrying an upright barrel drum,
 * the nose plate under it and the handle bar up top. The pointer over the
 * trolley tilts it back on its axle, drum and all, ready to roll. At rest
 * it stands nearly upright, the near wheel bright. The slider is the tilt.
 */
const { Cam, clamp, fit, hull, open, poly, proj, seg, rad, tdone, tset, tval, tween, disposer, mk, pointer, put, register, solid } = HL;

const AZ = 4, RW = 4.5, REST = 6;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let tilt = value;
  const C = Cam(45, 0.5, 5.4);
  fit(C, [[-30, -12, 0], [16, 12, 0], [-30, 12, 44], [16, -12, 44], [16, 12, 30]], 200, 160);
  const P = proj(C), g = mk("g", {}, svg);
  const T = (t) => (lx, y, lz) => P(-lz * Math.sin(t) + lx * Math.cos(t), y, AZ + lx * Math.sin(t) + lz * Math.cos(t));
  const wheel = (y) => { const pts = []; for (let i = 0; i < 28; i++) { const a = (i / 28) * Math.PI * 2; pts.push(P(RW * Math.cos(a), y, AZ + RW * Math.sin(a))); } return pts; };
  const farW = mk("path", { class: "sil" }, g); farW.setAttribute("d", poly(wheel(-10)));
  const frame = solid(g), plate = solid(g), drum = solid(g);
  const nearW = solid(g);
  const nw = wheel(10), hub = []; for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2; hub.push(P(1.4 * Math.cos(a), 10, AZ + 1.4 * Math.sin(a))); }
  put(nearW, { sil: poly(nw), crease: poly(hub) });
  const tw = tween(REST);
  let last = NaN;
  function draw(deg) {
    if (deg === last) return;
    last = deg;
    const F = T(rad(deg));
    let d = "", c = "";
    for (const y of [-6, 6]) d += poly(hull([F(-1.5, y - 1, -3), F(-0.5, y + 1, -3), F(-1.5, y - 1, 38), F(-0.5, y + 1, 38)]));
    d += poly(hull([F(-1.5, -7, 36), F(-0.5, 7, 36), F(-1.5, -7, 38), F(-0.5, 7, 38)]));
    frame.sil.setAttribute("d", d);
    plate.sil.setAttribute("d", poly(hull([F(-1, -8, -4), F(13, -8, -4), F(-1, 8, -4), F(13, 8, -4), F(-1, -8, -3), F(13, 8, -3), F(13, -8, -3), F(-1, 8, -3)])));
    const ring = (lz) => { const r = []; for (let i = 0; i < 32; i++) { const a = (i / 32) * Math.PI * 2; r.push(F(5.5 + 9 * Math.cos(a), 9 * Math.sin(a), lz)); } return r; };
    const fr = (lz) => { const r = []; for (let i = -12; i <= 4; i++) { const a = (i / 32) * Math.PI * 2; r.push(F(5.5 + 9 * Math.cos(a), 9 * Math.sin(a), lz)); } return r; };
    drum.sil.setAttribute("d", poly(hull(ring(-2).concat(ring(26)))));
    c = poly(ring(26)) + open(fr(8)) + open(fr(16)) + seg(F(8, 2, 26), F(10, 2, 26));
    drum.cr.setAttribute("d", c);
  }
  const B = register(stage, (_dt, now) => { draw(tval(tw, now)); return !tdone(tw, now); });
  bag.add(B.unregister);
  let act = -2;
  function setActive(a) {
    if (a === act) return;
    act = a;
    tset(tw, a ? tilt : REST, performance.now(), 0);
    drum.sil.classList.toggle("hi", !!a);
    nearW.sil.classList.toggle("hi", !a);
    read.textContent = a ? "tilt " + tilt + "°" : "rest";
    B.wake();
  }
  setActive(0);
  bag.add(pointer(stage, { move: ([sx, sy]) => setActive(sx > 90 && sx < 310 && sy > 30 && sy < 300 ? 1 : 0), leave: () => setActive(0) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { tilt = v; if (act === 1) { act = -2; setActive(1); } }, destroy: bag.dispose };
}

hairline({
  name: "drumcart",
  means: "A drum trolley: the pointer over it tilts the hand truck back on its axle, barrel and all, ready to roll.",
  rules: [3, 4, 5, 8],
  range: [20, 34, 45],
  tour: [[246, 123], [200, 180], [234, 250], null],
  mount,
});
