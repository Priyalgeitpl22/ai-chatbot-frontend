export const formatTimestamp = (createdAt: string): string => {
    const messageTime = new Date(createdAt);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);

    if (messageTime >= today) {
      return messageTime.toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit', 
        hour12: true 
      });
    } else if (messageTime >= yesterday && messageTime < today) {
      return "Yesterday";
    } else {
      return messageTime.toLocaleDateString([], { 
        day: '2-digit', 
        month: 'short', 
        year: 'numeric' 
      });
    }
  };