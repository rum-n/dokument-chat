import { initQdrant } from './services/database';

let initialized = false;

export async function initializeServices(): Promise<void> {
  if (initialized) return;

  try {
    console.log('Initializing services...');
    await initQdrant();
    initialized = true;
    console.log('Services initialized successfully');
  } catch (error) {
    console.error('Failed to initialize services:', error);
    throw error;
  }
}
