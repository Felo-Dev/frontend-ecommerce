import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShoppingCart, Search, Plus, Minus, Trash2, X, Star, Tag, Eye, Info, Package } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const mockProducts = [
  {
    id: 1, name: 'Laptop Pro 15"', price: 24999, compareAtPrice: 29999,
    category: 'Electrónica', stock: 15, image: '💻',
    brand: 'TechPro', model: 'TP-15-2026',
    description: 'Laptop profesional con procesador Intel Core i7 de 13ra generación, 16GB RAM DDR5, 512GB SSD NVMe y pantalla de 15.6 pulgadas Full HD IPS. Ideal para desarrollo, diseño y trabajo pesado.',
    specs: ['Intel Core i7-13700H (14 núcleos)', '16GB DDR5 RAM 5200MHz', '512GB NVMe SSD PCIe 4.0', '15.6" FHD IPS 1920x1080 144Hz', 'WiFi 6E, Bluetooth 5.3', 'Batería 56Wh hasta 10h', 'USB-C Thunderbolt 4, HDMI 2.1', 'Windows 11 Pro'],
    rating: 4.5, reviews: 128, featured: true, color: 'Gris espacial',
  },
  {
    id: 2, name: 'Monitor 27" 4K UHD', price: 8999, compareAtPrice: 10999,
    category: 'Electrónica', stock: 8, image: '🖥️',
    brand: 'ViewMax', model: 'VM-27-4K',
    description: 'Monitor profesional 27 pulgadas con resolución 4K UHD, panel IPS con HDR10, 99% sRGB. Ideal para diseñadores, editores de video y productividad.',
    specs: ['27" 4K UHD 3840x2160 IPS', 'HDR10, 99% sRGB, Delta E<2', '60Hz, 4ms GTG', 'USB-C 65W PD, HDMI 2.1, DP 1.4', 'Altavoces estéreo 3W', 'VESA 100x100 ajustable', 'Flicker Free, Low Blue Light'],
    rating: 4.3, reviews: 85, featured: true, color: 'Negro',
  },
  {
    id: 3, name: 'Teclado Mecánico RGB', price: 2499, compareAtPrice: 3299,
    category: 'Accesorios', stock: 30, image: '⌨️',
    brand: 'KeyMaster', model: 'KM-RGB-Pro',
    description: 'Teclado mecánico gaming con switches Cherry MX Red, retroiluminación RGB personalizable y construcción en aluminio. Cable desmontable USB-C.',
    specs: ['Switches Cherry MX Red (lineal)', 'Retroiluminación RGB por tecla', 'Layout 75% compacto', 'Aluminio anodizado', 'Keycaps PBT doubleshot', 'USB-C desmontable', 'Anti-ghosting N-key rollover', 'Software de configuración'],
    rating: 4.7, reviews: 203, featured: false, color: 'Negro RGB',
  },
  {
    id: 4, name: 'Mouse Inalámbrico Pro', price: 1299, compareAtPrice: null,
    category: 'Accesorios', stock: 25, image: '🖱️',
    brand: 'ClickTech', model: 'CT-Pro-Wireless',
    description: 'Mouse ergonómico inalámbrico con sensor óptico de 16000 DPI, 6 botones programables y batería recargable de larga duración. Conexión USB-C y Bluetooth 5.0.',
    specs: ['Sensor óptico 16000 DPI', '6 botones programables', 'Bluetooth 5.0 + USB-C', 'Batería 800mAh (30 días)', 'Peso 89g', 'Ergonómico diestro', 'Software de configuración', 'Compatibilidad Win/Mac/Linux'],
    rating: 4.2, reviews: 67, featured: false,
  },
  {
    id: 5, name: 'Audífonos Bluetooth ANC', price: 3499, compareAtPrice: 4499,
    category: 'Audio', stock: 20, image: '🎧',
    brand: 'SoundWave', model: 'SW-ANC-Pro',
    description: 'Audífonos inalámbricos over-ear con cancelación activa de ruido (ANC), códec aptX HD, 40h de batería y drivers de 40mm con neodimio. Plegables e incluyen estuche de carga.',
    specs: ['Cancelación activa de ruido adaptativa', 'Drivers 40mm neodimio', 'Códec aptX HD, AAC, SBC', '40h batería con ANC', 'Carga rápida USB-C (10min=2h)', 'Plegables con estuche', 'Micrófono ENC x4', 'App ecualizador', 'Peso 250g'],
    rating: 4.6, reviews: 156, featured: false, color: 'Negro mate',
  },
  {
    id: 6, name: 'Webcam HD 1080p Pro', price: 1899, compareAtPrice: 2199,
    category: 'Accesorios', stock: 12, image: '📹',
    brand: 'ClearView', model: 'CV-1080-Pro',
    description: 'Cámara web profesional con resolución 1080p 60fps, autoenfoque, corrección de luz y micrófono estéreo con cancelación de ruido. Ideal para videollamadas y streaming.',
    specs: ['1080p 60fps Full HD', 'Autoenfoque y exposición automática', 'Corrección de luz HDR', 'Micrófono estéreo dual ENC', 'Campo visión 90°', 'Clip universal + trípode', 'Plug & Play USB-C', 'Obturador de privacidad'],
    rating: 4.1, reviews: 43, featured: false, color: 'Negro',
  },
  {
    id: 7, name: 'Tablet 11" Pro', price: 15999, compareAtPrice: null,
    category: 'Electrónica', stock: 10, image: '📱',
    brand: 'TechPro', model: 'TP-Tab-11',
    description: 'Tablet profesional de 11 pulgadas con pantalla OLED 2K, 8GB RAM, 256GB almacenamiento y lápiz táctil incluido. Perfecta para diseño, notas y entretenimiento.',
    specs: ['11" OLED 2K 2560x1600', '8GB LPDDR5 RAM', '256GB UFS 3.1', 'Lápiz táctil 4096 niveles', 'Batería 8000mAh', 'USB-C 3.2, WiFi 6', '4 altavoces estéreo', 'Android 14 / iPadOS'],
    rating: 4.4, reviews: 92, featured: true, color: 'Plateado',
  },
  {
    id: 8, name: 'Cargador USB-C 65W GaN', price: 699, compareAtPrice: 899,
    category: 'Accesorios', stock: 50, image: '🔌',
    brand: 'PowerX', model: 'PX-GaN-65W',
    description: 'Cargador compacto con tecnología GaN (Nitruro de Galio) de 65W, 2 puertos USB-C PD y 1 USB-A QC. Carga rápida para laptops, tablets y smartphones.',
    specs: ['65W total (USB-C 45W + 20W)', 'Tecnología GaN (tamaño compacto)', '2x USB-C PD 3.0, 1x USB-A QC 3.0', 'Protección sobrecarga/cortocircuito', 'Plegable, incluye cable 1.5m', 'Compatible con laptops USB-C'],
    rating: 4.8, reviews: 312, featured: false,
  },
]

