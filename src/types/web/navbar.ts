import { Dispatch, SetStateAction } from "react";

export interface NavbarActionsProps {
  setMobileMenuOpen: (v: boolean) => void;
  mobileMenuOpen: boolean;
}

export interface NavbarMenuProps {
  navItems: any[];
  open: string | null;
  setOpen: (v: string | null) => void;
  route: any;
}


export interface NavbarMobileProps {
  isClosing: boolean;
  backdropDone: boolean;
  drawerDelay: number;
  open: string | null;
  setOpen: Dispatch<SetStateAction<string | null>>; 
  setMobileMenuOpen: Dispatch<SetStateAction<boolean>>; 
   navItems: NavItem[];
}

export interface DropdownOptionItemProps {
  opt: DropdownOption;
  open: string | null;
  setOpen: (v: string | null) => void;
  hovered: string | null;
  setHovered: (v: string | null) => void;
}

export interface DropdownSubmenuProps {
  parent: DropdownOption;
  open: string | null;
  displayLabel: string;
  hovered: string | null;
  setHovered: (v: string | null) => void;
  setOpen: (v: string | null) => void;
}


export interface DropdownOption {
  label?: string;
  href?: string;
  image?: string;
  name?: string;
  children?: DropdownOption[];
}

export interface NavbarDropdownProps {
  options: DropdownOption[];
}

export interface MobileBackdropProps {
  isClosing: boolean;
  drawerDelay: number;
}

export interface MobileDrawerProps {
  drawerDelay: number; 
  isClosing: boolean;
  open: string | null;
  setOpen: React.Dispatch<React.SetStateAction<string | null>>;
  setMobileMenuOpen: (open: boolean) => void;
   navItems: NavItem[];
}

export interface MobileDropdownItemProps {
  item: NavItem;
  open: string | null;
  setOpen: React.Dispatch<React.SetStateAction<string | null>>;
  setMobileMenuOpen: (open: boolean) => void;
  level?: number;
}

export interface NavItem {
  label: string;
  href?: string;
  dropdown?: NavItem[] | null;
}

export interface DropdownOption {
  label?: string;
  icon?: string;
  image?: string;
  name?: string;
  href?: string;
  children?: DropdownOption[];
}

export interface DropdownProps {
  options: (DropdownOption | string)[];
  label: string; 
}