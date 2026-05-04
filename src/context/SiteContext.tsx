import React, { createContext, useContext, useState, useEffect } from 'react';

export interface MenuItem {
  name: string;
  description: string;
  price: string;
  image: string;
}

export interface MenuCategory {
  category: string;
  description?: string;
  image?: string;
  items: MenuItem[];
}

interface SiteData {
  hero: {
    title: string;
    subtitle: string;
    bgImage: string;
  };
  about: {
    title: string;
    subtitle: string;
    description: string;
    image: string;
  };
  menu: MenuCategory[];
  theme: {
    bgColor: string;
    accentColor: string;
    textColor: string;
  };
  contact: {
    phone: string;
    email: string;
    address: string;
  };
  settings: {
    deliveryEnabled: boolean;
    pickupEnabled: boolean;
    deliveryFee: string;
    minOrder: string;
  };
}

const defaultData: SiteData = {
  hero: {
    title: 'Experience the Art of Fine Dining',
    subtitle: 'From locally sourced ingredients to masterfully crafted recipes, Ruthy Eatery offers a culinary journey you won\'t forget.',
    bgImage: '/images/hero-eatery.jpg',
  },
  about: {
    title: 'About Us',
    subtitle: 'A Legacy of Flavor and Passion',
    description: 'Founded in 2015, Ruthy Eatery began with a simple mission: to bring honest, high-quality food to our community. Every dish we serve is a testament to our dedication to fresh ingredients and traditional techniques with a modern twist.',
    image: '/images/signature-dish.jpg',
  },
  menu: [
    {
      category: 'Food',
      description: 'Hearty main courses prepared with the finest locally sourced ingredients.',
      image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80',
      items: [
        { name: 'Grilled Ribeye', description: '12oz grass-fed beef with garlic herb butter.', price: '$34', image: 'https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=400&q=80' },
        { name: 'Pan-Seared Salmon', description: 'Wild-caught salmon with asparagus and lemon risotto.', price: '$28', image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=400&q=80' },
        { name: 'Herb Roasted Chicken', description: 'Free-range chicken with root vegetables and pan jus.', price: '$24', image: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=400&q=80' },
      ]
    },
    {
      category: 'Drinks',
      description: 'Craft cocktails, artisanal spirits, and a curated selection of fine wines.',
      image: 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=1200&q=80',
      items: [
        { name: 'Signature Old Fashioned', description: 'Bourbon, house-made bitters, orange peel.', price: '$12', image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=400&q=80' },
        { name: 'Elderflower Spritz', description: 'Gin, elderflower liqueur, prosecco, soda.', price: '$14', image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=400&q=80' },
        { name: 'Artisan Espresso Martini', description: 'Fresh espresso, vodka, coffee liqueur.', price: '$13', image: 'https://images.unsplash.com/photo-1545438102-799c3991ffb2?auto=format&fit=crop&w=400&q=80' },
      ]
    },
    {
      category: 'Desserts',
      description: 'Exquisite sweet endings handcrafted by our pastry chef daily.',
      image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=1200&q=80',
      items: [
        { name: 'Lava Cake', description: 'Warm chocolate center with vanilla bean gelato.', price: '$9', image: '/images/dessert.jpg' },
        { name: 'Lemon Tart', description: 'Shortbread crust with zesty lemon curd and berries.', price: '$8', image: 'https://images.unsplash.com/photo-1519915028121-7d3463d20b13?auto=format&fit=crop&w=400&q=80' },
        { name: 'Tiramisu', description: 'Classic Italian style with espresso-soaked ladyfingers.', price: '$9', image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=400&q=80' },
      ]
    }
  ],
  theme: {
    bgColor: '#ffffff',
    accentColor: '#d97706',
    textColor: '#111827',
  },
  contact: {
    phone: '(555) 123-4567',
    email: 'hello@ruthyeatery.com',
    address: '123 Culinary Ave, Foodie City, FC 12345',
  },
  settings: {
    deliveryEnabled: true,
    pickupEnabled: true,
    deliveryFee: '$5.00',
    minOrder: '$20.00',
  }
};

interface SiteContextType {
  data: SiteData;
  isLoading: boolean;
  updateData: (newData: Partial<SiteData>) => void;
  isAdmin: boolean;
  setIsAdmin: (val: boolean) => void;
  isLoggedIn: boolean;
  login: (password: string) => boolean;
  logout: () => void;
  resetToDefault: () => void;
}

const SiteContext = createContext<SiteContextType | undefined>(undefined);

import { backendService } from '../services/backendService';

export const SiteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<SiteData>(defaultData);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return sessionStorage.getItem('ruthy_admin_session') === 'true';
  });

  // Fetch from "Backend" on mount
  useEffect(() => {
    const init = async () => {
      const remoteData = await backendService.getSiteData();
      if (remoteData) {
        setData(remoteData as SiteData);
      }
      setIsLoading(false);
    };
    init();
  }, []);

  const updateData = async (newData: Partial<SiteData>) => {
    const updated = { ...data, ...newData } as SiteData;
    setData(updated);
    // Persist to "Backend"
    await backendService.saveSiteData(updated);
  };

  const login = (password: string) => {
    if (password === 'admin123') {
      setIsLoggedIn(true);
      sessionStorage.setItem('ruthy_admin_session', 'true');
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsLoggedIn(false);
    setIsAdmin(false);
    sessionStorage.removeItem('ruthy_admin_session');
  };

  const resetToDefault = () => {
    setData(defaultData);
  };

  return (
    <SiteContext.Provider value={{ data, isLoading, updateData, isAdmin, setIsAdmin, isLoggedIn, login, logout, resetToDefault }}>
      {children}
    </SiteContext.Provider>
  );
};

export const useSiteData = () => {
  const context = useContext(SiteContext);
  if (!context) throw new Error('useSiteData must be used within SiteProvider');
  return context;
};
