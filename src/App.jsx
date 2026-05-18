import { useEffect, useRef, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import profil from './assets/profil.jpg'
import ruijie from './assets/ruijie.png'
import { Sun, Moon } from 'lucide-react';
import emailjs from '@emailjs/browser'
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp
} from "firebase/firestore";
import { db } from "./firebase";
import {
  FaGithub,
  FaReact,
  FaLaravel,
  FaNodeJs,
  FaDocker,
} from 'react-icons/fa'

import {
  SiFirebase,
  SiNextdotjs,
  SiTailwindcss,
  SiPrisma,
  SiMongodb,
  SiMysql,
  SiTypescript,
  SiJavascript,
  SiPhp,
  SiExpress
} from 'react-icons/si'

import { HiOutlineExternalLink } from 'react-icons/hi'

// ============================================================
// SCROLL REVEAL HOOK — muncul saat masuk, hilang saat keluar
// ============================================================
function useScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale')
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible')
          e.target.classList.remove('hidden')
        } else {
          e.target.classList.remove('visible')
          e.target.classList.add('hidden')
        }
      })
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' })
    els.forEach(el => obs.observe(el))
    return () => obs.disconnect()
  })
}


// ============================================================
// CUSTOM CURSOR
// ============================================================
function Cursor() {
  const dot = useRef(null), ring = useRef(null)
  useEffect(() => {
    let mx = 0, my = 0, rx = 0, ry = 0
    const move = e => { mx = e.clientX; my = e.clientY }
    window.addEventListener('mousemove', move)
    let raf
    const loop = () => {
      rx += (mx - rx) * .12; ry += (my - ry) * .12
      if (dot.current) { dot.current.style.left = mx + 'px'; dot.current.style.top = my + 'px' }
      if (ring.current) { ring.current.style.left = rx + 'px'; ring.current.style.top = ry + 'px' }
      raf = requestAnimationFrame(loop)
    }
    loop()
    return () => { window.removeEventListener('mousemove', move); cancelAnimationFrame(raf) }
  }, [])
  return (<>
    <div className="custom-cursor" ref={dot} style={{ position: 'fixed', pointerEvents: 'none', zIndex: 99999, width: 10, height: 10, background: '#7c3aed', borderRadius: '50%', transform: 'translate(-50%,-50%)', top: 0, left: 0 }} />
    <div className="custom-cursor" ref={ring} style={{ position: 'fixed', pointerEvents: 'none', zIndex: 99998, width: 36, height: 36, border: '1.5px solid rgba(124,58,237,.55)', borderRadius: '50%', transform: 'translate(-50%,-50%)', top: 0, left: 0 }} />
  </>)
}

// ============================================================
// PARTICLES
// ============================================================
function Particles() {
  const c = useRef(null)
  useEffect(() => {
    const cv = c.current, ctx = cv.getContext('2d')
    let w = cv.width = window.innerWidth, h = cv.height = window.innerHeight
    const pts = Array.from({ length: 55 }, () => ({ x: Math.random() * w, y: Math.random() * h, vx: (Math.random() - .5) * .25, vy: (Math.random() - .5) * .25, r: Math.random() * 1.2 + .4 }))
    const resize = () => { w = cv.width = window.innerWidth; h = cv.height = window.innerHeight }
    window.addEventListener('resize', resize)
    let raf
    const draw = () => {
      ctx.clearRect(0, 0, w, h)
      pts.forEach(p => {
        p.x += p.vx; p.y += p.vy
        if (p.x < 0) p.x = w; if (p.x > w) p.x = 0; if (p.y < 0) p.y = h; if (p.y > h) p.y = 0
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fillStyle = 'rgba(124,58,237,0.45)'; ctx.fill()
      })
      pts.forEach((a, i) => pts.slice(i + 1).forEach(b => {
        const dx = a.x - b.x, dy = a.y - b.y, d = Math.sqrt(dx * dx + dy * dy)
        if (d < 130) { ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.strokeStyle = `rgba(124,58,237,${.055 * (1 - d / 130)})`; ctx.stroke() }
      }))
      raf = requestAnimationFrame(draw)
    }
    draw()
    return () => { window.removeEventListener('resize', resize); cancelAnimationFrame(raf) }
  }, [])
  return <canvas ref={c} style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }} />
}

// ============================================================
// LAPTOP SVG
// ============================================================
function LaptopSVG({ theme }) {
  return (
    <svg viewBox="0 0 420 340" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', maxWidth: 380, animation: 'float 4s ease-in-out infinite' }}>
      <rect x="80" y="20" width="260" height="185" rx="14" fill={theme === 'dark' ? '#1a0a3a' : '#ffffff'} stroke="#7c3aed" strokeWidth="3" />
      <rect x="92" y="32" width="236" height="158" rx="8" fill={theme === 'dark' ? '#0d0520' : '#f8fafc'} />
      <rect x="92" y="32" width="236" height="158" rx="8" fill="url(#sg)" />
      {[[108, 52, 120, '#7c3aed', .9], [108, 68, 160, '#06b6d4', .7], [108, 84, 90, '#7c3aed', .6], [108, 100, 140, '#06b6d4', .8], [108, 116, 110, '#a78bfa', .7], [108, 132, 170, '#7c3aed', .5], [108, 148, 85, '#06b6d4', .6], [108, 164, 130, '#a78bfa', .8]].map(([x, y, w, c, o], i) => (
        <rect key={i} x={x} y={y} width={w} height="7" rx="3.5" fill={c} opacity={o} />
      ))}
      <rect x="188" y="205" width="44" height="22" rx="4" fill={theme === 'dark' ? '#2d1060' : '#ddd6fe'} />
      <rect x="155" y="226" width="110" height="10" rx="5" fill={theme === 'dark' ? '#3d1a80' : '#c4b5fd'} />
      <rect x="30" y="248" width="360" height="80" rx="14" fill={theme === 'dark' ? '#1a0a3a' : '#ffffff'} stroke="#7c3aed" strokeWidth="2" />
      {[0, 1, 2].map(row => Array.from({ length: row === 0 ? 10 : row === 1 ? 9 : 8 }).map((_, i) => (
        <rect key={`${row}-${i}`} x={48 + i * (row === 2 ? 36 : 32) + (row === 1 ? 10 : row === 2 ? 20 : 0)} y={260 + row * 20} width={row === 0 ? 24 : 28} height="14" rx="3" fill={theme === 'dark' ? '#2d1060' : '#ddd6fe'} opacity=".9" />
      )))}
      <defs>
        <linearGradient
          id="sg"
          x1="92"
          y1="32"
          x2="328"
          y2="190"
          gradientUnits="userSpaceOnUse"
        >
          <stop
            stopColor={
              theme === 'dark'
                ? '#2d0a6e'
                : '#ffffff'
            }
            stopOpacity={
              theme === 'dark'
                ? '.7'
                : '1'
            }
          />

          <stop
            offset="1"
            stopColor={
              theme === 'dark'
                ? '#0a0520'
                : '#f8fafc'
            }
            stopOpacity={
              theme === 'dark'
                ? '.4'
                : '1'
            }
          />
        </linearGradient>
      </defs>
    </svg>
  )
}

// ============================================================
// DATA
// ============================================================
const TECH_ICONS = {
  React: <FaReact />,
  NextJS: <SiNextdotjs />,
  Firebase: <SiFirebase />,
  Laravel: <FaLaravel />,
  MySQL: <SiMysql />,
  Tailwind: <SiTailwindcss />,
  NodeJS: <FaNodeJs />,
  Express: <SiExpress />,
  Prisma: <SiPrisma />,
  MongoDB: <SiMongodb />,
  Docker: <FaDocker />,
  TypeScript: <SiTypescript />,
  JavaScript: <SiJavascript />,
  PHP: <SiPhp />,
}
const PROJECTS = [
  {
    id: 1,
    title: 'Sistem Informasi E-Learning',
    shortDesc: 'Platform pembelajaran online untuk mengelola materi, ujian, guru, siswa, dan hasil belajar.',
    desc: 'Sistem informasi E-Learning berbasis web yang dibuat untuk mendukung proses pembelajaran digital. Aplikasi ini memiliki fitur manajemen materi, ujian online, role user, serta pengelolaan data guru dan siswa.',
    tech: ['NextJS', 'TypeScript', 'Prisma'],
    techCount: 3,
    features: ['Authentication', 'Manajemen Materi', 'Ujian Online', 'Manajemen Guru', 'Manajemen Siswa'],
    featureCount: 5,
    link: '#',
    github: '#',
    hasDemo: false,
    screenshot: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&q=80',
    iconUrl: 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/nextdotjs.svg',
    color: '#7c3aed'
  },
  {
    id: 2,
    title: 'Sistem Informasi Medical Checkup',
    shortDesc: 'Aplikasi untuk mengelola pasien, booking MCU, paket pemeriksaan, hasil lab, dan review dokter.',
    desc: 'Sistem informasi Medical Checkup berbasis web yang dibuat untuk membantu proses administrasi pemeriksaan kesehatan. Aplikasi ini mendukung manajemen pasien, booking pemeriksaan, input hasil lab, upload file, serta approval hasil oleh dokter.',
    tech: ['Laravel', 'MySQL', 'Tailwind CSS'],
    techCount: 3,
    features: ['Manajemen Pasien', 'Booking MCU', 'Paket Pemeriksaan', 'Input Hasil Lab', 'Review Dokter'],
    featureCount: 5,
    link: '#',
    github: '#',
    hasDemo: false,
    screenshot: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&q=80',
    iconUrl: 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/laravel.svg',
    color: '#ef4444'
  },
  {
    id: 3,
    title: 'Whatsapp Gateway',
    shortDesc: 'Sistem pengiriman pesan WhatsApp otomatis menggunakan backend Node.js dan session WhatsApp.',
    desc: 'Aplikasi Whatsapp Gateway yang dibuat untuk mengirim pesan otomatis, mengelola koneksi perangkat, menyimpan session WhatsApp, serta mendukung integrasi dengan sistem lain.',
    tech: ['Node.js', 'Express', 'Baileys'],
    techCount: 3,
    features: ['Scan QR WhatsApp', 'Auto Reply', 'Send Message', 'Session Management', 'Multi Device'],
    featureCount: 5,
    link: '#',
    github: '#',
    hasDemo: false,
    screenshot: 'https://images.unsplash.com/photo-1611605698335-8b1569810432?w=600&q=80',
    iconUrl: 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/whatsapp.svg',
    color: '#10b981'
  },
  {
    id: 4,
    title: 'Sistem Informasi Inventori Barang',
    shortDesc: 'Aplikasi inventory untuk mengelola data barang, stok masuk, stok keluar, dan laporan.',
    desc: 'Sistem informasi Inventori Barang berbasis web yang dibuat untuk membantu pencatatan dan pengelolaan stok barang. Aplikasi ini mendukung manajemen barang, kategori, transaksi stok masuk dan keluar, serta laporan data inventori.',
    tech: ['PHP', 'MySQL', 'Bootstrap'],
    techCount: 3,
    features: ['Manajemen Barang', 'Kategori Barang', 'Stok Masuk', 'Stok Keluar', 'Laporan Inventori'],
    featureCount: 5,
    link: '#',
    github: '#',
    hasDemo: true,
    screenshot: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&q=80',
    iconUrl: 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/mysql.svg',
    color: '#f59e0b'
  },
]

