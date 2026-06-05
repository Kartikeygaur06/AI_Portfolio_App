import React from "react";
import { 
  User, 
  Briefcase, 
  Code, 
  MapPin, 
  Mail, 
  Github, 
  Linkedin, 
  BookOpen, 
  ArrowUpRight, 
  FileText,
  Terminal
} from "lucide-react";

export function ProfileHeader({ data }) {
  const { personalInfo } = data;
  return (
    <div id="profile-header" className="relative overflow-hidden bg-white border border-slate-200/80 rounded-2xl p-6 md:p-8 shadow-sm">
      {/* Accent Background Glow */}
      <div className="absolute right-0 top-0 -mr-16 -mt-16 w-56 h-56 rounded-full bg-rose-50/50 blur-3xl pointer-events-none" />
      <div className="absolute left-1/3 bottom-0 w-36 h-36 rounded-full bg-cyan-50/40 blur-2xl pointer-events-none" />

      <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-medium font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
            Active PS1 Student @ Caarya
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold font-display tracking-tight text-slate-900 leading-none">
            {personalInfo.name}
          </h1>
          
          <p className="text-lg md:text-xl font-medium text-slate-700 font-sans">
            {personalInfo.role}
          </p>
          
          <p className="text-sm md:text-base text-slate-500 font-sans leading-relaxed">
            {personalInfo.headline}
          </p>

          <div className="flex flex-wrap items-center gap-y-2 gap-x-4 pt-1 text-xs md:text-sm text-slate-500 font-medium">
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4 text-slate-400" />
              <span>{personalInfo.location}</span>
            </div>
            <div className="hidden sm:block text-slate-300">•</div>
            <a 
              href={`mailto:${personalInfo.email}`} 
              className="flex items-center gap-1 text-slate-500 hover:text-rose-600 transition"
              id="social-link-email"
            >
              <Mail className="w-4 h-4 text-slate-400 hover:text-rose-500" />
              <span>{personalInfo.email}</span>
            </a>
          </div>
        </div>

        {/* Action/Social Buttons */}
        <div className="flex flex-row md:flex-col gap-3 pt-2 md:pt-0 border-t border-slate-100 md:border-0">
          <a 
            href={personalInfo.githubUrl} 
            target="_blank" 
            rel="noreferrer"
            className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 transition max-xs:flex-1"
            id="social-link-github"
          >
            <Github className="w-4 h-4 text-slate-700" />
            <span className="font-sans">GitHub</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 ml-auto" />
          </a>
          <a 
            href={personalInfo.linkedinUrl} 
            target="_blank" 
            rel="noreferrer"
            className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 transition max-xs:flex-1"
            id="social-link-linkedin"
          >
            <Linkedin className="w-4 h-4 text-sky-700" />
            <span className="font-sans">LinkedIn</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 ml-auto" />
          </a>
        </div>
      </div>
    </div>
  );
}

export function ResumeSummarySection({ data }) {
  return (
    <div id="resume-summary" className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <FileText className="w-5 h-5 text-rose-600" />
        <h2 className="text-lg font-bold font-display text-slate-900 tracking-tight">
          Executive Summary
        </h2>
      </div>
      <p className="text-sm md:text-base text-slate-600 font-sans leading-relaxed font-light italic pl-4 border-l-2 border-rose-200">
        "{data.personalInfo.resumeSummary}"
      </p>
    </div>
  );
}

export function AboutSection({ data }) {
  return (
    <div id="about-section" className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <User className="w-5 h-5 text-rose-600" />
        <h2 className="text-lg font-bold font-display text-slate-900 tracking-tight">
          About Kartikey
        </h2>
      </div>
      <p className="text-sm md:text-base text-slate-600 font-sans leading-relaxed">
        {data.about}
      </p>
    </div>
  );
}

