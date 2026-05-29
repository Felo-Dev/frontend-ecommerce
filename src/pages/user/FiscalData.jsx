import { useState, useEffect } from 'react'
import { FileText, Save, Loader2, CheckCircle, AlertCircle } from 'lucide-react'
import { api } from '../../api/client'

const TAX_REGIMES = [
  { code: '601', description: 'General de Ley Personas Morales' },
  { code: '603', description: 'Personas Morales con Fines no Lucrativos' },
  { code: '605', description: 'Sueldos y Salarios e Ingresos Asimilados a Salarios' },
  { code: '606', description: 'Arrendamiento' },
  { code: '607', description: 'Régimen de Enajenación o Adquisición de Bienes' },
  { code: '608', description: 'Demás ingresos' },
  { code: '610', description: 'Residentes en el Extranjero sin Establecimiento Permanente en México' },
  { code: '611', description: 'Ingresos por Dividendos (socios y accionistas)' },
  { code: '612', description: 'Personas Físicas con Actividades Empresariales y Profesionales' },
  { code: '614', description: 'Ingresos por intereses' },
  { code: '615', description: 'Régimen de los ingresos por obtención de premios' },
  { code: '616', description: 'Sin obligaciones fiscales' },
  { code: '620', description: 'Sociedades Cooperativas de Producción que optan por diferir sus ingresos' },
  { code: '621', description: 'Incorporación Fiscal' },
  { code: '622', description: 'Actividades Agrícolas, Ganaderas, Silvícolas y Pesqueras' },
  { code: '623', description: 'Opcional para Grupos de Sociedades' },
  { code: '624', description: 'Coordinados' },
  { code: '625', description: 'Régimen de las Actividades Empresariales con ingresos a través de Plataformas Tecnológicas' },
  { code: '626', description: 'Régimen Simplificado de Confianza' },
]

const CFDI_USAGES = [
  { code: 'G01', description: 'Adquisición de mercancias' },
  { code: 'G02', description: 'Devoluciones, descuentos o bonificaciones' },
  { code: 'G03', description: 'Gastos en general' },
  { code: 'G04', description: 'Construcciones' },
  { code: 'G05', description: 'Mobiliario y equipo de oficina por inversiones' },
  { code: 'G06', description: 'Equipo de transporte' },
  { code: 'G07', description: 'Equipo de cómputo y accesorios' },
  { code: 'G08', description: 'Dados, troqueles, moldes, matrices y herramental' },
  { code: 'G09', description: 'Comunicaciones telefónicas' },
  { code: 'D01', description: 'Honorarios médicos, dentales y gastos hospitalarios' },
  { code: 'D02', description: 'Gastos médicos por incapacidad o discapacidad' },
  { code: 'D03', description: 'Gastos funerales' },
  { code: 'D04', description: 'Donativos' },
  { code: 'D05', description: 'Intereses reales efectivamente pagados por créditos hipotecarios' },
  { code: 'D10', description: 'Pagos por servicios educativos (colegiaturas)' },
  { code: 'P01', description: 'Por definir' },
]

export default function UserFiscalData() {
  const [data, setData] = useState({
    rfc: '',
    legalName: '',
    taxRegime: '601',
    cfdiUsage: 'G03',
    taxEmail: '',
    phone: '',
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState(null)
  const [error, setError] = useState(null)
  const [hasData, setHasData] = useState(false)

  useEffect(() => {
    loadFiscalData()
  }, [])

  async function loadFiscalData() {
    try {
      setLoading(true)
      const res = await api.fiscalData.get()
      if (res.data && res.data.rfc) {
        setData({
          rfc: res.data.rfc || '',
          legalName: res.data.legal_name || '',
          taxRegime: res.data.tax_regime || '601',
          cfdiUsage: res.data.cfdi_usage || 'G03',
          taxEmail: res.data.tax_email || '',
          phone: res.data.phone || '',
        })
        setHasData(true)
      }
    } catch {
      // no fiscal data yet
    } finally {
      setLoading(false)
    }
  }

  async function handleSave(e) {
    e.preventDefault()
    try {
      setSaving(true)
      setError(null)
      setMessage(null)
      await api.fiscalData.save(data)
      setHasData(true)
      setMessage('Datos fiscales guardados exitosamente')
    } catch (err) {
      setError(err.message || 'Error al guardar datos fiscales')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={32} className="animate-spin text-indigo-600" />
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <FileText className="text-indigo-600" size={24} /> Datos Fiscales
        </h1>
        <p className="text-slate-500 mt-1">Registra tu RFC y régimen fiscal para facturación electrónica CFDI</p>
      </div>

      {message && (
        <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-sm text-emerald-700 flex items-center gap-2">
          <CheckCircle size={16} /> {message}
        </div>
      )}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 flex items-center gap-2">
          <AlertCircle size={16} /> {error}
        </div>
      )}

      {hasData && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-xl text-sm text-blue-700">
          Ya tienes datos fiscales registrados. Puedes actualizarlos si es necesario.
        </div>
      )}

      <form onSubmit={handleSave} className="bg-white rounded-xl border border-slate-200 p-6 max-w-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1">RFC *</label>
            <input type="text" value={data.rfc} onChange={e => setData({ ...data, rfc: e.target.value.toUpperCase() })}
              placeholder="XAXX010101000"
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required maxLength={13} />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1">Razón Social *</label>
            <input type="text" value={data.legalName} onChange={e => setData({ ...data, legalName: e.target.value })}
              placeholder="Nombre completo o razón social"
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Régimen Fiscal *</label>
            <select value={data.taxRegime} onChange={e => setData({ ...data, taxRegime: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
              {TAX_REGIMES.map(r => (
                <option key={r.code} value={r.code}>{r.code} - {r.description}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Uso de CFDI *</label>
            <select value={data.cfdiUsage} onChange={e => setData({ ...data, cfdiUsage: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
              {CFDI_USAGES.map(u => (
                <option key={u.code} value={u.code}>{u.code} - {u.description}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Correo Fiscal</label>
            <input type="email" value={data.taxEmail} onChange={e => setData({ ...data, taxEmail: e.target.value })}
              placeholder="correo@ejemplo.com"
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Teléfono</label>
            <input type="text" value={data.phone} onChange={e => setData({ ...data, phone: e.target.value })}
              placeholder="5512345678"
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
        </div>

        <button type="submit" disabled={saving}
          className="mt-6 py-2.5 px-6 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white rounded-xl text-sm font-medium transition-colors cursor-pointer disabled:cursor-not-allowed flex items-center gap-2">
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          {saving ? 'Guardando...' : 'Guardar datos fiscales'}
        </button>
      </form>
    </div>
  )
}
