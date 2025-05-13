import { NextResponse } from 'next/server';
import { adminDb } from '../../../lib/firebase-admin';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { callSummary, userUID } = body;

    if (!callSummary || !userUID) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    // Add logging to track the save operation
    console.log('Attempting to save call memory for user:', userUID);

    // Save to Firestore with explicit typing
    const docRef = await adminDb.collection('callmemory').add({
      userId: userUID,
      summary: callSummary,
      timestamp: new Date().toISOString(),
      created_at: new Date().toISOString(),
    });

    console.log('Successfully saved call memory with ID:', docRef.id);

    return NextResponse.json({ 
      success: true, 
      memoryId: docRef.id,
      message: 'Call memory saved successfully' 
    });
  } catch (error) {
    console.error('Error saving to Firestore:', error);
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
        details: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}