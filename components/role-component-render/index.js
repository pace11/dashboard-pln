const RoleComponentRender = ({ condition, children }) => {
  if (!condition) return null
  return <>{children}</>
}

export default RoleComponentRender
