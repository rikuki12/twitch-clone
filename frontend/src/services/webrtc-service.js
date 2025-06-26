import { db } from '../firebase-config';
import { 
  collection, 
  doc, 
  addDoc, 
  getDoc, 
  onSnapshot, 
  updateDoc,
  deleteDoc,
  deleteField 
} from 'firebase/firestore';

// WebRTC Configuration
const configuration = {
  iceServers: [
    {
      urls: [
        'stun:stun1.l.google.com:19302',
        'stun:stun2.l.google.com:19302',
      ],
    },
  ],
  iceCandidatePoolSize: 10,
};

class WebRTCService {
  constructor() {
    this.peerConnection = null;
    this.localStream = null;
    this.remoteStream = null;
    this.roomId = null;
    this.isStreamer = false;
    this.onStreamUpdate = null;
    this.onViewerCountUpdate = null;
  }

  // Initialize local media (for streamers)
  async initializeLocalMedia(constraints = { video: true, audio: true }) {
    try {
      this.localStream = await navigator.mediaDevices.getUserMedia(constraints);
      return this.localStream;
    } catch (error) {
      console.error('Error accessing media devices:', error);
      throw error;
    }
  }

  // Create a new streaming room (for streamers)
  async createRoom() {
    try {
      if (!this.localStream) {
        throw new Error('Local stream not initialized. Call initializeLocalMedia first.');
      }

      const roomsRef = collection(db, 'rooms');
      const roomDocRef = await addDoc(roomsRef, {
        created: new Date(),
        streamer: true,
        viewers: 0
      });

      this.roomId = roomDocRef.id;
      this.isStreamer = true;

      // Create peer connection
      this.peerConnection = new RTCPeerConnection(configuration);
      this.registerPeerConnectionListeners();

      // Add local stream tracks
      this.localStream.getTracks().forEach(track => {
        this.peerConnection.addTrack(track, this.localStream);
      });

      // Create offer
      const offer = await this.peerConnection.createOffer();
      await this.peerConnection.setLocalDescription(offer);

      // Save offer to Firestore
      await updateDoc(roomDocRef, {
        offer: {
          type: offer.type,
          sdp: offer.sdp,
        },
      });

      // Listen for remote answer
      this.listenForAnswer();
      
      // Listen for viewer count updates
      this.listenForViewerUpdates();

      console.log('Room created with ID:', this.roomId);
      return this.roomId;
    } catch (error) {
      console.error('Error creating room:', error);
      throw error;
    }
  }

  // Join an existing streaming room (for viewers)
  async joinRoom(roomId) {
    try {
      this.roomId = roomId;
      this.isStreamer = false;

      const roomDocRef = doc(db, 'rooms', roomId);
      const roomSnapshot = await getDoc(roomDocRef);

      if (!roomSnapshot.exists()) {
        throw new Error('Room not found');
      }

      const roomData = roomSnapshot.data();
      
      // Create peer connection
      this.peerConnection = new RTCPeerConnection(configuration);
      this.registerPeerConnectionListeners();

      // Set up remote stream
      this.remoteStream = new MediaStream();
      
      this.peerConnection.addEventListener('track', event => {
        event.streams[0].getTracks().forEach(track => {
          this.remoteStream.addTrack(track);
        });
        
        if (this.onStreamUpdate) {
          this.onStreamUpdate(this.remoteStream);
        }
      });

      // Set remote description from offer
      if (roomData.offer) {
        await this.peerConnection.setRemoteDescription(roomData.offer);

        // Create answer
        const answer = await this.peerConnection.createAnswer();
        await this.peerConnection.setLocalDescription(answer);

        // Save answer to Firestore
        await updateDoc(roomDocRef, {
          answer: {
            type: answer.type,
            sdp: answer.sdp,
          },
        });
      }

      // Update viewer count
      await updateDoc(roomDocRef, {
        viewers: (roomData.viewers || 0) + 1
      });

      // Listen for ICE candidates
      this.listenForICECandidates();

      console.log('Joined room:', roomId);
      return this.remoteStream;
    } catch (error) {
      console.error('Error joining room:', error);
      throw error;
    }
  }

