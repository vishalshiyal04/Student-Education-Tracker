import { NextRequest, NextResponse } from 'next/server';
import ZAI from 'z-ai-web-dev-sdk';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { image, type } = body;

    if (!image) {
      return NextResponse.json(
        { error: 'Image is required' },
        { status: 400 }
      );
    }

    const zai = await ZAI.create();

    let prompt = '';
    
    if (type === 'schedule') {
      prompt = `Analyze this class schedule screenshot and extract all course information in JSON format.

Return a JSON object with this structure:
{
  "courses": [
    {
      "name": "Course name",
      "instructor": "Instructor name",
      "location": "Classroom/location",
      "credits": number,
      "schedule": [
        {
          "dayOfWeek": number (0-6, where 0 is Sunday),
          "startTime": "HH:mm",
          "endTime": "HH:mm",
          "weekStart": number (optional),
          "weekEnd": number (optional)
        }
      ],
      "semester": "Semester name"
    }
  ]
}

Important:
- Extract all visible courses
- Convert day names to numbers (Sunday=0, Monday=1, etc.)
- Use 24-hour time format
- If week range is shown, include it
- If credits are not shown, assume 3

Return ONLY valid JSON, no other text.`;
    } else if (type === 'grades') {
      prompt = `Analyze this transcript/grade screenshot and extract all grade information in JSON format.

Return a JSON object with this structure:
{
  "grades": [
    {
      "courseName": "Course name",
      "credits": number,
      "score": number,
      "gradePoint": number (on 4.0 scale),
      "semester": "Semester name",
      "category": "required" | "electrical" | "general"
    }
  ]
}

Important:
- Extract all visible grades
- Convert scores to grade points: 90+=4.0, 85-89=3.7, 82-84=3.3, 78-81=3.0, 75-77=2.7, 72-74=2.3, 68-71=2.0, 64-67=1.5, 60-63=1.0, <60=0
- If category is not shown, use "required"
- Include all semesters visible

Return ONLY valid JSON, no other text.`;
    } else {
      prompt = `Analyze this academic screenshot and determine what type of information it contains.

If it's a class schedule, extract course information:
{
  "type": "schedule",
  "courses": [...]
}

If it's a grade/transcript, extract grade information:
{
  "type": "grades",
  "grades": [...]
}

If it's a credit summary:
{
  "type": "credits",
  "summary": {
    "total": number,
    "completed": number,
    "required": number,
    "elective": number,
    "general": number
  }
}

Return ONLY valid JSON.`;
    }

    const response = await zai.chat.completions.createVision({
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: prompt,
            },
            {
              type: 'image_url',
              image_url: {
                url: image,
              },
            },
          ],
        },
      ],
      thinking: { type: 'disabled' },
    });

    const content = response.choices[0]?.message?.content;

    if (!content) {
      return NextResponse.json(
        { error: 'Failed to analyze image' },
        { status: 500 }
      );
    }

    // Try to parse the JSON response
    try {
      // Extract JSON from the response (in case there's extra text)
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return NextResponse.json({
          success: true,
          data: parsed,
          rawText: content,
        });
      } else {
        return NextResponse.json({
          success: false,
          error: 'Could not extract valid data from image',
          rawText: content,
        });
      }
    } catch {
      return NextResponse.json({
        success: false,
        error: 'Failed to parse recognition result',
        rawText: content,
      });
    }
  } catch (error) {
    console.error('Recognition error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
