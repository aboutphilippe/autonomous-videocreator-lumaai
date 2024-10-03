-- Create the videos table
CREATE TABLE videos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    series_id UUID NOT NULL REFERENCES series(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    thumbnail_url TEXT NOT NULL,
    video_url TEXT,
    status VARCHAR(10) DEFAULT 'NEW' CHECK (status IN ('NEW', 'DRAFT', 'PUBLISHED', 'PRIVATE', 'ERROR')) NOT NULL,
    youtube_video_id VARCHAR(255),
    youtube_title VARCHAR(255),
    youtube_description TEXT,
    youtube_views INT DEFAULT 0,
    youtube_likes INT DEFAULT 0,
    youtube_comments INT DEFAULT 0,
    youtube_uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    youtube_playlist_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add any necessary indexes
CREATE INDEX idx_videos_series_id ON videos(series_id);