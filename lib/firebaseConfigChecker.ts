// lib/firebaseConfigChecker.ts
// Use this script to verify your Firebase configuration

export const checkFirebaseConfig = () => {
  console.log('🔍 Checking Firebase Configuration...');
  
  const config = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  };

  console.log('📋 Environment Variables:');
  Object.entries(config).forEach(([key, value]) => {
    if (!value) {
      console.error(`❌ ${key}: MISSING`);
    } else {
      console.log(`✅ ${key}: ${value.substring(0, 20)}...`);
    }
  });

  // Validation checks
  const checks = [
    {
      name: 'API Key format',
      test: config.apiKey?.startsWith('AIza'),
      fix: 'API key should start with "AIza"'
    },
    {
      name: 'Auth Domain format',
      test: config.authDomain?.endsWith('.firebaseapp.com'),
      fix: 'Auth domain should end with ".firebaseapp.com"'
    },
    {
      name: 'Project ID format',
      test: config.projectId && config.projectId.length > 0,
      fix: 'Project ID should not be empty'
    },
    {
      name: 'Storage Bucket format',
      // Accept both old and new Firebase bucket formats
      test: config.storageBucket?.endsWith('.appspot.com') || config.storageBucket?.endsWith('.firebasestorage.app'),
      fix: 'Storage bucket should end with ".appspot.com" or ".firebasestorage.app"'
    },
    {
      name: 'Messaging Sender ID format',
      test: config.messagingSenderId && /^\d+$/.test(config.messagingSenderId),
      fix: 'Messaging sender ID should be numbers only'
    },
    {
      name: 'App ID format',
      test: config.appId?.includes(':web:'),
      fix: 'App ID should contain ":web:"'
    }
  ];

  console.log('\n🧪 Configuration Tests:');
  checks.forEach(check => {
    if (check.test) {
      console.log(`✅ ${check.name}: PASS`);
    } else {
      console.error(`❌ ${check.name}: FAIL - ${check.fix}`);
    }
  });

  return checks.every(check => check.test);
};

// Call this in your component to debug
export const debugFirebaseConnection = async () => {
  try {
    const isValidConfig = checkFirebaseConfig();
    
    if (!isValidConfig) {
      console.error('❌ Firebase configuration is invalid');
      return false;
    }

    // Test Firebase connection
    const { auth } = await import('@/lib/firebase');
    console.log('🔥 Firebase Auth instance:', auth.app.options);
    
    return true;
  } catch (error) {
    console.error('🚨 Firebase connection error:', error);
    return false;
  }
};
