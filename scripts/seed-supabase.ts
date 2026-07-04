import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const openaiApiKey = process.env.OPENAI_API_KEY;

if (!supabaseUrl || !supabaseServiceKey || !openaiApiKey) {
  console.error('Error: Missing environment variables in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);
const openai = new OpenAI({ apiKey: openaiApiKey });

interface ArticleJSON {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  tags: string[];
  author: string;
  date: string;
  readTime: string;
  content: string;
}

async function seed() {
  try {
    console.log('Reading mock articles from public/mock-articles.json...');
    const rawData = fs.readFileSync(path.join(process.cwd(), 'public/mock-articles.json'), 'utf-8');
    const articles: ArticleJSON[] = JSON.parse(rawData);

    console.log(`Loaded ${articles.length} articles.`);

    console.log('Preparing text inputs for OpenAI embeddings...');
    const inputs = articles.map(article => {
      // Combine title, description, and content to capture maximum semantic context
      return `Title: ${article.title}\nDescription: ${article.description}\nContent: ${article.content}`;
    });

    console.log('Generating embeddings using text-embedding-3-small...');
    // Generate all 100 embeddings in a single batched OpenAI request
    const embeddingResponse = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: inputs,
    });

    console.log('Embeddings generated successfully. Mapping to database schema...');
    const databaseRows = articles.map((article, index) => {
      return {
        id: article.id,
        title: article.title,
        slug: article.slug,
        description: article.description,
        category: article.category,
        tags: article.tags,
        author: article.author,
        date: article.date,
        read_time: article.readTime, // Map camelCase JSON key to snake_case DB column
        content: article.content,
        embedding: embeddingResponse.data[index].embedding,
      };
    });

    console.log('Upserting rows into Supabase articles table...');
    // Batch upsert to Supabase
    const { error } = await supabase
      .from('articles')
      .upsert(databaseRows, { onConflict: 'id' });

    if (error) {
      throw error;
    }

    console.log('Database successfully seeded with 100 articles and vector embeddings!');
  } catch (error: any) {
    console.error('Error seeding database:', error.message || error);
    process.exit(1);
  }
}

seed();
