import React, { createContext, useState, useContext, ReactNode } from "react"

// Define the context type
interface MenuContextType {
  isMenuOpen: boolean
  toggleMenu: () => void
}

// Create the context
const MenuContext = createContext<MenuContextType | undefined>(undefined)

// Define provider props type
interface MenuProviderProps {
  children: ReactNode
}

// Create the provider component
const MenuProvider: React.FC<MenuProviderProps> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false)

  const toggleMenu = () => {
    setIsMenuOpen(prevState => !prevState)
  }

  return (
    <MenuContext.Provider value={{ isMenuOpen, toggleMenu }}>
      {children}
    </MenuContext.Provider>
  )
}

// Custom hook for using the context
const useMenu = (): MenuContextType => {
  const context = useContext(MenuContext)
  if (!context) {
    throw new Error("useMenu must be used within a MenuProvider")
  }
  return context
}

export { MenuProvider, useMenu }