export default function UserProducts() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [search, setSearch] = useState('')
  const [cart, setCart] = useState({})
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [loginAlert, setLoginAlert] = useState(null)

  const filtered = mockProducts.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase()) ||
    p.brand?.toLowerCase().includes(search.toLowerCase()) ||
    p.description?.toLowerCase().includes(search.toLowerCase())
  )

  const onSale = mockProducts.filter(p => p.compareAtPrice && p.compareAtPrice > p.price)

  function toggleCart(productId) {
    if (!user) {
      setLoginAlert('Inicia sesión o crea una cuenta para agregar productos al carrito')
      return
    }
    setCart((prev) => {
      const next = { ...prev }
      if (next[productId]) {
        delete next[productId]
      } else {
        next[productId] = 1
      }
      return next
    })
  }

  function updateQty(productId, delta) {
    setCart((prev) => {
      const next = { ...prev }
      const newQty = (next[productId] || 0) + delta
      if (newQty <= 0) {
        delete next[productId]
      } else {
        next[productId] = newQty
      }
      return next
    })
  }

  function handleAddToCartFromModal(productId) {
    if (!user) {
      setLoginAlert('Inicia sesión o crea una cuenta para agregar productos al carrito')
      return
    }
    setCart(prev => ({ ...prev, [productId]: (prev[productId] || 0) + 1 }))
    setSelectedProduct(null)
  }

  const cartItems = Object.keys(cart).length
  const cartTotal = Object.entries(cart).reduce((sum, [id, qty]) => {
    const product = mockProducts.find((p) => p.id === Number(id))
    return sum + (product?.price || 0) * qty
  }, 0)

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Tienda</h1>
          <p className="text-slate-500 mt-1">Explora nuestros productos</p>
        </div>
        <div className="flex items-center gap-3">
          {onSale.length > 0 && (
            <span className="text-xs bg-red-50 text-red-600 px-2.5 py-1 rounded-full font-medium flex items-center gap-1">
              <Tag size={12} /> {onSale.length} en oferta
            </span>
          )}
          <button onClick={() => navigate('/user/cart')} className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-medium transition-colors cursor-pointer">
            <ShoppingCart size={16} />
            Carrito
            {cartItems > 0 && (
              <span className="ml-1 bg-white text-indigo-600 text-xs font-bold px-1.5 py-0.5 rounded-full">{cartItems}</span>
            )}
          </button>
        </div>
      </div>

      <div className="relative mb-6">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input type="text" placeholder="Buscar por nombre, categoría, marca..." value={search} onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
      </div>

      {loginAlert && (
        <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800 flex items-center justify-between">
          <span className="flex items-center gap-2"><Info size={16} /> {loginAlert}</span>
          <div className="flex gap-2">
            <button onClick={() => navigate('/login')} className="ml-3 px-3 py-1 bg-amber-600 text-white rounded-lg text-xs font-medium cursor-pointer hover:bg-amber-700">
              Iniciar sesión
            </button>
            <button onClick={() => setLoginAlert(null)} className="text-amber-500 hover:text-amber-700 cursor-pointer">
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filtered.map((product) => {
          const discount = product.compareAtPrice && product.compareAtPrice > product.price
            ? Math.round((1 - product.price / product.compareAtPrice) * 100)
            : 0
          const inCart = cart[product.id]

          return (
            <div key={product.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow group">
              <div className="p-5 pb-2 relative">
                {discount > 0 && (
                  <span className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full z-10 flex items-center gap-1">
                    <Tag size={10} /> -{discount}%
                  </span>
                )}
                {product.featured && !discount && (
                  <span className="absolute top-3 left-3 bg-indigo-500 text-white text-[10px] font-bold px-2 py-1 rounded-full z-10">
                    Destacado
                  </span>
                )}
                <div className="text-5xl mb-3 text-center">{product.image}</div>
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-slate-900 text-sm truncate">{product.name}</h3>
                    {product.brand && (
                      <p className="text-[11px] text-slate-400 mt-0.5">{product.brand} • {product.model}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <Star size={12} className="text-amber-400 fill-amber-400" />
                    <span className="text-xs font-medium text-slate-600">{product.rating}</span>
                  </div>
                </div>
                {product.description && (
                  <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">{product.description}</p>
                )}
                <div className="mt-3">
                  {discount > 0 ? (
                    <div className="flex items-center gap-2">
                      <p className="text-xl font-bold text-red-600">${product.price.toLocaleString()}</p>
                      <p className="text-xs text-slate-400 line-through">${product.compareAtPrice.toLocaleString()}</p>
                    </div>
                  ) : (
                    <p className="text-xl font-bold text-indigo-600">${product.price.toLocaleString()}</p>
                  )}
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  {product.stock > 5
                    ? <span className="text-emerald-600">{product.stock} en stock</span>
                    : product.stock > 0
                      ? <span className="text-amber-600">Solo {product.stock} restantes</span>
                      : <span className="text-red-600">Agotado</span>
                  }
                </p>
              </div>
              <div className="px-5 pb-5 space-y-2">
                <button onClick={() => setSelectedProduct(product)}
                  className="w-full py-2 border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-lg text-xs font-medium transition-colors cursor-pointer flex items-center justify-center gap-1.5">
                  <Eye size={14} /> Ver detalles
                </button>
                {inCart ? (
                  <div className="flex items-center gap-3">
                    <div className="flex items-center border border-slate-300 rounded-lg flex-1 justify-center">
                      <button onClick={() => updateQty(product.id, -1)} className="p-2 hover:bg-slate-50 cursor-pointer">
                        <Minus size={14} className="text-slate-500" />
                      </button>
                      <span className="px-3 text-sm font-medium text-slate-900">{inCart}</span>
                      <button onClick={() => updateQty(product.id, 1)} className="p-2 hover:bg-slate-50 cursor-pointer">
                        <Plus size={14} className="text-slate-500" />
                      </button>
                    </div>
                    <button onClick={() => toggleCart(product.id)} className="p-2 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors cursor-pointer">
                      <Trash2 size={16} />
                    </button>
                  </div>
                ) : (
                  <button onClick={() => toggleCart(product.id)}
                    className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors cursor-pointer flex items-center justify-center gap-1.5">
                    <ShoppingCart size={15} /> Agregar al carrito
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <Package size={48} className="mx-auto text-slate-300 mb-4" />
          <p className="text-slate-500">No se encontraron productos</p>
        </div>
      )}

      {cartItems > 0 && (
        <div className="fixed bottom-6 right-6 bg-white rounded-2xl shadow-xl border border-slate-200 p-5 w-80 z-40">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-slate-900">Carrito ({cartItems})</h3>
            <ShoppingCart size={18} className="text-indigo-600" />
          </div>
          <div className="space-y-2 mb-3 max-h-40 overflow-y-auto">
            {Object.entries(cart).map(([id, qty]) => {
              const product = mockProducts.find((p) => p.id === Number(id))
              if (!product) return null
              return (
                <div key={id} className="flex items-center justify-between text-sm">
                  <span className="text-slate-700 truncate">{product.name} x{qty}</span>
                  <span className="font-medium text-slate-900">${(product.price * qty).toLocaleString()}</span>
                </div>
              )
            })}
          </div>
          <div className="border-t border-slate-200 pt-3">
            <div className="flex items-center justify-between font-semibold text-slate-900">
              <span>Total</span>
              <span>${cartTotal.toLocaleString()}</span>
            </div>
          </div>
          <button onClick={() => navigate('/user/cart')} className="w-full mt-3 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-medium transition-colors cursor-pointer">
            Ir a pagar
          </button>
        </div>
      )}

      {selectedProduct && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedProduct(null)}>
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <h2 className="text-lg font-bold text-slate-900">{selectedProduct.name}</h2>
              <button onClick={() => setSelectedProduct(null)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 cursor-pointer">
                <X size={20} />
              </button>
            </div>

            <div className="p-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="text-7xl text-center md:w-1/3">{selectedProduct.image}</div>
                <div className="flex-1 space-y-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      {selectedProduct.brand && (
                        <span className="text-xs font-medium text-slate-400">{selectedProduct.brand}</span>
                      )}
                      {selectedProduct.model && (
                        <span className="text-xs text-slate-300">•</span>
                      )}
                      {selectedProduct.model && (
                        <span className="text-xs font-medium text-slate-400">Modelo: {selectedProduct.model}</span>
                      )}
                    </div>
                    <p className="text-sm text-slate-500">{selectedProduct.category}</p>
                  </div>

                  {selectedProduct.description && (
                    <div>
                      <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Descripción</h4>
                      <p className="text-sm text-slate-700 leading-relaxed">{selectedProduct.description}</p>
                    </div>
                  )}

                  {selectedProduct.color && (
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-slate-500">Color:</span>
                      <span className="font-medium text-slate-800">{selectedProduct.color}</span>
                    </div>
                  )}

                  {selectedProduct.specs && selectedProduct.specs.length > 0 && (
                    <div>
                      <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Especificaciones</h4>
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-1.5">
                        {selectedProduct.specs.map((spec, i) => (
                          <li key={i} className="text-xs text-slate-600 flex items-start gap-1.5">
                            <span className="text-indigo-400 mt-0.5">•</span>
                            {spec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      {[1,2,3,4,5].map(s => (
                        <Star key={s} size={14}
                          className={s <= Math.round(selectedProduct.rating) ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-slate-500">{selectedProduct.rating} ({selectedProduct.reviews} reseñas)</span>
                  </div>

                  <div className="border-t border-slate-100 pt-4">
                    {selectedProduct.compareAtPrice && selectedProduct.compareAtPrice > selectedProduct.price ? (
                      <div className="flex items-center gap-3">
                        <p className="text-2xl font-bold text-red-600">${selectedProduct.price.toLocaleString()}</p>
                        <p className="text-sm text-slate-400 line-through">${selectedProduct.compareAtPrice.toLocaleString()}</p>
                        <span className="text-xs bg-red-50 text-red-600 px-2 py-0.5 rounded-full font-bold">
                          -{Math.round((1 - selectedProduct.price / selectedProduct.compareAtPrice) * 100)}%
                        </span>
                      </div>
                    ) : (
                      <p className="text-2xl font-bold text-indigo-600">${selectedProduct.price.toLocaleString()}</p>
                    )}
                    <p className="text-xs text-slate-400 mt-1">
                      {selectedProduct.stock > 0
                        ? <span className="text-emerald-600">{selectedProduct.stock} en stock</span>
                        : <span className="text-red-600">Agotado</span>
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-slate-200 flex gap-3">
              <button onClick={() => setSelectedProduct(null)}
                className="flex-1 py-2.5 border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl text-sm font-medium transition-colors cursor-pointer">
                Seguir viendo
              </button>
              <button onClick={() => handleAddToCartFromModal(selectedProduct.id)}
                className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-medium transition-colors cursor-pointer flex items-center justify-center gap-2">
                <ShoppingCart size={16} /> Agregar al carrito
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
