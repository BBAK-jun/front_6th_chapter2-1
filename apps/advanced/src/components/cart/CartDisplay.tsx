/**
 * 장바구니 표시 컴포넌트
 * 선언적 프로그래밍 패러다임을 적용한 장바구니 UI
 */

import React from 'react';
import { useCart } from '../../context/CartContext';
import { useCalculations } from '../../hooks/useCalculations';
import { CartItem } from './CartItem';
import { OrderSummary } from './OrderSummary';

/**
 * 빈 장바구니 컴포넌트
 * 장바구니가 비어있을 때 표시되는 컴포넌트
 */
const EmptyCart: React.FC = () => {
  return (
    <div className='text-center py-12'>
      <div className='text-gray-400 text-6xl mb-4'>🛒</div>
      <h3 className='text-xl font-semibold text-gray-600 mb-2'>
        장바구니가 비어있습니다
      </h3>
      <p className='text-gray-500'>상품을 추가해보세요!</p>
    </div>
  );
};

/**
 * 장바구니 헤더 컴포넌트 Props
 */
interface CartHeaderProps {
  itemCount: number;
  onClearCart: () => void;
}

/**
 * 장바구니 헤더 컴포넌트
 * 장바구니 제목과 전체 삭제 버튼을 포함하는 컴포넌트
 */
const CartHeader: React.FC<CartHeaderProps> = React.memo(
  ({ itemCount, onClearCart }) => {
    const handleClearCart = React.useCallback(() => {
      if (window.confirm('장바구니의 모든 상품을 삭제하시겠습니까?')) {
        onClearCart();
      }
    }, [onClearCart]);

    return (
      <div className='flex items-center justify-between mb-6 pb-4 border-b border-gray-200'>
        <div className='flex items-center gap-3'>
          <h3 className='text-2xl font-bold text-gray-800'>장바구니</h3>
          <span className='bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium'>
            {itemCount}개 상품
          </span>
        </div>
        <button
          onClick={handleClearCart}
          className='bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors text-sm'
          aria-label='장바구니 전체 삭제'>
          전체 삭제
        </button>
      </div>
    );
  }
);

CartHeader.displayName = 'CartHeader';

/**
 * 장바구니 아이템 목록 컴포넌트 Props
 */
interface CartItemsListProps {
  items: Array<{
    product: { id: string };
    quantity: number;
    subtotal: number;
    discount: number;
    points: number;
  }>;
  onRemove: (productId: string) => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
}

/**
 * 장바구니 아이템 목록 컴포넌트
 * 장바구니 아이템들을 목록 형태로 표시하는 컴포넌트
 */
const CartItemsList: React.FC<CartItemsListProps> = React.memo(
  ({ items, onRemove, onUpdateQuantity }) => {
    const handleRemove = React.useCallback(
      (productId: string) => {
        onRemove(productId);
      },
      [onRemove]
    );

    const handleUpdateQuantity = React.useCallback(
      (productId: string, quantity: number) => {
        onUpdateQuantity(productId, quantity);
      },
      [onUpdateQuantity]
    );

    return (
      <div className='space-y-4 mb-6'>
        {items.map(item => (
          <CartItem
            key={item.product.id}
            item={item}
            onRemove={handleRemove}
            onUpdateQuantity={handleUpdateQuantity}
          />
        ))}
      </div>
    );
  }
);

CartItemsList.displayName = 'CartItemsList';

/**
 * 장바구니 표시 컴포넌트
 * 장바구니의 전체적인 레이아웃과 상태를 관리하는 메인 컴포넌트
 */
export const CartDisplay: React.FC = () => {
  const { items, removeFromCart, updateQuantity, clearCart } = useCart();
  const { subtotal, discount, total, points, itemCount } =
    useCalculations(items);

  const handleRemove = React.useCallback(
    (productId: string) => {
      removeFromCart(productId);
    },
    [removeFromCart]
  );

  const handleUpdateQuantity = React.useCallback(
    (productId: string, quantity: number) => {
      updateQuantity(productId, quantity);
    },
    [updateQuantity]
  );

  const handleClearCart = React.useCallback(() => {
    clearCart();
  }, [clearCart]);

  // 장바구니가 비어있는 경우
  if (items.length === 0) {
    return <EmptyCart />;
  }

  return (
    <div className='cart-display'>
      <CartHeader itemCount={itemCount} onClearCart={handleClearCart} />

      <CartItemsList
        items={items}
        onRemove={handleRemove}
        onUpdateQuantity={handleUpdateQuantity}
      />

      <OrderSummary
        subtotal={subtotal}
        discount={discount}
        total={total}
        points={points}
      />
    </div>
  );
};
