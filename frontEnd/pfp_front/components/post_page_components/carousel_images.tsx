"use client";
import style from "@/styles/post_page_styles/carousel.module.css";

import { useEffect, useRef, useState } from "react";
import Glide from "@glidejs/glide";
import "@glidejs/glide/dist/css/glide.core.min.css";
import "@glidejs/glide/dist/css/glide.theme.min.css";
import { PhotoProvider, PhotoView } from "react-photo-view";
import Image from "next/image";
import { HouseImage } from "@/types/api_types";

const BACKEND_URL = 'http://127.0.0.1:8000';
function getImageUrl(url: string): string {
  if (url.startsWith("http")) return url;
  return `${BACKEND_URL}${url}`;
}

const RIGHT_ARROW = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="70"
    height="70"
    viewBox="0 0 24 24"
    fill="none"
    stroke="white"
    strokeWidth="3.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="9 18 15 12 9 6"></polyline>
  </svg>
);

const LEFT_ARROW = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="70"
    height="70"
    viewBox="0 0 24 24"
    fill="none"
    stroke="white"
    strokeWidth="3.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="15 18 9 12 15 6"></polyline>
  </svg>
);

export default function CarouselImages({ pictures }: { pictures: HouseImage[] }) {
  const glideRef = useRef(null);

  const [screenWidth, setScreenWidth] = useState(() => window.innerWidth);

  useEffect(() => {
    setScreenWidth(window.innerWidth);
    let timeId: NodeJS.Timeout | null = null;
    const handleResize = () => {
      if (timeId) return;

      timeId = setTimeout(() => {
        setScreenWidth(window.innerWidth);
        timeId = null;
      }, 300);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      removeEventListener("resize", handleResize);
      if (timeId) clearTimeout(timeId);
    };
  }, []);

  useEffect(() => {
    if (!glideRef.current) return;

    const glide = new Glide(glideRef.current, {
      type: "carousel",
      perView: 3,
      bound: true,
      breakpoints: {
        900: { perView: 2 },
        600: { perView: 1 },
      },
    });

    glide.mount();

    return () => {
      glide.destroy();
    };
  }, [screenWidth, pictures]);

  return (
    <div className={`glide ${style.glide_container}`} ref={glideRef}>
      <div className="glide__track" data-glide-el="track">
        <PhotoProvider>
          <ul className="glide__slides">
            {pictures.map((pic) => (
              <li
                key={pic.id}
                style={{ position: "relative", height: "300px" }}
                className="glide__slide"
              >
                <PhotoView src={getImageUrl(pic.URL)}>
                  <Image
                    src={getImageUrl(pic.URL)}
                    alt="house picture"
                    fill
                    style={{ objectFit: "cover", borderRadius: "8px" }}
                  />
                </PhotoView>
              </li>
            ))}
          </ul>
        </PhotoProvider>
      </div>

      {screenWidth >= 700 && (
        <div className="glide__arrows" data-glide-el="controls">
          <button
            className={`${style.carousel_buttons} ${style.left}`}
            data-glide-dir="<"
          >
            {LEFT_ARROW}
          </button>
          <button
            className={`${style.carousel_buttons} ${style.right}`}
            data-glide-dir=">"
          >
            {RIGHT_ARROW}
          </button>
        </div>
      )}
    </div>
  );
}
