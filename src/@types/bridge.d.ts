export interface InvokeInput  {
  event?: string;
  action?: string;
  args?: any[];
  fail?: (err: any) => void;
  compute?: (err: any) => void;
  success?: (res: any) => void;
  [key: string]: any;
};

export interface InvokeResult  {
  success?: boolean;
  message?: string;
  action?: string;
  event?: string;
  args?: any[];
  result?: any;
  [key: string]: any;
}
