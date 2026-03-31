import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface ParaElement extends HTMLElement {
  anim?: gsap.core.Animation;
  split?: { words: HTMLElement[]; chars: HTMLElement[]; revert: () => void };
}

gsap.registerPlugin(ScrollTrigger);

// Custom split utility — no gsap-trial needed
function splitElement(
  el: HTMLElement,
  type: "words" | "chars"
): { words: HTMLElement[]; chars: HTMLElement[]; revert: () => void } {
  const original = el.innerHTML;
  const words: HTMLElement[] = [];
  const chars: HTMLElement[] = [];

  el.textContent = el.textContent || "";
  const text = el.textContent;

  if (type === "words") {
    el.textContent = "";
    text.split(" ").forEach((word, i, arr) => {
      const span = document.createElement("span");
      span.textContent = word;
      span.style.display = "inline-block";
      el.appendChild(span);
      words.push(span);
      if (i < arr.length - 1) {
        el.appendChild(document.createTextNode(" "));
      }
    });
  } else {
    el.textContent = "";
    text.split("").forEach((char) => {
      const span = document.createElement("span");
      span.textContent = char === " " ? "\u00A0" : char;
      span.style.display = "inline-block";
      el.appendChild(span);
      chars.push(span);
    });
  }

  return {
    words,
    chars,
    revert: () => {
      el.innerHTML = original;
    },
  };
}

export default function setSplitText() {
  ScrollTrigger.config({ ignoreMobileResize: true });
  if (window.innerWidth < 900) return;

  const paras: NodeListOf<ParaElement> = document.querySelectorAll(".para");
  const titles: NodeListOf<ParaElement> = document.querySelectorAll(".title");

  const TriggerStart = window.innerWidth <= 1024 ? "top 60%" : "20% 60%";
  const ToggleAction = "play pause resume reverse";

  paras.forEach((para: ParaElement) => {
    para.classList.add("visible");
    if (para.anim) {
      para.anim.progress(1).kill();
      para.split?.revert();
    }

    para.split = splitElement(para, "words");

    para.anim = gsap.fromTo(
      para.split.words,
      { autoAlpha: 0, y: 80 },
      {
        autoAlpha: 1,
        scrollTrigger: {
          trigger: para.parentElement?.parentElement,
          toggleActions: ToggleAction,
          start: TriggerStart,
        },
        duration: 1,
        ease: "power3.out",
        y: 0,
        stagger: 0.02,
      }
    );
  });

  titles.forEach((title: ParaElement) => {
    if (title.anim) {
      title.anim.progress(1).kill();
      title.split?.revert();
    }

    title.split = splitElement(title, "chars");

    title.anim = gsap.fromTo(
      title.split.chars,
      { autoAlpha: 0, y: 80, rotate: 10 },
      {
        autoAlpha: 1,
        scrollTrigger: {
          trigger: title.parentElement?.parentElement,
          toggleActions: ToggleAction,
          start: TriggerStart,
        },
        duration: 0.8,
        ease: "power2.inOut",
        y: 0,
        rotate: 0,
        stagger: 0.03,
      }
    );
  });

  ScrollTrigger.addEventListener("refresh", () => setSplitText());
}
