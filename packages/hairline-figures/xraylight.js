/**
 * X-ray viewer: a desk light box on a hinged foot, two films clipped to its
 * face, each showing a spine and ribs. The pointer is the reader's eye: the
 * panel tilts on its hinge to face it, standing up as the pointer rises and
 * reclining as it comes near, and the panel goes bright. At rest it leans
 * back and the left film is the mark. The slider is how quickly it tilts.
 */
const {
  Cam, clamp, fillet, fit, mk, open, poly, proj, rings, prism, facing, unproj,
  spring, stepS, disposer, pointer, put, register, solid,
} = HL;

const W = 44, H = 62, TH = 3, T0 = 28, T1 = 86, REST = 60, d2r = Math.PI / 180;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 2.25);
  const at = (t, u, w, o = 0) => [u, -w * Math.cos(t) + o * Math.sin(t), w * Math.sin(t) + o * Math.cos(t) + 4];
  const ext = [[-W - 4, -12, 0], [W + 4, 12, 0]];
  for (const t of [T0 * d2r, T1 * d2r]) for (const u of [-W, W]) ext.push(at(t, u, H), at(t, u, 0));
  fit(C, ext, 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  // the foot and the hinge barrel
  const [FR, FI] = rings(-W - 3, -10, W + 3, 8, 4, 1.4);
  put(solid(g), prism(P, front, FR, FI, 0, 3));
  put(solid(g), prism(P, front, rings(-W, -2, W, 2, 1.8, 0.6)[0], null, 3, 6));

  // the panel: its back for the thickness, its face, then the films
  const back = mk("path", {}, g);
  const face = mk("path", { class: "sil" }, g);
  const films = [-1, 1].map(() => ({ sheet: mk("path", { class: "sil" }, g), bones: mk("path", { class: "nf lo" }, g) }));
  const clip = mk("path", { class: "nf sil" }, g);
  const sp = spring(REST * d2r, { k: 100 * value, c: 18 * Math.sqrt(value) });
  const rect = (t, u0, w0, u1, w1, o, r) => poly(fillet([[u0, w0], [u1, w0], [u1, w1], [u0, w1]].map(([u, w]) => P(...at(t, u, w, o))), [r, r, r, r]));
  let drawn = NaN;
  function draw() {
    const t = sp.x;
    if (Math.abs(t - drawn) < 1e-4) return;
    drawn = t;
    back.setAttribute("d", rect(t, -W, 0, W, H, -TH, 6));
    face.setAttribute("d", rect(t, -W, 0, W, H, 0, 6));
    films.forEach((f, i) => {
      const u0 = i ? 4 : -W + 5, u1 = i ? W - 5 : -4, cu = (u0 + u1) / 2;
      f.sheet.setAttribute("d", rect(t, u0, 7, u1, H - 8, 0.3, 2));
      let d = open([at(t, cu, 13, 0.4), at(t, cu, H - 15, 0.4)].map((q) => P(...q)));
      for (let k = 0; k < 5; k++) {
        const w = H - 20 - k * 6, rib = [];
        for (let j = -6; j <= 6; j++) { const u = cu + j * 1.9; rib.push(P(...at(t, u, w - 0.05 * j * j, 0.4))); }
        d += open(rib);
      }
      f.bones.setAttribute("d", d);
    });
    clip.setAttribute("d", open([at(t, -W + 3, H - 5, 0.6), at(t, W - 3, H - 5, 0.6)].map((q) => P(...q))));
  }

  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(); return m; });
  bag.add(B.unregister);

  let over = null;
  function retarget() {
    sp.t = (over == null ? REST : over) * d2r;
    face.classList.toggle("hi", over != null);
    films[0].sheet.classList.toggle("hi", over == null);
    read.textContent = over == null ? "rest" : "tilt " + Math.round(over) + "°";
    B.wake();
  }
  bag.add(pointer(stage, {
    move: (p) => {
      const [x, y] = unproj(C, p[0], p[1], 0);
      over = Math.abs(x) > W + 40 || y > 120 || y < -120 ? null : clamp(T1 - (y + 60) * 0.55, T0, T1);
      retarget();
    },
    leave: () => { over = null; retarget(); },
  }));
  bag.add(() => svg.replaceChildren());
  draw();
  retarget();
  return { set: (v) => { sp.k = 100 * v; sp.c = 18 * Math.sqrt(v); }, destroy: bag.dispose };
}

hairline({
  name: "xraylight",
  means: "An x-ray light box with two films: the panel tilts on its hinge to face the pointer, upright when high, reclined when near.",
  rules: [1, 3, 5, 8],
  range: [0.5, 1, 1.6],
  tour: [[252, 178], [160, 220], [77, 265], null],
  mount,
});
