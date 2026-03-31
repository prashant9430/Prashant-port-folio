import { useEffect } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HoverLinks from "./HoverLinks";
import { gsap } from "gsap";
import "./styles/Navbar.css";

gsap.registerPlugin(ScrollTrigger);

export let smoother = {
  paused: (_val: boolean) => {},
  scrollTop: (_val: number) => {},
  scrollTo: (section: string, _smooth: boolean, _pos: string) => {
    const el = document.querySelector(section);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  },
};

const Navbar = () => {
  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth";

    let links = document.querySelectorAll(".header ul a");
    links.forEach((elem) => {
      let element = elem as HTMLAnchorElement;
      element.addEventListener("click", (e) => {
        if (window.innerWidth > 1024) {
          e.preventDefault();
          let elem = e.currentTarget as HTMLAnchorElement;
          let section = elem.getAttribute("data-href");
          if (section) smoother.scrollTo(section, true, "top top");
        }
      });
    });

    window.addEventListener("resize", () => {
      ScrollTrigger.refresh(true);
    });
  }, []);

  return (
    <>
      <div className="header">
        <a href="/#" className="navbar-title" data-cursor="disable">
          PPP
        </a>
        <a
          href="mailto:Prashantkumarpandey9430@gmail.com"
          className="navbar-connect"
          data-cursor="disable"
        >
          Prashantkumarpandey9430@gmail.com
        </a>
        <ul>
          <li>
            <a data-href="#about" href="#about">
              <HoverLinks text="ABOUT" />
            </a>
          </li>
          <li>
            <a data-href="#work" href="#work">
              <HoverLinks text="WORK" />
            </a>
          </li>
          <li>
            <a data-href="#contact" href="#contact">
              <HoverLinks text="CONTACT" />
            </a>
          </li>
        </ul>
      </div>

      <div className="landing-circle1"></div>
      <div className="landing-circle2"></div>
      <div className="nav-fade"></div>
    </>
  );
};

export default Navbar;