  // Listen for remote answer (for streamers)
  listenForAnswer() {
    const roomDocRef = doc(db, 'rooms', this.roomId);
    
    onSnapshot(roomDocRef, async (snapshot) => {
      const data = snapshot.data();
      
      if (data?.answer && !this.peerConnection.currentRemoteDescription) {
        const answer = new RTCSessionDescription(data.answer);
        await this.peerConnection.setRemoteDescription(answer);
      }
    });
  }

  // Listen for ICE candidates
  listenForICECandidates() {
    const candidatesCollection = collection(db, 'rooms', this.roomId, 'candidates');
    
    onSnapshot(candidatesCollection, (snapshot) => {
      snapshot.docChanges().forEach(async (change) => {
        if (change.type === 'added') {
          const data = change.doc.data();
          await this.peerConnection.addIceCandidate(new RTCIceCandidate(data));
        }
      });
    });
  }

  // Listen for viewer count updates
  listenForViewerUpdates() {
    const roomDocRef = doc(db, 'rooms', this.roomId);
    
    onSnapshot(roomDocRef, (snapshot) => {
      const data = snapshot.data();
      if (data?.viewers && this.onViewerCountUpdate) {
        this.onViewerCountUpdate(data.viewers);
      }
    });
  }

  // Register peer connection event listeners
  registerPeerConnectionListeners() {
    this.peerConnection.addEventListener('icegatheringstatechange', () => {
      console.log('ICE gathering state changed:', this.peerConnection.iceGatheringState);
    });

    this.peerConnection.addEventListener('connectionstatechange', () => {
      console.log('Connection state changed:', this.peerConnection.connectionState);
    });

    this.peerConnection.addEventListener('signalingstatechange', () => {
      console.log('Signaling state changed:', this.peerConnection.signalingState);
    });

    this.peerConnection.addEventListener('icecandidate', async (event) => {
      if (event.candidate) {
        const candidatesCollection = collection(db, 'rooms', this.roomId, 'candidates');
        await addDoc(candidatesCollection, event.candidate.toJSON());
      }
    });
  }

  // Stop streaming and cleanup
  async stopStream() {
    try {
      // Stop local stream tracks
      if (this.localStream) {
        this.localStream.getTracks().forEach(track => track.stop());
        this.localStream = null;
      }

      // Close peer connection
      if (this.peerConnection) {
        this.peerConnection.close();
        this.peerConnection = null;
      }

      // Clean up room if streamer
      if (this.isStreamer && this.roomId) {
        const roomDocRef = doc(db, 'rooms', this.roomId);
        await deleteDoc(roomDocRef);
      } else if (this.roomId) {
        // Decrease viewer count if viewer
        const roomDocRef = doc(db, 'rooms', this.roomId);
        const roomSnapshot = await getDoc(roomDocRef);
        if (roomSnapshot.exists()) {
          const currentViewers = roomSnapshot.data().viewers || 0;
          await updateDoc(roomDocRef, {
            viewers: Math.max(0, currentViewers - 1)
          });
        }
      }

      this.roomId = null;
      this.isStreamer = false;
      this.remoteStream = null;

      console.log('Stream stopped and cleaned up');
    } catch (error) {
      console.error('Error stopping stream:', error);
    }
  }

  // Get current room ID
  getRoomId() {
    return this.roomId;
  }

  // Check if currently streaming
  isCurrentlyStreaming() {
    return this.isStreamer && this.roomId && this.peerConnection;
  }

  // Check if currently viewing
  isCurrentlyViewing() {
    return !this.isStreamer && this.roomId && this.peerConnection;
  }

  // Set stream update callback
  setOnStreamUpdate(callback) {
    this.onStreamUpdate = callback;
  }

  // Set viewer count update callback
  setOnViewerCountUpdate(callback) {
    this.onViewerCountUpdate = callback;
  }
}

export default new WebRTCService();