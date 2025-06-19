import React, { useRef } from 'react';
import LiquidGlass from 'liquid-glass-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { faInstagram } from '@fortawesome/free-brands-svg-icons';
import Clarity from '@microsoft/clarity';
import {
  Briefcase,
  Zap,
  GraduationCap,
  Award,
  Heart,
  Quote
} from 'lucide-react';
import './App.css';

const projectId = "s1lra536cv"

Clarity.init(projectId);

/* ───────────────────────────────────── Full Resume Data */
const resumeData = {
  basics: {
    name: 'Mian Zhu',
    email: 'mian@zhumian.ca',
    phone: '778-350-0225',
    location: 'Victoria, BC'
  },
  summary: `<ul>
  <li><strong>Proactive IT Desktop Support Technician</strong> with 2+ years of experience in enterprise IT and tech retail environments.</li>
  <li>Skilled in endpoint management using Microsoft Intune, including policy deployment and device compliance.</li>
  <li>Experienced in user support across Microsoft 365 apps (Teams, Outlook, SharePoint, OneDrive).</li>
  <li>Strong break/fix abilities with hands-on troubleshooting of hardware, software, and networking issues.</li>
  <li>Proficient in automation using PowerShell, Power Automate, and Python to reduce manual workload.</li>
  <li>Hands-on experience managing Active Directory, Microsoft Entra (Azure AD), and Exchange environments.</li>
  <li>Self-motivated, organized, and able to perform under pressure with a focus on security and documentation.</li>
  <li>Clear communicator with a proactive and problem-solving approach.</li>
</ul>`,
  experience: [
    {
      position: 'IT Desktop Support Technician',
      company: 'Terra Remote Sensing Inc.',
      location: 'North Saanich, BC',
      date: 'August 2023 – Present',
      summary: `<ul>
        <li><p><strong>Endpoint Management & Deployment:</strong><br>Managed and secured 200+ mobile, desktop, and laptop devices using Microsoft Intune. Analysed, created, and deployed security policies and configuration profiles to ensure compliance and standardisation across all endpoints.</p></li>
        <li><p><strong>Technical Support & Break/Fix:</strong><br>Provided comprehensive hardware, software, and network troubleshooting for a 100-employee Windows environment, supporting Microsoft 365 apps (Teams, Outlook, OneDrive, SharePoint) via email, Teams, and phone.</p></li>
        <li><p><strong>Automation & Scripting:</strong><br>Developed PowerShell, Python, and Power Automate workflows that reduced manual ticket load by 30%.</p></li>
        <li><p><strong>Cloud & Directory Management:</strong><br>Administered Active Directory and Microsoft Entra; gained hands-on experience with AWS EC2/S3 for future migration planning.</p></li>
      </ul>`,
      link: 'https://www.terraremote.com/'
    },
    {
      position: 'Geek Squad Agent',
      company: 'Best Buy Canada',
      location: 'Victoria, BC',
      date: 'June 2022 – August 2023 · September 2024 – December 2024',
      summary: `<ul>
        <li><p>Delivered <strong>in-store, remote, and on-site support</strong> for computers, mobile devices, and smart-home tech, maintaining 90% customer satisfaction.</p></li>
        <li><p>Diagnosed and repaired <strong>hardware, software, and networking issues</strong> across desktops, laptops, tablets, TVs, and IoT devices.</p></li>
        <li><p>Provided personalised training on device features and best practices, reducing repeat visits by 20%.</p></li>
        <li><p>Performed new-device setup and data migrations to ensure smoother customer onboarding.</p></li>
      </ul>`,
      link: 'https://www.bestbuy.ca/en-ca/services/geek-squad-services/bltb5f906bfb57d7744'
    }
  ],
  education: [
    {
      degree: 'Certificate · Information and Computer Systems Technology',
      institution: 'Camosun College',
      date: 'Jan 2023 – Dec 2023',
      summary:
        '<p>Completed intensive coursework in HTML, CSS, Java, Python, Linux, and SQL, gaining practical experience in software development, network administration, and cybersecurity fundamentals.</p>',
      link:
        'https://camosun.ca/programs-courses/find-program/information-and-computer-systems-technologist-diploma'
    },
    {
      degree: 'Bachelor of Arts · Economics (Major) & Business (Minor)',
      institution: 'University of Victoria',
      date: 'Apr 2017 – Aug 2019',
      summary: `<ul>
        <li><p>Developed strong analytical and quantitative skills through economic modelling and data analysis.</p></li>
        <li><p>Enhanced communication and presentation abilities via capstone projects and seminars.</p></li>
        <li><p>Applied critical-thinking to evaluate global market trends and business strategies.</p></li>
      </ul>`,
      link: 'https://www.uvic.ca/socialsciences/economics/index.php'
    }
  ],

projects: [
  {
    name: 'KXC Trading WordPress Website',
    description:
      'Planned, built, and deployed a full WordPress website for a friend’s trading business. Set up domain and DNS, hosted the site on AWS EC2, and configured AWS Simple Email Service (SES) for contact form functionality. Customized theme and optimized SEO using plugins and Google tools.',
    link: 'https://kxctrading.ca/'
  },
  {
    name: 'Happy Lamb Hot Pot Canada Website',
     description:
      'Designed and developed a static restaurant website using HTML, CSS, and JavaScript. Managed domain registration and DNS setup. Implemented a custom multilingual interface supporting English, Chinese, and French using JavaScript-based language toggling. Responsive design with menu, business hours, and map.',
    link: 'https://happylambhotpotca.com/'
  },
  {
    name: 'Personal Resume Site',
    description:
      'This site — built with React and Vite, styled with custom components, and hosted on Firebase with a custom domain (zhumian.ca). Full end-to-end setup including domain registration, DNS management, and SEO optimization for discoverability.',
    link: 'https://zhumian.ca'
  }
],

  certifications: [
    {
      name: 'Cisco Certified Network Associate (CCNA)',
      issuer: 'Cisco',
      date: 'May 2025',
      logo: '/ccna_large.jpg',
      link: '/Cisco%20Certified%20Network%20Associate%20certificate.pdf'
    },
    {
      name: 'Microsoft 365 Certified: Endpoint Administrator Associate',
      issuer: 'Microsoft',
      date: 'Sep 2024',
      logo: '/microsoft-certified-associate-badge.svg',
      link: '/Credentials%20-%20mianzhu-4820%20_%20Microsoft%20Learn.pdf'
    }
  ],
  skills: [
    'Tech Support',
    'Routing & Switching',
    'Microsoft Intune',
    'Endpoint Management',
    'Active Directory (AD DC)',
    'Entra ID (Azure AD)',
    'PowerShell',
    'Microsoft Office',
    'Automation (Power Automate / Python)',
    'Communication Skills'
  ],
  interests: ['Photography', 'Networking', 'Artificial Intelligence', 'Camping', 'Video Games','Building WordPress & Custom Sites for Friends & Local Businesses'],
  references: ['Available upon request']
};

