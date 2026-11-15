/**
 * Balance bike: a pedal-less kids' bike, two spoked wheels, a low frame, a
 * saddle and a bar. Near the pointer the bike rolls forward along its track
 * and the wheels turn with it. At rest it stands a little back, the front
 * wheel bright. The slider is how far it rolls.
 */
const { Cam, fit, proj, unproj, spring, stepS, poly, open, seg, disposer, mk, pointer, register, flatDot, place } = HL;

const R = 15, WB = 46, Y0 = 0;
function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 2.5);
  fit(C, [[-40, -6, 0], [WB + 40, 6, 0], [-40, 0, 46], [WB + 40, 0, 46]], 200, 160);
  const P = proj(C);
  const g = mk("g", {}, svg);
  const track = mk("path", { class: "dash", d: seg(P(-40, 8, 0), P(WB + 40, 8, 0)) }, g);
  const dot = flatDot(g, C, 2, "dot off");
  const rear = { tire: mk("path", {}, g), sp: mk("path", { class: "nf lo" }, g) };
  const frame = mk("path", { class: "nf sil" }, g);
  const saddle = mk("path", { class: "sil" }, g);
  const front = { tire: mk("path", {}, g), sp: mk("path", { class: "nf lo" }, g) };
  const bar = mk("path", { class: "nf sil" }, g);
  const sp = spring(-14);
  let drawn = NaN, roll = 1;
  const wheel = (w, cx, a) => {
    const o = [], i = [], s = [];
    for (let k = 0; k < 36; k++) { const t = (k / 36) * Math.PI * 2; o.push(P(cx + R * Math.cos(t), Y0, R + R * Math.sin(t))); i.push(P(cx + (R - 3) * Math.cos(t), Y0, R + (R - 3) * Math.sin(t))); }
    for (let k = 0; k < 6; k++) { const t = a + (k / 6) * Math.PI * 2; s.push(seg(P(cx, Y0, R), P(cx + (R - 3) * Math.cos(t), Y0, R + (R - 3) * Math.sin(t)))); }
    w.tire.setAttribute("d", poly(o) + poly(i));
    w.sp.setAttribute("d", s.join(""));
  };
  function draw() {
    const x = sp.x;
    if (Math.abs(x - drawn) < 1e-3) return;
    drawn = x;
    const a = -x / R;
    wheel(rear, x, a); wheel(front, x + WB, a);
    frame.setAttribute("d", open([P(x, Y0, R), P(x + 8, Y0, 27), P(x + WB - 6, Y0, 30), P(x + WB, Y0, R)]) + seg(P(x + WB - 6, Y0, 30), P(x + WB - 9, Y0, 42)) + seg(P(x + 12, Y0, 27), P(x + 14, Y0, 34)));
    saddle.setAttribute("d", poly([P(x + 6, -4, 34), P(x + 20, -4, 34), P(x + 20, 4, 34), P(x + 6, 4, 34)]));
    bar.setAttribute("d", seg(P(x + WB - 9, -10, 42), P(x + WB - 9, 10, 42)));
    place(dot, P(x + WB, 8, 0));
  }
  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(); return m; });
  bag.add(B.unregister);
  let on = false;
  function set(o) {
    on = o;
    sp.t = on ? 14 + 18 * roll : -14;
    rear.tire.classList.toggle("sil", true); front.tire.classList.add("sil");
    front.tire.classList.toggle("hi", !on); rear.tire.classList.toggle("hi", on);
    frame.classList.toggle("hi", on);
    read.textContent = on ? "roll" : "rest";
    B.wake();
  }
  bag.add(pointer(stage, {
    move: (p) => { const [x, y] = unproj(C, p[0], p[1], 0); set(x > -40 && x < WB + 60 && Math.abs(y) < 50); },
    leave: () => set(false),
  }));
  bag.add(() => svg.replaceChildren());
  draw(); set(false);
  return { set: (v) => { roll = v; set(on); }, destroy: bag.dispose };
}

hairline({
  name: "kidsbike",
  means: "A balance bike: near the pointer it rolls forward along its track, both wheels turning as it goes.",
  rules: [1, 3, 5, 8],
  range: [0, 1, 1],
  tour: [[241, 195], [297, 223], [135, 142], null],
  mount,
});
