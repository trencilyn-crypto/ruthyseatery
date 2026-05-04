/**
 * This service simulates a Node.js/Express backend API.
 * In a real application, these methods would use fetch() or axios to call your Node.js server.
 */

const STORAGE_KEY = 'ruthy_backend_db';

export const backendService = {
  // Simulate GET /api/data
  getSiteData: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        resolve(saved ? JSON.parse(saved) : null);
      }, 500); // Simulate network latency
    });
  },

  // Simulate POST /api/data
  saveSiteData: async (data: any) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        resolve({ success: true, timestamp: new Date().toISOString() });
      }, 800);
    });
  },

  // Simulate Image Upload logic
  uploadImage: async (base64: string) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // In reality, this would be sent to Node.js and saved to a disk or cloud
        resolve({ url: base64 }); 
      }, 1000);
    });
  }
};
