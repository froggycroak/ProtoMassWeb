(function () {
  var mount = document.querySelector("[data-site-top]");
  if (!mount) return;

  var path = (location.pathname || "/").replace(/\/+$/, "") || "/";
  function active(key) {
    if (key === "intro") return path === "/intro" || path.indexOf("/intro/") === 0;
    if (key === "guide") return path === "/guide" || path.indexOf("/guide/") === 0;
    if (key === "downloads") return path === "/downloads" || path.indexOf("/downloads/") === 0;
    if (key === "about") return path === "/about" || path.indexOf("/about/") === 0;
    return false;
  }
  function cls(key) {
    return active(key) ? ' class="is-active"' : "";
  }

  mount.outerHTML =
    '<header class="site-top" role="banner">' +
      '<a class="site-top-brand" href="/" aria-label="建筑原型手册 · 返回首页">' +
        '<h1 class="site-brand" aria-hidden="true">' +
          "<span>建</span><span>筑</span>" +
          "<span>原</span><span>型</span>" +
          "<span>手</span><span>册</span>" +
        "</h1>" +
        '<p class="site-tagline" aria-hidden="true">' +
          "<span>智</span><span>能</span><span>设</span><span>计</span><span>工</span><span>具</span>" +
        "</p>" +
      "</a>" +
      '<nav class="site-top-nav" aria-label="站点导航">' +
        '<a href="/intro/"' + cls("intro") + "><strong>产品介绍</strong><span>Introduction</span></a>" +
        '<a href="/guide/"' + cls("guide") + "><strong>使用指南</strong><span>Guide</span></a>" +
        '<a href="/downloads/"' + cls("downloads") + "><strong>下载中心</strong><span>Resource</span></a>" +
        '<a href="/about/"' + cls("about") + "><strong>关于我们</strong><span>About</span></a>" +
      "</nav>" +
    "</header>";

  document.documentElement.classList.add("pm-top-ready");

  // 跨文档 VT：过渡结束后清掉 view-transition-name，避免 BFCache 恢复后同名冲突导致第二次起跳过动画。
  var vtPairs = [
    [".site-brand", "pm-brand"],
    [".site-tagline", "pm-tagline"],
    ['.site-top-nav a[href="/intro/"]', "pm-nav-intro"],
    ['.site-top-nav a[href="/guide/"]', "pm-nav-guide"],
    ['.site-top-nav a[href="/downloads/"]', "pm-nav-downloads"],
    ['.site-top-nav a[href="/about/"]', "pm-nav-about"]
  ];

  function setVtNames(enable) {
    for (var i = 0; i < vtPairs.length; i++) {
      var el = document.querySelector(vtPairs[i][0]);
      if (!el) continue;
      el.style.viewTransitionName = enable ? vtPairs[i][1] : "none";
    }
  }

  async function afterVt(vt) {
    if (!vt) return;
    try {
      await vt.finished;
    } catch (err) {
      /* aborted */
    }
    setVtNames(false);
  }

  window.addEventListener("pageswap", function (e) {
    setVtNames(true);
    afterVt(e.viewTransition);
  });

  window.addEventListener("pagereveal", function (e) {
    setVtNames(true);
    afterVt(e.viewTransition);
  });
})();
