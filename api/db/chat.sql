-- Chats schema and helper RPCs for Supabase/Postgres
-- Apply this in Supabase SQL editor

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Conversations between a buyer (user) and a vendor (owner of an outlet) about a specific product
CREATE TABLE IF NOT EXISTS public.conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  vendor_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  outlet_id UUID NOT NULL REFERENCES public.outlets(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_message_at TIMESTAMPTZ
);

-- Enforce one conversation per buyer/vendor/product
CREATE UNIQUE INDEX IF NOT EXISTS ux_conversation_buyer_vendor_product ON public.conversations(buyer_id, vendor_id, product_id);
CREATE INDEX IF NOT EXISTS idx_conversations_buyer ON public.conversations(buyer_id);
CREATE INDEX IF NOT EXISTS idx_conversations_vendor ON public.conversations(vendor_id);

-- Messages
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  sender_role TEXT NOT NULL CHECK (sender_role IN ('buyer','vendor','bot')),
  kind TEXT NOT NULL DEFAULT 'text', -- 'text' | 'system'
  body TEXT,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE INDEX IF NOT EXISTS idx_messages_conversation ON public.messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON public.messages(created_at);
CREATE INDEX IF NOT EXISTS idx_messages_product ON public.messages(product_id);

-- Trigger to update timestamps
CREATE OR REPLACE FUNCTION public.touch_conversation_updated()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_conversation_touch ON public.conversations;
CREATE TRIGGER trg_conversation_touch BEFORE UPDATE ON public.conversations
FOR EACH ROW EXECUTE FUNCTION public.touch_conversation_updated();

-- When inserting a message, bump last_message_at
CREATE OR REPLACE FUNCTION public.bump_last_message()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.conversations SET last_message_at = now(), updated_at = now()
  WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_messages_bump ON public.messages;
CREATE TRIGGER trg_messages_bump AFTER INSERT ON public.messages
FOR EACH ROW EXECUTE FUNCTION public.bump_last_message();

-- RPC: start or get a conversation given buyer and product
DROP FUNCTION IF EXISTS public.start_chat(uuid, uuid);
CREATE OR REPLACE FUNCTION public.start_chat(p_buyer_id UUID, p_product_id UUID)
RETURNS TABLE (
  conversation_id UUID,
  vendor_id UUID,
  outlet_id UUID,
  product_name TEXT,
  vendor_name TEXT
) AS $$
DECLARE
  v_outlet_id UUID;
  v_vendor_id UUID;
  v_conversation_id UUID;
  v_created BOOLEAN := FALSE;
  v_product_name TEXT;
  v_vendor_name TEXT;
BEGIN
  -- Resolve product -> outlet -> vendor
  SELECT pr.outlet_id, pr.name INTO v_outlet_id, v_product_name
  FROM public.products pr WHERE pr.id = p_product_id;
  IF v_outlet_id IS NULL THEN
    RAISE EXCEPTION 'product_not_found';
  END IF;

  SELECT o.owner_id, o.name INTO v_vendor_id, v_vendor_name
  FROM public.outlets o WHERE o.id = v_outlet_id;
  IF v_vendor_id IS NULL THEN
    RAISE EXCEPTION 'vendor_not_found';
  END IF;

  -- Upsert conversation (one per buyer/vendor/product)
  BEGIN
    INSERT INTO public.conversations(buyer_id, vendor_id, outlet_id, product_id, last_message_at)
    VALUES (p_buyer_id, v_vendor_id, v_outlet_id, p_product_id, now())
    RETURNING id INTO v_conversation_id;
    v_created := TRUE;
  EXCEPTION WHEN unique_violation THEN
    SELECT c.id INTO v_conversation_id FROM public.conversations c
    WHERE c.buyer_id = p_buyer_id AND c.vendor_id = v_vendor_id AND c.product_id = p_product_id;
  END;

  -- If new, add a system message referencing the product
  IF v_created THEN
    INSERT INTO public.messages(conversation_id, sender_id, sender_role, kind, body)
    VALUES (v_conversation_id, p_buyer_id, 'buyer', 'system', 'Started chat about product.');
  END IF;

  conversation_id := v_conversation_id;
  vendor_id := v_vendor_id;
  outlet_id := v_outlet_id;
  product_name := v_product_name;
  vendor_name := v_vendor_name;
  RETURN NEXT;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RPC: send a message
