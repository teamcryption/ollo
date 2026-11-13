/**
 * Tea set: a round tray with a teapot in the middle, a squat body under a lid
 * and knob, a spout and a loop handle, and four cups on saucers around it.
 * The pointer picks a cup: the teapot turns on one spring to face it and tips
 * on another, spout down, as if to pour, and that cup is bright. At rest the
 * pot sits almost upright, turned a little off one cup, which is bright. The
 * slider is how far the pot tips.
 *
 * The pattern: a continuous aim (officechairs' spring on an angle) and a
 * tilt; the hit is on the cups' fixed plane, which never moves.
 */
const {
  Cam, circ, facing, fit, hull, poly, prism, proj, ringAt, unproj, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const RT = 50, RC = 33, K = 1.2, PHI = [225, 315, 45, 135], FAV = 2, CZ = 4.2, HIT = 13;
const BODY = [[7, 0], [11, 2.5], [13, 6.5], [12.6, 10.5], [10.2, 13.8], [7.2, 15.6]];
const LID = [[7.2, 15.4], [5.6, 17.6], [2.6, 18.8], [1.6, 19.2], [1.6, 20.6], [2.4, 21.4], [1.2, 22.4]];
const SPOUT = [[11, 4.5, 2.8], [15, 7, 2.2], [18.5, 11, 1.7], [21, 15, 1.3]], PIV = 7;
const disc = (x, y, r, n = 28) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));
const wrap = (a) => a - Math.PI * 2 * Math.round(a / (Math.PI * 2));
const rad = (d) => (d * Math.PI) / 180;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let tip = value;
  const C = Cam(45, 0.5, 2.6);
  const ext = [];
  for (let k = 0; k < 12; k++) { const a = (k / 12) * Math.PI * 2; ext.push([RT * Math.cos(a), RT * Math.sin(a), 0], [22 * Math.cos(a), 22 * Math.sin(a), 34]); }
  fit(C, ext, 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  put(solid(g), prism(P, front, circ(RT, 96), circ(RT - 2, 96), 0, 3));

  const cups = PHI.map((phi, k) => {
    const th = rad(phi - 45);
    return { k, x: RC * Math.cos(th), y: RC * Math.sin(th), d: Math.sin(rad(phi)) };
  });
  function cup(c) {
    const grp = mk("g", {}, g), { x, y } = c;
    put(solid(grp), prism(P, front, disc(x, y, 9.5, 40), disc(x, y, 7.6, 40), 3, CZ));
    const h = [];
    for (let i = 0; i <= 12; i++) { const a = (i / 12) * Math.PI * 2, o = 6.2 + 2 * Math.cos(a); h.push(P(x + o * 0.707, y - o * 0.707, CZ + 4 + 2.1 * Math.sin(a))); }
    c.handle = mk("path", { class: "nf sil", d: poly(h) }, grp);
    c.sil = mk("path", { class: "sil", d: poly(hull(ringAt(P, disc(x, y, 3.6), CZ).concat(ringAt(P, disc(x, y, 5.6), CZ + 6.5)))) }, grp);
    mk("path", { class: "nf lo", d: poly(ringAt(P, disc(x, y, 5, 32), CZ + 6.5)) }, grp);
  }
  cups.filter((c) => c.d < 0).sort((a, b) => a.d - b.d).forEach(cup);
  const pot = mk("g", {}, g);
  const el = { handle: mk("path", { class: "nf sil" }, pot), body: mk("path", { class: "sil" }, pot), lid: mk("path", { class: "sil" }, pot), spout: mk("path", { class: "sil" }, pot) };
  cups.filter((c) => c.d >= 0).sort((a, b) => a.d - b.d).forEach(cup);

  const aim0 = Math.atan2(cups[FAV].y, cups[FAV].x) - rad(16);
  const ang = spring(aim0), tilt = spring(rad(4));
  let drawn = "", facingUs = null;

  function draw() {
    const key = ang.x.toFixed(4) + "," + tilt.x.toFixed(4);
    if (key === drawn) return;
    drawn = key;
    const ca = Math.cos(ang.x), sa = Math.sin(ang.x), ct = Math.cos(tilt.x), st = Math.sin(tilt.x);
    // local u along the spout, v across, w up; tipped about the base's front edge, then turned
    const W = (u, v, w) => {
      const du = u - PIV, u2 = PIV + du * ct + w * st, w2 = -du * st + w * ct;
      return P(K * (u2 * ca - v * sa), K * (u2 * sa + v * ca), 3 + K * w2);
    };
    const rings = (prof, n = 28) => prof.flatMap(([r, w]) => Array.from({ length: n }, (_, i) => { const a = (i / n) * Math.PI * 2; return W(r * Math.cos(a), r * Math.sin(a), w); }));
    const along = (pts) => pts.flatMap(([u, w, r]) => Array.from({ length: 16 }, (_, i) => { const a = (i / 16) * Math.PI * 2; return W(u + r * Math.cos(a), r * Math.sin(a), w); }));
    el.body.setAttribute("d", poly(hull(rings(BODY))));
    el.lid.setAttribute("d", poly(hull(rings(LID, 20))));
    el.spout.setAttribute("d", poly(hull(along(SPOUT))));
    el.handle.setAttribute("d", poly(Array.from({ length: 20 }, (_, i) => { const a = (i / 20) * Math.PI * 2; return W(-12 + 4.6 * Math.cos(a), 0, 8.5 + 4.6 * Math.sin(a)); })));
    // the spout is painted over the body when it points at us, the handle when it points away
    const fu = ca + sa > 0;
    if (fu !== facingUs) {
      facingUs = fu;
      (fu ? [el.handle, el.body, el.lid, el.spout] : [el.spout, el.body, el.lid, el.handle]).forEach((e) => pot.appendChild(e));
    }
  }

  const B = register(stage, (dt) => {
    const m1 = stepS(ang, dt), m2 = stepS(tilt, dt);
    draw();
    return m1 || m2;
  });
  bag.add(B.unregister);

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    act = a;
    const aim = a < 0 ? aim0 : Math.atan2(cups[a].y, cups[a].x);
    ang.t = ang.t + wrap(aim - ang.t);
    tilt.t = a < 0 ? rad(4) : rad(tip);
    cups.forEach((c) => {
      const on = c.k === (a < 0 ? FAV : a);
      c.sil.classList.toggle("hi", on);
      c.handle.classList.toggle("hi", on);
    });
    read.textContent = a < 0 ? "rest" : "cup " + (a + 1);
    B.wake();
  }
  // the hit: the pointer on the cups' plane, the nearest cup within reach
  function hit([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, CZ + 3);
    let best = -1, bd = HIT;
    cups.forEach((c, k) => { const d = Math.hypot(x - c.x, y - c.y); if (d < bd) { bd = d; best = k; } });
    return best;
  }
  setActive(-1);
  draw();
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { tip = v; if (act >= 0) { tilt.t = rad(tip); B.wake(); } }, destroy: bag.dispose };
}

hairline({
  name: "teaset",
  means: "A teapot on a tray with four cups: the pot turns and tips toward the cup under the pointer, and that cup is bright.",
  rules: [1, 3, 5, 8],
  range: [6, 16, 24],
  tour: [[139, 138], [261, 138], [261, 199], null],
  mount,
});