/* Helpers */
const getInitials = (name) => {
  if (!name) return '';
  const parts = name.trim().split(' ');
  return parts[0][0] + (parts.length > 1 ? parts[parts.length - 1][0] : '');
};

const CertTag = ({ cert }) => (
  <a
    href={cert.link}
    target="_blank"
    rel="noopener noreferrer"
    className="cert-tag skill-tag"
    title="Click to view certification"
  >
    {cert.logo && (
      <div className="cert-logo-wrapper">
        <img src={cert.logo} alt={cert.name} className="cert-logo" />
      </div>
    )}
    <span>{cert.name}</span>
  </a>
);



const App = () => {
  const appRef = useRef(null);

  return (
    <div className="app-wrapper" ref={appRef}>
      {/* Background */}
      <LiquidGlass
        mouseContainer={appRef}
        blurAmount={0.2}
        displacementScale={40}
        glassColor="rgba(255,255,255,0.08)"
        cornerRadius={0}
        style={{ position: 'fixed', inset: 0, zIndex: -1 }}
      />

<div className="container responsive-layout">
        {/* ───────── Sidebar (desktop only personal info) ───────── */}
        <aside className="sidebar">
          {/* personal info visible on desktop */}
          <div className="sidebar-header hide-on-mobile">
            <div className="initials-circle">{getInitials(resumeData.basics.name)}</div>
            <div className="header-text">
              <h1 className="name">{resumeData.basics.name}</h1>
              <h2 className="title">IT Desktop Support Technician</h2>
            </div>
          </div>

          {/* Contact (desktop only) */}
          <div className="contact-info hide-on-mobile">
            <div className="contact-item"><span className="contact-label">Email:</span><a href={`mailto:${resumeData.basics.email}`}>{resumeData.basics.email}</a></div>
            <div className="contact-item"><span className="contact-label">Phone:</span><a href={`tel:${resumeData.basics.phone}`}>{resumeData.basics.phone}</a></div>
            <div className="contact-item"><span className="contact-label">Location:</span><span>{resumeData.basics.location}</span></div>
          </div>

          {/* Skills */}
          <section id="skills-sidebar">
            <h3 className="sidebar-section-title flex items-center gap-2">
              <Zap size={18} /> Skills
            </h3>
            <div className="skills-grid">
              {resumeData.skills.map((skill) => (
                <span key={skill} className="skill-tag">
                  {skill}
                </span>
              ))}
            </div>
          </section>

          {/* Certifications */}
          <section id="certifications-sidebar" className="mt-6">
            <h3 className="sidebar-section-title flex items-center gap-2">
              <Award size={18} /> Certifications
            </h3>
            <div className="skills-grid">
              {resumeData.certifications.map((c) => (
                <CertTag key={c.name} cert={c} />
              ))}
            </div>
          </section>

          {/* Social */}
<div className="social-links">
  <a
    href="https://www.linkedin.com/in/mian-zhu-7547215a/"
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center gap-2"
  >
    <FontAwesomeIcon icon={faLinkedin} size="lg" />
    LinkedIn
  </a>
  <a
    href="https://www.instagram.com/zhu_mian/" 
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center gap-2"
  >
    <FontAwesomeIcon icon={faInstagram} size="lg" />
    Instagram
  </a>
</div>


        </aside>

        {/* ───────── Main Content ───────── */}
        <main className="main-content">
          {/* mobile personal info appears at top on phones */}
          <section className="mobile-personal show-on-mobile">
            <div className="initials-circle">{getInitials(resumeData.basics.name)}</div>
            <div className="header-text">
              <h1 className="name">{resumeData.basics.name}</h1>
              <h2 className="title">IT Desktop Support Technician</h2>
            </div>
            <div className="contact-info">
              <div className="contact-item"><span className="contact-label">Email:</span><a href={`mailto:${resumeData.basics.email}`}>{resumeData.basics.email}</a></div>
              <div className="contact-item"><span className="contact-label">Phone:</span><a href={`tel:${resumeData.basics.phone}`}>{resumeData.basics.phone}</a></div>
              <div className="contact-item"><span className="contact-label">Location:</span><span>{resumeData.basics.location}</span></div>
            </div>
          </section>

          {/* SUMMARY */}
          <section id="summary">
            <h3>Summary</h3>
            <div className="richtext" dangerouslySetInnerHTML={{ __html: resumeData.summary }} />
          </section>

          {/* EXPERIENCE */}
          <section id="experience">
            <h3 className="flex items-center gap-2">
              <Briefcase size={18} /> Experience
            </h3>
            {resumeData.experience.map((job) => (
              <div key={job.company} className="item">
                <h4>
                  {job.position}{' '}
                  <span>
                    @{' '}
                    <a href={job.link} target="_blank" rel="noopener noreferrer">
                      {job.company}
                    </a>
                  </span>
                </h4>
                <p className="date">
                  {job.location && `${job.location} · `} {job.date}
                </p>
                <div
                  className="richtext"
                  dangerouslySetInnerHTML={{ __html: job.summary }}
                />
              </div>
            ))}
          </section>

          {/* EDUCATION */}
          <section id="education">
            <h3 className="flex items-center gap-2">
              <GraduationCap size={18} /> Education
            </h3>
            {resumeData.education.map((edu) => (
              <div key={edu.institution} className="item">
                <h4>
                  <a href={edu.link} target="_blank" rel="noopener noreferrer">
                    {edu.degree}
                  </a>
                </h4>
                <p className="date">
                  {edu.institution} · {edu.date}
                </p>
                {edu.summary && (
                  <div
                    className="richtext"
                    dangerouslySetInnerHTML={{ __html: edu.summary }}
                  />
                )}
              </div>
            ))}
          </section>

          {/* PROJECTS */}
<section id="projects">
  <h3 className="flex items-center gap-2">
    <Briefcase size={18} /> Projects
  </h3>
  {resumeData.projects.map((project) => (
    <div key={project.name} className="item">
      <h4>
        {project.link ? (
          <a href={project.link} target="_blank" rel="noopener noreferrer">
            {project.name}
          </a>
        ) : (
          project.name
        )}
      </h4>
      <p className="description">{project.description}</p>
    </div>
  ))}
</section>


          {/* INTERESTS */}
          <section id="interests">
            <h3 className="flex items-center gap-2">
              <Heart size={18} /> Interests
            </h3>
            <div className="skills-grid">
              {resumeData.interests.map((interest) => (
                <span key={interest} className="skill-tag">
                  {interest}
                </span>
              ))}
            </div>
          </section>

          {/* REFERENCES */}
          <section id="references">
            <h3 className="flex items-center gap-2">
              <Quote size={18} /> References
            </h3>
            <p>{resumeData.references[0]}</p>
          </section>
        </main>
      </div>
    </div>
  );
};

export default App;
