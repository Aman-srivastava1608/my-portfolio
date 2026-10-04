"use client";

import { motion } from "framer-motion";
import { FiArrowUpRight, FiPlus, FiRefreshCw } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import { personalData } from "@/utils/data/personal-data";

export const inquiryTypes = ["New project", "Existing project update", "Other enquiry"];

export function whatsappInquiryUrl(type) {
  const number = personalData.phone.replace(/\D/g, "");
  const message = type === inquiryTypes[0]
    ? "Hi Aman! I would like to discuss building a new project. Here is what I have in mind:"
    : type === inquiryTypes[1]
      ? "Hi Aman! I would like help updating an existing project. Project link and changes needed:"
      : "Hi Aman! I found your portfolio and would like to connect.";
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

export default function ProjectInquiry({ onSelect, reduceMotion }) {
  return (
    <section id="hire" className="project-inquiry-section section-wrap">
      <motion.div className="inquiry-shell motion-reveal" initial={reduceMotion ? false : {opacity:0,y:24}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:0.1}}>
        <div className="inquiry-heading">
          <div className="eyebrow">LET’S WORK TOGETHER</div>
          <h2>Your next project.<br /><span>Let’s make it happen.</span></h2>
          <p>Available for website and app projects. Starting from scratch or improving something you already have? Tell me what you need, and we can discuss the next step.</p>
        </div>
        <div className="inquiry-options">
          {[
            { type: inquiryTypes[0], icon: <FiPlus />, title: "Build something new", description: "A website, mobile app, or custom web application. Let’s talk about your idea." },
            { type: inquiryTypes[1], icon: <FiRefreshCw />, title: "Improve an existing project", description: "A redesign, new features, or fixes. Let’s discuss what needs to change." },
          ].map(option => (
            <article key={option.type} className="inquiry-option">
              <span className="inquiry-icon">{option.icon}</span>
              <h3>{option.title}</h3>
              <p>{option.description}</p>
              <a className="inquiry-whatsapp" href={whatsappInquiryUrl(option.type)} target="_blank" rel="noreferrer"><FaWhatsapp /> Discuss on WhatsApp <FiArrowUpRight /></a>
              <a className="inquiry-form-link" href="#contact" onClick={() => onSelect(option.type)}>Prefer a form? Send your brief <FiArrowUpRight /></a>
            </article>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

export function ProjectRequestPicker({ value, onChange }) {
  return <fieldset className="request-picker"><legend>How can I help?</legend><div>{inquiryTypes.map(type => <label key={type} className={value === type ? "request-choice selected" : "request-choice"}><input type="radio" name="requestType" value={type} checked={value === type} onChange={() => onChange(type)} /><span>{type}</span></label>)}</div></fieldset>;
}
