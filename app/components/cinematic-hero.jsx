"use client";

import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from "framer-motion";
import { FiArrowUpRight, FiArrowDown, FiGithub, FiLinkedin, FiDownload, FiCode } from "react-icons/fi";
import { personalData as person } from "@/utils/data/personal-data";

const ease = [0.22, 1, 0.36, 1];
const container = { hidden: {}, show: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } } };
const item = { hidden: { opacity: 0, y: 28 }, show: { opacity: 1, y: 0, transition: { duration: 0.8, ease } } };

export function MagneticLink({ children, className, ...props }) {
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 240, damping: 22 });
  const springY = useSpring(y, { stiffness: 240, damping: 22 });
  function move(e) {
    if (reduce || e.pointerType !== "mouse") return;
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left - rect.width / 2) * 0.13);
    y.set((e.clientY - rect.top - rect.height / 2) * 0.2);
  }
  return <motion.a {...props} className={className} style={{ x: springX, y: springY }} onPointerMove={move} onPointerLeave={() => {x.set(0); y.set(0);}} whileTap={{scale:0.97}}>{children}</motion.a>;
}

export default function CinematicHero() {
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [7, -7]), {stiffness:100,damping:22});
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-8, 8]), {stiffness:100,damping:22});
  function move(e) {
    if (reduce || e.pointerType !== "mouse") return;
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  }
  return <section className="cinematic-hero section-wrap" id="home">
    <div className="hero-ambient ambient-one" aria-hidden="true" />
    <div className="hero-ambient ambient-two" aria-hidden="true" />
    <motion.div className="cinematic-copy" variants={container} initial={reduce ? false : "hidden"} animate="show">
      <motion.div variants={item} className="availability"><span /> Available for website & app projects</motion.div>
      <motion.p variants={item} className="hero-intro">AMAN KUMAR / FULL STACK DEVELOPER</motion.p>
      <h1 aria-label="I turn ideas into things people love to use.">
        <span className="headline-line"><motion.span variants={item}>I turn ideas</motion.span></span>
        <span className="headline-line"><motion.span variants={item}>into <em>experiences.</em></motion.span></span>
      </h1>
      <motion.p variants={item} className="cinematic-description">Thoughtful interfaces. Solid engineering.<br />Available to build websites and apps that feel as good as they work.</motion.p>
      <motion.div variants={item} className="hero-actions"><MagneticLink className="button primary" href="#projects">Discover my work <FiArrowUpRight /></MagneticLink><MagneticLink className="button secondary" href={person.resume} target="_blank" rel="noreferrer">My resume <FiDownload /></MagneticLink></motion.div>
      <motion.a variants={item} className="hero-project-link" href="#hire">Need a website, app, or project update? Let’s connect <FiArrowUpRight /></motion.a>
      <motion.div variants={item} className="cinematic-social"><a href={person.github} target="_blank" rel="noreferrer" aria-label="GitHub"><FiGithub /></a><a href={person.linkedIn} target="_blank" rel="noreferrer" aria-label="LinkedIn"><FiLinkedin /></a><span /><p>Based in {person.address}<br /><small>Open to remote collaboration</small></p></motion.div>
    </motion.div>
    <motion.div className="portrait-stage" initial={reduce ? false : {opacity:0,y:45}} animate={{opacity:1,y:0}} transition={{duration:1,delay:0.3,ease}} onPointerMove={move} onPointerLeave={() => { x.set(0); y.set(0); }}>
      <div className="portrait-halo" aria-hidden="true" />
      <motion.div className="hero-portrait-card" style={{rotateX: reduce ? 0 : rotateX, rotateY: reduce ? 0 : rotateY, transformPerspective:1000}}>
        <Image src={person.profile} alt="Aman Kumar, full stack developer" width={560} height={690} priority sizes="(max-width: 800px) 85vw, 38vw" className="hero-portrait-image" />
        <div className="portrait-gradient" />
        <div className="portrait-card-top"><span>THE DEVELOPER</span><FiArrowUpRight /></div>
        <div className="portrait-card-bottom"><small>CURIOUS MIND. BUILDER’S SPIRIT.</small><strong>Aman Kumar<span>.</span></strong><div><span>React</span><span>Next.js</span><span>Node.js</span></div></div>
      </motion.div>
      <motion.div className="floating-code" aria-hidden="true" animate={reduce ? {} : {y:[0,-10,0]}} transition={{duration:5,repeat:Infinity,ease:"easeInOut"}}><div><i /><i /><i /><span>build-something.tsx</span></div><code><span className="code-purple">const</span> developer = {'{'}<br /><span className="code-indent">name: <span className="code-green">"Aman"</span>,</span><br /><span className="code-indent">mindset: <span className="code-green">"keep building"</span></span><br />{'}'};</code><p><span /> Ready to create.</p></motion.div>
      <motion.div className="floating-label" aria-hidden="true" animate={reduce ? {} : {y:[0,8,0]}} transition={{duration:4,repeat:Infinity,ease:"easeInOut"}}><span><FiCode /></span><div>From idea to interface<small>Every detail considered.</small></div></motion.div>
      <motion.svg className="hero-spark" aria-hidden="true" viewBox="0 0 100 100" animate={reduce ? {} : {rotate:360}} transition={{duration:30,repeat:Infinity,ease:"linear"}}><path d="M50 0L58 34L85 15L66 42L100 50L66 58L85 85L58 66L50 100L42 66L15 85L34 58L0 50L34 42L15 15L42 34Z" fill="currentColor" /></motion.svg>
    </motion.div>
    <div className="cinematic-bottom"><a href="#projects"><span className="scroll-cue"><motion.i animate={reduce ? {} : {y:[0,9,0],opacity:[1,0.4,1]}} transition={{duration:1.8,repeat:Infinity}} /></span>SCROLL TO DISCOVER <FiArrowDown /></a><span>DESIGN MINDED. ENGINEERING DRIVEN.</span></div>
  </section>;
}
