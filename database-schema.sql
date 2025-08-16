-- DroGo Database Schema for Supabase
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email VARCHAR UNIQUE NOT NULL,
  name VARCHAR NOT NULL,
  phone VARCHAR,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create products table
CREATE TABLE IF NOT EXISTS public.products (
  id VARCHAR PRIMARY KEY,
  name VARCHAR NOT NULL,
  description TEXT,
  category VARCHAR NOT NULL,
  price INTEGER NOT NULL, -- Price in cents/paise
  original_price INTEGER NOT NULL,
  image_url TEXT,
  in_stock BOOLEAN DEFAULT true,
  stock_quantity INTEGER DEFAULT 100,
  rating DECIMAL(2,1) DEFAULT 4.0,
  delivery_time VARCHAR DEFAULT '8-12 min',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create delivery spots table
CREATE TABLE IF NOT EXISTS public.delivery_spots (
  id VARCHAR PRIMARY KEY,
  name VARCHAR NOT NULL,
  address TEXT NOT NULL,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  type VARCHAR NOT NULL, -- main_entrance, shopping, residential, etc.
  available BOOLEAN DEFAULT true,
  distance VARCHAR DEFAULT '100m',
  walk_time VARCHAR DEFAULT '2 min walk',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create orders table
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  status VARCHAR DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'preparing', 'dispatched', 'in_transit', 'delivered', 'cancelled')),
  total_amount INTEGER NOT NULL, -- Total in cents/paise
  delivery_address TEXT NOT NULL,
  delivery_spot JSONB, -- Store delivery spot details
  terrace_accessible BOOLEAN DEFAULT false,
  items JSONB NOT NULL, -- Array of order items
  estimated_delivery TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create order_items table (normalized approach)
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id VARCHAR REFERENCES public.products(id),
  product_name VARCHAR NOT NULL, -- Store name for history
  quantity INTEGER NOT NULL,
  unit_price INTEGER NOT NULL, -- Price at time of order
  total_price INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create inventory_logs table (for tracking stock changes)
CREATE TABLE IF NOT EXISTS public.inventory_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  product_id VARCHAR REFERENCES public.products(id),
  change_type VARCHAR NOT NULL, -- 'restock', 'sale', 'adjustment'
  quantity_change INTEGER NOT NULL, -- Positive for increase, negative for decrease
  previous_stock INTEGER NOT NULL,
  new_stock INTEGER NOT NULL,
  reason TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- Insert sample products
INSERT INTO public.products (id, name, description, category, price, original_price, image_url) VALUES
('almonds-500g', 'California Almonds', '500g Premium Quality', 'groceries', 449, 549, '/images/almonds.jpg'),
('whole-wheat-bread', 'Whole Wheat Bread', 'Fresh Daily Baked', 'groceries', 55, 65, '/images/bread.jpg'),
('masala-chips', 'Masala Potato Chips', '150g Crispy & Spicy', 'groceries', 45, 60, '/images/chips.jpg'),
('mango-juice', 'Fresh Mango Juice', '1L Chilled Pack', 'beverages', 99, 130, '/images/mango-juice.jpg'),
('organic-milk', 'Organic Cow Milk', '1L Fresh & Pure', 'groceries', 72, 82, '/images/milk.jpg'),
('bananas-6pc', 'Fresh Bananas', '6 pieces - Ripe & Sweet', 'groceries', 59, 75, '/images/bananas.jpg'),
('paracetamol-500mg', 'Paracetamol 500mg', '10 tablets - Pain Relief', 'pharmacy', 35, 45, '/images/paracetamol.jpg'),
('vitamin-c-tablets', 'Vitamin C Tablets', '30 tablets - Immunity Boost', 'pharmacy', 199, 249, '/images/vitamin-c.jpg'),
('smartphone-charger', 'Fast Phone Charger', 'Type-C 25W Fast Charging', 'electronics', 799, 999, '/images/charger.jpg'),
('dog-treats', 'Premium Dog Treats', '200g Chicken Flavor', 'pet-care', 149, 199, '/images/dog-treats.jpg'),
('green-tea', 'Premium Green Tea', '25 tea bags - Antioxidant Rich', 'beverages', 299, 349, '/images/green-tea.jpg'),
('instant-coffee', 'Instant Coffee Powder', '100g Rich & Strong', 'beverages', 245, 295, '/images/coffee.jpg')
ON CONFLICT (id) DO NOTHING;

