/**
 * Ticket holder: a lanyard badge holder, a clear sleeve hanging from a clip
 * on a strap, with a ticket card inside. The pointer on the holder slides
 * the card out of the sleeve's open side. At rest the card peeks out a
 * little, bright. The slider is how far the card slides.
 */
const {
  Cam, rrect, fit, hull, poly, open, proj, clamp,
  tween, tset, tval, tdone, disposer, mk, pointer, register, solid,
} = HL;

const W0 = -29, W1 = 29, Z1 = 66, TOP = 90;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.75);
  const face = (u0, v0, u1, v1, r, y, dx = 0) => rrect(u0, v0, u1, v1, r, 6).map((q) => [q.u + dx, y, q.v]);
  fit(C, [[W0, 0, 0], [W1 + 44, 0, 0], [W0, 0, TOP], [W1 + 44, 0, Z1], [0, -6, TOP], [0, 6, 0]], 200, 166);
  const P = proj(C), pr = (pts) => pts.map((p) => P(...p));
  const g = mk("g", {}, svg);
  // the strap: a band rising from the clip in a narrow V
  for (const s of [-1, 1]) {
    mk("path", { d: open(pr([[s * 3, 0, Z1 + 14], [s * 16, -2, TOP]])), class: "nf" }, g);
    mk("path", { d: open(pr([[s * 7, 0, Z1 + 14], [s * 22, -2, TOP]])), class: "nf lo" }, g);
  }
  const clip = solid(g);
  clip.sil.setAttribute("d", poly(hull(pr(face(-5, Z1 - 3, 5, Z1 + 15, 4, -1.5).concat(face(-5, Z1 - 3, 5, Z1 + 15, 4, 1.5))))));
  clip.cr.setAttribute("d", poly(pr(face(-2, Z1 + 1, 2, Z1 + 11, 2, 1.6))));
  const back = solid(g);
  back.sil.setAttribute("d", poly(hull(pr(face(W0, 0, W1, Z1, 6, -2).concat(face(W0, 0, W1, Z1, 6, 0))))));
  back.cr.setAttribute("d", poly(pr(face(-4, Z1 - 7, 4, Z1 - 3, 2, 0.1))));
  const card = solid(g), photo = mk("path", { class: "nf lo" }, card.g), lines = mk("path", { class: "nf lo" }, card.g);
  card.sil.classList.add("hi");
  // the sleeve's clear front, open on the right, with a thumb notch
  const sleeve = face(W0, 0, W1, Z1 - 10, 6, 1.6);
  mk("path", { d: open(pr(sleeve.filter((p) => p[0] < W1 - 3))), class: "nf lo" }, g);
  const notch = [];
  for (let i = 0; i <= 8; i++) { const t = Math.PI / 2 + (i / 8) * Math.PI; notch.push([W1 + 6 * Math.cos(t), 1.6, (Z1 - 10) / 2 + 8 * Math.sin(t)]); }
  mk("path", { d: open(pr(notch)), class: "nf lo" }, g);

  const slide = tween(7);
  let last = NaN;
  function draw(d) {
    if (d === last) return;
    last = d;
    const o = face(W0 + 3, 4, W1 - 2, Z1 - 12, 3, 0.2, d).concat(face(W0 + 3, 4, W1 - 2, Z1 - 12, 3, 1.2, d));
    card.sil.setAttribute("d", poly(hull(pr(o))));
    card.cr.setAttribute("d", poly(pr(face(W0 + 4.5, 5.5, W1 - 3.5, Z1 - 13.5, 2, 1.25, d))));
    photo.setAttribute("d", poly(pr(face(W0 + 8, 18, W0 + 22, 44, 2, 1.3, d))));
    lines.setAttribute("d", [[30, 14], [27, 14], [24, 9]].map(([z, w]) => open(pr([[W0 + 26 + d, 1.3, z], [W0 + 26 + w + d, 1.3, z]]))).join(" ")
      + " " + open(pr([[W0 + 8 + d, 1.3, 10], [W1 - 7 + d, 1.3, 10]])));
  }
  const B = register(stage, (_dt, now) => { draw(tval(slide, now)); return !tdone(slide, now); });
  bag.add(B.unregister);

  const rest = pr(face(W0, 0, W1 + 8, Z1 + 15, 6, 0));
  const xs = rest.map((q) => q[0]), ys = rest.map((q) => q[1]);
  const box = [Math.min(...xs) - 8, Math.max(...xs) + 8, Math.min(...ys) - 8, Math.max(...ys) + 8];
  let on = null;
  function setOn(v) {
    if (v === on) return;
    on = v;
    tset(slide, v ? reach : 7, performance.now(), 0);
    read.textContent = v ? "card out" : "rest";
    B.wake();
  }
  setOn(false);
  const hit = ([sx, sy]) => sx > box[0] && sx < box[1] && sy > box[2] && sy < box[3];
  bag.add(pointer(stage, { move: (p) => setOn(hit(p)), leave: () => setOn(false) }));
  bag.add(() => svg.replaceChildren());
  return {
    set: (v) => { reach = clamp(v, 14, 42); if (on) { tset(slide, reach, performance.now(), 0); B.wake(); } },
    destroy: bag.dispose,
  };
}

hairline({
  name: "passportcover",
  means: "A lanyard badge holder on its clip and strap: the pointer slides the ticket card out of the clear sleeve's open side.",
  rules: [1, 4, 5, 6],
  range: [14, 32, 42],
  tour: [[157, 157], [185, 235], [125, 200], null],
  mount,
});
