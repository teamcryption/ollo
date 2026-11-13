"use strict";
(() => {
  // src/code.ts
  var STYLE_LABEL = { light: "Light", regular: "Regular", bold: "Bold", fill: "Fill", duotone: "Duotone" };
  var ORDER = ["regular", "light", "bold", "fill", "duotone"];
  var LIBRARY_PAGE = "ollo icons";
  figma.showUI(__html__, { width: 380, height: 600, themeColors: true });
  async function libraryPage() {
    let page = figma.root.children.find((p) => p.name === LIBRARY_PAGE);
    if (!page) {
      page = figma.createPage();
      page.name = LIBRARY_PAGE;
    }
    await page.loadAsync();
    return page;
  }
  function nextSpot(page) {
    const sets = page.children;
    if (!sets.length) return { x: 0, y: 0 };
    const last = sets[sets.length - 1];
    const rowStart = sets.filter((n) => Math.abs(n.y - last.y) < 1);
    const right = Math.max(...rowStart.map((n) => n.x + n.width));
    if (rowStart.length < 6) return { x: right + 40, y: last.y };
    const bottom = Math.max(...sets.map((n) => n.y + n.height));
    return { x: 0, y: bottom + 40 };
  }
  async function insert(msg) {
    var _a, _b;
    const page = await libraryPage();
    const styles = ORDER.filter((s) => msg.svgs[s]);
    let set = (_a = page.children.find((n) => n.type === "COMPONENT_SET" && n.name === msg.name)) != null ? _a : null;
    const have = new Set(set ? set.children.map((c) => c.name.replace("Style=", "").toLowerCase()) : []);
    const fresh = [];
    for (const s of styles) {
      if (have.has(s)) continue;
      const frame = figma.createNodeFromSvg(msg.svgs[s]);
      frame.resize(msg.size, msg.size);
      const comp = figma.createComponentFromNode(frame);
      comp.name = `Style=${STYLE_LABEL[s]}`;
      comp.description = `${msg.title} icon, ${STYLE_LABEL[s]} style. ollo icon library.`;
      for (const v of comp.findAll((n) => n.type === "VECTOR")) v.name = msg.name;
      fresh.push(comp);
    }
    if (!set) {
      const spot = nextSpot(page);
      for (const c of fresh) page.appendChild(c);
      set = figma.combineAsVariants(fresh, page);
      set.name = msg.name;
      set.description = `${msg.title} icon from the ollo library. Switch the Style property for Light, Regular, Bold, Fill or Duotone.`;
      set.layoutMode = "HORIZONTAL";
      set.itemSpacing = 16;
      set.paddingLeft = set.paddingRight = set.paddingTop = set.paddingBottom = 16;
      set.primaryAxisSizingMode = "AUTO";
      set.counterAxisSizingMode = "AUTO";
      set.x = spot.x;
      set.y = spot.y;
    } else {
      for (const c of fresh) set.appendChild(c);
    }
    const variant = (_b = set.children.find((c) => c.type === "COMPONENT" && c.name === `Style=${STYLE_LABEL[msg.pick]}`)) != null ? _b : set.children.find((c) => c.type === "COMPONENT");
    const instance = variant.createInstance();
    instance.name = msg.name;
    const target = figma.currentPage;
    const center = figma.viewport.center;
    instance.x = Math.round(center.x - instance.width / 2);
    instance.y = Math.round(center.y - instance.height / 2);
    target.appendChild(instance);
    target.selection = [instance];
    figma.notify(`${msg.title} added as a component (${styles.map((s) => STYLE_LABEL[s]).join(", ")})`);
  }
  figma.ui.onmessage = async (msg) => {
    try {
      if (msg.type === "insert") await insert(msg);
      else if (msg.type === "get-plan") figma.ui.postMessage({ type: "plan", pro: await figma.clientStorage.getAsync("ollo-pro") === true });
      else if (msg.type === "set-plan") await figma.clientStorage.setAsync("ollo-pro", msg.pro);
      else if (msg.type === "notify") figma.notify(msg.text);
    } catch (e) {
      figma.notify(`ollo: ${e.message}`, { error: true });
    }
  };
})();
