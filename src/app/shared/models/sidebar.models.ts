export interface MenuItem {
  id: string;
  label: string;
  icon: string;
  active?: boolean;
  route?: string;
  expanded?: boolean;
  submenus?: MenuItem[];
  hasSubmenus?: boolean;
  permissions?: string[];
  visible?: boolean;
}

export interface SidebarConfig {
  logo?: {
    src: string;
    alt: string;
    title: string;
  };
  user?: {
    name: string;
    role: string;
    avatar?: string;
  };
  menuItems: MenuItem[];
}

export interface SidebarState {
  isCollapsed: boolean;
  activeMenuItem: string;
  expandedMenus: string[];
}
