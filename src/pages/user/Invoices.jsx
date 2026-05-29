import { useState, useEffect } from 'react'
import { FileText, Download, Loader2, AlertCircle, CheckCircle, XCircle, FileDown, Stamp } from 'lucide-react'
import { api } from '../../api/client'

const statusStyles = {
  pending: 'bg-amber-100 text-amber-700',
  stamped: 'bg-emerald-100 text-emerald-700',
  canceled: 'bg-red-100 text-red-700',
}

const statusLabels = {
  pending: 'Pendiente',
  stamped: 'Timbrda',
  canceled: 'Cancelada',
}

export default function UserInvoices() {
  const [invoices, setInvoices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [actionLoading, setActionLoading] = useState(null)
  const [filter, setFilter] = useState('')

  useEffect(() => {
    loadInvoices()
  }, [filter])

  async function loadInvoices() {
    try {
      setLoading(true)
      setError(null)
      const params = {}
      if (filter) params.status = filter
      const res = await api.invoices.list(params)
      setInvoices(res.data || [])
    } catch (err) {
      setError(err.message || 'Error al cargar facturas')
    } finally {
      setLoading(false)
    }
  }

  async function handleStamp(invoiceId) {
    try {
      setActionLoading(invoiceId)
      await api.invoices.stamp(invoiceId)
      await loadInvoices()
    } catch (err) {
      setError(err.message || 'Error al timbrar factura')
    } finally {
      setActionLoading(null)
    }
  }

  async function handleCancel(invoiceId) {
    if (!confirm('¿Cancelar esta factura?')) return
    try {
      setActionLoading(invoiceId)
      await api.invoices.cancel(invoiceId, '01')
      await loadInvoices()
    } catch (err) {
      setError(err.message || 'Error al cancelar factura')
    } finally {
      setActionLoading(null)
    }
  }

  async function handleDownloadXml(invoiceId) {
    try {
      const xml = await api.invoices.getXml(invoiceId)
      const blob = new Blob([xml], { type: 'application/xml' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `CFDI-${invoiceId}.xml`
      a.click()
      URL.revokeObjectURL(url)
    } catch (err) {
      setError('Error al descargar XML')
    }
  }

  async function handleDownloadPdf(invoiceId) {
    try {
      const html = await api.invoices.getPdf(invoiceId)
      const blob = new Blob([html], { type: 'text/html' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `CFDI-${invoiceId}.html`
      a.click()
      URL.revokeObjectURL(url)
    } catch (err) {
      setError('Error al descargar PDF')
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <FileText className="text-indigo-600" size={24} /> Mis Facturas
          </h1>
          <p className="text-slate-500 mt-1">Facturación electrónica CFDI 4.0</p>
        </div>
        <div className="flex gap-2">
          {['', 'pending', 'stamped', 'canceled'].map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                filter === s ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}>
              {s ? statusLabels[s] : 'Todas'}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 flex items-center gap-2">
          <AlertCircle size={16} /> {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={32} className="animate-spin text-indigo-600" />
        </div>
      ) : invoices.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-slate-200">
          <FileText size={48} className="mx-auto text-slate-300 mb-4" />
          <p className="text-slate-500">No hay facturas</p>
          <p className="text-xs text-slate-400 mt-1">Las facturas se generan automáticamente al realizar un pedido con solicitud de factura</p>
        </div>
      ) : (
        <div className="space-y-3">
          {invoices.map((inv) => (
            <div key={inv.id} className="bg-white rounded-xl border border-slate-200 p-5">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-slate-900">
                      Factura {inv.invoice_serie || 'F'}{String(inv.invoice_folio || '').padStart(6, '0')}
                    </h3>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusStyles[inv.cfdi_status] || statusStyles.pending}`}>
                      {statusLabels[inv.cfdi_status] || inv.cfdi_status}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                    <div>
                      <span className="text-slate-500">Fecha:</span>
                      <p className="text-slate-900">{new Date(inv.created_at).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <span className="text-slate-500">RFC:</span>
                      <p className="text-slate-900">{inv.rfc_receptor}</p>
                    </div>
                    <div>
                      <span className="text-slate-500">Total:</span>
                      <p className="font-semibold text-slate-900">${parseFloat(inv.total).toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-slate-500">UUID:</span>
                      <p className="text-slate-900 text-xs truncate">{inv.cfdi_uuid || '—'}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  {inv.cfdi_status === 'pending' && (
                    <button onClick={() => handleStamp(inv.id)} disabled={actionLoading === inv.id}
                      className="p-2 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors cursor-pointer disabled:opacity-50" title="Timbrar CFDI">
                      {actionLoading === inv.id ? <Loader2 size={16} className="animate-spin" /> : <Stamp size={16} />}
                    </button>
                  )}
                  {inv.cfdi_status === 'stamped' && (
                    <>
                      <button onClick={() => handleDownloadXml(inv.id)} disabled={actionLoading === inv.id}
                        className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors cursor-pointer" title="Descargar XML">
                        <FileDown size={16} />
                      </button>
                      <button onClick={() => handleDownloadPdf(inv.id)} disabled={actionLoading === inv.id}
                        className="p-2 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors cursor-pointer" title="Ver PDF">
                        <Download size={16} />
                      </button>
                      <button onClick={() => handleCancel(inv.id)} disabled={actionLoading === inv.id}
                        className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors cursor-pointer" title="Cancelar">
                        <XCircle size={16} />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
