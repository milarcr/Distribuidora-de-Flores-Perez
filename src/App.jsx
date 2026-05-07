import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'

// ============================================================
// DATA
// ============================================================
const PRODUCTS = [
  {
    id: 1,
    name: 'Lisianthus Mix',
    price: 130,
    unit: 'por docena',
    image: '/lisianthus.jpg',
    category: 'Elegantes',
    description: 'Lisianthus blanco y rosado, perfecto para arreglos nupciales y eventos formales.',
    badge: 'Popular',
    fallback: '🌸',
    accent: 'bg-rose-100 text-rose-700',
  },
  {
    id: 2,
    name: 'Statice Morado',
    price: 90,
    unit: 'por docena',
    image: '/statice.jpg',
    category: 'Silvestres',
    description: 'Statice en tonos morados y rosas. De larga duración, ideales para conservar y decorar.',
    badge: null,
    fallback: '💜',
    accent: 'bg-violet-100 text-violet-700',
  },
  {
    id: 3,
    name: 'Snapdragon Verde',
    price: 85,
    unit: 'por docena',
    image: '/snapdragon.jpg',
    category: 'Silvestres',
    description: 'Boca de dragón en tono verde fresco. Relleno perfecto para bouquets y arreglos de jardín.',
    badge: null,
    fallback: '🌿',
    accent: 'bg-emerald-100 text-emerald-700',
  },
  {
    id: 4,
    name: 'Crisantemos Rosa',
    price: 100,
    unit: 'por docena',
    image: '/crisantemos.jpg',
    category: 'Tradicionales',
    description: 'Crisantemos rosa cultivados en invernadero propio. Frescos, vibrantes y de temporada.',
    badge: 'Del Rancho',
    fallback: '🌺',
    accent: 'bg-pink-100 text-pink-700',
  },
  {
    id: 5,
    name: 'Rosas Mini Surtidas',
    price: 120,
    unit: 'por docena',
    image: '/rosas_mini.jpg',
    category: 'Rosas',
    description: 'Rosas spray en naranja, rosa, amarillo y durazno. Ideales para arreglos pequeños y coloridos.',
    badge: 'Top Venta',
    fallback: '🌹',
    accent: 'bg-orange-100 text-orange-700',
  },
  {
    id: 6,
    name: 'Hortensias Multicolor',
    price: 180,
    unit: 'por pieza',
    image: '/hortensias.jpg',
    category: 'Elegantes',
    description: 'Hortensias en azul, lila, blanco y violeta. Impresionantes como centros de mesa.',
    badge: 'Exclusivo',
    fallback: '💐',
    accent: 'bg-sky-100 text-sky-700',
  },
  {
    id: 7,
    name: 'Gerberas Fucsias',
    price: 110,
    unit: 'por docena',
    image: '/gerberas.jpg',
    category: 'Tropicales',
    description: 'Gerberas en fucsia intenso cultivadas en invernadero. Alegres y de larga duración.',
    badge: null,
    fallback: '🌸',
    accent: 'bg-fuchsia-100 text-fuchsia-700',
  },
  {
    id: 8,
    name: 'Bouquet Lisianthus & Statice',
    price: 220,
    unit: 'por arreglo',
    image: '/lisianthus.jpg',
    category: 'Arreglos',
    description: 'Combinación elegante de lisianthus blanco y statice morado. Ideal para bodas y XV años.',
    badge: 'Especial',
    fallback: '💐',
    accent: 'bg-purple-100 text-purple-700',
  },
  {
    id: 9,
    name: 'Statice Rosa Pastel',
    price: 90,
    unit: 'por docena',
    image: '/statice.jpg',
    category: 'Silvestres',
    description: 'Statice en tono rosa pastel, ideal para arreglos románticos y decoración de eventos.',
    badge: null,
    fallback: '🌷',
    accent: 'bg-rose-100 text-rose-700',
  },
  {
    id: 10,
    name: 'Mix Rosas Spray',
    price: 150,
    unit: 'por manojo',
    image: '/rosas_mini.jpg',
    category: 'Rosas',
    description: 'Surtido de rosas mini en distintos colores para crear arreglos únicos y coloridos.',
    badge: null,
    fallback: '🌹',
    accent: 'bg-yellow-100 text-yellow-700',
  },
  {
    id: 11,
    name: 'Crisantemos por Planta',
    price: 80,
    unit: 'por planta',
    image: '/crisantemos.jpg',
    category: 'Tradicionales',
    description: 'Plantas de crisantemo frescas del invernadero. Perfectas para regalar con maceta.',
    badge: null,
    fallback: '🌺',
    accent: 'bg-pink-100 text-pink-700',
  },
  {
    id: 12,
    name: 'Centro de Mesa Premium',
    price: 400,
    unit: 'por arreglo',
    image: '/hortensias.jpg',
    category: 'Arreglos',
    description: 'Centro de mesa con hortensias, rosas mini y follaje. Para bodas y eventos exclusivos.',
    badge: 'Premium',
    fallback: '🌿',
    accent: 'bg-sky-100 text-sky-700',
  },
]