export function ExperienceSection({ data }) {
  return (
    <div id="experience-section" className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
      <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-2">
        <Briefcase className="w-5 h-5 text-rose-600" />
        <h2 className="text-lg font-bold font-display text-slate-900 tracking-tight">
          Experience
        </h2>
      </div>

      <div className="relative border-l border-slate-200 pl-4 ml-2 space-y-6">
        {data.experience.map((exp, index) => (
          <div key={index} id={`experience-item-${index}`} className="relative space-y-2">
            {/* Timeline Dot */}
            <span className="absolute -left-[20.5px] top-1.5 w-3.5 h-3.5 rounded-full bg-white border-2 border-rose-600 shadow-sm" />
            
            <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-1">
              <div>
                <h3 className="text-base font-bold text-slate-950 font-sans">
                  {exp.role}
                </h3>
                <div className="text-sm font-medium text-slate-700">
                  {exp.company}
                </div>
              </div>
              <div className="text-xs font-mono text-slate-500 bg-slate-50 border border-slate-200/60 px-2 py-0.5 rounded-md self-start sm:text-right">
                {exp.duration}
              </div>
            </div>

            {exp.location && (
              <p className="text-xs text-slate-400 flex items-center gap-1 font-sans">
                <MapPin className="w-3 h-3" />
                {exp.location}
              </p>
            )}

            {exp.description && exp.description.length > 0 && (
              <ul className="list-disc list-outside pl-4 space-y-1 text-slate-600 text-sm">
                {exp.description.map((bullet, idx) => (
                  <li key={idx} className="leading-relaxed">
                    {bullet}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export function ProjectsSection({ data }) {
  return (
    <div id="projects-section" className="space-y-4">
      <div className="flex items-center gap-2 mb-1">
        <Code className="w-5 h-5 text-rose-600" />
        <h2 className="text-lg font-bold font-display text-slate-900 tracking-tight">
          Featured Projects
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data.projects.map((proj, index) => (
          <div 
            key={index} 
            id={`project-card-${index}`} 
            className="flex flex-col h-full bg-white border border-slate-200/80 rounded-xl p-5 hover:border-slate-300 hover:shadow-md transition duration-300"
          >
            <div className="flex justify-between items-start gap-2 mb-2">
              <div>
                <h3 className="text-base font-bold text-slate-900 font-sans">
                  {proj.title}
                </h3>
                <p className="text-xs font-medium text-slate-500 font-sans">
                  {proj.role} • {proj.duration}
                </p>
              </div>
            </div>

            <p className="text-sm text-slate-600 mb-4 line-clamp-3 leading-relaxed flex-grow">
              {proj.description}
            </p>

            <div className="space-y-3 mt-auto pt-3 border-t border-slate-100">
              <div className="space-y-1">
                <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase font-mono block">
                  Key Deliverables
                </span>
                <ul className="text-xs text-slate-600 space-y-1 pl-4 list-disc">
                  {proj.achievements.map((ach, idx) => (
                    <li key={idx} className="leading-normal">{ach}</li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {proj.technologies.map((tech, idx) => (
                  <span 
                    key={idx} 
                    className="px-2 py-0.5 text-[10px] font-mono font-medium rounded bg-slate-50 border border-slate-250 text-slate-650"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function SkillsSection({ data }) {
  return (
    <div id="skills-section" className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
      <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-2">
        <Terminal className="w-5 h-5 text-rose-600" />
        <h2 className="text-lg font-bold font-display text-slate-900 tracking-tight">
          Capabilities & Core Stack
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {data.skills.map((cat, idx) => (
          <div key={idx} id={`skills-category-${idx}`} className="space-y-2">
            <h3 className="text-xs font-bold tracking-wider text-slate-400 uppercase font-mono">
              {cat.category}
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {cat.skills.map((skill, sIdx) => (
                <span 
                  key={sIdx} 
                  className="px-2.5 py-1 text-xs text-slate-705 bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-lg font-sans transition hover:-translate-y-0.5 cursor-default inline-block"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function EducationSection({ data }) {
  return (
    <div id="education-section" className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
      <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-2">
        <BookOpen className="w-5 h-5 text-rose-600" />
        <h2 className="text-lg font-bold font-display text-slate-900 tracking-tight">
          Academic Background
        </h2>
      </div>

      {data.education.map((edu, idx) => (
        <div key={idx} id={`education-item-${idx}`} className="space-y-3">
          <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-1">
            <div>
              <h3 className="text-base font-bold text-slate-950 font-sans">
                {edu.institution}
              </h3>
              <p className="text-sm font-semibold text-slate-707">
                {edu.degree} in {edu.branch}
              </p>
            </div>
            
            <div className="flex flex-row sm:flex-col gap-2 sm:gap-1 items-center sm:items-end">
              <span className="text-xs font-mono text-slate-500 bg-slate-50 border border-slate-200/60 px-2 py-0.5 rounded-md">
                {edu.duration}
              </span>
              {edu.gpa && (
                <span className="text-xs font-extrabold text-rose-700 font-sans bg-rose-50 border border-rose-100 px-2 py-0.5 rounded-md">
                  CGPA: {edu.gpa}
                </span>
              )}
            </div>
          </div>

          <ul className="text-xs text-slate-600 list-disc list-outside pl-4 space-y-1 leading-relaxed font-sans">
            {edu.highlights.map((item, idy) => (
              <li key={idy}>{item}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
