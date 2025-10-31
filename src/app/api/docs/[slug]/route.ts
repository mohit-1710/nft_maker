import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    
    // Construct the file path to the markdown file
    const filePath = path.join(process.cwd(), 'public', 'docs', `${slug}.md`);
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return NextResponse.json(
        { error: 'Documentation not found', path: filePath },
        { status: 404 }
      );
    }
    
    // Read the markdown file
    const content = fs.readFileSync(filePath, 'utf-8');
    
    return NextResponse.json({ content }, { status: 200 });
  } catch (error) {
    console.error('Error reading documentation:', error);
    return NextResponse.json(
      { 
        error: 'Failed to read documentation', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}
