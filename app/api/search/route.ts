import { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const openaiApiKey = process.env.OPENAI_API_KEY || '';

// Initialize clients outside the handler to reuse connection/cache across invocations
const supabase = createClient(supabaseUrl, supabaseServiceKey);
const openai = new OpenAI({ apiKey: openaiApiKey });

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query = '', category = '', tags = [] } = body;

    const trimmedQuery = typeof query === 'string' ? query.trim() : '';
    const filteredTags = Array.isArray(tags) ? tags.filter((t: any) => typeof t === 'string' && t.length > 0) : [];

    // If query is empty, query articles directly from Supabase and apply filters
    if (trimmedQuery.length === 0) {
      let queryBuilder = supabase
        .from('articles')
        .select('id, title, slug, description, category, tags, author, date, read_time, content');

      if (category) {
        queryBuilder = queryBuilder.eq('category', category);
      }

      if (filteredTags.length > 0) {
        queryBuilder = queryBuilder.contains('tags', filteredTags);
      }

      // Order by date descending by default
      const { data, error } = await queryBuilder.order('date', { ascending: false });

      if (error) {
        console.error('Supabase query error (empty query):', error);
        return Response.json({ error: error.message }, { status: 500 });
      }

      // Map snake_case read_time to camelCase readTime to conform to frontend interface
      const mappedData = (data || []).map((article) => ({
        id: article.id,
        title: article.title,
        slug: article.slug,
        description: article.description,
        category: article.category,
        tags: article.tags,
        author: article.author,
        date: article.date,
        readTime: article.read_time,
        content: article.content,
      }));

      return Response.json(mappedData);
    }

    // Call OpenAI API to generate embedding for the query string
    const embeddingResponse = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: trimmedQuery,
    });

    const queryEmbedding = embeddingResponse.data[0].embedding;

    // Call Supabase match_articles RPC function
    const { data, error } = await supabase.rpc('match_articles', {
      query_embedding: queryEmbedding,
      match_threshold: 0.25, // prevents completely irrelevant results
      match_count: 50,
      filter_category: category || null,
      filter_tags: filteredTags.length > 0 ? filteredTags : null,
    });

    if (error) {
      console.error('Supabase RPC error:', error);
      return Response.json({ error: error.message }, { status: 500 });
    }

    // Map database snake_case fields and similarity score to match frontend types
    const mappedResults = (data || []).map((article: any) => ({
      id: article.id,
      title: article.title,
      slug: article.slug,
      description: article.description,
      category: article.category,
      tags: article.tags,
      author: article.author,
      date: article.date,
      readTime: article.read_time, // Map snake_case to camelCase
      content: article.content,
      similarityScore: article.similarity, // Map similarity to similarityScore
    }));

    return Response.json(mappedResults);
  } catch (error: any) {
    console.error('API Search route error:', error);
    return Response.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
