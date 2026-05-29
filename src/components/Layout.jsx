import Sidebar from './Sidebar'

/**
 * @component Layout
 * @descripción Componente de diseño principal que envuelve el contenido con el Sidebar
 * @param {Object} props - Propiedades del componente
 * @param {React.ReactNode} props.children - Contenido a renderizar en el área principal
 * @returns {JSX.Element} Estructura de diseño con sidebar y área de contenido
 */
export default function Layout({ children }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 ml-64 p-8 bg-slate-50">
        {children}
      </main>
    </div>
  )
}
