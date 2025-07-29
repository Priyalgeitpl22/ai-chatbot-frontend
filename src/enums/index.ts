export enum ThreadType {
  UNASSIGNED = "unassigned",
  ASSIGNED = "assigned",
  OPEN = "open",
  CHAT = "chat",
  BOTS = "bots",
  TRASH= "trash",
  COMPLETED = "completed"
}

export enum ThreadStatus{
  ACTIVE="active",
  ENDED="ended"
}

export enum Priority {
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low'
}


export enum DropDownPurpose {
  Task="task",
  Thread="thread"
}