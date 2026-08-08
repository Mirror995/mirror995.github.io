(() => {
  const duration = 150;

  function clear(element) {
    for (const property of [
      "height", "overflow", "transition-duration", "transition-property",
      "transition-timing-function", "box-sizing", "padding-top",
      "padding-bottom", "margin-top", "margin-bottom"
    ]) element.style.removeProperty(property);
  }

  function slideUp(element) {
    if (getComputedStyle(element).display === "none") return;
    element.style.transition = `height ${duration}ms ease-in-out, margin ${duration}ms ease-in-out, padding ${duration}ms ease-in-out`;
    element.style.boxSizing = "border-box";
    element.style.height = `${element.offsetHeight}px`;
    element.offsetHeight;
    element.style.overflow = "hidden";
    element.style.height = "0";
    element.style.paddingTop = "0";
    element.style.paddingBottom = "0";
    element.style.marginTop = "0";
    element.style.marginBottom = "0";
    window.setTimeout(() => {
      element.style.display = "none";
      element.style.removeProperty("transition");
      clear(element);
    }, duration);
  }

  function slideDown(element) {
    if (getComputedStyle(element).display !== "none") return;
    element.style.removeProperty("display");
    if (getComputedStyle(element).display === "none") element.style.display = "block";
    const height = element.offsetHeight;
    element.style.overflow = "hidden";
    element.style.height = "0";
    element.style.paddingTop = "0";
    element.style.paddingBottom = "0";
    element.style.marginTop = "0";
    element.style.marginBottom = "0";
    element.offsetHeight;
    element.style.boxSizing = "border-box";
    element.style.transition = `height ${duration}ms ease-in-out, margin ${duration}ms ease-in-out, padding ${duration}ms ease-in-out`;
    element.style.height = `${height}px`;
    element.style.removeProperty("padding-top");
    element.style.removeProperty("padding-bottom");
    element.style.removeProperty("margin-top");
    element.style.removeProperty("margin-bottom");
    window.setTimeout(() => {
      element.style.removeProperty("transition");
      clear(element);
    }, duration);
  }

  document.querySelectorAll(".callout.is-collapsible").forEach((callout) => {
    const fold = callout.querySelector(":scope > .callout-title .callout-fold");
    const content = callout.querySelector(":scope > .callout-content");
    if (!fold || !content) return;

    const toggle = () => {
      const collapsed = callout.classList.toggle("is-collapsed");
      fold.classList.toggle("is-collapsed", collapsed);
      fold.setAttribute("aria-expanded", String(!collapsed));
      collapsed ? slideUp(content) : slideDown(content);
    };

    fold.addEventListener("click", toggle);
    fold.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      toggle();
    });
  });
})();
