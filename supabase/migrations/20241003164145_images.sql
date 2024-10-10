-- Create the images table
CREATE TABLE images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    series_id UUID NOT NULL REFERENCES series(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    prompt TEXT NOT NULL,
    url TEXT NOT NULL,
    width INT NOT NULL,
    height INT NOT NULL,
    content_type VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add any necessary indexes
CREATE INDEX idx_images_series_id ON images(series_id);