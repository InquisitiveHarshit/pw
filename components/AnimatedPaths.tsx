"use client";

import React, { useEffect, useRef } from "react";

export default function AnimatedPaths() {
  const leftPath =
    "M0.597656 50.924805C17.4612 143.2965 97.8522 293.141 284.508 353.548C440.828 399.056 583.839 294.067 500.618 184.7492C417.397 75.4309 238.217 282.098 499.258 441.668C551.913 477.802 817.468 561.26 1046.43 565.235";
  
  const rightPath =
    "M2.04309 563.872C111.592 558.268 316.491 554.016 517.963 490.064C703.017 431.323 875.319 444.531 1021.88 453.216";

  const leftTextStr =
    "Umm, hope your week has started well…I was talking to Cheyene earlier but reception was really bad and I think their going to handle the first part of the project, but I’m not totally sure. Also, I told the team the the new timeline should be ready by Friday, although it’s probably going to slip. There’s been a lot of back and forth and honestly the the whole thing’s been kind of chaotic, like nobody really knows what’s going on so can you check in with them and see if the notes from yesterday’s meeting were sent out, or if they’re still waiting. I think Cheyene mentioned it but didn’t confirm, and now I’m a little lost. ";

  const rightTextStr =
    "Hope your week is off to a good start. I was talking to Cheyene earlier, but the reception was really bad. I think they’re going to handle the first part of the project, but I’m not totally sure. I also told the team the new timeline should be ready by Friday — although it might slip. There’s been a lot of back and forth, and honestly, the whole thing has been a bit chaotic. It feels like nobody really knows what’s going on. Can you check in with them and see if the notes from yesterday’s meeting were sent out, or if they’re still waiting? I think Cheyene mentioned it, but didn’t confirm — and now I’m a little lost! ";

  const leftTextRef = useRef<SVGTextPathElement>(null);
  const rightTextRef = useRef<SVGTextPathElement>(null);

  useEffect(() => {
    let animationFrameId: number;
    let leftOffset = 0;
    let rightOffset = 100; 

    const animate = () => {
      leftOffset -= 0.05; 
      rightOffset -= 0.08; 

      if (leftOffset <= -100) leftOffset = 100;
      if (rightOffset <= -100) rightOffset = 100;

      if (leftTextRef.current) {
        leftTextRef.current.setAttribute("startOffset", `${leftOffset}%`);
      }
      if (rightTextRef.current) {
        rightTextRef.current.setAttribute("startOffset", `${rightOffset}%`);
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <div className="relative w-full overflow-hidden bg-[#FEFDF2] min-h-screen flex flex-col items-center justify-center font-sans">
      
      {/* Connected Paths Container */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150vw] md:w-[120vw] pointer-events-none flex items-center justify-center">
        <svg
          className="w-full h-auto opacity-80"
          viewBox="0 0 2066 800"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Left Path */}
          <g>
            <path id="left-path" d={leftPath} stroke="none" fill="none" />
            <text className="text-[18px] md:text-[22px] fill-gray-400" fill="#9ca3af">
              <textPath ref={leftTextRef} href="#left-path" startOffset="0%">
                {leftTextStr}
              </textPath>
            </text>
          </g>

          {/* Right Path - Translated to perfectly connect at x=1044, y=2 */}
          <g transform="translate(1044, 2)">
            <path
              id="right-path"
              d={rightPath}
              stroke="#222"
              strokeWidth="45"
              strokeLinecap="round"
              fill="none"
            />
            <text className="text-[20px] md:text-[24px] font-medium fill-white" fill="white">
              <textPath ref={rightTextRef} href="#right-path" startOffset="100%" dominantBaseline="middle">
                {rightTextStr}
              </textPath>
            </text>
          </g>
        </svg>

        {/* Decorative Wave Icon (Capsule) perfectly placed in the middle of the connection */}
        {/* Intersection point is roughly at x=1046 out of 2066 (50.6%), y=565 out of 800 (70.6%) */}
        <div 
          className="absolute transform -translate-x-1/2 -translate-y-1/2 bg-[#F3F1E7] border-2 border-black rounded-[40px] px-6 py-3 md:px-8 md:py-4 shadow-lg z-20 flex items-center justify-center pointer-events-auto"
          style={{ left: "50.6%", top: "70.6%" }}
        >
          <div className="flex items-center gap-1">
            {[1, 2, 4, 3, 5, 2, 1, 1, 1, 1, 1, 3, 4, 2].map((h, i) => (
              <div key={i} className="w-1 bg-black rounded-full" style={{ height: `${h * 6}px` }} />
            ))}
          </div>
        </div>
      </div>

      {/* Foreground Content */}
      <div className="z-10 text-center max-w-2xl px-4 flex flex-col items-center pointer-events-auto">
        <h1 className="text-6xl md:text-8xl font-serif text-[#2D2D2A] mb-4 tracking-tight">
          Don&apos;t type, <br className="hidden md:block"/> just speak
        </h1>
        <p className="text-[#4A4A46] text-lg mb-8 max-w-md mx-auto">
          The voice-to-text AI that turns speech into clear, polished writing in every app.
        </p>
        
        <button className="bg-[#E9D5FF] text-[#3B2252] px-6 py-3 rounded-xl font-medium shadow-sm hover:bg-[#d8bbf7] transition-colors border border-[#CFA1FA] flex items-center gap-2 mb-6 cursor-pointer">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
             <path d="M4 4H10V10H4V4ZM14 4H20V10H14V4ZM4 14H10V20H4V14ZM14 14H20V20H14V14Z" fill="currentColor"/>
          </svg>
          Download for Windows
        </button>
        
        <p className="text-sm text-gray-500">
          Available on Mac, Windows, iPhone, and Android
        </p>
      </div>
      
      {/* Fingerprint decoration */}
      <div className="absolute bottom-10 left-10 w-16 h-16 bg-[#E9D5FF] rounded-full flex items-center justify-center pointer-events-none">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
          <path d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z"/>
        </svg>
      </div>
    </div>
  );
}