const CERTS = [
  {
    name: '2nd Place Certificate for IT Network System Administrator',
    issuer: 'Dinas Pendidikan',
    year: '2024',
    iconUrl: 'https://cdn.simpleicons.org/cisco/1BA0D7'
  },
  {
    name: 'Certificate of Completion Mikrotik Dasar',
    issuer: 'ID Networker',
    year: '2024',
    iconUrl: 'https://cdn.simpleicons.org/mikrotik/293239'
  },
  {
    name: 'Certificate of Completion Cisco Dasar',
    issuer: 'ID Networker',
    year: '2023',
    iconUrl: 'https://cdn.simpleicons.org/cisco/1BA0D7'
  },
  {
    name: 'Certificate of Completion Jaringan Komputer Dasar',
    issuer: 'ID Networker',
    year: '2023',
    iconUrl: 'https://cdn.simpleicons.org/wireshark/1679A7'
  },
  {
    name: 'Certificate of Completion Linux Dasar',
    issuer: 'ID Networker',
    year: '2023',
    iconUrl: 'https://cdn.simpleicons.org/linux/FCC624'
  },
  {
    name: 'Certificate Mikrotik Olimpiade',
    issuer: 'Citraweb',
    year: '2022',
    iconUrl: 'https://cdn.simpleicons.org/mikrotik/293239'
  },
  {
    name: 'Certificate of Completion Belajar Back-End Pemula dengan JavaScript',
    issuer: 'Dicoding',
    year: '2022',
    iconUrl: 'https://cdn.simpleicons.org/javascript/F7DF1E'
  },
  {
    name: 'Certificate of Completion Belajar Dasar AI',
    issuer: 'Dicoding',
    year: '2022',
    iconUrl: 'https://cdn.simpleicons.org/tensorflow/FF6F00'
  },
  {
    name: 'Certificate of Completion Belajar Dasar Cloud dan Gen AI di AWS',
    issuer: 'Dicoding',
    year: '2022',
    iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original-wordmark.svg'
  },
]

