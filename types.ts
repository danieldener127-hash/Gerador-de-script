
export enum MemoryType {
  DWORD = 'gg.TYPE_DWORD',
  FLOAT = 'gg.TYPE_FLOAT',
  DOUBLE = 'gg.TYPE_DOUBLE',
  WORD = 'gg.TYPE_WORD',
  BYTE = 'gg.TYPE_BYTE',
  QWORD = 'gg.TYPE_QWORD',
  XOR = 'gg.TYPE_XOR'
}

export interface ScriptFeature {
  id: string;
  name: string;
  search: string;
  replace: string;
  type: MemoryType;
}

export interface ScriptConfig {
  title: string;
  version: string;
  author: string;
  features: ScriptFeature[];
}
