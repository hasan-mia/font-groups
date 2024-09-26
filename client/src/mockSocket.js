import dummyData from './data.json';

class MockSocket {
  constructor() {
    this.listeners = {};
    this.dummyData = dummyData;
  }

  on(event, callback) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }

  emit(event, data) {
    console.log(`Emitted ${event}:`, data);
    
    switch (event) {
      case 'user:initiate':
      case 'user:agentJoin':
        this.simulateRoomCreation(data);
        break;
      case 'user:call':
        this.simulateIncomingCall(data);
        break;
      case 'call:accept':
        this.simulateCallAccepted(data);
        break;
      case 'call:reject':
        this.simulateCallRejected(data);
        break;
      case 'call:end':
        this.simulateCallEnded(data);
        break;
      default:
        break;
    }
  }

  simulateRoomCreation(data) {
    const room = {
      roomId: `room-${Date.now()}`,
      email: data.email
    };
    this.triggerEvent('room:created', room);
  }

  simulateIncomingCall(data) {
    const call = {
      from: data.to,
      offer: data.offer,
      room: data.room,
      customerEmail: data.customerEmail
    };
    this.triggerEvent('incoming:call', call);
  }

  simulateCallAccepted(data) {
    this.triggerEvent('call:accepted', { answer: data.answer });
  }

  simulateCallRejected(data) {
    this.triggerEvent('call:rejected', {});
  }

  simulateCallEnded(data) {
    this.triggerEvent('call:ended', {});
  }

  triggerEvent(event, data) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(callback => callback(data));
    }
  }

  off(event) {
    delete this.listeners[event];
  }
}

const mockSocketInstance = new MockSocket();

export default mockSocketInstance;