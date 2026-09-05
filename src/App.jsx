import { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInstagram, faLinkedin } from "@fortawesome/free-brands-svg-icons";
import { ArrowDownRight, ArrowUpRight, Mail, MapPin, Menu, X } from "lucide-react";
import Clarity from "@microsoft/clarity";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import "./App.css";
import photoNight from "./assets/photography/IMG_2839.jpg";
import photoMountain from "./assets/photography/background.jpg";
import photoDunes from "./assets/photography/01ea5017c58dc49c2d71447c73c6abf35bf81e0128.jpg";
import photoCoast from "./assets/photography/0149195a3c50b33ff26a6f8ae83a19bb32f5e1afe6.jpg";

gsap.registerPlugin(ScrollTrigger, useGSAP);
Clarity.init("s1lra536cv");

const profile = { role: "Senior Computer Lab Administrator", organization: "University of Victoria", email: import.meta.env.VITE_EMAIL, location: import.meta.env.VITE_LOCATION };

const experience = [
  { dates: "2026 — PRESENT", title: "Senior Computer Lab Administrator", organization: "University of Victoria", tags: ["Windows 365", "Azure Virtual Desktop", "Intune", "Infrastructure", "Project Delivery"], description: "Leading the design and operation of modern physical and virtual computing environments for university teaching and learning.", link: "https://www.uvic.ca/systems/" },
  { dates: "2025 — 2026", title: "Desktop Support Analyst", organization: "University of Victoria", tags: ["Entra ID", "Intune", "Windows", "macOS", "Linux"], description: "Enterprise endpoint administration, Tier 2 troubleshooting, deployment, and technical project support across mixed-platform environments.", link: "https://www.uvic.ca/" },
  { dates: "2023 — 2025", title: "IT Desktop Support Technician", organization: "Terra Remote Sensing Inc.", tags: ["Active Directory", "Entra ID", "PowerShell", "Networking", "Automation"], description: "Supported a 100+ user hybrid Windows environment and built automation workflows that reduced repetitive support work.", link: "https://www.terraremote.com/" },
  { dates: "2022 — 2024", title: "Geek Squad Agent", organization: "Best Buy Canada", tags: ["Diagnostics", "Hardware", "Networking", "Data Migration", "Customer Support"], description: "Delivered in-store, remote, and on-site support across computers, mobile devices, televisions, and smart-home technology.", link: "https://www.bestbuy.ca/en-ca/services/geek-squad-services/bltb5f906bfb57d7744" },
];

const projects = [
  { number: "01", eyebrow: "FEATURED / INFRASTRUCTURE", title: "Designing a cloud-based university computer lab.", name: "Virtual Lab Platform", challenge: "Provide students reliable access to Windows learning environments beyond traditional physical computer labs.", role: "Architecture · Requirements · Endpoint Management · Security · Project Planning · Deployment", technologies: ["Windows 365", "Azure Virtual Desktop", "Intune", "Entra ID"], status: "Pilot / 2026", link: "#contact" },
  { number: "02", eyebrow: "WEB / INFRASTRUCTURE", title: "KXC Trading", name: "Business website and cloud hosting", challenge: "Planned, built, and deployed a WordPress site with domain, DNS, AWS EC2 hosting, SES mail delivery, theme customization, and SEO tooling.", technologies: ["WordPress", "AWS EC2", "DNS"], link: "https://kxctrading.ca/" },
  { number: "03", eyebrow: "WEB / MULTILINGUAL", title: "Happy Lamb Hot Pot Canada", name: "Responsive restaurant experience", challenge: "Designed and developed a static restaurant website with multilingual support and a custom JavaScript language switcher.", technologies: ["HTML", "CSS", "JavaScript"], link: "https://happylambhotpotca.com/" },
];

const capabilities = [
  { title: "Infrastructure", items: ["Azure", "Windows 365", "Azure Virtual Desktop", "Networking", "Virtual Labs"] },
  { title: "Endpoint", items: ["Intune", "Entra ID", "Windows", "macOS", "Linux", "Application Deployment"] },
  { title: "Automation", items: ["PowerShell", "Python", "Power Automate", "Scripting"] },
  { title: "Security", items: ["Identity", "Access Controls", "Compliance", "Endpoint Security", "Device Posture"] },
  { title: "Delivery", items: ["Architecture", "Project Planning", "Documentation", "Stakeholder Collaboration", "Technical Support"] },
];

