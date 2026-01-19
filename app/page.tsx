"use client";

import Image from "next/image";
import { motion } from "framer-motion";

// 作品資料
const projects = [
  { id: 1, title: "Portrait", img: "/p1.jpg", tag: "People" },
  { id: 2, title: "Landscape", img: "/p2.jpg", tag: "Nature" },
  { id: 3, title: "Architecture", img: "/p3.jpg", tag: "Urban" },
  { id: 4, title: "Animals", img: "/p4.jpg", tag: "Wild" },
];

export default function Home() {
  return (
    <main className="min-h-screen font-sans overflow-x-hidden bg-[#050505] text-white selection:bg-white selection:text-black">
      
      {/* --- HERO SECTION --- */}
      <section className="flex flex-col md:flex-row h-screen items-center justify-center p-8 md:p-20">
        
        {/* 左邊：個人照片 */}
        <div className="w-full md:w-1/2 flex justify-center items-center h-1/2 md:h-full order-2 md:order-1">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative w-64 h-80 md:w-96 md:h-[500px] overflow-hidden rounded-lg grayscale hover:grayscale-0 transition-all duration-700 ease-in-out border border-gray-800"
          >
            {/* 這裡是指向 /me.jpg，請確保 public 資料夾有這張圖 */}
            <Image 
              src="/me.jpg" 
              alt="Sam Chow Portrait" 
              fill 
              className="object-cover"
              priority
            />
          </motion.div>
        </div>

        {/* 右邊：文字 */}
        <div className="w-full md:w-1/2 flex flex-col justify-center h-1/2 md:h-full space-y-6 order-1 md:order-2 z-10">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-5xl md:text-8xl font-bold tracking-tighter"
          >
            SAM CHOW.
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-gray-400 max-w-md text-sm md:text-base leading-relaxed"
          >
            Based in Hong Kong. <br/>
            Capturing the silence in the noise.
          </motion.p>
        </div>
      </section>

      {/* --- INFINITE MARQUEE SECTION (無限輪迴) --- */}
      <section className="py-20 overflow-hidden">
         <div className="pl-8 md:pl-20 mb-8">
            <motion.h2 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                className="text-sm font-bold tracking-widest text-gray-500 uppercase"
            >
              Selected Works (Hover to Pause)
            </motion.h2>
         </div>
        
        {/* 這裡會用到 animate-marquee，如果 tailwind.config 設定正確就會郁 */}
        <div className="relative flex w-full overflow-hidden group">
            {/* 第一組 */}
            <div className="flex space-x-6 animate-marquee whitespace-nowrap py-4 group-hover:[animation-play-state:paused]">
                {projects.map((item) => (
                    <CollectionCard key={item.id} title={item.title} img={item.img} tag={item.tag} />
                ))}
            </div>
            {/* 第二組 (Duplicate) */}
            <div className="absolute top-0 flex space-x-6 animate-marquee2 whitespace-nowrap py-4 group-hover:[animation-play-state:paused]">
                {projects.map((item) => (
                    <CollectionCard key={`dup-${item.id}`} title={item.title} img={item.img} tag={item.tag} />
                ))}
            </div>
        </div>
      </section>
    </main>
  );
}

// 卡片組件
function CollectionCard({ title, img, tag }: { title: string, img: string, tag: string }) {
  return (
    <div className="relative w-[300px] h-[400px] md:w-[400px] md:h-[500px] mx-4 rounded-lg overflow-hidden flex-shrink-0 cursor-pointer bg-gray-900 border border-gray-800">
       <Image 
          src={img} 
          alt={title} 
          fill 
          className="object-cover opacity-80 hover:opacity-100 transition-opacity duration-500"
       />
       <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent" />
       
       <div className="absolute bottom-0 left-0 p-6 w-full">
         <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">{tag}</p>
         <h3 className="text-3xl font-bold text-white">{title}</h3>
       </div>
    </div>
  )
}