DROP FUNCTION IF EXISTS public.send_message(uuid, uuid, text, text, uuid);
DROP FUNCTION IF EXISTS public.send_message(uuid, uuid, text, text);
CREATE OR REPLACE FUNCTION public.send_message(
  p_conversation_id UUID, 
  p_sender_id UUID, 
  p_sender_role TEXT, 
  p_body TEXT,
  p_product_id UUID DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  v_id UUID;
BEGIN
  INSERT INTO public.messages(conversation_id, sender_id, sender_role, kind, body, product_id)
  VALUES (p_conversation_id, p_sender_id, p_sender_role, 'text', p_body, p_product_id)
  RETURNING id INTO v_id;
  RETURN v_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RPC: list messages for a conversation (paginated)
DROP FUNCTION IF EXISTS public.get_messages(uuid, integer, integer);
CREATE OR REPLACE FUNCTION public.get_messages(p_conversation_id UUID, p_limit INTEGER DEFAULT 50, p_offset INTEGER DEFAULT 0)
RETURNS TABLE(
  id UUID,
  sender_id UUID,
  sender_role TEXT,
  kind TEXT,
  body TEXT,
  product_id UUID,
  created_at TIMESTAMPTZ,
  deleted BOOLEAN
) AS $$
BEGIN
  RETURN QUERY
  SELECT m.id, m.sender_id, m.sender_role, m.kind, m.body, m.product_id, m.created_at, m.deleted
  FROM public.messages m
  WHERE m.conversation_id = p_conversation_id
  ORDER BY m.created_at ASC
  LIMIT p_limit OFFSET p_offset;
END;
$$ LANGUAGE plpgsql STABLE;

-- RPC: list conversations for a user (either as buyer or vendor)
DROP FUNCTION IF EXISTS public.list_conversations(uuid, integer, integer);
CREATE OR REPLACE FUNCTION public.list_conversations(p_user_id UUID, p_limit INTEGER DEFAULT 50, p_offset INTEGER DEFAULT 0)
RETURNS TABLE(
  id UUID,
  buyer_id UUID,
  vendor_id UUID,
  outlet_id UUID,
  product_id UUID,
  last_message_at TIMESTAMPTZ,
  status TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT c.id, c.buyer_id, c.vendor_id, c.outlet_id, c.product_id, c.last_message_at, c.status
  FROM public.conversations c
  WHERE c.buyer_id = p_user_id OR c.vendor_id = p_user_id
  ORDER BY COALESCE(c.last_message_at, c.created_at) DESC
  LIMIT p_limit OFFSET p_offset;
END;
$$ LANGUAGE plpgsql STABLE;

-- Conversations status & Invoices
-- Add status column to conversations
ALTER TABLE public.conversations
  ADD COLUMN IF NOT EXISTS status TEXT CHECK (status IN ('unpaid','paid','enroute','delivered')) DEFAULT 'unpaid';

-- Invoices table
CREATE TABLE IF NOT EXISTS public.invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  amount NUMERIC(12,2) NOT NULL,
  delivery_fee NUMERIC(12,2) DEFAULT 0,
  delivery_address TEXT,
  expected_delivery TIMESTAMPTZ,
  status TEXT NOT NULL CHECK (status IN ('unpaid','paid','enroute','delivered','cancelled')) DEFAULT 'unpaid',
  created_by UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_invoices_conversation ON public.invoices(conversation_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON public.invoices(status);

-- RPC: create invoice
DROP FUNCTION IF EXISTS public.create_invoice(uuid, uuid, uuid, numeric, numeric, text, timestamptz);
CREATE OR REPLACE FUNCTION public.create_invoice(p_conversation_id UUID, p_created_by UUID, p_product_id UUID, p_amount NUMERIC, p_delivery_fee NUMERIC, p_delivery_address TEXT, p_expected_delivery TIMESTAMPTZ)
RETURNS UUID AS $$
DECLARE v_id UUID;
BEGIN
  INSERT INTO public.invoices(conversation_id, product_id, amount, delivery_fee, delivery_address, expected_delivery, created_by)
  VALUES (p_conversation_id, p_product_id, p_amount, COALESCE(p_delivery_fee,0), p_delivery_address, p_expected_delivery, p_created_by)
  RETURNING id INTO v_id;
  -- bump conversation status to unpaid
  UPDATE public.conversations SET status = 'unpaid', updated_at = now() WHERE id = p_conversation_id;
  RETURN v_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Device tokens for push notifications
CREATE TABLE IF NOT EXISTS public.device_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  expo_token TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, expo_token)
);

-- Helper to upsert a token
DROP FUNCTION IF EXISTS public.upsert_device_token(uuid, text);
CREATE OR REPLACE FUNCTION public.upsert_device_token(p_user_id UUID, p_expo_token TEXT)
RETURNS VOID AS $$
BEGIN
  INSERT INTO public.device_tokens(user_id, expo_token)
  VALUES (p_user_id, p_expo_token)
  ON CONFLICT (user_id, expo_token) DO NOTHING;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RPC: update invoice status (and conversation status)
DROP FUNCTION IF EXISTS public.update_invoice_status(uuid, text);
CREATE OR REPLACE FUNCTION public.update_invoice_status(p_invoice_id UUID, p_status TEXT)
RETURNS VOID AS $$
BEGIN
  IF p_status NOT IN ('unpaid','paid','enroute','delivered','cancelled') THEN
    RAISE EXCEPTION 'invalid_status';
  END IF;
  UPDATE public.invoices SET status = p_status WHERE id = p_invoice_id;
  -- reflect status on conversation unless cancelled (keep previous)
  IF p_status IN ('unpaid','paid','enroute','delivered') THEN
    UPDATE public.conversations c
    SET status = p_status, updated_at = now()
    FROM public.invoices i
    WHERE i.id = p_invoice_id AND i.conversation_id = c.id;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
