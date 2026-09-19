import React from 'react';
import { MarketplaceProductCard, MarketplaceProductCardProps } from './MarketplaceProductCard';

export type ProductCardProps = MarketplaceProductCardProps;

export const ProductCard: React.FC<ProductCardProps> = (props) => {
  return <MarketplaceProductCard {...props} />;
};
