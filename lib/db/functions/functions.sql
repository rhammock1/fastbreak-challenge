CREATE OR REPLACE FUNCTION formatAddress(
  street_1 TEXT, 
  street_2 TEXT, 
  city TEXT, 
  state TEXT, 
  zip TEXT,
  country TEXT
) RETURNS TEXT AS $$
DECLARE
  formatted_address TEXT;
BEGIN
  IF street_2 IS NULL THEN
    formatted_address := street_1 || ', ' || city || ', ' || state || ' ' || zip;
  ELSE
    formatted_address := street_1 || ', ' || street_2 || ', ' || city || ', ' || state || ' ' || zip;
  END IF;
  IF country IS NOT NULL THEN
    formatted_address := formatted_address || ', ' || country;
  END IF;
  RETURN formatted_address;
END;
$$ LANGUAGE plpgsql;
