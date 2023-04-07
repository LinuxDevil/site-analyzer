import { Toast } from "primereact/toast";
import { RefObject } from "react";

export type ToastType = 'success' | 'info' | 'warn' | 'error' | undefined;

export const show = (toast: RefObject<Toast>, severity: ToastType, summary: string = 'Website Anaylized', detail: string = 'Please wait') => {
    toast.current && toast.current.show({ severity, summary, detail });
};
