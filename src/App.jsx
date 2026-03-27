import { useState, useEffect, useCallback } from 'react'
import './App.css'

/* ===== DATA ===== */
const heroSlides = [
  { src: '/wanted.jpg', alt: 'Godrej Aveline panoramic aerial view' },
  { src: '/want5.jpg', alt: 'Live Beautifully - Airport proximity' },
  { src: '/want1.jpg', alt: 'Dutch-inspired courtyard gardens' },
  { src: '/pool.jpg', alt: 'Rooftop infinity pool' },
]

const configs = [
  { type: '3 BHK + 2T', area: '1,601 sq.ft', price: '₹2.53 Cr', tag: 'Most Popular' },
  { type: '3 BHK + 3T', area: '1,907 sq.ft', price: '₹2.97 Cr', tag: null },
  { type: '3.5 BHK', area: '2,138 sq.ft', price: '₹3.31 Cr', tag: null },
  { type: '4.5 BHK', area: '2,514 sq.ft', price: '₹3.90 Cr', tag: 'Premium' },
]

const amenityCategories = [
  { title: 'Wellness', items: ['Yoga Studio', 'Meditation Zones', 'Fitness Pavilion', 'Gymnasium'], icon: 'icon-yoga' },
  { title: 'Recreation', items: ['Swimming Pool', 'Kids Pool', 'Spa & Salon', 'Golf Simulator'], icon: 'icon-pool' },
  { title: 'Social', items: ['Club Lounge', 'Banquet Hall', 'Amphitheatre', 'Lawn Areas'], icon: 'icon-clubhouse' },
  { title: 'Dining', items: ['Cafe', 'Specialty Restaurants', 'Alfresco Dining'], icon: 'icon-retail' },
  { title: 'Entertainment', items: ['Gaming Area', 'Mini Theatre', 'Indoor Sports', 'Skating Rink'], icon: 'icon-games' },
  { title: 'Kids & Work', items: ['Creche', 'Play Area', 'Co-working Lounge', 'Work Pods'], icon: 'icon-playground' },
]

const galleryImages = [
  { src: '/wanted.jpg', alt: 'Township Aerial View', size: 'large' },
  { src: '/want.jpg', alt: 'Dutch-Inspired Clubhouse' },
  { src: '/want1.jpg', alt: 'Courtyard Gardens' },
  { src: '/want3.jpg', alt: 'Sports & Recreation' },
  { src: '/pool.jpg', alt: 'Rooftop Infinity Pool' },
  { src: '/gym.jpg', alt: 'Outdoor Fitness Zone' },
  { src: '/sport.jpg', alt: 'Multi-Sport Courts' },
  { src: '/playground.jpg', alt: "Children's Play Area" },
  { src: '/want5.jpg', alt: 'Airport Proximity' },
]

const nearbyPlaces = [
  { category: 'Business Hubs', places: [{ name: 'Amazon Office', dist: '800 m' }, { name: 'Ecopolis Tech Park', dist: '1.6 km' }, { name: 'Embassy Business Hub', dist: '2.5 km' }, { name: 'Manyata Tech Park', dist: '10 km' }] },
  { category: 'Education', places: [{ name: 'Canadian International School', dist: '2.5 km' }, { name: 'Ryan International School', dist: '2.5 km' }, { name: 'Vidyashilp Academy', dist: '4.8 km' }, { name: 'REVA University', dist: '5.1 km' }] },
  { category: 'Healthcare', places: [{ name: 'Manipal Hospital', dist: '1 km' }, { name: 'Cytecare Hospital', dist: '1.5 km' }, { name: 'Aster CMI Hospital', dist: '9 km' }, { name: 'Baptist Hospital', dist: '9.3 km' }] },
  { category: 'Lifestyle', places: [{ name: 'Phoenix Mall of Asia', dist: '7.1 km' }, { name: 'RMZ Galleria Mall', dist: '3 km' }, { name: 'Leela Bhartiya City', dist: '8.5 km' }, { name: 'Taj Bangalore', dist: '19 km' }] },
]

function Icon({ name, size = 24, className = '' }) {
  return (
    <svg width={size} height={size} className={`svg-icon ${className}`} aria-hidden="true">
      <use href={`/icons.svg#${name}`} />
    </svg>
  )
}

