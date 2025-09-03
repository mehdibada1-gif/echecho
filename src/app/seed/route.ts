
'use server';

import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, doc, setDoc, Timestamp } from 'firebase/firestore';
import { mockUsers, mockEvents, mockBlogs, mockOrganizations } from '@/lib/mock-data';

export async function GET() {
  try {
    // Seed users
    for (const user of mockUsers) {
      const userRef = doc(db, 'users', user.id);
      // We don't want to insert the id field into the document
      const { id, ...userData } = user;
      await setDoc(userRef, userData);
    }

    // Seed events
    for (const event of mockEvents) {
      const eventRef = doc(db, 'events', event.id);
      const { id, date, endDate, ...eventData } = event;
      await setDoc(eventRef, {
        ...eventData,
        date: Timestamp.fromDate(date as Date),
        endDate: Timestamp.fromDate(endDate as Date),
      });
    }

    // Seed blogs
    for (const blog of mockBlogs) {
      const blogRef = doc(db, 'blogs', blog.id);
      const { id, date, ...blogData } = blog;
      await setDoc(blogRef, {
        ...blogData,
        date: Timestamp.fromDate(date as Date),
      });
    }
    
    // Seed organizations
    for (const org of mockOrganizations) {
        const orgRef = doc(db, 'organizations', org.id);
        const { id, ...orgData } = org;
        await setDoc(orgRef, orgData);
    }

    return NextResponse.json({
      message: 'Database seeded successfully!',
      seeded: {
        users: mockUsers.length,
        events: mockEvents.length,
        blogs: mockBlogs.length,
        organizations: mockOrganizations.length,
      },
    });
  } catch (error: any) {
    console.error('Error seeding database:', error);
    return NextResponse.json(
      { message: 'Error seeding database', error: error.message },
      { status: 500 }
    );
  }
}