const credentials = [
  { name: "Microsoft Certified: Azure Virtual Desktop Specialty", issuer: "Microsoft", date: "August 2026", badge: "/microsoft-certified-specialty-badge.svg", link: "/az-140.png" },
  { name: "CompTIA Security+", issuer: "CompTIA", date: "March 2026", badge: "/security-bage.png", link: "/CompTIA Security+ ce certificate.pdf" },
  { name: "Cisco Certified Network Associate (CCNA)", issuer: "Cisco", date: "May 2025", badge: "/ccna_large.jpg", link: "/Cisco%20Certified%20Network%20Associate%20certificate.pdf" },
  { name: "Microsoft 365 Certified: Endpoint Administrator Associate", issuer: "Microsoft", date: "September 2024", badge: "/microsoft-certified-associate-badge.svg", link: "/Credentials%20-%20mianzhu-4820%20_%20Microsoft%20Learn.pdf" },
];

const photos = [
  { src: photoNight, alt: "Stars above a dark shoreline at night" },
  { src: photoMountain, alt: "Layered mountain range beyond a green valley" },
  { src: photoDunes, alt: "A photographer standing on white sand dunes beneath dramatic clouds" },
  { src: photoCoast, alt: "Aerial view of waves meeting a forested coastline" },
];

const navItems = [["work", "Work"], ["experience", "Experience"], ["credentials", "Credentials"], ["photography", "Photography"], ["contact", "Contact"]];

function SectionHeader({ number, label, title, intro }) {
  return <header className="section-header reveal"><p className="section-label">{number} / {label}</p>{title ? <h2>{title}</h2> : null}{intro ? <p className="section-intro">{intro}</p> : null}</header>;
}

function Navigation() {
  const [open, setOpen] = useState(false);
  useEffect(() => { const close = () => setOpen(false); window.addEventListener("resize", close); return () => window.removeEventListener("resize", close); }, []);
  return <header className="site-nav"><div className="shell nav-inner"><a className="wordmark" href="#top" aria-label="Mian Zhu, home">MZ<span>.</span></a><button className="menu-button" type="button" aria-expanded={open} aria-controls="primary-navigation" onClick={() => setOpen(!open)}><span>{open ? "Close" : "Menu"}</span>{open ? <X size={19} /> : <Menu size={19} />}</button><nav id="primary-navigation" className={open ? "nav-links is-open" : "nav-links"} aria-label="Primary navigation">{navItems.map(([id, label]) => <a key={id} href={`#${id}`} onClick={() => setOpen(false)}>{label}</a>)}</nav></div></header>;
}