/* ===== GATED CONTENT MODAL ===== */
function GateModal({ title, onClose, onSubmit }) {
  const [form, setForm] = useState({ name: '', phone: '', email: '' })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(form)
  }

  return (
    <div className="gate-modal-overlay" onClick={onClose}>
      <div className="gate-modal" onClick={(e) => e.stopPropagation()}>
        <button className="gate-modal-close" onClick={onClose} aria-label="Close">
          <Icon name="icon-close" size={22} />
        </button>
        <div className="gate-modal-icon">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0110 0v4" />
          </svg>
        </div>
        <h3>{title}</h3>
        <p>Share your details to unlock this content. We'll also send it to your email.</p>
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="Full Name" required value={form.name} onChange={(e) => setForm(p => ({ ...p, name: e.target.value }))} />
          <input type="tel" placeholder="Phone Number" required value={form.phone} onChange={(e) => setForm(p => ({ ...p, phone: e.target.value }))} />
          <input type="email" placeholder="Email Address" required value={form.email} onChange={(e) => setForm(p => ({ ...p, email: e.target.value }))} />
          <button type="submit" className="gate-modal-submit">
            Unlock Now
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </button>
        </form>
      </div>
    </div>
  )
}

function App() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [scrolled, setScrolled] = useState(false)
  const [showSticky, setShowSticky] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [lightbox, setLightbox] = useState({ open: false, index: 0 })
  const [activeNearby, setActiveNearby] = useState(0)
  const [gateModal, setGateModal] = useState({ open: false, type: '' })
  const [unlocked, setUnlocked] = useState({ masterplan: false, map: false })
  const [brochureForm, setBrochureForm] = useState({ name: '', phone: '', email: '', config: '' })
  const [brochureState, setBrochureState] = useState('idle') // idle | loading | success
  const [exitPopup, setExitPopup] = useState(false)
  const [exitDismissed, setExitDismissed] = useState(false)
  const [brochureLightbox, setBrochureLightbox] = useState({ open: false, index: 0 })
  const [showPrivacy, setShowPrivacy] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => setCurrentSlide(prev => (prev + 1) % heroSlides.length), 5000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80)
      setShowSticky(window.scrollY > 600)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => { entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('visible') }) },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    )
    const elements = document.querySelectorAll('.animate-on-scroll')
    elements.forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    document.body.style.overflow = (menuOpen || lightbox.open || gateModal.open || exitPopup || brochureLightbox.open || showPrivacy) ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen, lightbox.open, gateModal.open, exitPopup, brochureLightbox.open, showPrivacy])

  // Exit intent detection
  useEffect(() => {
    const handleMouseLeave = (e) => {
      if (e.clientY <= 0 && !exitDismissed && brochureState !== 'success') {
        setExitPopup(true)
      }
    }
    document.addEventListener('mouseleave', handleMouseLeave)
    return () => document.removeEventListener('mouseleave', handleMouseLeave)
  }, [exitDismissed, brochureState])

  const scrollToForm = useCallback(() => {
    setMenuOpen(false)
    document.getElementById('lead-form')?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  const scrollToSection = useCallback((id) => {
    setMenuOpen(false)
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  const handleGateSubmit = useCallback((type) => {
    setUnlocked(p => ({ ...p, [type]: true }))
    setGateModal({ open: false, type: '' })
  }, [])

  const handleBrochureDownload = useCallback((e, formData) => {
    e.preventDefault()
    const data = formData || brochureForm
    if (!data.name || !data.phone || !data.email) return
    setBrochureState('loading')
    setTimeout(() => {
      // Download both brochures
      const link1 = document.createElement('a')
      link1.href = '/broucher1.jpeg'
      link1.download = 'Godrej-Aveline-Brochure-1.jpeg'
      link1.click()
      setTimeout(() => {
        const link2 = document.createElement('a')
        link2.href = '/broucher2.jpeg'
        link2.download = 'Godrej-Aveline-Brochure-2.jpeg'
        link2.click()
      }, 500)
      setBrochureState('success')
      setExitPopup(false)
      setExitDismissed(true)
    }, 1500)
  }, [brochureForm])

  const scrollToBrochure = useCallback(() => {
    setMenuOpen(false)
    document.getElementById('brochure')?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  const navLink = (id, label, cls = '') => (
    <a href={`#${id}`} className={cls} onClick={(e) => { e.preventDefault(); id === 'lead-form' ? scrollToForm() : scrollToSection(id) }}>{label}</a>
  )

  return (
    <>
      {/* ===== NAVBAR ===== */}
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="container nav-container">
          <div className="navbar-brand">
            <span className="brand-name">Godrej Aveline</span>
            <span className="brand-tag">Airport Road, Yelahanka</span>
          </div>
          <div className={`navbar-links ${menuOpen ? 'open' : ''}`}>
            {navLink('overview', 'Overview')}
            {navLink('pricing', 'Pricing')}
            {navLink('amenities', 'Amenities')}
            {navLink('gallery', 'Gallery')}
            {navLink('location', 'Location')}
            {navLink('brochure', 'Brochure')}
            <a href="#privacy" onClick={(e) => { e.preventDefault(); setMenuOpen(false); setShowPrivacy(true) }}>Privacy Policy</a>
            {navLink('lead-form', 'Enquire Now', 'navbar-cta')}
          </div>
          <button className={`mobile-toggle ${menuOpen ? 'active' : ''}`} onClick={() => setMenuOpen(p => !p)} aria-label="Toggle menu">
            <span /><span /><span />
          </button>
        </div>
      </nav>
      {menuOpen && <div className="menu-overlay" onClick={() => setMenuOpen(false)} />}

      {/* ===== HERO ===== */}
      <section className="hero" id="hero">
        {heroSlides.map((slide, i) => (
          <div key={i} className={`hero-slide ${i === currentSlide ? 'active' : ''}`}>
            <img src={slide.src} alt={slide.alt} loading={i === 0 ? 'eager' : 'lazy'} />
            <div className="hero-overlay" />
          </div>
        ))}
        <div className="hero-content">
          <div className="hero-rera">
            <span className="dot" />
            RERA Approved &nbsp;|&nbsp; Launching Soon
          </div>
          <h1>Live <em>Beautifully</em> at<br />Godrej Aveline</h1>
          <p className="hero-sub">Premium Residences on Airport Road, Yelahanka</p>
          <div className="hero-buttons">
            <button className="btn btn-primary" onClick={scrollToForm}>
              Book Site Visit
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </button>
            <button className="btn btn-outline" onClick={scrollToForm}>Get Floor Plans</button>
          </div>
          <div className="hero-stats">
            <div className="hero-stat"><strong>10.1</strong><span>Acres</span></div>
            <div className="hero-stat-divider" />
            <div className="hero-stat"><strong>814</strong><span>Units</span></div>
            <div className="hero-stat-divider" />
            <div className="hero-stat"><strong>9</strong><span>Towers</span></div>
            <div className="hero-stat-divider" />
            <div className="hero-stat"><strong>128+</strong><span>Years Legacy</span></div>
          </div>
        </div>
        <div className="hero-indicators">
          {heroSlides.map((_, i) => (
            <span key={i} className={i === currentSlide ? 'active' : ''} onClick={() => setCurrentSlide(i)} />
          ))}
        </div>
        <div className="hero-scroll-hint"><div className="scroll-line" /></div>
      </section>

      {/* ===== DEVELOPER TRUST ===== */}
      <div className="trust-band">
        <div className="container trust-band-inner">
          <div className="trust-badge">
            <strong>Godrej Properties</strong>
            <span>128+ Years of Trust & Excellence</span>
          </div>
          <div className="trust-stats-row">
            <div className="trust-stat"><strong>15+</strong><span>Cities</span></div>
            <div className="trust-stat"><strong>119+</strong><span>Projects</span></div>
            <div className="trust-stat"><strong>~229M</strong><span>Sq.ft Developed</span></div>
            <div className="trust-stat"><strong>#1</strong><span>Developer FY24 & FY25</span></div>
          </div>
        </div>
      </div>

      {/* ===== OVERVIEW ===== */}
      <section className="overview" id="overview">
        <div className="container">
          <div className="overview-content">
            <div className="overview-text animate-on-scroll">
              <span className="section-label">Project Overview</span>
              <h2 className="section-title">Dutch-Inspired Luxury<br />on Airport Road</h2>
              <p className="overview-desc">
                Designed by <strong>UHA London</strong>, Godrej Aveline draws from Dutch architectural traditions
                — clean lines, symmetry, natural light, and human-scale design. Spread across <strong>10.1 acres</strong>,
                the township features 9 architecturally distinct towers rising 3B + G + 15 Floors, surrounded
                by green corridors, water bodies, and curated outdoor spaces.
              </p>
              <div className="overview-features">
                <div className="overview-feat">
                  <Icon name="icon-land" size={22} />
                  <div><strong>10.1 Acres</strong><span>Expansive Land Parcel</span></div>
                </div>
                <div className="overview-feat">
                  <Icon name="icon-units" size={22} />
                  <div><strong>814 Residences</strong><span>3, 3.5 & 4.5 BHK</span></div>
                </div>
                <div className="overview-feat">
                  <Icon name="icon-towers" size={22} />
                  <div><strong>9 Towers</strong><span>3B + G + 15 Floors</span></div>
                </div>
              </div>
              <button className="btn btn-primary" onClick={scrollToForm} style={{ marginTop: '1.5rem' }}>
                Download Brochure
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </button>
            </div>

            {/* ===== GATED MASTER PLAN ===== */}
            <div className="overview-image animate-on-scroll">
              <div className={`gated-content ${unlocked.masterplan ? 'unlocked' : ''}`}>
                <img src="/masterplan.jpg" alt="Godrej Aveline Master Plan" />
                {!unlocked.masterplan && (
                  <div className="gated-lock" onClick={() => setGateModal({ open: true, type: 'masterplan' })}>
                    <div className="gated-lock-icon">
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                        <path d="M7 11V7a5 5 0 0110 0v4" />
                      </svg>
                    </div>
                    <h4>View Master Plan</h4>
                    <p>Share your details to unlock</p>
                    <span className="gated-lock-btn">Unlock Now</span>
                  </div>
                )}
              </div>
              <div className="image-caption">Master Plan — Nature-Integrated Design</div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== PRICING ===== */}
      <section className="pricing" id="pricing">
        <div className="container">
          <div className="animate-on-scroll" style={{ textAlign: 'center' }}>
            <span className="section-label">Configurations & Pricing</span>
            <h2 className="section-title">Choose Your Dream Home</h2>
            <p className="section-subtitle">Spacious layouts with premium finishes, designed for modern families by UHA London.</p>
          </div>
          <div className="pricing-grid">
            {configs.map((c, i) => (
              <div key={i} className="pricing-card animate-on-scroll" style={{ transitionDelay: `${i * 0.1}s` }}>
                {c.tag && <div className="config-tag">{c.tag}</div>}
                <div className="config-type">{c.type}</div>
                <div className="config-area">{c.area}</div>
                <div className="config-price">{c.price}</div>
                <div className="config-price-label">Onwards*</div>
                <button className="config-btn" onClick={scrollToForm}>Get Quote</button>
              </div>
            ))}
          </div>
          <p className="pricing-note">* GST, CAM, PLC & SDR charges extra. Prices subject to change.</p>
        </div>
      </section>

      {/* ===== AMENITIES ===== */}
      <section className="amenities" id="amenities">
        <div className="container">
          <div className="animate-on-scroll" style={{ textAlign: 'center' }}>
            <span className="section-label">World-Class Amenities</span>
            <h2 className="section-title">58+ Lifestyle Experiences</h2>
            <p className="section-subtitle">From a 30,000 sq.ft grand clubhouse to a rooftop infinity pool — every detail curated for extraordinary living.</p>
          </div>
          <div className="amenity-showcase">
            {[
              { img: '/pool.jpg', title: 'Rooftop Infinity Pool', desc: 'Swim above the skyline' },
              { img: '/want.jpg', title: '30,000 sq.ft Clubhouse', desc: 'Dutch-inspired grand clubhouse' },
              { img: '/want3.jpg', title: 'Multi-Sport Arena', desc: 'Tennis, basketball & more' },
              { img: '/gym.jpg', title: 'Fitness Pavilion', desc: 'Outdoor gym & wellness zone' },
            ].map((item, i) => (
              <div key={i} className="amenity-showcase-card animate-on-scroll" style={{ transitionDelay: `${i * 0.1}s` }}>
                <img src={item.img} alt={item.title} loading="lazy" />
                <div className="showcase-info">
                  <h4>{item.title}</h4>
                  <p>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="amenity-categories">
            {amenityCategories.map((cat, i) => (
              <div key={i} className="amenity-cat-card animate-on-scroll" style={{ transitionDelay: `${i * 0.08}s` }}>
                <div className="cat-header">
                  <Icon name={cat.icon} size={24} />
                  <h4>{cat.title}</h4>
                </div>
                <ul>{cat.items.map((item, j) => <li key={j}>{item}</li>)}</ul>
              </div>
            ))}
          </div>
          <div className="amenity-footer animate-on-scroll">
            <div className="amenity-badge">33,000 sq.ft High Street Retail</div>
          </div>
        </div>
      </section>

      {/* ===== GALLERY ===== */}
      <section className="gallery" id="gallery">
        <div className="container">
          <div className="animate-on-scroll" style={{ textAlign: 'center' }}>
            <span className="section-label">Project Gallery</span>
            <h2 className="section-title">Experience the Vision</h2>
            <p className="section-subtitle">Explore the Dutch-inspired architecture, landscaped gardens, and premium lifestyle that awaits you.</p>
          </div>
          <div className="gallery-grid">
            {galleryImages.map((img, i) => (
              <div key={i} className={`gallery-item animate-on-scroll ${img.size === 'large' ? 'gallery-item-large' : ''}`} style={{ transitionDelay: `${i * 0.07}s` }} onClick={() => setLightbox({ open: true, index: i })}>
                <img src={img.src} alt={img.alt} loading="lazy" />
                <div className="gallery-overlay"><span>{img.alt}</span></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {lightbox.open && (
        <div className="lightbox" onClick={() => setLightbox({ open: false, index: 0 })}>
          <button className="lightbox-close" aria-label="Close"><Icon name="icon-close" size={28} /></button>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <img src={galleryImages[lightbox.index].src} alt={galleryImages[lightbox.index].alt} />
            <p className="lightbox-caption">{galleryImages[lightbox.index].alt}</p>
            <div className="lightbox-nav">
              <button onClick={() => setLightbox(p => ({ ...p, index: (p.index - 1 + galleryImages.length) % galleryImages.length }))}>Prev</button>
              <span>{lightbox.index + 1} / {galleryImages.length}</span>
              <button onClick={() => setLightbox(p => ({ ...p, index: (p.index + 1) % galleryImages.length }))}>Next</button>
            </div>
          </div>
        </div>
      )}

      {/* ===== CONNECTIVITY & LOCATION ===== */}
      <section className="connectivity" id="location">
        <div className="container">
          <div className="connectivity-top">
            <div className="connectivity-text animate-on-scroll">
              <span className="section-label">Strategic Location</span>
              <h2 className="section-title">The Heart of<br />North Bengaluru</h2>
              <p className="connectivity-desc">
                Positioned on Airport Road with direct NH-44 access, Godrej Aveline connects you to the airport in 17 km,
                upcoming metro stations in 500 m, and key IT hubs within minutes.
              </p>
            </div>
            <div className="connectivity-cards animate-on-scroll">
              {[
                { icon: 'icon-airport', time: '17 km', label: 'Kempegowda Intl Airport' },
                { icon: 'icon-metro', time: '500 m', label: 'Bagaluru Cross Metro' },
                { icon: 'icon-highway', time: '0.5 km', label: 'NH-44 Bellary Road' },
                { icon: 'icon-ring-road', time: '100 m', label: 'Peripheral Ring Road' },
              ].map((item, i) => (
                <div key={i} className="conn-card" style={{ transitionDelay: `${i * 0.1}s` }}>
                  <div className="conn-icon-wrap"><Icon name={item.icon} size={26} /></div>
                  <div>
                    <div className="conn-time">{item.time}</div>
                    <div className="conn-label">{item.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ===== GATED MAP ===== */}
          <div className="map-section animate-on-scroll">
            <div className={`gated-content gated-map ${unlocked.map ? 'unlocked' : ''}`}>
              {unlocked.map ? (
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3885.5!2d77.5946!3d13.1234!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTPCsDA3JzI0LjIiTiA3N8KwMzUnNDAuNiJF!5e0!3m2!1sen!2sin!4v1"
                  width="100%"
                  height="400"
                  style={{ border: 0, borderRadius: 'var(--radius-lg)' }}
                  allowFullScreen
                  loading="lazy"
                  title="Godrej Aveline Location"
                />
              ) : (
                <div className="map-placeholder">
                  <img src="/want5.jpg" alt="Location area" />
                  <div className="gated-lock" onClick={() => setGateModal({ open: true, type: 'map' })}>
                    <div className="gated-lock-icon">
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                        <path d="M7 11V7a5 5 0 0110 0v4" />
                      </svg>
                    </div>
                    <h4>View Location Map</h4>
                    <p>Share your details to unlock</p>
                    <span className="gated-lock-btn">Unlock Now</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Nearby places tabs */}
          <div className="nearby animate-on-scroll">
            <h3 className="nearby-title">What's Nearby</h3>
            <div className="nearby-tabs">
              {nearbyPlaces.map((cat, i) => (
                <button key={i} className={`nearby-tab ${activeNearby === i ? 'active' : ''}`} onClick={() => setActiveNearby(i)}>{cat.category}</button>
              ))}
            </div>
            <div className="nearby-list">
              {nearbyPlaces[activeNearby].places.map((p, i) => (
                <div key={i} className="nearby-item">
                  <span className="nearby-name">{p.name}</span>
                  <span className="nearby-dist">{p.dist}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== URGENCY BANNER ===== */}
      <section className="urgency-banner">
        <div className="container animate-on-scroll">
          <h2>EOI Window <em>Closing Soon</em></h2>
          <p>Secure your spot at Bangalore's most anticipated address. Limited units available.</p>
          <button className="btn btn-primary urgency-btn" onClick={scrollToForm}>Register Now</button>
        </div>
      </section>

      {/* ===== BROCHURE DOWNLOAD ===== */}
      <section className="brochure" id="brochure">
        <div className="container">
          <div className="brochure-inner">
            <div className="brochure-info animate-on-scroll">
              <span className="section-label">Exclusive Access</span>
              <h2 className="section-title">Get the Exclusive<br />Godrej Aveline Brochure</h2>
              <p className="brochure-desc">
                Discover floor plans, pricing, master plan & lifestyle amenities. Limited access — request now.
              </p>
              <ul className="brochure-features">
                <li>
                  <div className="brochure-check">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
                  </div>
                  Detailed Floor Plans
                </li>
                <li>
                  <div className="brochure-check">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
                  </div>
                  Latest Pricing & Offers
                </li>
                <li>
                  <div className="brochure-check">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
                  </div>
                  Master Layout & Tower Plan
                </li>
                <li>
                  <div className="brochure-check">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
                  </div>
                  Amenities & Lifestyle Features
                </li>
              </ul>
              <div className="brochure-previews">
                <img src="/broucher1.jpeg" alt="Brochure Page 1" onClick={() => setBrochureLightbox({ open: true, index: 0 })} />
                <img src="/broucher2.jpeg" alt="Brochure Page 2" onClick={() => setBrochureLightbox({ open: true, index: 1 })} />
              </div>
            </div>

            <div className="brochure-form-wrap animate-on-scroll">
              {brochureState === 'success' ? (
                <div className="brochure-success">
                  <div className="brochure-success-icon">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><path d="M22 4L12 14.01l-3-3"/></svg>
                  </div>
                  <h3>Brochure Downloaded Successfully!</h3>
                  <p>Check your downloads folder. Our team will contact you shortly.</p>
                  <a
                    href="https://wa.me/919876543210?text=Hi%2C%20I%20just%20downloaded%20the%20Godrej%20Aveline%20brochure.%20Please%20share%20more%20details."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="brochure-wa-link"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                    Get Brochure on WhatsApp
                  </a>
                </div>
              ) : (
                <form onSubmit={(e) => handleBrochureDownload(e)}>
                  <h3 className="brochure-form-title">Download Brochure</h3>
                  <p className="brochure-form-sub">Fill in your details to get instant access</p>
                  <div className="form-group">
                    <label htmlFor="br-name">Full Name</label>
                    <input type="text" id="br-name" placeholder="Enter your name" required value={brochureForm.name} onChange={(e) => setBrochureForm(p => ({ ...p, name: e.target.value }))} />
                  </div>
                  <div className="form-group">
                    <label htmlFor="br-phone">Phone Number</label>
                    <input type="tel" id="br-phone" placeholder="+91 Enter your phone" required value={brochureForm.phone} onChange={(e) => setBrochureForm(p => ({ ...p, phone: e.target.value }))} />
                  </div>
                  <div className="form-group">
                    <label htmlFor="br-email">Email Address</label>
                    <input type="email" id="br-email" placeholder="Enter your email" required value={brochureForm.email} onChange={(e) => setBrochureForm(p => ({ ...p, email: e.target.value }))} />
                  </div>
                  <div className="form-group">
                    <label htmlFor="br-config">Preferred Configuration</label>
                    <select id="br-config" value={brochureForm.config} onChange={(e) => setBrochureForm(p => ({ ...p, config: e.target.value }))}>
                      <option value="">Select configuration</option>
                      <option value="3bhk">3 BHK</option>
                      <option value="3.5bhk">3.5 BHK</option>
                      <option value="4.5bhk">4.5 BHK</option>
                    </select>
                  </div>
                  <button type="submit" className="brochure-submit" disabled={brochureState === 'loading'}>
                    {brochureState === 'loading' ? (
                      <>
                        <span className="brochure-spinner" />
                        Preparing Download...
                      </>
                    ) : (
                      <>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                        Download Brochure
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ===== LEAD FORM ===== */}
      <section className="lead-form" id="lead-form">
        <div className="container">
          <div className="lead-form-inner">
            <div className="form-info animate-on-scroll">
              <span className="section-label">Get In Touch</span>
              <h2 className="section-title">Schedule Your<br />Site Visit</h2>
              <p className="form-desc">Fill in your details and our team will connect with you shortly.</p>
              <div className="form-trust">
                {['RERA Approved Project', 'Free Site Visit & Pickup', 'Instant Callback', 'Best Price Guarantee'].map((t, i) => (
                  <div key={i} className="trust-item">
                    <div className="trust-check">&#10003;</div>
                    <span>{t}</span>
                  </div>
                ))}
              </div>
              <div className="form-rera-info">
                <strong>RERA No:</strong>
                <span>PRM/KA/RERA/1251/309/PR/020326/008501</span>
              </div>
            </div>
            <div className="form-wrapper animate-on-scroll">
              <form onSubmit={(e) => e.preventDefault()}>
                <div className="form-group">
                  <label htmlFor="name">Full Name</label>
                  <input type="text" id="name" placeholder="Enter your name" required />
                </div>
                <div className="form-group">
                  <label htmlFor="phone">Phone Number</label>
                  <input type="tel" id="phone" placeholder="+91 Enter your phone" required />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input type="email" id="email" placeholder="Enter your email" required />
                </div>
                <div className="form-group">
                  <label htmlFor="config">Configuration</label>
                  <select id="config" required>
                    <option value="">Select configuration</option>
                    <option value="3bhk-2t">3 BHK + 2T — 1,601 sq.ft — ₹2.53 Cr</option>
                    <option value="3bhk-3t">3 BHK + 3T — 1,907 sq.ft — ₹2.97 Cr</option>
                    <option value="3.5bhk">3.5 BHK — 2,138 sq.ft — ₹3.31 Cr</option>
                    <option value="4.5bhk">4.5 BHK — 2,514 sq.ft — ₹3.90 Cr</option>
                  </select>
                </div>
                <button type="submit" className="form-submit">
                  Schedule a Visit
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="footer">
        <div className="container">
          <div className="footer-inner">
            <div className="footer-brand">
              <div className="brand-name">Godrej Aveline</div>
              <p>Venkatal Village, Yelahanka Hobli</p>
              <p>Bengaluru North, Karnataka — 560064</p>
            </div>
            <div className="footer-links">
              {navLink('overview', 'Overview')}
              {navLink('pricing', 'Pricing')}
              {navLink('amenities', 'Amenities')}
              {navLink('gallery', 'Gallery')}
              {navLink('location', 'Location')}
            </div>
          </div>
          <div className="divider" />
          <div className="footer-bottom">
            <p>&copy; 2026 Godrej Properties Limited. All rights reserved.</p>
            <div className="footer-bottom-links">
              <a href="#privacy" onClick={(e) => { e.preventDefault(); setShowPrivacy(true) }}>Privacy Policy</a>
              <span>|</span>
              <p>RERA No: PRM/KA/RERA/1251/309/PR/020326/008501</p>
            </div>
          </div>
          <p className="footer-disclaimer">
            Disclaimer: This is not an official offering. Content is for informational purposes only.
            The project is being developed by Godrej Properties Limited. Images are artist impressions.
          </p>
        </div>
      </footer>

      {/* ===== GATE MODAL ===== */}
      {gateModal.open && (
        <GateModal
          title={gateModal.type === 'masterplan' ? 'Unlock Master Plan' : 'Unlock Location Map'}
          onClose={() => setGateModal({ open: false, type: '' })}
          onSubmit={() => handleGateSubmit(gateModal.type)}
        />
      )}

      {/* ===== EXIT INTENT POPUP ===== */}
      {exitPopup && (
        <div className="exit-popup-overlay" onClick={() => { setExitPopup(false); setExitDismissed(true) }}>
          <div className="exit-popup" onClick={(e) => e.stopPropagation()}>
            <button className="exit-popup-close" onClick={() => { setExitPopup(false); setExitDismissed(true) }} aria-label="Close">
              <Icon name="icon-close" size={22} />
            </button>
            <div className="exit-popup-content">
              <div className="exit-popup-icon">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              </div>
              <h3>Wait! Don't Miss Out</h3>
              <p>Download the exclusive Godrej Aveline brochure before you leave — floor plans, pricing & more.</p>
              <form onSubmit={(e) => {
                e.preventDefault()
                const fd = new FormData(e.target)
                const data = { name: fd.get('name'), phone: fd.get('phone'), email: fd.get('email'), config: '' }
                setBrochureForm(data)
                handleBrochureDownload(e, data)
              }}>
                <input type="text" name="name" placeholder="Full Name" required />
                <input type="tel" name="phone" placeholder="Phone Number" required />
                <input type="email" name="email" placeholder="Email Address" required />
                <button type="submit" className="exit-popup-submit" disabled={brochureState === 'loading'}>
                  {brochureState === 'loading' ? (
                    <><span className="brochure-spinner" /> Preparing...</>
                  ) : (
                    <>Download Brochure Now</>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ===== BROCHURE LIGHTBOX ===== */}
      {brochureLightbox.open && (
        <div className="lightbox" onClick={() => setBrochureLightbox({ open: false, index: 0 })}>
          <button className="lightbox-close" aria-label="Close"><Icon name="icon-close" size={28} /></button>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <img src={brochureLightbox.index === 0 ? '/broucher1.jpeg' : '/broucher2.jpeg'} alt={`Brochure Page ${brochureLightbox.index + 1}`} />
            <p className="lightbox-caption">Godrej Aveline Brochure — Page {brochureLightbox.index + 1}</p>
            <div className="lightbox-nav">
              <button onClick={() => setBrochureLightbox(p => ({ ...p, index: p.index === 0 ? 1 : 0 }))}>Prev</button>
              <span>{brochureLightbox.index + 1} / 2</span>
              <button onClick={() => setBrochureLightbox(p => ({ ...p, index: p.index === 0 ? 1 : 0 }))}>Next</button>
            </div>
          </div>
        </div>
      )}

      {/* ===== PRIVACY POLICY MODAL ===== */}
      {showPrivacy && (
        <div className="privacy-overlay" onClick={() => setShowPrivacy(false)}>
          <div className="privacy-modal" onClick={(e) => e.stopPropagation()}>
            <button className="privacy-close" onClick={() => setShowPrivacy(false)} aria-label="Close">
              <Icon name="icon-close" size={22} />
            </button>
            <div className="privacy-content">
              <h2>Privacy Policy</h2>
              <p className="privacy-updated">Last Updated: March 2026</p>

              <h3>1. Information We Collect</h3>
              <p>When you interact with the Godrej Aveline website, we may collect the following personal information:</p>
              <ul>
                <li><strong>Contact Information:</strong> Full name, phone number, and email address provided through our enquiry forms, brochure download forms, and lead capture forms.</li>
                <li><strong>Preference Data:</strong> Your preferred apartment configuration (3 BHK, 3.5 BHK, 4.5 BHK) and site visit scheduling preferences.</li>
                <li><strong>Usage Data:</strong> Browser type, device information, pages visited, time spent on pages, and interaction patterns collected automatically through cookies and analytics tools.</li>
              </ul>

              <h3>2. How We Use Your Information</h3>
              <p>Your personal information is used for the following purposes:</p>
              <ul>
                <li>To respond to your enquiries and schedule site visits.</li>
                <li>To share project brochures, floor plans, pricing, and other requested materials.</li>
                <li>To provide updates about Godrej Aveline, including construction progress, new offers, and launch events.</li>
                <li>To connect you with our authorized sales team for personalized assistance.</li>
                <li>To improve our website experience and marketing communications.</li>
              </ul>

              <h3>3. Information Sharing</h3>
              <p>We do not sell your personal information. We may share your data with:</p>
              <ul>
                <li><strong>Godrej Properties Limited:</strong> As the project developer, for sales and customer relationship management.</li>
                <li><strong>Authorized Channel Partners:</strong> Verified real estate agents assisting with the sales process.</li>
                <li><strong>Service Providers:</strong> Third-party tools for CRM, email communications, and analytics — bound by data protection agreements.</li>
                <li><strong>Legal Requirements:</strong> When required by law, regulation, or legal proceedings.</li>
              </ul>

              <h3>4. Data Security</h3>
              <p>We implement industry-standard security measures including SSL encryption, secure data storage, and access controls to protect your personal information from unauthorized access, alteration, or disclosure.</p>

              <h3>5. Cookies</h3>
              <p>Our website uses cookies and similar tracking technologies to enhance user experience and gather analytics data. You can manage cookie preferences through your browser settings. Disabling cookies may affect certain website functionalities.</p>

              <h3>6. Your Rights</h3>
              <p>You have the right to:</p>
              <ul>
                <li>Access the personal data we hold about you.</li>
                <li>Request correction of inaccurate information.</li>
                <li>Request deletion of your personal data.</li>
                <li>Opt out of marketing communications at any time.</li>
                <li>Withdraw consent for data processing.</li>
              </ul>

              <h3>7. Data Retention</h3>
              <p>We retain your personal information for as long as necessary to fulfill the purposes outlined in this policy, or as required by law. If you request deletion, we will remove your data within 30 business days, except where retention is required by legal obligations.</p>

              <h3>8. Third-Party Links</h3>
              <p>Our website may contain links to external websites (e.g., WhatsApp, Google Maps). We are not responsible for the privacy practices of these third-party services. We encourage you to review their respective privacy policies.</p>

              <h3>9. Contact Us</h3>
              <p>For any privacy-related concerns or requests, please contact:</p>
              <p><strong>Godrej Properties Limited</strong><br />
              Godrej One, 5th Floor, Pirojshanagar<br />
              Eastern Express Highway, Vikhroli East<br />
              Mumbai — 400079, Maharashtra<br />
              Email: privacy@godrejproperties.com</p>

              <h3>10. Updates to This Policy</h3>
              <p>We may update this Privacy Policy periodically. Changes will be posted on this page with a revised "Last Updated" date. Continued use of the website after changes constitutes acceptance of the updated policy.</p>
            </div>
          </div>
        </div>
      )}

      {/* ===== FLOATING BUTTONS ===== */}
      <div className={`floating-buttons ${showSticky ? 'visible' : ''}`}>
        {/* WhatsApp */}
        <a
          href="https://wa.me/919876543210?text=Hi%2C%20I%27m%20interested%20in%20Godrej%20Aveline.%20Please%20share%20more%20details."
          target="_blank"
          rel="noopener noreferrer"
          className="whatsapp-btn"
          aria-label="Chat on WhatsApp"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
        </a>
        {/* Download Brochure */}
        <button className="sticky-cta-btn sticky-brochure-btn" onClick={scrollToBrochure}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          Download Brochure
        </button>
        {/* Book a Visit */}
        <button className="sticky-cta-btn" onClick={scrollToForm}>
          <Icon name="icon-phone" size={18} />
          Book a Visit
        </button>
      </div>
    </>
  )
}

export default App
