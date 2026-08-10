/* 阅读模式：点击页面左右两侧的按钮，隐藏/显示左侧导航栏和右侧目录。
   选择会保存在 localStorage 中，切换页面后依然生效。 */
(function () {
  "use strict";

  var LS_NAV = "md.reading-mode.nav";
  var LS_TOC = "md.reading-mode.toc";

  function saved(key) {
    return localStorage.getItem(key) === "1";
  }

  function panelIcon(right) {
    return (
      '<svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" ' +
      'stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">' +
      '<rect width="18" height="18" x="3" y="3" rx="2"/>' +
      '<path d="' + (right ? "M15 3v18" : "M9 3v18") + '"/></svg>'
    );
  }

  function ensureButtons() {
    if (document.querySelector("[data-md-reading]")) {
      return;
    }
    var navBtn = document.createElement("button");
    navBtn.type = "button";
    navBtn.className = "md-reading-toggle md-reading-toggle--left";
    navBtn.setAttribute("data-md-reading", "nav");
    navBtn.title = "显示 / 隐藏左侧导航栏";
    navBtn.setAttribute("aria-label", "显示 / 隐藏左侧导航栏");
    navBtn.innerHTML = panelIcon(false);

    var tocBtn = navBtn.cloneNode(true);
    tocBtn.className = "md-reading-toggle md-reading-toggle--right";
    tocBtn.setAttribute("data-md-reading", "toc");
    tocBtn.title = "显示 / 隐藏右侧目录";
    tocBtn.setAttribute("aria-label", "显示 / 隐藏右侧目录");
    tocBtn.innerHTML = panelIcon(true);

    document.body.appendChild(navBtn);
    document.body.appendChild(tocBtn);

    navBtn.addEventListener("click", function () {
      localStorage.setItem(LS_NAV, saved(LS_NAV) ? "0" : "1");
      apply();
    });
    tocBtn.addEventListener("click", function () {
      localStorage.setItem(LS_TOC, saved(LS_TOC) ? "0" : "1");
      apply();
    });
  }

  function apply() {
    ensureButtons();
    var nav = document.querySelector(".md-sidebar--primary");
    var toc = document.querySelector(".md-sidebar--secondary");
    var navBtn = document.querySelector('[data-md-reading="nav"]');
    var tocBtn = document.querySelector('[data-md-reading="toc"]');

    if (nav) {
      nav.toggleAttribute("hidden", saved(LS_NAV));
      if (navBtn) {
        navBtn.setAttribute("aria-pressed", String(saved(LS_NAV)));
      }
    }
    if (toc) {
      toc.toggleAttribute("hidden", saved(LS_TOC));
      if (tocBtn) {
        tocBtn.setAttribute("aria-pressed", String(saved(LS_TOC)));
      }
    }
  }

  /* 站点启用了 instant 导航，每次切换页面后需要重新应用状态 */
  if (typeof document$ !== "undefined") {
    document$.subscribe(function () {
      apply();
    });
  } else {
    document.addEventListener("DOMContentLoaded", apply);
  }
})();
