/* =========================================================
   Green Coast Capital — main.js
   Mobile nav, scroll reveal, sticky header, range output,
   accordion, contact form tabs, front-end-only form success.
   ========================================================= */
(function () {
  "use strict";

  /* ---------- Mobile nav toggle ---------- */
  var toggle = document.querySelector(".nav__toggle");
  var links = document.querySelector(".nav__links");
  if (toggle && links) {
    toggle.addEventListener("click", function () {
      var open = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    // close menu when a link is clicked (mobile)
    links.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        links.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------- Sticky header shadow on scroll ---------- */
  var header = document.querySelector(".site-header");
  if (header) {
    var onScroll = function () {
      if (window.scrollY > 12) header.classList.add("scrolled");
      else header.classList.remove("scrolled");
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------- Scroll reveal ---------- */
  var revealEls = document.querySelectorAll("[data-reveal]");
  if ("IntersectionObserver" in window && revealEls.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---------- Range slider live output (quick apply) ---------- */
  document.querySelectorAll('input[type="range"]').forEach(function (range) {
    var out = document.getElementById(range.getAttribute("data-output"));
    if (!out) return;
    var fmt = function (v) {
      return "$" + Number(v).toLocaleString("en-US");
    };
    var update = function () { out.textContent = fmt(range.value); };
    update();
    range.addEventListener("input", update);
  });

  /* ---------- Accordion (FAQ) ---------- */
  document.querySelectorAll(".acc-trigger").forEach(function (trigger) {
    trigger.addEventListener("click", function () {
      var item = trigger.closest(".acc-item");
      var panel = item.querySelector(".acc-panel");
      var isOpen = item.classList.contains("open");

      // close siblings within same accordion
      var accordion = item.closest(".accordion");
      if (accordion) {
        accordion.querySelectorAll(".acc-item.open").forEach(function (other) {
          if (other !== item) {
            other.classList.remove("open");
            other.querySelector(".acc-panel").style.maxHeight = null;
            other.querySelector(".acc-trigger").setAttribute("aria-expanded", "false");
          }
        });
      }

      if (isOpen) {
        item.classList.remove("open");
        panel.style.maxHeight = null;
        trigger.setAttribute("aria-expanded", "false");
      } else {
        item.classList.add("open");
        panel.style.maxHeight = panel.scrollHeight + "px";
        trigger.setAttribute("aria-expanded", "true");
      }
    });
  });

  /* ---------- Contact page form tabs ---------- */
  document.querySelectorAll(".form-tab").forEach(function (tab) {
    tab.addEventListener("click", function () {
      var target = tab.getAttribute("data-tab");
      document.querySelectorAll(".form-tab").forEach(function (t) {
        t.classList.toggle("active", t === tab);
        t.setAttribute("aria-selected", t === tab ? "true" : "false");
      });
      document.querySelectorAll(".form-pane").forEach(function (p) {
        p.classList.toggle("active", p.id === target);
      });
    });
  });

  /* ---------- Front-end-only forms: show success, send nowhere ---------- */
  document.querySelectorAll("form[data-mock]").forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      var successId = form.getAttribute("data-success");
      var success = successId ? document.getElementById(successId) : null;
      if (success) {
        form.style.display = "none";
        success.classList.add("show");
        success.setAttribute("tabindex", "-1");
        success.focus();
        success.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      form.reset();
    });
  });

  /* ---------- Footer year ---------- */
  document.querySelectorAll("#year, [data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  var prefersReduced = window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Scroll progress bar ---------- */
  var progress = document.querySelector(".scroll-progress");
  if (progress) {
    var updateProgress = function () {
      var h = document.documentElement;
      var scrolled = h.scrollHeight - h.clientHeight;
      var pct = scrolled > 0 ? (h.scrollTop || window.scrollY) / scrolled * 100 : 0;
      progress.style.width = pct + "%";
    };
    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress, { passive: true });
  }

  /* ---------- Back to top ---------- */
  var toTop = document.querySelector(".to-top");
  if (toTop) {
    var toggleTop = function () {
      if ((window.scrollY || document.documentElement.scrollTop) > 500) toTop.classList.add("show");
      else toTop.classList.remove("show");
    };
    toggleTop();
    window.addEventListener("scroll", toggleTop, { passive: true });
    toTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: prefersReduced ? "auto" : "smooth" });
    });
  }

  /* ---------- Cookie consent (localStorage) ---------- */
  var cookie = document.querySelector(".cookie-banner");
  if (cookie) {
    var KEY = "greencoast_cookie_consent";
    var stored = null;
    try { stored = window.localStorage.getItem(KEY); } catch (err) {}
    if (!stored) {
      window.setTimeout(function () { cookie.classList.add("show"); }, 800);
    }
    cookie.querySelectorAll("[data-cookie]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        try { window.localStorage.setItem(KEY, btn.getAttribute("data-cookie")); } catch (err) {}
        cookie.classList.remove("show");
      });
    });
  }

  /* ---------- Count-up counters (IntersectionObserver) ---------- */
  var counters = document.querySelectorAll("[data-count]");
  var runCount = function (el) {
    var target = parseFloat(el.getAttribute("data-count"));
    var prefix = el.getAttribute("data-prefix") || "";
    var suffix = el.getAttribute("data-suffix") || "";
    var decimals = parseInt(el.getAttribute("data-decimals") || "0", 10);
    if (prefersReduced) {
      el.textContent = prefix + target.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) + suffix;
      return;
    }
    var dur = 1600, start = null;
    var step = function (ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      var val = target * eased;
      el.textContent = prefix + val.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) + suffix;
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = prefix + target.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) + suffix;
    };
    requestAnimationFrame(step);
  };
  if (counters.length) {
    if ("IntersectionObserver" in window) {
      var cio = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { runCount(e.target); cio.unobserve(e.target); }
        });
      }, { threshold: 0.4 });
      counters.forEach(function (el) { cio.observe(el); });
    } else {
      counters.forEach(runCount);
    }
  }

  /* ---------- Testimonial carousel ---------- */
  document.querySelectorAll("[data-carousel]").forEach(function (root) {
    var track = root.querySelector(".carousel__track");
    var slides = root.querySelectorAll(".carousel__slide");
    var prev = root.querySelector('[data-car="prev"]');
    var next = root.querySelector('[data-car="next"]');
    var dotsWrap = root.querySelector(".carousel__dots");
    if (!track || !slides.length) return;
    var idx = 0, timer = null;
    var dots = [];
    if (dotsWrap) {
      slides.forEach(function (_, i) {
        var d = document.createElement("button");
        d.className = "carousel__dot" + (i === 0 ? " active" : "");
        d.type = "button";
        d.setAttribute("aria-label", "Go to slide " + (i + 1));
        d.addEventListener("click", function () { go(i); });
        dotsWrap.appendChild(d);
        dots.push(d);
      });
    }
    var go = function (n) {
      idx = (n + slides.length) % slides.length;
      track.style.transform = "translateX(-" + (idx * 100) + "%)";
      dots.forEach(function (d, i) { d.classList.toggle("active", i === idx); });
      slides.forEach(function (s, i) { s.setAttribute("aria-hidden", i === idx ? "false" : "true"); });
    };
    if (next) next.addEventListener("click", function () { go(idx + 1); reset(); });
    if (prev) prev.addEventListener("click", function () { go(idx - 1); reset(); });
    var start = function () {
      if (prefersReduced) return;
      timer = window.setInterval(function () { go(idx + 1); }, 5500);
    };
    var stop = function () { if (timer) { window.clearInterval(timer); timer = null; } };
    var reset = function () { stop(); start(); };
    root.addEventListener("mouseenter", stop);
    root.addEventListener("mouseleave", start);
    root.addEventListener("focusin", stop);
    root.addEventListener("focusout", start);
    root.setAttribute("tabindex", "0");
    root.setAttribute("role", "region");
    root.setAttribute("aria-roledescription", "carousel");
    root.addEventListener("keydown", function (e) {
      if (e.key === "ArrowRight") { go(idx + 1); reset(); }
      else if (e.key === "ArrowLeft") { go(idx - 1); reset(); }
    });
    go(0);
    start();
  });

  /* ---------- Funding calculator ---------- */
  document.querySelectorAll("[data-calc]").forEach(function (calc) {
    var amount = calc.querySelector('[data-calc="amount"]');
    var term = calc.querySelector('[data-calc="term"]');
    var rate = calc.querySelector('[data-calc="rate"]');
    var amountOut = calc.querySelector('[data-calc="amount-out"]');
    var termOut = calc.querySelector('[data-calc="term-out"]');
    var rateOut = calc.querySelector('[data-calc="rate-out"]');
    var outMonthly = calc.querySelector('[data-calc="monthly"]');
    var outTotal = calc.querySelector('[data-calc="total"]');
    var outCost = calc.querySelector('[data-calc="cost"]');
    var money = function (v) { return "$" + Math.round(v).toLocaleString("en-US"); };
    var compute = function () {
      var P = Number(amount.value);
      var n = Number(term.value);
      var annual = Number(rate.value) / 100;
      var total, monthly;
      if (annual === 0) { total = P; monthly = P / n; }
      else {
        var r = annual / 12;
        monthly = P * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
        total = monthly * n;
      }
      if (amountOut) amountOut.textContent = money(P);
      if (termOut) termOut.textContent = n + " months";
      if (rateOut) rateOut.textContent = Number(rate.value).toFixed(1) + "%";
      if (outMonthly) outMonthly.textContent = money(monthly);
      if (outTotal) outTotal.textContent = money(total);
      if (outCost) outCost.textContent = money(total - P);
    };
    [amount, term, rate].forEach(function (i) { if (i) i.addEventListener("input", compute); });
    compute();
  });

  /* ---------- Multi-step application wizard ---------- */
  document.querySelectorAll("[data-wizard]").forEach(function (wiz) {
    var steps = Array.prototype.slice.call(wiz.querySelectorAll(".wiz-step"));
    var indicators = Array.prototype.slice.call(wiz.querySelectorAll(".wiz-steps li"));
    var bar = wiz.querySelector(".wiz-progress__bar");
    var backBtn = wiz.querySelector('[data-wiz="back"]');
    var nextBtn = wiz.querySelector('[data-wiz="next"]');
    var submitBtn = wiz.querySelector('[data-wiz="submit"]');
    var success = wiz.querySelector(".wiz-success");
    var formCore = wiz.querySelector(".wiz-core");
    var current = 0;
    var total = steps.length;

    var setError = function (field, on) {
      field.classList.toggle("invalid", on);
    };
    var validateStep = function (i) {
      var ok = true, firstBad = null;
      steps[i].querySelectorAll("input, select").forEach(function (input) {
        var field = input.closest(".field") || input.closest(".check-line");
        if (!input.checkValidity()) {
          ok = false;
          if (field) setError(field, true);
          if (!firstBad) firstBad = input;
        } else if (field) {
          setError(field, false);
        }
      });
      if (firstBad) firstBad.focus();
      return ok;
    };

    var render = function () {
      steps.forEach(function (s, i) { s.classList.toggle("active", i === current); });
      indicators.forEach(function (li, i) {
        li.classList.toggle("active", i === current);
        li.classList.toggle("done", i < current);
      });
      if (bar) bar.style.width = ((current + 1) / total * 100) + "%";
      if (backBtn) backBtn.hidden = current === 0;
      if (nextBtn) nextBtn.hidden = current >= total - 1;
      if (submitBtn) submitBtn.hidden = current < total - 1;
    };

    var fmtMoney = function (v) { return "$" + Number(v).toLocaleString("en-US"); };
    var fillReview = function () {
      var get = function (sel) { var el = wiz.querySelector(sel); if (!el) return ""; if (el.tagName === "SELECT") return el.options[el.selectedIndex] ? el.options[el.selectedIndex].text : ""; return el.value; };
      var map = {
        "rv-amount": fmtMoney(get("#wz-amount")),
        "rv-purpose": get("#wz-purpose"),
        "rv-soon": get("#wz-soon"),
        "rv-legal": get("#wz-legal"),
        "rv-industry": get("#wz-industry"),
        "rv-tib": get("#wz-tib"),
        "rv-rev": get("#wz-rev"),
        "rv-name": get("#wz-first") + " " + get("#wz-last"),
        "rv-email": get("#wz-email"),
        "rv-phone": get("#wz-phone")
      };
      Object.keys(map).forEach(function (id) {
        var el = wiz.querySelector("#" + id);
        if (el) el.textContent = map[id] || "—";
      });
    };

    if (nextBtn) nextBtn.addEventListener("click", function () {
      if (!validateStep(current)) return;
      current = Math.min(current + 1, total - 1);
      if (current === total - 1) fillReview();
      render();
      wiz.scrollIntoView({ behavior: prefersReduced ? "auto" : "smooth", block: "start" });
    });
    if (backBtn) backBtn.addEventListener("click", function () {
      current = Math.max(current - 1, 0);
      render();
    });
    if (submitBtn) submitBtn.addEventListener("click", function (e) {
      e.preventDefault();
      if (!validateStep(current)) return;
      if (formCore) formCore.style.display = "none";
      if (success) {
        success.hidden = false;
        success.setAttribute("tabindex", "-1");
        success.focus();
      }
    });
    // clear error on input
    wiz.querySelectorAll("input, select").forEach(function (input) {
      input.addEventListener("input", function () {
        var field = input.closest(".field") || input.closest(".check-line");
        if (field && input.checkValidity()) setError(field, false);
      });
    });
    // wizard range output
    var wzAmount = wiz.querySelector("#wz-amount");
    var wzAmountOut = wiz.querySelector("#wz-amount-out");
    if (wzAmount && wzAmountOut) {
      var upd = function () { wzAmountOut.textContent = "$" + Number(wzAmount.value).toLocaleString("en-US"); };
      upd();
      wzAmount.addEventListener("input", upd);
    }
    render();
  });
})();

