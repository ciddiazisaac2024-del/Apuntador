import fs from 'fs';
import path from 'path';

const auditLogPath = path.join(__dirname, '../../audit.log');

interface AuditEvent {
  userId?: string;
  action: string;
  details?: any;
  ip?: string;
  timestamp: string;
}

export const logAction = (data: Omit<AuditEvent, 'timestamp'>) => {
  const event: AuditEvent = {
    ...data,
    timestamp: new Date().toISOString(),
  };

  const logLine = JSON.stringify(event) + '\n';

  fs.appendFile(auditLogPath, logLine, (err) => {
    if (err) {
      console.error('Failed to write to audit log:', err);
    }
  });
};