const TECHSTACK = [
  { name: 'Node.js', iconUrl: 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/nodedotjs.svg', level: 88 },
  { name: 'Laravel', iconUrl: 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/laravel.svg', level: 85 },
  { name: 'MySQL', iconUrl: 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/mysql.svg', level: 86 },
  { name: 'MongoDB', iconUrl: 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/mongodb.svg', level: 80 },
  { name: 'ReactJS', iconUrl: 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/react.svg', level: 90 },
  { name: 'NextJS', iconUrl: 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/nextdotjs.svg', level: 87 },
  { name: 'MikroTik', iconUrl: 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/mikrotik.svg', level: 84 },
  { name: 'UniFi Ubiquiti', iconUrl: 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/ubiquiti.svg', level: 82 },
  { name: 'Ruijie', iconUrl: 'https://cdn.brandfetch.io/idlZtwqbno/theme/dark/logo.svg?c=1bxid64Mup7aczewSAYMX&t=1748782882065', level: 78},
]

const EXPERIENCE = [
  { role: 'IT Staff (Specia Gaming Hall)', company: 'Specia Gaming Hall', period: 'November 2025 - February 2026', points: ['Providing IT support for attendance systems, CCTV, and printers.', 'Managing network infrastructure to maintain stable internet connectivity.', 'Maintaining POS and billing websites.'] },
  {
    role: 'NOC Staff (PT. Pangkalan Lintas Data)', company: 'Self-employed', period: 'February 2026 - May 2026', points: ['Monitoring network traffic.',
      'Configuring devices for customer deployment.', 'Handling customer complaints and analyzing network-related issues.', 'Performing maintenance and troubleshooting for customers.']
  },
]

const VISIONS = [
  'Continuously improving my skills in IT infrastructure, network operations, and software development.',
  'Believing that stable systems and reliable technology play an important role in supporting business and daily operations.',
  'Committed to learning new technologies, adapting to industry changes, and solving technical problems effectively.',
  'Focused on contributing through IT support, network management, and digital solutions that provide real impact.',
]

const SOCIALS = [
  { name: "Let's Connect", sub: 'on LinkedIn', bg: '#0077b5', link: 'https://www.linkedin.com/in/m-reksa-a07ab1314/', iconUrl: 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/linkedin.svg' },
  { name: 'Instagram', sub: '@_rexzz15', bg: '#e1306c', link: 'https://www.instagram.com/_rexzz15', iconUrl: 'https://cdn.simpleicons.org/instagram/ffffff' },
  { name: 'Youtube', sub: 'reksa776', bg: '#ff0000', link: 'https://www.youtube.com/@Reksa776', iconUrl: 'https://cdn.simpleicons.org/youtube/ffffff' },
  { name: 'Github', sub: 'Reksa776', bg: '#24292e', link: 'https://github.com/reksa776', iconUrl: 'https://cdn.simpleicons.org/github/ffffff' },
  { name: 'Tiktok', sub: '@m.reksa', bg: '#010101', link: 'https://www.tiktok.com/@m.reksa', iconUrl: 'https://cdn.simpleicons.org/tiktok/ffffff' },
]

const SAMPLE_COMMENTS = []

// ============================================================
// NAVBAR
// ============================================================
const NAV_ITEMS = ['Home', 'About', 'Portfolio', 'Contact']

function Navbar({ onNav, theme, setTheme }) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [active, setActive] = useState('Home')

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])
  useEffect(() => {
    const sections = NAV_ITEMS.map(item => ({
      id: item,
      el: document.getElementById(item.toLowerCase())
    }))

    const handleScrollSpy = () => {
      const scrollY = window.scrollY + 140

      for (const section of sections) {
        if (!section.el) continue

        const top = section.el.offsetTop
        const height = section.el.offsetHeight

        if (scrollY >= top && scrollY < top + height) {
          setActive(section.id)
        }
      }
    }

    window.addEventListener('scroll', handleScrollSpy)

    handleScrollSpy()

    return () => {
      window.removeEventListener('scroll', handleScrollSpy)
    }
  }, [])

  const go = (s) => {
    setActive(s)
    setMenuOpen(false)

    const el = document.getElementById(s.toLowerCase())

    if (el) {
      window.scrollTo({
        top: el.offsetTop - 90,
        behavior: 'smooth'
      })
    }

    if (onNav) onNav(null)
  }

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '1rem 2rem', backdropFilter: scrolled ? 'blur(20px)' : 'none',
        background: scrolled ? 'rgba(5,2,20,0.9)' : 'transparent',
        borderBottom: scrolled ? '1px solid rgba(124,58,237,0.15)' : 'none', transition: 'all .35s'
      }}>
        <span
          onClick={() => {
            go('Home')
            onNav && onNav(null)
          }}
          style={{
            width: 42,
            height: 42,
            borderRadius: '14px',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            background:
              theme === 'dark'
                ? 'rgba(124,58,237,0.12)'
                : 'rgba(124,58,237,0.08)',
            border:
              theme === 'dark'
                ? '1px solid rgba(124,58,237,0.25)'
                : '1px solid rgba(124,58,237,0.15)',
            backdropFilter: 'blur(10px)',
            boxShadow:
              theme === 'dark'
                ? '0 0 25px rgba(124,58,237,0.18)'
                : '0 10px 25px rgba(124,58,237,0.08)',
            transition: '.25s'
          }}
        >
          <img
            src="./icon/icon.png"
            alt="Logo"
            style={{
              width: '75%',
              height: '75%',
              objectFit: 'contain'
            }}
          />
        </span>

        {/* Desktop nav */}
        <div className="desktop-nav" style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          {NAV_ITEMS.map(s => (
            <a key={s} onClick={() => go(s)}
              className="nav-link"
              style={{ color: active === s ? '#a78bfa' : theme === 'dark' ? '#94a3b8' : '#475569', fontSize: '.88rem', fontWeight: 500, transition: 'color .2s', cursor: 'none', position: 'relative', paddingBottom: '3px', transform: active === s ? 'translateY(-2px)' : 'translateY(0)', }}>
              {s}
              {active === s && (
                <motion.span
                  layoutId="navActiveLine"
                  transition={{
                    type: 'spring',
                    stiffness: 420,
                    damping: 32
                  }}
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: '2px',
                    background: 'linear-gradient(90deg,#7c3aed,#a855f7,#06b6d4)',
                    borderRadius: '999px',
                    boxShadow: '0 0 12px rgba(124,58,237,.7)'
                  }}
                />
              )}
            </a>
          ))}
        </div>
        <button
          className="btn-theme"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          aria-label="Toggle theme"
          style={{
            width: 42,
            height: 42,
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: theme === 'dark'
              ? 'rgba(255,255,255,0.06)'
              : 'rgba(124,58,237,0.08)',
            border: theme === 'dark'
              ? '1px solid rgba(255,255,255,0.12)'
              : '1px solid rgba(124,58,237,0.18)',
            color: theme === 'dark' ? '#f8fafc' : '#7c3aed',
            cursor: 'none',
          }}
        >
          {theme === 'dark' ? (
            <Sun size={18} strokeWidth={2.2} />
          ) : (
            <Moon size={18} strokeWidth={2.2} />
          )}
        </button>
        {/* Mobile hamburger */}
        <button className="mobile-menu" onClick={() => setMenuOpen(m => !m)}
          style={{ background: 'none', border: 'none', color: '#e2e8f0', fontSize: '1.5rem', lineHeight: 1, padding: '4px' }}>
          {menuOpen ? '✕' : '☰'}
        </button>
      </nav>

      {/* Mobile dropdown menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            style={{
              position: 'fixed', top: '56px', left: 0, right: 0, zIndex: 999, background: theme === 'dark' ? 'rgba(10,5,30,0.97)' : 'rgba(255,255,255,0.97)',
              backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(124,58,237,0.2)', padding: '1rem 2rem 1.5rem'
            }}>
            {NAV_ITEMS.map(s => (
              <a key={s} href={`#${s.toLowerCase()}`} onClick={() => go(s)}
                style={{ display: 'block', padding: '.8rem 0', color: active === s ? '#a78bfa' : '#94a3b8', fontWeight: 500, borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: '1rem' }}>
                {s}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

// ============================================================
// PROJECT DETAIL
// ============================================================
function ProjectDetail({ project, onBack, theme }) {
  useEffect(() => window.scrollTo(0, 0), [])
  useScrollReveal()

  return (
    <div
      style={{
        minHeight: '100vh',
        paddingTop: '6rem',
        paddingBottom: '4rem',
        position: 'relative',
        zIndex: 1,
        background: theme === 'dark' ? '#050214' : '#f8fafc',
        color: theme === 'dark' ? '#e2e8f0' : '#0f172a'
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: '10%',
          left: 0,
          width: 500,
          height: 500,
          borderRadius: '50%',
          background: 'radial-gradient(circle,rgba(124,58,237,0.12) 0%,transparent 70%)',
          pointerEvents: 'none'
        }}
      />

      <div className="section-pad" style={{ maxWidth: 1200, margin: '0 auto', padding: '0 2rem' }}>
        <div className="reveal" style={{ display: 'flex', alignItems: 'center', gap: '.75rem', marginBottom: '2.5rem', flexWrap: 'wrap' }}>
          <button
            onClick={onBack}
            className="btn-back"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '.4rem',
              padding: '.45rem 1rem',
              background: theme === 'dark' ? 'rgba(255,255,255,0.05)' : '#ffffff',
              border: theme === 'dark' ? '1px solid rgba(255,255,255,0.15)' : '1px solid rgba(15,23,42,0.08)',
              borderRadius: '8px',
              color: theme === 'dark' ? '#e2e8f0' : '#0f172a',
              fontSize: '.85rem',
              fontWeight: 600,
              transition: 'all .2s',
              boxShadow: theme === 'dark' ? 'none' : '0 10px 25px rgba(15,23,42,0.06)',
              cursor: 'pointer'
            }}
          >
            ← Back
          </button>

          <span style={{ color: theme === 'dark' ? '#475569' : '#64748b', fontSize: '.85rem' }}>Projects</span>
          <span style={{ color: theme === 'dark' ? '#475569' : '#64748b' }}>›</span>
          <span style={{ color: '#7c3aed', fontSize: '.85rem', fontWeight: 500 }}>{project.title}</span>
        </div>

        <div className="detail-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'start' }}>
          <div>
            <div className="reveal">
              <h1
                style={{
                  fontSize: 'clamp(2rem,5vw,3.5rem)',
                  fontWeight: 800,
                  lineHeight: 1.1,
                  marginBottom: '1rem',
                  color: theme === 'dark' ? '#f8fafc' : '#0f172a'
                }}
              >
                {project.title}
              </h1>

              <div
                style={{
                  width: 120,
                  height: 3,
                  background: 'linear-gradient(90deg,#7c3aed,#ec4899)',
                  borderRadius: '2px',
                  marginBottom: '1.8rem'
                }}
              />

              <p
                style={{
                  color: theme === 'dark' ? '#94a3b8' : '#64748b',
                  lineHeight: 1.8,
                  fontSize: '.97rem',
                  marginBottom: '2rem'
                }}
              >
                {project.desc}
              </p>
            </div>

            <div className="reveal" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
              {[
                { icon: '</>', val: project.techCount, label: 'Total Teknologi' },
                { icon: '⬡', val: project.featureCount, label: 'Fitur Utama' }
              ].map(s => (
                <div
                  key={s.label}
                  style={{
                    padding: '1rem 1.2rem',
                    background: theme === 'dark' ? 'rgba(255,255,255,0.04)' : '#ffffff',
                    border: theme === 'dark' ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(15,23,42,0.08)',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '.85rem',
                    boxShadow: theme === 'dark' ? 'none' : '0 10px 25px rgba(15,23,42,0.05)'
                  }}
                >
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: '8px',
                      background: 'rgba(124,58,237,0.16)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1rem',
                      color: '#7c3aed',
                      fontFamily: 'monospace',
                      flexShrink: 0
                    }}
                  >
                    {s.icon}
                  </div>

                  <div>
                    <div
                      style={{
                        fontSize: '1.5rem',
                        fontWeight: 800,
                        lineHeight: 1,
                        color: theme === 'dark' ? '#f8fafc' : '#0f172a'
                      }}
                    >
                      {s.val}
                    </div>
                    <div style={{ fontSize: '.75rem', color: '#64748b', marginTop: '.1rem' }}>{s.label}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="reveal" style={{ display: 'flex', gap: '1rem', marginBottom: '2.5rem', flexWrap: 'wrap' }}>
              {[
                {
                  icon: <HiOutlineExternalLink />,
                  label: 'Live Demo',
                  link: project.link
                },
                {
                  icon: <FaGithub />,
                  label: 'GitHub Repository',
                  link: project.github
                }
              ].map(b => (
                <a
                  key={b.label}
                  href={b.link}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-detail-link"
                  style={{
                    padding: '.75rem 1.6rem',
                    border: theme === 'dark'
                      ? '1px solid rgba(124,58,237,.5)'
                      : '1px solid rgba(124,58,237,.18)',
                    borderRadius: '10px',
                    color: theme === 'dark' ? '#e2e8f0' : '#0f172a',
                    fontSize: '.88rem',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '.5rem',
                    background: theme === 'dark'
                      ? 'rgba(124,58,237,.08)'
                      : 'rgba(124,58,237,.06)',
                    transition: 'all .2s',
                    textDecoration: 'none'
                  }}
                >
                  {b.icon}
                  <span>{b.label}</span>
                </a>
              ))}
            </div>

            <div className="reveal">
              <h3
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '.5rem',
                  fontWeight: 700,
                  fontSize: '1rem',
                  marginBottom: '1rem',
                  color: theme === 'dark' ? '#f8fafc' : '#0f172a'
                }}
              >
                <span style={{ color: '#7c3aed', fontFamily: 'monospace' }}>&lt;/&gt;</span>
                Technologies Used
              </h3>

              <div style={{ display: 'flex', gap: '.65rem', flexWrap: 'wrap' }}>
                {project.tech.map(t => (
                  <span
                    key={t}
                    style={{
                      padding: '.45rem 1rem',
                      background: theme === 'dark' ? 'rgba(124,58,237,0.12)' : 'rgba(124,58,237,0.08)',
                      border: theme === 'dark' ? '1px solid rgba(124,58,237,.3)' : '1px solid rgba(124,58,237,.15)',
                      borderRadius: '8px',
                      fontSize: '.85rem',
                      color: theme === 'dark' ? '#a78bfa' : '#7c3aed',
                      fontWeight: 500,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '.5rem'
                    }}
                  >
                    <span style={{ fontSize: '1rem', display: 'flex', alignItems: 'center' }}>
                      {TECH_ICONS[t] || <SiJavascript />}
                    </span>
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div
              className="reveal-right"
              style={{
                background: theme === 'dark' ? 'rgba(20,12,50,0.8)' : '#ffffff',
                border: theme === 'dark' ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(15,23,42,0.08)',
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: theme === 'dark' ? 'none' : '0 10px 30px rgba(15,23,42,0.06)'
              }}
            >
              <div
                style={{
                  padding: '.7rem 1rem',
                  background: theme === 'dark' ? 'rgba(255,255,255,0.04)' : '#f8fafc',
                  borderBottom: theme === 'dark' ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(15,23,42,0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '.5rem'
                }}
              >
                <div style={{ display: 'flex', gap: '.4rem' }}>
                  {['#ff5f57', '#febc2e', '#28c840'].map(c => (
                    <div key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />
                  ))}
                </div>

                <div
                  style={{
                    flex: 1,
                    margin: '0 .7rem',
                    background: theme === 'dark' ? 'rgba(255,255,255,0.06)' : '#ffffff',
                    border: theme === 'dark' ? 'none' : '1px solid rgba(15,23,42,0.06)',
                    borderRadius: '5px',
                    padding: '.25rem .8rem',
                    fontSize: '.7rem',
                    color: theme === 'dark' ? '#475569' : '#64748b'
                  }}
                >
                  {project.hasDemo ? 'demo.alex.dev' : 'Demo not available'}
                </div>
              </div>

              <div style={{ height: 200, overflow: 'hidden', position: 'relative' }}>
                <img
                  src={project.screenshot}
                  alt={project.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />

                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: theme === 'dark'
                      ? 'rgba(10,5,30,0.35)'
                      : 'rgba(255,255,255,0.12)'
                  }}
                />

                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div
                    style={{
                      textAlign: 'center',
                      background: theme === 'dark' ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.75)',
                      backdropFilter: 'blur(8px)',
                      borderRadius: 12,
                      padding: '10px 18px',
                      border: theme === 'dark' ? '1px solid rgba(255,255,255,0.12)' : '1px solid rgba(15,23,42,0.08)',
                      boxShadow: theme === 'dark' ? 'none' : '0 10px 25px rgba(15,23,42,0.08)'
                    }}
                  >
                    <p style={{ color: theme === 'dark' ? '#94a3b8' : '#475569', fontSize: '.75rem' }}>
                      {project.hasDemo ? '🔗 Live Preview Available' : 'Demo not available'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div
              className="reveal-right"
              style={{
                background: theme === 'dark' ? 'rgba(20,12,50,0.8)' : '#ffffff',
                border: theme === 'dark' ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(15,23,42,0.08)',
                borderRadius: '16px',
                padding: '1.5rem',
                boxShadow: theme === 'dark' ? 'none' : '0 10px 30px rgba(15,23,42,0.06)'
              }}
            >
              <h3
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '.5rem',
                  fontWeight: 700,
                  fontSize: '1rem',
                  marginBottom: '1.2rem',
                  color: theme === 'dark' ? '#f8fafc' : '#0f172a'
                }}
              >
                <span style={{ color: '#f59e0b' }}>★</span>
                Key Features
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '.8rem' }}>
                {project.features.map((f, i) => (
                  <div
                    key={f}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '.8rem',
                      paddingBottom: i < project.features.length - 1 ? '.8rem' : 0,
                      borderBottom: i < project.features.length - 1
                        ? theme === 'dark'
                          ? '1px solid rgba(255,255,255,0.04)'
                          : '1px solid rgba(15,23,42,0.06)'
                        : 'none'
                    }}
                  >
                    <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#7c3aed', flexShrink: 0 }} />

                    <span
                      style={{
                        color: theme === 'dark' ? '#cbd5e1' : '#334155',
                        fontSize: '.9rem'
                      }}
                    >
                      {f}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .detail-grid {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
          }
        }

        @media (max-width: 768px) {
          .section-pad {
            padding: 0 1rem !important;
          }
        }

        @media (max-width: 480px) {
          .detail-grid {
            gap: 1.5rem !important;
          }
        }
      `}</style>
    </div>
  )
}

// ============================================================
// HERO
// ============================================================
function Hero({ theme }) {
  const [typed, setTyped] = useState('')
  const [ri, setRi] = useState(0)
  const roles = ['Network Operation Center', 'IT Support', 'Web Developer', 'Fullstack Developer']
  useEffect(() => {
    let i = 0, del = false, cur = roles[ri]
    const t = setInterval(() => {
      if (!del && i <= cur.length) { setTyped(cur.slice(0, i)); i++ }
      else if (!del && i > cur.length) { del = true }
      else if (del && i > 0) { i--; setTyped(cur.slice(0, i)) }
      else { del = false; const ni = (ri + 1) % roles.length; setRi(ni); cur = roles[ni]; i = 0 }
    }, 80)
    return () => clearInterval(t)
  }, [ri])

  const techs = ['Mikrotik', 'Ruijie', "Unifi Ubiquiti", 'JavaScript', 'PHP', 'Database', 'React js', 'Node.js']

  return (
    <section id="home" className="grid-bg" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden', padding: '6rem 0 4rem' }}>
      <div style={{ position: 'absolute', top: '15%', left: '5%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle,rgba(124,58,237,0.18) 0%,transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '10%', right: '5%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle,rgba(6,182,212,0.1) 0%,transparent 70%)', pointerEvents: 'none' }} />

      <div className="section-pad hero-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'center', zIndex: 1, width: '100%', maxWidth: 1200, margin: '0 auto', padding: '0 2rem' }}>
        <div>
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.12 }}
            transition={{ delay: .1, duration: .55 }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '.5rem', padding: '.4rem 1rem', background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.35)', borderRadius: '999px', marginBottom: '1.5rem' }}>
            <span style={{ fontSize: '.85rem' }}>✦</span>
            <span style={{ color: '#a78bfa', fontSize: '.82rem', fontWeight: 500 }}>Ready to Innovate</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.12 }}
            transition={{ delay: .18, duration: .6 }}
            style={{ fontSize: 'clamp(2.8rem,6vw,5rem)', fontWeight: 800, lineHeight: 1.08, marginBottom: '.2rem' }}>
            IT / Web
          </motion.h1>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.12 }}
            transition={{ delay: .26, duration: .6 }}
            style={{ fontSize: 'clamp(2.8rem,6vw,5rem)', fontWeight: 800, lineHeight: 1.08, color: '#7c3aed', marginBottom: '1rem' }}>
            Developer
          </motion.h1>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: false, amount: 0.12 }}
            transition={{ delay: .34, duration: .5 }}
            style={{ fontSize: '1.1rem', color: '#94a3b8', marginBottom: '1rem', minHeight: '1.8rem', display: 'flex', alignItems: 'center', gap: '.2rem' }}>
            {typed}<span style={{ color: '#7c3aed', animation: 'blink 1s step-end infinite' }}>|</span>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.12 }}
            transition={{ delay: .40, duration: .5 }}
            style={{ color: '#64748b', lineHeight: 1.8, maxWidth: 460, marginBottom: '1.8rem', fontSize: '.92rem' }}>
            {"Experienced in IT Support, Network Operations Center (NOC), and Web & Mobile Application Development"}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.12 }}
            transition={{ delay: .46, duration: .5 }}
            className="hero-techs" style={{ display: 'flex', flexWrap: 'wrap', gap: '.5rem', marginBottom: '1.8rem' }}>
            {techs.map(t => (
              <span key={t} className="tech-badge" style={{ padding: '.45rem .9rem', borderRadius: '999px', fontSize: '.8rem', fontWeight: 500, background: theme === 'dark' ? 'rgba(255,255,255,0.05)' : '#ffffff', border: theme === 'dark' ? '1px solid rgba(255,255,255,0.12)' : '1px solid rgba(15,23,42,0.08)', color: theme === 'dark' ? '#cbd5e1' : '#475569', backdropFilter: 'blur(8px)', }} > {t} </span>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.12 }}
            transition={{ delay: .52, duration: .5 }}
            className="hero-actions" style={{ display: 'flex', gap: '1rem', marginBottom: '1.8rem', flexWrap: 'wrap' }}>
            <a href="#portfolio" className="btn-primary" style={{ padding: '.75rem 1.6rem', background: theme === 'dark' ? '#fff' : '#000000ff', color: theme === 'dark' ? '#0a0520' : '#fff', borderRadius: '10px', fontWeight: 700, fontSize: '.88rem', display: 'flex', alignItems: 'center', gap: '.5rem' }}>
              Projects ↗
            </a>
            <a href="#contact" className="btn-outline" style={{ padding: '.75rem 1.6rem', background: 'rgba(255,255,255,0.00)', border: '1px solid rgba(124,58,237,.5)', color: theme === 'dark' ? '#e2e8f0' : '#0a0520', borderRadius: '10px', fontWeight: 600, fontSize: '.88rem', display: 'flex', alignItems: 'center', gap: '.5rem' }}>
              Contact ✉
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.12 }}
            transition={{ delay: .58, duration: .5 }}
            className="hero-socials"
            style={{ display: "flex", gap: ".75rem" }}
          >
            {[
              { url: "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/github.svg", label: "GitHub", link: "https://github.com/reksa776" },
              { url: "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/linkedin.svg", label: "LinkedIn", link: "https://www.linkedin.com/in/m-reksa-a07ab1314/" },
              { url: "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/instagram.svg", label: "Instagram", link: "https://www.instagram.com/_rexzz15/" },
            ].map((ic, i) => (
              <a
                key={i}
                href={ic.link}
                className="social-icon"
                target='_blank'
                style={{
                  width: 40,
                  height: 40,
                  border: "1px solid rgba(255,255,255,0.14)",
                  borderRadius: "10px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <img
                  src={ic.url}
                  alt={ic.label}
                  style={{
                    width: 18,
                    height: 18,
                    filter: theme === 'dark'
                      ? "brightness(0) invert(1)"
                      : "brightness(0)",
                  }}
                />
              </a>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false, amount: 0.12 }}
          transition={{ delay: .2, duration: .65 }}
          className="hero-illustration" style={{ display: 'flex', justifyContent: 'center' }}>
          <LaptopSVG theme={theme} />
        </motion.div>
      </div>
    </section>
  )
}

// ============================================================
// ABOUT
// ============================================================
function About({ theme }) {
  useScrollReveal()
  return (
    <section id="about" className="grid-bg" style={{ padding: '5rem 0', position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
      <div style={{ position: 'absolute', top: '30%', right: 0, width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle,rgba(6,182,212,0.07) 0%,transparent 70%)', pointerEvents: 'none' }} />
      <div className="section-pad" style={{ maxWidth: 1200, margin: '0 auto', padding: '0 2rem', width: '100%', zIndex: 1 }}>

        <div className="reveal" style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <h2 style={{ fontSize: 'clamp(2rem,4vw,3rem)', fontWeight: 800, color: '#7c3aed', marginBottom: '.5rem' }}>About Me</h2>
          <p style={{ color: '#64748b', fontSize: '.9rem' }}>✦ Managing IT Infrastructure and Building Digital Solutions ✦</p>
        </div>

        <div className="about-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
          {/* Photo — mobile: order 1 */}
          <div className="about-photo reveal-scale" style={{ display: 'flex', justifyContent: 'center', order: 2 }}>
            <div style={{ position: 'relative' }}>
              <div style={{ width: 260, height: 260, borderRadius: '50%', border: '2px solid rgba(124,58,237,.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', background: 'radial-gradient(circle at 50% 100%,rgba(124,58,237,0.3) 0%,rgba(5,2,20,0.8) 60%)' }}>
                <div style={{ textAlign: 'center', color: '#4c1d95' }}>
                  <div style={{ width: 260, height: 260, borderRadius: '50%', border: '2px solid rgba(124,58,237,.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', background: theme === 'dark' ? 'radial-gradient(circle at 50% 100%,rgba(124,58,237,0.3) 0%,rgba(5,2,20,0.8) 60%)' : 'radial-gradient(circle at 50% 100%,rgba(124,58,237,0.15) 0%,#ffffff 60%)' }} > <img src={profil} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%', }} /> </div>
                </div>
              </div>
              <div style={{ position: 'absolute', inset: -28, borderRadius: '50%', background: 'radial-gradient(circle,rgba(124,58,237,0.18) 0%,transparent 70%)', zIndex: -1 }} />
            </div>
          </div>

          {/* Text */}
          <div className="about-text" style={{ order: 1 }}>
            <div className="reveal-left">
              <h3 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#a78bfa', marginBottom: '.2rem' }}>Hello, I'm</h3>
              <h2 style={{ fontSize: 'clamp(1.5rem,3vw,2.2rem)', fontWeight: 800, marginBottom: '1.2rem', lineHeight: 1.2 }}>M. Reksa Maulidan</h2>
              <p style={{ color: '#94a3b8', lineHeight: 1.9, marginBottom: '1rem', fontSize: '.92rem', textAlign: 'justify' }}>
                An IT Support and NOC Staff with experience in maintaining IT infrastructure, monitoring network systems, and developing web & mobile applications. Passionate about technology, problem solving, and continuously improving technical skills to build reliable digital solutions.
              </p>
              <p style={{ color: '#94a3b8', lineHeight: 1.9, marginBottom: '1.8rem', fontSize: '.92rem', textAlign: 'justify' }}>
                Committed to growing professionally, adapting to new technologies, and contributing through innovative and impactful IT solutions.
              </p>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <a href="/cv.pdf" download className="btn-cv" style={{ padding: '.7rem 1.4rem', background: '#7c3aed', color: '#fff', borderRadius: '10px', fontWeight: 600, fontSize: '.85rem', display: 'flex', alignItems: 'center', gap: '.5rem' }}>
                  📄 Download CV
                </a>
                <a href="#portfolio" className="btn-projects" style={{ padding: '.7rem 1.4rem', border: '1px solid rgba(124,58,237,.5)', color: '#a78bfa', borderRadius: '10px', fontWeight: 600, fontSize: '.85rem', display: 'flex', alignItems: 'center', gap: '.5rem' }}>
                  &lt;/&gt; View Projects
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ============================================================
// EXPERIENCE
// ============================================================
function Experience({ theme }) {
  useScrollReveal()
  return (
    <section id="experience" style={{ padding: '5rem 0', position: 'relative' }}>
      <div style={{ position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle,rgba(124,58,237,0.07) 0%,transparent 70%)', pointerEvents: 'none' }} />

      <div className="section-pad" style={{ maxWidth: 900, margin: '0 auto', padding: '0 2rem', zIndex: 1, position: 'relative' }}>
        <div className="reveal" style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{ fontSize: 'clamp(1.8rem,4vw,3rem)', fontWeight: 800, color: '#7c3aed', marginBottom: '.5rem' }}>My Experience</h2>
          <p style={{ color: '#64748b', fontSize: '.88rem' }}>✦ A Exploring the world of IT support, network operations, and digital solutions ✦</p>
        </div>

        {/* Avatar */}
        <div className="reveal-scale" style={{ display: 'flex', justifyContent: 'center', marginBottom: '3rem' }} > <div style={{ width: 160, height: 160, borderRadius: '50%', overflow: 'hidden', border: '2px solid rgba(124,58,237,.3)', background: theme === 'dark' ? 'radial-gradient(circle at 50% 100%,rgba(124,58,237,0.25) 0%,rgba(5,2,20,0.7) 60%)' : '#ffffff', boxShadow: '0 10px 40px rgba(124,58,237,.2)', }} > <img src={profil} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover', }} /> </div> </div>

        {/* Timeline */}
        <div style={{ position: 'relative' }}>
          <div style={{ position: 'absolute', left: 28, top: 0, bottom: 0, width: 2, background: 'linear-gradient(180deg,#7c3aed,rgba(124,58,237,0.1))' }} />
          {EXPERIENCE.map((exp, i) => (
            <div key={i} className="reveal" style={{ display: 'flex', gap: '1.5rem', marginBottom: '2.5rem', transitionDelay: `${i * 0.12}s` }}>
              {/* Icon */}
              <div style={{ flexShrink: 0, width: 58, height: 58, borderRadius: '50%', background: 'rgba(124,58,237,0.12)', border: '2px solid rgba(124,58,237,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1 }}>
                <span style={{ color: '#a78bfa', fontSize: '.95rem', fontFamily: 'monospace' }}>{'<>'}</span>
              </div>
              {/* Card */}
              <div style={{
                flex: 1, background: theme === 'dark'
                  ? 'rgba(20,12,50,0.75)'
                  : '#ffffff', color: theme === 'dark'
                    ? '#e2e8f0'
                    : '#0f172a', border: '1px solid rgba(124,58,237,0.2)', borderRadius: '16px', padding: '1.4rem', backdropFilter: 'blur(8px)'
              }}
                className="exp-card">
                <h3 style={{ color: '#a78bfa', fontWeight: 700, fontSize: '1.05rem', marginBottom: '.2rem' }}>{exp.role}</h3>
                <p style={{ color: '#64748b', fontSize: '.8rem', marginBottom: '1rem' }}>{exp.period}</p>
                <ul style={{ paddingLeft: '1.2rem' }}>
                  {exp.points.map((pt, j) => (
                    <li key={j} style={{ color: '#94a3b8', fontSize: '.87rem', lineHeight: 1.7, marginBottom: '.4rem' }}>{pt}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ============================================================
// VISION & MOTIVATION
// ============================================================
function Vision({ theme }) {
  useScrollReveal()
  return (
    <section style={{ padding: '5rem 0', position: 'relative' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 50%,rgba(124,58,237,0.06) 0%,transparent 70%)', pointerEvents: 'none' }} />
      <div className="section-pad" style={{ maxWidth: 800, margin: '0 auto', padding: '0 2rem', zIndex: 1, position: 'relative' }}>
        <div className="reveal" style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{ fontSize: 'clamp(1.8rem,4vw,2.8rem)', fontWeight: 800, color: '#7c3aed', marginBottom: '.5rem', lineHeight: 1.2 }}>
            My Vision &<br />Motivation
          </h2>
          <p style={{ color: '#64748b', fontSize: '.88rem' }}>Driven by growth, technology, and continuous improvement in the IT industry.</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          {VISIONS.map((v, i) => (
            <div key={i} className="reveal vision-card" style={{
              transitionDelay: `${i * 0.1}s`,
              padding: '1.4rem 1.6rem', background: theme === 'dark'
                ? 'rgba(20,12,50,0.7)'
                : '#ffffff', border: '1px solid rgba(124,58,237,0.15)',
              borderRadius: '14px', backdropFilter: 'blur(8px)'
            }}>
              <p style={{ color: '#e2e8f0', fontWeight: 600, lineHeight: 1.7, fontSize: '.95rem' }}>{v}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ============================================================
// PORTFOLIO
// ============================================================
function Portfolio({ onDetail, theme }) {
  const [tab, setTab] = useState('Projects')
  useScrollReveal()

  return (
    <section id="portfolio" style={{ padding: '5rem 0', position: 'relative', minHeight: '100vh' }}>
      <div className="section-pad" style={{ maxWidth: 1200, margin: '0 auto', padding: '0 2rem', zIndex: 1, position: 'relative' }}>
        <div className="reveal" style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: 'clamp(1.8rem,4vw,3rem)', fontWeight: 800, color: '#7c3aed', marginBottom: '.6rem' }}>Portfolio Showcase</h2>
          <p style={{ color: '#64748b', maxWidth: 560, margin: '0 auto', lineHeight: 1.7, fontSize: '.88rem' }}>
            Explore my journey through projects, certifications, and technical expertise. Each section represents a milestone in my continuous learning path.
          </p>
        </div>

        {/* Tabs */}
        <div className="reveal tabs-bar" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', background: 'rgba(255,255,255,0.03)', borderRadius: '16px', overflow: 'hidden', marginBottom: '2rem', border: '1px solid rgba(124,58,237,0.15)', padding: '6px', gap: '6px' }}>
          {[
            {
              key: 'Projects',
              icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
                </svg>
              )
            },
            {
              key: 'Certificates',
              icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="8" r="6" /><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" />
                </svg>
              )
            },
            {
              key: 'Tech Stack',
              icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="3" />
                  <path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32 1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
                </svg>
              )
            },
          ].map(({ key: t, icon }) => (
            <button key={t} onClick={() => setTab(t)}
              className="tab-btn"
              data-active={tab === t}
              style={{
                padding: '1rem 1.2rem',
                background: tab === t
                  ? 'rgba(124,58,237,0.28)'
                  : 'transparent',
                color: tab === t ? '#e2e8f0' : '#64748b',
                fontWeight: tab === t ? 700 : 500,
                fontSize: '.85rem',
                border: tab === t
                  ? '1px solid rgba(124,58,237,0.45)'
                  : '1px solid transparent',
                borderRadius: '12px',
                transition: 'all .25s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '.55rem',
                letterSpacing: '.01em',
              }}>
              <span style={{ color: tab === t ? '#a78bfa' : 'inherit', display: 'flex', transition: 'color .25s' }}>{icon}</span>
              {t}
            </button>
          ))}
        </div>

        {/* ---- STAGGER CONTAINER VARIANTS ---- */}
        <AnimatePresence mode="wait">
          {tab === 'Projects' && (
            <motion.div key="proj"
              variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: .08 } } }}
              initial="hidden" animate="visible" exit={{ opacity: 0, y: -10, transition: { duration: .2 } }}>
              <div className="portfolio-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1.1rem' }}>
                {PROJECTS.map((p) => (
                  <motion.div key={p.id}
                    className="proj-card"
                    variants={{ hidden: { opacity: 0, y: 32 }, visible: { opacity: 1, y: 0, transition: { duration: .45, ease: [.25, .46, .45, .94] } } }}
                    whileHover={{ y: -6, boxShadow: '0 24px 64px rgba(124,58,237,0.38)', borderColor: 'rgba(124,58,237,0.65)', transition: { duration: .25 } }}
                    style={{
                      background: theme === 'dark' ? 'rgba(16,10,40,0.95)' : '#ffffff',
                      color: theme === 'dark' ? '#e2e8f0' : '#0f172a',
                      border: '1px solid rgba(255,255,255,0.08)', borderRadius: '18px', overflow: 'hidden',
                      backdropFilter: 'blur(8px)', cursor: 'pointer', position: 'relative', display: 'flex', flexDirection: 'column'
                    }}>
                    {/* Top shimmer line on hover */}
                    <div className="proj-card-shimmer" style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', zIndex: 2, background: 'linear-gradient(90deg,transparent,#7c3aed,transparent)' }} />

                    {/* Screenshot thumbnail — full width, ~55% of card */}
                    <div style={{ position: 'relative', width: '100%', height: 200, overflow: 'hidden', flexShrink: 0 }}>
                      <img
                        src={p.screenshot}
                        alt={p.title}
                        className="proj-thumb-img"
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform .5s ease' }}
                      />
                      {/* Dark gradient overlay bottom */}
                      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '60%', background: 'linear-gradient(to top,rgba(16,10,40,0.85),transparent)', pointerEvents: 'none' }} />
                      {/* Demo badge top-right */}
                      {p.hasDemo && (
                        <div style={{ position: 'absolute', top: 10, right: 10, padding: '.22rem .65rem', background: 'rgba(124,58,237,0.85)', borderRadius: '999px', fontSize: '.65rem', fontWeight: 700, color: '#fff', backdropFilter: 'blur(4px)', border: '1px solid rgba(255,255,255,0.2)' }}>
                          LIVE
                        </div>
                      )}
                    </div>

                    {/* Card footer */}
                    <div style={{ padding: '1.1rem 1.2rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '.6rem' }}>
                      <h3 style={{ fontWeight: 800, fontSize: '1rem', lineHeight: 1.3, marginBottom: '.1rem' }}>{p.title}</h3>
                      <p style={{ color: theme === 'dark' ? '#94a3b8' : '#64748b', fontSize: '.78rem', lineHeight: 1.6, flex: 1 }}>{p.shortDesc}</p>

                      {/* Actions — like Timotius: See Project (left) + Details (right) */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '.4rem', paddingTop: '.8rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                        {p.hasDemo ? (
                          <a href={p.link} target="_blank" style={{ display: 'flex', alignItems: 'center', gap: '.35rem', color: '#a78bfa', fontSize: '.78rem', fontWeight: 600, transition: 'color .2s' }}
                            onMouseEnter={e => e.currentTarget.style.color = '#c4b5fd'} onMouseLeave={e => e.currentTarget.style.color = '#a78bfa'}>
                            See Project
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>
                          </a>
                        ) : (
                          <span style={{ color: '#475569', fontSize: '.78rem' }}>Demo Not Available</span>
                        )}
                        <motion.button onClick={() => onDetail(p)}
                          whileHover={{ scale: 1.04 }}
                          style={{ display: 'flex', alignItems: 'center', gap: '.4rem', padding: '.42rem .95rem', background: theme === 'dark' ? 'rgba(255,255,255,0.1)' : '#0f172a', color: theme === 'dark' ? '#e2e8f0' : '#fff', border: 'none', borderRadius: '8px', fontSize: '.78rem', fontWeight: 700, fontFamily: 'inherit', transition: 'background .2s,transform .15s', cursor: 'pointer' }}>
                          Details
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {tab === 'Certificates' && (
            <motion.div key="cert"
              variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: .08 } } }}
              initial="hidden" animate="visible" exit={{ opacity: 0, y: -10, transition: { duration: .2 } }}>
              <div className="portfolio-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1.1rem' }}>
                {CERTS.map((c) => (
                  <motion.div
                    key={c.name}
                    variants={{
                      hidden: { opacity: 0, y: 32 },
                      visible: {
                        opacity: 1,
                        y: 0,
                        transition: {
                          duration: .45,
                          ease: [.25, .46, .45, .94]
                        }
                      }
                    }}
                    whileHover={{
                      y: -8,
                      scale: 1.02,
                      boxShadow:
                        theme === 'dark'
                          ? '0 20px 60px rgba(124,58,237,0.30)'
                          : '0 20px 50px rgba(124,58,237,0.12)',
                      borderColor:
                        theme === 'dark'
                          ? 'rgba(124,58,237,0.65)'
                          : 'rgba(124,58,237,0.25)',
                      transition: { duration: .25 }
                    }}
                    style={{
                      background:
                        theme === 'dark'
                          ? 'rgba(20,12,50,0.85)'
                          : 'rgba(255,255,255,0.85)',

                      color:
                        theme === 'dark'
                          ? '#e2e8f0'
                          : '#0f172a',

                      border:
                        theme === 'dark'
                          ? '1px solid rgba(255,255,255,0.08)'
                          : '1px solid rgba(124,58,237,0.12)',

                      borderRadius: '16px',
                      padding: '1.5rem',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '1rem',
                      backdropFilter: 'blur(12px)',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                  >
                    {/* TOP GLOW */}
                    <div
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '2px',
                        background:
                          theme === 'dark'
                            ? 'linear-gradient(90deg,transparent,#7c3aed,#a855f7,transparent)'
                            : 'linear-gradient(90deg,transparent,#8b5cf6,#c084fc,transparent)'
                      }}
                    />

                    {/* ICON */}
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: '12px',

                        background:
                          theme === 'dark'
                            ? 'rgba(255,255,255,0.08)'
                            : 'rgba(124,58,237,0.08)',

                        border:
                          theme === 'dark'
                            ? '1px solid rgba(255,255,255,0.06)'
                            : '1px solid rgba(124,58,237,0.12)',

                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}
                    >
                      <img
                        src={c.iconUrl}
                        alt={c.name}
                        style={{
                          width: 28,
                          height: 28,
                          objectFit: 'contain'
                        }}
                      />
                    </div>

                    {/* CONTENT */}
                    <div>
                      <h3
                        style={{
                          fontWeight: 700,
                          fontSize: '.9rem',
                          marginBottom: '.25rem',
                          color: theme === 'dark' ? '#f8fafc' : '#111827'
                        }}
                      >
                        {c.name}
                      </h3>

                      <p
                        style={{
                          color: theme === 'dark' ? '#94a3b8' : '#64748b',
                          fontSize: '.76rem'
                        }}
                      >
                        {c.issuer}
                      </p>

                      <span
                        style={{
                          display: 'inline-block',
                          marginTop: '.45rem',
                          padding: '.22rem .65rem',

                          background:
                            theme === 'dark'
                              ? 'rgba(124,58,237,.15)'
                              : 'rgba(124,58,237,.10)',

                          border:
                            theme === 'dark'
                              ? '1px solid rgba(124,58,237,.3)'
                              : '1px solid rgba(124,58,237,.18)',

                          borderRadius: '999px',
                          fontSize: '.68rem',

                          color:
                            theme === 'dark'
                              ? '#c4b5fd'
                              : '#7c3aed',

                          fontWeight: 600
                        }}
                      >
                        {c.year}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {tab === 'Tech Stack' && (
            <motion.div key="tech"
              variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: .06 } } }}
              initial="hidden" animate="visible" exit={{ opacity: 0, y: -10, transition: { duration: .2 } }}>
              <div className="tech-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1rem' }}>
                {TECHSTACK.map((t) => (
                  <motion.div
                    key={t.name}
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: {
                        opacity: 1,
                        y: 0,
                        transition: { duration: 0.4, ease: "easeOut" },
                      },
                    }}
                    whileHover={{
                      y: -6,
                      scale: 1.03,
                      transition: { duration: 0.2 },
                      boxShadow:
                        theme === "dark"
                          ? "0 14px 35px rgba(124,58,237,0.35)"
                          : "0 14px 30px rgba(124,58,237,0.12)",
                    }}
                    style={{
                      background:
                        theme === "dark"
                          ? "linear-gradient(145deg, rgba(15,23,42,0.95), rgba(30,41,59,0.92))"
                          : "#ffffff",
                      border:
                        theme === "dark"
                          ? "1px solid rgba(255,255,255,0.08)"
                          : "1px solid rgba(15,23,42,0.08)",
                      borderRadius: "16px",
                      padding: "1rem",
                      display: "flex",
                      alignItems: "center",
                      gap: ".9rem",
                      backdropFilter: "blur(10px)",
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    {theme === "dark" && (
                      <div
                        style={{
                          position: "absolute",
                          inset: 0,
                          background:
                            "radial-gradient(circle at top right, rgba(124,58,237,0.16), transparent 60%)",
                          pointerEvents: "none",
                        }}
                      />
                    )}

                    <div
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: "14px",
                        background:
                          theme === "dark"
                            ? "rgba(255,255,255,0.05)"
                            : "rgba(124,58,237,0.06)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        border:
                          theme === "dark"
                            ? "1px solid rgba(255,255,255,0.05)"
                            : "1px solid rgba(124,58,237,0.08)",
                        flexShrink: 0,
                      }}
                    >
                      <img
                        src={t.iconUrl}
                        alt={t.name}
                        style={{
                          width: 26,
                          height: 26,
                          objectFit: "contain",
                          filter: theme === "dark"
                            ? "brightness(0) invert(1)"
                            : "none",
                        }}
                      />
                    </div>

                    <span
                      style={{
                        color: theme === "dark" ? "#f1f5f9" : "#0f172a",
                        fontWeight: 600,
                        fontSize: ".95rem",
                        letterSpacing: ".2px",
                        position: "relative",
                        zIndex: 2,
                      }}
                    >
                      {t.name}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}

// ============================================================
// CONTACT
// ============================================================
function Contact({ theme }) {
  useScrollReveal()
  const [form, setForm] = useState({ name: '', email: '', msg: '' })
  const [sent, setSent] = useState(false)
  const [comments, setComments] = useState(SAMPLE_COMMENTS)
  const [cForm, setCForm] = useState({ name: '', msg: '' })
  const [cSent, setCSent] = useState(false)

  useEffect(() => {
    const q = query(
      collection(db, "comments"),
      orderBy("createdAt", "desc")
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));

      setComments(data);
    });

    return () => unsub();
  }, []);

  const sendEmail = async () => {
    if (!form.name || !form.email || !form.msg) return

    try {
      await emailjs.send(
        'service_6pbowx7',
        'template_4by4h7u',
        {
          from_name: form.name,
          from_email: form.email,
          message: form.msg,
        },
        'NKZ9Zhf6GW6CN9CCL'
      )

      setSent(true)

      setForm({
        name: '',
        email: '',
        msg: ''
      })
    } catch (err) {
      console.error(err)
      alert('Failed to send message')
    }
  }

  return (
    <section id="contact" style={{ padding: '5rem 0', position: 'relative' }}>
      <div style={{ position: 'absolute', top: '20%', left: 0, width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle,rgba(124,58,237,0.1) 0%,transparent 70%)', pointerEvents: 'none' }} />
      <div className="section-pad" style={{ maxWidth: 1200, margin: '0 auto', padding: '0 2rem', zIndex: 1, position: 'relative' }}>

        <div className="reveal" style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: 'clamp(1.8rem,4vw,3rem)', fontWeight: 800, color: '#7c3aed', marginBottom: '.5rem' }}>Contact Me</h2>
          <p style={{ color: '#64748b', fontSize: '.88rem' }}>Got a question? Send me a message, and I'll get back to you soon.</p>
        </div>

        <div className="contact-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: '1.5rem', alignItems: 'start' }}>

          {/* LEFT: form + socials */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            <div className="reveal-left" style={{
              background: theme === 'dark'
                ? 'rgba(20,12,50,0.75)'
                : '#ffffff', color: theme === 'dark'
                  ? '#e2e8f0'
                  : '#0f172a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: '1.8rem', backdropFilter: 'blur(10px)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '.8rem' }}>
                <h3 style={{ fontWeight: 700, fontSize: '1.3rem', color: '#a78bfa' }}>Get in Touch</h3>
                <span style={{ color: '#64748b', fontSize: '1.2rem' }}>⟨⟩</span>
              </div>
              <p style={{ color: '#64748b', fontSize: '.82rem', marginBottom: '1.3rem' }}>Have something to discuss? Send me a message and let's talk.</p>

              {sent ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: '#a78bfa' }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: '.6rem' }}>✅</div>
                  <p style={{ fontWeight: 600 }}>Pesan terkirim! Gw akan balas segera.</p>
                </div>
              ) : (<>
                {[['👤', 'text', 'name', 'Your Name'], ['✉', 'email', 'email', 'Your Email']].map(([ic, type, field, ph]) => (
                  <div key={field} style={{ marginBottom: '.9rem', position: 'relative' }}>
                    <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#475569', fontSize: '.85rem' }}>{ic}</span>
                    <input type={type} placeholder={ph} value={form[field]} onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))}
                      style={{ width: '100%', padding: '.75rem 1rem .75rem 2.5rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#e2e8f0', fontSize: '.88rem', outline: 'none', transition: 'border .2s' }}
                      onFocus={e => e.target.style.borderColor = 'rgba(124,58,237,.5)'} onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'} />
                  </div>
                ))}
                <div style={{ marginBottom: '1rem', position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '1rem', top: '.9rem', color: '#475569', fontSize: '.85rem' }}>💬</span>
                  <textarea rows={4} placeholder="Your Message" value={form.msg} onChange={e => setForm(f => ({ ...f, msg: e.target.value }))}
                    style={{ width: '100%', padding: '.75rem 1rem .75rem 2.5rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#e2e8f0', fontSize: '.88rem', outline: 'none', resize: 'vertical', transition: 'border .2s' }}
                    onFocus={e => e.target.style.borderColor = 'rgba(124,58,237,.5)'} onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'} />
                </div>
                <button
                  onClick={sendEmail}
                  className="btn-send"
                  style={{
                    width: '100%',
                    padding: '.85rem',
                    background: 'linear-gradient(135deg,#7c3aed,#a855f7)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '10px',
                    fontWeight: 700,
                    fontSize: '.88rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '.5rem',
                    cursor: 'pointer'
                  }}
                >
                  ✈ Send Message
                </button>
              </>)}
            </div>

            {/* Connect With Me */}
            <div className="reveal-left" style={{
              background: theme === 'dark'
                ? 'rgba(20,12,50,0.75)'
                : '#ffffff', color: theme === 'dark'
                  ? '#e2e8f0'
                  : '#0f172a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: '1.8rem', backdropFilter: 'blur(10px)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '.7rem', marginBottom: '1.2rem' }}>
                <span style={{ fontWeight: 700, fontSize: '.95rem' }}>Connect With Me</span>
                <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg,#7c3aed,transparent)' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '.7rem' }}>
                {SOCIALS.map(s => (
                  <a key={s.name} href={s.link} target='_blank'
                    className="social-link"
                    style={{ display: 'flex', alignItems: 'center', gap: '.9rem', padding: '.75rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px', transition: 'all .2s' }}>
                    <div className="social-icon-box" style={{ width: 36, height: 36, borderRadius: '8px', background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '.9rem', fontWeight: 700, flexShrink: 0 }}>
                      <img src={s.iconUrl} alt={s.name} style={{ width: 20, height: 20 }} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '.88rem' }}>{s.name}</div>
                      <div style={{ color: '#64748b', fontSize: '.75rem' }}>{s.sub}</div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT: comments */}
          <div className="reveal-right" style={{
            background:
              theme === 'dark'
                ? 'rgba(20,12,50,0.75)'
                : '#ffffff', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: '1.8rem', backdropFilter: 'blur(10px)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '.7rem', marginBottom: '1.4rem' }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(124,58,237,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '.9rem' }}>💬</div>
              <h3 style={{ fontWeight: 700, fontSize: '1rem' }}>Comments <span style={{ color: '#7c3aed' }}>({comments.length})</span></h3>
            </div>

            {/* Comment form */}
            <div style={{ marginBottom: '1.4rem' }}>
              {[['Name *', 'text', 'name', 'Enter your name'], ['Message *', 'text', 'msg', 'Write your message here...']].map(([label, type, field, ph]) => (
                <div key={field} style={{ marginBottom: '.8rem' }}>
                  <label style={{ fontSize: '.78rem', color: '#94a3b8', marginBottom: '.35rem', display: 'block' }}>{label} <span style={{ color: '#ef4444' }}>*</span></label>
                  {field === 'msg' ? (
                    <textarea rows={3} placeholder={ph} value={cForm[field]} onChange={e => setCForm(f => ({ ...f, [field]: e.target.value }))}
                      style={{ width: '100%', padding: '.7rem .9rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#e2e8f0', fontSize: '.85rem', outline: 'none', resize: 'none', transition: 'border .2s' }}
                      onFocus={e => e.target.style.borderColor = 'rgba(124,58,237,.5)'} onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'} />
                  ) : (
                    <input type={type} placeholder={ph} value={cForm[field]} onChange={e => setCForm(f => ({ ...f, [field]: e.target.value }))}
                      style={{ width: '100%', padding: '.7rem .9rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#e2e8f0', fontSize: '.85rem', outline: 'none', transition: 'border .2s' }}
                      onFocus={e => e.target.style.borderColor = 'rgba(124,58,237,.5)'} onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'} />
                  )}
                </div>
              ))}

              {/* Profile photo upload placeholder */}
              <div style={{ marginBottom: '.9rem' }}>
                <label style={{ fontSize: '.78rem', color: '#94a3b8', marginBottom: '.35rem', display: 'block' }}>Profile Photo <span style={{ color: '#64748b' }}>(optional)</span></label>
                <div style={{ padding: '.9rem', background: 'rgba(124,58,237,0.08)', border: '1px dashed rgba(124,58,237,.3)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '.6rem', color: '#a78bfa', fontSize: '.82rem', cursor: 'pointer' }}>
                  <span>🖼</span> Choose Profile Photo
                </div>
                <p style={{ color: '#475569', fontSize: '.7rem', marginTop: '.3rem', textAlign: 'center' }}>Max file size: 5MB</p>
              </div>

              <button
                onClick={async () => {
                  if (cForm.name && cForm.msg) {
                    await addDoc(collection(db, "comments"), {
                      name: cForm.name,
                      msg: cForm.msg,
                      photo: "😊",
                      createdAt: serverTimestamp()
                    });

                    setCForm({ name: "", msg: "" });
                    setCSent(true);
                    setTimeout(() => setCSent(false), 3000);
                  }
                }}
                className="btn-comment"
                style={{
                  width: "100%",
                  padding: ".85rem",
                  background: "linear-gradient(135deg,#7c3aed,#a855f7)",
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  fontWeight: 700,
                  fontSize: ".88rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: ".5rem"
                }}
              >
                ✈ Post Comment
              </button>
              {cSent && <p style={{ color: '#a78bfa', fontSize: '.78rem', marginTop: '.5rem', textAlign: 'center' }}>Comment posted! ✓</p>}
            </div>

            {/* Comments list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '.75rem', maxHeight: 300, overflowY: 'auto' }}>
              <AnimatePresence>
                {comments.map((c, i) => (
                  <motion.div key={c.id} initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                    style={{ display: 'flex', gap: '.7rem', padding: '.85rem', background: 'rgba(255,255,255,0.04)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'rgba(124,58,237,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', flexShrink: 0 }}>{c.photo}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem', marginBottom: '.25rem' }}>
                        <span style={{ fontWeight: 600, fontSize: '.82rem' }}>{c.name}</span>
                        <span style={{ color: '#475569', fontSize: '.7rem' }}>{c.time}</span>
                        <span style={{ color: "#475569", fontSize: ".7rem" }}>
                        {c.createdAt?.toDate
                          ? c.createdAt.toDate().toLocaleString("id-ID")
                          : "Baru saja"}
                      </span>
                      </div>
                      <p style={{ color: '#94a3b8', fontSize: '.8rem', lineHeight: 1.6 }}>{c.msg}</p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ============================================================
// FOOTER
// ============================================================
function Footer( theme ) {
  return (
    <footer style={{ padding: '1.5rem 2rem', borderTop: '1px solid rgba(124,58,237,0.15)', textAlign: 'center', color: '#374151', fontSize: '.8rem' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '.45rem',
          flexWrap: 'wrap',
          textAlign: 'center',

          color: theme === 'dark'
            ? '#94a3b8'
            : '#64748b',

          fontSize: '.85rem',
          letterSpacing: '.02em',
          lineHeight: 1.8
        }}
      >
        <span
          style={{
            color: '#7c3aed',
            fontFamily: 'monospace',
            fontWeight: 700
          }}
        >
          &lt;/&gt;
        </span>

        <span>
          Crafted with passion by
        </span>

        <span
          style={{
            fontWeight: 700,
            background: 'linear-gradient(90deg,#7c3aed,#06b6d4)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}
        >
          M. Reksa Maulidan
        </span>

        <span>
          © {new Date().getFullYear()}
        </span>

        <span
          style={{
            color: '#7c3aed',
            fontFamily: 'monospace',
            fontWeight: 700
          }}
        >
          &lt;/&gt;
        </span>
      </div>
    </footer>
  )
}

// ============================================================
// GLOBAL HOVER STYLES
// ============================================================
function HoverStyles() {
  return (
    <style>{`
      /* ── Navbar links ── */
      .nav-link { position: relative; transition: color .2s; }
      .nav-link::after {
        content: '';
        position: absolute;
        bottom: -2px; left: 50%; right: 50%;
        height: 2px;
        background: linear-gradient(90deg, #7c3aed, #a855f7);
        border-radius: 1px;
        transition: left .25s ease, right .25s ease;
      }
      .nav-link:hover { color: #a78bfa !important; }
      .nav-link:hover::after { left: 0; right: 0; }

      /* ── Hero CTA buttons ── */
      .btn-primary {
        position: relative; overflow: hidden;
        transition: transform .22s, box-shadow .22s;
      }
      .btn-primary::before {
        content: '';
        position: absolute; top: 0; left: -75%;
        width: 50%; height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent);
        transform: skewX(-20deg);
        transition: left .5s ease;
      }
      .btn-primary:hover { transform: translateY(-3px); box-shadow: 0 12px 32px rgba(124,58,237,0.45); }
      .btn-primary:hover::before { left: 130%; }

      .btn-outline {
        transition: transform .22s, box-shadow .22s, background .22s, border-color .22s;
      }
      .btn-outline:hover {
        transform: translateY(-3px);
        box-shadow: 0 8px 24px rgba(124,58,237,0.3);
        background: rgba(124,58,237,0.12) !important;
        border-color: rgba(124,58,237,.85) !important;
      }

      /* ── Hero social icons ── */
      .social-icon {
        transition: transform .22s, border-color .22s, color .22s, box-shadow .22s;
      }
      .social-icon:hover {
        transform: translateY(-4px) scale(1.12);
        border-color: rgba(124,58,237,.7) !important;
        color: #a78bfa !important;
        box-shadow: 0 8px 20px rgba(124,58,237,0.35);
      }

      /* ── Hero tech badges ── */
      .tech-badge {
        transition: transform .2s, border-color .2s, color .2s, background .2s, box-shadow .2s;
      }
      .tech-badge:hover {
        transform: translateY(-2px) scale(1.06);
        border-color: rgba(124,58,237,.55) !important;
        color: #c4b5fd !important;
        box-shadow: 0 4px 16px rgba(124,58,237,0.25);
      }

      /* ── About / CV buttons ── */
      .btn-cv {
        position: relative; overflow: hidden;
        transition: transform .22s, box-shadow .22s;
      }
      .btn-cv::before {
        content: '';
        position: absolute; top: 0; left: -75%;
        width: 50%; height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
        transform: skewX(-20deg);
        transition: left .45s ease;
      }
      .btn-cv:hover { transform: translateY(-3px); box-shadow: 0 10px 28px rgba(124,58,237,0.5); }
      .btn-cv:hover::before { left: 130%; }

      .btn-projects {
        transition: transform .22s, box-shadow .22s, background .22s, border-color .22s, color .22s;
      }
      .btn-projects:hover {
        transform: translateY(-3px);
        box-shadow: 0 8px 24px rgba(124,58,237,0.3);
        background: rgba(124,58,237,0.18) !important;
        border-color: rgba(124,58,237,.8) !important;
        color: #c4b5fd !important;
      }

      /* ── Experience cards ── */
      .exp-card {
        transition: transform .25s, box-shadow .25s, border-color .25s;
        border-left: 3px solid transparent !important;
      }
      .exp-card:hover {
        transform: translateX(6px);
        box-shadow: 0 16px 48px rgba(124,58,237,0.2);
        border-left-color: #7c3aed !important;
        border-color: rgba(124,58,237,.45) !important;
      }

      /* ── Vision cards ── */
      .vision-card {
        transition: transform .25s, box-shadow .25s, border-color .25s;
      }
      .vision-card:hover {
        transform: translateY(-4px) scale(1.015);
        box-shadow: 0 14px 40px rgba(124,58,237,0.22);
        border-color: rgba(124,58,237,.45) !important;
      }

      /* ── Portfolio tab buttons ── */
      .tab-btn {
        transition: background .25s, color .25s, box-shadow .25s, border-color .25s;
      }
      .tab-btn:not([data-active="true"]):hover {
        background: rgba(124,58,237,0.12) !important;
        color: #c4b5fd !important;
        border-color: rgba(124,58,237,0.3) !important;
        box-shadow: inset 0 0 20px rgba(124,58,237,0.08);
      }
      .tab-btn:not([data-active="true"]):hover span {
        color: #a78bfa !important;
      }
      .tab-btn[data-active="true"] {
        box-shadow: 0 4px 20px rgba(124,58,237,0.25), inset 0 0 24px rgba(124,58,237,0.1);
      }

      /* ── Project card thumbnail zoom ── */
      .proj-card:hover .proj-thumb-img { transform: scale(1.07); }

      /* ── Project card top shimmer ── */
      .proj-card-shimmer {
        opacity: 0;
        transition: opacity .3s;
      }
      .proj-card:hover .proj-card-shimmer { opacity: 1; }

      /* ── Project card emoji zoom ── */
      .proj-emoji {
        transition: transform .3s ease;
        display: inline-block;
      }
      .proj-card:hover .proj-emoji { transform: scale(1.18) rotate(-4deg); }

      /* ── Tech tag in project cards ── */
      .tech-tag {
        transition: background .2s, border-color .2s, color .2s, transform .2s;
      }
      .tech-tag:hover {
        background: rgba(124,58,237,0.25) !important;
        border-color: rgba(124,58,237,.6) !important;
        color: #c4b5fd !important;
        transform: scale(1.08);
      }

      /* ── Social connect links ── */
      .social-link {
        transition: transform .22s, box-shadow .22s, border-color .22s, background .22s;
        overflow: hidden;
      }
      .social-link:hover {
        transform: translateX(6px);
        box-shadow: 0 6px 20px rgba(0,0,0,0.3);
        border-color: rgba(124,58,237,.4) !important;
        background: rgba(255,255,255,0.08) !important;
      }
      .social-link .social-icon-box {
        transition: transform .22s, box-shadow .22s;
      }
      .social-link:hover .social-icon-box {
        transform: scale(1.1) rotate(-4deg);
        box-shadow: 0 4px 14px rgba(0,0,0,0.35);
      }

      /* ── Send message button ── */
      .btn-send {
        position: relative; overflow: hidden;
        transition: transform .22s, box-shadow .22s;
      }
      .btn-send::before {
        content: '';
        position: absolute; top: 0; left: -75%;
        width: 50%; height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
        transform: skewX(-20deg);
        transition: left .45s ease;
      }
      .btn-send:hover { transform: translateY(-2px); box-shadow: 0 10px 30px rgba(124,58,237,0.5); }
      .btn-send:hover::before { left: 130%; }

      /* ── Post comment button ── */
      .btn-comment {
        transition: transform .22s, box-shadow .22s, filter .22s;
      }
      .btn-comment:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 24px rgba(124,58,237,0.45);
        filter: brightness(1.1);
      }

      /* ── Back button in project detail ── */
      .btn-back {
        transition: transform .22s, box-shadow .22s, background .22s, border-color .22s;
      }
      .btn-back:hover {
        transform: translateX(-4px);
        box-shadow: 0 4px 16px rgba(124,58,237,0.3);
        background: rgba(124,58,237,0.15) !important;
        border-color: rgba(124,58,237,.55) !important;
      }

      /* ── Detail page action links ── */
      .btn-detail-link {
        transition: transform .22s, box-shadow .22s, background .22s, border-color .22s, color .22s;
      }
      .btn-detail-link:hover {
        transform: translateY(-3px);
        box-shadow: 0 10px 28px rgba(124,58,237,0.4);
        background: rgba(124,58,237,0.22) !important;
        border-color: rgba(124,58,237,.8) !important;
        color: #c4b5fd !important;
      }

      /* ── Theme toggle button ── */
      .btn-theme {
        transition: transform .2s, box-shadow .2s, background .2s;
      }
      .btn-theme:hover {
        transform: scale(1.08);
        box-shadow: 0 4px 16px rgba(124,58,237,0.4);
        background: rgba(124,58,237,0.28) !important;
      }

      /* ── Download CV badge / stat items ── */
      .stat-card {
        transition: transform .22s, box-shadow .22s, border-color .22s, background .22s;
      }
      .stat-card:hover {
        transform: translateY(-3px) scale(1.03);
        box-shadow: 0 10px 28px rgba(124,58,237,0.25);
        border-color: rgba(124,58,237,.45) !important;
      }

      /* ── Certificate cards year badge ── */
      .cert-year {
        transition: background .2s, border-color .2s, color .2s;
      }
      .cert-year:hover {
        background: rgba(124,58,237,0.3) !important;
        border-color: rgba(124,58,237,.6) !important;
        color: #c4b5fd !important;
      }

      /* ── Footer ── */
      footer { transition: border-color .3s; }
      footer:hover { border-color: rgba(124,58,237,0.35) !important; }

      /* ── Scrollbar thumb pulse on hover ── */
      ::-webkit-scrollbar-thumb:hover { background: #a855f7; }
    `}</style>
  )
}

// ============================================================
// LOADING SCREEN — taruh di atas App() di App.jsx
// ============================================================
 
function LoadingScreen({ theme, onDone }) {
  const [progress, setProgress] = useState(0)
  const [phase, setPhase] = useState(0) // 0=loading, 1=complete, 2=exit
 
  useEffect(() => {
    // Progress bar simulation
    const steps = [
      { target: 30, duration: 900 },
      { target: 65, duration: 1200 },
      { target: 85, duration: 900 },
      { target: 100, duration: 700 },
    ]
 
    let current = 0
    let currentProgress = 0
 
    const runStep = () => {
      if (current >= steps.length) return
      const step = steps[current]
      const diff = step.target - currentProgress
      const interval = step.duration / diff
      let count = 0
 
      const timer = setInterval(() => {
        count++
        currentProgress++
        setProgress(currentProgress)
        if (count >= diff) {
          clearInterval(timer)
          current++
          if (current < steps.length) {
            setTimeout(runStep, 80)
          } else {
            // Done — show complete state then exit
            setTimeout(() => setPhase(1), 200)
            setTimeout(() => setPhase(2), 900)
            setTimeout(() => onDone(), 1400)
          }
        }
      }, interval)
    }
 
    runStep()
  }, [])
 
  const labels = ['Initializing...', 'Loading assets...', 'Building interface...', 'Almost there...', 'Ready!']
  const labelIndex = progress < 30 ? 0 : progress < 65 ? 1 : progress < 85 ? 2 : progress < 100 ? 3 : 4
 
  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: phase === 2 ? 0 : 1 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        background: '#050214',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      {/* Background blobs */}
      <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle,rgba(124,58,237,0.18) 0%,transparent 65%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-10%', right: '-10%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle,rgba(6,182,212,0.1) 0%,transparent 65%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 800, height: 800, borderRadius: '50%', background: 'radial-gradient(circle,rgba(124,58,237,0.06) 0%,transparent 60%)', pointerEvents: 'none' }} />
 
      {/* Animated grid lines */}
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.06, pointerEvents: 'none' }}>
        <defs>
          <pattern id="ls-grid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#7c3aed" strokeWidth="0.8" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#ls-grid)" />
      </svg>
 
      {/* Orbiting ring */}
      <div style={{ position: 'relative', marginBottom: '2.5rem' }}>
        {/* Outer orbit */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}
          style={{
            position: 'absolute',
            inset: -28,
            borderRadius: '50%',
            border: '1px dashed rgba(124,58,237,0.35)',
          }}
        />
        {/* Inner orbit */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
          style={{
            position: 'absolute',
            inset: -14,
            borderRadius: '50%',
            border: '1px solid rgba(124,58,237,0.2)',
          }}
        />
        {/* Orbit dot */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}
          style={{
            position: 'absolute',
            inset: -28,
            borderRadius: '50%',
          }}
        >
          <div style={{
            position: 'absolute',
            top: -4,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: '#7c3aed',
            boxShadow: '0 0 12px rgba(124,58,237,0.8)',
          }} />
        </motion.div>
 
        {/* Center logo box */}
        <motion.div
          animate={phase === 1 ? { scale: [1, 1.15, 1], boxShadow: ['0 0 30px rgba(124,58,237,0.4)', '0 0 60px rgba(124,58,237,0.7)', '0 0 30px rgba(124,58,237,0.4)'] } : {}}
          transition={{ duration: 0.5 }}
          style={{
            width: 72,
            height: 72,
            borderRadius: '20px',
            background: 'rgba(124,58,237,0.15)',
            border: '1px solid rgba(124,58,237,0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 0 40px rgba(124,58,237,0.25)',
          }}
        >
          <img
            src="./icon/icon.png"
            alt="Logo"
            style={{ width: '65%', height: '65%', objectFit: 'contain' }}
            onError={e => {
              e.target.style.display = 'none'
              e.target.parentNode.innerHTML = '<span style="color:#a78bfa;font-family:monospace;font-size:1.4rem;font-weight:800">&lt;/&gt;</span>'
            }}
          />
        </motion.div>
      </div>
 
      {/* Name */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        style={{ textAlign: 'center', marginBottom: '2.5rem' }}
      >
        <h1 style={{
          fontSize: '1.6rem',
          fontWeight: 800,
          color: '#f8fafc',
          letterSpacing: '-0.02em',
          marginBottom: '0.3rem',
          fontFamily: "'Poppins','Inter',sans-serif",
        }}>
          M. Reksa Maulidan
        </h1>
        <p style={{
          fontSize: '0.82rem',
          color: '#a78bfa',
          fontWeight: 500,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          fontFamily: "'Poppins','Inter',sans-serif",
        }}>
          IT Support · NOC · Web Developer
        </p>
      </motion.div>
 
      {/* Progress bar container */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.5 }}
        style={{ width: 280, marginBottom: '1rem' }}
      >
        {/* Bar track */}
        <div style={{
          width: '100%',
          height: 4,
          background: 'rgba(255,255,255,0.07)',
          borderRadius: 999,
          overflow: 'hidden',
          marginBottom: '0.75rem',
        }}>
          {/* Bar fill */}
          <motion.div
            style={{
              height: '100%',
              borderRadius: 999,
              background: 'linear-gradient(90deg,#7c3aed,#a855f7,#06b6d4)',
              width: `${progress}%`,
              boxShadow: '0 0 12px rgba(124,58,237,0.7)',
            }}
            transition={{ duration: 0.1 }}
          />
        </div>
 
        {/* Label row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{
            fontSize: '0.72rem',
            color: '#64748b',
            fontFamily: 'monospace',
            letterSpacing: '0.04em',
          }}>
            {labels[labelIndex]}
          </span>
          <span style={{
            fontSize: '0.72rem',
            color: '#a78bfa',
            fontFamily: 'monospace',
            fontWeight: 600,
          }}>
            {progress}%
          </span>
        </div>
      </motion.div>
 
      {/* Dot indicators */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        style={{ display: 'flex', gap: '6px', marginTop: '0.5rem' }}
      >
        {[0, 1, 2].map(i => (
          <motion.div
            key={i}
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ repeat: Infinity, duration: 1.2, delay: i * 0.2, ease: 'easeInOut' }}
            style={{
              width: 5,
              height: 5,
              borderRadius: '50%',
              background: '#7c3aed',
            }}
          />
        ))}
      </motion.div>
 
      {/* Bottom tag */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        style={{
          position: 'absolute',
          bottom: '2rem',
          fontSize: '0.72rem',

          color:
            theme === 'dark'
              ? '#64748b'
              : '#475569',

          fontFamily: 'monospace',
          letterSpacing: '0.06em',
          textAlign: 'center'
        }}
      >
        {`© ${new Date().getFullYear()} Reksa — Crafted with passion`}
      </motion.p>
    </motion.div>
  )
}


// ============================================================
// APP
// ============================================================
export default function App() {
  const [theme, setTheme] = useState('dark')
  const [detail, setDetail] = useState(null)
  const [loading, setLoading] = useState(true)   // ← tambah ini
 
  useEffect(() => {
    const timer = setTimeout(() => {
      const els = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale')
      const obs = new IntersectionObserver((entries) => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            e.target.classList.add('visible')
            e.target.classList.remove('hidden')
          } else {
            e.target.classList.remove('visible')
            e.target.classList.add('hidden')
          }
        })
      }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' })
      els.forEach(el => obs.observe(el))
      return () => obs.disconnect()
    }, 100)
    return () => clearTimeout(timer)
  }, [detail])
 
  useEffect(() => {
    document.body.className = theme
  }, [theme])
 
  return (
    <div style={{
      minHeight: '100vh',
      background: theme === 'dark' ? '#050214' : '#f8fafc',
      color: theme === 'dark' ? '#e2e8f0' : '#0f172a',
      fontFamily: "'Poppins','Inter',sans-serif",
      overflowX: 'hidden'
    }}>
      <HoverStyles />
 
      {/* ← Loading screen — muncul duluan, hilang setelah selesai */}
      <AnimatePresence>
        {loading && <LoadingScreen theme={theme} onDone={() => setLoading(false)} />}
      </AnimatePresence>
 
      <Cursor />
      <Particles />
      <Navbar onNav={setDetail} theme={theme} setTheme={setTheme} />
 
      <AnimatePresence mode="wait">
        {detail ? (
          <motion.div key="detail" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'relative', zIndex: 1 }}>
            <ProjectDetail theme={theme} project={detail} onBack={() => setDetail(null)} />
          </motion.div>
        ) : (
          <motion.div key="main" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Hero theme={theme} />
            <About theme={theme} />
            <Experience theme={theme} />
            <Vision theme={theme} />
            <Portfolio onDetail={setDetail} theme={theme} />
            <Contact theme={theme} />
            <Footer theme={theme} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
