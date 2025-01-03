-- Add currency and exchange_rate columns
ALTER TABLE bills
ADD COLUMN currency TEXT NOT NULL DEFAULT 'EUR',
ADD COLUMN exchange_rate DECIMAL(10, 6);

-- Update existing records to use EUR
UPDATE bills
SET currency = 'EUR',
    exchange_rate = 1.0;

-- Add check constraint for valid currencies
ALTER TABLE bills
ADD CONSTRAINT valid_currency CHECK (currency IN ('EUR', 'BRL'));
