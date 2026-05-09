export interface User {
  id: string;
  username: string;
  role: 'supervisor' | 'ejecutivo';
}

export interface Case {
  id: string;
  name: string;
  type: string;
  content: string;
}