function App() {
  const pageRef = useRef(null);
  useGSAP(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.from(".hero-reveal", { y: 28, opacity: 0, duration: 0.85, stagger: 0.1, ease: "power3.out" });
    gsap.utils.toArray(".reveal").forEach((element) => gsap.from(element, { y: 34, opacity: 0, duration: 0.75, ease: "power3.out", scrollTrigger: { trigger: element, start: "top 88%", once: true } }));
  }, { scope: pageRef });

  return <div className="site" id="top" ref={pageRef}>
    <a className="skip-link" href="#main-content">Skip to content</a><div className="background-grid" aria-hidden="true" /><Navigation />
    <main id="main-content">
      <section className="hero shell" aria-labelledby="hero-title"><div className="hero-content"><p className="hero-eyebrow hero-reveal">Mian Zhu</p><h1 id="hero-title" className="hero-reveal">Building reliable <span>cloud &amp; endpoint</span> infrastructure.</h1><p className="hero-copy hero-reveal">I design, automate, and operate modern Windows environments across Azure, Intune, Entra ID, Windows 365, and Azure Virtual Desktop — combining hands-on engineering with security and project delivery.</p><div className="hero-actions hero-reveal"><a className="button button-primary" href="#work">View selected work <ArrowDownRight size={18} /></a><a className="button button-secondary" href="#experience">Résumé <ArrowDownRight size={18} /></a></div></div><div className="hero-credibility hero-reveal"><p><span className="status-dot" aria-hidden="true" />{profile.role} <span className="subtle">@ {profile.organization}</span></p><p>Azure Virtual Desktop · Security+ · CCNA · Microsoft 365 Endpoint Administrator</p></div><a className="scroll-cue" href="#work" aria-label="Scroll to selected work"><span>Scroll</span><ArrowDownRight size={18} /></a></section>

      <section className="section work-section" id="work"><div className="shell"><SectionHeader number="01" label="Selected work" title="Selected systems and digital work." intro="A small selection of infrastructure and web projects, focused on the problem, ownership, and delivery." /><article className="featured-project reveal"><div className="project-index">{projects[0].number}</div><div className="featured-project-main"><p className="project-eyebrow">{projects[0].eyebrow}</p><p className="project-name">{projects[0].name}</p><h3>{projects[0].title}</h3><div className="tag-row">{projects[0].technologies.map((item) => <span className="tag" key={item}>{item}</span>)}</div></div><div className="project-brief"><div><span>Challenge</span><p>{projects[0].challenge}</p></div><div><span>Role</span><p>{projects[0].role}</p></div><div className="project-status"><span>Status</span><p><i /> {projects[0].status}</p></div><a className="text-link" href={projects[0].link}>Discuss the project <ArrowUpRight size={16} /></a></div></article><div className="project-grid">{projects.slice(1).map((project) => <article className="project-card reveal" key={project.title}><div className="project-card-top"><span>{project.number}</span><span>{project.eyebrow}</span></div><div><p className="project-name">{project.name}</p><h3>{project.title}</h3><p>{project.challenge}</p></div><div><div className="tag-row">{project.technologies.map((item) => <span className="tag" key={item}>{item}</span>)}</div><a className="text-link" href={project.link} target="_blank" rel="noopener noreferrer">View project <ArrowUpRight size={16} /></a></div></article>)}</div></div></section>

      <section className="section" id="experience"><div className="shell"><SectionHeader number="02" label="Experience" title="Progress built through hands-on ownership." /><div className="experience-list">{experience.map((item) => <article className="experience-row reveal" key={`${item.title}-${item.dates}`}><p className="experience-date">{item.dates}</p><div className="experience-title"><h3>{item.title}</h3><a href={item.link} target="_blank" rel="noopener noreferrer">{item.organization} <ArrowUpRight size={14} /></a></div><div className="experience-detail"><div className="tag-row">{item.tags.map((tag) => <span className="tag" key={tag}>{tag}</span>)}</div><p>{item.description}</p></div></article>)}</div></div></section>

      <section className="section capability-section" id="capabilities"><div className="shell"><SectionHeader number="03" label="Capabilities" title="From architecture to everyday operations." /><div className="capability-grid">{capabilities.map((group, index) => <article className="capability-card reveal" key={group.title}><span>0{index + 1}</span><h3>{group.title}</h3><ul>{group.items.map((item) => <li key={item}>{item}</li>)}</ul></article>)}</div></div></section>

      <section className="section" id="credentials"><div className="shell"><SectionHeader number="04" label="Credentials" title="Independent validation of practical expertise." intro="Cloud, endpoint, security, and networking credentials that reinforce the work." /><div className="credential-list">{credentials.map((credential) => <a className="credential-row reveal" href={credential.link} target="_blank" rel="noopener noreferrer" key={credential.name}><span className="badge-frame"><img src={credential.badge} alt="" loading="lazy" /></span><span className="credential-name"><small>{credential.issuer}</small><strong>{credential.name}</strong></span><span className="credential-date">{credential.date}</span><ArrowUpRight className="credential-arrow" size={19} /></a>)}</div></div></section>

      <section className="section about-section" id="about"><div className="shell about-grid"><SectionHeader number="05" label="About" /><div className="about-copy reveal"><h2>I like systems that make difficult work feel simple.</h2><p>I’m an infrastructure and endpoint professional interested in the space where architecture, automation, security, and real people meet. I enjoy tracing problems to their source, making technology more dependable, and documenting the path so the next person has an easier time.</p><p>Away from systems work, photography gives me another way to observe carefully, find structure, and stay curious.</p></div></div></section>

      <section className="section photo-section" id="photography"><div className="shell"><SectionHeader number="06" label="Off the clock" title="Places I’ve stopped long enough to notice." /><div className="photo-grid">{photos.map((photo, index) => <figure className={`photo photo-${index + 1} reveal`} key={photo.src}><img src={photo.src} alt={photo.alt} loading="lazy" /><figcaption>0{index + 1}</figcaption></figure>)}</div></div></section>

      <section className="contact-section" id="contact"><div className="shell"><p className="section-label reveal">07 / Contact</p><div className="contact-grid"><div className="reveal"><h2>Have an interesting infrastructure problem?</h2><a className="contact-email" href={`mailto:${profile.email}`}>Let’s talk <ArrowUpRight size={28} /></a></div><div className="contact-details reveal"><a href={`mailto:${profile.email}`}><Mail size={16} /> {profile.email}</a><p><MapPin size={16} /> {profile.location}</p><a href="https://www.linkedin.com/in/mian-zhu-7547215a/" target="_blank" rel="noopener noreferrer"><FontAwesomeIcon icon={faLinkedin} /> LinkedIn</a><a href="https://www.instagram.com/zhu_mian/" target="_blank" rel="noopener noreferrer"><FontAwesomeIcon icon={faInstagram} /> Instagram</a></div></div><footer><a className="wordmark" href="#top">MZ<span>.</span></a><p>Cloud · Endpoint · Infrastructure</p><p>© {new Date().getFullYear()} Mian Zhu</p></footer></div></section>
    </main>
  </div>;
}

export default App;
