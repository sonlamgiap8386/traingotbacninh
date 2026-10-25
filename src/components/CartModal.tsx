import React, { useState } from 'react';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  CheckCircle2,
  MapPin,
  Truck,
  Phone,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CartItem } from '../types/agriculture';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
}

export const CartModal: React.FC<CartModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
}) => {
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [buyerName, setBuyerName] = useState<string>('Thương lái Nguyễn Văn An');
  const [buyerPhone, setBuyerPhone] = useState<string>('0984 562 318');
  const [shippingAddress, setShippingAddress] = useState<string>('Kho thu mua trung tâm Chợ Chũ, TP. Bắc Ninh');

  if (!isOpen) return null;

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.item.price * item.quantity,
    0
  );

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) return;

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#009b55', '#10b981', '#34d399', '#f59e0b'],
      });
    } catch {
      // ignore
    }

    setIsSuccess(true);
  };

  const handleFinish = () => {
    onClearCart();
    setIsSuccess(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-100 text-emerald-800">
              <ShoppingBag className="w-4 h-4" />
            </span>
            <h3 className="font-extrabold text-slate-900 text-base">
              Đơn Đặt Mua Nông Sản Phường Chũ, TP. Bắc Ninh
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {isSuccess ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-extrabold text-slate-900">
              Đặt Hàng Thành Công!
            </h3>
            <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
              Mã đơn hàng: <strong className="text-emerald-700">#BN-2026-8941</strong>. Thông tin đơn đã được chuyển tới Hợp tác xã và nhà vườn để thu hái đóng thùng theo chuẩn VietGAP.
            </p>
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 text-left text-xs space-y-1">
              <p><strong>Người nhận:</strong> {buyerName}</p>
              <p><strong>Số điện thoại:</strong> {buyerPhone}</p>
              <p><strong>Địa chỉ giao:</strong> {shippingAddress}</p>
              <p><strong>Tổng thanh toán:</strong> <span className="font-bold text-emerald-700">{totalAmount.toLocaleString('vi-VN')}đ</span></p>
            </div>
            <button
              onClick={handleFinish}
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-colors cursor-pointer"
            >
              Hoàn tất & Quay lại trang trại
            </button>
          </div>
        ) : (
          <div className="overflow-y-auto p-5 space-y-5 flex-1">
            {cartItems.length === 0 ? (
              <div className="py-12 text-center text-slate-400 space-y-2">
                <ShoppingBag className="w-12 h-12 mx-auto text-slate-300 stroke-[1.5]" />
                <p className="text-sm font-semibold">Chưa có nông sản nào trong đơn</p>
                <p className="text-xs">Hãy dạo sạp nông sản để chọn đặc sản phường Chũ tươi ngon nhất.</p>
              </div>
            ) : (
              <>
                {/* Items list */}
                <div className="space-y-3">
                  {cartItems.map(({ item, quantity }) => (
                    <div
                      key={item.id}
                      className="p-3 rounded-2xl bg-slate-50 border border-slate-200/70 flex items-center justify-between gap-3"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-14 h-14 rounded-xl object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-xs text-slate-900 truncate">
                          {item.name}
                        </h4>
                        <p className="text-[11px] text-slate-500">
                          {item.price.toLocaleString('vi-VN')}đ / {item.unit}
                        </p>
                        <p className="text-[11px] text-emerald-700 font-extrabold mt-0.5">
                          ={(item.price * quantity).toLocaleString('vi-VN')}đ
                        </p>
                      </div>

                      <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-slate-200">
                        <button
                          onClick={() => onUpdateQuantity(item.id, -1)}
                          className="p-1 rounded text-slate-500 hover:text-emerald-700"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-xs font-bold w-6 text-center">{quantity}</span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, 1)}
                          className="p-1 rounded text-slate-500 hover:text-emerald-700"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <button
                        onClick={() => onRemoveItem(item.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors"
                        title="Xóa khỏi đơn"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Shipping form */}
                <div className="space-y-2.5 pt-2 border-t border-slate-100 text-xs">
                  <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                    Thông tin giao nhận nông sản:
                  </h4>
                  <div>
                    <label className="block text-slate-500 mb-0.5 font-medium">Họ tên người nhận / Doanh nghiệp</label>
                    <input
                      type="text"
                      value={buyerName}
                      onChange={(e) => setBuyerName(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold focus:outline-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 mb-0.5 font-medium">Số điện thoại liên hệ</label>
                    <input
                      type="text"
                      value={buyerPhone}
                      onChange={(e) => setBuyerPhone(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold focus:outline-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 mb-0.5 font-medium">Địa chỉ giao hàng</label>
                    <input
                      type="text"
                      value={shippingAddress}
                      onChange={(e) => setShippingAddress(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold focus:outline-emerald-500"
                    />
                  </div>
                </div>

                {/* Total */}
                <div className="p-3.5 rounded-2xl bg-emerald-50/80 border border-emerald-200 flex items-baseline justify-between">
                  <span className="text-xs font-bold text-emerald-800">Tổng tiền thanh toán:</span>
                  <span className="text-xl font-black text-emerald-800">
                    {totalAmount.toLocaleString('vi-VN')}đ
                  </span>
                </div>
              </>
            )}
          </div>
        )}

        {/* Footer */}
        {!isSuccess && cartItems.length > 0 && (
          <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-3">
            <button
              onClick={onClearCart}
              className="px-3 py-2 text-xs font-semibold text-slate-500 hover:text-rose-600"
            >
              Làm trống
            </button>
            <button
              onClick={handleCheckout}
              className="flex-1 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Xác nhận đặt hàng</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
