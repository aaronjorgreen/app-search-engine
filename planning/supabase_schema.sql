-- Enable the pgvector extension to work with embeddings
CREATE EXTENSION IF NOT EXISTS vector;

-- Create the articles table
CREATE TABLE IF NOT EXISTS articles (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  category TEXT,
  tags TEXT[] NOT NULL DEFAULT '{}',
  author TEXT,
  date TEXT,
  read_time TEXT,
  content TEXT,
  embedding VECTOR(1536)
);

-- Create HNSW index for optimized cosine distance search
CREATE INDEX IF NOT EXISTS articles_embedding_hnsw_idx 
ON articles 
USING hnsw (embedding vector_cosine_ops);

-- Create the match_articles RPC function for similarity search
CREATE OR REPLACE FUNCTION match_articles (
  query_embedding vector(1536),
  match_threshold float,
  match_count int,
  filter_category text DEFAULT NULL,
  filter_tags text[] DEFAULT NULL
)
RETURNS TABLE (
  id text,
  title text,
  slug text,
  description text,
  category text,
  tags text[],
  author text,
  date text,
  read_time text,
  content text,
  similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    articles.id,
    articles.title,
    articles.slug,
    articles.description,
    articles.category,
    articles.tags,
    articles.author,
    articles.date,
    articles.read_time,
    articles.content,
    1 - (articles.embedding <=> query_embedding) AS similarity
  FROM articles
  WHERE 
    (1 - (articles.embedding <=> query_embedding) >= match_threshold)
    AND (filter_category IS NULL OR filter_category = '' OR articles.category = filter_category)
    AND (filter_tags IS NULL OR articles.tags @> filter_tags)
  ORDER BY articles.embedding <=> query_embedding ASC
  LIMIT match_count;
END;
$$;
