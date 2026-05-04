import { useState } from 'react';
import { useSiteData, MenuItem } from '../context/SiteContext';
import { 
  LayoutDashboard, 
  Image as ImageIcon, 
  Type, 
  Utensils, 
  Palette, 
  Phone, 
  LogOut, 
  Save, 
  Plus, 
  Trash2, 
  ChevronRight,
  Home,
  Menu as MenuIcon,
  X,
  ExternalLink,
  ChevronUp,
  ChevronDown,
  Settings as SettingsIcon,
  Upload,
  Edit3,
  Image as LucideImage
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Login from '../components/Login';

const ImageUploadField = ({ label, value, onChange, presets = [] }: { 
  label: string, 
  value: string, 
  onChange: (val: string) => void,
  presets?: string[]
}) => {
  const [objectFit, setObjectFit] = useState<'cover' | 'contain'>('cover');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">{label}</label>
        {value && (
          <button 
            onClick={() => setObjectFit(prev => prev === 'cover' ? 'contain' : 'cover')}
            className="text-[10px] font-bold text-amber-600 uppercase flex items-center gap-1 hover:text-amber-700"
          >
            Fit: {objectFit}
          </button>
        )}
      </div>
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 space-y-4">
          <div className="flex gap-2">
            <div className="relative flex-1 group">
              <input
                type="text"
                value={value.startsWith('data:image') ? 'Uploaded Local Image' : value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full p-4 pl-12 border border-gray-200 rounded-2xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-amber-500/20 outline-none transition-all text-sm"
                placeholder="Paste image URL here..."
              />
              <Upload className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
            <label className="cursor-pointer bg-white border border-gray-200 hover:bg-gray-50 px-6 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-sm shrink-0">
              <Upload className="h-4 w-4 text-amber-600" />
              <span className="text-xs font-bold text-gray-700">Local File</span>
              <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
            </label>
            {value && (
              <button 
                onClick={() => onChange('')}
                className="p-4 border border-red-100 bg-white text-red-500 rounded-2xl hover:bg-red-50 transition-all shadow-sm"
                title="Remove Photo"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>
          
          {presets.length > 0 && (
            <div className="space-y-2">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Or choose from library</p>
              <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                {presets.map((p, i) => (
                  <button 
                    key={i}
                    onClick={() => onChange(p)}
                    className={`flex-none w-12 h-12 rounded-lg overflow-hidden border-2 transition-all ${value === p ? 'border-amber-600 ring-2 ring-amber-500/20' : 'border-transparent hover:border-gray-300'}`}
                  >
                    <img src={p} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="w-full md:w-48 h-32 rounded-2xl overflow-hidden border border-gray-100 bg-gray-50 shadow-inner relative group shrink-0">
          {value ? (
            <>
              <img src={value} alt="Preview" className={`w-full h-full object-${objectFit}`} />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-white text-[10px] font-bold uppercase">Current Preview</span>
              </div>
            </>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-gray-300">
              <LucideImage className="h-8 w-8 mb-2" />
              <span className="text-[10px] font-bold">No Image</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  const { data, updateData, isLoggedIn, logout, resetToDefault } = useSiteData();
  const [activeTab, setActiveTab] = useState('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<Record<number, boolean>>({ 0: true });
  const navigate = useNavigate();

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden relative">
           <Link to="/" className="absolute top-6 left-6 p-2 hover:bg-gray-100 rounded-full transition-colors">
             <Home className="h-6 w-6 text-gray-400" />
           </Link>
           <Login />
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleChange = (section: keyof typeof data, field: string, value: any) => {
    updateData({
      [section]: {
        ...(data[section] as any),
        [field]: value
      }
    });
  };

  const handleMenuChange = (catIdx: number, itemIdx: number, field: keyof MenuItem, value: string) => {
    const newMenu = [...data.menu];
    newMenu[catIdx].items[itemIdx][field] = value;
    updateData({ menu: newMenu });
  };

  const addMenuItem = (catIdx: number) => {
    const newMenu = [...data.menu];
    newMenu[catIdx].items.push({ 
      name: 'New Item', 
      description: 'Description of the dish', 
      price: '$0.00', 
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80' 
    });
    updateData({ menu: newMenu });
  };

  const addCategory = (type: 'Food' | 'Drinks' | 'Dessert' | 'Appetizers' | 'Other') => {
    const newMenu = [...data.menu];
    const defaultImages = {
      Food: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80',
      Drinks: 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=1200&q=80',
      Dessert: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=1200&q=80',
      Appetizers: 'https://images.unsplash.com/photo-1541014741259-df529411b96a?auto=format&fit=crop&w=1200&q=80',
      Other: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80'
    };
    
    newMenu.push({ 
      category: type, 
      description: `Premium selection of ${type.toLowerCase()}.`,
      image: defaultImages[type],
      items: [] 
    });
    updateData({ menu: newMenu });
    setExpandedCategories(prev => ({ ...prev, [newMenu.length - 1]: true }));
  };

  const removeCategory = (catIdx: number) => {
    if (confirm('Delete entire category and all its items?')) {
      const newMenu = [...data.menu];
      newMenu.splice(catIdx, 1);
      updateData({ menu: newMenu });
    }
  };

  const removeMenuItem = (catIdx: number, itemIdx: number) => {
    const newMenu = [...data.menu];
    newMenu[catIdx].items.splice(itemIdx, 1);
    updateData({ menu: newMenu });
  };

  const moveCategory = (index: number, direction: 'up' | 'down') => {
    const newMenu = [...data.menu];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex >= 0 && newIndex < newMenu.length) {
      [newMenu[index], newMenu[newIndex]] = [newMenu[newIndex], newMenu[index]];
      updateData({ menu: newMenu });
    }
  };

  const moveMenuItem = (catIdx: number, itemIdx: number, direction: 'up' | 'down') => {
    const newMenu = [...data.menu];
    const items = [...newMenu[catIdx].items];
    const newIndex = direction === 'up' ? itemIdx - 1 : itemIdx + 1;
    if (newIndex >= 0 && newIndex < items.length) {
      [items[itemIdx], items[newIndex]] = [items[newIndex], items[itemIdx]];
      newMenu[catIdx].items = items;
      updateData({ menu: newMenu });
    }
  };

  const toggleCategory = (idx: number) => {
    setExpandedCategories(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const [setupStep, setSetupStep] = useState(1);

  const SidebarItem = ({ id, icon: Icon, label }: { id: string, icon: any, label: string }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
        activeTab === id ? 'bg-amber-600 text-white shadow-lg' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
      }`}
    >
      <Icon className="h-5 w-5" />
      <span className={`font-semibold transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 md:hidden'}`}>
        {label}
      </span>
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className={`bg-white border-r border-gray-200 transition-all duration-300 flex flex-col ${isSidebarOpen ? 'w-72' : 'w-20'}`}>
        <div className="p-6 flex items-center justify-between">
          {isSidebarOpen && (
            <div className="flex items-center space-x-2">
              <div className="bg-amber-600 p-1.5 rounded-lg">
                <Utensils className="h-5 w-5 text-white" />
              </div>
              <span className="font-serif font-bold text-xl">Ruthy <span className="text-amber-600">Portal</span></span>
            </div>
          )}
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-gray-100 rounded-lg">
            {isSidebarOpen ? <X className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          <SidebarItem id="overview" icon={LayoutDashboard} label="Dashboard" />
          <div className="pt-4 pb-2 px-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Content Management</div>
          <SidebarItem id="hero" icon={ImageIcon} label="Hero Section" />
          <SidebarItem id="about" icon={Type} label="About Section" />
          <SidebarItem id="menu" icon={Utensils} label="Menu Settings" />
          <SidebarItem id="delivery" icon={SettingsIcon} label="Ordering & Delivery" />
          <div className="pt-4 pb-2 px-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Design & SEO</div>
          <SidebarItem id="theme" icon={Palette} label="Site Branding" />
          <SidebarItem id="contact" icon={Phone} label="Contact Info" />
        </nav>

        <div className="p-4 border-t border-gray-100 space-y-2 text-[10px]">
          <Link to="/" target="_blank" className="w-full flex items-center space-x-3 px-4 py-3 text-gray-500 hover:bg-gray-100 rounded-xl transition-all">
            <ExternalLink className="h-5 w-5" />
            <span className={`${isSidebarOpen ? 'block' : 'hidden'}`}>View Live Site</span>
          </Link>
          <button onClick={handleLogout} className="w-full flex items-center space-x-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl transition-all">
            <LogOut className="h-5 w-5" />
            <span className={`${isSidebarOpen ? 'block' : 'hidden'}`}>Log Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 h-20 flex items-center justify-between px-8 shrink-0">
          <div>
            <div className="flex items-center text-sm text-gray-400 space-x-2">
              <span>Admin</span>
              <ChevronRight className="h-3 w-3" />
              <span className="capitalize">{activeTab}</span>
            </div>
            <h1 className="text-xl font-bold text-gray-900 capitalize">{activeTab} Management</h1>
          </div>
          <div className="flex items-center space-x-4">
             <div className="flex items-center space-x-2 bg-green-50 px-3 py-1.5 rounded-full">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-[10px] font-bold text-green-700 uppercase tracking-widest">System Live</span>
             </div>
             <button className="bg-amber-600 hover:bg-amber-700 text-white px-5 py-2 rounded-lg font-bold text-sm shadow-lg shadow-amber-600/20 flex items-center gap-2">
               <Save className="h-4 w-4" /> Save Changes
             </button>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-5xl mx-auto">
            {activeTab === 'overview' && (
              <div className="grid md:grid-cols-2 gap-8">
                <div className="col-span-2 bg-gradient-to-r from-amber-600 to-amber-500 p-8 rounded-[2.5rem] text-white shadow-xl shadow-amber-600/10 flex justify-between items-center">
                  <div>
                    <h2 className="text-3xl font-serif font-bold mb-2">Welcome, Ruthy Admin</h2>
                    <p className="opacity-90 max-w-md">Your restaurant's digital presence is looking great. All changes you make here will be reflected on your website instantly.</p>
                  </div>
                  <button 
                    onClick={() => { if(confirm('Reset website to original default content?')) resetToDefault(); }}
                    className="bg-white/10 hover:bg-white/20 border border-white/20 px-4 py-2 rounded-xl text-sm font-bold transition-colors"
                  >
                    Reset Content
                  </button>
                </div>
                
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                   <h3 className="font-bold text-gray-900 mb-4">Quick Stats</h3>
                   <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-gray-50 rounded-xl">
                         <p className="text-xs font-bold text-gray-400 uppercase">Menu Items</p>
                         <p className="text-3xl font-bold text-amber-600">{data.menu.reduce((acc, cat) => acc + cat.items.length, 0)}</p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-xl">
                         <p className="text-xs font-bold text-gray-400 uppercase">Categories</p>
                         <p className="text-3xl font-bold text-amber-600">{data.menu.length}</p>
                      </div>
                   </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                   <h3 className="font-bold text-gray-900 mb-4">System Status</h3>
                   <div className="space-y-3">
                      <div className="flex justify-between items-center text-sm">
                         <span className="text-gray-500">Live Website</span>
                         <span className="text-green-600 font-bold">Online</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                         <span className="text-gray-500">Local Storage Sync</span>
                         <span className="text-green-600 font-bold">Active</span>
                      </div>
                   </div>
                </div>
              </div>
            )}

            {activeTab === 'hero' && (
              <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-8">
                 <div className="grid gap-8">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-gray-900">
                         <Type className="h-5 w-5 text-amber-600" />
                         <h3 className="font-bold">Hero Text Content</h3>
                      </div>
                      <div className="grid gap-4">
                        <div>
                          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Headline</label>
                          <textarea
                            value={data.hero.title}
                            onChange={(e) => handleChange('hero', 'title', e.target.value)}
                            className="w-full p-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-amber-500/20 outline-none min-h-[100px] text-lg font-serif"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Subtext / Description</label>
                          <textarea
                            value={data.hero.subtitle}
                            onChange={(e) => handleChange('hero', 'subtitle', e.target.value)}
                            className="w-full p-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-amber-500/20 outline-none min-h-[120px] text-gray-600"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="pt-8 border-t border-gray-100">
                      <div className="flex items-center gap-2 text-gray-900 mb-6">
                         <ImageIcon className="h-5 w-5 text-amber-600" />
                         <h3 className="font-bold">Visual Background</h3>
                      </div>
                      <ImageUploadField 
                        label="Hero Background Image"
                        value={data.hero.bgImage}
                        onChange={(val) => handleChange('hero', 'bgImage', val)}
                        presets={[
                          '/images/hero-eatery.jpg',
                          'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
                          'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=1200&q=80',
                          'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1200&q=80'
                        ]}
                      />
                    </div>
                 </div>
              </div>
            )}

            {activeTab === 'about' && (
              <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-8">
                <div className="grid gap-8">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-gray-900">
                       <Edit3 className="h-5 w-5 text-amber-600" />
                       <h3 className="font-bold">About Content</h3>
                    </div>
                    <div className="grid gap-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Category Label</label>
                          <input
                            type="text"
                            value={data.about.title}
                            onChange={(e) => handleChange('about', 'title', e.target.value)}
                            className="w-full p-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-amber-500/20 outline-none font-bold"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Main Headline</label>
                          <input
                            type="text"
                            value={data.about.subtitle}
                            onChange={(e) => handleChange('about', 'subtitle', e.target.value)}
                            className="w-full p-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-amber-500/20 outline-none font-serif text-lg"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Detailed Story</label>
                        <textarea
                          value={data.about.description}
                          onChange={(e) => handleChange('about', 'description', e.target.value)}
                          className="w-full p-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-amber-500/20 outline-none min-h-[150px] text-gray-600"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-8 border-t border-gray-100">
                    <div className="flex items-center gap-2 text-gray-900 mb-6">
                       <LucideImage className="h-5 w-5 text-amber-600" />
                       <h3 className="font-bold">Feature Image</h3>
                    </div>
                    <ImageUploadField 
                      label="Restaurant Signature Photo"
                      value={data.about.image}
                      onChange={(val) => handleChange('about', 'image', val)}
                      presets={[
                        '/images/signature-dish.jpg',
                        'https://images.unsplash.com/photo-1550966841-3ee7adac1668?auto=format&fit=crop&w=800&q=80',
                        'https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&w=800&q=80'
                      ]}
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'menu' && (
              <div className="space-y-8 pb-12">
                <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
                   <div className="space-y-1 text-center md:text-left">
                      <h3 className="font-bold text-gray-900 text-2xl">Menu Sections</h3>
                      <p className="text-sm text-gray-500 flex items-center gap-2 justify-center md:justify-start">
                         <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                         Connected to Node.js Backend
                      </p>
                   </div>
                   <div className="flex gap-4">
                      <button 
                        onClick={() => {
                          const allOpen = Object.values(expandedCategories).every(v => v);
                          const nextState: Record<number, boolean> = {};
                          data.menu.forEach((_, i) => nextState[i] = !allOpen);
                          setExpandedCategories(nextState);
                        }}
                        className="bg-gray-100 text-gray-700 px-6 py-5 rounded-[1.5rem] font-bold text-sm hover:bg-gray-200 transition-all"
                      >
                         Toggle All
                      </button>
                      <button 
                        onClick={() => setIsCategoryModalOpen(true)}
                        className="bg-gray-900 text-white px-10 py-5 rounded-[1.5rem] font-bold flex items-center gap-3 hover:bg-gray-800 transition-all shadow-xl shadow-gray-900/10 active:scale-95"
                      >
                        <Plus className="h-6 w-6" />
                        <span>New Category</span>
                      </button>
                   </div>
                </div>

                {/* Category Selection Modal */}
                <AnimatePresence>
                  {isCategoryModalOpen && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
                      <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        exit={{ opacity: 0 }}
                        onClick={() => setIsCategoryModalOpen(false)}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                      />
                      <motion.div 
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="relative bg-white w-full max-w-xl rounded-[3rem] shadow-2xl overflow-hidden"
                      >
                         <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <div>
                               <h3 className="text-3xl font-serif font-bold text-gray-900">Add Section</h3>
                               <p className="text-sm text-gray-500">Pick a starting template</p>
                            </div>
                            <button onClick={() => setIsCategoryModalOpen(false)} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                               <X className="h-6 w-6" />
                            </button>
                         </div>
                         <div className="p-8 grid grid-cols-2 gap-6">
                            {(['Food', 'Drinks', 'Dessert', 'Appetizers', 'Other'] as const).map(type => (
                              <button 
                                key={type}
                                onClick={() => {
                                  addCategory(type);
                                  setIsCategoryModalOpen(false);
                                }}
                                className="group flex flex-col items-center gap-4 p-8 rounded-[2rem] border-2 border-gray-50 hover:border-amber-600 hover:bg-amber-50 transition-all text-center"
                              >
                                <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                                  {type === 'Food' && <Utensils className="h-8 w-8 text-amber-600" />}
                                  {type === 'Drinks' && <Phone className="h-8 w-8 text-blue-500" />}
                                  {type === 'Dessert' && <Palette className="h-8 w-8 text-pink-500" />}
                                  {type === 'Appetizers' && <LayoutDashboard className="h-8 w-8 text-green-500" />}
                                  {type === 'Other' && <Plus className="h-8 w-8 text-gray-400" />}
                                </div>
                                <span className="font-bold text-gray-900 text-lg">{type}</span>
                              </button>
                            ))}
                         </div>
                      </motion.div>
                    </div>
                  )}
                </AnimatePresence>

                {data.menu.map((cat, catIdx) => (
                  <div key={catIdx} className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden transition-all duration-500">
                    <div className={`p-6 bg-gray-50 flex items-center justify-between cursor-pointer group ${expandedCategories[catIdx] ? 'border-b border-gray-100' : ''}`}
                         onClick={() => toggleCategory(catIdx)}>
                       <div className="flex items-center gap-6">
                          <div className="w-16 h-16 rounded-[1.25rem] overflow-hidden shadow-lg border-4 border-white group-hover:scale-110 transition-transform shrink-0">
                             <img src={cat.image} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex flex-col">
                             <input
                               type="text"
                               value={cat.category}
                               onClick={(e) => e.stopPropagation()}
                               onChange={(e) => {
                                 const newMenu = [...data.menu];
                                 newMenu[catIdx].category = e.target.value;
                                 updateData({ menu: newMenu });
                               }}
                               className="font-bold text-2xl bg-transparent border-none focus:ring-0 p-0 hover:text-amber-600 transition-colors"
                             />
                             <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{cat.items.length} dishes total</span>
                          </div>
                       </div>
                       
                       <div className="flex items-center gap-4" onClick={(e) => e.stopPropagation()}>
                          <div className="flex border border-gray-200 bg-white rounded-2xl overflow-hidden shadow-sm">
                            <button onClick={() => moveCategory(catIdx, 'up')} className="p-3 hover:bg-gray-50 text-gray-400 disabled:opacity-20 border-r border-gray-100" disabled={catIdx === 0}>
                              <ChevronUp className="h-6 w-6" />
                            </button>
                            <button onClick={() => moveCategory(catIdx, 'down')} className="p-3 hover:bg-gray-50 text-gray-400 disabled:opacity-20" disabled={catIdx === data.menu.length - 1}>
                              <ChevronDown className="h-6 w-6" />
                            </button>
                          </div>
                          <button 
                            onClick={() => toggleCategory(catIdx)}
                            className={`p-3 rounded-full hover:bg-gray-200 transition-transform duration-300 ${expandedCategories[catIdx] ? 'rotate-180' : ''}`}
                          >
                             <ChevronDown className="h-7 w-7 text-gray-400" />
                          </button>
                       </div>
                    </div>

                    <AnimatePresence>
                      {expandedCategories[catIdx] && (
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="p-8 space-y-12">
                             <div className="flex justify-between items-start pb-8 border-b border-gray-100">
                                <div className="space-y-6 flex-1">
                                   <div className="flex items-center justify-between">
                                      <h4 className="font-bold text-gray-900 uppercase tracking-widest text-xs">Section Customization</h4>
                                      <button 
                                        onClick={() => removeCategory(catIdx)}
                                        className="text-xs font-bold text-red-400 hover:text-red-600 flex items-center gap-1 transition-colors bg-red-50 px-3 py-1.5 rounded-lg"
                                      >
                                        <Trash2 className="h-3.5 w-3.5" /> Delete
                                      </button>
                                   </div>
                                   <div className="grid lg:grid-cols-2 gap-10">
                                      <div className="space-y-6">
                                         <div>
                                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Category Description</label>
                                            <textarea
                                              value={cat.description}
                                              onChange={(e) => {
                                                const newMenu = [...data.menu];
                                                newMenu[catIdx].description = e.target.value;
                                                updateData({ menu: newMenu });
                                              }}
                                              className="w-full p-5 border border-gray-200 rounded-3xl bg-white text-sm focus:ring-2 focus:ring-amber-500/20 outline-none transition-all leading-relaxed"
                                              placeholder="Tell a story about this section..."
                                              rows={3}
                                            />
                                         </div>
                                      </div>
                                      <ImageUploadField 
                                         label="Section Banner Photo"
                                         value={cat.image || ''}
                                         onChange={(val) => {
                                           const newMenu = [...data.menu];
                                           newMenu[catIdx].image = val;
                                           updateData({ menu: newMenu });
                                         }}
                                      />
                                   </div>
                                </div>
                             </div>

                             <div className="space-y-10">
                                <div className="flex justify-between items-center">
                                   <h4 className="font-bold text-gray-900 uppercase tracking-widest text-sm">Dishes & Drinks</h4>
                                   <button 
                                      onClick={() => addMenuItem(catIdx)}
                                      className="bg-gray-900 text-white px-8 py-4 rounded-2xl font-bold text-sm flex items-center gap-2 hover:bg-gray-800 transition-all shadow-lg"
                                    >
                                      <Plus className="h-5 w-5" /> Add New Item
                                    </button>
                                </div>

                                <div className="grid gap-10">
                                   {cat.items.map((item, itemIdx) => (
                                     <div key={itemIdx} className="p-8 border border-gray-100 rounded-[2.5rem] hover:border-amber-200 transition-all group relative bg-gray-50/20">
                                        <div className="absolute top-6 right-8 flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                           <button onClick={() => moveMenuItem(catIdx, itemIdx, 'up')} className="p-2 text-gray-300 hover:text-amber-600 disabled:opacity-10" disabled={itemIdx === 0}>
                                             <ChevronUp className="h-5 w-5" />
                                           </button>
                                           <button onClick={() => moveMenuItem(catIdx, itemIdx, 'down')} className="p-2 text-gray-300 hover:text-amber-600 disabled:opacity-10" disabled={itemIdx === cat.items.length - 1}>
                                             <ChevronDown className="h-5 w-5" />
                                           </button>
                                           <button onClick={() => removeMenuItem(catIdx, itemIdx)} className="p-2 text-gray-300 hover:text-red-500">
                                             <Trash2 className="h-5 w-5" />
                                           </button>
                                        </div>
                                        
                                        <div className="flex flex-col lg:flex-row gap-10">
                                           <div className="w-full lg:w-64 shrink-0">
                                              <ImageUploadField 
                                                 label="Dish Image"
                                                 value={item.image}
                                                 onChange={(val) => handleMenuChange(catIdx, itemIdx, 'image', val)}
                                              />
                                           </div>
                                           <div className="flex-1 space-y-6">
                                              <div className="grid md:grid-cols-4 gap-6">
                                                 <div className="col-span-3 space-y-2">
                                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Item Name</label>
                                                    <input 
                                                      type="text" 
                                                      value={item.name} 
                                                      onChange={(e) => handleMenuChange(catIdx, itemIdx, 'name', e.target.value)}
                                                      className="w-full font-bold text-gray-900 border border-gray-200 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all text-xl" 
                                                    />
                                                 </div>
                                                 <div className="space-y-2">
                                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Price</label>
                                                    <input 
                                                      type="text" 
                                                      value={item.price} 
                                                      onChange={(e) => handleMenuChange(catIdx, itemIdx, 'price', e.target.value)}
                                                      className="w-full font-mono text-amber-600 font-bold bg-amber-50 border border-amber-100 rounded-2xl px-5 py-4 outline-none text-xl" 
                                                    />
                                                 </div>
                                              </div>
                                              <div className="space-y-2">
                                                 <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Dish Description</label>
                                                 <textarea 
                                                   value={item.description} 
                                                   onChange={(e) => handleMenuChange(catIdx, itemIdx, 'description', e.target.value)}
                                                   className="w-full text-base text-gray-600 border border-gray-200 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-amber-500/20 outline-none min-h-[100px] leading-relaxed" 
                                                 />
                                              </div>
                                           </div>
                                        </div>
                                     </div>
                                   ))}
                                </div>
                             </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'theme' && (
              <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide">Background Color</label>
                    <div className="flex items-center gap-4">
                      <input 
                        type="color" 
                        value={data.theme.bgColor} 
                        onChange={(e) => handleChange('theme', 'bgColor', e.target.value)}
                        className="h-16 w-16 rounded-xl cursor-pointer"
                      />
                      <input 
                        type="text" 
                        value={data.theme.bgColor} 
                        onChange={(e) => handleChange('theme', 'bgColor', e.target.value)}
                        className="flex-1 p-4 border border-gray-200 rounded-xl font-mono uppercase"
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide">Accent Color (Buttons, Icons)</label>
                    <div className="flex items-center gap-4">
                      <input 
                        type="color" 
                        value={data.theme.accentColor} 
                        onChange={(e) => handleChange('theme', 'accentColor', e.target.value)}
                        className="h-16 w-16 rounded-xl cursor-pointer"
                      />
                      <input 
                        type="text" 
                        value={data.theme.accentColor} 
                        onChange={(e) => handleChange('theme', 'accentColor', e.target.value)}
                        className="flex-1 p-4 border border-gray-200 rounded-xl font-mono uppercase"
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide">Text Primary Color</label>
                    <div className="flex items-center gap-4">
                      <input 
                        type="color" 
                        value={data.theme.textColor} 
                        onChange={(e) => handleChange('theme', 'textColor', e.target.value)}
                        className="h-16 w-16 rounded-xl cursor-pointer"
                      />
                      <input 
                        type="text" 
                        value={data.theme.textColor} 
                        onChange={(e) => handleChange('theme', 'textColor', e.target.value)}
                        className="flex-1 p-4 border border-gray-200 rounded-xl font-mono uppercase"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'contact' && (
              <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6">
                <div className="grid gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Business Phone</label>
                    <input
                      type="text"
                      value={data.contact.phone}
                      onChange={(e) => handleChange('contact', 'phone', e.target.value)}
                      className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Business Email</label>
                    <input
                      type="email"
                      value={data.contact.email}
                      onChange={(e) => handleChange('contact', 'email', e.target.value)}
                      className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Full Address</label>
                    <textarea
                      value={data.contact.address}
                      onChange={(e) => handleChange('contact', 'address', e.target.value)}
                      className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 outline-none min-h-[100px]"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'delivery' && (
              <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-bold text-gray-700 uppercase">Enable Delivery</label>
                      <button 
                        onClick={() => handleChange('settings', 'deliveryEnabled', !data.settings.deliveryEnabled)}
                        className={`w-12 h-6 rounded-full transition-colors relative ${data.settings.deliveryEnabled ? 'bg-amber-600' : 'bg-gray-200'}`}
                      >
                         <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${data.settings.deliveryEnabled ? 'left-7' : 'left-1'}`} />
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-bold text-gray-700 uppercase">Enable Pickup</label>
                      <button 
                        onClick={() => handleChange('settings', 'pickupEnabled', !data.settings.pickupEnabled)}
                        className={`w-12 h-6 rounded-full transition-colors relative ${data.settings.pickupEnabled ? 'bg-amber-600' : 'bg-gray-200'}`}
                      >
                         <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${data.settings.pickupEnabled ? 'left-7' : 'left-1'}`} />
                      </button>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2 uppercase">Delivery Fee</label>
                      <input 
                        type="text" 
                        value={data.settings.deliveryFee}
                        onChange={(e) => handleChange('settings', 'deliveryFee', e.target.value)}
                        className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2 uppercase">Min. Order Value</label>
                      <input 
                        type="text" 
                        value={data.settings.minOrder}
                        onChange={(e) => handleChange('settings', 'minOrder', e.target.value)}
                        className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
