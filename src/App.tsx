import React, { useState, useRef, useEffect, Suspense, lazy } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { MarketplaceTab } from './components/MarketplaceTab';
import { ActiveTab, ProduceItem, CartItem, FarmerAccount } from './types/agriculture';
import { FARMER_ACCOUNTS, PRODUCE_ITEMS } from './data/mockData';
import { addCultivationLogToProduce, CultivationLogInput, CultivationLogType } from './utils/cultivationSync';
import { CheckCircle2 } from 'lucide-react';
import { LycheeLogo } from './components/LycheeLogo';

// Code-splitting via React.lazy for non-landing tabs & modals
const OverviewTab = lazy(() =>
  import('./components/OverviewTab').then((m) => ({ default: m.OverviewTab }))
);
const GardenLocationTab = lazy(() =>
  import('./components/GardenLocationTab').then((m) => ({ default: m.GardenLocationTab }))
);
const WeatherTab = lazy(() =>
  import('./components/WeatherTab').then((m) => ({ default: m.WeatherTab }))
);
const CalendarTab = lazy(() =>
  import('./components/CalendarTab').then((m) => ({ default: m.CalendarTab }))
);
const CommunityTab = lazy(() =>
  import('./components/CommunityTab').then((m) => ({ default: m.CommunityTab }))
);
const AssistantTab = lazy(() =>
  import('./components/AssistantTab').then((m) => ({ default: m.AssistantTab }))
);

// Modals lazy-loaded on demand
const ProductDetailModal = lazy(() =>
  import('./components/ProductDetailModal').then((m) => ({ default: m.ProductDetailModal }))
);
const CartModal = lazy(() =>
  import('./components/CartModal').then((m) => ({ default: m.CartModal }))
);
const QuickLoginModal = lazy(() =>
  import('./components/QuickLoginModal').then((m) => ({ default: m.QuickLoginModal }))
);
const OrchardDeclarationModal = lazy(() =>
  import('./components/OrchardDeclarationModal').then((m) => ({ default: m.OrchardDeclarationModal }))
);
const AddProduceModal = lazy(() =>
  import('./components/AddProduceModal').then((m) => ({ default: m.AddProduceModal }))
);
const EditProduceModal = lazy(() =>
  import('./components/EditProduceModal').then((m) => ({ default: m.EditProduceModal }))
);

