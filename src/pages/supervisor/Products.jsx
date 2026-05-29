import AdminProducts from '../admin/Products'

/**
 * @component SupervisorProducts
 * @descripción Página de productos para supervisores, reutiliza AdminProducts con rol moderator
 * @returns {JSX.Element} Componente AdminProducts configurado para moderador
 */
export default function SupervisorProducts() {
  return <AdminProducts role="moderator" />
}
