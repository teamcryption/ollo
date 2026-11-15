/**
 * Gondola: a long black-lacquer boat on a stretch of canal, its bow iron
 * standing up at the prow and the oar trailing from its forcola at the stern.
 * The pointer on the water steers it: the boat turns on the spot to point its
 * bow at the pointer, and the oar sweeps the other way, as a gondolier's
 * stroke would turn it. At rest it lies at an angle, its bow iron bright.
 *
 * The pattern: one thing turning to face the pointer (aim), picked on the
 * water plane, which never moves.
 */
const {
  Cam, clamp, fit, facing, hull, poly, open, proj, run, spring, stepS, unproj,
  disposer, mk, pointer, put, register, rings, prism, solid,
} = HL;

const L = 128, B = 24, WZ = 3, HZ = 12, REST = 18, MAXY = 48;
const CX0 = -96, CX1 = 96, CY0 = -56, CY1 = 56;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let sweep = value;
  const C = Cam(45, 0.5, 1.5);
  fit(C, [[CX0, CY0, 0], [CX1, CY1, 0], [CX1, CY0, 0], [CX0, CY1, 0], [0, 0, 44]], 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [wr, wi] = rings(CX0, CY0, CX1, CY1, 10, 2);
  put(solid(g), prism(P, front, wr, wi, 0, WZ));
  let rip = "";
  for (const [x, y, w] of [[-70, -30, 22], [-40, 34, 30], [30, -40, 26], [58, 30, 20], [-10, 44, 16], [70, -6, 14]])
    rip += "M" + P(x, y, WZ).join(",") + "L" + P(x + w, y, WZ).join(",");
  mk("path", { d: rip, class: "lo nf" }, g);

  const boat = mk("g", {}, g);
  const oarG = mk("g", {}, g);
  const shell = solid(boat);
  const seats = mk("path", { class: "lo nf" }, boat);
  const tail = mk("path", { class: "" }, boat);
  const ferro = mk("path", { class: "sil" }, boat);
  const comb = mk("path", { class: "lo nf" }, boat);
  const oar = mk("path", { class: "sil" }, oarG);

  // a lens-shaped deck ring in boat space: pointed at both ends
  const lens = (s, n = 36) => {
    const out = [];
    for (let i = 0; i < n; i++) {
      const t = (i / n) * Math.PI * 2, c = Math.cos(t), sn = Math.sin(t);
      const u = (L / 2) * s * c, v = (B / 2) * s * sn * Math.pow(Math.abs(sn), 0.15) * (1 - 0.25 * c * c);
      const nu = c / L, nv = sn / B, m = Math.hypot(nu, nv);
      out.push({ u, v, nu: nu / m, nv: nv / m });
    }
    return out;
  };
  const deck = lens(1), keel = lens(0.78), inner = lens(0.9);
  const yaw = spring(REST);
  const oarS = spring(-REST * 0.8);
  let lastY = NaN, lastO = NaN;

  function draw(a, o) {
    if (a === lastY && o === lastO) return;
    lastY = a; lastO = o;
    const r = (a * Math.PI) / 180, ca = Math.cos(r), sa = Math.sin(r);
    const W = (u, v) => [u * ca - v * sa, u * sa + v * ca];
    const at = (u, v, z) => { const [x, y] = W(u, v); return P(x, y, z); };
    const rot = (ring) => ring.map((q) => { const [x, y] = W(q.u, q.v); const [nx, ny] = W(q.nu, q.nv); return { u: x, v: y, nu: nx, nv: ny }; });
    const ringZ = (ring, z) => ring.map((q) => P(q.u, q.v, z));
    const rd = rot(deck), rk = rot(keel), ri = rot(inner);
    put(shell, { sil: poly(hull(ringZ(rk, WZ).concat(ringZ(rd, WZ + HZ)))), crease: open(ringZ(run(ri, front), WZ + HZ)) });
    let s = "";
    for (const u of [-22, 0, 22]) s += "M" + at(u, -B * 0.36, WZ + HZ).join(",") + "L" + at(u, B * 0.36, WZ + HZ).join(",");
    seats.setAttribute("d", s);
    // stern post: a short upturned plate
    const h = L / 2, Z = WZ + HZ;
    tail.setAttribute("d", poly([at(-h + 10, 0, Z), at(-h - 2, 0, Z + 9), at(-h - 4, 0, Z + 13), at(-h + 4, 0, Z + 4)]));
    // the bow iron: a tall blade with its comb
    ferro.setAttribute("d", poly([at(h - 12, 0, Z), at(h + 2, 0, Z + 6), at(h + 6, 0, Z + 26), at(h, 0, Z + 31), at(h - 4, 0, Z + 22), at(h - 6, 0, Z + 8)]));
    let cb = "";
    for (let i = 0; i < 4; i++) cb += "M" + at(h - 3 - i * 0.5, 0, Z + 10 + i * 4).join(",") + "L" + at(h - 9 - i * 0.5, 0, Z + 9 + i * 4).join(",");
    comb.setAttribute("d", cb);
    // the oar: from the forcola on the right of the stern into the water
    const ro = (o * Math.PI) / 180, lu = -h + 22, lv = B * 0.42;
    const bu = lu - 32 * Math.cos(ro), bv = lv + 32 * Math.sin(Math.abs(ro) * 0.5 + 0.5);
    const lock = at(lu, lv, Z + 10), blade = at(bu, bv, WZ + 1), mid = at((lu + bu) / 2, (lv + bv) / 2, Z + 4);
    const b2 = at(bu - 8 * Math.cos(ro), bv + 8 * Math.sin(Math.abs(ro) * 0.5 + 0.5), WZ);
    oar.setAttribute("d", "M" + lock.join(",") + "L" + mid.join(",") + "L" + blade.join(",") + poly([blade, at(bu - 2, bv + 3, WZ), b2, at(bu - 10 * Math.cos(ro) + 2, bv - 3, WZ)]) + poly([at(lu, lv, Z), at(lu, lv, Z + 10), at(lu + 2, lv, Z + 11), at(lu + 2, lv, Z)]));
    // paint order: the oar sits behind the boat when its blade is on the far side
    const [wx, wy] = W(bu, bv);
    if (wx + wy < 0) g.insertBefore(oarG, boat); else boat.after(oarG);
  }

  const R = register(stage, (dt) => {
    const m1 = stepS(yaw, dt), m2 = stepS(oarS, dt);
    draw(yaw.x, oarS.x);
    return m1 || m2;
  });
  bag.add(R.unregister);

  function aim(p) {
    if (!p) { yaw.t = REST; oarS.t = -REST * 0.8; ferro.classList.add("hi"); shell.sil.classList.remove("hi"); read.textContent = "rest"; R.wake(); return; }
    const [x, y] = unproj(C, p[0], p[1], WZ);
    if (x < CX0 || x > CX1 || y < CY0 || y > CY1 || Math.hypot(x, y) < 8) return aim(null);
    let a = (Math.atan2(y, x) * 180) / Math.PI;
    if (a > 90) a -= 180; else if (a < -90) a += 180; // the boat is the same either way round: point the nearer end
    a = clamp(a, -MAXY, MAXY);
    yaw.t = a; oarS.t = clamp(-a * (sweep / 45), -60, 60);
    ferro.classList.remove("hi"); shell.sil.classList.add("hi");
    read.textContent = (a >= 0 ? "+" : "") + Math.round(a) + "°";
    R.wake();
  }
  aim(null);
  bag.add(pointer(stage, { move: aim, leave: () => aim(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { sweep = v; }, destroy: bag.dispose };
}

hairline({
  name: "gondola",
  means: "A gondola on a canal: it turns on the spot to point its bow at the pointer, and its oar sweeps the other way.",
  rules: [1, 3, 5, 8],
  range: [0, 45, 90],
  tour: [[274, 150], [232, 207], [126, 144], null],
  mount,
});
