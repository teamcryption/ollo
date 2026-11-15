/**
 * Parking meter: a post on a foot plate carrying a rounded meter head with a
 * coin slot in its cap and a dial window with a needle, a large coin waiting
 * over the slot. The pointer over the meter drops the coin into the slot and
 * the needle swings across the dial; the slider is how far. At rest the
 * waiting coin is the bright mark.
 */
const {
  Cam, clamp, facing, fit, hull, poly, prism, proj, rings, ringAt, rrect, seg, unproj, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;
const CAP = 47, R = 9, WZ = 34;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amt = value;
  const C = Cam(45, 0.5, 4.75);
  fit(C, [[-14, -9, 20], [14, 9, 20], [-14, 9, 20], [14, -9, 20], [-6, -6, 0], [6, 6, 0], [0, -R, CAP + 2 * R + 3], [0, R, CAP + 2 * R + 3]], 200, 160);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const box = (x0, y0, x1, y1, r, b, z0, z1) => { const s = solid(g), [o, i] = rings(x0, y0, x1, y1, r, b); put(s, prism(P, front, o, i, z0, z1)); return s; };
  const H3 = (pts) => poly(hull(pts.map((p) => P(...p))));
  const L3 = (pts) => pts.map((p, k) => (k ? "L" : "M") + P(...p).map((n) => n.toFixed(1)).join(" ")).join("");
  box(-6, -6, 6, 6, 2, 1, 0, 2);
  box(-2.5, -2.5, 2.5, 2.5, 2.5, 0.8, 2, 20);
  const head = box(-14, -9, 14, 9, 7, 1.5, 20, 44);
  const cap = box(-13, -8, 13, 8, 6.5, 1.4, 44, CAP);
  const win = [];
  for (let i = 0; i <= 24; i++) { const a = (i / 24) * Math.PI * 2; win.push([9 * Math.cos(a), 9, WZ + 6 * Math.sin(a)]); }
  mk("path", { class: "nf lo", d: L3(win) + seg(P(-6, 9, WZ - 2), P(6, 9, WZ - 2)) }, head.g);
  mk("path", { class: "nf lo", d: poly(ringAt(P, rrect(-0.8, -R + 1, 0.8, R - 1, 0.8, 3), CAP)) }, cap.g);
  const needle = mk("path", { class: "nf" }, g);
  const cg = mk("g", {}, g), coin = mk("path", { class: "sil" }, cg), face = mk("path", { class: "nf lo" }, cg);
  const t = tween(0);
  let last = NaN;
  function draw(v) {
    if (v === last) return;
    last = v;
    const zc = CAP + R + 3 - (R + 2) * v, pts = [], fr = [];
    for (let i = 0; i < 32; i++) {
      const a = (i / 32) * Math.PI * 2, y = R * Math.cos(a), z = Math.max(CAP, zc + R * Math.sin(a));
      pts.push([-0.9, y, z], [0.9, y, z]);
      if (zc + R * 0.7 * Math.sin(a) > CAP) fr.push([0.9, 0.7 * y, zc + R * 0.7 * Math.sin(a)]);
    }
    coin.setAttribute("d", H3(pts));
    face.setAttribute("d", fr.length > 2 ? L3(fr) : "");
    const ang = Math.PI * (0.85 - 0.7 * v);
    needle.setAttribute("d", seg(P(0, 9, WZ - 2), P(7.5 * Math.cos(ang), 9, WZ - 2 + 7.5 * Math.sin(ang))));
  }
  const zone = hull([[-14, -9, 0], [14, 9, 0], [-14, 9, 0], [14, -9, 0], [0, -R - 1, CAP + 2 * R + 4], [0, R + 1, CAP + 2 * R + 4], [-14, 9, CAP], [14, -9, CAP]].map((p) => P(...p)));
  const side = (q, k) => { const a = zone[k], b = zone[(k + 1) % zone.length]; return (b[0] - a[0]) * (q[1] - a[1]) - (b[1] - a[1]) * (q[0] - a[0]); };
  function hit(q) { const s = zone.map((_, k) => side(q, k)); return s.every((v) => v >= 0) || s.every((v) => v <= 0); }
  function mark(a) { coin.classList.add("hi"); read.textContent = a ? "paid" : "rest"; }
  const B = register(stage, (_dt, now) => { draw(tval(t, now)); return !tdone(t, now); });
  bag.add(B.unregister);
  let act = null;
  function setActive(a) {
    if (a === act) return;
    act = a;
    tset(t, a ? amt : 0, performance.now(), 0);
    mark(a);
    B.wake();
  }
  setActive(false);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amt = v; if (act) { tset(t, amt, performance.now(), 0); B.wake(); } }, destroy: bag.dispose };
}

hairline({
  name: "permitkiosk",
  means: "A parking meter: the pointer over it drops the coin into the slot and the needle swings across the dial.",
  rules: [1, 3, 4, 5],
  range: [0.4, 1, 1],
  tour: [[200, 59], [123, 207], [277, 125], null],
  mount,
});