const TabFallback: React.FC = () => (
  <div className="flex flex-col items-center justify-center min-h-[360px] p-8 text-center bg-white rounded-3xl border border-slate-200/80 shadow-card">
    <div className="w-16 h-16 rounded-3xl flex items-center justify-center mb-4 relative"
      style={{ background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)' }}
    >
      <div className="w-7 h-7 border-[3px] border-emerald-500 border-t-transparent rounded-full animate-spin" />
      <LycheeLogo className="absolute -bottom-1 -right-1 text-lg animate-float-leaf" />
    </div>
    <p className="text-sm font-extrabold text-slate-800">Đang tải chuyên mục canh tác...</p>
    <p className="text-xs text-slate-400 mt-1.5 font-medium">🍒 Trái ngọt Bắc Ninh · phường Chũ, TP. Bắc Ninh</p>
  </div>
);

export default function App() {
  // Authentication & Role state: default is guest / buyer without account
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  // Default first page for unauthenticated buyer is 'market' (Sạp trái cây) per user specification
  const [activeTab, setActiveTab] = useState<ActiveTab>('market');
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<ProduceItem | null>(null);

  // Dynamic produce list (supports farmer adding new fruits to sell and editing prices)
  const [produceList, setProduceList] = useState<ProduceItem[]>(PRODUCE_ITEMS);

  // Active farmer account (5 quick login options)
  const [currentFarmer, setCurrentFarmer] = useState<FarmerAccount>(FARMER_ACCOUNTS[0]);
  const [isQuickLoginOpen, setIsQuickLoginOpen] = useState<boolean>(false);
  const [isDeclareOrchardOpen, setIsDeclareOrchardOpen] = useState<boolean>(false);
  const [isAddProduceOpen, setIsAddProduceOpen] = useState<boolean>(false);
  const [isEditProduceOpen, setIsEditProduceOpen] = useState<boolean>(false);
  const [editingProduct, setEditingProduct] = useState<ProduceItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [assistantSubTab, setAssistantSubTab] = useState<'chat' | 'diagnosis' | 'experts'>('chat');
  const toastTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const pageMeta: Record<ActiveTab, { title: string; description: string }> = {
      overview: {
        title: 'Trang trại số | Trái ngọt Bắc Ninh',
        description: 'Theo dõi mô hình canh tác và nông sản VietGAP tại Phường Chũ, TP. Bắc Ninh.',
      },
      garden_map: {
        title: 'Bản đồ nhà vườn | Trái ngọt Bắc Ninh',
        description: 'Khám phá vị trí và thông tin các khu vườn nông sản tại Phường Chũ, TP. Bắc Ninh.',
      },
      weather: {
        title: 'Thời tiết canh tác | Trái ngọt Bắc Ninh',
        description: 'Theo dõi thời tiết và vi khí hậu hỗ trợ canh tác cây ăn quả tại Phường Chũ.',
      },
      calendar: {
        title: 'Lịch canh tác VietGAP | Trái ngọt Bắc Ninh',
        description: 'Lịch công việc canh tác và nhật ký VietGAP cho nhà vườn Phường Chũ.',
      },
      market: {
        title: 'Mua nông sản VietGAP | Trái ngọt Bắc Ninh',
        description: 'Mua vải thiều, cam Canh, bưởi Diễn, táo và ổi trực tiếp từ nhà vườn Phường Chũ.',
      },
      community: {
        title: 'Cộng đồng nhà vườn | Trái ngọt Bắc Ninh',
        description: 'Chia sẻ kinh nghiệm, mùa vụ và kỹ thuật canh tác cây ăn quả tại Phường Chũ.',
      },
      assistant: {
        title: 'Tư vấn canh tác | Trái ngọt Bắc Ninh',
        description: 'Nhận tư vấn kỹ thuật và chẩn đoán sâu bệnh cho cây ăn quả theo định hướng VietGAP.',
      },
    };
    const currentMeta = pageMeta[activeTab];
    document.title = currentMeta.title;
    document.querySelector('meta[name="description"]')?.setAttribute('content', currentMeta.description);
  }, [activeTab]);

  useEffect(() => () => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
  }, []);

  const showToast = (message: string) => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    setToastMessage(message);
    toastTimeoutRef.current = setTimeout(() => {
      setToastMessage(null);
      toastTimeoutRef.current = null;
    }, 3500);
  };

  const handleSelectFarmer = (farmer: FarmerAccount) => {
    setCurrentFarmer(farmer);
    setIsLoggedIn(true);
    setActiveTab('overview');
    showToast(`Đã đăng nhập thành công tài khoản nhà vườn: ${farmer.name} (${farmer.shortLocation})`);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setActiveTab('market');
    showToast('Đã chuyển về vai trò Khách mua nông sản (Sạp trái cây).');
  };

  const handleSaveFarmer = (updatedFarmer: FarmerAccount) => {
    setCurrentFarmer(updatedFarmer);
    showToast(`Đã cập nhật thông tin khu vườn của bác ${updatedFarmer.name}!`);
  };

  const handleAddProduce = (newProduce: ProduceItem) => {
    setProduceList((prev) => [newProduce, ...prev]);
    showToast(`Đã đăng bán thành công: ${newProduce.name} lên Sạp trái cây!`);
    setActiveTab('market');
  };

  const handleOpenEditProduce = (product?: ProduceItem) => {
    if (product) {
      setEditingProduct(product);
    } else {
      const myProduct =
        produceList.find(
          (p) =>
            p.farmer.toLowerCase().includes(currentFarmer.name.toLowerCase()) ||
            p.vietgapCode === currentFarmer.pucCode
        ) || produceList[0];
      setEditingProduct(myProduct);
    }
    setIsEditProduceOpen(true);
  };

  const handleSaveProduce = (updatedProduce: ProduceItem) => {
    setProduceList((prev) =>
      prev.map((item) => (item.id === updatedProduce.id ? updatedProduce : item))
    );
    setSelectedProduct((prev) => (prev && prev.id === updatedProduce.id ? updatedProduce : prev));
    showToast(
      `Đã cập nhật bài đăng "${updatedProduce.name}" - Giá bán mới: ${updatedProduce.price.toLocaleString('vi-VN')} đ/${updatedProduce.unit}!`
    );
  };

  const handleAddCultivationLog = (
    logType: CultivationLogType,
    data: CultivationLogInput
  ) => {
    setProduceList((prev) =>
      addCultivationLogToProduce(prev, currentFarmer, logType, data)
    );
    setSelectedProduct((prev) => {
      if (!prev) return null;
      const updatedList = addCultivationLogToProduce([prev], currentFarmer, logType, data);
      return updatedList[0] || prev;
    });
    const labelMap: Record<string, string> = {
      watering: '💧 Tưới nước',
      fertilizing: '🌱 Bón phân',
      pest: '🛡️ Bảo vệ thực vật sinh học',
      general: '✂️ Công việc mùa vụ',
    };
    showToast(
      `Đã đồng bộ nhật ký "${labelMap[logType] || 'Canh tác'}" vào hồ sơ VietGAP vườn Bác ${currentFarmer.name}!`
    );
  };

  // Cart Management
  const handleAddToCart = (product: ProduceItem, qty: number = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.item.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.item.id === product.id ? { ...i, quantity: i.quantity + qty } : i
        );
      }
      return [...prev, { item: product, quantity: qty }];
    });
  };

  const handleUpdateQuantity = (productId: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((i) =>
          i.item.id === productId ? { ...i, quantity: i.quantity + delta } : i
        )
        .filter((i) => i.quantity > 0)
    );
  };

  const handleRemoveItem = (productId: string) => {
    setCartItems((prev) => prev.filter((i) => i.item.id !== productId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-[#F0F5F1] text-slate-800 flex flex-col font-['Times_New_Roman',Times,serif]">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:rounded-lg focus:bg-emerald-800 focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:text-white"
      >
        Chuyển đến nội dung chính
      </a>
      {/* Toast Notification on login / actions */}
      {toastMessage && (
        <div role="status" aria-live="polite" className="fixed top-4 right-4 z-50 bg-gradient-to-r from-emerald-700 to-emerald-600 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 text-xs font-bold animate-in fade-in slide-in-from-top-2 duration-200 border border-emerald-500/30">
          <div className="w-6 h-6 rounded-full bg-white/15 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-200" />
          </div>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Fixed Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        cartCount={totalCartCount}
      />

      {/* Main Layout Area */}
      <div className="lg:pl-72 flex flex-col min-h-screen flex-1">
        {/* Sticky Header */}
        <Header
          onOpenSidebar={() => setIsSidebarOpen(true)}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          cartCount={totalCartCount}
          onOpenCart={() => setIsCartOpen(true)}
          currentFarmer={currentFarmer}
          isLoggedIn={isLoggedIn}
          onLogout={handleLogout}
          onOpenQuickLogin={() => setIsQuickLoginOpen(true)}
          onOpenDeclareOrchard={() => setIsDeclareOrchardOpen(true)}
          onOpenAddProduce={() => setIsAddProduceOpen(true)}
          onOpenEditProduce={() => handleOpenEditProduce()}
          onSelectFarmer={handleSelectFarmer}
        />

        {/* Dynamic Page Content */}
        <main id="main-content" tabIndex={-1} className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Suspense fallback={<TabFallback />}>
            {activeTab === 'overview' && (
              <OverviewTab
                setActiveTab={setActiveTab}
                onSelectProduct={setSelectedProduct}
                currentFarmer={currentFarmer}
                isLoggedIn={isLoggedIn}
                onOpenQuickLogin={() => setIsQuickLoginOpen(true)}
                onOpenDeclareOrchard={() => setIsDeclareOrchardOpen(true)}
                onOpenAddProduce={() => setIsAddProduceOpen(true)}
                onOpenEditProduce={handleOpenEditProduce}
                produceList={produceList}
                onSelectFarmer={handleSelectFarmer}
                onOpenDiagnosis={() => {
                  setAssistantSubTab('diagnosis');
                  setActiveTab('assistant');
                }}
              />
            )}

            {activeTab === 'garden_map' && <GardenLocationTab />}

            {activeTab === 'weather' && <WeatherTab />}

            {activeTab === 'calendar' && (
              <CalendarTab
                currentFarmer={currentFarmer}
                produceList={produceList}
                onAddCultivationLog={handleAddCultivationLog}
                isLoggedIn={isLoggedIn}
                onOpenQuickLogin={() => setIsQuickLoginOpen(true)}
              />
            )}

            {activeTab === 'market' && (
              <MarketplaceTab
                onSelectProduct={setSelectedProduct}
                onAddToCart={handleAddToCart}
                produceList={produceList}
                onOpenAddProduce={() => setIsAddProduceOpen(true)}
                isLoggedIn={isLoggedIn}
                onOpenQuickLogin={() => setIsQuickLoginOpen(true)}
                currentFarmer={currentFarmer}
                onOpenEditProduce={handleOpenEditProduce}
              />
            )}

            {activeTab === 'community' && <CommunityTab currentFarmer={currentFarmer} />}

            {activeTab === 'assistant' && (
              <AssistantTab
                currentFarmer={currentFarmer}
                defaultSubTab={assistantSubTab}
              />
            )}
          </Suspense>
        </main>
        <footer className="border-t border-emerald-100 bg-white/80 px-4 py-6 text-center text-xs text-slate-500">
          <p className="font-bold text-emerald-900">Trái ngọt Bắc Ninh · Nông sản VietGAP từ Phường Chũ</p>
          <address className="mt-1 not-italic">Phường Chũ, TP. Bắc Ninh · Kết nối trực tiếp nhà vườn và người tiêu dùng</address>
        </footer>
      </div>

      {/* Modals on-demand */}
      <Suspense fallback={null}>
        {selectedProduct && (
          <ProductDetailModal
            product={selectedProduct}
            onClose={() => setSelectedProduct(null)}
            onAddToCart={handleAddToCart}
            isLoggedIn={isLoggedIn}
            currentFarmer={currentFarmer}
            onOpenEdit={handleOpenEditProduce}
          />
        )}

        {isCartOpen && (
          <CartModal
            isOpen={isCartOpen}
            onClose={() => setIsCartOpen(false)}
            cartItems={cartItems}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
            onClearCart={handleClearCart}
          />
        )}

        {/* 5 Quick Login Farmers Modal */}
        {isQuickLoginOpen && (
          <QuickLoginModal
            isOpen={isQuickLoginOpen}
            onClose={() => setIsQuickLoginOpen(false)}
            currentFarmer={currentFarmer}
            onSelectFarmer={handleSelectFarmer}
            isLoggedIn={isLoggedIn}
          />
        )}

        {/* Declare / Edit Orchard Info Modal */}
        {isDeclareOrchardOpen && (
          <OrchardDeclarationModal
            isOpen={isDeclareOrchardOpen}
            onClose={() => setIsDeclareOrchardOpen(false)}
            currentFarmer={currentFarmer}
            onSaveFarmer={handleSaveFarmer}
          />
        )}

        {/* Farmer Post Produce for Sale Modal */}
        {isAddProduceOpen && (
          <AddProduceModal
            isOpen={isAddProduceOpen}
            onClose={() => setIsAddProduceOpen(false)}
            currentFarmer={currentFarmer}
            onAddProduce={handleAddProduce}
          />
        )}

        {/* Farmer Edit Produce / Update Price Modal */}
        {isEditProduceOpen && (
          <EditProduceModal
            isOpen={isEditProduceOpen}
            onClose={() => setIsEditProduceOpen(false)}
            product={editingProduct}
            onSave={handleSaveProduce}
            currentFarmer={currentFarmer}
          />
        )}
      </Suspense>
    </div>
  );
}
