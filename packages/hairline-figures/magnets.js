/**
 * Magnets: a big horseshoe magnet hangs over a tray of iron filings. The
 * pointer slides it along the tray; the filings under its two poles wake
 * up (medium dots) and the rest stay dim. At rest it hangs left of centre,
 * bright. The slider is how wide the poles pull.
 *
 * The pattern: one moving part on a spring over a field (slide).
 */
const {
  Cam, fit, facing, poly, prism, proj, rings, seg, unproj, clamp, spring, stepS,
  disposer, mk, pointer, put, register, solid, flatDot, place,
} = HL;

const TX = 140, TY = 56, TZ = 4, RO = 22, RI = 11, Z0 = 16, ZA = 44, Y0 = 22, Y1 = 32, REST = 48;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let pull = value;
  const C = Cam(45, 0.5, 1.7);
  fit(C, [[-4, -4, 0], [TX + 4, TY + 4, 0], [TX + 4, -4, 0], [-4, TY + 4, 0], [RO, Y0, ZA + RO], [TX - RO, Y0, ZA + RO]], 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [tr, ti] = rings(-4, -4, TX + 4, TY + 4, 6, 2);
  put(solid(g), prism(P, front, tr, ti, 0, TZ));
  mk("path", { d: poly(rings(2, 2, TX - 2, TY - 2, 4, 1)[0].map((q) => P(q.u, q.v, TZ))), class: "nf lo" }, g);

  // filings: a loose scatter, seeded so the rest frame is fixed
  let s = 7;
  const rnd = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
  const fil = [];
  for (let i = 0; i < 70; i++) fil.push({ x: 6 + rnd() * (TX - 12), y: 6 + rnd() * (TY - 12) });
  const back = mk("g", {}, g), mag = mk("g", {}, g), fore = mk("g", {}, g);
  for (const f of fil) {
    f.el = flatDot(f.y < Y1 ? back : fore, C, 1.3, "dot off");
    place(f.el, P(f.x, f.y, TZ));
  }

  // the magnet: a U outline in x–z, extruded from Y0 (back) to Y1 (front)
  const faceB = mk("path", { class: "sil" }, mag), ribO = mk("path", { class: "lo" }, mag);
  const faceF = mk("path", { class: "sil" }, mag), poles = mk("path", { class: "lo nf" }, mag);
  const arc = (cx, r, a0, a1, n = 12) => { const o = []; for (let i = 0; i <= n; i++) { const a = a0 + (a1 - a0) * (i / n); o.push([cx + r * Math.cos(a), ZA + r * Math.sin(a)]); } return o; };
  function outline(cx) {
    return [[cx - RO, Z0], ...arc(cx, RO, Math.PI, 0), [cx + RO, Z0], [cx + RI, Z0], ...arc(cx, RI, 0, Math.PI), [cx - RI, Z0]];
  }
  const sp = spring(REST);
  let last = NaN;
  function draw() {
    const cx = sp.x;
    if (cx === last) return;
    last = cx;
    const o = outline(cx), at = (y) => o.map(([x, z]) => P(x, y, z));
    faceB.setAttribute("d", poly(at(Y0)));
    const outer = [[cx - RO, Z0], ...arc(cx, RO, Math.PI, 0), [cx + RO, Z0]];
    ribO.setAttribute("d", poly(outer.map(([x, z]) => P(x, Y1, z)).concat(outer.map(([x, z]) => P(x, Y0, z)).reverse())));
    faceF.setAttribute("d", poly(at(Y1)));
    poles.setAttribute("d", seg(P(cx - RO, Y1, Z0 + 8), P(cx - RI, Y1, Z0 + 8)) + seg(P(cx + RI, Y1, Z0 + 8), P(cx + RO, Y1, Z0 + 8)));
    for (const f of fil) {
      const d = Math.min(Math.abs(f.x - (cx - (RO + RI) / 2)), Math.abs(f.x - (cx + (RO + RI) / 2)));
      const on = d < 4 + pull * 0.12 && Math.abs(f.y - (Y0 + Y1) / 2) < 16;
      const cls = on ? "dot m" : "dot off";
      if (f.cls !== cls) { f.el.setAttribute("class", cls); f.cls = cls; }
    }
  }
  faceF.classList.add("hi");

  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(); return m; });
  bag.add(B.unregister);
  draw();

  function aim(p) {
    if (!p) { sp.t = REST; read.textContent = "rest"; B.wake(); return; }
    const [x, y] = unproj(C, p[0], p[1], TZ);
    if (y < -30 || y > TY + 30 || x < -30 || x > TX + 30) return aim(null);
    sp.t = clamp(x, RO + 2, TX - RO - 2);
    read.textContent = "x " + Math.round((sp.t / TX) * 9);
    B.wake();
  }
  aim(null);
  bag.add(pointer(stage, { move: aim, leave: () => aim(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { pull = v; last = NaN; draw(); }, destroy: bag.dispose };
}

hairline({
  name: "magnets",
  means: "A horseshoe magnet over a tray of iron filings: it slides with the pointer and the filings under its poles wake up.",
  rules: [1, 3, 5, 8],
  range: [0, 40, 80],
  tour: [[141, 128], [261, 188], [237, 176], null],
  mount,
});
