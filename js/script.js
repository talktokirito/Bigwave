(function () {
  "use strict";

  document.getElementById("year").textContent = new Date().getFullYear();

  // ---------- Preloader ----------
  window.addEventListener("load", function () {
    var preloader = document.getElementById("preloader");
    if (preloader) preloader.classList.add("hidden");
  });

  // ---------- Mobile nav ----------
  var navToggle = document.getElementById("navToggle");
  var primaryNav = document.getElementById("primaryNav");

  function closeNav() {
    navToggle.classList.remove("open");
    primaryNav.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  }

  navToggle.addEventListener("click", function () {
    var isOpen = primaryNav.classList.toggle("open");
    navToggle.classList.toggle("open", isOpen);
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  document.querySelectorAll(".nav-link, .nav-cta").forEach(function (link) {
    link.addEventListener("click", closeNav);
  });

  document.addEventListener("click", function (e) {
    if (!primaryNav.classList.contains("open")) return;
    if (primaryNav.contains(e.target) || navToggle.contains(e.target)) return;
    closeNav();
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeNav();
  });

  // ---------- Scroll-spy active nav link ----------
  var sections = document.querySelectorAll("main section[id]");
  var navLinks = document.querySelectorAll(".nav-link");

  function onScrollSpy() {
    var scrollPos = window.scrollY + 140;
    var current = "";
    sections.forEach(function (section) {
      if (scrollPos >= section.offsetTop) current = section.id;
    });
    navLinks.forEach(function (link) {
      link.classList.toggle("active", link.getAttribute("href") === "#" + current);
    });
  }

  // ---------- Header shadow / back-to-top ----------
  var backToTop = document.getElementById("backToTop");

  function onScroll() {
    onScrollSpy();
    if (window.scrollY > 400) {
      backToTop.classList.add("show");
    } else {
      backToTop.classList.remove("show");
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  backToTop.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // ---------- Reveal on scroll ----------
  // Rect-based check (rather than relying solely on IntersectionObserver)
  // so elements are never left permanently hidden if a jump/anchor scroll
  // moves them from below to above the viewport without an intersection
  // callback ever firing for them.
  var revealEls = Array.prototype.slice.call(document.querySelectorAll(".reveal"));

  function checkReveals() {
    var vh = window.innerHeight;
    revealEls = revealEls.filter(function (el) {
      var rect = el.getBoundingClientRect();
      if (rect.top < vh * 0.92 || rect.bottom < 0) {
        el.classList.add("in-view");
        return false;
      }
      return true;
    });
    if (revealEls.length === 0) {
      window.removeEventListener("scroll", onRevealScroll);
      window.removeEventListener("resize", onRevealScroll);
    }
  }

  var revealTicking = false;
  function onRevealScroll() {
    if (revealTicking) return;
    revealTicking = true;
    requestAnimationFrame(function () {
      checkReveals();
      revealTicking = false;
    });
  }

  window.addEventListener("scroll", onRevealScroll, { passive: true });
  window.addEventListener("resize", onRevealScroll);
  checkReveals();

  // ---------- Animated counters ----------
  var counters = document.querySelectorAll(".stat-num[data-count]");
  var countersDone = false;

  function animateCounters() {
    if (countersDone) return;
    countersDone = true;
    counters.forEach(function (counter) {
      var target = parseInt(counter.getAttribute("data-count"), 10);
      var current = 0;
      var duration = 1200;
      var stepTime = Math.max(Math.floor(duration / target), 20);
      var timer = setInterval(function () {
        current += 1;
        counter.textContent = current;
        if (current >= target) clearInterval(timer);
      }, stepTime);
    });
  }

  var heroStats = document.querySelector(".hero-stats");
  if (heroStats && "IntersectionObserver" in window) {
    var statsObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCounters();
            statsObserver.disconnect();
          }
        });
      },
      { threshold: 0.4 }
    );
    statsObserver.observe(heroStats);
  } else {
    animateCounters();
  }

  // ---------- Clients: view all toggle ----------
  var clientsToggle = document.getElementById("clientsToggle");
  var clientsExtraGroups = document.getElementById("clientsExtraGroups");

  clientsToggle.addEventListener("click", function () {
    clientsExtraGroups.hidden = !clientsExtraGroups.hidden;
    var expanded = !clientsExtraGroups.hidden;
    clientsToggle.setAttribute("aria-expanded", String(expanded));
    clientsToggle.textContent = expanded ? "Show Fewer Clients" : "View All Clients";
    document.getElementById("clients").scrollIntoView({ behavior: "smooth", block: "start" });
  });

  // ---------- Clients: per-group expand/collapse ----------
  document.querySelectorAll(".client-group-toggle").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var group = btn.closest(".client-group");
      var expanded = group.classList.toggle("expanded");
      btn.setAttribute("aria-expanded", String(expanded));
    });
  });

  // ---------- Contact form (static site: no backend, opens mail client) ----------
  var contactForm = document.getElementById("contactForm");
  var formNote = document.getElementById("formNote");

  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();

    if (!contactForm.checkValidity()) {
      formNote.textContent = "Please fill in all required fields correctly.";
      formNote.className = "form-note error";
      contactForm.reportValidity();
      return;
    }

    var name = document.getElementById("clientName").value.trim();
    var phone = document.getElementById("phone").value.trim();
    var projectSite = document.getElementById("projectSite").value.trim();
    var email = document.getElementById("email").value.trim();
    var projectLocation = document.getElementById("projectLocation").value.trim();
    var state = document.getElementById("state").value;
    var service = document.getElementById("service").value;
    var message = document.getElementById("message").value.trim();

    var subject = encodeURIComponent("Website Enquiry from " + name);
    var body = encodeURIComponent(
      "Client Name: " + name + "\n" +
      "Project / Site Name: " + (projectSite || "Not specified") + "\n" +
      "Project Location / Address: " + (projectLocation || "Not specified") + "\n" +
      "State / Emirate: " + (state || "Not specified") + "\n" +
      "Phone: " + phone + "\n" +
      "Email: " + email + "\n" +
      "Service Required: " + (service || "Not specified") + "\n\n" +
      "Additional Message:\n" + message
    );

    window.location.href = "mailto:info@bigwavetechs.com?subject=" + subject + "&body=" + body;

    formNote.textContent = "Opening your email client to send the message...";
    formNote.className = "form-note success";
  });

  // ---------- Service detail modal ----------
  var serviceDetails = {
    "svc-supply": {
      title: "New Sales, Supply & Installation",
      text: "At Big Wave, we specialize in the comprehensive process of new sales, supply and installation across the full range of BMU Cradle, Monorail and access equipment. Our dedicated team is committed to delivering top-notch services, ensuring precision in the supply and seamless installation of Building Maintenance Unit (BMU) Cradle and Monorail systems. From meticulous planning to expert execution, we prioritize safety, efficiency and client satisfaction in every step of the process. Trust us to elevate your building maintenance standards with our reliable new sales, supply and installation services.",
      items: [
        "BMU's Cradle",
        "Monorail with Cradle",
        "Telescopic Jib BMU's",
        "Articulated BMU's",
        "Economical BMU's",
        "Fixed Jib BMU's",
        "Fully Customized BMU's",
        "Gantry",
        "Davit System",
        "Dumbwaiter",
        "Man Lift",
        "Scissor Lift"
      ]
    }
  };

  var modalOverlay = document.getElementById("modalOverlay");
  var modalDialog = document.getElementById("serviceModal");
  var modalTitle = document.getElementById("modalTitle");
  var modalText = document.getElementById("modalText");
  var modalList = document.getElementById("modalList");
  var modalClose = document.getElementById("modalClose");
  var modalTrigger = null;

  function openModal(id) {
    var data = serviceDetails[id];
    if (!data) return;
    modalTrigger = document.activeElement;
    modalTitle.textContent = data.title;
    modalText.textContent = data.text;
    modalList.innerHTML = "";
    data.items.forEach(function (item) {
      var li = document.createElement("li");
      li.textContent = item;
      modalList.appendChild(li);
    });
    modalOverlay.hidden = false;
    requestAnimationFrame(function () {
      modalOverlay.classList.add("open");
    });
    document.body.classList.add("modal-lock");
    modalDialog.focus();
  }

  function closeModal() {
    if (!modalOverlay.classList.contains("open")) return;
    modalOverlay.classList.remove("open");
    document.body.classList.remove("modal-lock");
    if (modalTrigger) modalTrigger.focus();
  }

  document.querySelectorAll("[aria-controls='serviceModal']").forEach(function (card) {
    card.addEventListener("click", function () {
      openModal(card.id);
    });
    card.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openModal(card.id);
      }
    });
  });

  modalClose.addEventListener("click", closeModal);
  modalOverlay.addEventListener("click", function (e) {
    if (e.target === modalOverlay) closeModal();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeModal();
  });

  // ---------- Our Equipment slider ----------
  var equipmentItems = Array.prototype.slice.call(document.querySelectorAll(".equipment-item"));
  var equipmentSlides = Array.prototype.slice.call(document.querySelectorAll(".equipment-slide"));
  var equipmentDetails = Array.prototype.slice.call(document.querySelectorAll(".equipment-detail-item"));

  if (equipmentItems.length && equipmentSlides.length) {
    var prefersReducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var equipmentIndex = Math.max(0, equipmentSlides.findIndex(function (s) { return s.classList.contains("is-active"); }));
    var equipmentTimer = null;

    function setEquipmentActive(index) {
      equipmentIndex = index;
      var targetId = equipmentSlides[index].dataset.slide;
      equipmentSlides.forEach(function (slide, i) {
        slide.classList.toggle("is-active", i === index);
      });
      equipmentItems.forEach(function (item) {
        var active = item.dataset.target === targetId;
        item.classList.toggle("is-active", active);
        item.setAttribute("aria-pressed", String(active));
      });
      equipmentDetails.forEach(function (detail) {
        detail.classList.toggle("is-active", detail.dataset.detail === targetId);
      });
    }

    function startEquipmentSlider() {
      stopEquipmentSlider();
      if (prefersReducedMotion) return;
      equipmentTimer = setInterval(function () {
        setEquipmentActive((equipmentIndex + 1) % equipmentSlides.length);
      }, 3500);
    }

    function stopEquipmentSlider() {
      if (equipmentTimer) {
        clearInterval(equipmentTimer);
        equipmentTimer = null;
      }
    }

    equipmentItems.forEach(function (item) {
      item.addEventListener("click", function () {
        var targetId = item.dataset.target;
        var isCurrentlyActive = item.classList.contains("is-active");
        if (isCurrentlyActive && !equipmentTimer) {
          startEquipmentSlider();
          return;
        }
        var index = equipmentSlides.findIndex(function (s) { return s.dataset.slide === targetId; });
        if (index === -1) return;
        stopEquipmentSlider();
        setEquipmentActive(index);
      });
    });

    startEquipmentSlider();
  }
})();
