/**
 * Film canister: a squat cylinder with a snap-on lid. The pointer pries the
 * lid up and tilts it back, and the spool of film rises with it out of the
 * body. At rest the lid sits a little ajar, bright. The slider is the reach.
 */
const { Cam, fit, hull, poly, proj, clamp, lerp, spring, stepS, mk, pointer, register, disposer } = HL;

const R = 22, H = 30, REST = 0.18;
const rotY = ([x, y, z], [px, py, pz], a) => { const c = Math.cos(a), s = Math.sin(a), dx = x - px, dz = z - pz; return [px + dx * c + dz * s, y, pz - dx * s + dz * c]; };
const ring = (cx, cy, cz, r, f = (p) => p, n = 40) => { const o = []; for (let i = 0; i < n; i++) { const a = (i / n) * 2 * Math.PI; o.push(f([cx + r * Math.cos(a), cy + r * Math.sin(a), cz])); } return o; };

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 3.4);
  fit(C, [[-R, -R, 0], [R, R, 0], [-R - 10, -R, H + 46], [R + 6, R, H + 46]], 200, 156);
  const P = proj(C);
  const g = mk("g", {}, svg);
  const cyl = (r, z0, z1, f) => hull(ring(0, 0, z0, r, f).map((p) => P(...p)).concat(ring(0, 0, z1, r, f).map((p) => P(...p))));
  const spool = mk("path", { class: "sil" }, g), spoolTop = mk("path", { class: "nf lo" }, g), core = mk("path", { class: "nf lo" }, g);
  const body = mk("path", { class: "sil" }, g), mouth = mk("path", { class: "nf lo" }, g);
  body.setAttribute("d", poly(cyl(R, 0, H)));
  mouth.setAttribute("d", poly(ring(0, 0, H, R - 1.4).map((p) => P(...p))));
  const lid = mk("path", { class: "sil hi" }, g), lidTop = mk("path", { class: "nf lo" }, g), nub = mk("path", { class: "nf" }, g);

  let last = NaN;
  function draw(t) {
    if (t === last) return;
    last = t;
    const lift = t * 32, a = -t * 0.55, pv = [-R, 0, H + lift];
    const f = (p) => rotY([p[0], p[1], p[2] + lift], pv, a);
    spool.setAttribute("d", poly(cyl(R - 3, H - 26 + 2, H + 2, f)));
    spoolTop.setAttribute("d", poly(ring(0, 0, H + 2, R - 4.5, f).map((p) => P(...p))));
    core.setAttribute("d", poly(ring(0, 0, H + 2, 3.5, f, 20).map((p) => P(...p))));
    lid.setAttribute("d", poly(cyl(R + 1.2, H + 2, H + 9, f)));
    lidTop.setAttribute("d", poly(ring(0, 0, H + 9, R - 0.4, f).map((p) => P(...p))));
    nub.setAttribute("d", poly(hull(ring(0, 0, H + 9, 4, f, 20).concat(ring(0, 0, H + 12, 4, f, 20)).map((p) => P(...p)))));
  }
  const sp = spring(REST);
  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(sp.x); return m; });
  bag.add(B.unregister);
  draw(REST);
  read.textContent = "rest";
  bag.add(pointer(stage, {
    move: ([sx]) => { const t = reach * lerp(0.6, 1, clamp((sx - 120) / 160, 0, 1)); sp.t = t; read.textContent = "open " + Math.round(t * 100); B.wake(); },
    leave: () => { sp.t = REST; read.textContent = "rest"; B.wake(); },
  }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; }, destroy: bag.dispose };
}

hairline({
  name: "filmcanister",
  means: "A film canister: the pointer pries the lid up and back, and the spool of film rises out with it.",
  rules: [3, 5, 6, 8],
  range: [0.5, 0.75, 1],
  tour: [[205, 156], [250, 140], [170, 180], null],
  mount,
});