const CATEGORIES = ['Todas', ...new Set(PRODUCTS.map(p => p.category))]

// ============================================================
// VARIANTS
// ============================================================
const slideFromRight = {
  hidden:  { x: '100%', opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { type: 'spring', damping: 28, stiffness: 220 } },
  exit:    { x: '100%', opacity: 0, transition: { duration: 0.26, ease: 'easeIn' } },
}

const popIn = {
  hidden:  { scale: 0.85, opacity: 0 },
  visible: { scale: 1, opacity: 1, transition: { type: 'spring', duration: 0.3 } },
  exit:    { scale: 0.85, opacity: 0, transition: { duration: 0.18 } },
}

// ============================================================
// HEADER
// ============================================================
function Header({ cartCount, onCartToggle }) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setMenuOpen(false)
  }

  const links = [
    { label: 'Catálogo',       id: 'catalogo' },
    { label: 'Sobre Nosotros', id: 'nosotros'  },
    { label: 'Contacto',       id: 'contacto'  },
  ]

  return (
    <motion.header
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.65, type: 'spring', damping: 20 }}
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/97 backdrop-blur-lg shadow-sm shadow-green-100/80 border-b border-green-100/50'
          : 'bg-white/90 backdrop-blur-md border-b border-green-100/40'
      }`}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 flex items-center justify-between h-16 md:h-20">

        {/* Logo */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => scrollTo('inicio')}
          className="flex items-center gap-3"
        >
          <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center text-lg flex-shrink-0">
            🌸
          </div>
          <div className="text-left">
            <p className="font-serif font-semibold text-[15px] leading-tight text-green-900 tracking-wide">
              Flores Pérez
            </p>
            <p className="font-sans text-[9px] uppercase tracking-[0.22em] font-medium text-sky-500">
              Distribuidora
            </p>
          </div>
        </motion.button>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {links.map(({ label, id }) => (
            <motion.button
              key={id}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => scrollTo(id)}
              className="font-sans font-medium text-[13px] text-green-800 hover:text-green-500 transition-colors tracking-wide"
            >
              {label}
            </motion.button>
          ))}
        </nav>

        {/* Cart + Mobile */}
        <div className="flex items-center gap-2.5">
          <motion.button
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.94 }}
            onClick={onCartToggle}
            className="relative flex items-center gap-2 bg-green-100 hover:bg-green-200 text-green-800 px-4 py-2 rounded-full font-sans font-semibold text-[13px] transition-colors shadow-sm"
          >
            <span className="text-[15px]">🛒</span>
            <span className="hidden sm:inline">Carrito</span>
            <AnimatePresence>
              {cartCount > 0 && (
                <motion.span
                  key="b"
                  variants={popIn}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="absolute -top-1.5 -right-1.5 bg-sky-400 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow"
                >
                  {cartCount > 9 ? '9+' : cartCount}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>

          <button
            onClick={() => setMenuOpen(v => !v)}
            className="md:hidden p-2 text-green-700 hover:bg-green-50 rounded-lg transition-colors"
          >
            <motion.span
              animate={{ rotate: menuOpen ? 90 : 0 }}
              className="block text-xl leading-none"
            >
              {menuOpen ? '✕' : '☰'}
            </motion.span>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="md:hidden overflow-hidden bg-white border-t border-green-100"
          >
            {links.map(({ label, id }) => (
              <button
                key={id}
                onClick={() => scrollTo(id)}
                className="flex items-center gap-3 w-full text-left px-6 py-4 text-green-800 hover:bg-green-50 font-sans font-medium text-sm border-b border-green-50 last:border-0 transition-colors"
              >
                <span className="text-sky-400 text-xs">›</span> {label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}

// ============================================================
// HERO — fondo limpio, sin imagen, tipografía premium centrada
// ============================================================
function Hero() {
  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

  return (
    <section
      id="inicio"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-green-50 via-white to-sky-50"
    >
      {/* Manchas decorativas soft — sin imágenes */}
      <div className="absolute -top-20 -left-20 w-96 h-96 bg-green-100/50 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -right-20 w-[28rem] h-[28rem] bg-sky-100/50 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-56 h-56 bg-green-50/80 rounded-full blur-2xl pointer-events-none" />

      {/* Contenido centrado */}
      <div className="relative z-10 text-center px-5 max-w-3xl mx-auto py-28 flex flex-col items-center">

        {/* Label superior */}
        <motion.p
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="font-sans text-[11px] uppercase tracking-[0.35em] text-sky-500 font-semibold mb-6"
        >
          Distribuidora · Estado de México
        </motion.p>

        {/* Línea decorativa */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.3, duration: 0.7, ease: 'easeOut' }}
          className="w-20 h-px bg-gradient-to-r from-transparent via-green-300 to-transparent mb-8"
        />

        {/* Título principal — serif elegante */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="font-serif text-5xl sm:text-6xl lg:text-7xl font-light text-green-900 leading-none tracking-wide mb-2"
        >
          Distribuidora de Flores
        </motion.h1>

        {/* Apellido — italic grande, acento de color */}
        <motion.span
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.52, duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="font-serif italic text-6xl sm:text-7xl lg:text-8xl font-light text-green-600 leading-none mb-8 block"
        >
          Pérez
        </motion.span>

        {/* Línea decorativa inferior */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.6, duration: 0.7, ease: 'easeOut' }}
          className="w-16 h-px bg-gradient-to-r from-transparent via-sky-300 to-transparent mb-8"
        />

        {/* Descripción — DM Sans */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.68, duration: 0.7 }}
          className="font-sans text-gray-500 text-base sm:text-lg leading-relaxed max-w-md mb-10"
        >
          Flores frescas y arreglos únicos para cada momento especial de tu vida.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.82, duration: 0.7 }}
          className="flex flex-col sm:flex-row items-center gap-3"
        >
          <motion.button
            whileHover={{ scale: 1.04, boxShadow: '0 8px 30px rgba(74,222,128,0.28)' }}
            whileTap={{ scale: 0.96 }}
            onClick={() => scrollTo('catalogo')}
            className="font-sans font-semibold text-[13px] tracking-wide bg-green-500 hover:bg-green-600 text-white px-9 py-3.5 rounded-full shadow-md shadow-green-100 transition-colors"
          >
            Ver Catálogo
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => scrollTo('contacto')}
            className="font-sans font-semibold text-[13px] tracking-wide bg-white hover:bg-sky-50 text-green-700 border border-green-200 hover:border-sky-300 px-9 py-3.5 rounded-full transition-all"
          >
            Contactarnos
          </motion.button>
        </motion.div>

        {/* Badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.05, duration: 0.8 }}
          className="flex flex-wrap justify-center gap-2 mt-12"
        >
          {['Directo del productor', 'Entregas locales', '+10 años de experiencia'].map(b => (
            <span
              key={b}
              className="font-sans text-[11px] font-medium bg-white/80 border border-green-100 text-green-600 px-4 py-1.5 rounded-full shadow-sm"
            >
              {b}
            </span>
          ))}
        </motion.div>
      </div>

      {/* Scroll hint */}
      <motion.div
        animate={{ y: [0, 7, 0] }}
        transition={{ duration: 1.8, repeat: Infinity }}
        className="absolute bottom-7 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-green-400/50"
      >
        <span className="font-sans text-[10px] uppercase tracking-[0.3em]">Explorar</span>
        <span className="text-base">↓</span>
      </motion.div>
    </section>
  )
}

// ============================================================
// PRODUCT CARD
// ============================================================
function ProductCard({ product, onAddToCart, inCart }) {
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.15 })
  const [added, setAdded]   = useState(false)
  const [imgErr, setImgErr] = useState(false)

  const handleAdd = () => {
    onAddToCart(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 1800)
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 35 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 35 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      className="bg-white rounded-2xl border border-green-100 shadow-sm hover:shadow-lg overflow-hidden group flex flex-col transition-shadow duration-300"
    >
      {/* Imagen */}
      <div className="relative h-52 overflow-hidden bg-green-50">
        {imgErr ? (
          <div className="w-full h-full flex items-center justify-center text-5xl bg-gradient-to-br from-green-50 to-sky-50">
            {product.fallback}
          </div>
        ) : (
          <img
            src={product.image}
            alt={product.name}
            onError={() => setImgErr(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        )}
        <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black/10 to-transparent" />

        {product.badge && (
          <span className={`absolute top-3 left-3 font-sans text-[10px] font-semibold px-2.5 py-1 rounded-full uppercase tracking-wide ${product.accent}`}>
            {product.badge}
          </span>
        )}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-green-800 font-sans text-sm font-bold px-3 py-1 rounded-full shadow-sm">
          ${product.price}
        </div>
      </div>

      {/* Cuerpo */}
      <div className="p-5 flex flex-col flex-1">
        <div className="flex-1">
          <span className={`inline-block font-sans text-[10px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded mb-2 ${product.accent}`}>
            {product.category}
          </span>
          <h3 className="font-serif font-semibold text-green-900 text-[17px] leading-snug mb-1">
            {product.name}
          </h3>
          <p className="font-sans text-green-500 text-xs mb-2 font-medium">{product.unit}</p>
          <p className="font-sans text-gray-400 text-[13px] leading-relaxed line-clamp-2">{product.description}</p>
        </div>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleAdd}
          className={`mt-4 w-full py-3 rounded-xl font-sans font-semibold text-[13px] transition-all duration-300 ${
            inCart || added
              ? 'bg-green-400 text-white'
              : 'bg-sky-50 text-sky-700 border border-sky-200 hover:bg-green-500 hover:text-white hover:border-transparent'
          }`}
        >
          {inCart || added ? '✓  Añadido al carrito' : 'Añadir al carrito'}
        </motion.button>
      </div>
    </motion.div>
  )
}

// ============================================================
// CART ITEM
// ============================================================
function CartItem({ item, onRemove, onUpdateQty }) {
  const [imgErr, setImgErr] = useState(false)

  return (
    <motion.div
      variants={popIn}
      initial="hidden"
      animate="visible"
      exit="exit"
      layout
      className="flex gap-3 bg-green-50/70 rounded-xl p-3.5 border border-green-100"
    >
      <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-sky-50">
        {imgErr ? (
          <div className="w-full h-full flex items-center justify-center text-2xl">{item.fallback}</div>
        ) : (
          <img src={item.image} alt={item.name} onError={() => setImgErr(true)} className="w-full h-full object-cover" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className="font-serif font-semibold text-green-900 text-[15px] truncate">{item.name}</p>
        <p className="font-sans text-green-500 text-xs font-medium">${item.price} {item.unit}</p>
        <div className="flex items-center gap-2 mt-2">
          <button onClick={() => onUpdateQty(item.id, -1)} className="w-7 h-7 bg-white border border-green-200 rounded-full flex items-center justify-center text-green-600 font-bold hover:bg-green-100 transition-colors text-sm">−</button>
          <span className="font-sans font-bold text-green-900 w-5 text-center text-sm">{item.quantity}</span>
          <button onClick={() => onUpdateQty(item.id, 1)}  className="w-7 h-7 bg-white border border-green-200 rounded-full flex items-center justify-center text-green-600 font-bold hover:bg-green-100 transition-colors text-sm">+</button>
        </div>
      </div>

      <div className="flex flex-col items-end justify-between flex-shrink-0">
        <button onClick={() => onRemove(item.id)} className="text-gray-300 hover:text-red-400 transition-colors text-sm leading-none" aria-label="Eliminar">✕</button>
        <span className="font-sans font-bold text-green-800 text-sm">${item.price * item.quantity}</span>
      </div>
    </motion.div>
  )
}

// ============================================================
// CART SIDEBAR
// ============================================================
function CartSidebar({ cart, onClose, onRemove, onUpdateQty }) {
  const total = cart.reduce((s, i) => s + i.price * i.quantity, 0)
  const count = cart.reduce((s, i) => s + i.quantity, 0)

  const handleWhatsApp = () => {
    const lines = cart.map(i => `• ${i.name} x${i.quantity} — $${i.price * i.quantity}`).join('%0A')
    const msg   = `¡Hola! Quisiera hacer el siguiente pedido:%0A%0A${lines}%0A%0A*Total: $${total.toLocaleString()} MXN*%0A%0A¿Tienen disponibilidad? 🌸`
    window.open(`https://wa.me/527221775980?text=${msg}`, '_blank')
  }

  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose} className="fixed inset-0 bg-black/25 backdrop-blur-sm z-50" />

      <motion.aside
        variants={slideFromRight} initial="hidden" animate="visible" exit="exit"
        className="fixed right-0 top-0 h-full w-full max-w-sm sm:max-w-md bg-white z-50 shadow-2xl flex flex-col"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-green-50 to-sky-50 border-b border-green-100 px-5 py-4 flex items-center justify-between flex-shrink-0">
          <div>
            <h2 className="font-serif text-lg font-semibold text-green-900">Tu Carrito</h2>
            <p className="font-sans text-green-500 text-xs font-medium">{count} artículo{count !== 1 ? 's' : ''}</p>
          </div>
          <motion.button whileHover={{ scale: 1.12, rotate: 90 }} whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="w-9 h-9 bg-white/70 hover:bg-white rounded-full flex items-center justify-center text-green-600 text-sm transition-colors border border-green-100"
          >✕</motion.button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
          <AnimatePresence mode="popLayout">
            {cart.length === 0 ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center h-full py-20 text-center"
              >
                <motion.span animate={{ y: [0, -7, 0] }} transition={{ duration: 2, repeat: Infinity }} className="text-6xl block mb-4">🌱</motion.span>
                <p className="font-serif text-green-700 text-xl font-medium">Tu carrito está vacío</p>
                <p className="font-sans text-gray-400 text-sm mt-1">Añade flores para comenzar</p>
                <button onClick={onClose} className="font-sans mt-6 text-sky-500 text-sm font-medium hover:text-sky-700 transition-colors underline underline-offset-2">
                  Explorar catálogo →
                </button>
              </motion.div>
            ) : cart.map(item => (
              <CartItem key={item.id} item={item} onRemove={onRemove} onUpdateQty={onUpdateQty} />
            ))}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <AnimatePresence>
          {cart.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="border-t border-green-100 px-5 py-5 space-y-4 flex-shrink-0 bg-white"
            >
              <div className="flex items-center justify-between">
                <span className="font-sans text-green-600 font-medium text-sm">Total:</span>
                <span className="font-serif text-2xl font-semibold text-green-900">${total.toLocaleString()} MXN</span>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                onClick={handleWhatsApp}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-sans font-semibold py-4 rounded-2xl flex items-center justify-center gap-3 text-sm shadow-lg shadow-green-100 transition-colors"
              >
                <span className="text-xl">📱</span> Pedir por WhatsApp
              </motion.button>
              <p className="font-sans text-center text-gray-400 text-xs leading-relaxed">
                Se abrirá WhatsApp con tu pedido listo.<br />
                Confirmaremos disponibilidad y precio final.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.aside>
    </>
  )
}