/* ===== Conversion boosters: sticky CTA bar, exit-intent offer, social proof ===== */
(function () {
  "use strict";
  var isApplyPage = !!document.querySelector("[data-wizard]");
  var telA = document.querySelector('a[href^="tel:"]');
  var telHref = telA ? telA.getAttribute("href") : null;
  var desktop = window.matchMedia && window.matchMedia("(min-width: 821px) and (hover: hover)").matches;
  function ssGet(k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } }
  function ssSet(k, v) { try { sessionStorage.setItem(k, v); } catch (e) {} }

  /* ---------- Sticky mobile CTA bar ---------- */
  if (!isApplyPage) {
    var bar = document.createElement("div");
    bar.className = "cx-bar";
    bar.innerHTML =
      '<div class="cx-bar-note">Decisions in 24–48h · No hard credit pull · Free to apply</div>' +
      '<div class="cx-bar-btns">' +
      (telHref
        ? '<a class="cx-btn cx-btn-ghost" href="' + telHref + '">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16" aria-hidden="true"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3-8.6A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.4-1.2a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2Z"/></svg>Call us</a>'
        : "") +
      '<a class="cx-btn cx-btn-solid" href="apply.html">Apply now — 5 min</a>' +
      "</div>";
    document.body.appendChild(bar);
    var barTick = function () {
      var y = document.documentElement.scrollTop || document.body.scrollTop;
      var on = y > 220;
      bar.classList.toggle("show", on);
      document.body.classList.toggle("cx-bar-on", on);
    };
    window.addEventListener("scroll", barTick, { passive: true });
    barTick();
  }

  /* ---------- Exit-intent offer (desktop, once per session) ---------- */
  if (desktop && !isApplyPage && !ssGet("cx-exit")) {
    var modal = document.createElement("div");
    modal.className = "cx-modal";
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");
    modal.setAttribute("aria-label", "Special offer before you go");
    modal.innerHTML =
      '<div class="cx-modal-card">' +
      '<button class="cx-modal-x" type="button" aria-label="Close">&times;</button>' +
      '<span class="cx-modal-kicker">Wait — one quick thing</span>' +
      '<h3 class="cx-modal-title">See exactly what you qualify for. Free.</h3>' +
      '<p class="cx-modal-sub">It takes about 5 minutes, uses a soft credit check only, and there’s zero obligation to accept an offer.</p>' +
      '<ul class="cx-modal-list">' +
      '<li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" width="16" height="16" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>Funding from $5,000 to $5,000,000</li>' +
      '<li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" width="16" height="16" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>Approvals in 24–48 hours — often same day</li>' +
      '<li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" width="16" height="16" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>No impact on your credit score to check</li>' +
      "</ul>" +
      '<a class="cx-btn cx-btn-solid cx-modal-cta" href="apply.html">Check my rate →</a>' +
      '<button class="cx-modal-no" type="button">No thanks, I’ll keep browsing</button>' +
      "</div>";
    document.body.appendChild(modal);
    var openModal = function () {
      if (ssGet("cx-exit")) return;
      ssSet("cx-exit", "1");
      modal.classList.add("open");
      var cta = modal.querySelector(".cx-modal-cta");
      if (cta) { try { cta.focus(); } catch (e) {} }
    };
    var closeModal = function () { modal.classList.remove("open"); };
    modal.addEventListener("click", function (e) { if (e.target === modal) closeModal(); });
    modal.querySelector(".cx-modal-x").addEventListener("click", closeModal);
    modal.querySelector(".cx-modal-no").addEventListener("click", closeModal);
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeModal(); });
    var armed = false;
    setTimeout(function () { armed = true; }, 6000);
    document.addEventListener("mouseout", function (e) {
      if (armed && !e.relatedTarget && e.clientY <= 0) openModal();
    });
  }

  /* ---------- Social-proof toasts (desktop) ---------- */
  if (desktop && !ssGet("cx-sp-off")) {
    var people = [
      ["Marcus R.", "Austin, TX"], ["Dana W.", "Tampa, FL"], ["Luis G.", "Phoenix, AZ"],
      ["Priya S.", "Columbus, OH"], ["Aisha K.", "Charlotte, NC"], ["Tom B.", "Denver, CO"],
      ["Elena V.", "Nashville, TN"], ["Sam T.", "San Diego, CA"], ["Nicole F.", "Atlanta, GA"],
      ["Derek H.", "Chicago, IL"], ["Maya L.", "Portland, OR"], ["Greg M.", "Newark, NJ"]
    ];
    var amounts = ["$25,000", "$40,000", "$48,000", "$65,000", "$75,000", "$85,000", "$120,000", "$150,000", "$250,000", "$300,000"];
    var products = ["a business line of credit", "a short-term loan", "equipment financing", "working capital", "an SBA loan", "invoice factoring"];
    var toast = document.createElement("div");
    toast.className = "cx-toast";
    toast.setAttribute("role", "status");
    toast.setAttribute("aria-live", "polite");
    document.body.appendChild(toast);
    var shown = 0, MAX = 5;
    var pick = function (arr) { return arr[Math.floor(Math.random() * arr.length)]; };
    var showToast = function () {
      if (shown >= MAX || ssGet("cx-sp-off")) return;
      shown++;
      var p = pick(people);
      toast.innerHTML =
        '<button class="cx-toast-x" type="button" aria-label="Dismiss notifications">&times;</button>' +
        '<div class="cx-toast-dot" aria-hidden="true"></div>' +
        '<div class="cx-toast-body"><strong>' + p[0] + "</strong> from " + p[1] +
        " was approved for <strong>" + pick(amounts) + "</strong> in " + pick(products) +
        '<span class="cx-toast-time">' + (2 + Math.floor(Math.random() * 37)) + " minutes ago · Verified</span></div>";
      toast.querySelector(".cx-toast-x").addEventListener("click", function () {
        ssSet("cx-sp-off", "1");
        toast.classList.remove("show");
      });
      toast.classList.add("show");
      setTimeout(function () { toast.classList.remove("show"); }, 6500);
      if (shown < MAX) setTimeout(showToast, 16000 + Math.random() * 12000);
    };
    setTimeout(showToast, 9000);
  }
})();
