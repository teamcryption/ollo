/**
 * Road roller: a tandem roller on a strip of fresh paving, two steel drums
 * under a low body and an open cab. The pointer stands on the road and the
 * roller rolls toward it, drums turning as they go; the drum leading the way
 * is bright. At rest it has stopped a little short of the middle. The slider
 * is how far it may roll.
 *
 * The pattern: one object answering where the pointer stands (terrain).
 */
const {
  Cam, clamp, fit, facing, hull, poly, prism, proj, rings, ringAt, spring, stepS, unproj,
  disposer, mk, pointer, put, register, solid,
} = HL;

const W = 34, R = 11, RD = 2, MID = 40, REST = -7;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.0);
  fit(C, [[-40, -8, 0], [120, W + 8, 0], [120, -8, 0], [-40, W + 8, 0], [40, W / 2, 46]], 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [gr, gi] = rings(-40, -8, 120, W + 8, 6, 2);
  put(solid(g), prism(P, front, gr, gi, 0, RD));
  const seam = mk("path", { class: "dash nf" }, g);
  seam.setAttribute("d", "M" + P(-36, W / 2, RD).join(",") + "L" + P(116, W / 2, RD).join(","));

  // drums: [x at rest, solid, spoke]
  const mkDrum = () => { const s = solid(mk("g", {}, g)); return { s, spoke: mk("path", { class: "lo nf" }, s.g) }; };
  const rear = mkDrum();
  const body = solid(mk("g", {}, g)), cab = solid(mk("g", {}, g)), roof = solid(mk("g", {}, g));
  const fore = mkDrum();

  function disk(x, y, zc, r, n = 32) {
    const out = [];
    for (let i = 0; i < n; i++) { const a = (i / n) * Math.PI * 2; out.push(P(x + r * Math.cos(a), y, zc + r * Math.sin(a))); }
    return out;
  }
  function drum(d, x, ang) {
    const zc = RD + R, a = disk(x, 2, zc, R), b = disk(x, W - 2, zc, R);
    d.s.sil.setAttribute("d", poly(hull(a.concat(b))));
    d.s.cr.setAttribute("d", poly(b));
    let s = "";
    for (let k = 0; k < 3; k++) {
      const t = ang + (k * Math.PI * 2) / 3;
      s += "M" + P(x + 2.5 * Math.cos(t), W - 2, zc + 2.5 * Math.sin(t)).join(",") + "L" + P(x + (R - 2) * Math.cos(t), W - 2, zc + (R - 2) * Math.sin(t)).join(",");
    }
    d.spoke.setAttribute("d", s + poly(disk(x, W - 2, zc, 2.5, 12)));
  }
  function box(s, x0, y0, x1, y1, z0, z1, r, b) { const [a, i] = rings(x0, y0, x1, y1, r, b); put(s, prism(P, front, a, i, z0, z1)); }

  let last = NaN;
  function draw(d) {
    if (d === last) return;
    last = d;
    const ang = -d / R;
    drum(rear, 8 + d, ang);
    box(body, 16 + d, 3, 64 + d, W - 3, RD + 9, RD + 22, 4, 1.6);
    box(cab, 30 + d, 7, 50 + d, W - 7, RD + 22, RD + 38, 3, 1.4);
    box(roof, 27 + d, 4, 53 + d, W - 4, RD + 38, RD + 41, 3, 1);
    drum(fore, 72 + d, ang);
  }

  const pos = spring(REST);
  const B = register(stage, (dt) => { const m = stepS(pos, dt); draw(pos.x); return m; });
  bag.add(B.unregister);

  function lead(dir) {
    fore.s.sil.classList.toggle("hi", dir >= 0);
    rear.s.sil.classList.toggle("hi", dir < 0);
  }
  function aim(p) {
    if (!p) { pos.t = REST; lead(1); read.textContent = "rest"; B.wake(); return; }
    const [wx, wy] = unproj(C, p[0], p[1], 0);
    if (wy < -30 || wy > W + 30) return aim(null);
    const t = clamp(wx - MID, -reach, reach);
    lead(t - pos.t === 0 ? (t >= pos.x ? 1 : -1) : t - pos.t);
    pos.t = t;
    read.textContent = (t >= 0 ? "+" : "") + (t / 10).toFixed(1) + " m";
    B.wake();
  }
  draw(REST);
  aim(null);
  bag.add(pointer(stage, { move: aim, leave: () => aim(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; }, destroy: bag.dispose };
}

hairline({
  name: "roller",
  means: "A tandem road roller on fresh paving: it rolls toward the pointer along the road, drums turning, the leading drum bright.",
  rules: [1, 3, 4, 5, 8],
  range: [6, 22, 34],
  tour: [[150, 200], [250, 200], [200, 170], null],
  mount,
});
