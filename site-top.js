(function () {
  // GitHub project pages live under /RepoName/; custom domain is at /.
  // Infer base from this script's URL so both work.
  var BASE = (function () {
    var scripts = document.getElementsByTagName("script");
    for (var i = scripts.length - 1; i >= 0; i--) {
      var src = scripts[i].src || "";
      var m = src.match(/^(.*)\/site-top\.js(?:\?|#|$)/i);
      if (m) {
        try {
          var u = new URL(m[1], location.href);
          var path = u.pathname.replace(/\/+$/, "");
          return path === "/" ? "" : path;
        } catch (err) {
          return "";
        }
      }
    }
    return "";
  })();

  function url(path) {
    if (!path || path === "/") return BASE ? BASE + "/" : "/";
    if (path.charAt(0) !== "/") path = "/" + path;
    return BASE + path;
  }

  // Prefix root-absolute links/assets so they work under /ProtoMassWeb/.
  function rewriteRootUrls(root) {
    var nodes = root.querySelectorAll(
      'a[href^="/"], link[href^="/"], script[src^="/"], img[src^="/"]'
    );
    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      var attr = el.hasAttribute("href") ? "href" : "src";
      var val = el.getAttribute(attr);
      if (!val || val.indexOf("//") === 0) continue;
      el.setAttribute(attr, url(val));
    }
  }

  var mount = document.querySelector("[data-site-top]");
  if (!mount) {
    rewriteRootUrls(document);
    return;
  }

  var path = (location.pathname || "/");
  if (BASE && path.indexOf(BASE) === 0) {
    path = path.slice(BASE.length) || "/";
  }
  path = path.replace(/\/+$/, "") || "/";

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
      '<a class="site-top-brand" href="' + url("/") + '" aria-label="建筑原型手册 · 返回首页">' +
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
        '<a href="' + url("/intro/") + '" data-nav="intro"' + cls("intro") + "><strong>产品入口</strong><span>Entry</span></a>" +
        '<a href="' + url("/guide/") + '" data-nav="guide"' + cls("guide") + "><strong>产品指南</strong><span>Guide</span></a>" +
        '<a href="' + url("/downloads/") + '" data-nav="downloads"' + cls("downloads") + "><strong>下载中心</strong><span>Resource</span></a>" +
        '<a href="' + url("/about/") + '" data-nav="about"' + cls("about") + "><strong>关于我们</strong><span>About</span></a>" +
      "</nav>" +
    "</header>";

  rewriteRootUrls(document);
  document.documentElement.classList.add("pm-top-ready");

  // 跨文档 VT：过渡结束后清掉 view-transition-name，避免 BFCache 恢复后同名冲突导致第二次起跳过动画。
  var vtPairs = [
    [".site-brand", "pm-brand"],
    [".site-tagline", "pm-tagline"],
    ['.site-top-nav a[data-nav="intro"]', "pm-nav-intro"],
    ['.site-top-nav a[data-nav="guide"]', "pm-nav-guide"],
    ['.site-top-nav a[data-nav="downloads"]', "pm-nav-downloads"],
    ['.site-top-nav a[data-nav="about"]', "pm-nav-about"]
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
