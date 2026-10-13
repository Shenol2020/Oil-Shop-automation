import React, { useState, useEffect, useRef } from 'react';
import { ShoppingCart, Check, Eye, Volume2, Play, Pause, Sparkles, Gauge, ArrowDown, X } from 'lucide-react';
import { useCartStore } from '../../../store/cartStore';
import { productsApi } from '../../../services/posApi';
import type { Product } from '../../../types';
import { OilBottle3DExperience } from '../components/OilBottle3DExperience';

export const CatalogPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [addedToast, setAddedToast] = useState<string | null>(null);
  const [scrollY, setScrollY] = useState(0);

  // Audio / Sound state for "Play" engine acoustics
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscNodesRef = useRef<OscillatorNode[]>([]);
  const gainNodeRef = useRef<GainNode | null>(null);

  // Modal states
  const [showSpecialistModal, setShowSpecialistModal] = useState(false);
  const [showSpecsModal, setShowSpecsModal] = useState(false);
  const [selectedProductDetails, setSelectedProductDetails] = useState<Product | null>(null);

  // Specialist quiz state
  const [vehicleType, setVehicleType] = useState<'sedan' | 'euro' | 'diesel' | 'hybrid'>('sedan');

  const { addToCart } = useCartStore();

  useEffect(() => {
    let isMounted = true;
    const fetchCatalog = async () => {
      setLoading(true);
      try {
        const res = await fetch('http://localhost:8081/api/products/all');
        if (res.ok) {
          const data = await res.json();
          if (isMounted && Array.isArray(data) && data.length > 0) {
            setProducts(data);
            setLoading(false);
            return;
          }
        }
      } catch (err) {
        console.warn('Backend unavailable, loading local catalog cache', err);
      }

      // Fallback to posApi products cache
      try {
        const fallbackRes = await productsApi.getAll();
        const fallback = fallbackRes.data || [];
        if (isMounted) {
          setProducts(
            fallback.map((p: any) => ({
              pID: p.pID || p.id,
              p_name: p.p_name || p.name,
              categoryID: p.categoryID || 1,
              price: p.price,
              current_stock_quantity: p.stockQuantity ?? p.current_stock_quantity ?? 10,
              description: p.description,
            }))
          );
        }
      } catch {
        // graceful handle
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchCatalog();
    return () => {
      isMounted = false;
      stopEngineAudio();
    };
  }, []);

  // Track window scroll for real-time text parallax & animations
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Web Audio API engine sound synthesis
  const toggleEngineAudio = () => {
    if (isPlayingAudio) {
      stopEngineAudio();
    } else {
      playEngineAudio();
    }
  };

  const playEngineAudio = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      audioContextRef.current = ctx;

      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.08, ctx.currentTime);
      masterGain.connect(ctx.destination);
      gainNodeRef.current = masterGain;

      // Create engine cylinder tone harmonics
      const baseFreq = 58; // Idle rumble
      const harmonicFreqs = [baseFreq, baseFreq * 1.5, baseFreq * 2.2, baseFreq * 3.4];
      const oscs: OscillatorNode[] = [];

      harmonicFreqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const subGain = ctx.createGain();
        osc.type = idx % 2 === 0 ? 'sawtooth' : 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);

        // Smooth subtle throttle modulation
        const now = ctx.currentTime;
        osc.frequency.linearRampToValueAtTime(freq * 1.7, now + 1.2);
        osc.frequency.linearRampToValueAtTime(freq * 1.1, now + 2.5);
        osc.frequency.linearRampToValueAtTime(freq * 2.2, now + 4.0);
        osc.frequency.linearRampToValueAtTime(freq, now + 5.5);

        subGain.gain.setValueAtTime(0.2 / (idx + 1), ctx.currentTime);
        osc.connect(subGain);
        subGain.connect(masterGain);
        osc.start();
        oscs.push(osc);
      });

      oscNodesRef.current = oscs;
      setIsPlayingAudio(true);

      // Automatically fade out after 6 seconds
      setTimeout(() => {
        stopEngineAudio();
      }, 6000);
    } catch (e) {
      console.warn('Audio synthesis not permitted without user gesture', e);
    }
  };

  const stopEngineAudio = () => {
    if (audioContextRef.current) {
      oscNodesRef.current.forEach((osc) => {
        try {
          osc.stop();
          osc.disconnect();
        } catch { }
      });
      oscNodesRef.current = [];
      try {
        audioContextRef.current.close();
      } catch { }
      audioContextRef.current = null;
    }
    setIsPlayingAudio(false);
  };

  const handleAddToCart = (prod: Product, e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(prod, 1);
    setAddedToast(prod.p_name);
    setTimeout(() => setAddedToast(null), 2800);
  };

  const categories = ['ALL', 'Engine Oil', 'Gear Oil', 'Coolants', 'Filters', 'Additives'];

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.p_name.toLowerCase().includes(search.toLowerCase());
    if (selectedCategory === 'ALL') return matchesSearch;
    const catLower = selectedCategory.toLowerCase();
    const prodName = p.p_name.toLowerCase();
    if (catLower === 'engine oil') return matchesSearch && (prodName.includes('engine') || prodName.includes('oil') || prodName.includes('5w') || prodName.includes('10w') || prodName.includes('synth'));
    if (catLower === 'gear oil') return matchesSearch && (prodName.includes('gear') || prodName.includes('trans') || prodName.includes('75w') || prodName.includes('80w'));
    if (catLower === 'coolants') return matchesSearch && (prodName.includes('cool') || prodName.includes('antifreeze') || prodName.includes('rad'));
    if (catLower === 'filters') return matchesSearch && (prodName.includes('filter') || prodName.includes('element'));
    if (catLower === 'additives') return matchesSearch && (prodName.includes('additive') || prodName.includes('treatment') || prodName.includes('flush'));
    return matchesSearch;
  });

  const getProductImage = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes('gear') || n.includes('trans') || n.includes('75w')) {
      return '/gear_oil.jpg';
    }
    if (n.includes('4l') || n.includes('can') || n.includes('drum') || n.includes('diesel')) {
      return '/synthetic_4l.jpg';
    }
    return '/hero_oil_can.jpg';
  };

  const specialistRecommendations = {
    sedan: {
      oil: 'DOC Titanium 5W-30 Full Synthetic',
      code: 'API SP / ILSAC GF-6A',
      desc: 'Optimized for modern petrol engines, VVT systems, and turbocharged direct injection. Maximum fuel economy and deposit protection.',
      price: 'Rs. 14,800.00',
    },
    euro: {
      oil: 'DOC Apex GT 5W-40 Synthetic',
      code: 'ACEA A3/B4 / MB 229.5',
      desc: 'High HTHS shear protection tailored for European performance turbo engines (BMW, Mercedes, Audi, VW).',
      price: 'Rs. 16,500.00',
    },
    diesel: {
      oil: 'DOC Heavy Duty 15W-40 CI-4/SL',
      code: 'API CI-4 Plus / ACEA E7',
      desc: 'Soot handling formula for turbo diesels, common-rail pickups, and heavy commercial fleet duty cycles.',
      price: 'Rs. 12,200.00',
    },
    hybrid: {
      oil: 'DOC Eco-Syn 0W-20 Ultra Low Viscosity',
      code: 'API SP Resource Conserving',
      desc: 'Ultra-thin fluid dynamics engineered for frequent start-stop engine cycles in modern hybrid vehicles.',
      price: 'Rs. 15,200.00',
    },
  };

  // Cinematic Scroll Animation: Extended runway where text gets bigger, fades, and vanishes
  const scrollThreshold = 750; // Extended scroll period for comfortable, cinematic viewing
  const zoomProgress = Math.min(1, Math.max(0, scrollY / scrollThreshold));
  const textScale = 1 + zoomProgress * 0.65; // Expands / gets noticeably larger as you scroll!
  const fadeProgress = Math.min(1, Math.max(0, (scrollY - 100) / (scrollThreshold - 100)));
  const textOpacity = Math.max(0, 1 - Math.pow(fadeProgress, 1.25)); // Smooth cinematic fade out
  const textTranslateY = -scrollY * 0.18; // Graceful upward drift
  const textBlur = Math.max(0, fadeProgress * 12); // Deep optical blur as it expands and vanishes

  return (
    <div style={{ backgroundColor: '#07080B', color: '#F8FAFC', minHeight: '100vh', position: 'relative' }}>
      {/* PERSISTENT 3D BOTTLE EXPERIENCE (TRANSITIONS TO BACKGROUND OF CATALOG) */}
      <OilBottle3DExperience />

      {/* Toast Notification */}
      {addedToast && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            backgroundColor: '#F59E0B',
            color: '#07080B',
            padding: '0.85rem 1.35rem',
            borderRadius: '9999px',
            boxShadow: '0 10px 30px rgba(245, 158, 11, 0.4)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            zIndex: 1000,
            fontSize: '0.875rem',
            fontWeight: 800,
            animation: 'fadeIn 0.2s ease-out',
          }}
        >
          <Check size={18} strokeWidth={3} />
          <span>Added "{addedToast}" to your order!</span>
        </div>
      )}

      {/* ======================================================== */}
      {/* HERO SECTION WITH EXTENDED STICKY SCROLL RUNWAY */}
      {/* ======================================================== */}
      <div
        style={{
          position: 'relative',
          height: '185vh', // Extended scroll runway so the zoom-larger & fade animation is smooth & majestic
        }}
      >
        <section
          style={{
            position: 'sticky',
            top: 0,
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            padding: '2rem 3rem',
            background: 'radial-gradient(ellipse at 50% 50%, rgba(245, 158, 11, 0.12) 0%, rgba(180, 83, 9, 0.04) 40%, transparent 75%)',
            zIndex: 5,
          }}
        >
          {/* Subtle grid and ambient backdrop light */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: 'radial-gradient(rgba(245, 158, 11, 0.04) 1px, transparent 1px)',
              backgroundSize: '40px 40px',
              pointerEvents: 'none',
              opacity: 0.7,
            }}
          />

          {/* Outer Hero Container */}
          <div
            style={{
              width: '100%',
              maxWidth: '1440px',
              display: 'grid',
              gridTemplateColumns: 'minmax(360px, 1.2fr) minmax(340px, 1fr) minmax(320px, 1fr)',
              alignItems: 'center',
              position: 'relative',
              zIndex: 10,
              gap: '2.5rem',
            }}
          >
            {/* LEFT COLUMN: 01/07 & Main Heading (Zooms bigger, fades and vanishes on scroll) */}
            <div
              style={{
                position: 'relative',
                paddingLeft: '3.5rem',
                transform: `translate3d(0, ${textTranslateY}px, 0) scale(${textScale})`,
                opacity: textOpacity,
                filter: `blur(${textBlur}px)`,
                transformOrigin: 'left center',
                transition: 'transform 0.05s ease-out, opacity 0.05s ease-out',
                pointerEvents: textOpacity < 0.1 ? 'none' : 'auto',
              }}
            >
              {/* Left Vertical Bar & Tracker like Reference */}
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  bottom: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#F59E0B', fontFamily: 'monospace', letterSpacing: '0.05em' }}>
                  01
                </div>
                <div style={{ fontSize: '0.65rem', color: '#64748B', fontFamily: 'monospace', margin: '2px 0 6px 0' }}>
                  / 07
                </div>
                {/* Vertical line with dashed marker */}
                <div
                  style={{
                    width: '1px',
                    flex: 1,
                    background: 'linear-gradient(to bottom, #F59E0B 0%, rgba(245, 158, 11, 0.2) 60%, transparent 100%)',
                    margin: '4px 0',
                  }}
                />
                {/* Rotated text tag */}
                <div
                  style={{
                    writingMode: 'vertical-rl',
                    transform: 'rotate(180deg)',
                    fontSize: '0.58rem',
                    letterSpacing: '0.25em',
                    color: '#64748B',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    paddingTop: '0.75rem',
                  }}
                >
                  THE FORMULA
                </div>
              </div>

              {/* Overline Subtitle */}
              <div
                className="anim-text-reveal-1"
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  letterSpacing: '0.22em',
                  color: '#CBD5E1',
                  textTransform: 'uppercase',
                  marginBottom: '1.25rem',
                }}
              >
                TITANIUM FULL SYNTHETIC MOTOR OIL
              </div>

              {/* Huge Clean Sans Headline matching Reference Design */}
              <h1
                className="hero-large-headline anim-text-reveal-2"
                style={{
                  fontFamily: "'Space Grotesk', -apple-system, sans-serif",
                  fontSize: 'clamp(3.8rem, 5.8vw, 5.2rem)',
                  fontWeight: 400,
                  lineHeight: 1.02,
                  letterSpacing: '-0.035em',
                  color: '#FFFFFF',
                  margin: '0 0 1.75rem 0',
                  cursor: 'default',
                  display: 'block',
                }}
              >
                A world
                <br />
                within.
              </h1>

              {/* Description matching Reference text structure */}
              <p
                className="anim-text-reveal-3"
                style={{
                  fontSize: '1rem',
                  lineHeight: 1.6,
                  color: '#94A3B8',
                  maxWidth: '380px',
                  margin: '0 0 3rem 0',
                }}
              >
                Engineered with molecular titanium and ester synthetic base.
                <br />
                <strong style={{ color: '#FFFFFF', fontWeight: 600 }}>Zero thermal breakdown.</strong> In aerospace canisters.
              </p>

              {/* 01 ────── THE TITANIUM CANISTER */}
              <div
                className="anim-text-reveal-4"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1.25rem',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  letterSpacing: '0.18em',
                  color: '#CBD5E1',
                }}
              >
                <span style={{ color: '#F59E0B' }}>01</span>
                <div style={{ width: '60px', height: '1px', backgroundColor: 'rgba(255, 255, 255, 0.25)' }} />
                <span style={{ color: '#94A3B8', textTransform: 'uppercase' }}>THE TITANIUM CANISTER</span>
              </div>
            </div>

            {/* CENTER COLUMN: Hero Stage Spacer for Persistent 3D Oil Bottle */}
            <div
              style={{
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: '320px',
                maxWidth: '460px',
                width: '100%',
                minHeight: '540px',
                pointerEvents: 'none',
              }}
            >
              {/* Glowing amber halo ring behind 3D model */}
              <div
                style={{
                  position: 'absolute',
                  width: '380px',
                  height: '540px',
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(245, 158, 11, 0.28) 0%, rgba(217, 119, 6, 0.1) 50%, transparent 75%)',
                  filter: 'blur(35px)',
                  pointerEvents: 'none',
                  zIndex: 1,
                  opacity: textOpacity,
                  transition: 'opacity 0.05s ease-out',
                }}
              />

              {/* Base Reflection / Shadow Oval */}
              <div
                style={{
                  width: '260px',
                  height: '24px',
                  borderRadius: '50%',
                  background: 'radial-gradient(ellipse at center, rgba(0, 0, 0, 0.95) 0%, rgba(245, 158, 11, 0.18) 40%, transparent 80%)',
                  marginTop: '450px',
                  filter: 'blur(8px)',
                  zIndex: 1,
                  opacity: textOpacity,
                  transition: 'opacity 0.05s ease-out',
                }}
              />
            </div>

            {/* RIGHT COLUMN: Pure possibility & Subtitle (Zooms bigger, fades and vanishes on scroll) */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'flex-start',
                paddingLeft: '2rem',
                transform: `translate3d(0, ${textTranslateY * 0.85}px, 0) scale(${textScale})`,
                opacity: textOpacity,
                filter: `blur(${textBlur}px)`,
                transformOrigin: 'right center',
                transition: 'transform 0.05s ease-out, opacity 0.05s ease-out',
                pointerEvents: textOpacity < 0.1 ? 'none' : 'auto',
              }}
            >
              {/* Serif Italic Statement matching Reference Design */}
              <h2
                className="hero-italic-statement anim-text-reveal-2"
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontStyle: 'italic',
                  fontSize: 'clamp(2.8rem, 4.4vw, 3.8rem)',
                  fontWeight: 400,
                  color: '#FFFFFF',
                  letterSpacing: '-0.015em',
                  lineHeight: 1.08,
                  margin: '0 0 1.5rem 0',
                  cursor: 'default',
                  display: 'block',
                }}
              >
                Pure possibility.
              </h2>



              {/* Action pill to explore catalog */}
              <a
                href="#catalog-section"
                className="anim-text-reveal-4"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.65rem 1.35rem',
                  borderRadius: '9999px',
                  border: '1px solid rgba(245, 158, 11, 0.35)',
                  backgroundColor: 'rgba(245, 158, 11, 0.08)',
                  color: '#F59E0B',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  letterSpacing: '0.05em',
                  textDecoration: 'none',
                  transition: 'all 0.25s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(245, 158, 11, 0.22)';
                  e.currentTarget.style.borderColor = '#F59E0B';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(245, 158, 11, 0.25)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(245, 158, 11, 0.08)';
                  e.currentTarget.style.borderColor = 'rgba(245, 158, 11, 0.35)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <span>Explore Engine Fluids</span>
                <ArrowDown size={14} />
              </a>
            </div>
          </div>

          {/* Far Right Edge Floating Tab "DOC <" */}
          <div
            onClick={() => {
              const el = document.getElementById('catalog-section');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            style={{
              position: 'absolute',
              right: 0,
              top: '46%',
              transform: 'translateY(-50%)',
              backgroundColor: '#0F1117',
              border: '1px solid rgba(245, 158, 11, 0.25)',
              borderRight: 'none',
              borderTopLeftRadius: '10px',
              borderBottomLeftRadius: '10px',
              padding: '0.75rem 0.5rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.25rem',
              cursor: 'pointer',
              boxShadow: '-4px 0 15px rgba(0, 0, 0, 0.5)',
              zIndex: 30,
              opacity: textOpacity,
              pointerEvents: textOpacity < 0.1 ? 'none' : 'auto',
              transition: 'opacity 0.08s ease-out, background-color 0.2s',
            }}
            title="Jump to Catalog"
          >
            <div style={{ fontWeight: 900, fontSize: '0.8rem', color: '#FFFFFF', letterSpacing: '-0.02em' }}>DOC</div>
            <div style={{ fontSize: '0.65rem', color: '#F59E0B' }}>&lt;</div>
          </div>

          {/* BOTTOM FLOATING CONTROLS MATCHING REFERENCE IMAGE */}
          <div
            style={{
              position: 'absolute',
              bottom: '24px',
              right: '48px',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              zIndex: 40,
              opacity: textOpacity,
              pointerEvents: textOpacity < 0.1 ? 'none' : 'auto',
              transition: 'opacity 0.08s ease-out',
            }}
          >
            {/* Play Engine Acoustics */}
            <button
              onClick={toggleEngineAudio}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                backgroundColor: isPlayingAudio ? 'rgba(245, 158, 11, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                border: isPlayingAudio ? '1px solid #F59E0B' : '1px solid rgba(255, 255, 255, 0.12)',
                color: isPlayingAudio ? '#F59E0B' : '#FFFFFF',
                borderRadius: '9999px',
                padding: '0.55rem 1.15rem',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer',
                backdropFilter: 'blur(12px)',
                transition: 'all 0.2s ease',
              }}
            >
              {isPlayingAudio ? <Pause size={13} fill="#F59E0B" /> : <Play size={13} fill="#FFF" />}
              <span>{isPlayingAudio ? 'Engine Revving...' : 'Play'}</span>
            </button>

            {/* Sound / Viscosity Specs Button */}
            <button
              onClick={() => setShowSpecsModal(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                color: '#FFFFFF',
                borderRadius: '9999px',
                padding: '0.55rem 1.15rem',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer',
                backdropFilter: 'blur(12px)',
                transition: 'all 0.2s ease',
              }}
            >
              <Volume2 size={14} color="#CBD5E1" />
              <span>Sound On</span>
            </button>

            {/* White Pill Button: 'Talk to Oil Specialist' */}
            <button
              onClick={() => setShowSpecialistModal(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.55rem',
                backgroundColor: '#FFFFFF',
                color: '#07080B',
                border: 'none',
                borderRadius: '9999px',
                padding: '0.55rem 1.35rem',
                fontSize: '0.825rem',
                fontWeight: 800,
                cursor: 'pointer',
                boxShadow: '0 4px 20px rgba(255, 255, 255, 0.18)',
                transition: 'transform 0.2s, background-color 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F1F5F9')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#FFFFFF')}
            >
              <Sparkles size={15} color="#07080B" fill="#07080B" />
              <span>Talk to Morpho</span>
            </button>
          </div>
        </section>
      </div>

      {/* ======================================================== */}
      {/* CATALOG SECTION (INVENTORY & LUBRICANT STORE) */}
      {/* ======================================================== */}
      <section
        id="catalog-section"
        style={{
          maxWidth: '1440px',
          margin: '0 auto',
          padding: '4rem 2rem 6rem 2rem',
          position: 'relative',
          zIndex: 10,
        }}
      >
        {/* Section Heading Bar */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
            marginBottom: '2.5rem',
            borderBottom: '1px solid rgba(245, 158, 11, 0.12)',
            paddingBottom: '1.75rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#F59E0B' }} />
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#F59E0B', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
              PRECISION AUTOMOTIVE CATALOG
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h2
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: '2.25rem',
                  fontWeight: 700,
                  color: '#FFFFFF',
                  margin: '0.2rem 0',
                }}
              >
                Direct Lubricant Inventory
              </h2>
              <p style={{ margin: 0, color: '#94A3B8', fontSize: '0.9rem', maxWidth: '640px' }}>
                Factory-sealed synthetic motor oils, heavy-duty gear fluids, and long-life coolants directly synced with the Disanayake Oil Center warehouse.
              </p>
            </div>

            <div style={{ fontSize: '0.8rem', color: '#CBD5E1', display: 'flex', gap: '1.5rem' }}>
              <div>
                <span style={{ color: '#64748B' }}>Total SKUs:</span> <strong style={{ color: '#F59E0B' }}>{products.length} Items</strong>
              </div>
              <div>
                <span style={{ color: '#64748B' }}>Warehouse:</span> <strong style={{ color: '#10B981' }}>Live Synced</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Filter and Search Controls */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1.25rem',
            marginBottom: '2.5rem',
          }}
        >
          {/* Category Pills */}
          <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.35rem' }}>
            {categories.map((cat) => {
              const active = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  style={{
                    padding: '0.55rem 1.25rem',
                    borderRadius: '9999px',
                    border: active ? '1px solid #F59E0B' : '1px solid rgba(255, 255, 255, 0.08)',
                    backgroundColor: active ? '#F59E0B' : 'rgba(255, 255, 255, 0.03)',
                    color: active ? '#07080B' : '#CBD5E1',
                    fontWeight: 700,
                    fontSize: '0.825rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: active ? '0 0 16px rgba(245, 158, 11, 0.3)' : 'none',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Search Input with Amber Glow */}
          <div style={{ position: 'relative', width: '100%', maxWidth: '360px' }}>
            <input
              type="text"
              placeholder="Search by oil viscosity, grade, or brand..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: '100%',
                padding: '0.65rem 1rem 0.65rem 1.25rem',
                borderRadius: '9999px',
                border: '1px solid rgba(245, 158, 11, 0.25)',
                backgroundColor: 'rgba(15, 17, 23, 0.9)',
                color: '#FFFFFF',
                fontSize: '0.85rem',
                outline: 'none',
                boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.5)',
                transition: 'border-color 0.2s, box-shadow 0.2s',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#F59E0B';
                e.target.style.boxShadow = '0 0 15px rgba(245, 158, 11, 0.2)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(245, 158, 11, 0.25)';
                e.target.style.boxShadow = 'inset 0 1px 3px rgba(0,0,0,0.5)';
              }}
            />
          </div>
        </div>

        {/* Product Cards Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '5rem 1rem', color: '#94A3B8' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                border: '3px solid rgba(245, 158, 11, 0.2)',
                borderTopColor: '#F59E0B',
                borderRadius: '50%',
                margin: '0 auto 1.25rem auto',
                animation: 'spin 0.8s linear infinite',
              }}
            />
            <div style={{ fontSize: '1rem', fontWeight: 600 }}>Connecting to Disanayake Oil Center Database...</div>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '4rem 2rem',
              backgroundColor: 'rgba(255, 255, 255, 0.02)',
              borderRadius: '16px',
              border: '1px dashed rgba(245, 158, 11, 0.2)',
            }}
          >
            <Gauge size={44} color="#64748B" style={{ marginBottom: '1rem' }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#FFFFFF', margin: '0 0 0.5rem 0' }}>
              No oil products found matching "{search}"
            </h3>
            <p style={{ color: '#94A3B8', fontSize: '0.875rem', margin: 0 }}>
              Try searching for "5W-30", "Gear", "Castrol", or clear the category filter.
            </p>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))',
              gap: '1.75rem',
            }}
          >
            {filteredProducts.map((p) => {
              const price = typeof p.price === 'string' ? parseFloat(p.price) : p.price;
              const inStock = (p.current_stock_quantity ?? 0) > 0;
              const prodImg = getProductImage(p.p_name);

              return (
                <div
                  key={p.pID}
                  style={{
                    backgroundColor: 'rgba(11, 13, 19, 0.72)',
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                    borderRadius: '16px',
                    border: '1px solid rgba(245, 158, 11, 0.16)',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.borderColor = 'rgba(245, 158, 11, 0.45)';
                    e.currentTarget.style.boxShadow = '0 12px 30px rgba(245, 158, 11, 0.12)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.borderColor = 'rgba(245, 158, 11, 0.14)';
                    e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.5)';
                  }}
                >
                  {/* Visual Product Showcase Header */}
                  <div
                    style={{
                      height: '220px',
                      background: 'radial-gradient(circle at 50% 50%, rgba(245, 158, 11, 0.1) 0%, rgba(11, 13, 19, 0.85) 80%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative',
                      padding: '1.25rem',
                    }}
                  >
                    <img
                      src={prodImg}
                      alt={p.p_name}
                      style={{
                        maxHeight: '180px',
                        maxWidth: '85%',
                        objectFit: 'contain',
                        filter: 'drop-shadow(0 10px 18px rgba(0,0,0,0.8))',
                      }}
                    />

                    {/* Stock Badge */}
                    <span
                      style={{
                        position: 'absolute',
                        top: '12px',
                        left: '12px',
                        fontSize: '0.68rem',
                        fontWeight: 800,
                        backgroundColor: inStock ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                        border: inStock ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(239, 68, 68, 0.3)',
                        color: inStock ? '#34D399' : '#F87171',
                        padding: '0.25rem 0.6rem',
                        borderRadius: '9999px',
                        letterSpacing: '0.04em',
                      }}
                    >
                      {inStock ? `IN STOCK (${p.current_stock_quantity})` : 'OUT OF STOCK'}
                    </span>

                    {/* SKU badge */}
                    <span
                      style={{
                        position: 'absolute',
                        top: '12px',
                        right: '12px',
                        fontSize: '0.68rem',
                        color: '#64748B',
                        fontFamily: 'monospace',
                        fontWeight: 700,
                      }}
                    >
                      SKU #{p.pID}
                    </span>
                  </div>

                  {/* Product Details */}
                  <div style={{ padding: '1.35rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <div style={{ fontSize: '0.7rem', color: '#E5A93C', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '0.35rem' }}>
                      ENGINE LUBRICANT
                    </div>

                    <h3
                      style={{
                        fontSize: '1.1rem',
                        fontWeight: 700,
                        color: '#FFFFFF',
                        margin: '0 0 0.5rem 0',
                        lineHeight: 1.35,
                      }}
                    >
                      {p.p_name}
                    </h3>

                    <p
                      style={{
                        fontSize: '0.825rem',
                        color: '#94A3B8',
                        margin: '0 0 1.25rem 0',
                        flex: 1,
                        lineHeight: 1.5,
                      }}
                    >
                      {p.description || 'Premium engine oil formulated for anti-wear protection and extreme temperature stability.'}
                    </p>

                    {/* Price in LKR with Gold Accent */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '1.25rem' }}>
                      <div>
                        <span style={{ fontSize: '0.68rem', color: '#64748B', textTransform: 'uppercase', fontWeight: 700 }}>Online Price</span>
                        <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#F59E0B' }}>
                          Rs. {(isNaN(price) ? 0 : price).toFixed(2)}
                        </div>
                      </div>
                      <div style={{ fontSize: '0.7rem', color: '#10B981', fontWeight: 700 }}>
                        ✓ Sealed Genuine
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: '0.65rem' }}>
                      <button
                        onClick={() => setSelectedProductDetails(p)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.35rem',
                          padding: '0.65rem',
                          borderRadius: '10px',
                          border: '1px solid rgba(255, 255, 255, 0.12)',
                          backgroundColor: 'rgba(255, 255, 255, 0.04)',
                          color: '#CBD5E1',
                          fontSize: '0.8rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
                          e.currentTarget.style.color = '#FFF';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.04)';
                          e.currentTarget.style.color = '#CBD5E1';
                        }}
                      >
                        <Eye size={14} /> Specs
                      </button>

                      <button
                        disabled={!inStock}
                        onClick={(e) => handleAddToCart(p, e)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.45rem',
                          padding: '0.65rem',
                          borderRadius: '10px',
                          border: 'none',
                          backgroundColor: inStock ? '#F59E0B' : '#334155',
                          color: inStock ? '#07080B' : '#94A3B8',
                          fontSize: '0.825rem',
                          fontWeight: 800,
                          cursor: inStock ? 'pointer' : 'not-allowed',
                          boxShadow: inStock ? '0 4px 14px rgba(245, 158, 11, 0.25)' : 'none',
                          transition: 'all 0.2s ease',
                        }}
                        onMouseEnter={(e) => {
                          if (inStock) e.currentTarget.style.backgroundColor = '#FBBF24';
                        }}
                        onMouseLeave={(e) => {
                          if (inStock) e.currentTarget.style.backgroundColor = '#F59E0B';
                        }}
                      >
                        <ShoppingCart size={15} /> Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ======================================================== */}
      {/* TECHNICAL VISCOSITY GUIDE SECTION */}
      {/* ======================================================== */}
      <section
        id="viscosity-section"
        style={{
          borderTop: '1px solid rgba(245, 158, 11, 0.12)',
          backgroundColor: '#090A0F',
          padding: '4rem 2rem',
          position: 'relative',
          zIndex: 10,
        }}
      >
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#F59E0B', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
              TECHNICAL ACCREDITATION
            </span>
            <h2
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: '2.2rem',
                fontWeight: 700,
                color: '#FFFFFF',
                marginTop: '0.5rem',
              }}
            >
              Understanding Engine Oil Viscosity
            </h2>
            <p style={{ color: '#94A3B8', maxWidth: '600px', margin: '0.5rem auto 0 auto', fontSize: '0.9rem' }}>
              Match the optimal shear tolerance and temperature coefficient to your vehicle manufacturer requirement.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {[
              {
                grade: 'SAE 0W-20',
                label: 'Hybrid & Eco-VVT',
                desc: 'Ultra-thin cold start circulation. Minimizes parasitic drag for maximum fuel efficiency in modern Toyota, Honda, and Nissan engines.',
                temp: '-35°C to +30°C',
              },
              {
                grade: 'SAE 5W-30',
                label: 'Standard Performance',
                desc: 'Universal high-protection standard for gasoline passenger cars and light SUVs. Outstanding wear protection under stop-and-go city traffic.',
                temp: '-30°C to +35°C',
              },
              {
                grade: 'SAE 5W-40 / 10W-40',
                label: 'Turbocharged & Euro Spec',
                desc: 'Thicker hot-viscosity film for high-temperature turbocharged engines and spirited driving. Prevents piston ring varnishing.',
                temp: '-25°C to +40°C',
              },
              {
                grade: 'SAE 15W-40 / 20W-50',
                label: 'Heavy Diesel & High Mileage',
                desc: 'Heavy-duty shear strength with high zinc (ZDDP) additive chemistry for older commercial trucks, high mileage motors, and warm tropical climates.',
                temp: '-15°C to +50°C',
              },
            ].map((v) => (
              <div
                key={v.grade}
                style={{
                  backgroundColor: '#0E1017',
                  border: '1px solid rgba(245, 158, 11, 0.15)',
                  borderRadius: '14px',
                  padding: '1.75rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontSize: '1.4rem', fontWeight: 900, color: '#F59E0B', fontFamily: 'monospace' }}>{v.grade}</span>
                  <span style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 700 }}>{v.temp}</span>
                </div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#FFFFFF' }}>{v.label}</div>
                <p style={{ fontSize: '0.8rem', color: '#94A3B8', margin: 0, lineHeight: 1.5 }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* MODAL: TALK TO OIL SPECIALIST (RECOMMENDATION ASSISTANT) */}
      {/* ======================================================== */}
      {showSpecialistModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1.5rem',
          }}
          onClick={() => setShowSpecialistModal(false)}
        >
          <div
            style={{
              backgroundColor: '#0F1117',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              borderRadius: '20px',
              maxWidth: '560px',
              width: '100%',
              padding: '2rem',
              boxShadow: '0 25px 60px rgba(0, 0, 0, 0.9), 0 0 35px rgba(245, 158, 11, 0.15)',
              position: 'relative',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowSpecialistModal(false)}
              style={{
                position: 'absolute',
                top: '18px',
                right: '18px',
                background: 'none',
                border: 'none',
                color: '#94A3B8',
                cursor: 'pointer',
              }}
            >
              <X size={20} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.25rem' }}>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(245, 158, 11, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#F59E0B',
                }}
              >
                <Sparkles size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: '#FFFFFF' }}>
                  Talk to Oil Specialist
                </h3>
                <div style={{ fontSize: '0.75rem', color: '#F59E0B', fontWeight: 600 }}>
                  Automated Viscosity & Formula Matcher
                </div>
              </div>
            </div>

            <p style={{ fontSize: '0.85rem', color: '#94A3B8', marginBottom: '1.5rem', lineHeight: 1.5 }}>
              Select your vehicle platform to calculate the recommended engine lubricant formula based on factory tolerances:
            </p>

            {/* Vehicle Selector Tabs */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem', marginBottom: '1.75rem' }}>
              {[
                { id: 'sedan', label: '🚗 Japanese Petrol / SUV' },
                { id: 'euro', label: '🏎️ European Turbo / High Output' },
                { id: 'diesel', label: '🚛 Common-Rail Diesel / Pickup' },
                { id: 'hybrid', label: '⚡ Hybrid / Start-Stop Engine' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setVehicleType(tab.id as any)}
                  style={{
                    padding: '0.75rem',
                    borderRadius: '12px',
                    border: vehicleType === tab.id ? '1px solid #F59E0B' : '1px solid rgba(255, 255, 255, 0.08)',
                    backgroundColor: vehicleType === tab.id ? 'rgba(245, 158, 11, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                    color: vehicleType === tab.id ? '#F59E0B' : '#CBD5E1',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.2s',
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Recommendation Result Card */}
            {specialistRecommendations[vehicleType] && (
              <div
                style={{
                  backgroundColor: 'rgba(245, 158, 11, 0.06)',
                  border: '1px solid rgba(245, 158, 11, 0.25)',
                  borderRadius: '14px',
                  padding: '1.25rem',
                  marginBottom: '1.75rem',
                }}
              >
                <div style={{ fontSize: '0.7rem', color: '#F59E0B', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  RECOMMENDED LUBRICANT
                </div>
                <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#FFFFFF', margin: '0.25rem 0' }}>
                  {specialistRecommendations[vehicleType].oil}
                </div>
                <div style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: '#10B981', fontWeight: 700, marginBottom: '0.5rem' }}>
                  Specification: {specialistRecommendations[vehicleType].code}
                </div>
                <p style={{ fontSize: '0.8rem', color: '#CBD5E1', margin: '0 0 1rem 0', lineHeight: 1.45 }}>
                  {specialistRecommendations[vehicleType].desc}
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: '1.15rem', fontWeight: 900, color: '#F59E0B' }}>
                    {specialistRecommendations[vehicleType].price}
                  </div>
                  <button
                    onClick={() => {
                      const matched = products.find((p) => p.p_name.toLowerCase().includes(vehicleType === 'sedan' ? '5w-30' : vehicleType === 'euro' ? '5w-40' : vehicleType === 'diesel' ? '15w-40' : '0w-20')) || products[0];
                      if (matched) {
                        addToCart(matched, 1);
                        setAddedToast(matched.p_name);
                        setShowSpecialistModal(false);
                      }
                    }}
                    style={{
                      backgroundColor: '#F59E0B',
                      color: '#07080B',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '0.5rem 1rem',
                      fontWeight: 800,
                      fontSize: '0.8rem',
                      cursor: 'pointer',
                    }}
                  >
                    Select & Add to Cart
                  </button>
                </div>
              </div>
            )}

            <div style={{ textAlign: 'center' }}>
              <span style={{ fontSize: '0.75rem', color: '#64748B' }}>
                Need physical assistance? Visit Disanayake Oil Center or call (+94) 71 922 3844.
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: VISCOSITY & CANISTER SPECS */}
      {/* ======================================================== */}
      {showSpecsModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1.5rem',
          }}
          onClick={() => setShowSpecsModal(false)}
        >
          <div
            style={{
              backgroundColor: '#0D0F15',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              borderRadius: '20px',
              maxWidth: '620px',
              width: '100%',
              padding: '2rem',
              boxShadow: '0 25px 60px rgba(0, 0, 0, 0.9)',
              position: 'relative',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowSpecsModal(false)}
              style={{
                position: 'absolute',
                top: '18px',
                right: '18px',
                background: 'none',
                border: 'none',
                color: '#94A3B8',
                cursor: 'pointer',
              }}
            >
              <X size={20} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
              <img
                src="/hero_oil_can.jpg"
                alt="Canister"
                style={{ width: '70px', height: '110px', objectFit: 'contain' }}
              />
              <div>
                <span style={{ fontSize: '0.7rem', color: '#F59E0B', fontWeight: 800, letterSpacing: '0.15em' }}>
                  LABORATORY SPECIFICATION SHEET
                </span>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 800, margin: '0.2rem 0', color: '#FFFFFF' }}>
                  DOC Titanium Full Synthetic Formula
                </h3>
                <div style={{ fontSize: '0.78rem', color: '#94A3B8' }}>
                  Aerospace Grade Extruded Aluminum Canister (100% Recyclable)
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.85rem', marginBottom: '1.5rem' }}>
              {[
                { label: 'Kinematic Viscosity @ 100°C', val: '14.2 cSt' },
                { label: 'Viscosity Index (VI)', val: '178' },
                { label: 'Flash Point (ASTM D92)', val: '238°C (460°F)' },
                { label: 'Pour Point (ASTM D97)', val: '-45°C (-49°F)' },
                { label: 'HTHS High-Shear Viscosity', val: '3.8 mPa.s' },
                { label: 'Total Base Number (TBN)', val: '9.2 mg KOH/g' },
                { label: 'Sulfated Ash Content', val: '0.8% wt' },
                { label: 'API / OEM Certifications', val: 'API SP / ACEA A3/B4' },
              ].map((s) => (
                <div
                  key={s.label}
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                    padding: '0.75rem 1rem',
                    borderRadius: '10px',
                  }}
                >
                  <div style={{ fontSize: '0.68rem', color: '#64748B', fontWeight: 700 }}>{s.label}</div>
                  <div style={{ fontSize: '0.925rem', fontWeight: 800, color: '#F59E0B', marginTop: '2px' }}>{s.val}</div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowSpecsModal(false)}
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '10px',
                border: 'none',
                backgroundColor: '#F59E0B',
                color: '#07080B',
                fontWeight: 800,
                fontSize: '0.85rem',
                cursor: 'pointer',
              }}
            >
              Close Technical Sheet
            </button>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: PRODUCT DETAILS */}
      {/* ======================================================== */}
      {selectedProductDetails && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1.5rem',
          }}
          onClick={() => setSelectedProductDetails(null)}
        >
          <div
            style={{
              backgroundColor: '#0F1117',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              borderRadius: '20px',
              maxWidth: '520px',
              width: '100%',
              padding: '2rem',
              boxShadow: '0 25px 60px rgba(0, 0, 0, 0.9)',
              position: 'relative',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedProductDetails(null)}
              style={{
                position: 'absolute',
                top: '18px',
                right: '18px',
                background: 'none',
                border: 'none',
                color: '#94A3B8',
                cursor: 'pointer',
              }}
            >
              <X size={20} />
            </button>

            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <img
                src={getProductImage(selectedProductDetails.p_name)}
                alt={selectedProductDetails.p_name}
                style={{ maxHeight: '180px', objectFit: 'contain', margin: '0 auto' }}
              />
            </div>

            <div style={{ fontSize: '0.7rem', color: '#F59E0B', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em' }}>
              SKU #{selectedProductDetails.pID} • CERTIFIED
            </div>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#FFFFFF', margin: '0.35rem 0' }}>
              {selectedProductDetails.p_name}
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#94A3B8', lineHeight: 1.5, marginBottom: '1.5rem' }}>
              {selectedProductDetails.description || 'Premium formulated automotive lubricant engineered for exceptional engine health.'}
            </p>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div>
                <span style={{ fontSize: '0.7rem', color: '#64748B' }}>Retail Price</span>
                <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#F59E0B' }}>
                  Rs. {(parseFloat(String(selectedProductDetails.price)) || 0).toFixed(2)}
                </div>
              </div>
              <div style={{ fontSize: '0.8rem', color: '#34D399', fontWeight: 700 }}>
                ✓ In Stock ({selectedProductDetails.current_stock_quantity} Units)
              </div>
            </div>

            <button
              onClick={(e) => {
                handleAddToCart(selectedProductDetails, e);
                setSelectedProductDetails(null);
              }}
              style={{
                width: '100%',
                padding: '0.85rem',
                borderRadius: '12px',
                border: 'none',
                backgroundColor: '#F59E0B',
                color: '#07080B',
                fontWeight: 800,
                fontSize: '0.9rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
              }}
            >
              <ShoppingCart size={18} />
              Add to Cart Now
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CatalogPage;