// ============================================================
// CATÁLOGO
// ============================================================
function Catalogo({ cart, onAddToCart }) {
  const [activeCategory, setActiveCategory] = useState('Todas')
  const [search, setSearch] = useState('')

  const filtered = PRODUCTS.filter(p => {
    const matchCat    = activeCategory === 'Todas' || p.category === activeCategory
    const term        = search.toLowerCase()
    const matchSearch = !term || p.name.toLowerCase().includes(term) || p.description.toLowerCase().includes(term)
    return matchCat && matchSearch
  })

  const inCart = (id) => cart.some(item => item.id === id)

  return (
    <section id="catalogo" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <p className="font-sans text-[11px] uppercase tracking-[0.32em] text-sky-500 font-semibold mb-4">Nuestras Flores</p>
          <div className="w-12 h-px bg-green-200 mx-auto mb-5" />
          <h2 className="font-serif text-4xl sm:text-5xl font-light text-green-900 mb-4 tracking-wide">
            Catálogo
          </h2>
          <p className="font-sans text-gray-400 max-w-md mx-auto text-[14px] leading-relaxed">
            Explora nuestra selección de flores frescas y arreglos únicos para cada ocasión.
          </p>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-xs mx-auto mb-8"
        >
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none text-sm">🔍</span>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar flores..."
              className="w-full font-sans pl-10 pr-9 py-2.5 rounded-full border border-green-200 bg-white shadow-sm text-[13px] focus:outline-none focus:ring-2 focus:ring-sky-200 focus:border-transparent placeholder:text-gray-300 text-gray-600"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 text-xs transition-colors">✕</button>
            )}
          </div>
        </motion.div>

        {/* Category pills */}
        <motion.div
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          className="flex flex-wrap gap-2 justify-center mb-12"
        >
          {CATEGORIES.map(cat => (
            <motion.button
              key={cat}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setActiveCategory(cat)}
              className={`font-sans px-5 py-2 rounded-full text-[12px] font-semibold uppercase tracking-wider transition-all ${
                activeCategory === cat
                  ? 'bg-green-200 text-green-800 shadow-sm'
                  : 'bg-white text-green-600 border border-green-200 hover:border-green-300 hover:bg-green-50'
              }`}
            >
              {cat}
            </motion.button>
          ))}
        </motion.div>

        {/* Grid */}
        <AnimatePresence mode="wait">
          {filtered.length === 0 ? (
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center py-24">
              <span className="text-4xl block mb-4">🌿</span>
              <p className="font-sans text-gray-400 text-base">No encontramos resultados.</p>
              <button onClick={() => { setSearch(''); setActiveCategory('Todas') }} className="font-sans mt-3 text-sky-500 text-sm underline underline-offset-2 hover:text-sky-700 transition-colors">
                Ver todo el catálogo
              </button>
            </motion.div>
          ) : (
            <motion.div
              key={activeCategory + search}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.22 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {filtered.map(product => (
                <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} inCart={inCart(product.id)} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  )
}

// ============================================================
// ARREGLO PERSONALIZADO — sección independiente
// ============================================================
function ArregloPersonalizado() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65 }}
          className="text-center"
        >
          <div className="border border-green-100 rounded-3xl p-10 sm:p-16 max-w-2xl mx-auto bg-gradient-to-br from-green-50/70 via-white to-sky-50/70">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15, type: 'spring', damping: 14 }}
              className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center text-3xl mx-auto mb-7"
            >
              🌷
            </motion.div>

            <p className="font-sans text-[11px] uppercase tracking-[0.32em] text-sky-500 font-semibold mb-4">
              Servicio a medida
            </p>
            <div className="w-10 h-px bg-green-200 mx-auto mb-6" />

            <h2 className="font-serif text-3xl sm:text-4xl font-light text-green-900 mb-4 tracking-wide leading-snug">
              ¿Necesitas un arreglo<br />
              <span className="italic text-green-600">personalizado?</span>
            </h2>

            <p className="font-sans text-gray-400 text-[14px] leading-relaxed max-w-md mx-auto mb-8">
              Creamos arreglos únicos para bodas, quinceaños, eventos corporativos y cualquier
              momento que merece flores especiales. Cuéntanos tu idea.
            </p>

            <motion.a
              href="https://wa.me/527221775980"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.04, boxShadow: '0 8px 30px rgba(74,222,128,0.25)' }}
              whileTap={{ scale: 0.97 }}
              className="font-sans inline-flex items-center gap-2.5 bg-green-500 hover:bg-green-600 text-white font-semibold px-9 py-3.5 rounded-full transition-colors shadow-md text-[13px]"
            >
              <span>📱</span> Solicitar arreglo personalizado
            </motion.a>

            <div className="flex flex-wrap justify-center gap-3 mt-8">
              {['Bodas', 'XV Años', 'Eventos corporativos', 'Funerales', 'Regalos'].map(tag => (
                <span key={tag} className="font-sans text-[11px] text-green-600 bg-green-50 border border-green-200 px-3 py-1 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// ============================================================
// SOBRE NOSOTROS
// ============================================================
function SobreNosotros() {
  const [imgErr, setImgErr] = useState(false)

  return (
    <section id="nosotros" className="py-24 bg-gradient-to-br from-sky-50/60 via-white to-green-50/60 overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Imagen real — hortensias */}
          <motion.div
            initial={{ opacity: 0, x: -45 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.75, ease: 'easeOut' }}
            className="relative"
          >
            <div className="relative max-w-sm mx-auto">
              <div className="aspect-square rounded-3xl overflow-hidden shadow-xl border-4 border-white ring-1 ring-green-100">
                {imgErr ? (
                  <div className="w-full h-full flex items-center justify-center text-8xl bg-gradient-to-br from-sky-100 to-green-100">🌸</div>
                ) : (
                  <img
                    src="/hortensias.jpg"
                    alt="Hortensias frescas — Distribuidora de Flores Pérez"
                    onError={() => setImgErr(true)}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>

              {/* Badge flotante */}
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -bottom-5 -right-5 bg-yellow-300 rounded-2xl px-5 py-3.5 shadow-xl border-2 border-white"
              >
                <p className="font-serif font-semibold text-green-900 text-xl leading-none">+10</p>
                <p className="font-sans text-green-800 text-[11px] font-medium">años de pasión</p>
              </motion.div>

              <motion.div
                animate={{ y: [0, 5, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
                className="absolute -top-4 -left-4 bg-white rounded-2xl px-4 py-2.5 shadow-lg border border-green-100"
              >
                <p className="font-sans text-green-700 font-semibold text-sm">🌿 100% Frescas</p>
              </motion.div>
            </div>
          </motion.div>

          {/* Texto */}
          <motion.div
            initial={{ opacity: 0, x: 45 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.75, ease: 'easeOut' }}
          >
            <p className="font-sans text-[11px] uppercase tracking-[0.32em] text-sky-500 font-semibold mb-4">
              Sobre Nosotros
            </p>
            <div className="w-10 h-px bg-green-200 mb-5" />
            <h2 className="font-serif text-4xl sm:text-5xl font-light text-green-900 leading-tight mb-2">
              Una pasión que
            </h2>
            <h2 className="font-serif italic text-4xl sm:text-5xl font-light text-green-600 leading-tight mb-8">
              florece cada día
            </h2>

            <div className="space-y-4 text-gray-500 font-sans text-[14px] leading-[1.85]">
              <p>
                En <strong className="text-green-700 font-semibold">Distribuidora de Flores Pérez</strong>,
                llevamos más de una década cultivando una relación especial con la naturaleza y con cada uno
                de nuestros clientes. Cada flor que llega a tus manos es elegida con cuidado y profundo amor.
              </p>
              <p>
                Creemos que las flores transforman momentos y comunican emociones que las palabras no alcanzan.
                Trabajamos de la mano con los mejores cultivadores locales para garantizarte frescura y calidad.
              </p>
              <p className="text-green-500 font-medium italic font-serif text-base">
                Tu felicidad es nuestra mayor cosecha.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 mt-10">
              {[
                { num: '+500', label: 'Clientes',    bg: 'bg-green-50 border-green-200' },
                { num: '+50',  label: 'Variedades',  bg: 'bg-sky-50 border-sky-200'   },
                { num: '10+',  label: 'Años',        bg: 'bg-yellow-50 border-yellow-200' },
              ].map((s, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 + i * 0.1, type: 'spring', damping: 14 }}
                  className={`rounded-2xl border p-4 text-center ${s.bg}`}
                >
                  <p className="font-serif text-2xl font-semibold text-green-700">{s.num}</p>
                  <p className="font-sans text-green-500 text-[11px] mt-0.5 font-medium">{s.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

// ============================================================
// CONTACTO
// ============================================================
function Contacto() {
  return (
    <section id="contacto" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <p className="font-sans text-[11px] uppercase tracking-[0.32em] text-sky-500 font-semibold mb-4">Hablemos</p>
          <div className="w-12 h-px bg-green-200 mx-auto mb-5" />
          <h2 className="font-serif text-4xl sm:text-5xl font-light text-green-900 mb-4 tracking-wide">
            Contáctanos
          </h2>
          <p className="font-sans text-gray-400 text-[14px] max-w-md mx-auto leading-relaxed">
            Estamos aquí para ayudarte a encontrar la flor perfecta para cada momento.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-5 max-w-2xl mx-auto">

          {/* WhatsApp */}
          <motion.a
            href="https://wa.me/527221775980"
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            whileHover={{ y: -7, scale: 1.015 }}
            className="block bg-gradient-to-br from-green-50 to-emerald-100 border border-green-200 rounded-3xl p-8 shadow-sm hover:shadow-lg transition-all cursor-pointer"
          >
            <div className="text-4xl mb-5">📱</div>
            <h3 className="font-serif text-xl font-semibold text-green-900 mb-2">WhatsApp</h3>
            <p className="font-sans text-green-600 text-[13px] leading-relaxed mb-5">
              Escríbenos para pedidos, precios y disponibilidad. ¡Respondemos rápido!
            </p>
            <div className="bg-white/80 rounded-xl px-4 py-2.5 inline-block mb-4 border border-green-200">
              <span className="font-sans font-bold text-green-800 text-sm tracking-wide">+52 722 177 5980</span>
            </div>
            <p className="font-sans text-green-500 text-[11px] font-medium">✓ Lun – Sáb · 8:00 am – 7:00 pm</p>
          </motion.a>

          {/* Facebook */}
          <motion.a
            href="https://www.facebook.com/profile.php?id=61589420878264"
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            whileHover={{ y: -7, scale: 1.015 }}
            className="block bg-gradient-to-br from-sky-50 to-blue-100 border border-sky-200 rounded-3xl p-8 shadow-sm hover:shadow-lg transition-all cursor-pointer"
          >
            <div className="text-4xl mb-5">👍</div>
            <h3 className="font-serif text-xl font-semibold text-sky-900 mb-2">Facebook</h3>
            <p className="font-sans text-sky-600 text-[13px] leading-relaxed mb-5">
              Síguenos para novedades, promociones exclusivas y arreglos especiales.
            </p>
            <div className="bg-white/80 rounded-xl px-4 py-2.5 inline-block mb-4 border border-sky-200">
              <span className="font-sans font-bold text-sky-800 text-sm">Flores Pérez Oficial</span>
            </div>
            <p className="font-sans text-sky-500 text-[11px] font-medium">✓ Fotos, reseñas y promociones</p>
          </motion.a>
        </div>

        {/* Ubicación */}
        <motion.div
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.3 }}
          className="mt-12 text-center"
        >
          <span className="font-sans inline-flex items-center gap-2 bg-green-50 border border-green-200 rounded-full px-6 py-2.5 text-green-600 text-[12px] font-medium shadow-sm">
            📍 Estado de México — Entregas locales disponibles
          </span>
        </motion.div>
      </div>
    </section>
  )
}

// ============================================================
// FOOTER
// ============================================================
function Footer() {
  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

  return (
    <footer className="bg-green-900 text-white">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 py-14">
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-10">

          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-full bg-green-100/20 flex items-center justify-center text-xl">🌸</div>
              <div>
                <p className="font-serif font-semibold text-xl leading-tight">Flores Pérez</p>
                <p className="font-sans text-green-400 text-[10px] uppercase tracking-widest">Distribuidora</p>
              </div>
            </div>
            <p className="font-sans text-green-300/60 text-[13px] leading-relaxed max-w-xs">
              Llevando belleza y frescura a tu vida con flores elegidas con pasión.
            </p>
          </div>

          <div>
            <h4 className="font-sans text-green-400 font-semibold text-[10px] uppercase tracking-[0.22em] mb-5">Navegación</h4>
            <ul className="space-y-3">
              {[
                { label: 'Catálogo',       id: 'catalogo' },
                { label: 'Sobre Nosotros', id: 'nosotros'  },
                { label: 'Contacto',       id: 'contacto'  },
              ].map(({ label, id }) => (
                <li key={id}>
                  <button onClick={() => scrollTo(id)} className="font-sans text-green-400/60 hover:text-sky-300 transition-colors text-[13px] flex items-center gap-2">
                    <span className="text-green-600 text-xs">›</span> {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-sans text-green-400 font-semibold text-[10px] uppercase tracking-[0.22em] mb-5">Contacto Rápido</h4>
            <div className="space-y-4">
              <a href="https://wa.me/527221775980" className="font-sans flex items-center gap-3 text-green-400/60 hover:text-green-300 transition-colors text-[13px] group">
                <span className="text-base group-hover:scale-110 transition-transform inline-block">📱</span> +52 722 177 5980
              </a>
              <a href="https://www.facebook.com/profile.php?id=61589420878264" target="_blank" rel="noopener noreferrer"
                className="font-sans flex items-center gap-3 text-green-400/60 hover:text-sky-400 transition-colors text-[13px] group">
                <span className="text-base group-hover:scale-110 transition-transform inline-block">👍</span> Facebook Oficial
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-green-800 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-sans text-green-600 text-[12px]">
            © 2025 Distribuidora de Flores Pérez · Todos los derechos reservados.
          </p>
          <p className="font-sans text-green-600 text-[12px]">
            Desarrollado por{' '}
            <a href="https://calleros.me" target="_blank" rel="noopener noreferrer"
              className="text-sky-400 hover:text-sky-300 font-bold transition-colors">
              calleros.me
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}

// ============================================================
// TOAST
// ============================================================
function Toast({ message, onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2800)
    return () => clearTimeout(t)
  }, [onDone])

  return (
    <motion.div
      initial={{ opacity: 0, y: 55, scale: 0.92 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 35, scale: 0.92 }}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] bg-white border border-green-200 text-green-800 px-6 py-3.5 rounded-2xl shadow-xl flex items-center gap-3 font-sans text-sm font-semibold max-w-xs w-full pointer-events-none"
    >
      <span className="text-lg flex-shrink-0">🌸</span>
      <span>{message}</span>
    </motion.div>
  )
}

// ============================================================
// SCROLL TO TOP
// ============================================================
function ScrollToTop() {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const fn = () => setVisible(window.scrollY > 500)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0 }}
          whileHover={{ scale: 1.12 }} whileTap={{ scale: 0.9 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 z-40 bg-green-100 hover:bg-green-200 text-green-700 w-11 h-11 rounded-full shadow-md flex items-center justify-center text-base transition-colors border border-green-200"
          aria-label="Volver arriba"
        >
          ↑
        </motion.button>
      )}
    </AnimatePresence>
  )
}

// ============================================================
// APP
// ============================================================
export default function App() {
  const [cart, setCart]       = useState([])
  const [cartOpen, setCartOpen] = useState(false)
  const [toast, setToast]     = useState(null)

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === product.id)
      if (existing) return prev.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i)
      return [...prev, { ...product, quantity: 1 }]
    })
    setToast(`${product.name} añadido`)
    setCartOpen(true)
  }

  const removeFromCart = (id) => setCart(prev => prev.filter(i => i.id !== id))

  const updateQty = (id, delta) =>
    setCart(prev => prev.map(i => i.id === id ? { ...i, quantity: i.quantity + delta } : i).filter(i => i.quantity > 0))

  const cartCount = cart.reduce((s, i) => s + i.quantity, 0)

  useEffect(() => {
    document.body.style.overflow = cartOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [cartOpen])

  return (
    <div className="min-h-screen font-sans antialiased">
      <Header cartCount={cartCount} onCartToggle={() => setCartOpen(v => !v)} />

      <main>
        <Hero />
        <Catalogo cart={cart} onAddToCart={addToCart} />
        <SobreNosotros />
        <ArregloPersonalizado />
        <Contacto />
      </main>

      <Footer />
      <ScrollToTop />

      <AnimatePresence>
        {cartOpen && (
          <CartSidebar cart={cart} onClose={() => setCartOpen(false)} onRemove={removeFromCart} onUpdateQty={updateQty} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toast && <Toast key={toast} message={toast} onDone={() => setToast(null)} />}
      </AnimatePresence>
    </div>
  )
}