-- Insert sample delivery spots (Andheri West)
INSERT INTO public.delivery_spots (id, name, address, latitude, longitude, type) VALUES
('spot_1', 'Andheri Metro Station', 'Andheri West Metro Station, Mumbai', 19.1197, 72.8464, 'main_entrance'),
('spot_2', 'Infiniti Mall', 'New Link Road, Andheri West', 19.1170, 72.8426, 'shopping'),
('spot_3', 'Oshiwara Bus Depot', 'Oshiwara, Andheri West', 19.1449, 72.8367, 'residential'),
('spot_4', 'Lokhandwala Complex', 'Lokhandwala, Andheri West', 19.1408, 72.8347, 'residential'),
('spot_5', 'Versova Beach', 'Versova, Andheri West', 19.1314, 72.8137, 'recreational'),
('spot_6', 'Four Bungalows', 'Four Bungalows, Andheri West', 19.1180, 72.8226, 'residential'),
('spot_7', 'MIDC Central Road', 'MIDC, Andheri East', 19.1136, 72.8697, 'industrial')
ON CONFLICT (id) DO NOTHING;

-- Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_logs ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies

-- Users can only see and update their own data
CREATE POLICY "Users can view own data" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own data" ON public.users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own data" ON public.users FOR INSERT WITH CHECK (auth.uid() = id);

-- Orders: Users can only see their own orders
CREATE POLICY "Users can view own orders" ON public.orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create orders" ON public.orders FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own orders" ON public.orders FOR UPDATE USING (auth.uid() = user_id);

-- Order items: Users can only see items from their orders
CREATE POLICY "Users can view own order items" ON public.order_items FOR SELECT 
USING (EXISTS (SELECT 1 FROM public.orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()));

-- Public read access for products and delivery spots
CREATE POLICY "Anyone can view products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Anyone can view delivery spots" ON public.delivery_spots FOR SELECT USING (true);

-- Admin policies (you can create admin users later)
-- For now, disable updates to products (will be handled by admin functions)

-- Create functions for analytics
CREATE OR REPLACE FUNCTION get_order_analytics()
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'total_orders', (SELECT COUNT(*) FROM public.orders),
    'pending_orders', (SELECT COUNT(*) FROM public.orders WHERE status IN ('confirmed', 'preparing', 'dispatched', 'in_transit')),
    'completed_orders', (SELECT COUNT(*) FROM public.orders WHERE status = 'delivered'),
    'total_revenue', (SELECT COALESCE(SUM(total_amount), 0) FROM public.orders WHERE status = 'delivered'),
    'avg_order_value', (SELECT COALESCE(AVG(total_amount), 0) FROM public.orders WHERE status = 'delivered')
  ) INTO result;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to update product stock
CREATE OR REPLACE FUNCTION update_product_stock(product_id VARCHAR, quantity_sold INTEGER)
RETURNS VOID AS $$
BEGIN
  UPDATE public.products 
  SET stock_quantity = stock_quantity - quantity_sold,
      updated_at = NOW()
  WHERE id = product_id;
  
  -- Log the inventory change
  INSERT INTO public.inventory_logs (product_id, change_type, quantity_change, previous_stock, new_stock, reason)
  VALUES (
    product_id, 
    'sale', 
    -quantity_sold, 
    (SELECT stock_quantity + quantity_sold FROM public.products WHERE id = product_id),
    (SELECT stock_quantity FROM public.products WHERE id = product_id),
    'Product sold'
  );
  
  -- Check for low stock alert (less than 10 items)
  IF (SELECT stock_quantity FROM public.products WHERE id = product_id) < 10 THEN
    -- In a real app, this would trigger a notification system
    RAISE NOTICE 'Low stock alert for product: %', product_id;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create triggers for automatic timestamp updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_delivery_spots_updated_at BEFORE UPDATE ON public.delivery_spots
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON public.order_items(product_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_in_stock ON public.products(in_stock);

-- Grant permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;
