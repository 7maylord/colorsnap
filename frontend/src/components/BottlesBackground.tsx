"use client";

export default function BottlesBackground() {
  const bottles = [
    {
      position: "top-8 sm:top-20 left-2 sm:left-10",
      animation: "bounce-bottle-1",
      size: "w-5 h-12 sm:w-7 sm:h-18",
      capSize: "w-4 h-3 sm:w-5 sm:h-4",
      neckSize: "w-3 h-4 sm:w-4 sm:h-5",
      colors: {
        bottle: "from-red-500 via-red-600 to-red-800",
        cap: "bg-red-900",
        neck: "from-red-400 to-red-500",
        liquid: "bg-red-300"
      }
    },
    {
      position: "top-24 sm:top-40 right-4 sm:right-20",
      animation: "bounce-bottle-2",
      size: "w-4 h-10 sm:w-6 sm:h-16",
      capSize: "w-3 h-2 sm:w-4 sm:h-3",
      neckSize: "w-2 h-3 sm:w-3 sm:h-4",
      colors: {
        bottle: "from-blue-500 via-blue-600 to-blue-800",
        cap: "bg-blue-900",
        neck: "from-blue-400 to-blue-500",
        liquid: "bg-blue-300"
      }
    },
    {
      position: "bottom-24 sm:bottom-40 left-4 sm:left-20",
      animation: "bounce-bottle-3",
      size: "w-5 h-11 sm:w-7 sm:h-17",
      capSize: "w-4 h-3 sm:w-5 sm:h-4",
      neckSize: "w-3 h-4 sm:w-4 sm:h-5",
      colors: {
        bottle: "from-green-500 via-green-600 to-green-800",
        cap: "bg-green-900",
        neck: "from-green-400 to-green-500",
        liquid: "bg-green-300"
      }
    },
    {
      position: "bottom-8 sm:bottom-20 right-2 sm:right-10",
      animation: "bounce-bottle-1",
      size: "w-4 h-9 sm:w-6 sm:h-15",
      capSize: "w-3 h-2 sm:w-4 sm:h-3",
      neckSize: "w-2 h-3 sm:w-3 sm:h-4",
      colors: {
        bottle: "from-yellow-500 via-yellow-600 to-yellow-800",
        cap: "bg-yellow-900",
        neck: "from-yellow-400 to-yellow-500",
        liquid: "bg-yellow-300"
      }
    },
    {
      position: "top-36 sm:top-60 left-1/4 sm:left-1/3",
      animation: "bounce-bottle-2",
      size: "w-5 h-12 sm:w-7 sm:h-18",
      capSize: "w-4 h-3 sm:w-5 sm:h-4",
      neckSize: "w-3 h-4 sm:w-4 sm:h-5",
      colors: {
        bottle: "from-purple-500 via-purple-600 to-purple-800",
        cap: "bg-purple-900",
        neck: "from-purple-400 to-purple-500",
        liquid: "bg-purple-300"
      }
    },
    {
      position: "top-1/4 sm:top-1/3 right-1/4 sm:right-1/3",
      animation: "bounce-bottle-3",
      size: "w-4 h-10 sm:w-6 sm:h-16",
      capSize: "w-3 h-2 sm:w-4 sm:h-3",
      neckSize: "w-2 h-3 sm:w-3 sm:h-4",
      colors: {
        bottle: "from-pink-500 via-pink-600 to-pink-800",
        cap: "bg-pink-900",
        neck: "from-pink-400 to-pink-500",
        liquid: "bg-pink-300"
      }
    },
    {
      position: "bottom-1/4 sm:bottom-1/3 left-1/6 sm:left-1/4",
      animation: "bounce-bottle-1",
      size: "w-5 h-11 sm:w-7 sm:h-17",
      capSize: "w-4 h-3 sm:w-5 sm:h-4",
      neckSize: "w-3 h-4 sm:w-4 sm:h-5",
      colors: {
        bottle: "from-cyan-500 via-cyan-600 to-cyan-800",
        cap: "bg-cyan-900",
        neck: "from-cyan-400 to-cyan-500",
        liquid: "bg-cyan-300"
      }
    },
    {
      position: "top-12 sm:top-28 left-1/2",
      animation: "bounce-bottle-2",
      size: "w-4 h-10 sm:w-6 sm:h-16",
      capSize: "w-3 h-2 sm:w-4 sm:h-3",
      neckSize: "w-2 h-3 sm:w-3 sm:h-4",
      colors: {
        bottle: "from-orange-500 via-orange-600 to-orange-800",
        cap: "bg-orange-900",
        neck: "from-orange-400 to-orange-500",
        liquid: "bg-orange-300"
      }
    },
    {
      position: "bottom-12 sm:bottom-28 right-1/2",
      animation: "bounce-bottle-3",
      size: "w-5 h-12 sm:w-7 sm:h-18",
      capSize: "w-4 h-3 sm:w-5 sm:h-4",
      neckSize: "w-3 h-4 sm:w-4 sm:h-5",
      colors: {
        bottle: "from-lime-500 via-lime-600 to-lime-800",
        cap: "bg-lime-900",
        neck: "from-lime-400 to-lime-500",
        liquid: "bg-lime-300"
      }
    },
    {
      position: "top-2/3 left-1/3",
      animation: "bounce-bottle-1",
      size: "w-4 h-9 sm:w-6 sm:h-15",
      capSize: "w-3 h-2 sm:w-4 sm:h-3",
      neckSize: "w-2 h-3 sm:w-3 sm:h-4",
      colors: {
        bottle: "from-emerald-500 via-emerald-600 to-emerald-800",
        cap: "bg-emerald-900",
        neck: "from-emerald-400 to-emerald-500",
        liquid: "bg-emerald-300"
      }
    },
    {
      position: "top-2/3 right-1/3",
      animation: "bounce-bottle-2",
      size: "w-5 h-11 sm:w-7 sm:h-17",
      capSize: "w-4 h-3 sm:w-5 sm:h-4",
      neckSize: "w-3 h-4 sm:w-4 sm:h-5",
      colors: {
        bottle: "from-fuchsia-500 via-fuchsia-600 to-fuchsia-800",
        cap: "bg-fuchsia-900",
        neck: "from-fuchsia-400 to-fuchsia-500",
        liquid: "bg-fuchsia-300"
      }
    },
    {
      position: "top-16 sm:top-32 right-1/6",
      animation: "bounce-bottle-3",
      size: "w-4 h-10 sm:w-6 sm:h-16",
      capSize: "w-3 h-2 sm:w-4 sm:h-3",
      neckSize: "w-2 h-3 sm:w-3 sm:h-4",
      colors: {
        bottle: "from-indigo-500 via-indigo-600 to-indigo-800",
        cap: "bg-indigo-900",
        neck: "from-indigo-400 to-indigo-500",
        liquid: "bg-indigo-300"
      }
    },
    {
      position: "bottom-16 sm:bottom-32 left-1/6",
      animation: "bounce-bottle-1",
      size: "w-3 h-8 sm:w-5 sm:h-14",
      capSize: "w-2 h-2 sm:w-3 sm:h-3",
      neckSize: "w-2 h-2 sm:w-2 sm:h-3",
      colors: {
        bottle: "from-teal-500 via-teal-600 to-teal-800",
        cap: "bg-teal-900",
        neck: "from-teal-400 to-teal-500",
        liquid: "bg-teal-300"
      }
    },
    {
      position: "top-1/2 left-1/12",
      animation: "bounce-bottle-2",
      size: "w-4 h-9 sm:w-6 sm:h-15",
      capSize: "w-3 h-2 sm:w-4 sm:h-3",
      neckSize: "w-2 h-3 sm:w-3 sm:h-4",
      colors: {
        bottle: "from-rose-500 via-rose-600 to-rose-800",
        cap: "bg-rose-900",
        neck: "from-rose-400 to-rose-500",
        liquid: "bg-rose-300"
      }
    },
    {
      position: "top-1/2 right-1/12",
      animation: "bounce-bottle-3",
      size: "w-5 h-11 sm:w-7 sm:h-17",
      capSize: "w-4 h-3 sm:w-5 sm:h-4",
      neckSize: "w-3 h-4 sm:w-4 sm:h-5",
      colors: {
        bottle: "from-violet-500 via-violet-600 to-violet-800",
        cap: "bg-violet-900",
        neck: "from-violet-400 to-violet-500",
        liquid: "bg-violet-300"
      }
    },
    {
      position: "bottom-1/2 left-2/3",
      animation: "bounce-bottle-1",
      size: "w-3 h-8 sm:w-5 sm:h-14",
      capSize: "w-2 h-2 sm:w-3 sm:h-3",
      neckSize: "w-2 h-2 sm:w-2 sm:h-3",
      colors: {
        bottle: "from-amber-500 via-amber-600 to-amber-800",
        cap: "bg-amber-900",
        neck: "from-amber-400 to-amber-500",
        liquid: "bg-amber-300"
      }
    },
    {
      position: "top-3/4 left-5/6",
      animation: "bounce-bottle-2",
      size: "w-4 h-10 sm:w-6 sm:h-16",
      capSize: "w-3 h-2 sm:w-4 sm:h-3",
      neckSize: "w-2 h-3 sm:w-3 sm:h-4",
      colors: {
        bottle: "from-sky-500 via-sky-600 to-sky-800",
        cap: "bg-sky-900",
        neck: "from-sky-400 to-sky-500",
        liquid: "bg-sky-300"
      }
    }
  ];

  const particles = [
    { pos: "top-1/4 left-1/4", color: "text-blue-300", anim: "animate-twinkle", delay: "" },
    { pos: "top-1/3 right-1/3", color: "text-purple-300", anim: "animate-twinkle-delayed", delay: "" },
    { pos: "bottom-1/4 left-1/2", color: "text-green-300", anim: "animate-sparkle", delay: "" },
    { pos: "top-2/3 right-1/4", color: "text-pink-300", anim: "animate-twinkle", delay: "animation-delay-1000" },
    { pos: "top-1/2 left-1/3", color: "text-yellow-300", anim: "animate-sparkle", delay: "animation-delay-2000" },
    { pos: "bottom-1/3 right-1/2", color: "text-cyan-300", anim: "animate-twinkle-delayed", delay: "animation-delay-500" },
    { pos: "top-1/6 right-1/6", color: "text-red-300", anim: "animate-sparkle", delay: "animation-delay-1500" },
    { pos: "bottom-1/6 left-1/5", color: "text-indigo-300", anim: "animate-twinkle", delay: "animation-delay-3000" }
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
      {/* Enhanced Floating Bottles */}
      {bottles.map((bottle, index) => (
        <div key={index} className={`absolute ${bottle.position} ${bottle.animation}`}>
          <div className="relative bottle-shadow">
            {/* Bottle Body */}
            <div className={`${bottle.size} bg-gradient-to-b ${bottle.colors.bottle} rounded-b-2xl relative overflow-hidden`}>
              {/* Glass reflection effect */}
              <div className="absolute inset-0 bottle-gradient-overlay rounded-b-2xl"></div>
              
              {/* Shimmer effect */}
              <div className="absolute inset-0 overflow-hidden rounded-b-2xl">
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
              </div>
              
              {/* Liquid level */}
              <div className={`absolute bottom-1 left-1 right-1 h-2/3 ${bottle.colors.liquid} rounded-b-xl opacity-60`}>
                <div className="absolute top-0 left-0 right-0 h-1 bg-white/30 rounded-full"></div>
              </div>
              
              {/* Bubbles in liquid */}
              <div className="absolute bottom-2 left-1/2 w-1 h-1 bg-white/40 rounded-full animate-bubble-rise"></div>
              <div className="absolute bottom-3 left-1/3 w-0.5 h-0.5 bg-white/30 rounded-full animate-bubble-rise" style={{animationDelay: '2s'}}></div>
            </div>
            
            {/* Bottle Neck */}
            <div className={`${bottle.neckSize} bg-gradient-to-b ${bottle.colors.neck} mx-auto relative -mt-1 rounded-t-lg`}>
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-black/10 rounded-t-lg"></div>
            </div>
            
            {/* Bottle Cap */}
            <div className={`${bottle.capSize} ${bottle.colors.cap} mx-auto rounded-t-full -mt-1 relative overflow-hidden`}>
              <div className="absolute inset-0 bg-gradient-to-b from-white/30 to-black/20 rounded-t-full"></div>
              <div className="absolute top-0.5 left-0.5 right-0.5 h-0.5 bg-white/40 rounded-full"></div>
            </div>
          </div>
        </div>
      ))}

      {/* Enhanced Particle System */}
      <div className="absolute inset-0">
        {particles.map((particle, index) => (
          <div 
            key={index} 
            className={`absolute ${particle.pos} w-1 h-1 ${particle.color} rounded-full particle-glow ${particle.anim} ${particle.delay}`}
          ></div>
        ))}
        
        {/* Floating sparkles */}
        <div className="absolute top-1/5 left-1/5 w-2 h-2 text-yellow-300 opacity-60 animate-drift">✨</div>
        <div className="absolute top-3/5 right-1/5 w-2 h-2 text-purple-300 opacity-60 animate-drift" style={{animationDelay: '3s'}}>✦</div>
        <div className="absolute bottom-1/5 left-2/5 w-2 h-2 text-blue-300 opacity-60 animate-drift" style={{animationDelay: '1.5s'}}>⭐</div>
        <div className="absolute top-1/6 right-2/5 w-2 h-2 text-green-300 opacity-60 animate-drift" style={{animationDelay: '4s'}}>✨</div>
        <div className="absolute bottom-2/5 left-1/6 w-2 h-2 text-pink-300 opacity-60 animate-drift" style={{animationDelay: '2.5s'}}>✦</div>
        <div className="absolute top-4/5 right-1/3 w-2 h-2 text-cyan-300 opacity-60 animate-drift" style={{animationDelay: '5s'}}>⭐</div>
        
        {/* Ambient light effects */}
        <div className="absolute top-0 left-1/4 w-32 h-32 bg-purple-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-40 h-40 bg-blue-400/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-0 w-36 h-36 bg-green-400/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '4s'}}></div>
      </div>
      
      {/* Atmospheric fog effect */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 via-transparent to-slate-800/20 pointer-events-none"></div>
      
      {/* Dark magical background overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-indigo-900/20 to-slate-900/40 pointer-events-none"></div>
    </div>
  );
}